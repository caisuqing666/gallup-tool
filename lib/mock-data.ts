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
    highlight: '停止看信息，开始做选择|把现在的混乱，收敛成一个能推进的决定。',
    judgment: '你的"搜集"优势正在过载。它本该为你提供素材，现在却成了你逃避决策的避风港。你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。',
    strengthBasement: '搜集',
    strengthConflicts: ['「搜集」与「分析」'],
    blindspot: '你以为再多看一份文档就能做决定，其实你已经分析过度了。现在的阻碍不是缺乏信息，而是你的"责任"感让你害怕错过任何细节。',
    actions: [
      '物理阻断：删除浏览器 50% 以上的标签页，只留 3 个',
      '优势位移：启动"分析"优势，不看内容，只看权重。给待办事项标上 1/2/3',
      '瞬间止损：告诉团队，下午 3 点前我不再接收任何新信息，哪怕它看起来很重要'
    ],
    advantageTips: {
      instruction: '把你的「搜集」优势关掉 50%，把「专注」优势调高 80%。',
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
    highlight: '停止接所有事，开始选重点|把你现在的忙碌，收敛成一个能推进的方向。',
    judgment: `你的"${firstStrength}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。它与你的"${secondStrength}"优势在互相拉扯——你在反复想，但没有更靠近答案。你试图用"${firstStrength}"去扛住所有琐事，却挤压了"${secondStrength}"去梳理大局的空间。`,
    strengthBasement: firstStrength,
    strengthConflicts: [`「${firstStrength}」与「${secondStrength}」`],
    blindspot: `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的转型期，你对烂事的"负责"，就是对你未来目标的"不负责"。`,
    actions: [
      `优势置换：停止使用"${firstStrength}"去道歉和兜底，试着使用你的"${secondStrength}"优势，给老板发一份《当前项目资源过载风险分析报告》`,
      `物理隔绝：在上午 10:00-11:00 彻底关闭即时通讯工具，把你的"${strengthNames[2] || '专注'}"优势留给那件"最重要但没人催"的事`,
      `定义终点：每天下班前，用你的"${secondStrength}"优势列出明天绝对不碰的 3 件事，而不是要做的事`
    ],
    advantageTips: {
      instruction: `把你的「${firstStrength}」优势关掉 50%，把「${secondStrength}」优势调高 80%。`,
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
  
  // 高光词条模板（人话版：标题|辅助说明）
  const highlightTemplates: Record<string, string[]> = {
    'work-decision': [
      `停止看信息，开始做选择|把现在的混乱，收敛成一个能推进的决定。`,
      `停止接所有事，开始选重点|把你现在的忙碌，收敛成一个能推进的方向。`,
      `停止想所有可能，开始选一个|把你现在的犹豫，收敛成一个能推进的选择。`,
      `停止等所有信息，开始做决定|把你现在的等待，收敛成一个能推进的行动。`,
      `停止扛所有责任，开始选边界|把你现在的负担，收敛成一个能推进的范围。`,
    ],
    'career-transition': [
      `停止比较所有赛道，开始选一个|把你现在的分析，收敛成一个能推进的方向。`,
      `停止等所有信息，开始做选择|把你现在的犹豫，收敛成一个能推进的决定。`,
      `停止想所有可能，开始站一边|把你现在的观望，收敛成一个能推进的立场。`,
      `停止补所有短板，开始用优势|把你现在的焦虑，收敛成一个能推进的起点。`,
      `停止等所有答案，开始往前走|把你现在的等待，收敛成一个能推进的行动。`,
    ],
    'efficiency': [
      `停止做所有事，开始选重点|把你现在的忙碌，收敛成一个能推进的核心。`,
      `停止用力所有地方，开始用对地方|把你现在的消耗，收敛成一个能推进的方式。`,
      `停止硬撑所有任务，开始选边界|把你现在的透支，收敛成一个能推进的范围。`,
      `停止等所有条件，开始做一步|把你现在的等待，收敛成一个能推进的行动。`,
      `停止想所有方法，开始试一个|把你现在的分析，收敛成一个能推进的尝试。`,
    ],
    'communication': [
      `停止解释所有事，开始说重点|把你现在的费力，收敛成一个能推进的表达。`,
      `停止想所有说法，开始说一个|把你现在的犹豫，收敛成一个能推进的话。`,
      `停止等所有理解，开始往前走|把你现在的等待，收敛成一个能推进的行动。`,
      `停止证明所有点，开始做决定|把你现在的解释，收敛成一个能推进的选择。`,
      `停止说所有话，开始说有用的话|把你现在的沟通，收敛成一个能推进的表达。`,
    ],
  };
  
  const highlights = highlightTemplates[scenario] || highlightTemplates['work-decision'];
  const highlight = highlights[Math.floor(Math.random() * highlights.length)];
  
  // 智能检测优势冲突
  const strengthConflicts = detectStrengthConflicts(strengthDetails);
  
  // 智能检测地下室状态
  const strengthBasement = detectBasementStrength(scenario, strengthDetails, confusion);
  
  // 根据场景生成系统诊断（更精准，用人话表达优势状态）
  const judgmentTemplates: Record<string, (s: string[], basement?: string, conflicts?: string[]) => string> = {
    'work-decision': (s, basement, conflicts) => {
      if (basement && conflicts && conflicts.length > 0) {
        return `你的"${basement}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。它与你的"${s[1] || '战略'}"优势在互相拉扯——你在反复想，但没有更靠近答案。你试图用"${basement}"去扛住所有琐事，却挤压了"${s[1] || '战略'}"去梳理大局的空间。`;
      } else if (basement) {
        return `你的"${basement}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。被过度激活导致决策瘫痪。同时，"${s[1] || '战略'}"优势被压制，无法发挥战略思维的价值。`;
      } else {
        return `你的"${s[0]}"优势被过度激活，在决策场景中导致"什么都想抓住"的决策瘫痪。同时，"${s[1] || '战略'}"优势被压制，无法发挥战略思维的价值。`;
      }
    },
    'career-transition': (s, basement, conflicts) => {
      if (basement && conflicts && conflicts.length > 0) {
        return `你的"${basement}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。它与你的"${s[1] || '战略'}"优势在互相拉扯——你在反复想，但没有更靠近答案。你试图用"${basement}"优势去填补"${s[1] || '战略'}"的空白，却导致两者都无法发挥价值。`;
      } else if (basement) {
        return `你的"${basement}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。你正在用它解决需要"${s[1] || '战略思维'}"优势的问题。这不是能力不足，而是优势匹配错位。`;
      } else {
        return `你正在用"${s[0]}"优势解决需要"${s[1] || '战略思维'}"优势的问题。这不是能力不足，而是优势匹配错位。`;
      }
    },
    'efficiency': (s, basement) => {
      if (basement) {
        return `你的"${basement}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。你陷入"用劣势工作"的消耗循环。真正的效率问题不是时间管理，而是优势被误用了。`;
      } else {
        return `你的"${s[0]}"优势：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你。你陷入"用劣势工作"的消耗循环。真正的效率问题不是时间管理，而是优势被误用了。`;
      }
    },
    'communication': (s, basement) => {
      if (basement) {
        return `你的"${basement}"优势在沟通中被误用：你现在用力的方式，正在拖累你。这个优势暂时没有在帮你，反而在消耗你，导致"费力不讨好"的困境。用"${s[2] || s[1] || '分析'}"优势重新定义沟通方式。`;
      } else {
        return `你的"${s[0]}"优势在沟通中被误用，导致"费力不讨好"的困境。用"${s[2] || s[1] || '分析'}"优势重新定义沟通方式。`;
      }
    },
  };
  
  const judgmentGenerator = judgmentTemplates[scenario] || judgmentTemplates['work-decision'];
  const judgment = judgmentGenerator(strengthNames, strengthBasement, strengthConflicts);
  
  // 固定的3条清理指令（所有场景通用）
  const actions = [
    `今天不再接收任何新信息\n你已经看得够多了。`,
    `只保留一个能继续推进的选项\n不用比较，也不用证明。\n其他的，今天全部视为不存在。`,
    `今天不解释，也不修正选择\n理解与否，不在今天处理。`,
  ];
  
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
