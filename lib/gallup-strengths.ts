// 34个盖洛普优势才干 (CliftonStrengths)
// 官方四个领域分类及中文翻译

export const ALL_STRENGTHS = [
  // ========== 执行力领域 (Executing) - 9项 ==========
  // 帮助人们将想法变成行动
  { id: 'focus', name: '专注', domain: 'executing' as const },
  { id: 'belief', name: '信仰', domain: 'executing' as const },
  { id: 'consistency', name: '公平', domain: 'executing' as const },
  { id: 'deliberative', name: '审慎', domain: 'executing' as const },
  { id: 'achiever', name: '成就', domain: 'executing' as const },
  { id: 'restorative', name: '排难', domain: 'executing' as const },
  { id: 'discipline', name: '纪律', domain: 'executing' as const },
  { id: 'arranger', name: '统筹', domain: 'executing' as const },
  { id: 'responsibility', name: '责任', domain: 'executing' as const },

  // ========== 影响力领域 (Influencing) - 8项 ==========
  // 帮助人们表达观点、说服他人、促成结果
  { id: 'woo', name: '取悦', domain: 'influencing' as const },
  { id: 'maximizer', name: '完美', domain: 'influencing' as const },
  { id: 'communication', name: '沟通', domain: 'influencing' as const },
  { id: 'competition', name: '竞争', domain: 'influencing' as const },
  { id: 'command', name: '统率', domain: 'influencing' as const },
  { id: 'self-assurance', name: '自信', domain: 'influencing' as const },
  { id: 'activator', name: '行动', domain: 'influencing' as const },
  { id: 'significance', name: '追求', domain: 'influencing' as const },

  // ========== 关系建立领域 (Relationship Building) - 9项 ==========
  // 帮助人们建立更强大的团队和人际关系
  { id: 'individualization', name: '个别', domain: 'relationship' as const },
  { id: 'relator', name: '交往', domain: 'relationship' as const },
  { id: 'developer', name: '伯乐', domain: 'relationship' as const },
  { id: 'empathy', name: '体谅', domain: 'relationship' as const },
  { id: 'connectedness', name: '关联', domain: 'relationship' as const },
  { id: 'include', name: '包容', domain: 'relationship' as const },
  { id: 'harmony', name: '和谐', domain: 'relationship' as const },
  { id: 'positivity', name: '积极', domain: 'relationship' as const },
  { id: 'adaptability', name: '适应', domain: 'relationship' as const },

  // ========== 战略思维领域 (Strategic Thinking) - 8项 ==========
  // 帮助人们分析和处理信息
  { id: 'analytical', name: '分析', domain: 'strategic' as const },
  { id: 'futuristic', name: '前瞻', domain: 'strategic' as const },
  { id: 'context', name: '回顾', domain: 'strategic' as const },
  { id: 'learner', name: '学习', domain: 'strategic' as const },
  { id: 'intellection', name: '思维', domain: 'strategic' as const },
  { id: 'strategic', name: '战略', domain: 'strategic' as const },
  { id: 'input', name: '搜集', domain: 'strategic' as const },
  { id: 'ideation', name: '理念', domain: 'strategic' as const },
] as const;

// 推导出 Strength ID 的联合类型（从 ALL_STRENGTHS 推导）
export type StrengthId = (typeof ALL_STRENGTHS)[number]['id'];

// 推导出 Strength Domain 的联合类型
export type StrengthDomain = (typeof ALL_STRENGTHS)[number]['domain'];

// 导出 Strength 类型（从 ALL_STRENGTHS 推导）
export type Strength = (typeof ALL_STRENGTHS)[number];

// 获取所有有效的 Strength ID（运行时校验数组）
export const VALID_STRENGTH_IDS = ALL_STRENGTHS.map(
  (s) => s.id
) as readonly StrengthId[];

// 类型守卫：检查是否为有效的 Strength ID
export function isValidStrengthId(id: unknown): id is StrengthId {
  return typeof id === 'string' && VALID_STRENGTH_IDS.includes(id as StrengthId);
}

// 根据 ID 查找优势（类型安全）
export function getStrengthById(id: StrengthId): Strength | undefined {
  return ALL_STRENGTHS.find((s) => s.id === id);
}

// 领域配色方案 - 盖洛普官方颜色（柔和版，智性温暖 + 晶石）
// 使用之前推送版本的柔和色系，但确保类型正确
export const DOMAIN_COLORS = {
  executing: '#8B7A9B',     // 执行力 - 柔和紫色（保持之前柔和度）
  influencing: '#B8A082',   // 影响力 - 柔和黄色（保持之前柔和度）
  relationship: '#7A8B9B',   // 关系建立 - 柔和蓝色（保持之前柔和度）
  strategic: '#6B8E6B',     // 战略思维 - 柔和绿色（保持之前柔和度）
};

// 领域名称映射
export const DOMAIN_NAMES = {
  executing: '执行力',
  influencing: '影响力',
  relationship: '关系建立',
  strategic: '战略思维',
};
