import { NextRequest, NextResponse } from 'next/server';
import { executePipeline } from '@/lib/pipeline';
import type { PipelineConfig } from '@/lib/pipeline';

interface GenerateRequest {
  scenario?: unknown;
  strengths?: unknown;
  confusion?: unknown;
  reportText?: string;
}

function generateGallupReportText(
  scenario: string,
  strengths: string[],
  confusion: string
): string {
  const date = new Date().toLocaleDateString('zh-CN');
  
  return `# CliftonStrengths 优势报告

生成日期：${date}

## 执行摘要

感谢您完成 CliftonStrengths 评估。根据您的回答，我们为您识别出了最突出的优势主题。

## 您的五大优势主题

${strengths.map((s, i) => `### ${i + 1}. ${s}
这个主题在您的回答中表现出最强的模式。`).join('\n\n')}

## 主题详细描述

${strengths.map(s => `**${s}**
${s}让您能够显著影响他人。您能够在推动变革、鼓舞士气、以及激励团队方面发挥关键作用。这种优势使您在需要动员和影响他人的情境中表现出色。`).join('\n\n')}

## 当前场景分析

**场景：** ${scenario}

**您的困惑：** ${confusion}

在当前情况下，您的${strengths.slice(0, 2).join('和')}优势可能会产生相互作用。了解这种动态有助于您更好地应对挑战。

## 行动建议

基于您的优势组合，我们建议：

**继续做的事情：**
- 充分利用您的${strengths[0]}优势
- 在需要${strengths[0]}的情境中主动发挥作用
- 与能够互补您优势的人合作

**开始做的事情：**
- 尝试在新的领域应用您的${strengths[1] || strengths[0]}优势
- 寻找能够发挥您全部优势组合的机会
- 定期反思您的优势使用情况

**停止做的事情：**
- 过度依赖单一优势
- 在不适合的情境中强行使用优势
- 忽视优势带来的盲点

## 发展建议

为了让您的优势得到最大程度的发挥，我们建议您持续关注优势的应用和发展。定期回顾这份报告，思考如何在不同情境中更好地运用您的天赋。

---

*这份报告是基于您的回答生成的。您的优势是相对稳定的，但如何运用它们会随着时间和经验而发展。*
`;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { scenario, strengths, confusion, reportText } = body;

    if (reportText && typeof reportText === 'string' && reportText.trim()) {
      return await handlePipelineRequest(reportText.trim());
    }

    if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
      return NextResponse.json(
        { error: '场景 ID 是必需的' },
        { status: 400 }
      );
    }

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

    if (!confusion || typeof confusion !== 'string' || !confusion.trim()) {
      return NextResponse.json(
        { error: '请输入你的困惑' },
        { status: 400 }
      );
    }

    const generatedReport = generateGallupReportText(
      scenario.toString(),
      strengths as string[],
      confusion.toString().trim()
    );

    return await handlePipelineRequest(generatedReport);

  } catch (error) {
    console.error('Error in generate route:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '请求体格式错误' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '生成方案时发生错误' },
      { status: 500 }
    );
  }
}

async function handlePipelineRequest(reportText: string) {
  const aiEnabled = process.env.ENABLE_AI === 'true' || 
                    process.env.NEXT_PUBLIC_ENABLE_AI === 'true';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const provider = process.env.AI_PROVIDER || 'anthropic';
  
  const hasValidKey = (provider === 'anthropic' && anthropicKey?.startsWith('sk-')) ||
                      (provider === 'openai' && openaiKey?.startsWith('sk-'));
  
  const preset = (aiEnabled && hasValidKey) ? 'balanced' : 'fast';
  
  const config: PipelineConfig = {
    stage1: {
      max_chunk_size: 800,
      overlap_size: 100,
    },
    stage2: {
      provider: { provider: 'mock', model: 'mock' },
    },
    stage3: {
      provider: { provider: 'mock', model: 'mock' },
    },
    stage4: {
      provider: { provider: 'mock', model: 'mock' },
      tone: { style: 'professional', detail_level: 'balanced', language: 'zh-CN' },
    },
    retry_config: {
      max_retries: 3,
      base_delay_ms: 1000,
    },
  };

  if (preset !== 'fast') {
    if (provider === 'anthropic' && anthropicKey) {
      config.stage2.provider = { provider: 'anthropic', model: 'claude-3-haiku-20240307', apiKey: anthropicKey };
      config.stage3.provider = { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', apiKey: anthropicKey };
      config.stage4.provider = { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', apiKey: anthropicKey };
    } else if (provider === 'openai' && openaiKey) {
      config.stage2.provider = { provider: 'openai', model: 'gpt-4o-mini', apiKey: openaiKey };
      config.stage3.provider = { provider: 'openai', model: 'gpt-4o-mini', apiKey: openaiKey };
      config.stage4.provider = { provider: 'openai', model: 'gpt-4o', apiKey: openaiKey };
    }
  }

  const result = await executePipeline(
    { fullText: reportText },
    config,
    (progress) => {
      console.log(`[Progress] Stage ${progress.stage}: ${progress.current}/${progress.total} - ${progress.message}`);
    }
  );

  return NextResponse.json({
    success: true,
    data: result.stage4,
    metadata: {
      pipeline: result.metadata,
      diagnosis: {
        profile_summary: result.stage3.profile_summary,
        top_strengths: result.stage3.top_strengths,
        current_pattern: result.stage3.current_pattern,
      },
      mode: preset,
    },
  });
}
