// Mock 数据生成器（用于演示）
// 核心理念：不补短板，用优势解决问题（反直觉）

import { ResultData } from './types';
import { ALL_STRENGTHS } from './gallup-strengths';

// 优势领域冲突矩阵：哪些领域的优势容易产生冲突
const DOMAIN_CONFLICTS: Record<string, string[]> = {
  'executing': ['strategic'], // 执行力和战略思维容易冲突（行动 vs 思考）
  'influencing': ['relationship'], // 影响力和关系建立容易冲突（推动 vs 和谐）
  'strategic': ['executing'], // 战略思维和执行力容易冲突（思考 vs 行动）
  'relationship': ['influencing'], // 关系建立和影响力容易冲突（和谐 vs 推动）
};

// 检测优势冲突（"打架"）
function detectStrengthConflicts(strengthDetails: typeof ALL_STRENGTHS): string[] {
  const conflicts: string[] = [];
  const domains = strengthDetails.map(s => s.domain);
  
  // 检测不同领域的优势冲突
  for (let i = 0; i < strengthDetails.length; i++) {
    for (let j = i + 1; j < strengthDetails.length; j++) {
      const domain1 = strengthDetails[i].domain;
      const domain2 = strengthDetails[j].domain;
      
      // 检查是否在冲突矩阵中
      if (DOMAIN_CONFLICTS[domain1]?.includes(domain2) || 
          DOMAIN_CONFLICTS[domain2]?.includes(domain1)) {
        conflicts.push(`「${strengthDetails[i].name}」与「${strengthDetails[j].name}」`);
      }
    }
  }
  
  // 特殊情况：如果同时有"统率"和"和谐"，容易冲突
  const hasCommand = strengthDetails.some(s => s.id === 'command');
  const hasHarmony = strengthDetails.some(s => s.id === 'harmony');
  if (hasCommand && hasHarmony) {
    const commandStrength = strengthDetails.find(s => s.id === 'command')!;
    const harmonyStrength = strengthDetails.find(s => s.id === 'harmony')!;
    if (!conflicts.some(c => c.includes(commandStrength.name) && c.includes(harmonyStrength.name))) {
      conflicts.push(`「${commandStrength.name}」与「${harmonyStrength.name}」`);
    }
  }
  
  // 特殊情况：如果同时有"专注"和"统筹"，容易冲突
  const hasFocus = strengthDetails.some(s => s.id === 'focus');
  const hasArranger = strengthDetails.some(s => s.id === 'arranger');
  if (hasFocus && hasArranger) {
    const focusStrength = strengthDetails.find(s => s.id === 'focus')!;
    const arrangerStrength = strengthDetails.find(s => s.id === 'arranger')!;
    if (!conflicts.some(c => c.includes(focusStrength.name) && c.includes(arrangerStrength.name))) {
      conflicts.push(`「${focusStrength.name}」与「${arrangerStrength.name}」`);
    }
  }
  
  return conflicts.slice(0, 2); // 最多返回2个冲突
}

// 检测优势是否掉进"地下室"（被过度使用或误用）
function detectBasementStrength(
  scenario: string,
  strengthDetails: typeof ALL_STRENGTHS,
  confusion: string
): string | undefined {
  // 根据场景和困惑判断哪个优势可能掉进地下室
  const firstStrength = strengthDetails[0];
  
  // 工作决策场景：通常是执行力优势被过度使用
  if (scenario === 'work-decision') {
    const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
    if (executingStrengths.length > 0 && (confusion.includes('决策') || confusion.includes('选择'))) {
      return executingStrengths[0].name;
    }
    // 如果没有匹配的困惑关键词，也返回第一个执行力优势
    if (executingStrengths.length > 0) {
      return executingStrengths[0].name;
    }
  }
  
  // 效率场景：通常是执行力优势掉进地下室
  if (scenario === 'efficiency') {
    const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
    if (executingStrengths.length > 0) {
      return executingStrengths[0].name;
    }
  }
  
  // 沟通场景：通常是没有沟通优势但试图用其他优势替代
  if (scenario === 'communication') {
    const hasCommunication = strengthDetails.some(s => s.id === 'communication');
    if (!hasCommunication && strengthDetails.length > 0) {
      // 如果困惑中提到了沟通问题，但Top 5中没有沟通优势，说明在用其他优势硬撑
      return strengthDetails[0].name;
    }
  }
  
  // 默认：第一个优势可能被过度使用
  return strengthDetails[0]?.name;
}

// 典型案例预设（用于 Demo 展示）
const DEMO_CASE_KEYWORDS = {
  'info-overload': ['信息', '搜集', '决策', '信息囤积', '信息涌入', '无法决策'],
  'responsibility-overload': ['责任', '接单', '兜底', '琐事', '扛住'],
};

function isDemoCase(confusion: string, strengths: string[]): string | null {
  const confusionLower = confusion.toLowerCase();
  
  // 检测"信息黑洞"典型案例
  if (
    (confusionLower.includes('信息') || confusionLower.includes('搜集') || confusionLower.includes('信息囤积')) &&
    (confusionLower.includes('决策') || confusionLower.includes('无法') || confusionLower.includes('焦虑') || confusionLower.includes('太多')) &&
    strengths.some(s => s === 'input' || s === '搜集')
  ) {
    return 'info-overload';
  }
  
  // 检测"责任过载"典型案例
  if (
    (confusionLower.includes('责任') || confusionLower.includes('兜底') || confusionLower.includes('琐事')) &&
    (confusionLower.includes('太多') || confusionLower.includes('接不住') || confusionLower.includes('失控')) &&
    strengths.some(s => s === 'responsibility' || s === '责任')
  ) {
    return 'responsibility-overload';
  }
  
  return null;
}

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
  scenario: string,
  strengths: string[],
  confusion: string
): ResultData {
  const strengthDetails = strengths
    .slice(0, 5)
    .map(id => ALL_STRENGTHS.find(s => s.id === id))
    .filter(Boolean) as typeof ALL_STRENGTHS;
  
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
  scenario: string,
  strengths: string[],
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
  // 获取优势名称和详细信息
  const strengthDetails = strengths
    .slice(0, 5)
    .map(id => ALL_STRENGTHS.find(s => s.id === id))
    .filter(Boolean) as typeof ALL_STRENGTHS;
  
  const strengthNames = strengthDetails.map(s => s.name);
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
  const blindspotTemplates: Record<string, (s: string[]) => string> = {
    'work-decision': (s) => `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的决策场景中，你对所有事的"负责"，就是对你真正重要目标的"不负责"。`,
    'career-transition': (s) => `你不需要变得更"果断"，你需要变得更"挑剔"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"不拒绝"等同于"负责"。在当前的转型期，你对烂事的"负责"，就是对你未来目标的"不负责"。`,
    'efficiency': (s) => `你不需要变得更"快"，你需要变得更"准"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"做更多事"等同于"高效"。在当前的效率困境中，你试图提升时间管理（补短板），其实是"${s[0]}"优势被误用了。`,
    'communication': (s) => `你不需要变得更"会说话"，你需要变得更"会选话"。你现在的焦虑不是因为你能力不足，而是因为你错误地认为"多说多解释"等同于"有效沟通"。在当前的沟通困境中，你试图提升沟通能力（补短板），但其实应该用"${s[2] || s[0]}"优势去重构沟通方式。`,
  };
  
  const blindspotGenerator = blindspotTemplates[scenario] || blindspotTemplates['work-decision'];
  const blindspot = blindspotGenerator(strengthNames);
  
  // 生成优势锦囊（旋钮调节式建议）
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

// 生成优势锦囊（旋钮调节式建议）
function generateAdvantageTips(
  scenario: string,
  strengthDetails: typeof ALL_STRENGTHS,
  strengthNames: string[],
  strengthBasement: string | undefined,
  strengthConflicts: string[],
  confusion: string
): ResultData['advantageTips'] {
  const reduce: Array<{ strength: string; percentage: number; reason: string }> = [];
  const increase: Array<{ strength: string; percentage: number; reason: string }> = [];
  
  // 根据场景和优势状态生成调节建议
  if (scenario === 'work-decision') {
    // 工作决策场景：通常需要调低执行力优势，调高战略思维优势
    // 特殊检测：如果同时有"搜集"和"专注"，典型的需要调节组合
    const hasInput = strengthDetails.find(s => s.id === 'input');
    const hasFocus = strengthDetails.find(s => s.id === 'focus');
    
    if (hasInput && hasFocus) {
      // 经典的"搜集"vs"专注"冲突
      reduce.push({
        strength: hasInput.name,
        percentage: 50,
        reason: '搜集信息过多会导致决策瘫痪，需要降低信息收集强度'
      });
      increase.push({
        strength: hasFocus.name,
        percentage: 80,
        reason: '专注优势能帮你聚焦核心决策点，提升决策效率'
      });
    } else {
      // 常规逻辑
      const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
      const strategicStrengths = strengthDetails.filter(s => s.domain === 'strategic');
      
      if (executingStrengths.length > 0 && strengthBasement) {
        reduce.push({
          strength: strengthBasement,
          percentage: 50,
          reason: '被过度激活导致决策瘫痪'
        });
      } else if (executingStrengths.length > 0) {
        reduce.push({
          strength: executingStrengths[0].name,
          percentage: 40,
          reason: '被过度使用，导致"什么都想抓住"'
        });
      }
      
      if (strategicStrengths.length > 0) {
        increase.push({
          strength: strategicStrengths[0].name,
          percentage: 80,
          reason: '需要战略思维来定义"什么是重要的"'
        });
      } else if (strengthDetails.length > 1) {
        // 如果没有战略思维优势，调高第二个优势
        increase.push({
          strength: strengthNames[1] || '战略',
          percentage: 70,
          reason: '需要战略思维来定义优先级'
        });
      }
    }
  } else if (scenario === 'efficiency') {
    // 效率场景：调低掉进地下室的优势，调高其他优势
    if (strengthBasement) {
      reduce.push({
        strength: strengthBasement,
        percentage: 50,
        reason: '掉进地下室，需要让它回到高峰'
      });
    } else if (strengthDetails.length > 0) {
      const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
      if (executingStrengths.length > 0) {
        reduce.push({
          strength: executingStrengths[0].name,
          percentage: 40,
          reason: '被过度使用导致效率崩塌'
        });
      }
    }
    
    if (strengthDetails.length > 1) {
      increase.push({
        strength: strengthNames[1] || '战略',
        percentage: 80,
        reason: '用战略优势重构工作流程'
      });
    }
  } else if (scenario === 'communication') {
    // 沟通场景：调低被误用的优势，调高分析/战略优势
    const hasCommunication = strengthDetails.some(s => s.id === 'communication');
    
    if (!hasCommunication && strengthDetails.length > 0) {
      // 如果没有沟通优势但试图用其他优势替代，需要调低
      reduce.push({
        strength: strengthDetails[0].name,
        percentage: 50,
        reason: '被误用于沟通，导致"费力不讨好"'
      });
    } else if (strengthBasement) {
      reduce.push({
        strength: strengthBasement,
        percentage: 40,
        reason: '在沟通中被误用'
      });
    }
    
    // 调高分析或战略优势用于重构沟通
    const analyticalStrengths = strengthDetails.filter(s => s.id === 'analytical' || s.domain === 'strategic');
    if (analyticalStrengths.length > 0) {
      increase.push({
        strength: analyticalStrengths[0].name,
        percentage: 80,
        reason: '用分析优势在沟通前写好逻辑大纲'
      });
    } else if (strengthDetails.length > 2) {
      increase.push({
        strength: strengthNames[2] || '分析',
        percentage: 70,
        reason: '用现有优势重新定义沟通方式'
      });
    }
  } else if (scenario === 'career-transition') {
    // 职业转换场景：调低第一个优势（可能被过度使用），调高战略优势
    if (strengthDetails.length > 0) {
      reduce.push({
        strength: strengthNames[0],
        percentage: 30,
        reason: '需要为战略思维让出空间'
      });
    }
    
    const strategicStrengths = strengthDetails.filter(s => s.domain === 'strategic');
    if (strategicStrengths.length > 0) {
      increase.push({
        strength: strategicStrengths[0].name,
        percentage: 90,
        reason: '需要战略思维分析赛道选择'
      });
    } else if (strengthDetails.length > 1) {
      increase.push({
        strength: strengthNames[1] || '战略',
        percentage: 85,
        reason: '用战略优势分析哪个赛道能让现有优势发挥最大价值'
      });
    }
  }
  
  // 如果没有生成任何建议，生成默认建议
  if (reduce.length === 0 && increase.length === 0) {
    if (strengthBasement && strengthDetails.length > 1) {
      reduce.push({
        strength: strengthBasement,
        percentage: 50,
        reason: '掉进地下室，需要重新激活'
      });
      increase.push({
        strength: strengthNames[1] || '战略',
        percentage: 80,
        reason: '需要这个优势来重新定义问题'
      });
    } else if (strengthDetails.length >= 2) {
      reduce.push({
        strength: strengthNames[0],
        percentage: 40,
        reason: '被过度使用'
      });
      increase.push({
        strength: strengthNames[1],
        percentage: 70,
        reason: '需要发挥更大作用'
      });
    }
  }
  
  // 生成调节指令（使用更自然、更有"操纵感"的表达）
  const reduceText = reduce.map(r => `把你的「${r.strength}」优势关掉 ${r.percentage}%`).join('，');
  const increaseText = increase.map(i => `把「${i.strength}」优势调高 ${i.percentage}%`).join('，');
  
  let instruction = '';
  if (reduce.length > 0 && increase.length > 0) {
    // 更符合示例的表达方式
    instruction = `如果你明天还要处理类似的事，请试着${reduceText}，${increaseText}。`;
  } else if (reduce.length > 0) {
    instruction = `如果你明天还要处理类似的事，请试着${reduceText}。`;
  } else if (increase.length > 0) {
    instruction = `如果你明天还要处理类似的事，请试着${increaseText}。`;
  }
  
  return {
    reduce: reduce.length > 0 ? reduce : undefined,
    increase: increase.length > 0 ? increase : undefined,
    instruction,
  };
}
