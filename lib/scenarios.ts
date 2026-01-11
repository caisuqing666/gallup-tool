// 使用场景数据（痛点化描述，更具情绪色彩）
// 使用 as const 确保类型推导和类型安全

export const SCENARIOS = [
  {
    id: 'work-decision',
    title: '手头事太多，不知道该先保哪一个',
  },
  {
    id: 'career-transition',
    title: '想换赛道，但不确定优势在哪',
  },
  {
    id: 'efficiency',
    title: '每天都累到透支，但效率还是上不去',
  },
  {
    id: 'communication',
    title: '沟通心累，总觉得别人不理解我',
  },
] as const;

// 推导出 Scenario ID 的联合类型（从 SCENARIOS 推导）
export type ScenarioId = (typeof SCENARIOS)[number]['id'];

// 导出 Scenario 类型（从 SCENARIOS 推导）
export type Scenario = (typeof SCENARIOS)[number];

// 获取所有有效的 Scenario ID（运行时校验数组）
export const VALID_SCENARIO_IDS = SCENARIOS.map(
  (s) => s.id
) as readonly ScenarioId[];

// 类型守卫：检查是否为有效的 Scenario ID
export function isValidScenarioId(id: unknown): id is ScenarioId {
  return typeof id === 'string' && VALID_SCENARIO_IDS.includes(id as ScenarioId);
}
