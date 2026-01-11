'use client';

import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black relative overflow-hidden px-4">
      {/* 背景光效 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-emerald/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* 装饰线 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-emerald to-transparent top-1/4 absolute"></div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-purple to-transparent top-3/4 absolute"></div>
        <div className="w-px h-full bg-gradient-to-b from-transparent via-cyber-emerald to-transparent left-1/4 absolute"></div>
        <div className="w-px h-full bg-gradient-to-b from-transparent via-cyber-purple to-transparent left-3/4 absolute"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl relative z-10"
      >
        <div className="mb-4">
          <span className="cyber-label inline-block mb-4 px-3 py-1 bg-cyber-emerald/10 border border-cyber-emerald/20 rounded-full">
            Quantum Strengths Translator
          </span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tighter">
          <span className="text-white">盖洛普优势</span>
          <br />
          <span className="text-gradient">行动方案生成器</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-lg mx-auto font-light">
          潜入优势的数字海洋，将天赋解码为
          <span className="text-cyber-emerald mx-1 font-medium">精准可执行</span>
          的决策锦囊
        </p>

        {/* 主按钮 */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="cyber-button text-xl px-12 py-5"
        >
          即 刻 启 动
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20"></div>
        </motion.button>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">34</span>
            <span className="text-[10px] text-gray-500 font-mono">STRENGTHS</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">AI</span>
            <span className="text-[10px] text-gray-500 font-mono">POWERED</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">4</span>
            <span className="text-[10px] text-gray-500 font-mono">DOMAINS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
