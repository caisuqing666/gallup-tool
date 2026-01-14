// Mock 数据生成器（用于演示）
// 解释页和判定页完全分离

import { GallupResult, ExplainData, DecideData } from './types';
import { ALL_STRENGTHS, StrengthId } from './gallup-strengths';
import { ScenarioId } from './scenarios';
import {
  detectStrengthConflicts,
  detectBasementStrength,
  getStrengthDetails,
  getStrengthNames,
  DOMAIN_CONFLICTS,
} from './mock-rules';

// 重新导出规则函数，保持向后兼容
export { detectStrengthConflicts, detectBasementStrength, DOMAIN_CONFLICTS };

// 典型案例1："信息黑洞"（搜集+分析+责任）
function generateExplainInfoOverload(
  _scenario: string,
  strengths: string[]
): ExplainData {
  return {
    strengthManifestations: strengths.slice(0, 3).map((id) => {
      const behaviors: Record<string, string> = {
        搜集: '你会不断打开新标签页，总觉得信息还不够，迟迟不肯开始做决定。每个链接都想点开看看。',
        分析: '你会反复对比细节，试图找到"最正确"的答案，结果越比越乱。你会在两个选项之间来回切换，就是定不下来。',
        责任: '你会默认所有事都"不能出错、不能放手"，觉得拒绝就是不负责任。别人一求助你就答应。',
        专注: '你会盯着一件事做到底，其他事很难插进来。别人叫你你都听不见。',
        战略: '你会在任务尚未成型前，先试图把所有变量想清楚。你会花很多时间在"如果...会怎样"的思考上。',
        统筹: '你会试图同时管理 5 件事以上，结果每件事都推进不超过 20%。你的待办清单越来越长，完成的事却没几件。',
      };
      return {
        strengthId: id,
        behaviors: behaviors[id] || `你会过度依赖这个优势，在当前场景中用力过猛，反而形成阻碍。`,
      };
    }),
    strengthInteractions: `当你的"${strengths[0]}"遇到"${strengths[1]}"，你会先拼命收集所有信息，然后一头扎进细节反复分析。你的"${strengths[2] || '责任'}"让你害怕做错决定，结果你越准备越焦虑。你陷入了"收集—分析—再收集"的循环，永远觉得还不够。`,
    blindspots: `你这组优势会让你误以为"再多看一点就能做决定"，但其实你早就在用"${strengths[0]}"逃避"选择"了。信息够不够根本不是问题，问题是你不敢选。`,
    summary: '你这组优势的核心模式：用准备代替选择。',
  };
}

function generateDecideInfoOverload(
  _scenario: string,
  strengths: string[]
): DecideData {
  return {
    verdict: `现在应该用专注替代搜集，用选择替代准备。`,
    doMore: [
      {
        action: '每天下午 3 点后，不再接收任何新信息',
        timing: '今天开始',
        criteria: '即使看起来很重要也等到明天',
        consequence: '否则，你的注意力仍然会被低价值事项稀释，到了晚上什么重要的事都没做完。',
      },
      {
        action: '用"分析"优势给待办事项标权重 1/2/3',
        timing: '从下一个任务开始',
        criteria: '1=今天必须做，2=明天做，3=本周可以不做',
        consequence: '否则，你又会陷入"所有事都重要"的幻觉，一天下来忙碌但无果。',
      },
      {
        action: '选定一件事，其他的明确说"不"',
        timing: '今天下班前',
        criteria: '这件事做完能让你睡得着觉',
        consequence: '否则，你会继续被所有可能的选择拖住，到了晚上仍然没有任何一件事推进到底。',
      },
    ],
    doLess: [
      {
        action: '不再试图让所有事都"准备好"',
        replacement: '用"够用就行"替代"准备充分"',
        timing: '从下一个任务开始',
      },
      {
        action: '不再反复对比选项',
        replacement: '选一个能推进的，先做起来再说',
        timing: '从今天开始',
      },
      {
        action: '不再害怕"错过重要信息"',
        replacement: '相信自己的判断力，不靠信息堆砌',
        timing: '立即',
      },
    ],
    boundaries: [
      {
        responsibleFor: '你选定的那件事的完成',
        notResponsibleFor: '其他事的结果',
      },
      {
        responsibleFor: '做出决定并推进',
        notResponsibleFor: '证明决定是"最正确的"',
      },
      {
        responsibleFor: '用现有信息做出最佳判断',
        notResponsibleFor: '收集所有可能的信息',
      },
    ],
    checkRule: '判断标准：今天是否选了一件事并推进到底，其他事都没碰。',
  };
}

// 典型案例2："接单机器"（责任过载）
function generateExplainResponsibilityOverload(
  _scenario: ScenarioId | string,
  strengths: StrengthId[] | string[]
): ExplainData {
  const strengthDetails = strengths
    .slice(0, 5)
    .map((id) => ALL_STRENGTHS.find((s) => s.id === id))
    .filter((s): s is typeof ALL_STRENGTHS[number] => s !== undefined);

  const strengthNames = strengthDetails.map((s) => s.name);

  return {
    strengthManifestations: strengthNames.slice(0, 3).map((name) => {
      const behaviors: Record<string, string> = {
        责任: '你会默认所有事都"不能出错、不能放手"，觉得拒绝就是不负责任。别人一求助你就答应。',
        统筹: '你会试图同时管理 5 件事以上，结果每件事都推进不超过 20%。你的待办清单越来越长，完成的事却没几件。',
        专注: '你会盯着一件事做到底，其他事很难插进来。别人叫你你都听不见。',
        和谐: '你会为了避免冲突而接受不合理的要求，结果自己吃亏。你会把不舒服的感觉吞下去，表面上还说"没关系"。',
        适应: '你会根据外界变化不断调整，结果失去自己的节奏和方向。你会被别人的紧急事项牵着走。',
      };
      return {
        strengthId: name,
        behaviors: behaviors[name] || `你会过度依赖这个优势，在当前场景中用力过猛，反而形成阻碍。`,
      };
    }),
    strengthInteractions: `当你的"${strengthNames[0]}"遇到"${strengthNames[1] || '统筹'}"，你会试图对所有事情负责，同时处理多个任务。你的"${strengthNames[2] || '和谐'}"让你不敢拒绝，结果你一直在忙，却始终没有一件事被真正保下来。你陷入了"接活—忙不过来—继续接活"的循环。`,
    blindspots: `你这组优势会让你误以为"不拒绝就是负责"，但其实你早就在用"${strengthNames[0]}"回避"设立边界"了。在资源过载时，你对烂事的"负责"，就是对你真正重要目标的"不负责"。`,
    summary: '你这组优势的核心模式：用忙碌代替边界。',
  };
}

function generateDecideResponsibilityOverload(
  _scenario: ScenarioId | string,
  strengths: StrengthId[] | string[]
): DecideData {
  const strengthDetails = strengths
    .slice(0, 5)
    .map((id) => ALL_STRENGTHS.find((s) => s.id === id))
    .filter((s): s is typeof ALL_STRENGTHS[number] => s !== undefined);

  const strengthNames = strengthDetails.map((s) => s.name);
  const firstStrength = strengthNames[0] || '责任';
  const secondStrength = strengthNames[1] || '战略';

  return {
    verdict: `现在应该用${secondStrength}替代${firstStrength}，用边界替代承担。`,
    doMore: [
      {
        action: `用"${secondStrength}"优势列出明天绝对不碰的3件事`,
        timing: '今天下班前',
        criteria: '这3件事不做，也不会影响核心目标',
        consequence: '否则，你明天又会自动切换回"能做的事都做"的模式，到晚上累死但核心目标零进展。',
      },
      {
        action: '给老板发一份《当前项目资源过载风险分析报告》',
        timing: '明天上午',
        criteria: '明确提出需要削减的优先级',
        consequence: '否则，老板会继续默认你能扛住所有事，直到你彻底崩溃。',
      },
      {
        action: '在上午 10:00-11:00 彻底关闭即时通讯工具',
        timing: '从明天开始',
        criteria: '只留给"最重要但没人催"的那件事',
        consequence: '否则，你会继续被所有人的紧急事项牵着走，自己的那件重要的事永远推不动。',
      },
    ],
    doLess: [
      {
        action: `不再使用"${firstStrength}"去道歉和兜底`,
        replacement: `用"${secondStrength}"优势定义"什么是重要的"`,
        timing: '从下一个任务开始',
      },
      {
        action: '不再接收临时的、非核心的请求',
        replacement: '明确说"这不是我的优先级"',
        timing: '立即',
      },
      {
        action: '不再试图让所有人都满意',
        replacement: '接受"有些人会不高兴"，这是设立边界的代价',
        timing: '从今天开始',
      },
    ],
    boundaries: [
      {
        responsibleFor: '你选定的核心目标的完成',
        notResponsibleFor: '其他所有人的期待',
      },
      {
        responsibleFor: '用优势发挥最大价值',
        notResponsibleFor: '补齐所有短板',
      },
      {
        responsibleFor: '说不的权利',
        notResponsibleFor: '解释为什么不',
      },
    ],
    checkRule: '判断标准：今天有没有对一件事说"不"，对一件事说"是"。',
  };
}

// 通用的解释页生成器
function generateGenericExplain(
  scenario: ScenarioId | string,
  strengths: StrengthId[] | string[],
  _confusion: string
): ExplainData {
  const strengthDetails = getStrengthDetails(strengths);
  const strengthNames = getStrengthNames(strengthDetails);
  const firstStrength = strengthNames[0] || '责任';
  const secondStrength = strengthNames[1] || '战略';
  const thirdStrength = strengthNames[2] || '分析';

  // 检测地下室状态
  const strengthBasement = detectBasementStrength(scenario, strengthDetails, _confusion);

  return {
    strengthManifestations: strengthNames.slice(0, 3).map((name) => {
      const behaviors: Record<string, string> = {
        搜集: '你会不断打开新标签页，总觉得信息还不够，迟迟不肯开始做决定。每个链接都想点开看看。',
        分析: '你会反复对比细节，试图找到"最正确"的答案，结果越比越乱。你会在两个选项之间来回切换，就是定不下来。',
        责任: '你会默认所有事都"不能出错、不能放手"，觉得拒绝就是不负责任。别人一求助你就答应。',
        专注: '你会盯着一件事做到底，其他事很难插进来。别人叫你你都听不见。',
        战略: '你会在任务尚未成型前，先试图把所有变量想清楚。你会花很多时间在"如果...会怎样"的思考上。',
        统筹: '你会试图同时管理 5 件事以上，结果每件事都推进不超过 20%。你的待办清单越来越长，完成的事却没几件。',
        适应: '你会根据外界变化不断调整，结果失去自己的节奏和方向。你会被别人的紧急事项牵着走。',
        完美: '你会纠结在最后 10% 的细节上，结果 80% 的时间花在优化已经够好的东西。你会反复修改，总觉得"还不够好"。',
        行动: '你会急于开始做事，跳过思考环节，结果做到一半发现方向错了。你会先做了再说，然后返工重来。',
        学习: '你会想先学完所有技能再开始，结果永远在准备，从未行动。你会买很多课程，但每个都只看了开头。',
        沟通: '你会说很多话来解释自己，结果越说越累，对方还是不理解。你会一直补充细节，觉得对方没听懂。',
        统率: '你会直接下达指令，不考虑他人感受，结果推动时遇到阻力。你会觉得"这么简单的事为什么做不到"。',
        和谐: '你会为了避免冲突而接受不合理的要求，结果自己吃亏。你会把不舒服的感觉吞下去，表面上还说"没关系"。',
        体谅: '你会优先考虑拒绝是否会让他人承受情绪成本。你会为了避免让对方难受，自己扛下不该扛的事。',
        回顾: '你会反复回想过去的错误，结果陷入自责，不敢往前走。你会经常想"当时如果...就好了"。',
        前瞻: '你会过度担心未来的风险，结果现在的事情都不敢做。你会花很多时间设想各种最坏的情况。',
        思维: '你会在任务尚未成型前，先试图把所有变量想清楚。你会花大量时间在"如果...会怎样"的思考上。',
        个别: '你会注意到每个人独特的需求和特点，结果难以用统一标准推进。你会为每个人定制方案，把自己累垮。',
        成就: '你会不断追逐新的里程碑，结果到达后只高兴 5 分钟就开始焦虑下一个。你很难停下来享受完成的感觉。',
        公平: '你会花大量精力确保每个人都受到同等对待，结果核心议题被边缘化。你会被"是否公平"的讨论拖住进度。',
        包容: '你会默认每个人都有善意，结果错过明显的负面信号。你会给所有人第二次、第三次机会，直到自己被消耗殆尽。',
      };
      return {
        strengthId: name,
        behaviors: behaviors[name] || `你会过度依赖这个优势，在当前场景中用力过猛，反而形成阻碍。`,
      };
    }),
    strengthInteractions: strengthBasement
      ? `你的"${strengthBasement}"优势正在过载，它与"${secondStrength}"优势在互相拉扯。你在反复想，但没有更靠近答案。试图用"${strengthBasement}"去扛住所有，却挤压了"${secondStrength}"去梳理大局的空间。你陷入了"用力—消耗—再用力"的循环。`
      : `当你的"${firstStrength}"遇到"${secondStrength}"，你们在用一种互相消耗的方式配合。一个想向前冲，一个想回头看，结果你们都在原地消耗，没有真正推进。你被困在了"准备—验证—再准备"的循环里。`,
    blindspots: strengthBasement
      ? `你这组优势会让你误以为"${strengthBasement}用对了就能解决问题"，但其实这个优势正在被误用。它本该帮助你，现在却成了你的负担。`
      : `你这组优势会让你误以为"再用点力就能突破"，但其实你一直在用错误的方式用力。你现在的焦虑不是能力不足，而是优势被误用了。`,
    summary: `你这组优势的核心模式：用${firstStrength}代替${secondStrength}。`,
  };
}

// 通用的判定页生成器
function generateGenericDecide(
  scenario: ScenarioId | string,
  strengths: StrengthId[] | string[],
  _confusion: string
): DecideData {
  const strengthDetails = getStrengthDetails(strengths);
  const strengthNames = getStrengthNames(strengthDetails);
  const firstStrength = strengthNames[0] || '责任';
  const secondStrength = strengthNames[1] || '战略';

  return {
    verdict: `现在应该用${secondStrength}替代${firstStrength}，用选择替代准备。`,
    doMore: [
      {
        action: `用"${secondStrength}"优势选定一件事，其他的明确放弃`,
        timing: '今天下班前',
        criteria: '这件事做完能让你今晚睡得着觉',
        consequence: '否则，你会继续在多个选项之间来回切换，到晚上仍然没有任何一件事推进到底。',
      },
      {
        action: '定义一个"不碰清单"——列出 3 件今天绝对不做的事',
        timing: '今天上午',
        criteria: '这 3 件事不做，也不会影响核心目标',
        consequence: '否则，你的时间会自动被各种"看起来重要"的事项填满，真正重要的那件事永远排不进去。',
      },
      {
        action: '用"专注"优势，给选定的事情分配不受打扰的 1 小时',
        timing: '今天下午',
        criteria: '这 1 小时只做这件事，不切换',
        consequence: '否则，你又会陷入"想做但没整块时间"的循环，一天下来忙忙碌碌但毫无进展。',
      },
    ],
    doLess: [
      {
        action: `不再试图用"${firstStrength}"去解决所有问题`,
        replacement: `用"${secondStrength}"优势重新定义问题`,
        timing: '从下一个任务开始',
      },
      {
        action: '不再等所有信息齐了再做决定',
        replacement: '用现有信息做出最佳判断，然后推进',
        timing: '立即',
      },
      {
        action: '不再试图让所有人都满意',
        replacement: '接受"有些人会不高兴"，这是选择的代价',
        timing: '从今天开始',
      },
    ],
    boundaries: [
      {
        responsibleFor: '你选定的那件事的完成',
        notResponsibleFor: '其他事的结果',
      },
      {
        responsibleFor: '做出决定并推进',
        notResponsibleFor: '证明决定是"最正确的"',
      },
      {
        responsibleFor: '用优势发挥最大价值',
        notResponsibleFor: '补齐所有短板',
      },
    ],
    checkRule: `判断标准：今天是否用${secondStrength}选定了一件事并推进到底。`,
  };
}

// 统一的 Mock 生成入口
export function generateMockResult(
  scenario: ScenarioId | string,
  strengths: StrengthId[] | string[],
  confusion: string
): GallupResult {
  // 检测特殊案例类型
  const isInfoOverload = confusion.includes('信息') || confusion.includes('搜集') || strengths.includes('搜集' as StrengthId);
  const isResponsibilityOverload = confusion.includes('忙') || confusion.includes('多') || strengths.includes('责任' as StrengthId);

  // 生成解释页
  let explainData: ExplainData;
  if (isInfoOverload) {
    explainData = generateExplainInfoOverload(scenario, strengths as string[]);
  } else if (isResponsibilityOverload) {
    explainData = generateExplainResponsibilityOverload(scenario, strengths);
  } else {
    explainData = generateGenericExplain(scenario, strengths, confusion);
  }

  // 生成判定页
  let decideData: DecideData;
  if (isInfoOverload) {
    decideData = generateDecideInfoOverload(scenario, strengths as string[]);
  } else if (isResponsibilityOverload) {
    decideData = generateDecideResponsibilityOverload(scenario, strengths);
  } else {
    decideData = generateGenericDecide(scenario, strengths, confusion);
  }

  return {
    explain: explainData,
    decide: decideData,
  };
}
