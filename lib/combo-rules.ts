// ComboRule（组合规则层）
// 定义优势组合的协同效应、盲区、冲突和纠偏建议
// 输出 ComboEffect 供 prompt 使用

import { StrengthId } from './gallup-strengths';

// ============ 类型定义 ============

/**
 * 组合规则类型
 */
export type ComboType = 
  | 'amplify'    // 放大效应：优势组合产生 1+1>2 的效果
  | 'blindspot'  // 盲区：组合导致的共同盲点
  | 'conflict'   // 冲突：优势之间的内在矛盾
  | 'trap';      // 陷阱：组合容易掉入的模式

/**
 * 单条组合规则
 */
export interface ComboRule {
  id: string;                           // 规则ID，用于去重
  trigger: {
    requires: StrengthId[];             // 必须包含的优势（AND 关系）
    requiresAny?: StrengthId[];         // 至少包含其一（OR 关系）
    excludes?: StrengthId[];            // 不能包含的优势
  };
  type: ComboType;                      // 规则类型
  weight: number;                       // 权重（1-10），用于排序
  
  // 效应描述
  effect: {
    name: string;                       // 效应名称（如"无限承担循环"）
    description: string;                // 效应描述
    symptom: string;                    // 典型症状
  };
  
  // 纠偏建议
  correction: {
    insight: string;                    // 洞察（为什么会这样）
    action: string;                     // 行动建议
    boundary: string;                   // 边界设定
  };
}

/**
 * 组合效应（匹配后的合并结果）
 */
export interface ComboEffect {
  // 放大效应：这些优势组合的正向能力
  amplifications: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
  
  // 盲区：这些优势组合的共同盲点
  blindspots: Array<{
    name: string;
    symptom: string;
    weight: number;
  }>;
  
  // 冲突：优势之间的内在矛盾
  conflicts: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
  
  // 陷阱：容易掉入的模式
  traps: Array<{
    name: string;
    symptom: string;
    weight: number;
  }>;
  
  // 纠偏建议（按权重排序后的 Top 3）
  corrections: Array<{
    insight: string;
    action: string;
    boundary: string;
    weight: number;
  }>;
}

// ============ 组合规则数据 ============

export const COMBO_RULES: ComboRule[] = [
  // ========== 责任相关组合 ==========
  
  {
    id: 'responsibility-harmony-trap',
    trigger: {
      requires: ['responsibility', 'harmony'],
    },
    type: 'trap',
    weight: 9,
    effect: {
      name: '无限承担循环',
      description: '责任让你接住所有事，和谐让你无法拒绝',
      symptom: '事情越来越多，但从来不说"不"',
    },
    correction: {
      insight: '你的"责任+和谐"组合在制造一个陷阱：为了避免冲突而承担一切',
      action: '用和谐的方式设计"温和拒绝"话术，而不是用责任接住所有',
      boundary: '负责你选定的事，不负责所有人的期待',
    },
  },
  
  {
    id: 'responsibility-empathy-trap',
    trigger: {
      requires: ['responsibility', 'empathy'],
    },
    type: 'trap',
    weight: 8,
    effect: {
      name: '情绪代偿模式',
      description: '体谅让你感受到他人的需求，责任让你觉得必须承担',
      symptom: '看到别人的困难就觉得"我应该帮"',
    },
    correction: {
      insight: '你的体谅在接收信号，责任在强制响应——但不是所有信号都需要你响应',
      action: '在感受到他人需求时，先问"这是我的责任吗"',
      boundary: '负责自己的承诺，不负责他人的情绪',
    },
  },
  
  {
    id: 'responsibility-achiever-amplify',
    trigger: {
      requires: ['responsibility', 'achiever'],
    },
    type: 'amplify',
    weight: 7,
    effect: {
      name: '可靠执行力',
      description: '责任让你承诺，成就让你完成，组合产生强大的执行力',
      symptom: '说到做到，产出稳定',
    },
    correction: {
      insight: '你的执行力很强，但要警惕"永不停歇"的陷阱',
      action: '为自己设定"今日完成"的明确边界',
      boundary: '负责今天选定的任务，不负责"所有能做的事"',
    },
  },
  
  {
    id: 'responsibility-focus-amplify',
    trigger: {
      requires: ['responsibility', 'focus'],
    },
    type: 'amplify',
    weight: 8,
    effect: {
      name: '深度承诺能力',
      description: '责任让你承担，专注让你深入，组合产生强大的单点突破力',
      symptom: '在一件事上做到极致',
    },
    correction: {
      insight: '你的组合适合"少而精"，不适合"多而全"',
      action: '主动收缩战场，只承担最重要的1-2件事',
      boundary: '负责你专注的事，不负责所有"看起来重要"的事',
    },
  },

  // ========== 和谐相关组合 ==========
  
  {
    id: 'harmony-empathy-blindspot',
    trigger: {
      requires: ['harmony', 'empathy'],
    },
    type: 'blindspot',
    weight: 8,
    effect: {
      name: '冲突回避盲区',
      description: '体谅让你感受对方不适，和谐让你避免制造不适',
      symptom: '明知道该说"不"，但总是说"好"',
    },
    correction: {
      insight: '你的组合让你非常擅长感知氛围，但也让你无法"破坏"氛围',
      action: '设计"温和但清晰"的拒绝方式',
      boundary: '负责表达真实立场，不负责对方的情绪反应',
    },
  },
  
  {
    id: 'harmony-include-blindspot',
    trigger: {
      requires: ['harmony', 'include'],
    },
    type: 'blindspot',
    weight: 7,
    effect: {
      name: '无边界包容',
      description: '包容让你接纳所有人，和谐让你无法设立门槛',
      symptom: '团队里混入不合适的人，但你无法开口',
    },
    correction: {
      insight: '你的组合让你成为很好的调解者，但也让你无法扮演"把关人"',
      action: '区分"参与者"和"核心成员"，对后者设立标准',
      boundary: '负责创造包容的氛围，不负责让所有人都进入核心圈',
    },
  },
  
  {
    id: 'harmony-command-conflict',
    trigger: {
      requires: ['harmony', 'command'],
    },
    type: 'conflict',
    weight: 9,
    effect: {
      name: '控制与和谐的撕裂',
      description: '统率想要掌控，和谐想要避免冲突，两者在决策时撕裂',
      symptom: '内心想主导，但又怕破坏关系',
    },
    correction: {
      insight: '你需要区分"需要统率的场景"和"需要和谐的场景"',
      action: '在危机/决策时用统率，在日常协作时用和谐',
      boundary: '负责在关键时刻做决定，不负责让每个决定都让所有人舒服',
    },
  },

  // ========== 搜集/分析相关组合 ==========
  
  {
    id: 'input-analytical-trap',
    trigger: {
      requires: ['input', 'analytical'],
    },
    type: 'trap',
    weight: 9,
    effect: {
      name: '信息黑洞',
      description: '搜集让你不断收集，分析让你觉得"还不够"，永远无法决策',
      symptom: '收集了很多资料，但迟迟无法行动',
    },
    correction: {
      insight: '你的组合让你成为优秀的研究者，但也让你陷入"永远在准备"',
      action: '设定明确的"信息截止点"：收集到X就必须决策',
      boundary: '负责做出当前最优判断，不负责找到"完美答案"',
    },
  },
  
  {
    id: 'input-learner-trap',
    trigger: {
      requires: ['input', 'learner'],
    },
    type: 'trap',
    weight: 8,
    effect: {
      name: '知识囤积症',
      description: '搜集让你收集，学习让你觉得"还要学"，永远在输入',
      symptom: '学了很多，但从来没有输出',
    },
    correction: {
      insight: '你的组合非常擅长输入，但需要强制设定"输出节点"',
      action: '用"学3用1"原则：每学3个单位，必须输出1个单位',
      boundary: '负责持续学习，但也负责定期输出',
    },
  },
  
  {
    id: 'input-strategic-amplify',
    trigger: {
      requires: ['input', 'strategic'],
    },
    type: 'amplify',
    weight: 7,
    effect: {
      name: '信息战略家',
      description: '搜集提供素材，战略找到路径，组合产生强大的规划能力',
      symptom: '能快速整合信息并找到最优路径',
    },
    correction: {
      insight: '你的规划能力很强，但要警惕"一直在规划"的陷阱',
      action: '设定"规划截止点"：方案够用就开始执行',
      boundary: '负责找到可行路径，不负责找到"完美路径"',
    },
  },

  // ========== 专注相关组合 ==========
  
  {
    id: 'focus-achiever-trap',
    trigger: {
      requires: ['focus', 'achiever'],
    },
    type: 'trap',
    weight: 7,
    effect: {
      name: '隧道视野陷阱',
      description: '专注让你只看一件事，成就让你不断推进，可能错过全局',
      symptom: '在一件事上很努力，但发现方向错了',
    },
    correction: {
      insight: '你的组合适合执行明确的任务，但需要定期"抬头看路"',
      action: '每周设定一次"方向检查点"：这件事还值得专注吗？',
      boundary: '负责在选定的方向上深入，也负责定期验证方向',
    },
  },
  
  {
    id: 'focus-arranger-conflict',
    trigger: {
      requires: ['focus', 'arranger'],
    },
    type: 'conflict',
    weight: 8,
    effect: {
      name: '专注与统筹的撕裂',
      description: '专注想要锁定一件事，统筹想要协调多件事，两者冲突',
      symptom: '既想深入又想全局，两边都做不好',
    },
    correction: {
      insight: '你需要区分"专注时段"和"统筹时段"',
      action: '上午专注执行，下午统筹协调；不要混在一起',
      boundary: '负责在专注时排除干扰，在统筹时放开视野',
    },
  },

  // ========== 战略相关组合 ==========
  
  {
    id: 'strategic-activator-amplify',
    trigger: {
      requires: ['strategic', 'activator'],
    },
    type: 'amplify',
    weight: 9,
    effect: {
      name: '快速决策执行力',
      description: '战略找到路径，行动立即启动，组合产生强大的推进力',
      symptom: '看到机会就能快速行动',
    },
    correction: {
      insight: '你的组合非常高效，但要警惕"方向错误的快速行动"',
      action: '行动前用5分钟确认：这是战略最优路径吗？',
      boundary: '负责快速行动，也负责确保方向正确',
    },
  },
  
  {
    id: 'strategic-deliberative-conflict',
    trigger: {
      requires: ['strategic', 'deliberative'],
    },
    type: 'conflict',
    weight: 7,
    effect: {
      name: '冒险与审慎的撕裂',
      description: '战略想要选择最优路径（可能有风险），审慎想要规避风险',
      symptom: '看到机会但又担心风险，难以决策',
    },
    correction: {
      insight: '用审慎排除"不可接受的风险"，用战略在"可接受风险"中选择最优',
      action: '先列出"绝对不能冒的风险"，然后在安全范围内用战略选择',
      boundary: '负责做出有风险但可控的决策，不负责找到零风险方案',
    },
  },
  
  {
    id: 'strategic-futuristic-amplify',
    trigger: {
      requires: ['strategic', 'futuristic'],
    },
    type: 'amplify',
    weight: 8,
    effect: {
      name: '愿景路径规划',
      description: '前瞻看到终点，战略找到路径，组合产生强大的规划能力',
      symptom: '能把远大愿景拆解成可执行的步骤',
    },
    correction: {
      insight: '你的规划能力很强，但要警惕"只在规划，不在执行"',
      action: '每个愿景必须落地为"今天的第一步"',
      boundary: '负责规划愿景路径，也负责启动第一步',
    },
  },

  // ========== 执行力组合 ==========
  
  {
    id: 'achiever-discipline-amplify',
    trigger: {
      requires: ['achiever', 'discipline'],
    },
    type: 'amplify',
    weight: 8,
    effect: {
      name: '稳定高产出',
      description: '成就驱动产出，纪律保证稳定，组合产生持续的高效执行',
      symptom: '每天都能完成大量工作，且保持一致',
    },
    correction: {
      insight: '你的执行力非常稳定，但要警惕"没有休息"的陷阱',
      action: '在纪律中加入"休息时段"，把恢复当作任务的一部分',
      boundary: '负责高效执行，也负责可持续恢复',
    },
  },
  
  {
    id: 'achiever-maximizer-trap',
    trigger: {
      requires: ['achiever', 'maximizer'],
    },
    type: 'trap',
    weight: 8,
    effect: {
      name: '永不满足循环',
      description: '成就让你想完成更多，完美让你觉得"还不够好"',
      symptom: '做完了很多，但从来不觉得"够了"',
    },
    correction: {
      insight: '你的组合让你成为高产出者，但也让你永远不满足',
      action: '每天设定"今日完成标准"，达到就停止',
      boundary: '负责今天的产出，不负责"做到完美"',
    },
  },

  // ========== 影响力组合 ==========
  
  {
    id: 'command-competition-amplify',
    trigger: {
      requires: ['command', 'competition'],
    },
    type: 'amplify',
    weight: 7,
    effect: {
      name: '竞争型领导力',
      description: '统率提供掌控力，竞争提供驱动力，组合产生强势领导风格',
      symptom: '在竞争环境中能带领团队赢',
    },
    correction: {
      insight: '你的组合适合竞争环境，但在协作环境中可能显得过于强势',
      action: '区分"竞争场景"和"协作场景"，调整领导风格',
      boundary: '负责在竞争中带领团队，不负责让每个人都舒服',
    },
  },
  
  {
    id: 'woo-communication-amplify',
    trigger: {
      requires: ['woo', 'communication'],
    },
    type: 'amplify',
    weight: 7,
    effect: {
      name: '社交影响力',
      description: '取悦建立关系，沟通传递想法，组合产生强大的社交影响力',
      symptom: '能快速与人建立连接并影响他们',
    },
    correction: {
      insight: '你的社交能力很强，但要警惕"关系广而不深"',
      action: '识别"关键关系"，在这些关系上投入更多深度',
      boundary: '负责建立影响力，也负责在关键关系上深耕',
    },
  },
  
  {
    id: 'significance-maximizer-trap',
    trigger: {
      requires: ['significance', 'maximizer'],
    },
    type: 'trap',
    weight: 8,
    effect: {
      name: '认可饥渴症',
      description: '追求让你需要认可，完美让你觉得"还不够好到被认可"',
      symptom: '不断追求更大的成就来获得认可，但永远不满足',
    },
    correction: {
      insight: '你的组合让你成为高成就者，但也让你依赖外部认可',
      action: '建立"内在认可"标准：做到什么程度就是"够好"',
      boundary: '负责追求卓越，但用内在标准而不是外部掌声来衡量',
    },
  },

  // ========== 关系建立组合 ==========
  
  {
    id: 'empathy-individualization-amplify',
    trigger: {
      requires: ['empathy', 'individualization'],
    },
    type: 'amplify',
    weight: 8,
    effect: {
      name: '个性化共情',
      description: '体谅感受情绪，个别看到差异，组合产生深度的人际理解力',
      symptom: '能精准理解每个人的独特需求',
    },
    correction: {
      insight: '你的理解力很强，但要警惕"被每个人的需求淹没"',
      action: '识别"必须响应"和"可以不响应"的需求',
      boundary: '负责理解他人，不负责满足所有人的需求',
    },
  },
  
  {
    id: 'relator-developer-amplify',
    trigger: {
      requires: ['relator', 'developer'],
    },
    type: 'amplify',
    weight: 7,
    effect: {
      name: '深度培养力',
      description: '交往建立深度关系，伯乐看到潜力，组合产生强大的长期培养能力',
      symptom: '能与人建立深度连接并帮助他们成长',
    },
    correction: {
      insight: '你的培养能力很强，但要选择"值得培养的人"',
      action: '识别"有潜力且有意愿"的人，集中投入',
      boundary: '负责深度培养，不负责让每个人都成长',
    },
  },
  
  {
    id: 'positivity-harmony-blindspot',
    trigger: {
      requires: ['positivity', 'harmony'],
    },
    type: 'blindspot',
    weight: 7,
    effect: {
      name: '回避深度问题',
      description: '积极想要保持正面，和谐想要避免冲突，组合让你难以面对真正的问题',
      symptom: '用"积极态度"掩盖实际问题',
    },
    correction: {
      insight: '你的组合让你成为氛围制造者，但也让你难以面对负面现实',
      action: '允许自己和团队"暂时不积极"，面对真实问题',
      boundary: '负责营造积极氛围，也负责在必要时面对现实',
    },
  },

  // ========== 三优势组合 ==========
  
  {
    id: 'responsibility-harmony-empathy-trap',
    trigger: {
      requires: ['responsibility', 'harmony', 'empathy'],
    },
    type: 'trap',
    weight: 10,
    effect: {
      name: '无边界照顾者',
      description: '体谅让你感受需求，和谐让你无法拒绝，责任让你必须承担——完美的自我消耗循环',
      symptom: '所有人都来找你，你从来不说"不"，最后累垮自己',
    },
    correction: {
      insight: '你的三个优势在共同制造一个"完美陷阱"：你太擅长感知和响应他人需求了',
      action: '为自己设计"请求筛选器"：这是我必须承担的吗？',
      boundary: '负责你选定要帮助的人，不负责所有找到你的人',
    },
  },
  
  {
    id: 'input-analytical-deliberative-trap',
    trigger: {
      requires: ['input', 'analytical', 'deliberative'],
    },
    type: 'trap',
    weight: 10,
    effect: {
      name: '决策瘫痪症',
      description: '搜集让你继续收集，分析让你继续分析，审慎让你害怕风险——永远无法决策',
      symptom: '准备了很久，分析了很多，但就是无法做决定',
    },
    correction: {
      insight: '你的三个优势都在"准备"，没有一个在"行动"',
      action: '设定"强制决策点"：到这个时间必须决定，不管信息是否完美',
      boundary: '负责做出当前最优决策，不负责找到"零风险的完美决策"',
    },
  },
  
  {
    id: 'strategic-futuristic-ideation-trap',
    trigger: {
      requires: ['strategic', 'futuristic', 'ideation'],
    },
    type: 'trap',
    weight: 9,
    effect: {
      name: '永远在规划',
      description: '理念产生想法，前瞻看到愿景，战略规划路径——但没有一个在执行',
      symptom: '有很多精彩的想法和规划，但实际产出很少',
    },
    correction: {
      insight: '你的三个优势都在"想"，需要借力于行动类优势',
      action: '每个想法必须在24小时内落地为一个最小行动',
      boundary: '负责产生想法，也负责让想法变成行动',
    },
  },
  
  {
    id: 'achiever-focus-discipline-amplify',
    trigger: {
      requires: ['achiever', 'focus', 'discipline'],
    },
    type: 'amplify',
    weight: 9,
    effect: {
      name: '执行机器',
      description: '专注锁定目标，纪律保证稳定，成就驱动完成——强大的执行力组合',
      symptom: '在选定的方向上能持续稳定地产出',
    },
    correction: {
      insight: '你的执行力非常强，但要确保"执行的方向是对的"',
      action: '每周设定"方向检查点"：我在做的事还是最重要的吗？',
      boundary: '负责高效执行，也负责定期验证方向',
    },
  },
];

// ============ 匹配和合并逻辑 ============

/**
 * 检查一条规则是否匹配用户的优势组合
 */
function matchRule(rule: ComboRule, userStrengths: StrengthId[]): boolean {
  const { requires, requiresAny, excludes } = rule.trigger;
  
  // 检查必须包含的优势（AND 关系）
  const hasAllRequired = requires.every(s => userStrengths.includes(s));
  if (!hasAllRequired) return false;
  
  // 检查至少包含其一的优势（OR 关系）
  if (requiresAny && requiresAny.length > 0) {
    const hasAnyRequired = requiresAny.some(s => userStrengths.includes(s));
    if (!hasAnyRequired) return false;
  }
  
  // 检查排除的优势
  if (excludes && excludes.length > 0) {
    const hasExcluded = excludes.some(s => userStrengths.includes(s));
    if (hasExcluded) return false;
  }
  
  return true;
}

/**
 * 获取用户优势组合匹配的所有规则
 */
export function getMatchedRules(userStrengths: StrengthId[]): ComboRule[] {
  return COMBO_RULES
    .filter(rule => matchRule(rule, userStrengths))
    .sort((a, b) => b.weight - a.weight); // 按权重降序排序
}

/**
 * 合并匹配规则为 ComboEffect
 * 去重、按权重排序
 */
export function mergeToComboEffect(rules: ComboRule[]): ComboEffect {
  const effect: ComboEffect = {
    amplifications: [],
    blindspots: [],
    conflicts: [],
    traps: [],
    corrections: [],
  };
  
  // 用于去重的 Set
  const seenEffects = new Set<string>();
  const seenCorrections = new Set<string>();
  
  for (const rule of rules) {
    const effectKey = `${rule.type}:${rule.effect.name}`;
    
    // 去重
    if (seenEffects.has(effectKey)) continue;
    seenEffects.add(effectKey);
    
    // 按类型分类
    switch (rule.type) {
      case 'amplify':
        effect.amplifications.push({
          name: rule.effect.name,
          description: rule.effect.description,
          weight: rule.weight,
        });
        break;
      case 'blindspot':
        effect.blindspots.push({
          name: rule.effect.name,
          symptom: rule.effect.symptom,
          weight: rule.weight,
        });
        break;
      case 'conflict':
        effect.conflicts.push({
          name: rule.effect.name,
          description: rule.effect.description,
          weight: rule.weight,
        });
        break;
      case 'trap':
        effect.traps.push({
          name: rule.effect.name,
          symptom: rule.effect.symptom,
          weight: rule.weight,
        });
        break;
    }
    
    // 收集纠偏建议（去重）
    const correctionKey = rule.correction.action;
    if (!seenCorrections.has(correctionKey)) {
      seenCorrections.add(correctionKey);
      effect.corrections.push({
        ...rule.correction,
        weight: rule.weight,
      });
    }
  }
  
  // 按权重排序
  effect.amplifications.sort((a, b) => b.weight - a.weight);
  effect.blindspots.sort((a, b) => b.weight - a.weight);
  effect.conflicts.sort((a, b) => b.weight - a.weight);
  effect.traps.sort((a, b) => b.weight - a.weight);
  effect.corrections.sort((a, b) => b.weight - a.weight);
  
  // corrections 只保留 Top 3
  effect.corrections = effect.corrections.slice(0, 3);
  
  return effect;
}

/**
 * 一步获取 ComboEffect（供外部调用）
 */
export function getComboEffect(userStrengths: StrengthId[]): ComboEffect {
  const matchedRules = getMatchedRules(userStrengths);
  return mergeToComboEffect(matchedRules);
}

// ============ Prompt 格式化 ============

/**
 * 格式化 ComboEffect 为 prompt 友好的文本
 */
export function formatComboEffectForPrompt(effect: ComboEffect): string {
  const sections: string[] = [];
  
  if (effect.amplifications.length > 0) {
    sections.push(`【组合放大效应】
${effect.amplifications.map(a => `- ${a.name}：${a.description}`).join('\n')}`);
  }
  
  if (effect.traps.length > 0) {
    sections.push(`【组合陷阱】
${effect.traps.map(t => `- ${t.name}：${t.symptom}`).join('\n')}`);
  }
  
  if (effect.blindspots.length > 0) {
    sections.push(`【组合盲区】
${effect.blindspots.map(b => `- ${b.name}：${b.symptom}`).join('\n')}`);
  }
  
  if (effect.conflicts.length > 0) {
    sections.push(`【组合冲突】
${effect.conflicts.map(c => `- ${c.name}：${c.description}`).join('\n')}`);
  }
  
  if (effect.corrections.length > 0) {
    sections.push(`【纠偏建议】
${effect.corrections.map((c, i) => `${i + 1}. 洞察：${c.insight}
   行动：${c.action}
   边界：${c.boundary}`).join('\n')}`);
  }
  
  return sections.join('\n\n');
}
