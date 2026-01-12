// AI 生成服务（统一入口）
// 通过 feature flag 切换 Mock 和 AI 生成

import { ResultData } from './types';
import { ScenarioId, StrengthId } from './types';
import { GALLUP_SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import { generateMockResult } from './mock-data';
import { validateAndSanitizeDiagnosis } from './verdict-validator';

// Feature flag：控制是否使用 AI（默认为 false，使用 Mock）
export const ENABLE_AI = process.env.ENABLE_AI === 'true' || process.env.NEXT_PUBLIC_ENABLE_AI === 'true';

// AI API 配置（可根据实际使用的 AI 服务调整）
const AI_API_CONFIG = {
  // Claude API 配置
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  // OpenAI API 配置（备用）
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY || '',
  },
};

// 使用 Claude API 生成结果
async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<ResultData> {
  if (!AI_API_CONFIG.claude.apiKey) {
    throw new Error('ANTHROPIC_API_KEY 未配置');
  }

  const response = await fetch(AI_API_CONFIG.claude.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_CONFIG.claude.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_API_CONFIG.claude.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API 错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    // 解析 JSON 响应
    const rawResult = JSON.parse(content) as ResultData & { diagnosis_label?: string; verdict?: string; experience?: string; pivot?: string };
    
    // 验证并清理输出（确保符合判词库规则）
    return validateAndSanitizeDiagnosis(rawResult);
  } catch (e) {
    // 如果响应不是 JSON，尝试提取 JSON 部分
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const rawResult = JSON.parse(jsonMatch[0]) as ResultData;
      return validateAndSanitizeDiagnosis(rawResult);
    }
    throw new Error('AI 返回的响应格式不正确，无法解析 JSON');
  }
}

// 使用 OpenAI API 生成结果（备用）
async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<ResultData> {
  if (!AI_API_CONFIG.openai.apiKey) {
    throw new Error('OPENAI_API_KEY 未配置');
  }

  const response = await fetch(AI_API_CONFIG.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_CONFIG.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_API_CONFIG.openai.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' }, // 要求返回 JSON
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API 错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const rawResult = JSON.parse(content) as ResultData & { diagnosis_label?: string; verdict?: string; experience?: string; pivot?: string };
    
    // 验证并清理输出（确保符合判词库规则）
    return validateAndSanitizeDiagnosis(rawResult);
  } catch (e) {
    throw new Error('AI 返回的响应格式不正确，无法解析 JSON');
  }
}

// 统一的生成入口：根据 feature flag 选择 Mock 或 AI
export async function generateResult(
  scenario: ScenarioId,
  strengths: StrengthId[],
  confusion: string,
  useAI: boolean = ENABLE_AI
): Promise<ResultData> {
  // 如果启用 AI 且有 API Key，使用 AI 生成
  if (useAI) {
    try {
      const systemPrompt = GALLUP_SYSTEM_PROMPT;
      // 构建用户 Prompt（需要将 ID 转换为名称）
      const { ALL_STRENGTHS } = await import('./gallup-strengths');
      const { SCENARIOS } = await import('./scenarios');
      
      const strengthNames = strengths.map(id => {
        const strength = ALL_STRENGTHS.find(s => s.id === id);
        return strength?.name || id;
      });
      
      const scenarioTitle = SCENARIOS.find(s => s.id === scenario)?.title || scenario;
      
      const userPrompt = buildUserPrompt(strengthNames, scenarioTitle, confusion);

      // 优先使用 Claude（推荐），如果失败则尝试 OpenAI
      try {
        return await generateWithClaude(systemPrompt, userPrompt);
      } catch (claudeError) {
        console.warn('Claude API 调用失败，尝试使用 OpenAI:', claudeError);
        try {
          return await generateWithOpenAI(systemPrompt, userPrompt);
        } catch (openaiError) {
          // 两个 AI 都失败，回退到 Mock
          console.error('AI 生成失败，回退到 Mock:', openaiError);
          return generateMockResult(scenario, strengths, confusion);
        }
      }
    } catch (error) {
      // AI 生成失败时，回退到 Mock
      console.error('AI 生成失败，回退到 Mock:', error);
      return generateMockResult(scenario, strengths, confusion);
    }
  }

  // 使用 Mock 生成（默认）
  return generateMockResult(scenario, strengths, confusion);
}

// 导出 Prompt 构建函数（用于测试和调试）
export { GALLUP_SYSTEM_PROMPT, buildUserPrompt };
