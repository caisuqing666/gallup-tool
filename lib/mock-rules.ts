// Mock 规则判断（纯函数，可测试）
// 这些函数用于检测优势状态、冲突、典型案例等，确保输出稳定性

import { ALL_STRENGTHS, StrengthId } from './gallup-strengths';
import { ScenarioId } from './scenarios';

// 优势领域冲突矩阵：哪些领域的优势容易产生冲突
export const DOMAIN_CONFLICTS: Record<string, string[]> = {
  'executing': ['strategic'], // 执行力和战略思维容易冲突（行动 vs 思考）
  'influencing': ['relationship'], // 影响力和关系建立容易冲突（推动 vs 和谐）
  'strategic': ['executing'], // 战略思维和执行力容易冲突（思考 vs 行动）
  'relationship': ['influencing'], // 关系建立和影响力容易冲突（和谐 vs 推动）
};

// 特殊优势冲突对（具体优势之间的冲突）
export const SPECIFIC_CONFLICTS: Array<{ strength1: string; strength2: string }> = [
  { strength1: 'command', strength2: 'harmony' }, // 统率 vs 和谐
  { strength1: 'focus', strength2: 'arranger' }, // 专注 vs 统筹
];

// 检测优势冲突（"打架"）- 纯函数，可测试
export function detectStrengthConflicts(
  strengthDetails: readonly (typeof ALL_STRENGTHS[number])[]
): string[] {
  const conflicts: string[] = [];
  
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
  
  // 检测特殊优势冲突对
  for (const { strength1, strength2 } of SPECIFIC_CONFLICTS) {
    const hasStrength1 = strengthDetails.some(s => s.id === strength1);
    const hasStrength2 = strengthDetails.some(s => s.id === strength2);
    
    if (hasStrength1 && hasStrength2) {
      const s1 = strengthDetails.find(s => s.id === strength1)!;
      const s2 = strengthDetails.find(s => s.id === strength2)!;
      
      // 避免重复添加
      if (!conflicts.some(c => c.includes(s1.name) && c.includes(s2.name))) {
        conflicts.push(`「${s1.name}」与「${s2.name}」`);
      }
    }
  }
  
  return conflicts.slice(0, 2); // 最多返回2个冲突
}

// 检测优势是否掉进"地下室"（被过度使用或误用）- 纯函数，可测试
export function detectBasementStrength(
  scenario: ScenarioId | string,
  strengthDetails: readonly (typeof ALL_STRENGTHS[number])[],
  confusion: string
): string | undefined {
  if (strengthDetails.length === 0) {
    return undefined;
  }

  const confusionLower = confusion.toLowerCase();
  const firstStrength = strengthDetails[0];
  
  // 工作决策场景：通常是执行力优势被过度使用
  if (scenario === 'work-decision') {
    const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
    if (executingStrengths.length > 0 && 
        (confusionLower.includes('决策') || confusionLower.includes('选择') || confusionLower.includes('优先'))) {
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
  
  // 职业转型场景：通常是第一个优势被过度使用
  if (scenario === 'career-transition') {
    return firstStrength.name;
  }
  
  // 默认：第一个优势可能被过度使用
  return firstStrength.name;
}

// 典型案例关键词配置
export const DEMO_CASE_KEYWORDS = {
  'info-overload': {
    confusion: ['信息', '搜集', '信息囤积', '信息涌入', '无法决策', '决策', '焦虑', '太多'],
    strengths: ['input', '搜集', 'analytical', '分析'],
  },
  'responsibility-overload': {
    confusion: ['责任', '接单', '兜底', '琐事', '扛住', '太多', '接不住', '失控'],
    strengths: ['responsibility', '责任'],
  },
} as const;

// 检测是否为典型案例 - 纯函数，可测试
export function isDemoCase(
  confusion: string,
  strengths: string[]
): 'info-overload' | 'responsibility-overload' | null {
  const confusionLower = confusion.toLowerCase();
  const strengthIds = strengths.map(s => s.toLowerCase());
  
  // 检测"信息黑洞"典型案例
  const infoOverload = DEMO_CASE_KEYWORDS['info-overload'];
  const hasInfoConfusion = infoOverload.confusion.some(keyword => confusionLower.includes(keyword));
  const hasInfoStrength = infoOverload.strengths.some(strength => 
    strengthIds.includes(strength) || strengthIds.includes(strength.toLowerCase())
  );
  
  if (hasInfoConfusion && hasInfoStrength) {
    return 'info-overload';
  }
  
  // 检测"责任过载"典型案例
  const responsibilityOverload = DEMO_CASE_KEYWORDS['responsibility-overload'];
  const hasRespConfusion = responsibilityOverload.confusion.some(keyword => confusionLower.includes(keyword));
  const hasRespStrength = responsibilityOverload.strengths.some(strength => 
    strengthIds.includes(strength) || strengthIds.includes(strength.toLowerCase())
  );
  
  if (hasRespConfusion && hasRespStrength) {
    return 'responsibility-overload';
  }
  
  return null;
}

// 根据优势 ID 获取优势详情 - 纯函数，可测试
export function getStrengthDetails(
  strengthIds: (StrengthId | string)[]
): readonly (typeof ALL_STRENGTHS[number])[] {
  return strengthIds
    .slice(0, 5)
    .map(id => ALL_STRENGTHS.find(s => s.id === id))
    .filter((s): s is typeof ALL_STRENGTHS[number] => s !== undefined);
}

// 获取优势名称列表 - 纯函数，可测试
export function getStrengthNames(
  strengthDetails: readonly (typeof ALL_STRENGTHS[number])[]
): string[] {
  return strengthDetails.map(s => s.name);
}

// 生成优势锦囊（旋钮调节式建议）- 纯函数，可测试
export function generateAdvantageTips(
  scenario: ScenarioId | string,
  strengthDetails: readonly (typeof ALL_STRENGTHS[number])[],
  strengthNames: string[],
  strengthBasement: string | undefined,
  strengthConflicts: string[],
  confusion: string
): {
  reduce?: Array<{ strength: string; percentage: number; reason: string }>;
  increase?: Array<{ strength: string; percentage: number; reason: string }>;
  instruction: string;
} {
  const reduce: Array<{ strength: string; percentage: number; reason: string }> = [];
  const increase: Array<{ strength: string; percentage: number; reason: string }> = [];

  // 工作决策场景：调低执行力优势（可能被过度使用），调高战略优势
  if (scenario === 'work-decision') {
    const executingStrengths = strengthDetails.filter(s => s.domain === 'executing');
    if (executingStrengths.length > 0 && strengthBasement) {
      reduce.push({
        strength: strengthBasement,
        percentage: 50,
        reason: '掉进地下室，需要重新激活'
      });
    }
    
    const strategicStrengths = strengthDetails.filter(s => s.domain === 'strategic');
    if (strategicStrengths.length > 0) {
      increase.push({
        strength: strategicStrengths[0].name,
        percentage: 80,
        reason: '需要战略思维来重新定义优先级'
      });
    } else if (strengthDetails.length > 1) {
      increase.push({
        strength: strengthNames[1] || '战略',
        percentage: 75,
        reason: '需要战略优势来分析优先级'
      });
    }
  } else if (scenario === 'efficiency') {
    // 效率场景：调低被过度使用的执行力优势，调高专注或战略优势
    if (strengthBasement) {
      reduce.push({
        strength: strengthBasement,
        percentage: 60,
        reason: '被过度使用导致效率低下'
      });
    }
    
    const focusStrengths = strengthDetails.filter(s => s.id === 'focus');
    if (focusStrengths.length > 0) {
      increase.push({
        strength: '专注',
        percentage: 90,
        reason: '专注优势能帮你聚焦核心任务'
      });
    } else if (strengthDetails.length > 1) {
      increase.push({
        strength: strengthNames[1] || '专注',
        percentage: 85,
        reason: '需要聚焦核心任务'
      });
    }
  } else if (scenario === 'communication') {
    // 沟通场景：调低被误用的优势，调高分析或战略优势
    if (strengthBasement && strengthBasement !== '沟通') {
      reduce.push({
        strength: strengthBasement,
        percentage: 40,
        reason: '在沟通中被误用'
      });
    }
    
    const analyticalStrengths = strengthDetails.filter(s => s.domain === 'strategic');
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
