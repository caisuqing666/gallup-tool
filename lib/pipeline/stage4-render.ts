/**
 * 阶段 4：最终渲染（高质量模型）
 * 将诊断 JSON 转换为页面可渲染的内容
 */

import type { Stage3Output, Stage4Output, RenderTone, PageSection } from './types';
import type { AIProviderConfig } from './types';

// ========== Prompt 模板 ==========

const STAGE4_SYSTEM_PROMPTS: Record<RenderTone['style'], string> = {
  professional: 'Professional coach tone. Output JSON only. Concise, authoritative.',
  conversational: 'Friendly coach tone. Output JSON only. Conversational, relatable.',
  direct: 'Direct action coach. Output JSON only. Brief, imperative sentences.',
  encouraging: 'Empowering coach. Output JSON only. Positive, uplifting.',
};

function buildStage4UserPrompt(
  diagnosis: Stage3Output,
  tone: RenderTone
): string {
  const detailLimit = {
    concise: 30,
    balanced: 60,
    detailed: 100,
  }[tone.detail_level];
  
  // 极简诊断摘要
  const summary = {
    profile: diagnosis.profile_summary.slice(0, 100),
    strengths: diagnosis.top_strengths.map(t => t.name).join(','),
    pattern: diagnosis.current_pattern.slice(0, 50),
    plans: diagnosis.leverage_plan.slice(0, 2),
    avoids: diagnosis.anti_pattern.slice(0, 2),
    habits: diagnosis.micro_habits_7d.slice(0, 3),
  };
  
  return `Diagnosis: ${JSON.stringify(summary)}
Tone: ${tone.style}, max ${detailLimit} chars/field

Output:
{
  "meta": {"generated_at": "ISO", "tone": ${JSON.stringify(tone)}, "word_count": 0},
  "sections": [
    {
      "type": "highlight",
      "content": {"title": "Title", "typewriter_texts": ["You are", "X"], "subtitle": "Subtitle"}
    },
    {
      "type": "diagnosis",
      "content": {
        "verdict_card": {"title": "Title", "verdict": "${summary.profile}", "confidence_level": "high"},
        "evidence_list": [{"claim": "From proof_points", "source_quote": "≤30char", "theme_badges": ["Theme"]}],
        "pivot_card": {"heading": "Heading", "content": "Content", "action_hint": "Hint"}
      }
    },
    {
      "type": "blindspot",
      "content": {"heading": "Blindspot", "anti_intuitive_statement": "Statement", "explanation": "Why", "watch_out_for": "When"}
    },
    {
      "type": "action_increase",
      "content": {"heading": "Increase", "core_conclusion": "Summary", "behaviors": [{"title": "Action", "description": "From leverage_plan", "target_theme": "Theme"}]}
    },
    {
      "type": "action_decrease",
      "content": {"heading": "Decrease", "behaviors": [{"title": "Avoid", "description": "From anti_pattern", "target_theme": "Theme"}]}
    },
    {
      "type": "micro_habits",
      "content": {"heading": "7-Day Micro Habits", "habits": ${JSON.stringify(diagnosis.micro_habits_7d)}}
    }
  ]
}

HARD STYLE CAP: No metaphors. No emotional reassurance. No teaching.`;
}

// ========== AI 调用 ==========

async function callAI(
  config: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<string> {
  const controller = new AbortController();
  const timeout = config.timeout || 60000;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    if (config.provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          max_tokens: 3000,
          temperature,
        }),
        signal: controller.signal,
      });
      
      if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
      const data = await response.json();
      return data.content[0].text;
    } else if (config.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 3000,
          temperature,
        }),
        signal: controller.signal,
      });
      
      if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      return mockAIResponse();
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

function mockAIResponse(defaultTone: RenderTone = { style: 'professional', detail_level: 'balanced', language: 'zh-CN' }): string {
  return JSON.stringify({
    meta: {
      generated_at: new Date().toISOString(),
      tone: defaultTone,
      word_count: 500,
    },
    sections: [
      {
        type: 'highlight',
        content: {
          title: '你的优势诊断',
          typewriter_texts: ['你是', '战略思维者'],
          subtitle: '发现你的核心优势',
        },
      },
      {
        type: 'diagnosis',
        content: {
          verdict_card: {
            title: '核心诊断',
            verdict: '你是以战略思维为核心的优势系统',
            confidence_level: 'high',
          },
          evidence_list: [],
          pivot_card: {
            heading: '关键转折',
            content: '需要平衡思考与行动',
            action_hint: '从思考转向执行',
          },
        },
      },
      {
        type: 'micro_habits',
        content: {
          heading: '7天微习惯',
          habits: [
            '第1天：设定30分钟信息收集上限',
            '第2天：凭直觉选择午餐，不纠结'
          ],
        },
      },
    ],
  });
}

// ========== 主函数 ==========

export async function stage4_render(
  diagnosis: Stage3Output,
  config: AIProviderConfig,
  tone: RenderTone,
  temperature?: number
): Promise<Stage4Output> {
  const systemPrompt = STAGE4_SYSTEM_PROMPTS[tone.style];
  const userPrompt = buildStage4UserPrompt(diagnosis, tone);
  
  const rawResponse = await callAI(config, systemPrompt, userPrompt, temperature);
  
  let parsed: Stage4Output;
  try {
    parsed = JSON.parse(rawResponse);
  } catch (e) {
    const match = rawResponse.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error(`Stage 4 parse failed: ${rawResponse.slice(0, 100)}`);
    }
  }
  
  if (!parsed.meta) {
    parsed.meta = {
      generated_at: new Date().toISOString(),
      tone,
      word_count: 0,
    };
  }
  if (!parsed.sections) {
    parsed.sections = [];
  }
  
  return parsed;
}
