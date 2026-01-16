'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReportInterpretResult } from '@/lib/types';
import { DOMAIN_COLORS } from '@/lib/gallup-strengths';

interface ReportResultPlaceholderProps {
  reportData: ReportInterpretResult;
  onBack: () => void;
}

export default function ReportResultPlaceholder({
  reportData,
  onBack,
}: ReportResultPlaceholderProps) {
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </motion.button>

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 font-serif">
            报告解读
          </h1>
          <p className="text-text-secondary text-sm">基于识别的 TOP5 优势生成</p>
        </motion.div>

        {/* TOP5 优势列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-serif">
            你的 TOP5 优势
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportData.top5Strengths.map((strength: { rank: number; name: string; domain: string }) => (
              <motion.div
                key={strength.rank}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: strength.rank * 0.1 }}
                className="bg-bg-card rounded-xl p-4 border border-border-light"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-brand">{strength.rank}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{strength.name}</p>
                    <p className="text-xs text-text-tertiary">{strength.domain}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 总结 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-serif">
            一句话解读
          </h2>
          <div className="bg-gradient-to-br from-brand/10 to-accent/5 rounded-xl p-6 border border-brand/20">
            <p className="text-text-secondary leading-relaxed">{reportData.summary}</p>
          </div>
        </motion.section>

        {/* 关键洞察 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-serif">
            关键洞察
          </h2>
          <div className="space-y-3">
            {reportData.keyInsights.map((insight: string, index: number) => (
              <div key={index} className="bg-bg-card rounded-lg p-4 border border-border-light flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{
                    backgroundColor: DOMAIN_COLORS['strategic' as keyof typeof DOMAIN_COLORS],
                  }}
                />
                <p className="text-text-secondary text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 建议路径 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-serif">
            建议的下一步
          </h2>
          <div className="space-y-3">
            {reportData.suggestedPaths.map((path: string, index: number) => (
              <div
                key={index}
                className="bg-accent/5 rounded-lg p-4 border border-accent/20"
              >
                <p className="text-text-secondary text-sm">💡 {path}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 占位提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-status-warning/5 border border-status-warning/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary mb-1">
                占位演示版本
              </p>
              <p className="text-xs text-text-tertiary">{reportData.notice}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
