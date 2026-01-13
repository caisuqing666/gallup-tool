/**
 * 流水线入口文件
 * 导出所有公共接口
 */

export type {
  RawReport,
  SectionType,
  Chunk,
  Stage1Output,
  ExtractedTheme,
  ExtractedClaim,
  ExtractedRecommendation,
  Stage2Output,
  TopStrength,
  Stage3Output,
  RenderTone,
  PageSection,
  Stage4Output,
  AIProviderConfig,
  PipelineConfig,
} from './types';

export type {
  PipelineProgress,
  PipelineResult,
} from './pipeline';

import type { PipelineConfig } from './types';

export { stage1_preprocess } from './stage1-preprocess';
export { stage2_extractChunk, stage2_extractAllChunks } from './stage2-extract';
export { stage3_mergeDiagnosis } from './stage3-merge';
export { stage4_render } from './stage4-render';
export { executePipeline, PipelineError } from './pipeline';

export const PRESETS: Record<string, Partial<PipelineConfig>> = {
  fast: {
    stage2: { provider: { provider: 'mock', model: 'mock' } },
    stage3: { provider: { provider: 'mock', model: 'mock' } },
    stage4: { 
      provider: { provider: 'mock', model: 'mock' },
      tone: { style: 'professional', detail_level: 'balanced', language: 'zh-CN' },
    },
  },
  
  economy: {
    stage2: { provider: { provider: 'openai', model: 'gpt-4o-mini' }, temperature: 0.3 },
    stage3: { provider: { provider: 'openai', model: 'gpt-4o-mini' }, temperature: 0.5 },
    stage4: { 
      provider: { provider: 'openai', model: 'gpt-4o' },
      temperature: 0.7,
      tone: { style: 'professional', detail_level: 'balanced', language: 'zh-CN' },
    },
  },
  
  balanced: {
    stage2: { provider: { provider: 'anthropic', model: 'claude-3-haiku-20240307' }, temperature: 0.3 },
    stage3: { provider: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }, temperature: 0.5 },
    stage4: { 
      provider: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
      temperature: 0.7,
      tone: { style: 'professional', detail_level: 'balanced', language: 'zh-CN' },
    },
  },
  
  premium: {
    stage2: { provider: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }, temperature: 0.3 },
    stage3: { provider: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }, temperature: 0.5 },
    stage4: { 
      provider: { provider: 'openai', model: 'gpt-4o' },
      temperature: 0.7,
      tone: { style: 'professional', detail_level: 'balanced', language: 'zh-CN' },
    },
  },
};

export function createDefaultConfig(preset: keyof typeof PRESETS = 'fast'): Partial<PipelineConfig> {
  const base: Partial<PipelineConfig> = {
    stage1: {
      max_chunk_size: 800,
      overlap_size: 100,
    },
    retry_config: {
      max_retries: 3,
      base_delay_ms: 1000,
    },
  };
  
  const presetConfig = PRESETS[preset];
  
  const config: Partial<PipelineConfig> = {
    ...base,
    ...presetConfig,
  };
  
  if (config.stage4 && !('tone' in config.stage4)) {
    (config.stage4 as any).tone = {
      style: 'professional',
      detail_level: 'balanced',
      language: 'zh-CN',
    };
  }
  
  return config;
}
