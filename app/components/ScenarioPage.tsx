'use client';

import { motion } from 'framer-motion';
import { SCENARIOS } from '@/lib/scenarios';

interface ScenarioPageProps {
  selectedScenario?: string;
  onSelectScenario: (scenarioId: string) => void;
  onNext: () => void;
}

export default function ScenarioPage({
  selectedScenario,
  onSelectScenario,
  onNext,
}: ScenarioPageProps) {
  return (
    <div className="min-h-screen bg-cyber-black text-white px-4 py-20 relative overflow-hidden">
      {/* 背景微光 */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyber-emerald/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* 步骤指示器 */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <div className="h-1 w-12 bg-white/10 rounded-full"></div>
          <div className="h-1 w-12 bg-white/10 rounded-full"></div>
          <span className="cyber-label ml-2">Phase 01: Core Scenario</span>
        </div>

        {/* 标题 */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          你现在最需要用优势解决哪类问题？
        </h2>
        <p className="text-gray-400 mb-12 text-lg">选择一个您最关心的现实场景，我们将基于此进行深度调频</p>

        {/* 场景卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {SCENARIOS.map((scenario, index) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => onSelectScenario(scenario.id)}
              className={`
                text-left p-8 rounded-2xl transition-all duration-300 relative group overflow-hidden
                ${selectedScenario === scenario.id
                  ? 'bg-cyber-emerald/10 border-2 border-cyber-emerald shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10'
                }
              `}
            >
              {/* 装饰背景轴线 */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${selectedScenario === scenario.id ? 'bg-cyber-emerald' : 'bg-transparent group-hover:bg-white/20'
                }`}></div>

              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-mono ${selectedScenario === scenario.id ? 'text-cyber-emerald' : 'text-gray-500'
                  }`}>
                  SCENARIO_{index.toString().padStart(2, '0')}
                </span>
                {selectedScenario === scenario.id && (
                  <motion.div layoutId="active-check" className="text-cyber-emerald">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>

              <span className={`text-xl font-bold leading-relaxed block ${selectedScenario === scenario.id ? 'text-white' : 'text-gray-200'
                }`}>
                {scenario.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* 下一步按钮 */}
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-gray-400">
            {selectedScenario ? '场景已选择，点击右侧按钮进入优势解码' : '请先选择一个场景以继续...'}
          </p>
          <motion.button
            onClick={onNext}
            disabled={!selectedScenario}
            className="cyber-button"
          >
            下一步：解码优势
          </motion.button>
        </div>
      </div>
    </div>
  );
}
