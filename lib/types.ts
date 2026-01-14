// 核心类型定义

// 导入类型以便在接口中使用
import type { ScenarioId } from './scenarios';
import type { StrengthId } from './gallup-strengths';

// 重新导出类型以便其他文件使用
export type { Strength, StrengthId } from './gallup-strengths';
export type { Scenario, ScenarioId } from './scenarios';

// 从 prompts.ts 导入新类型
export type { ExplainOutput, DecideOutput } from './prompts';

// ============================================================
// 表单数据类型
// ============================================================

export interface FormData {
  scenario?: ScenarioId;
  strengths: StrengthId[];
  confusion: string;
}

// ============================================================
// 解释页数据类型
// ============================================================

export interface ExplainData {
  // 单优势的现实表现
  strengthManifestations: Array<{
    strengthId: string;
    behaviors: string;
  }>;
  // 优势组合的相互作用
  strengthInteractions: string;
  // 这组组合常见的认知盲区
  blindspots: string;
  // 一句总结性说明
  summary: string;
}

// ============================================================
// 判定页数据类型
// ============================================================

export interface DecideData {
  // 当前阶段的优势使用判定
  verdict: string;
  // 更应该多做的事（至少3条）
  doMore: Array<{
    action: string;
    timing: string;
    criteria: string;
    consequence: string; // 不做会怎样
  }>;
  // 更应该少做/不再做的事（至少3条）
  doLess: Array<{
    action: string;
    replacement: string;
    timing: string;
  }>;
  // 责任边界的明确划分（至少3条）
  boundaries: Array<{
    responsibleFor: string;
    notResponsibleFor: string;
  }>;
  // 用对力判断规则
  checkRule: string;
}

// ============================================================
// 完整结果类型（用于兼容旧代码）
// @deprecated 使用 ExplainData 和 DecideData 替代
// ============================================================

export interface ResultData {
  highlight: string;
  judgment: string;
  blindspot: string;
  actions: string[];
  advantageTips?: {
    reduce?: Array<{ strength: string; percentage: number; reason: string }>;
    increase?: Array<{ strength: string; percentage: number; reason: string }>;
    instruction: string;
  };
}

// ============================================================
// 新的统一输出类型
// ============================================================

export interface GallupResult {
  // 解释页内容
  explain: ExplainData;
  // 判定页内容
  decide: DecideData;
}
