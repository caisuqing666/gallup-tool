'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PathId, PATH_DESCRIPTIONS } from '@/lib/types';
import { isPathImplemented } from '@/lib/path-config';

interface LandingPageProps {
  onSelectPath: (pathId: PathId) => void;
}

// 路径卡片顺序（按照用户需求排列）
const PATH_ORDER: PathId[] = [
  'report-interpret',  // 我不太懂这份报告
  'career-match',      // 我想找到适合的职业方向
  'breakthrough',      // 我遇到了具体问题
  'strength-guide',    // 我想更好地发挥自己
];

export default function LandingPage({ onSelectPath }: LandingPageProps) {
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
    <div className="min-h-screen bg-paper-subtle bg-fixed flex flex-col">
      {/* 顶部装饰线 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
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
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6 tracking-tight leading-[1.1] px-2"
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
            className="text-base sm:text-lg md:text-xl text-text-tertiary mb-10 sm:mb-14 max-w-xl mx-auto leading-relaxed px-4"
          >
            选择你想要的帮助方式
          </motion.p>

          {/* 4入口卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {PATH_ORDER.map((pathId, index) => {
              const pathInfo = PATH_DESCRIPTIONS[pathId];
              const isImplemented = isPathImplemented(pathId);

              return (
                <motion.button
                  key={pathId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  onClick={() => isImplemented && onSelectPath(pathId)}
                  disabled={!isImplemented}
                  className={`
                    relative p-6 sm:p-8 rounded-2xl text-left transition-all duration-300
                    ${isImplemented
                      ? 'bg-white/80 hover:bg-white hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-gray-100 hover:border-brand/30'
                      : 'bg-gray-50/50 cursor-not-allowed border border-gray-100 opacity-60'
                    }
                  `}
                >
                  {/* 图标 */}
                  <div className="text-3xl sm:text-4xl mb-4">
                    {pathInfo.icon}
                  </div>

                  {/* 标题 */}
                  <h3 className={`
                    text-lg sm:text-xl font-bold mb-2
                    ${isImplemented ? 'text-text-primary' : 'text-text-muted'}
                  `}>
                    {pathInfo.title}
                  </h3>

                  {/* 副标题 */}
                  <p className={`
                    text-sm sm:text-base
                    ${isImplemented ? 'text-text-tertiary' : 'text-text-muted'}
                  `}>
                    {pathInfo.subtitle}
                  </p>

                  {/* 未实现标记 */}
                  {!isImplemented && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-500 rounded-full">
                        即将推出
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
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
