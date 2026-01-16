// 职业数据库
// 用于基于盖洛普优势进行职业匹配

import { StrengthId } from './gallup-strengths';

// ============================================================
// 职业类型定义
// ============================================================

/**
 * 职业信息
 */
export interface Career {
  /** 职业ID */
  id: string;
  /** 职业名称 */
  name: string;
  /** 职业分类 */
  category: CareerCategory;
  /** 职业描述 */
  description: string;
  /** 核心优势需求（至少3个，支持更多） */
  coreStrengths: StrengthId[];
  /** 辅助优势需求（可选） */
  secondaryStrengths?: StrengthId[];
  /** 优势使用方式说明 */
  strengthUsage: Array<{
    strengthId: StrengthId;
    description: string;
  }>;
  /** 职业发展建议 */
  developmentTips: string[];
  /** 需要注意的事项 */
  watchOut: string;
  /** 相关职业ID */
  relatedCareers: string[];
}

/**
 * 职业分类
 */
export type CareerCategory =
  | 'technology'      // 技术类
  | 'business'        // 商业类
  | 'creative'        // 创意类
  | 'service'         // 服务类
  | 'education'       // 教育类
  | 'healthcare'      // 医疗健康
  | 'leadership'      // 领导管理
  | 'operations';     // 运营执行

// ============================================================
// 职业数据库
// ============================================================

export const CAREER_DATABASE: Career[] = [
  // ========== 技术类 ==========
  {
    id: 'product-manager',
    name: '产品经理',
    category: 'technology',
    description: '负责产品的规划、设计和推进，协调技术、设计、运营等多个团队，确保产品成功落地。',
    coreStrengths: ['strategic', 'ideation', 'arranger'],
    secondaryStrengths: ['communication', 'woo' as StrengthId, 'empathy' as StrengthId],
    strengthUsage: [
      { strengthId: 'strategic', description: '规划产品长期路线图，预见市场趋势和用户需求变化' },
      { strengthId: 'ideation', description: '持续产生新功能想法和创新解决方案' },
      { strengthId: 'arranger', description: '协调多团队资源，确保项目按计划推进' },
      { strengthId: 'communication', description: '清晰传达产品愿景和需求给所有相关方' },
      { strengthId: 'woo' as StrengthId, description: '与用户、客户、利益相关者建立关系，收集反馈' },
      { strengthId: 'empathy', description: '理解用户痛点和需求，设计有同理心的产品体验' },
    ],
    developmentTips: [
      '培养技术理解力，虽然不需要会写代码，但要理解技术可行性',
      '学会数据驱动决策，用数据验证产品假设',
      '练习优先级判断，在资源有限的情况下做出最佳选择',
    ],
    watchOut: '容易陷入"什么都想做"的困境，需要学会说"不"，聚焦核心价值',
    relatedCareers: ['project-manager', 'business-analyst', 'ux-designer'],
  },
  {
    id: 'software-engineer',
    name: '软件工程师',
    category: 'technology',
    description: '设计、开发和维护软件系统，解决复杂的技术问题，创造数字化产品。',
    coreStrengths: ['analytical', 'learner', 'intellection'],
    secondaryStrengths: ['focus', 'discipline', 'restorative'],
    strengthUsage: [
      { strengthId: 'analytical', description: '分析问题根因，设计技术解决方案' },
      { strengthId: 'learner', description: '快速学习新技术和编程语言，保持技术前沿' },
      { strengthId: 'intellection', description: '深入思考系统架构和代码设计' },
      { strengthId: 'focus', description: '长时间专注编码，不被打断' },
      { strengthId: 'discipline', description: '遵循代码规范和开发流程' },
      { strengthId: 'restorative', description: '排查和修复 Bug，解决技术难题' },
    ],
    developmentTips: [
      '选择一个技术方向深耕（前端、后端、移动端、AI等）',
      '积累项目经验，实际动手做项目比看书更重要',
      '培养系统思维，理解软件架构的权衡和选择',
    ],
    watchOut: '容易陷入"技术完美主义"，需要在完美和按时交付之间找到平衡',
    relatedCareers: ['data-scientist', 'devops-engineer', 'technical-lead'],
  },
  {
    id: 'data-scientist',
    name: '数据科学家',
    category: 'technology',
    description: '从数据中提取洞察，构建预测模型，支持数据驱动的商业决策。',
    coreStrengths: ['analytical', 'input', 'strategic'],
    secondaryStrengths: ['learner', 'intellection', 'context'],
    strengthUsage: [
      { strengthId: 'analytical', description: '分析数据模式，验证假设，得出结论' },
      { strengthId: 'input', description: '收集和整理大量数据，建立知识库' },
      { strengthId: 'strategic', description: '从数据中发现趋势，为业务提供战略建议' },
      { strengthId: 'learner', description: '持续学习新的算法、工具和技术' },
      { strengthId: 'intellection', description: '深度思考复杂问题的数学本质' },
      { strengthId: 'context', description: '理解数据的历史背景，避免错误的解读' },
    ],
    developmentTips: [
      '掌握统计学和机器学习的基础理论',
      '学习 Python/R 等数据分析工具',
      '培养业务理解力，将技术洞察转化为商业价值',
    ],
    watchOut: '容易陷入"数据分析陷阱"，忘记数据背后的业务意义',
    relatedCareers: ['data-analyst', 'business-analyst', 'machine-learning-engineer'],
  },

  // ========== 商业类 ==========
  {
    id: 'business-analyst',
    name: '商业分析师',
    category: 'business',
    description: '分析业务需求，识别改进机会，推动业务流程优化和数字化转型。',
    coreStrengths: ['analytical', 'individualization', 'communication'],
    secondaryStrengths: ['empathy', 'strategic', 'harmony'],
    strengthUsage: [
      { strengthId: 'analytical', description: '分析业务数据，识别问题和机会' },
      { strengthId: 'individualization', description: '理解不同利益相关者的独特需求' },
      { strengthId: 'communication', description: '将复杂分析结果转化为易懂的洞察' },
      { strengthId: 'empathy', description: '理解各方的痛点和诉求' },
      { strengthId: 'strategic', description: '提出长期的业务改进建议' },
      { strengthId: 'harmony', description: '协调各方意见，推动共识达成' },
    ],
    developmentTips: [
      '学习业务建模和流程分析工具',
      '培养跨部门沟通能力',
      '积累行业知识，理解商业运作逻辑',
    ],
    watchOut: '容易成为"传声筒"，需要建立自己的分析和判断，不只是传递信息',
    relatedCareers: ['product-manager', 'management-consultant', 'operations-manager'],
  },
  {
    id: 'marketing-manager',
    name: '市场营销经理',
    category: 'business',
    description: '制定营销策略，管理品牌形象，推动产品销售和市场渗透。',
    coreStrengths: ['woo' as StrengthId, 'communication', 'competition'],
    secondaryStrengths: ['strategic', 'activator', 'significance'],
    strengthUsage: [
      { strengthId: 'woo' as StrengthId, description: '拓展客户和合作伙伴网络，建立品牌影响力' },
      { strengthId: 'communication', description: '创作吸引人的营销内容，传递品牌价值' },
      { strengthId: 'competition', description: '关注市场动态和竞品，制定差异化策略' },
      { strengthId: 'strategic', description: '规划长期品牌建设和市场进入策略' },
      { strengthId: 'activator', description: '快速启动营销活动，把握市场机会' },
      { strengthId: 'significance', description: '提升品牌知名度和声誉' },
    ],
    developmentTips: [
      '学习数字营销工具和数据分析',
      '培养创意思维和内容创作能力',
      '理解消费者心理学和购买决策过程',
    ],
    watchOut: '容易追求"短期的曝光"而忽视"长期的品牌建设"',
    relatedCareers: ['brand-manager', 'sales-manager', 'public-relations'],
  },
  {
    id: 'sales-manager',
    name: '销售经理',
    category: 'business',
    description: '带领销售团队，制定销售策略，达成销售目标，维护客户关系。',
    coreStrengths: ['woo', 'competition', 'responsibility'],
    secondaryStrengths: ['communication', 'activator', 'relator'],
    strengthUsage: [
      { strengthId: 'woo', description: '不断结识新客户，拓展销售机会' },
      { strengthId: 'competition', description: '驱动团队达成和超越销售目标' },
      { strengthId: 'responsibility', description: '对销售承诺负责，确保客户满意度' },
      { strengthId: 'communication', description: '有效进行销售谈判和演示' },
      { strengthId: 'activator', description: '快速跟进线索，推动交易达成' },
      { strengthId: 'relator', description: '与重点客户建立深度信任关系' },
    ],
    developmentTips: [
      '掌握销售技巧和谈判方法',
      '学习团队管理和激励',
      '深入理解产品和行业知识',
    ],
    watchOut: '容易陷入"只看短期业绩"的陷阱，需要平衡短期目标和长期客户价值',
    relatedCareers: ['account-manager', 'business-development', 'customer-success'],
  },

  // ========== 创意类 ==========
  {
    id: 'ux-designer',
    name: 'UX 设计师',
    category: 'creative',
    description: '设计用户友好的产品体验，通过用户研究和可用性测试优化产品设计。',
    coreStrengths: ['empathy', 'individualization', 'ideation'],
    secondaryStrengths: ['analytical', 'input', 'maximizer'],
    strengthUsage: [
      { strengthId: 'empathy', description: '理解用户感受和需求，设计有同理心的体验' },
      { strengthId: 'individualization', description: '为不同类型用户设计个性化方案' },
      { strengthId: 'ideation', description: '产生创新的设计概念和交互方案' },
      { strengthId: 'analytical', description: '分析用户行为数据，验证设计假设' },
      { strengthId: 'input', description: '收集和参考行业最佳实践和设计趋势' },
      { strengthId: 'maximizer', description: '不断优化细节，追求卓越的用户体验' },
    ],
    developmentTips: [
      '学习设计工具（Figma, Sketch 等）',
      '掌握用户研究方法（访谈、可用性测试等）',
      '积累设计作品集，展示你的设计思维过程',
    ],
    watchOut: '容易陷入"设计自我表达"，记住设计是为了解决问题，不是为了炫技',
    relatedCareers: ['product-designer', 'service-designer', 'ui-designer'],
  },
  {
    id: 'content-creator',
    name: '内容创作者',
    category: 'creative',
    description: '创作各类内容（文章、视频、播客等），建立个人品牌，影响和启发受众。',
    coreStrengths: ['ideation', 'communication', 'positivity'],
    secondaryStrengths: ['learner', 'input', 'connectedness'],
    strengthUsage: [
      { strengthId: 'ideation', description: '持续产生新的内容创意和主题' },
      { strengthId: 'communication', description: '将想法转化为吸引人的内容' },
      { strengthId: 'positivity', description: '传递正能量，建立积极的个人品牌' },
      { strengthId: 'learner', description: '快速学习新领域，创作知识性内容' },
      { strengthId: 'input', description: '收集和整理信息，为内容提供素材' },
      { strengthId: 'connectedness', description: '连接不同领域知识，产生独特洞察' },
    ],
    developmentTips: [
      '选择一个你真正热爱的垂直领域深耕',
      '培养讲故事的能力，好内容胜过硬推销',
      '建立内容发布节奏，保持持续输出',
    ],
    watchOut: '容易因为数据焦虑而改变风格，找到你独特的声音并坚持下去',
    relatedCareers: ['journalist', 'copywriter', 'social-media-manager'],
  },

  // ========== 服务类 ==========
  {
    id: 'consultant',
    name: '管理咨询顾问',
    category: 'service',
    description: '为企业提供战略和运营建议，解决复杂商业问题，推动组织变革。',
    coreStrengths: ['strategic', 'analytical', 'command'],
    secondaryStrengths: ['communication', 'self-assurance', 'responsibility'],
    strengthUsage: [
      { strengthId: 'strategic', description: '为客户制定长期战略和转型路线图' },
      { strengthId: 'analytical', description: '深入分析业务数据，找出问题和机会' },
      { strengthId: 'command', description: '在压力下领导项目，推动客户执行建议' },
      { strengthId: 'communication', description: '清晰传达复杂分析结果和建议' },
      { strengthId: 'self-assurance', description: '在不确定情况下坚持自己的判断和建议' },
      { strengthId: 'responsibility', description: '对交付质量负责，确保客户成功' },
    ],
    developmentTips: [
      '培养结构化思维和问题解决框架',
      '学习行业最佳实践和案例研究',
      '提升客户管理和沟通能力',
    ],
    watchOut: '容易成为"理论专家"，需要确保建议落地可行',
    relatedCareers: ['business-analyst', 'strategy-manager', 'management-consultant'],
  },
  {
    id: 'customer-success',
    name: '客户成功经理',
    category: 'service',
    description: '帮助客户实现产品价值，维护客户关系，推动续约和增购。',
    coreStrengths: ['relator', 'empathy', 'responsibility'],
    secondaryStrengths: ['harmony', 'individualization', 'developer'],
    strengthUsage: [
      { strengthId: 'relator', description: '与客户建立深度信任关系' },
      { strengthId: 'empathy', description: '理解客户痛点和期望' },
      { strengthId: 'responsibility', description: '对客户成功负责，跟进问题直到解决' },
      { strengthId: 'harmony', description: '协调内部资源，满足客户需求' },
      { strengthId: 'individualization', description: '为每个客户制定个性化的成功计划' },
      { strengthId: 'developer', description: '见证客户成长，帮助他们实现目标' },
    ],
    developmentTips: [
      '深入了解产品功能和行业应用场景',
      '培养客户管理和沟通能力',
      '学习数据驱动的方法来衡量客户成功',
    ],
    watchOut: '容易过度承诺，需要学会管理客户预期',
    relatedCareers: ['account-manager', 'customer-support', 'sales-manager'],
  },

  // ========== 教育类 ==========
  {
    id: 'teacher',
    name: '教师',
    category: 'education',
    description: '传授知识，启发学生，设计教学方案，帮助学生成长和发展。',
    coreStrengths: ['developer', 'empathy', 'individualization'],
    secondaryStrengths: ['communication', 'positivity', 'responsibility'],
    strengthUsage: [
      { strengthId: 'developer', description: '识别学生的潜力，帮助他们成长' },
      { strengthId: 'empathy', description: '理解学生的情感和需求' },
      { strengthId: 'individualization', description: '因材施教，为每个学生制定个性化学习方案' },
      { strengthId: 'communication', description: '清晰讲解复杂概念' },
      { strengthId: 'positivity', description: '传递学习热情，激励学生' },
      { strengthId: 'responsibility', description: '对学生的学习成果负责' },
    ],
    developmentTips: [
      '掌握教学方法和课程设计',
      '培养课堂管理和学生激励能力',
      '持续更新专业知识',
    ],
    watchOut: '容易过度付出导致职业倦怠，需要设定合理的边界',
    relatedCareers: ['corporate-trainer', 'education-consultant', 'curriculum-designer'],
  },
  {
    id: 'corporate-trainer',
    name: '企业培训师',
    category: 'education',
    description: '设计并交付企业培训课程，提升员工技能，推动组织学习和发展。',
    coreStrengths: ['developer', 'communication', 'woo'],
    secondaryStrengths: ['positivity', 'learner', 'arranger'],
    strengthUsage: [
      { strengthId: 'developer', description: '见证学员成长，帮助他们突破能力瓶颈' },
      { strengthId: 'communication', description: '生动讲解知识，确保学员理解' },
      { strengthId: 'woo', description: '快速与学员建立连接，创造良好学习氛围' },
      { strengthId: 'positivity', description: '传递积极能量，激励学员参与' },
      { strengthId: 'learner', description: '持续学习新的培训方法和内容' },
      { strengthId: 'arranger', description: '协调培训资源和学员安排' },
    ],
    developmentTips: [
      '学习成人学习理论和培训设计方法',
      '掌握公众演讲和演示技巧',
      '积累行业知识和实战案例',
    ],
    watchOut: '容易成为"表演者"，记住培训的目的是帮助学员学到东西',
    relatedCareers: ['learning-development', 'teacher', 'education-consultant'],
  },

  // ========== 医疗健康 ==========
  {
    id: 'doctor',
    name: '医生',
    category: 'healthcare',
    description: '诊断疾病，制定治疗方案，提供医疗服务，守护患者健康。',
    coreStrengths: ['restorative', 'responsibility', 'empathy'],
    secondaryStrengths: ['analytical', 'deliberative', 'learner'],
    strengthUsage: [
      { strengthId: 'restorative', description: '诊断和治疗疾病，帮助患者恢复健康' },
      { strengthId: 'responsibility', description: '对患者的生命和健康负责' },
      { strengthId: 'empathy', description: '理解患者的痛苦和焦虑，提供心理支持' },
      { strengthId: 'analytical', description: '分析症状和检查结果，做出诊断' },
      { strengthId: 'deliberative', description: '谨慎评估风险，做出治疗决策' },
      { strengthId: 'learner', description: '持续学习医学新知识和新技术' },
    ],
    developmentTips: [
      '扎实的医学基础知识是必须的',
      '培养临床思维和决策能力',
      '提升医患沟通技巧',
    ],
    watchOut: '容易过度投入工作导致职业倦怠，需要学会自我关怀',
    relatedCareers: ['nurse', 'medical-researcher', 'healthcare-consultant'],
  },
  {
    id: 'psychologist',
    name: '心理咨询师',
    category: 'healthcare',
    description: '提供心理咨询服务，帮助客户解决情绪和心理问题，促进个人成长。',
    coreStrengths: ['empathy', 'individualization', 'connectedness'],
    secondaryStrengths: ['learner', 'harmony', 'deliberative'],
    strengthUsage: [
      { strengthId: 'empathy', description: '深度理解客户的情感和内心世界' },
      { strengthId: 'individualization', description: '为每个客户制定个性化的咨询方案' },
      { strengthId: 'connectedness', description: '帮助客户找到生命中的意义和连接' },
      { strengthId: 'learner', description: '持续学习新的心理咨询技术和理论' },
      { strengthId: 'harmony', description: '创造安全和谐的咨询环境' },
      { strengthId: 'deliberative', description: '谨慎处理客户的深层心理问题' },
    ],
    developmentTips: [
      '系统的心理学理论学习是基础',
      '接受持续的个人体验和督导',
      '培养倾听和共情能力',
    ],
    watchOut: '容易过度卷入客户情绪，需要保持专业边界',
    relatedCareers: ['counselor', 'social-worker', 'coach'],
  },

  // ========== 领导管理 ==========
  {
    id: 'team-leader',
    name: '团队领导者',
    category: 'leadership',
    description: '带领团队达成目标，培养团队成员，建立高效的团队文化。',
    coreStrengths: ['command', 'responsibility', 'developer'],
    secondaryStrengths: ['arranger', 'individualization', 'communication'],
    strengthUsage: [
      { strengthId: 'command', description: '在关键时刻做出决策，推动团队前进' },
      { strengthId: 'responsibility', description: '对团队结果负责，不推卸责任' },
      { strengthId: 'developer', description: '识别和培养团队成员的潜力' },
      { strengthId: 'arranger', description: '合理分配任务和资源' },
      { strengthId: 'individualization', description: '了解每个成员的特点，因材施教' },
      { strengthId: 'communication', description: '清晰传达目标和期望' },
    ],
    developmentTips: [
      '学习领导力理论和实践',
      '培养情商和人际能力',
      '学会授权和信任团队',
    ],
    watchOut: '容易事必躬亲，需要学会通过他人达成目标',
    relatedCareers: ['manager', 'director', 'executive'],
  },
  {
    id: 'entrepreneur',
    name: '创业者',
    category: 'leadership',
    description: '创立并经营企业，承担风险，实现商业愿景。',
    coreStrengths: ['activator', 'strategic', 'self-assurance'],
    secondaryStrengths: ['responsibility', 'woo', 'adaptability'],
    strengthUsage: [
      { strengthId: 'activator', description: '快速将想法转化为行动' },
      { strengthId: 'strategic', description: '规划长期愿景和发展路径' },
      { strengthId: 'self-assurance', description: '在不确定性中坚持自己的判断' },
      { strengthId: 'responsibility', description: '对公司的所有决策和结果负责' },
      { strengthId: 'woo', description: '不断结识投资人、客户、合作伙伴' },
      { strengthId: 'adaptability', description: '灵活应对市场和业务的变化' },
    ],
    developmentTips: [
      '从小的项目开始，积累创业经验',
      '建立广泛的人脉网络',
      '学习财务管理、市场营销等基础商业知识',
    ],
    watchOut: '容易过度乐观，需要保持对风险的清醒认识',
    relatedCareers: ['founder', 'business-owner', 'intrapreneur'],
  },

  // ========== 运营执行 ==========
  {
    id: 'project-manager',
    name: '项目经理',
    category: 'operations',
    description: '规划、执行和监控项目，确保项目按时、按质、按预算交付。',
    coreStrengths: ['arranger', 'discipline', 'responsibility'],
    secondaryStrengths: ['focus', 'harmony', 'communication'],
    strengthUsage: [
      { strengthId: 'arranger', description: '协调多方资源，灵活调整项目计划' },
      { strengthId: 'discipline', description: '建立项目流程和规范' },
      { strengthId: 'responsibility', description: '对项目交付结果负责' },
      { strengthId: 'focus', description: '专注于关键任务和里程碑' },
      { strengthId: 'harmony', description: '协调各方冲突，推动团队协作' },
      { strengthId: 'communication', description: '及时汇报项目进展和风险' },
    ],
    developmentTips: [
      '学习项目管理方法论（PMP, Agile 等）',
      '培养风险管理和问题解决能力',
      '提升跨部门协调和沟通能力',
    ],
    watchOut: '容易成为"传声筒"，需要真正推动价值交付',
    relatedCareers: ['product-manager', 'program-manager', 'operations-manager'],
  },
  {
    id: 'operations-manager',
    name: '运营经理',
    category: 'operations',
    description: '设计和优化业务流程，提升运营效率，确保业务平稳运行。',
    coreStrengths: ['discipline', 'arranger', 'responsibility'],
    secondaryStrengths: ['analytical', 'harmony', 'consistency'],
    strengthUsage: [
      { strengthId: 'discipline', description: '建立运营流程和标准' },
      { strengthId: 'arranger', description: '合理配置资源，优化运营效率' },
      { strengthId: 'responsibility', description: '对运营结果负责' },
      { strengthId: 'analytical', description: '分析运营数据，发现改进机会' },
      { strengthId: 'harmony', description: '协调各部门，确保顺畅协作' },
      { strengthId: 'consistency', description: '确保运营标准和流程的一致性' },
    ],
    developmentTips: [
      '学习运营管理理论和工具',
      '培养数据思维，用数据驱动决策',
      '深入了解业务各环节的运作',
    ],
    watchOut: '容易陷入"流程陷阱"，记住流程是为了服务业务目标',
    relatedCareers: ['project-manager', 'supply-chain-manager', 'process-improvement'],
  },
];

// ============================================================
// 工具函数
// ============================================================

/**
 * 根据职业ID查找职业
 */
export function getCareerById(id: string): Career | undefined {
  return CAREER_DATABASE.find((career) => career.id === id);
}

/**
 * 根据分类获取职业列表
 */
export function getCareersByCategory(category: CareerCategory): Career[] {
  return CAREER_DATABASE.filter((career) => career.category === category);
}

/**
 * 获取所有职业分类
 */
export function getCareerCategories(): CareerCategory[] {
  return [
    'technology',
    'business',
    'creative',
    'service',
    'education',
    'healthcare',
    'leadership',
    'operations',
  ];
}

/**
 * 获取分类名称（中文）
 */
export function getCategoryName(category: CareerCategory): string {
  const names: Record<CareerCategory, string> = {
    technology: '技术类',
    business: '商业类',
    creative: '创意类',
    service: '服务类',
    education: '教育类',
    healthcare: '医疗健康',
    leadership: '领导管理',
    operations: '运营执行',
  };
  return names[category];
}
