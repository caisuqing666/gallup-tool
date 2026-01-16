import { NextRequest, NextResponse } from 'next/server';
import { generateResult } from '@/lib/ai-generate';
import { ScenarioId } from '@/lib/scenarios';
import { StrengthId } from '@/lib/gallup-strengths';
import { ProblemType, isValidProblemFocus } from '@/lib/types';
import { parseConfusion, ProblemType as ConfusionProblemType } from '@/lib/confusion-parser';

function normalizeProblemFocus(focus: string): string {
  const trimmed = focus.trim();
  if (!trimmed) return '';
  const hasQuestionWord = /如何|怎么|怎样|是否|能不能|应该|要不要/i.test(trimmed);
  let normalized = hasQuestionWord ? trimmed : `如何${trimmed}`;
  if (!/[？?]$/.test(normalized)) {
    normalized += '？';
  }
  if (normalized.length < 10) {
    normalized = `在当前情境下，${normalized.replace(/[？?]$/, '')}？`;
  }
  return normalized;
}

interface GenerateRequest {
  scenario?: unknown;
  strengths?: unknown;
  confusion?: unknown;
  problemType?: unknown;
  problemFocus?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { scenario, strengths, confusion, problemType, problemFocus } = body;

    // 验证场景
    if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
      return NextResponse.json(
        { error: '场景 ID 是必需的' },
        { status: 400 }
      );
    }

    // 验证优势
    if (!strengths || !Array.isArray(strengths)) {
      return NextResponse.json(
        { error: 'strengths 必须是一个数组' },
        { status: 400 }
      );
    }

    if (strengths.length < 3 || strengths.length > 5) {
      return NextResponse.json(
        { error: '请选择 3-5 个优势' },
        { status: 400 }
      );
    }

    // 验证困惑描述
    if (!confusion || typeof confusion !== 'string' || !confusion.trim()) {
      return NextResponse.json(
        { error: '请输入你的困惑' },
        { status: 400 }
      );
    }

    // ═══════════════════════════════════════════════════════════
    // 解析困惑，自动提取 problemType 和 problemFocus
    // ═══════════════════════════════════════════════════════════
    let parsedProblem;
    try {
      parsedProblem = parseConfusion(confusion.toString().trim());
      console.info('✓ 已解析问题类型:', {
        problemType: parsedProblem.problemType,
        problemFocus: parsedProblem.problemFocus,
        confidence: parsedProblem.problemTypeConfidence,
      });
    } catch (error) {
      console.warn('困惑解析失败，使用默认值:', error);
      parsedProblem = {
        problemType: ConfusionProblemType.Unknown,
        problemFocus: '要不要改变现状',
        problemTypeConfidence: 0,
        raw: confusion.toString().trim(),
        desiredOutcome: null,
        hiddenCost: null,
        keyPhrases: [],
        matchedKeywords: [],
      };
    }

    /**
     * 映射 confusion-parser 的 ProblemType 到 types.ts 的 ProblemType
     *
     * confusion-parser.ts          →  types.ts
     * ──────────────────────────────────────────────
     * Direction                    →  DIRECTION_UNCERTAINTY (P1)
     * BoundaryOverload             →  BOUNDARY_OVERLOAD (P2)
     * DecisionParalysis            →  INFORMATION_PARALYSIS (P3)
     * PriorityFocus                →  EFFICIENCY_BOTTLENECK (P4)
     * RoleMisalignment             →  BOUNDARY_OVERLOAD (P2)
     * RelationshipExit             →  DIRECTION_UNCERTAINTY (P1)
     * Unknown                      →  DIRECTION_UNCERTAINTY (P1)
     */
    function mapProblemType(confusionType: ConfusionProblemType): ProblemType {
      const typeMap: Record<ConfusionProblemType, ProblemType> = {
        [ConfusionProblemType.Direction]: ProblemType.DIRECTION_UNCERTAINTY,
        [ConfusionProblemType.BoundaryOverload]: ProblemType.BOUNDARY_OVERLOAD,
        [ConfusionProblemType.DecisionParalysis]: ProblemType.INFORMATION_PARALYSIS,
        [ConfusionProblemType.PriorityFocus]: ProblemType.EFFICIENCY_BOTTLENECK,
        [ConfusionProblemType.RoleMisalignment]: ProblemType.BOUNDARY_OVERLOAD,
        [ConfusionProblemType.RelationshipExit]: ProblemType.DIRECTION_UNCERTAINTY,
        [ConfusionProblemType.Unknown]: ProblemType.DIRECTION_UNCERTAINTY,
      };
      return typeMap[confusionType] || ProblemType.DIRECTION_UNCERTAINTY;
    }

    // 使用解析后的值（如果请求未提供，则使用解析值）
    const finalProblemType = problemType || mapProblemType(parsedProblem.problemType);
    const finalProblemFocus = typeof (problemFocus || parsedProblem.problemFocus) === 'string'
      ? normalizeProblemFocus((problemFocus || parsedProblem.problemFocus) as string)
      : '';

    // 验证问题类型（系统级硬约束）
    const validProblemTypes = Object.values(ProblemType);
    if (!finalProblemType || typeof finalProblemType !== 'string' || !validProblemTypes.includes(finalProblemType as ProblemType)) {
      return NextResponse.json(
        { error: `无法解析问题类型，请提供更详细的困惑描述` },
        { status: 400 }
      );
    }

    // 验证问题焦点（系统级硬约束 - Decide 双重锁定）
    if (!finalProblemFocus || !isValidProblemFocus(finalProblemFocus)) {
      return NextResponse.json(
        {
          error: '无法解析问题焦点，请提供更详细的困惑描述',
          details: '有效的 problemFocus 应该是一个问句或包含"如何/怎么/是否"等疑问词'
        },
        { status: 400 }
      );
    }

    // 生成结果（使用新的解释页 + 判定页分离结构）
    const result = await generateResult(
      scenario as ScenarioId,
      strengths as StrengthId[],
      confusion.toString().trim(),
      finalProblemType as ProblemType,
      finalProblemFocus as string,
      true // 使用 AI
    );

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error in generate route:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '请求体格式错误' },
        { status: 400 }
      );
    }

    // 返回具体错误信息（如果有）
    const errorMessage = error instanceof Error ? error.message : '生成方案时发生错误';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
