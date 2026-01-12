// 判词库写死规矩（V1.0）
// 目标：让系统输出具备权威、可复用、可预测的"最终裁决"气质

// ========================================
// 1. 诊断标签枚举（白名单）
// ========================================

// 核心诊断标签（必须选 1）
export const CORE_DIAGNOSIS_LABELS = [
  '决策空转',
  '用力反噬',
  '优势错位',
  '执行断裂',
  '边界失守',
  '过度负责',
  '完美拖延',
  '信息成瘾',
  '沟通透支',
  '目标漂移',
  '选择瘫痪',
  '反馈依赖',
] as const;

export type CoreDiagnosisLabel = (typeof CORE_DIAGNOSIS_LABELS)[number];

// 副标签（可选 0-1）
export const SUB_DIAGNOSIS_LABELS = [
  '安全感优先',
  '风险过敏',
  '解释过载',
  '情绪耗竭',
  '资源分散',
  '优先级失真',
] as const;

export type SubDiagnosisLabel = (typeof SUB_DIAGNOSIS_LABELS)[number];

// 所有诊断标签
export const ALL_DIAGNOSIS_LABELS = [...CORE_DIAGNOSIS_LABELS, ...SUB_DIAGNOSIS_LABELS] as const;

// ========================================
// 2. 判词模板库（断言模板）
// ========================================

export const VERDICT_TEMPLATES = [
  '你不是X，是你一直在Y。',
  '问题不在A，而在B。',
  '你卡住的不是能力，是C。',
  '你现在需要的不是X，而是Y。',
  '你并没有变差，只是Y在反噬你。',
] as const;

// ========================================
// 3. 困境还原模板（体验句）
// ========================================

export const EXPERIENCE_TEMPLATES = [
  '你越想把事做好，越不敢定下来。',
  '你一直在收集信息，但决定没有更接近。',
  '你把解释当成负责，结果自己被耗空。',
  '你在用硬撑换安心，产出却没有起来。',
  '你越累，越不敢停；越没产出，越不敢松。',
  '你习惯把话说得周全，结果是对方轻松了，你却越来越沉默。',
] as const;

// ========================================
// 4. 指令出口模板（Pivot）
// ========================================

export const PIVOT_TEMPLATES = [
  '今天不需要更清楚，只需要先选一个推进。',
  '不是继续想清楚，而是先站到自己这边。',
  '不是再增加用力，而是先换一种用力方式。',
  '不是等信息齐了再选，而是先保一个能走的。',
  '你需要的不是更精细的待办清单，而是一个允许你放弃的判断标准。',
  '你需要的不是更多分析，而是一次站在自己这边的选择。',
  '你需要的是减少用力的方式，而不是增加用力的时间。',
  '你需要的不是更好的措辞，而是不用解释那么多的边界。',
] as const;

// ========================================
// 5. 禁用词黑名单（硬拦截）
// ========================================

export const FORBIDDEN_WORDS = {
  // 羞辱/贬损
  humiliation: [
    '平庸', '废物', '懦弱', '矫情', '玻璃心', '没用', '失败者', '垃圾', '蠢', 'low',
    '无能', '废材', '怂', '弱', '差劲',
  ],
  // 道德审判/PUA
  moralJudgment: [
    '不够努力', '不配', '活该', '应该感恩', '必须', '别装', '太自私',
    '不负责任', '逃避', '懦夫',
  ],
  // 医学/精神诊断（高风险）
  medicalDiagnosis: [
    '抑郁症', '焦虑症', '双相', '精神病', '人格障碍', 'NPD', 'ADHD',
    '强迫症', '躁郁症', '精神分裂',
  ],
  // 绝对化预言/诅咒
  absolutePrediction: [
    '永远', '注定', '必然失败', '无药可救', '完蛋', '毁了',
    '不可能', '绝对', '一定', '必然',
  ],
  // 玄学宿命
  fatalism: [
    '天命', '命中注定', '因果报应', '老天惩罚', '转运',
    '命数', '天意', '报应',
  ],
} as const;

// 扁平化所有禁用词
export const ALL_FORBIDDEN_WORDS = [
  ...FORBIDDEN_WORDS.humiliation,
  ...FORBIDDEN_WORDS.moralJudgment,
  ...FORBIDDEN_WORDS.medicalDiagnosis,
  ...FORBIDDEN_WORDS.absolutePrediction,
  ...FORBIDDEN_WORDS.fatalism,
];

// ========================================
// 6. 降级输出模板（安全且不失判断）
// ========================================

export const FALLBACK_DIAGNOSIS = {
  diagnosis_label: '决策空转',
  verdict: '你不是没能力，是一直没允许自己做选择。',
  experience: `你已经想得够多了，但决定没有更靠近。
你越谨慎，越不敢定下来。`,
  pivot: '今天不需要更清楚，只需要先选一个推进。',
} as const;

// ========================================
// 7. 验证函数
// ========================================

export interface DiagnosisOutput {
  diagnosis_label: string;
  verdict: string;
  experience: string;
  pivot: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 验证诊断输出是否符合规则
 */
export function validateDiagnosisOutput(output: DiagnosisOutput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 检查诊断标签是否在白名单中
  const coreLabel = output.diagnosis_label.split('·')[0].trim();
  if (!CORE_DIAGNOSIS_LABELS.includes(coreLabel as CoreDiagnosisLabel)) {
    errors.push(`诊断标签 "${coreLabel}" 不在白名单中`);
  }

  // 2. 检查字数限制
  // diagnosis_label: 8-14 字（含标点）
  const labelLength = output.diagnosis_label.length;
  if (labelLength < 8 || labelLength > 14) {
    errors.push(`诊断标签长度 ${labelLength} 不符合要求（8-14字）`);
  }

  // 3. verdict: 不超过 28 字/行，最多 2 行；不得出现"建议/也许/可能"
  const verdictLines = output.verdict.split('\n');
  if (verdictLines.length > 2) {
    errors.push(`核心判词超过 2 行`);
  }
  for (const line of verdictLines) {
    if (line.length > 28) {
      errors.push(`核心判词单行长度 ${line.length} 超过 28 字`);
    }
  }
  if (/建议|也许|可能/.test(output.verdict)) {
    errors.push('核心判词中不得出现"建议/也许/可能"等软化词');
  }

  // 4. experience: 每句不超过 22 字，最多 4 句
  const experienceLines = output.experience.split('\n').filter(line => line.trim());
  if (experienceLines.length > 4) {
    errors.push(`困境还原超过 4 句`);
  }
  for (const line of experienceLines) {
    if (line.length > 22) {
      errors.push(`困境还原单句长度 ${line.length} 超过 22 字`);
    }
  }

  // 5. pivot: 不超过 22 字，必须含结构：不是X，而是Y 或 今天不需要X，只需要Y
  if (output.pivot.length > 22) {
    errors.push(`指令出口长度 ${output.pivot.length} 超过 22 字`);
  }
  if (!/不是.*而是|今天不需要.*只需要/.test(output.pivot)) {
    errors.push('指令出口必须包含"不是X，而是Y"或"今天不需要X，只需要Y"结构');
  }

  // 6. 检查禁用词
  const allText = `${output.diagnosis_label} ${output.verdict} ${output.experience} ${output.pivot}`;
  const foundForbiddenWords: string[] = [];
  for (const word of ALL_FORBIDDEN_WORDS) {
    if (allText.includes(word)) {
      foundForbiddenWords.push(word);
    }
  }
  if (foundForbiddenWords.length > 0) {
    errors.push(`发现禁用词: ${foundForbiddenWords.join(', ')}`);
  }

  // 7. 检查是否包含"绝对化预言"
  if (/永远|注定|必然失败|无药可救/.test(allText)) {
    errors.push('不得使用绝对化预言词');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 获取降级输出（安全模板）
 */
export function getFallbackDiagnosis(): DiagnosisOutput {
  return { ...FALLBACK_DIAGNOSIS };
}

/**
 * 格式化诊断标签显示
 */
export function formatDiagnosisLabel(coreLabel: string, subLabel?: string): string {
  if (subLabel) {
    return `诊断结论：${coreLabel} · ${subLabel}`;
  }
  return `诊断结论：${coreLabel}`;
}

// ========================================
// 8. 效能折损率可视化规则
// ========================================

export type EfficiencyLevel = '偏低' | '一般' | '良好';

export interface EfficiencyStatus {
  label: string;
  level: EfficiencyLevel;
  range: { min: number; max: number };
}

export const EFFICIENCY_STATUSES: Record<EfficiencyLevel, EfficiencyStatus> = {
  偏低: {
    label: '推进效能偏低',
    level: '偏低',
    range: { min: 30, max: 50 },
  },
  一般: {
    label: '推进效能一般',
    level: '一般',
    range: { min: 50, max: 70 },
  },
  良好: {
    label: '推进效能良好',
    level: '良好',
    range: { min: 70, max: 90 },
  },
};

/**
 * 根据百分比获取效能状态（区间显示，不用精确数字）
 */
export function getEfficiencyStatus(percentage: number): EfficiencyStatus {
  if (percentage < 50) {
    return EFFICIENCY_STATUSES.偏低;
  } else if (percentage < 70) {
    return EFFICIENCY_STATUSES.一般;
  } else {
    return EFFICIENCY_STATUSES.良好;
  }
}
