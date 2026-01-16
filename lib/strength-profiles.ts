// StrengthProfile（单优势画像）
// 为每个优势定义：驱动力、代价区、最佳使用方式、调整建议
// 供 prompt 使用，帮助 AI 理解每个优势的能量特性

import { StrengthId } from './gallup-strengths';

// ============ 类型定义 ============

/**
 * 单优势画像
 * 描述一个优势的能量特性
 */
export interface StrengthProfile {
  id: StrengthId;
  name: string;
  domain: 'executing' | 'influencing' | 'relationship' | 'strategic';
  
  // 核心能量特性
  drive: string;           // 主驱动力：这个优势的核心动力是什么
  cost: string;            // 代价区：过度使用时会付出什么代价
  basement: string;        // 地下室状态：优势被误用时的表现
  
  // 使用指导
  bestUse: string;         // 最佳使用：什么情况下最省能量
  reframe: string;         // 调整建议：掉进地下室时如何调整
  
  // 能量信号
  energySignal: {
    charging: string;      // 充能信号：正在省能量的表现
    draining: string;      // 耗能信号：正在榨能量的表现
  };
}

// ============ 34个优势的 Profile 数据 ============

export const STRENGTH_PROFILES: Record<StrengthId, StrengthProfile> = {
  // ========== 执行力领域 (Executing) ==========
  
  focus: {
    id: 'focus',
    name: '专注',
    domain: 'executing',
    drive: '锁定目标，排除干扰',
    cost: '错过周边机会，显得固执',
    basement: '只盯着一件事，无法处理突发状况；对"不相关"的事缺乏耐心',
    bestUse: '需要深度工作、长期坚持的任务',
    reframe: '不是放弃专注，而是重新定义"什么值得专注"',
    energySignal: {
      charging: '在一件事上持续推进，感到心流状态',
      draining: '被迫同时处理多件事，感到烦躁和分裂',
    },
  },
  
  belief: {
    id: 'belief',
    name: '信仰',
    domain: 'executing',
    drive: '为意义而行动',
    cost: '难以接受与价值观冲突的任务',
    basement: '用价值观评判他人；拒绝"不够有意义"的工作',
    bestUse: '需要内在动力、长期坚持的事业',
    reframe: '不是降低标准，而是找到当前任务与信仰的连接点',
    energySignal: {
      charging: '做的事与内心价值一致，感到充实',
      draining: '做违背价值观的事，感到空虚和抗拒',
    },
  },
  
  consistency: {
    id: 'consistency',
    name: '公平',
    domain: 'executing',
    drive: '确保规则对所有人一致',
    cost: '缺乏灵活性，难以处理例外',
    basement: '过度追求"一视同仁"，忽略个体差异；用规则压制创新',
    bestUse: '需要建立标准、确保公平的场景',
    reframe: '不是放弃公平，而是区分"原则"和"规则"',
    energySignal: {
      charging: '看到规则被公正执行，感到安心',
      draining: '被迫破例或看到不公平，感到不适',
    },
  },
  
  deliberative: {
    id: 'deliberative',
    name: '审慎',
    domain: 'executing',
    drive: '降低风险，确保安全',
    cost: '决策缓慢，错过时机',
    basement: '过度分析导致行动瘫痪；用"还没想清楚"逃避决策',
    bestUse: '高风险决策、需要周全考虑的场景',
    reframe: '不是放弃审慎，而是设定"足够好"的决策标准',
    energySignal: {
      charging: '有充足时间评估风险，感到安全',
      draining: '被迫快速决策，感到焦虑和不安',
    },
  },
  
  achiever: {
    id: 'achiever',
    name: '成就',
    domain: 'executing',
    drive: '完成任务，获得成就感',
    cost: '永不满足，过度工作',
    basement: '用"忙碌"证明价值；无法享受已完成的成果',
    bestUse: '需要高产出、多任务并行的场景',
    reframe: '不是降低标准，而是重新定义"今天的完成"',
    energySignal: {
      charging: '每天完成任务清单，感到满足',
      draining: '一天结束时清单未完成，感到焦虑',
    },
  },
  
  restorative: {
    id: 'restorative',
    name: '排难',
    domain: 'executing',
    drive: '发现问题，解决问题',
    cost: '只看到问题，忽略已有的好',
    basement: '过度关注缺陷；把"没问题"当作"不够好"',
    bestUse: '需要诊断问题、修复系统的场景',
    reframe: '不是忽略问题，而是区分"必须解决"和"可以接受"',
    energySignal: {
      charging: '找到问题根源并修复，感到成就感',
      draining: '问题无法解决或被忽视，感到挫败',
    },
  },
  
  discipline: {
    id: 'discipline',
    name: '纪律',
    domain: 'executing',
    drive: '建立秩序，按计划执行',
    cost: '难以适应变化，显得刻板',
    basement: '用流程控制一切；当计划被打乱时崩溃',
    bestUse: '需要稳定执行、长期坚持的任务',
    reframe: '不是放弃纪律，而是为变化预留"弹性空间"',
    energySignal: {
      charging: '按计划推进，一切井然有序',
      draining: '计划被打乱，感到混乱和失控',
    },
  },
  
  arranger: {
    id: 'arranger',
    name: '统筹',
    domain: 'executing',
    drive: '优化配置，协调资源',
    cost: '过度调整，不断重新安排',
    basement: '把"调整"当作"进展"；无法接受"够好了"',
    bestUse: '需要协调多方资源、灵活调配的场景',
    reframe: '不是停止统筹，而是设定"调整截止点"',
    energySignal: {
      charging: '找到最优配置方案，感到掌控感',
      draining: '资源混乱或无法调配，感到沮丧',
    },
  },
  
  responsibility: {
    id: 'responsibility',
    name: '责任',
    domain: 'executing',
    drive: '承担承诺，说到做到',
    cost: '过度承担，无法拒绝',
    basement: '把所有人的期待都接住；用"责任"绑架自己',
    bestUse: '需要可靠执行、建立信任的场景',
    reframe: '不是逃避责任，而是重新定义"我的责任边界"',
    energySignal: {
      charging: '兑现承诺，感到踏实和被信任',
      draining: '承诺太多无法兑现，感到愧疚和压力',
    },
  },

  // ========== 影响力领域 (Influencing) ==========
  
  woo: {
    id: 'woo',
    name: '取悦',
    domain: 'influencing',
    drive: '赢得他人好感，建立新关系',
    cost: '关系广而不深，难以维持',
    basement: '把"被喜欢"当作目标；无法接受有人不喜欢自己',
    bestUse: '需要破冰、拓展人脉的场景',
    reframe: '不是停止取悦，而是选择"值得取悦的人"',
    energySignal: {
      charging: '成功赢得新朋友，感到社交满足',
      draining: '被拒绝或冷落，感到受伤',
    },
  },
  
  maximizer: {
    id: 'maximizer',
    name: '完美',
    domain: 'influencing',
    drive: '追求卓越，从好到更好',
    cost: '无法接受"够好"，永不满足',
    basement: '用"还不够好"拖延交付；对平庸的人/事缺乏耐心',
    bestUse: '需要精益求精、打磨细节的场景',
    reframe: '不是降低标准，而是区分"必须完美"和"可以够好"',
    energySignal: {
      charging: '把事情从好变成卓越，感到满足',
      draining: '被迫接受平庸的结果，感到不适',
    },
  },
  
  communication: {
    id: 'communication',
    name: '沟通',
    domain: 'influencing',
    drive: '用语言传递想法，影响他人',
    cost: '说得太多，听得太少',
    basement: '把"说清楚"当作"对方理解了"；用表达替代倾听',
    bestUse: '需要演讲、写作、说服的场景',
    reframe: '不是减少沟通，而是增加"确认对方理解"的环节',
    energySignal: {
      charging: '把复杂的事说清楚，感到成就感',
      draining: '无法表达或被误解，感到憋屈',
    },
  },
  
  competition: {
    id: 'competition',
    name: '竞争',
    domain: 'influencing',
    drive: '比较、超越、赢',
    cost: '把一切变成比赛，难以合作',
    basement: '输不起；把队友当对手；用"赢"定义自我价值',
    bestUse: '需要明确输赢、有排名的场景',
    reframe: '不是放弃竞争，而是选择"值得赢的赛道"',
    energySignal: {
      charging: '在竞争中获胜，感到兴奋',
      draining: '输掉比赛或没有对手，感到沮丧',
    },
  },
  
  command: {
    id: 'command',
    name: '统率',
    domain: 'influencing',
    drive: '掌控局面，带领他人',
    cost: '显得强势，压制他人',
    basement: '控制一切；无法接受不同意见；用权力替代影响力',
    bestUse: '需要快速决策、危机处理的场景',
    reframe: '不是放弃掌控，而是区分"必须控制"和"可以放手"',
    energySignal: {
      charging: '带领团队完成挑战，感到掌控感',
      draining: '失去控制或被忽视，感到无力',
    },
  },
  
  'self-assurance': {
    id: 'self-assurance',
    name: '自信',
    domain: 'influencing',
    drive: '相信自己的判断和能力',
    cost: '显得自大，难以接受反馈',
    basement: '拒绝质疑；把"我觉得"当作"事实"',
    bestUse: '需要在不确定中做决策的场景',
    reframe: '不是怀疑自己，而是区分"自信"和"确认偏误"',
    energySignal: {
      charging: '按自己的判断行动并成功，感到确信',
      draining: '被迫听从他人的判断，感到不适',
    },
  },
  
  activator: {
    id: 'activator',
    name: '行动',
    domain: 'influencing',
    drive: '立即开始，用行动推动',
    cost: '冲动行事，缺乏计划',
    basement: '用"先动起来"逃避思考；把"在做"当作"在进展"',
    bestUse: '需要打破僵局、快速启动的场景',
    reframe: '不是停止行动，而是增加"行动前的5分钟思考"',
    energySignal: {
      charging: '把想法变成行动，感到推进感',
      draining: '被迫等待或反复讨论，感到焦躁',
    },
  },
  
  significance: {
    id: 'significance',
    name: '追求',
    domain: 'influencing',
    drive: '被认可，产生影响',
    cost: '过度在意他人评价',
    basement: '把"被认可"当作"有价值"；没有掌声就没有动力',
    bestUse: '需要展示成果、获得认可的场景',
    reframe: '不是放弃追求，而是建立"内在认可"标准',
    energySignal: {
      charging: '工作被认可、产生影响，感到有价值',
      draining: '被忽视或成果不被认可，感到沮丧',
    },
  },

  // ========== 关系建立领域 (Relationship Building) ==========
  
  individualization: {
    id: 'individualization',
    name: '个别',
    domain: 'relationship',
    drive: '看到每个人的独特之处',
    cost: '难以标准化，效率低',
    basement: '过度定制化；无法接受"一刀切"的效率',
    bestUse: '需要因人施策、个性化服务的场景',
    reframe: '不是忽略差异，而是区分"必须个别"和"可以标准"',
    energySignal: {
      charging: '为不同的人提供定制方案，感到满足',
      draining: '被迫用同一套方法对待所有人，感到不适',
    },
  },
  
  relator: {
    id: 'relator',
    name: '交往',
    domain: 'relationship',
    drive: '深化关系，建立亲密连接',
    cost: '圈子小，难以拓展',
    basement: '只在舒适圈里；用"深度"逃避"广度"',
    bestUse: '需要建立长期信任、深度合作的场景',
    reframe: '不是放弃深度，而是为"新关系"预留入口',
    energySignal: {
      charging: '与亲密的人深度交流，感到连接',
      draining: '被迫应酬陌生人，感到疲惫',
    },
  },
  
  developer: {
    id: 'developer',
    name: '伯乐',
    domain: 'relationship',
    drive: '看到他人潜力，帮助成长',
    cost: '过度投入他人，忽略自己',
    basement: '用"帮助别人"逃避自己的成长；被"烂泥扶不上墙"消耗',
    bestUse: '需要培养人才、辅导他人的场景',
    reframe: '不是停止帮助，而是选择"值得培养的人"',
    energySignal: {
      charging: '看到他人成长，感到成就感',
      draining: '培养的人没有进步，感到挫败',
    },
  },
  
  empathy: {
    id: 'empathy',
    name: '体谅',
    domain: 'relationship',
    drive: '感受他人情绪，理解处境',
    cost: '被他人情绪淹没，边界模糊',
    basement: '把别人的情绪当作自己的；无法拒绝情绪求助',
    bestUse: '需要理解他人、提供情感支持的场景',
    reframe: '不是关闭共情，而是建立"情绪边界"',
    energySignal: {
      charging: '帮助他人感到被理解，感到连接',
      draining: '被负面情绪淹没，感到疲惫',
    },
  },
  
  connectedness: {
    id: 'connectedness',
    name: '关联',
    domain: 'relationship',
    drive: '看到事物之间的联系',
    cost: '过度解读，看到不存在的关联',
    basement: '把巧合当作命运；用"相信"替代"验证"',
    bestUse: '需要整合资源、建立联盟的场景',
    reframe: '不是否定关联，而是区分"真实联系"和"想象联系"',
    energySignal: {
      charging: '发现意外的联系，感到意义感',
      draining: '感到孤立或断裂，感到空虚',
    },
  },
  
  include: {
    id: 'include',
    name: '包容',
    domain: 'relationship',
    drive: '让每个人都被接纳',
    cost: '无法排除不合适的人',
    basement: '把"包容"变成"没有标准"；无法说"你不适合"',
    bestUse: '需要建立归属感、整合多元的场景',
    reframe: '不是排斥任何人，而是区分"邀请参与"和"核心成员"',
    energySignal: {
      charging: '让被忽视的人感到被接纳，感到温暖',
      draining: '看到有人被排斥，感到不适',
    },
  },
  
  harmony: {
    id: 'harmony',
    name: '和谐',
    domain: 'relationship',
    drive: '避免冲突，寻求共识',
    cost: '逃避必要的冲突，无法坚持立场',
    basement: '把"没有冲突"当作"关系好"；用妥协换取和平',
    bestUse: '需要调解矛盾、建立共识的场景',
    reframe: '不是制造冲突，而是区分"必要的冲突"和"可以避免的冲突"',
    energySignal: {
      charging: '化解矛盾，达成共识，感到平静',
      draining: '身处冲突中或被迫选边站，感到痛苦',
    },
  },
  
  positivity: {
    id: 'positivity',
    name: '积极',
    domain: 'relationship',
    drive: '传递正能量，激励他人',
    cost: '回避负面情绪，显得不够深刻',
    basement: '用"积极"压制真实感受；无法处理悲伤和失望',
    bestUse: '需要激励团队、营造氛围的场景',
    reframe: '不是变得消极，而是允许"暂时的低落"',
    energySignal: {
      charging: '让氛围变好，感到快乐',
      draining: '身处负面环境，感到被拖累',
    },
  },
  
  adaptability: {
    id: 'adaptability',
    name: '适应',
    domain: 'relationship',
    drive: '顺应变化，活在当下',
    cost: '缺乏长期规划，被动应对',
    basement: '用"随机应变"逃避规划；把"没计划"当作"灵活"',
    bestUse: '需要应对变化、处理突发的场景',
    reframe: '不是变得死板，而是为"不变的目标"设定锚点',
    energySignal: {
      charging: '灵活应对变化，感到自如',
      draining: '被迫按死板计划执行，感到束缚',
    },
  },

  // ========== 战略思维领域 (Strategic Thinking) ==========
  
  analytical: {
    id: 'analytical',
    name: '分析',
    domain: 'strategic',
    drive: '用数据和逻辑验证',
    cost: '过度分析，延迟行动',
    basement: '用"数据不够"拖延决策；对"直觉"缺乏信任',
    bestUse: '需要严谨论证、排除错误的场景',
    reframe: '不是放弃分析，而是设定"分析截止点"',
    energySignal: {
      charging: '找到数据支撑的答案，感到确定',
      draining: '被迫在没有数据时做决策，感到不安',
    },
  },
  
  futuristic: {
    id: 'futuristic',
    name: '前瞻',
    domain: 'strategic',
    drive: '看到未来可能性',
    cost: '忽略当下，活在幻想中',
    basement: '用"未来愿景"逃避当下行动；无法接受"现实的限制"',
    bestUse: '需要规划愿景、激励长期目标的场景',
    reframe: '不是放弃愿景，而是为愿景设定"今天的第一步"',
    energySignal: {
      charging: '描绘令人兴奋的未来，感到希望',
      draining: '被困在琐碎的当下，感到窒息',
    },
  },
  
  context: {
    id: 'context',
    name: '回顾',
    domain: 'strategic',
    drive: '从过去中寻找答案',
    cost: '过度依赖历史，抗拒新事物',
    basement: '用"以前怎么做"替代"现在该怎么做"；无法接受没有先例的事',
    bestUse: '需要总结经验、避免重复错误的场景',
    reframe: '不是忽略历史，而是区分"值得参考"和"已经过时"',
    energySignal: {
      charging: '从历史中找到解决方案，感到踏实',
      draining: '面对全新的问题没有参考，感到不安',
    },
  },
  
  learner: {
    id: 'learner',
    name: '学习',
    domain: 'strategic',
    drive: '不断学习新知识',
    cost: '学而不用，永远在准备',
    basement: '用"还要再学"逃避行动；把"学习"当作"进步"',
    bestUse: '需要快速掌握新领域的场景',
    reframe: '不是停止学习，而是设定"学够了就行动"的标准',
    energySignal: {
      charging: '学到新东西，感到成长',
      draining: '重复已经会的事，感到无聊',
    },
  },
  
  intellection: {
    id: 'intellection',
    name: '思维',
    domain: 'strategic',
    drive: '深度思考，内省',
    cost: '过度内耗，与行动脱节',
    basement: '用"想清楚"拖延行动；把"思考"当作"做了"',
    bestUse: '需要深度分析、独立思考的场景',
    reframe: '不是停止思考，而是为思考设定"输出节点"',
    energySignal: {
      charging: '有独处时间深度思考，感到清晰',
      draining: '被打断或无法独处，感到混乱',
    },
  },
  
  strategic: {
    id: 'strategic',
    name: '战略',
    domain: 'strategic',
    drive: '找到最优路径',
    cost: '过度规划，忽略执行',
    basement: '永远在找"更好的路"，无法在一条路上坚持；用"战略"替代"行动"',
    bestUse: '需要在复杂局面中做选择的场景',
    reframe: '不是放弃战略，而是设定"选定后不再换路"的节点',
    energySignal: {
      charging: '找到清晰的路径，感到确定',
      draining: '被困在没有选择的执行中，感到窒息',
    },
  },
  
  input: {
    id: 'input',
    name: '搜集',
    domain: 'strategic',
    drive: '收集信息，储备资源',
    cost: '信息囤积，无法决策',
    basement: '用"再收集一下"拖延决策；把"收集"当作"行动"',
    bestUse: '需要整合资源、建立知识库的场景',
    reframe: '不是停止搜集，而是设定"信息够用"的标准',
    energySignal: {
      charging: '发现有用的信息并收藏，感到充实',
      draining: '被迫在信息不足时决策，感到不安',
    },
  },
  
  ideation: {
    id: 'ideation',
    name: '理念',
    domain: 'strategic',
    drive: '产生新想法，建立新连接',
    cost: '想法太多，落地太少',
    basement: '用"新想法"逃避"旧任务"；把"有想法"当作"有进展"',
    bestUse: '需要创新、头脑风暴的场景',
    reframe: '不是压制想法，而是为想法设定"落地检验"标准',
    energySignal: {
      charging: '产生新想法，感到兴奋',
      draining: '被困在重复的执行中，感到无聊',
    },
  },
};

// ============ 工具函数 ============

/**
 * 根据优势ID获取Profile
 */
export function getStrengthProfile(id: StrengthId): StrengthProfile | undefined {
  return STRENGTH_PROFILES[id];
}

/**
 * 批量获取 Profile（供 prompt 使用）
 */
export function getStrengthProfiles(ids: StrengthId[]): StrengthProfile[] {
  return ids
    .map(id => STRENGTH_PROFILES[id])
    .filter((p): p is StrengthProfile => p !== undefined);
}

/**
 * 格式化为 prompt 友好的文本
 */
export function formatProfileForPrompt(profile: StrengthProfile): string {
  return `【${profile.name}】
- 驱动力：${profile.drive}
- 代价区：${profile.cost}
- 地下室：${profile.basement}
- 最佳使用：${profile.bestUse}
- 调整建议：${profile.reframe}
- 充能信号：${profile.energySignal.charging}
- 耗能信号：${profile.energySignal.draining}`;
}
