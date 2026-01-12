'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ALL_STRENGTHS } from '@/lib/gallup-strengths';

interface LoadingPageProps {
  selectedStrengths: string[];
  confusion: string;
}

export default function LoadingPage({ selectedStrengths, confusion }: LoadingPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取前两个优势名称
  const strengthNames = selectedStrengths
    .slice(0, 2)
    .map(id => ALL_STRENGTHS.find(s => s.id === id)?.name)
    .filter(Boolean)
    .join('、') || '优势';

  // 提取困惑关键词（前15个字符）
  const confusionPreview = confusion.slice(0, 15) + (confusion.length > 15 ? '...' : '');

  if (!mounted) {
    return <div className="min-h-screen bg-bg-primary" />;
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-lg mx-auto text-center px-2">
        {/* 加载动画 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* 圆环动画 */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* 外圈 */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-border-light"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* 中圈 */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-brand/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* 内圈 - 进度指示 */}
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-transparent border-t-brand"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            {/* 中心点 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-brand"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>

          {/* 加载文字 */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-text-primary mb-3 sm:mb-4"
          >
            正在生成你的行动方案
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-text-tertiary leading-relaxed mb-4 sm:mb-6"
          >
            基于你的「<span className="text-brand font-medium">{strengthNames}</span>」优势
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            分析「{confusionPreview}」的根源...
          </motion.p>

          {/* 进度点 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="loading-dot" />
            ))}
          </motion.div>
        </motion.div>

        {/* 提示文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-text-muted"
        >
          AI 正在深度解读你的优势组合，请稍候...
        </motion.p>
      </div>
    </div>
  );
}
