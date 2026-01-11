'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_STRENGTHS } from '@/lib/gallup-strengths';

interface InputPageProps {
  selectedStrengths: string[];
  confusion: string;
  onConfusionChange: (confusion: string) => void;
  onSubmit: () => void;
}

const TEMPLATE_TIPS = [
  '我拥有 [优势 A]，但现在遇到 [具体困境]，导致我 [负面结果]',
  '比如：我拥有 [责任]，但现在 [项目截止期变动]，导致我 [陷入混乱不敢决策]',
  '别担心措辞，哪怕是吐槽也可以。比如："我明明很细心（搜集），但现在这些乱七八糟的杂事让我快疯了。"',
];

export default function InputPage({
  selectedStrengths,
  confusion,
  onConfusionChange,
  onSubmit,
}: InputPageProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TEMPLATE_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black text-white px-4 py-16 relative overflow-hidden">
      {/* 装饰光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-emerald/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* 步骤指示器 */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <span className="cyber-label ml-2">Phase 03: Input Logic</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          用一句话说清楚，你现在 <span className="text-cyber-emerald">卡在哪</span>？
        </h2>

        {/* 动态引导 */}
        <div className="glass-card bg-cyber-emerald/5 border-cyber-emerald/20 p-4 mb-8 text-center overflow-hidden h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-cyber-emerald/80 text-sm font-medium leading-relaxed italic"
            >
              💡 {TEMPLATE_TIPS[currentTipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 输入框区域 */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-emerald/20 to-cyber-cyan/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
          <textarea
            value={confusion}
            onChange={(e) => onConfusionChange(e.target.value)}
            placeholder={`比如：我明明很细心（搜集），但现在这些乱七八糟的杂事让我快疯了（结果）`}
            className="relative w-full min-h-[250px] bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-white text-lg leading-relaxed focus:outline-none focus:border-cyber-emerald/50 transition-all placeholder-gray-600 resize-none shadow-inner"
          />

          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-widest leading-none">
              {confusion.length} CHARS_BUFFER
            </span>
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyber-emerald"
                animate={{ width: `${Math.min((confusion.length / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 提交区域 */}
        <div className="text-center">
          <motion.button
            onClick={onSubmit}
            disabled={!confusion.trim()}
            className="cyber-button text-xl px-16 relative overflow-hidden group"
          >
            <span className="relative z-10">开始极速生成方案</span>
            {/* 按钮内扫描线效果 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-full w-full -translate-y-full group-hover:animate-scan"></div>
          </motion.button>
          <p className="mt-6 text-gray-500 text-xs font-mono tracking-widest uppercase">
            Ready to synchronize with your potential?
          </p>
        </div>
      </div>
    </div>
  );
}
