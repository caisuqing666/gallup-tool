import { NextRequest, NextResponse } from 'next/server';
import { generateMockResult } from '@/lib/mock-data';
import { ResultData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, strengths, confusion } = body;

    // 验证输入
    if (!strengths || !Array.isArray(strengths) || strengths.length < 3) {
      return NextResponse.json(
        { error: '请至少选择 3 个优势' },
        { status: 400 }
      );
    }

    if (!confusion || typeof confusion !== 'string' || !confusion.trim()) {
      return NextResponse.json(
        { error: '请输入你的困惑' },
        { status: 400 }
      );
    }

    // Phase A: 使用 Mock 数据
    // Phase B: 这里将接入 AI API
    const result: ResultData = generateMockResult(scenario || '', strengths, confusion);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: '生成方案时发生错误' },
      { status: 500 }
    );
  }
}
