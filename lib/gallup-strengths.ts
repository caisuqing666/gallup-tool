// 34个盖洛普优势数据

export const ALL_STRENGTHS: Array<{
  id: string;
  name: string;
  domain: 'executing' | 'influencing' | 'relationship' | 'strategic';
}> = [
  // 执行力领域 (Executing)
  { id: 'achiever', name: '成就', domain: 'executing' },
  { id: 'arranger', name: '统筹', domain: 'executing' },
  { id: 'belief', name: '信仰', domain: 'executing' },
  { id: 'consistency', name: '公平', domain: 'executing' },
  { id: 'deliberative', name: '审慎', domain: 'executing' },
  { id: 'discipline', name: '纪律', domain: 'executing' },
  { id: 'focus', name: '专注', domain: 'executing' },
  { id: 'responsibility', name: '责任', domain: 'executing' },
  { id: 'restorative', name: '完美', domain: 'executing' },
  
  // 影响力领域 (Influencing)
  { id: 'activator', name: '行动', domain: 'influencing' },
  { id: 'command', name: '统率', domain: 'influencing' },
  { id: 'communication', name: '沟通', domain: 'influencing' },
  { id: 'competition', name: '竞争', domain: 'influencing' },
  { id: 'maximizer', name: '追求', domain: 'influencing' },
  { id: 'self-assurance', name: '自信', domain: 'influencing' },
  { id: 'significance', name: '个别', domain: 'influencing' },
  { id: 'woo', name: '取悦', domain: 'influencing' },
  
  // 关系建立领域 (Relationship Building)
  { id: 'adaptability', name: '适应', domain: 'relationship' },
  { id: 'connectedness', name: '关联', domain: 'relationship' },
  { id: 'developer', name: '发展', domain: 'relationship' },
  { id: 'empathy', name: '体谅', domain: 'relationship' },
  { id: 'harmony', name: '和谐', domain: 'relationship' },
  { id: 'include', name: '包容', domain: 'relationship' },
  { id: 'individualization', name: '个别', domain: 'relationship' },
  { id: 'positivity', name: '积极', domain: 'relationship' },
  { id: 'relator', name: '交往', domain: 'relationship' },
  
  // 战略思维领域 (Strategic Thinking)
  { id: 'analytical', name: '分析', domain: 'strategic' },
  { id: 'context', name: '回顾', domain: 'strategic' },
  { id: 'futuristic', name: '前瞻', domain: 'strategic' },
  { id: 'ideation', name: '理念', domain: 'strategic' },
  { id: 'input', name: '搜集', domain: 'strategic' },
  { id: 'intellection', name: '思维', domain: 'strategic' },
  { id: 'learner', name: '学习', domain: 'strategic' },
  { id: 'strategic', name: '战略', domain: 'strategic' },
];

export const DOMAIN_COLORS = {
  executing: '#3B82F6', // 蓝色
  influencing: '#EF4444', // 红色
  relationship: '#10B981', // 绿色
  strategic: '#8B5CF6', // 紫色
};
