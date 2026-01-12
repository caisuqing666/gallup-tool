'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* 顶部装饰线 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* 品牌标签 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span className="badge-brand text-xs sm:text-sm">
              The Humanist Archive
            </span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4 sm:mb-6 tracking-tight leading-[1.1] px-2"
          >
            盖洛普优势
            <br />
            <span className="text-gradient">行动方案生成器</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-text-tertiary mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed px-4"
          >
            以温润的洞察，将你的天赋解码为
            <span className="text-brand font-medium mx-1">精准可执行</span>
            的决策锦囊
          </motion.p>

          {/* 主按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onStart}
              className="btn-primary w-full sm:w-auto px-8 sm:px-12"
            >
              开始探索
            </button>
          </motion.div>

          {/* 特性指标 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 sm:mt-16 md:mt-20 flex items-center justify-center gap-6 sm:gap-8 md:gap-16"
          >
            {[
              { value: '34', label: '项优势' },
              { value: 'AI', label: '智能驱动' },
              { value: '4', label: '大领域' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-text-muted tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* 底部装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="pb-8 text-center"
      >
        <p className="text-sm text-text-muted">
          基于盖洛普优势理论 · 用 AI 解读你的独特天赋
        </p>
      </motion.div>
    </div>
  );
}
