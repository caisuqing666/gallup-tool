// 报告解读 Mock 数据生成器（占位）
// Phase 3: 报告解读功能预留
// 用于 OCR 识别盖洛普报告并生成解读

import { ReportInterpretResult } from './types';

/**
 * 生成报告解读 Mock 数据（占位）
 * @param imageData OCR 识别的图片数据（预留）
 * @returns 报告解读结果
 */
export function generateMockReportResult(imageData?: string): ReportInterpretResult {
  // Phase 3 占位：返回固定的示例数据
  return {
    top5Strengths: [
      { rank: 1, name: '责任', domain: '执行力' },
      { rank: 2, name: '战略', domain: '战略思维' },
      { rank: 3, name: '沟通', domain: '影响力' },
      { rank: 4, name: '体谅', domain: '关系建立' },
      { rank: 5, name: '成就', domain: '执行力' },
    ],
    summary: '你的优势组合形成了强大的执行力和影响力基础。责任让你对承诺负责，战略帮助你规划长期路径，沟通让你有效传达想法，体谅让你理解他人需求，成就驱动你持续进步。这个组合非常适合需要"既推动结果又建立关系"的领导岗位。',
    keyInsights: [
      '你是一个"说到做到"的人，责任感是你最核心的优势',
      '你的战略思维帮助你在执行中保持正确的方向',
      '沟通和体谅的组合让你既能表达清晰，又能理解他人',
      '成就优势确保你始终有推进的动力',
    ],
    suggestedPaths: [
      '我遇到了具体问题 - 用你的优势组合解决具体困境',
      '我想更好地发挥自己 - 深入了解每个优势的发挥方式',
    ],
    notice: '这是占位示例数据。Phase 3 完整实现后，将支持上传盖洛普官方报告图片进行 OCR 识别和个性化解读。',
  };
}
