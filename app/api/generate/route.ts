import { NextRequest, NextResponse } from 'next/server';
import { generateResult } from '@/lib/ai-generate';
import { ScenarioId } from '@/lib/scenarios';
import { StrengthId } from '@/lib/gallup-strengths';

interface GenerateRequest {
  scenario?: unknown;
  strengths?: unknown;
  confusion?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { scenario, strengths, confusion } = body;

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

    // 生成结果（使用新的解释页 + 判定页分离结构）
    const result = await generateResult(
      scenario as ScenarioId,
      strengths as StrengthId[],
      confusion.toString().trim(),
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
