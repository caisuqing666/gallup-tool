// ResultPage 工具函数
// 从 lib/behavior-mappings.ts 导入行为描述映射

export { getBehaviorDescription, getBehaviorResult } from '@/lib/behavior-mappings';

// 系统诊断结论枚举（固定分类，增强权威感）
export type DiagnosisType = '决策空转' | '用力反噬' | '优势错位' | '执行断裂';

// 根据场景映射到系统诊断结论
export function getDiagnosisLabel(scenario?: string): DiagnosisType {
  const diagnosisMap: Record<string, DiagnosisType> = {
    'work-decision': '决策空转',
    'career-transition': '优势错位',
    'efficiency': '用力反噬',
    'communication': '执行断裂',
  };
  return scenario ? diagnosisMap[scenario] : '决策空转';
}

// 获取效能折损率（状态提示，不用精确数字）
export function getEfficiencyStatus(scenario?: string): { label: string; percentage: number } {
  const statusMap: Record<string, { label: string; percentage: number }> = {
    'work-decision': { label: '推进效能偏低', percentage: 35 },
    'career-transition': { label: '有效推进不足', percentage: 40 },
    'efficiency': { label: '推进效能偏低', percentage: 30 },
    'communication': { label: '推进效能偏低', percentage: 35 },
  };
  return scenario ? statusMap[scenario] : { label: '推进效能偏低', percentage: 35 };
}

// 根据场景生成与上方箭头块呼应的按钮文案
export function getStopButtonText(scenario?: string): string {
  const buttonTextMap: Record<string, string> = {
    'work-decision': '不再分析，选一个推进',
    'career-transition': '站到自己这边，选一个走',
    'efficiency': '不再硬撑，选一个方式',
    'communication': '不再解释，选一个边界',
  };
  return scenario ? buttonTextMap[scenario] : '不再分析，选一个推进';
}
