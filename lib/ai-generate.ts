// AI 生成服务（统一入口）
// 通过 feature flag 切换 Mock 和 AI 生成

import { ResultData } from './types';
import { ScenarioId, StrengthId } from './types';
import { GALLUP_SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import { generateMockResult } from './mock-data';
import { validateAndSanitizeDiagnosis } from './verdict-validator';

// ========================================
// 环境变量配置
// ========================================

// Feature flag：控制是否使用 AI（默认为 false，使用 Mock）
export const ENABLE_AI = process.env.ENABLE_AI === 'true' || process.env.NEXT_PUBLIC_ENABLE_AI === 'true';

// AI 提供商选择（anthropic 或 openai）
const AI_PROVIDER = (process.env.AI_PROVIDER || 'anthropic') as 'anthropic' | 'openai';

// AI API 配置
const getAIConfig = () => {
  const provider = AI_PROVIDER;
  
  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY 未配置。请在 .env.local 中设置 ANTHROPIC_API_KEY，或设置 ENABLE_AI=false 使用 Mock 数据');
    }
    
    return {
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      apiKey,
      provider: 'anthropic' as const,
    };
  }
  
  // openai
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 未配置。请在 .env.local 中设置 OPENAI_API_KEY，或设置 ENABLE_AI=false 使用 Mock 数据');
  }
  
  return {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    apiKey,
    provider: 'openai' as const,
  };
};

// 获取超时配置
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '60000', 10);

// ========================================
// AI 生成函数
// ========================================

// 使用 Claude API 生成结果
async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<ResultData> {
  const config = getAIConfig();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API 错误 (${response.status}): ${error}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // 解析并验证响应
    return parseAIResponse(content);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`AI 请求超时（${API_TIMEOUT}ms），请稍后重试`);
    }
    throw error;
  }
}

// 使用 OpenAI API 生成结果（备用）
async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<ResultData> {
  const config = getAIConfig();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
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
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API 错误 (${response.status}): ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 解析并验证响应
    return parseAIResponse(content);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`AI 请求超时（${API_TIMEOUT}ms），请稍后重试`);
    }
    throw error;
  }
}

// 解析 AI 响应
function parseAIResponse(content: string): ResultData {
  try {
    // 尝试直接解析 JSON
    const rawResult = JSON.parse(content) as ResultData & {
      diagnosis_label?: string;
      verdict?: string;
      experience?: string;
      pivot?: string;
    };
    
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

// ========================================
// 统一的生成入口
// ========================================

/**
 * 生成盖洛普优势分析结果
 * @param scenario - 场景 ID
 * @param strengths - 优势 ID 列表
 * @param confusion - 用户困惑描述
 * @param useAI - 是否使用 AI（默认使用环境变量配置）
 * @returns 生成的结果数据
 */
export async function generateResult(
  scenario: ScenarioId,
  strengths: StrengthId[],
  confusion: string,
  useAI: boolean = ENABLE_AI
): Promise<ResultData> {
  // 如果未启用 AI，直接使用 Mock
  if (!useAI) {
    return generateMockResult(scenario, strengths, confusion);
  }

  // 检查 AI 配置
  let config: ReturnType<typeof getAIConfig>;
  try {
    config = getAIConfig();
  } catch (error) {
    console.warn('AI 配置错误，回退到 Mock:', error);
    return generateMockResult(scenario, strengths, confusion);
  }

  // AI 生成流程
  try {
    const systemPrompt = GALLUP_SYSTEM_PROMPT;
    
    // 动态导入（减少初始包大小）
    const { ALL_STRENGTHS } = await import('./gallup-strengths');
    const { SCENARIOS } = await import('./scenarios');
    
    const strengthNames = strengths.map(id => {
      const strength = ALL_STRENGTHS.find(s => s.id === id);
      return strength?.name || id;
    });
    
    const scenarioTitle = SCENARIOS.find(s => s.id === scenario)?.title || scenario;
    const userPrompt = buildUserPrompt(strengthNames, scenarioTitle, confusion);

    // 根据配置选择 AI 提供商
    if (config.provider === 'anthropic') {
      try {
        return await generateWithClaude(systemPrompt, userPrompt);
      } catch (claudeError) {
        console.warn('Claude API 调用失败:', claudeError);
        // 如果配置了 OpenAI API Key，尝试备用方案
        try {
          const openaiKey = process.env.OPENAI_API_KEY;
          if (openaiKey) {
            console.info('尝试使用 OpenAI 作为备用方案');
            return await generateWithOpenAI(systemPrompt, userPrompt);
          }
        } catch (openaiError) {
          console.error('OpenAI 也不可用，回退到 Mock:', openaiError);
        }
        throw claudeError;
      }
    } else {
      // openai
      return await generateWithOpenAI(systemPrompt, userPrompt);
    }
  } catch (error) {
    console.error('AI 生成失败，回退到 Mock:', error);
    return generateMockResult(scenario, strengths, confusion);
  }
}

// ========================================
// 导出
// ========================================

export { GALLUP_SYSTEM_PROMPT, buildUserPrompt };

// 导出配置检查函数（用于调试）
export function checkAIConfig(): {
  enabled: boolean;
  provider?: string;
  hasApiKey?: boolean;
  model?: string;
} {
  const enabled = ENABLE_AI;
  
  if (!enabled) {
    return { enabled: false };
  }

  const provider = AI_PROVIDER;
  const hasApiKey = provider === 'anthropic'
    ? !!process.env.ANTHROPIC_API_KEY
    : !!process.env.OPENAI_API_KEY;

  const model = provider === 'anthropic'
    ? process.env.ANTHROPIC_MODEL
    : process.env.OPENAI_MODEL;

  return {
    enabled: true,
    provider,
    hasApiKey,
    model,
  };
}
