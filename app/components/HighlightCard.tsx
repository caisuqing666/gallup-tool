'use client';

import { motion } from 'framer-motion';
import { useTypewriter } from '@/app/hooks/useTypewriter';

interface HighlightCardProps {
  highlight: string;
}

export default function HighlightCard({ highlight }: HighlightCardProps) {
  // 解析高光词条：支持 "标题|辅助说明" 格式
  const highlightParts = highlight.split('|');
  const highlightTitle = highlightParts[0] || highlight;
  const highlightSubtitle = highlightParts[1] || '';

  // 打字机效果（只对标题生效）
  const { displayedText: highlightTitleText, isTyping: isTypingHighlight } = useTypewriter(
    highlightTitle,
    { speed: 30, delay: 0, resetOnChange: true, interruptible: true }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <div className="bg-brand-subtle border border-brand/20 rounded-2xl p-6 sm:p-8 md:p-10 mb-4">
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-dark leading-tight px-2">
            {highlightTitleText}
            {isTypingHighlight && <span className="typing-cursor" />}
          </h1>
          {highlightSubtitle && (
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed px-2">
              {highlightSubtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-text-muted tracking-wider uppercase">
        <span className="w-8 h-px bg-border" />
        <span>基于优势的行动方案</span>
        <span className="w-8 h-px bg-border" />
      </div>
    </motion.div>
  );
}
