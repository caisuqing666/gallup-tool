// 盖洛普34个优势
export const GALLUP_THEMES = [
  'Achiever', 'Activator', 'Adaptability', 'Analytical', 'Arranger',
  'Belief', 'Command', 'Communication', 'Competition', 'Connectedness',
  'Consistency', 'Context', 'Deliberative', 'Developer', 'Discipline',
  'Empathy', 'Focus', 'Futuristic', 'Harmony', 'Ideation',
  'Includer', 'Individualization', 'Input', 'Intellection', 'Learner',
  'Maximizer', 'Positivity', 'Relator', 'Responsibility', 'Restorative',
  'Self-Assurance', 'Significance', 'Strategic', 'Woo'
] as const;

// 中文名称映射
export const THEME_NAMES_CN: Record<string, string> = {
  'Achiever': '成就',
  'Activator': '行动',
  'Adaptability': '适应',
  'Analytical': '分析',
  'Arranger': '统筹',
  'Belief': '信仰',
  'Command': '统率',
  'Communication': '沟通',
  'Competition': '竞争',
  'Connectedness': '关联',
  'Consistency': '公平',
  'Context': '回顾',
  'Deliberative': '审慎',
  'Developer': '体谅',
  'Discipline': '纪律',
  'Empathy': '伯乐',
  'Focus': '专注',
  'Futuristic': '前瞻',
  'Harmony': '和谐',
  'Ideation': '理念',
  'Includer': '包容',
  'Individualization': '个别',
  'Input': '搜集',
  'Intellection': '思维',
  'Learner': '学习',
  'Maximizer': '完美',
  'Positivity': '积极',
  'Relator': '交往',
  'Responsibility': '责任',
  'Restorative': '排难',
  'Self-Assurance': '自信',
  'Significance': '追求',
  'Strategic': '战略',
  'Woo': '取悦'
};

// 按领域分组（简化版）- 使用盖洛普官方颜色体系
export const THEMES_BY_DOMAIN: Record<string, { themes: string[], color: string }> = {
  '执行': {
    themes: ['Achiever', 'Arranger', 'Belief', 'Consistency', 'Deliberative', 'Discipline', 'Focus', 'Responsibility', 'Restorative'],
    color: '#7C3AED' // 紫色 - 执行力 (Executing) - 官方紫色 (Violet-600)
  },
  '影响': {
    themes: ['Activator', 'Command', 'Communication', 'Competition', 'Maximizer', 'Self-Assurance', 'Significance', 'Woo'],
    color: '#F97316' // 橙色 - 影响力 (Influencing)
  },
  '关系建立': {
    themes: ['Adaptability', 'Connectedness', 'Developer', 'Empathy', 'Harmony', 'Includer', 'Individualization', 'Positivity', 'Relator'],
    color: '#3B82F6' // 蓝色 - 关系建立 (Relationship Building)
  },
  '战略思维': {
    themes: ['Analytical', 'Context', 'Futuristic', 'Ideation', 'Input', 'Intellection', 'Learner', 'Strategic'],
    color: '#10B981' // 绿色 - 战略思维 (Strategic Thinking)
  }
};