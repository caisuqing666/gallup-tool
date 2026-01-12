// Mock 数据生成器（用于演示）
// 核心理念：不补短板，用优势解决问题（反直觉）

import { ResultData } from './types';
import { ALL_STRENGTHS, StrengthId } from './gallup-strengths';
import { ScenarioId } from './scenarios';
// 导入规则判断函数（已抽取到 mock-rules.ts 中）
import {
  detectStrengthConflicts,
  detectBasementStrength,
  isDemoCase,
  getStrengthDetails,
  getStrengthNames,
  generateAdvantageTips,
  DOMAIN_CONFLICTS,
} from './mock-rules';

// 重新导出规则函数，保持向后兼容
export { detectStrengthConflicts, detectBasementStrength, isDemoCase, generateAdvantageTips, DOMAIN_CONFLICTS };

// 典型案例1："信息黑洞"到"决策漏斗"（搜集+分析+责任）
function generateInfoOverloadCase(
  scenario: string,
  strengths: string[],
  confusion: string
): ResultData {
  return {
    highlight: '从"信息黑洞"到"决策漏斗"的清理指令',
    judgment: '你的"搜集"优势正在过载。它本该为你提供素材，现在却成了你逃避决策的避风港（地下室状态）。',
    strengthBasement: '搜集',
    strengthConflicts: ['「搜集」与「分析」'],
    blindspot: '你以为再多看一份文档就能做决定，其实你已经分析过度了。现在的阻碍不是缺乏信息，而是你的"责任"感让你害怕错过任何细节。',
    actions: [
      '物理阻断：删除浏览器 50% 以上的标签页，只留 3 个',
      '优势位移：启动"分析"优势，不看内容，只看权重。给待办事项标上 1/2/3',
      '瞬间止损：告诉团队，下午 3 点前我不再接收任何新信息，哪怕它看起来很重要'
    ],
    advantageTips: {
      instruction: '如果你明天还要处理类似的事，请试着把你的「搜集」优势关掉 50%，把「专注」优势调高 80%。',
      reduce: [{
        strength: '搜集',
        percentage: 50,
        reason: '搜集信息过多会导致决策瘫痪，需要降低信息收集强度'
      }],
      increase: [{
        strength: '专注',
        percentage: 80,
        reason: '专注优势能帮你聚焦核心决策点，提升决策效率'
      }]
    }
  };
}

// 典型案例2："接单机器"到"架构师"（责任过载）
function generateResponsibilityOverloadCase(
  scenario: ScenarioId | string,
  strengths: StrengthId[] | string[],
  confusion: string
): ResultData {
  const strengthDetails = strengths
    .slice(0, 5)
    .map(id => ALL_STRENGTHS.find(s => s.id === id))
    .filter((s): s is typeof ALL_STRENGTHS[number] => s !== undefined);
  
  const strengthNames = strengthDetails.map(s => s.name);
  const firstStrength = strengthNames[0] || '责任';
  const secondStrength = strengthNames[1] || '战略';
  
  return {
    highlight: '从"接单机器"到"架构师"的优势重启指令',
    judgment: `你的"${firstStrength}"优势目前正处于 Basement（地下室状态），它与你的"${secondStrength}"优势发生了高频内耗。你试图用"${firstStrength}"去扛住所有琐事，却挤压了"${secondStrength}"去梳理大局的空间。`,
    strengthBasement: firstStrength,
    strengthConflicts: [`「${firstStrength}」与「${secondStrength}」`],
    blindspot: `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的转型期，你对烂事的"负责"，就是对你未来目标的"不负责"。`,
    actions: [
      `优势置换：停止使用"${firstStrength}"去道歉和兜底，试着使用你的"${secondStrength}"优势，给老板发一份《当前项目资源过载风险分析报告》`,
      `物理隔绝：在上午 10:00-11:00 彻底关闭即时通讯工具，把你的"${strengthNames[2] || '专注'}"优势留给那件"最重要但没人催"的事`,
      `定义终点：每天下班前，用你的"${secondStrength}"优势列出明天绝对不碰的 3 件事，而不是要做的事`
    ],
    advantageTips: {
      instruction: `如果你明天还要处理类似的事，请试着把你的「${firstStrength}」优势关掉 50%，把「${secondStrength}」优势调高 80%。`,
      reduce: [{
        strength: firstStrength,
        percentage: 50,
        reason: '被过度使用导致决策瘫痪，需要降低接单强度'
      }],
      increase: [{
        strength: secondStrength,
        percentage: 80,
        reason: '需要战略思维来定义"什么是重要的"'
      }]
    }
  };
}

export function generateMockResult(
  scenario: ScenarioId | string,
  strengths: StrengthId[] | string[],
  confusion: string
): ResultData {
  // 检测是否是典型案例
  const demoCase = isDemoCase(confusion, strengths);
  
  // 如果是典型案例，返回预设的优化方案
  if (demoCase === 'info-overload') {
    return generateInfoOverloadCase(scenario, strengths, confusion);
  }
  
  if (demoCase === 'responsibility-overload') {
    return generateResponsibilityOverloadCase(scenario, strengths, confusion);
  }
  // 获取优势名称和详细信息（使用抽取的纯函数）
  const strengthDetails = getStrengthDetails(strengths);
  const strengthNames = getStrengthNames(strengthDetails);
  const firstStrength = strengthNames[0] || '责任';
  const secondStrength = strengthNames[1] || '战略';
  const thirdStrength = strengthNames[2] || '分析';
  
  // 丰富的高光词条模板（更有创意和情绪共鸣）
  const highlightTemplates: Record<string, string[]> = {
    'work-decision': [
      `从"救火队员"到"战略大脑"的转型指令`,
      `"${firstStrength}"与"${secondStrength}"的优先级博弈`,
      `让"${firstStrength}"重回决策中心`,
      `"${firstStrength}"优势的觉醒时刻`,
      `停止用"${firstStrength}"做所有事：重新定义边界`,
    ],
    'career-transition': [
      `基于"${firstStrength}"优势的赛道切换方案`,
      `从"${firstStrength}"看你的下一个战场`,
      `"${firstStrength}"+"${secondStrength}"的组合拳`,
      `"${firstStrength}"优势的迁移路径`,
      `不再补短板：用"${firstStrength}"重新定义你的赛道`,
    ],
    'efficiency': [
      `用"${firstStrength}"优势重构你的效率系统`,
      `从"透支模式"到"优势驱动"的转换`,
      `"${firstStrength}"的效率密码`,
      `当"${firstStrength}"掉进地下室：效率崩塌的真相`,
      `停止内耗：让"${firstStrength}"优势回到高峰`,
    ],
    'communication': [
      `用"${thirdStrength || firstStrength}"优势重新定义沟通`,
      `从"心累"到"精准表达"的${firstStrength}路径`,
      `"${firstStrength}"+"${secondStrength}"的沟通升级`,
      `不要学沟通课：用"${thirdStrength || firstStrength}"优势重构表达`,
      `"${firstStrength}"优势的沟通觉醒：不再硬撑`,
    ],
  };
  
  const highlights = highlightTemplates[scenario] || highlightTemplates['work-decision'];
  const highlight = highlights[Math.floor(Math.random() * highlights.length)];
  
  // 智能检测优势冲突
  const strengthConflicts = detectStrengthConflicts(strengthDetails);
  
  // 智能检测地下室状态
  const strengthBasement = detectBasementStrength(scenario, strengthDetails, confusion);
  
  // 根据场景生成系统诊断（更精准，包含Basement和高频内耗）
  const judgmentTemplates: Record<string, (s: string[], basement?: string, conflicts?: string[]) => string> = {
    'work-decision': (s, basement, conflicts) => {
      if (basement && conflicts && conflicts.length > 0) {
        return `你的"${basement}"优势目前正处于 Basement（地下室状态），它与你的"${s[1] || '战略'}"优势发生了高频内耗。你试图用"${basement}"去扛住所有琐事，却挤压了"${s[1] || '战略'}"去梳理大局的空间。`;
      } else if (basement) {
        return `你的"${basement}"优势目前正处于 Basement（地下室状态），被过度激活导致决策瘫痪。同时，"${s[1] || '战略'}"优势被压制，无法发挥战略思维的价值。`;
      } else {
        return `你的"${s[0]}"优势被过度激活，在决策场景中导致"什么都想抓住"的决策瘫痪。同时，"${s[1] || '战略'}"优势被压制，无法发挥战略思维的价值。`;
      }
    },
    'career-transition': (s, basement, conflicts) => {
      if (basement && conflicts && conflicts.length > 0) {
        return `你的"${basement}"优势目前正处于 Basement（地下室状态），它与你的"${s[1] || '战略'}"优势发生了高频内耗。你试图用"${basement}"优势去填补"${s[1] || '战略'}"的空白，却导致两者都无法发挥价值。`;
      } else if (basement) {
        return `你的"${basement}"优势目前正处于 Basement（地下室状态），你正在用它解决需要"${s[1] || '战略思维'}"优势的问题。这不是能力不足，而是优势匹配错位。`;
      } else {
        return `你正在用"${s[0]}"优势解决需要"${s[1] || '战略思维'}"优势的问题。这不是能力不足，而是优势匹配错位。`;
      }
    },
    'efficiency': (s, basement) => {
      if (basement) {
        return `你的"${basement}"优势目前正处于 Basement（地下室状态），你陷入"用劣势工作"的消耗循环。真正的效率问题不是时间管理，而是优势被误用了。`;
      } else {
        return `"${s[0]}"优势掉进了地下室，你陷入"用劣势工作"的消耗循环。真正的效率问题不是时间管理，而是优势被误用了。`;
      }
    },
    'communication': (s, basement) => {
      if (basement) {
        return `你的"${basement}"优势在沟通中被误用，目前正处于 Basement（地下室状态），导致"费力不讨好"的困境。你没有沟通优势，但可以用"${s[2] || s[1] || '分析'}"优势重新定义沟通方式。`;
      } else {
        return `你的"${s[0]}"优势在沟通中被误用，导致"费力不讨好"的困境。你没有沟通优势，但可以"${s[2] || s[1] || '分析'}"优势重新定义沟通方式。`;
      }
    },
  };
  
  const judgmentGenerator = judgmentTemplates[scenario] || judgmentTemplates['work-decision'];
  const judgment = judgmentGenerator(strengthNames, strengthBasement, strengthConflicts);
  
  // 强化反直觉建议（更具体的、可操作的描述，符合原型风格）
  const actionTemplates: Record<string, (strengths: string[]) => string[]> = {
    'work-decision': (s) => [
      `优势置换：停止使用"${s[0]}"去接所有事，试着使用你的"${s[1] || '战略'}"优势，给老板发一份《当前工作优先级分析报告》，用"战略"优势重新定义"什么是重要的"`,
      `物理隔绝：在上午 10:00-11:00 彻底关闭即时通讯工具，把你的"${s[2] || '专注'}"优势留给那件"最重要但没人催"的事`,
      `定义终点：每天下班前，用你的"${s[1] || '战略'}"优势列出明天绝对不碰的 3 件事，而不是要做的事`,
    ],
    'career-transition': (s) => [
      `优势置换：停止使用"${s[0]}"去硬撑当前赛道，试着使用你的"${s[1] || '战略'}"优势，给未来的自己发一份《赛道选择分析报告》，用"战略"优势分析哪些赛道能让"${s[0]}"优势发挥最大价值`,
      `物理隔绝：在每周二下午 2:00-4:00 彻底关闭当前工作的所有通知，把你的"${s[2] || '分析'}"优势留给"探索新赛道"这件事`,
      `定义终点：每周日晚上，用你的"${s[1] || '战略'}"优势列出下周绝对不接的 3 类项目，而不是要尝试的项目`,
    ],
    'efficiency': (s) => [
      `优势置换：停止使用"${s[0]}"去做所有事，试着使用你的"${s[1] || '战略'}"优势，给自己的工作流程发一份《效率重构方案》，用"战略"优势重新定义工作流程`,
      `物理隔绝：在每天上午 9:00-11:00 彻底关闭所有即时通讯工具，把你的"${s[2] || '专注'}"优势留给那件"最重要但没人催"的核心任务`,
      `定义终点：每天下班前，用你的"${s[1] || '战略'}"优势列出明天绝对不碰的 3 件事，而不是要做的事。这是用优势重新定义效率，而不是提升时间管理`,
    ],
    'communication': (s) => [
      `优势置换：停止使用"沟通"去道歉和解释，试着使用你的"${s[2] || s[1] || '分析'}"优势，给老板/同事发一份《项目资源过载风险分析报告》，用"分析"优势重新定义沟通方式`,
      `物理隔绝：在重要沟通前，用你的"${s[2] || s[1] || '分析'}"优势写好逻辑大纲，而不是直接用"沟通"去硬撑`,
      `定义终点：每次沟通后，用你的"${s[1] || '战略'}"优势列出 3 个"这次沟通没有达成"的点，而不是继续用"沟通"去说服`,
    ],
  };
  
  const actionGenerator = actionTemplates[scenario] || actionTemplates['work-decision'];
  const actions = actionGenerator(strengthNames);
  
  // 生成优势误区（盲区）- 更强调"反直觉视角"，符合原型风格
  const blindspotTemplates: Record<string, (_s: string[]) => string> = {
    'work-decision': (_s) => `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的决策场景中，你对所有事的"负责"，就是对你真正重要目标的"不负责"。`,
    'career-transition': (_s) => `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的转型期，你对烂事的"负责"，就是对你未来目标的"不负责"。`,
    'efficiency': (s) => `你不需要变得更"快"，你需要变得更"准"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"做更多事"等同于"高效"。在当前的效率困境中，你试图提升时间管理（补短板），其实是"${s[0]}"优势被误用了。`,
    'communication': (s) => `你不需要变得更"会说话"，你需要变得更"会选话"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"多说多解释"等同于"有效沟通"。在当前的沟通困境中，你试图提升沟通能力（补短板），但其实应该用"${s[2] || s[0]}"优势去重构沟通方式。`,
  };
  
  const blindspotGenerator = blindspotTemplates[scenario] || blindspotTemplates['work-decision'];
  const blindspot = blindspotGenerator(strengthNames);
  
  // 生成优势锦囊（旋钮调节式建议）- 使用 mock-rules.ts 中的纯函数
  const advantageTips = generateAdvantageTips(
    scenario,
    strengthDetails,
    strengthNames,
    strengthBasement,
    strengthConflicts,
    confusion
  );
  
  return {
    highlight,
    judgment,
    strengthConflicts: strengthConflicts.length > 0 ? strengthConflicts : undefined,
    strengthBasement,
    blindspot,
    actions,
    advantageTips,
  };
}

// 生成优势锦囊（旋钮调节式建议）已在 mock-rules.ts 中实现为纯函数
// mock-data.ts 直接使用 mock-rules.ts 中的版本，确保可测试性
