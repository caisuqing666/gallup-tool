// 四个场景对应的三段式结论数据
// 结构：核心判词（The Verdict） + 困境还原（The Experience） + 指令出口（The Pivot）

import { ScenarioId } from './scenarios';

export interface EvidenceItem {
  label: string; // 标签：误区、代价、逻辑等
  content: string; // 内容
}

export interface ScenarioConclusion {
  verdict: string; // 核心判词
  experience: string; // 困境还原（保留兼容）
  evidence?: EvidenceItem[]; // 证据清单（新格式）
  pivot: string; // 纠偏指令
  execution?: string; // 执行方式
}

export const SCENARIO_CONCLUSIONS: Record<ScenarioId, ScenarioConclusion> = {
  'work-decision': {
    verdict: '你不是事情多，是你在替所有事情负责。',
    experience: `你现在的问题不是不会排序，
而是你默认每一件事都"不能出错、不能放手"。

结果是：
你一直在忙，却始终没有一件事被真正保下来。`,
    evidence: [
      { label: '误区', content: '把负责当成排序' },
      { label: '行为', content: '默认每一件事都"不能出错、不能放手"' },
      { label: '代价', content: '一直在忙，却始终没有一件事被真正保下来' },
    ],
    pivot: `你需要的不是更精细的待办清单，
而是一个允许你放弃的判断标准。`,
    execution: '立刻选定一个可推进方向。',
  },
  'career-transition': {
    verdict: `你不是在思考，
你是在安全感的围栏里反复打转。`,
    experience: `你其实很清楚自己"能做什么"，
只是你一直在问："这个稳不稳？值不值？会不会走错？"

当你用安全感而不是优势做决策时，
每一条赛道看起来都像将就。`,
    evidence: [
      { label: '误区', content: '把避险当成分析' },
      { label: '行为', content: '反复比较，迟迟不选' },
      { label: '代价', content: '投入越多，离决策越远' },
    ],
    pivot: `你需要的不是更多分析，
而是一次站在自己这边的选择。`,
    execution: '立刻选定一个可推进方向。',
  },
  'efficiency': {
    verdict: '你不是效率低，是你一直在用硬撑换安心。',
    experience: `你已经很努力了，
只是你的努力方式，是"先把自己耗干，再期待结果"。

越累，你越不敢停；
越没产出，你越不敢松。

这不是自律，这是消耗。`,
    evidence: [
      { label: '误区', content: '把硬撑当成自律' },
      { label: '行为', content: '先把自己耗干，再期待结果' },
      { label: '代价', content: '越累，越不敢停；越没产出，越不敢松' },
    ],
    pivot: `你需要的是减少用力的方式，
而不是增加用力的时间。`,
    execution: '立刻选定一个可推进方向。',
  },
  'communication': {
    verdict: '你不是不会沟通，是你一直在替别人想明白。',
    experience: `你习惯把话说得周全、体谅、不给人压力，
结果是：对方轻松了，你却越来越沉默。

你不是表达能力不足，
而是你从一开始，就把"被理解"的成本，全算在自己身上。`,
    evidence: [
      { label: '误区', content: '错把"周全"当成"有效沟通"。' },
      { label: '代价', content: '对方轻松了，你却越来越沉默。' },
    ],
    pivot: `你需要的不是更好的措辞，
而是不用解释那么多的边界。`,
    execution: '立刻选定一个可推进方向。',
  },
};

// 根据场景ID获取结论
export function getScenarioConclusion(scenarioId: ScenarioId | string | undefined): ScenarioConclusion | null {
  if (!scenarioId || !(scenarioId in SCENARIO_CONCLUSIONS)) {
    return null;
  }
  return SCENARIO_CONCLUSIONS[scenarioId as ScenarioId];
}
