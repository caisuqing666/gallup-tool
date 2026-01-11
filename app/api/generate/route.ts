import { NextRequest, NextResponse } from 'next/server';
import { ResultData } from '@/lib/types';
import { isValidScenarioId, VALID_SCENARIO_IDS, type ScenarioId } from '@/lib/scenarios';
import { isValidStrengthId, VALID_STRENGTH_IDS, type StrengthId } from '@/lib/gallup-strengths';
import { generateResult } from '@/lib/ai-generate';

// 请求体类型定义（用于类型安全）
interface GenerateRequest {
  scenario?: unknown;
  strengths?: unknown;
  confusion?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { scenario, strengths, confusion } = body;

    // 1. 校验 scenario 有效性（必须提供且有效）
    if (scenario === undefined || scenario === null || scenario === '') {
      return NextResponse.json(
        { error: '场景 ID 是必需的。有效的场景 ID: ' + VALID_SCENARIO_IDS.join(', ') },
        { status: 400 }
      );
    }

    if (!isValidScenarioId(scenario)) {
      return NextResponse.json(
        { 
          error: `无效的场景 ID: ${scenario}。有效的场景 ID: ${VALID_SCENARIO_IDS.join(', ')}`,
          validScenarios: VALID_SCENARIO_IDS 
        },
        { status: 400 }
      );
    }

    // 2. 校验 strengths 数组
    if (!strengths || !Array.isArray(strengths)) {
      return NextResponse.json(
        { error: 'strengths 必须是一个数组' },
        { status: 400 }
      );
    }

    // 3. 校验 strengths 数量
    if (strengths.length < 3) {
      return NextResponse.json(
        { error: '请至少选择 3 个优势' },
        { status: 400 }
      );
    }

    if (strengths.length > 5) {
      return NextResponse.json(
        { error: '最多只能选择 5 个优势' },
        { status: 400 }
      );
    }

    // 4. 校验 strengths 是否都属于 ALL_STRENGTHS（使用类型守卫函数）
    const invalidStrengths: unknown[] = [];
    const validStrengths: StrengthId[] = [];

    for (const strength of strengths) {
      if (isValidStrengthId(strength)) {
        validStrengths.push(strength);
      } else {
        invalidStrengths.push(strength);
      }
    }

    if (invalidStrengths.length > 0) {
      return NextResponse.json(
        { 
          error: `无效的优势 ID: ${invalidStrengths.join(', ')}。请确保所有优势 ID 都来自有效的盖洛普优势列表`,
          invalidStrengths,
          validStrengthCount: VALID_STRENGTH_IDS.length,
          hint: `共有 ${VALID_STRENGTH_IDS.length} 个有效的盖洛普优势`
        },
        { status: 400 }
      );
    }

    // 5. 校验 strengths 是否有重复
    const uniqueStrengths = new Set(strengths);
    if (uniqueStrengths.size !== strengths.length) {
      return NextResponse.json(
        { error: '优势列表中存在重复项' },
        { status: 400 }
      );
    }

    // 6. 校验 confusion 非空
    if (!confusion || typeof confusion !== 'string' || !confusion.trim()) {
      return NextResponse.json(
        { error: '请输入你的困惑' },
        { status: 400 }
      );
    }

    // 此时所有数据都已通过类型守卫校验，类型安全
    const validatedScenario: ScenarioId = scenario; // 已通过 isValidScenarioId 校验
    const validatedStrengths: StrengthId[] = validStrengths; // 已通过 isValidStrengthId 校验

    // ============================================
    // 统一的生成入口：通过 feature flag 切换 Mock 和 AI
    // ============================================
    // Feature Flag 控制：
    // - 环境变量：ENABLE_AI=true 或 NEXT_PUBLIC_ENABLE_AI=true 启用 AI
    // - 默认使用 Mock，保证稳定性和演示效果
    // 
    // Prompt 生成：
    // - AI 模式：使用 lib/prompts.ts 的 GALLUP_SYSTEM_PROMPT + buildUserPrompt 构建完整 Prompt
    // - Mock 模式：使用 lib/mock-data.ts 的规则判断生成结果
    // 
    // 切换逻辑：
    // - 如果 ENABLE_AI=true 且有 API Key，尝试 AI 生成
    // - AI 失败时自动回退到 Mock（确保稳定性）
    // - Mock 和 AI 使用相同的输入格式，可无缝切换
    // ============================================
    const result: ResultData = await generateResult(
      validatedScenario,
      validatedStrengths,
      confusion.trim()
    );

    // 返回结果
    // 注意：默认情况下 result 是 Mock 数据（因为 ENABLE_AI 默认为 false）
    // 前端会在 page.tsx 中根据 API 调用是否成功来判断是否为 Mock
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate route:', error);
    
    // 如果是 JSON 解析错误
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '请求体格式错误，请确保发送有效的 JSON 数据' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '生成方案时发生错误' },
      { status: 500 }
    );
  }
}
