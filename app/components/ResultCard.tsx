'use client';

import { motion } from 'framer-motion';

interface ResultCardProps {
  data: {
    highlight_name: string;
    diagnostic: {
      analysis: string;
    };
    action_plans: string[];
  };
}

export default function ResultCard({ data }: ResultCardProps) {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
      {/* 渐显动效 1: 高光命名 */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-black text-gray-900 leading-tight mb-6"
      >
        {data.highlight_name}
      </motion.h2>
      
      {/* 渐显动效 2: 诊断卡片 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-blue-50 rounded-2xl p-4 mb-6 border-l-4 border-blue-500"
      >
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">系统诊断</p>
        <p className="text-gray-700 text-sm leading-relaxed">
          {data.diagnostic.analysis}
        </p>
      </motion.div>

      {/* 渐显动效 3: 行动建议列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        {data.action_plans.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="flex gap-3"
          >
            <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-mono">
              {index + 1}
            </span>
            <p className="text-gray-600 text-sm leading-snug">{action}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
