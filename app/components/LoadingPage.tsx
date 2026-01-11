'use client';

import { motion } from 'framer-motion';
import { ALL_STRENGTHS } from '@/lib/gallup-strengths';

interface LoadingPageProps {
  selectedStrengths: string[];
  confusion: string;
}

export default function LoadingPage({ selectedStrengths, confusion }: LoadingPageProps) {
  const strengthNames = selectedStrengths
    .slice(0, 2)
    .map(id => ALL_STRENGTHS.find(s => s.id === id)?.name)
    .filter(Boolean)
    .join('、') || '优势';

  // 提取困惑关键词
  const confusionKeywords = confusion.slice(0, 10) || '困惑';

  return (
    <div className="min-h-screen bg-cyber-black text-white flex flex-col items-center justify-center px-4 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-green-400 font-mono mb-8">
            正在生成你的行动方案...
          </h2>

          <div className="space-y-4 mb-8">
            <p className="text-base md:text-lg text-green-400 font-mono">
              正在基于你的「{strengthNames}」优势，反向推演你的「{confusionKeywords}」根源...
            </p>
            <p className="text-sm text-green-500 font-mono mt-4">
              REVERSE ENGINEERING...
            </p>
          </div>

          {/* 加载动画 */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
