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
    return <div className="min-h-screen bg-bg-primary" />;
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* 顶部装饰线 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* 品牌标签 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="badge-brand">
              The Humanist Archive
            </span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight leading-[1.1]"
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
            className="text-lg md:text-xl text-text-tertiary mb-12 max-w-xl mx-auto leading-relaxed"
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
              className="btn-primary text-lg px-12"
            >
              开始探索
            </button>
          </motion.div>

          {/* 特性指标 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 flex items-center justify-center gap-8 md:gap-16"
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
                <div className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted tracking-wide">
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
