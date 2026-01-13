// 行为描述映射数据
// 用于 ResultPage 中的"现在的用力方式指令"模块

// 调低行为描述（这段时间，先别这么用力）
export const REDUCE_BEHAVIORS: Record<string, string> = {
  '责任': '把"万一出错"放在第一位',
  '搜集': '等所有信息都齐了再做决定',
  '分析': '反复想清楚每一种可能',
  '专注': '同时处理所有重要的事',
  '战略': '把所有可能性都考虑清楚',
  '沟通': '把话说得周全、体谅、不给人压力',
  '成就': '把所有事都做到最好',
  '完美': '每个细节都要做到极致',
  '学习': '先学会所有知识再行动',
  '前瞻': '把所有未来风险都预想到',
  '回顾': '弄清楚过去所有原因',
  '体谅': '照顾到每个人的感受',
  '和谐': '让所有人都满意',
  '包容': '让所有人都参与',
  '交往': '维护好所有关系',
  '统率': '控制住所有局面',
  '竞争': '在每个领域都要赢',
  '自信': '保证每个决定都正确',
  '行动': '同时启动所有项目',
};

// 调高行为描述（现在更适合这样做）
export const INCREASE_BEHAVIORS: Record<string, string> = {
  '责任': '允许自己在过程中再修正',
  '搜集': '先选一个方向站过去',
  '分析': '用"能不能推进"替代"对不对"',
  '专注': '只处理已经在手里的事',
  '战略': '先选一个方向站过去',
  '沟通': '用"能不能推进"替代"对不对"',
  '成就': '选一件能推进的事做完',
  '完美': '先做完，再优化',
  '学习': '在做的过程中学',
  '前瞻': '先看清下一步',
  '回顾': '从过去的经验中选一个用',
  '体谅': '先照顾最关键的人',
  '和谐': '先保核心关系',
  '包容': '让对的人先参与',
  '交往': '只维护关键关系',
  '统率': '只控制关键节点',
  '竞争': '选一个赛道赢',
  '自信': '允许试错',
  '行动': '只启动一件事',
};

// 调低行为结果
export const REDUCE_RESULTS: Record<string, string> = {
  default: '事情没更稳，你却越来越不敢选。',
};

// 调高行为结果
export const INCREASE_RESULTS: Record<string, string> = {
  default: '事情会开始动，你也会慢慢松下来。',
};

/**
 * 获取行为描述
 * @param strength 优势名称
 * @param isReduce 是否为调低行为
 * @returns 行为描述文本
 */
export function getBehaviorDescription(strength: string, isReduce: boolean): string {
  if (isReduce) {
    return REDUCE_BEHAVIORS[strength] || '继续用现在的方式用力';
  }
  return INCREASE_BEHAVIORS[strength] || '先选一个方向站过去';
}

/**
 * 获取行为结果说明
 * @param strength 优势名称
 * @param isReduce 是否为调低行为
 * @returns 行为结果文本
 */
export function getBehaviorResult(strength: string, isReduce: boolean): string {
  if (isReduce) {
    return REDUCE_RESULTS[strength] || REDUCE_RESULTS.default;
  }
  return INCREASE_RESULTS[strength] || INCREASE_RESULTS.default;
}
