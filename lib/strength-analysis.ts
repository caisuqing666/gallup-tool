// 优势分析模块（统一导出）
// 整合 StrengthProfile 和 ComboRule，供 prompt 使用

import { StrengthId } from './gallup-strengths';
import { 
  StrengthProfile, 
  getStrengthProfiles, 
  formatProfileForPrompt 
} from './strength-profiles';
import { 
  ComboEffect, 
  getComboEffect, 
  formatComboEffectForPrompt,
  getMatchedRules,
  ComboRule
} from './combo-rules';

// ============ 类型导出 ============

export type { StrengthProfile, ComboEffect, ComboRule };

// ============ 分析结果类型 ============

/**
 * 优势分析结果
 * 整合单优势画像和组合效应，供 prompt 使用
 */
export interface StrengthAnalysis {
  // 单优势画像列表
  strengthProfiles: StrengthProfile[];
  
  // 组合效应（放大/盲区/冲突/陷阱/纠偏建议）
  comboEffect: ComboEffect;
  
  // 匹配到的规则（用于调试/展示）
  matchedRules: ComboRule[];
  
  // 格式化后的 prompt 文本
  promptText: string;
}

// ============ 核心分析函数 ============

/**
 * 分析用户的优势组合
 * @param strengthIds 用户选择的优势 ID 列表（最多5个）
 * @returns 完整的分析结果
 */
export function analyzeStrengths(strengthIds: StrengthId[]): StrengthAnalysis {
  // 只取前5个优势
  const topStrengths = strengthIds.slice(0, 5);
  
  // 获取单优势画像
  const strengthProfiles = getStrengthProfiles(topStrengths);
  
  // 获取组合效应
  const comboEffect = getComboEffect(topStrengths);
  
  // 获取匹配的规则
  const matchedRules = getMatchedRules(topStrengths);
  
  // 格式化为 prompt 文本
  const promptText = formatAnalysisForPrompt(strengthProfiles, comboEffect);
  
  return {
    strengthProfiles,
    comboEffect,
    matchedRules,
    promptText,
  };
}

// ============ Prompt 格式化 ============

/**
 * 格式化分析结果为 prompt 友好的文本
 */
function formatAnalysisForPrompt(
  profiles: StrengthProfile[], 
  effect: ComboEffect
): string {
  const sections: string[] = [];
  
  // 1. 单优势画像
  if (profiles.length > 0) {
    sections.push(`## 用户的优势画像

${profiles.map(formatProfileForPrompt).join('\n\n')}`);
  }
  
  // 2. 组合效应
  const comboText = formatComboEffectForPrompt(effect);
  if (comboText) {
    sections.push(`## 优势组合分析

${comboText}`);
  }
  
  return sections.join('\n\n---\n\n');
}

/**
 * 生成简短的组合洞察（用于结果页展示）
 */
export function getComboInsight(strengthIds: StrengthId[]): string {
  const effect = getComboEffect(strengthIds);
  
  // 优先展示陷阱，其次是冲突，然后是盲区
  if (effect.traps.length > 0) {
    const trap = effect.traps[0];
    return `⚠️ 你的优势组合容易掉入「${trap.name}」陷阱：${trap.symptom}`;
  }
  
  if (effect.conflicts.length > 0) {
    const conflict = effect.conflicts[0];
    return `⚡ 你的优势存在「${conflict.name}」内在冲突：${conflict.description}`;
  }
  
  if (effect.blindspots.length > 0) {
    const blindspot = effect.blindspots[0];
    return `👁️ 你的组合有「${blindspot.name}」盲区：${blindspot.symptom}`;
  }
  
  if (effect.amplifications.length > 0) {
    const amp = effect.amplifications[0];
    return `🚀 你的组合具有「${amp.name}」放大效应：${amp.description}`;
  }
  
  return '';
}

/**
 * 获取最重要的纠偏建议
 */
export function getTopCorrection(strengthIds: StrengthId[]): {
  insight: string;
  action: string;
  boundary: string;
} | null {
  const effect = getComboEffect(strengthIds);
  
  if (effect.corrections.length > 0) {
    const { insight, action, boundary } = effect.corrections[0];
    return { insight, action, boundary };
  }
  
  return null;
}

// ============ 工具函数导出 ============

export { 
  getStrengthProfiles, 
  getComboEffect,
  getMatchedRules,
  formatProfileForPrompt,
  formatComboEffectForPrompt,
};
