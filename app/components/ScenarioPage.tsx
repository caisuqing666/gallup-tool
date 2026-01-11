'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SCENARIOS } from '@/lib/scenarios';
import { ScenarioId } from '@/lib/scenarios';

interface ScenarioPageProps {
  selectedScenario?: ScenarioId;
  onSelectScenario: (scenarioId: ScenarioId) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function ScenarioPage({
  selectedScenario,
  onSelectScenario,
  onNext,
  onBack,
}: ScenarioPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="page-container"><div className="page-content" /></div>;
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* 返回按钮 */}
        {onBack && (
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="back-button mb-10"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </motion.button>
        )}

        {/* 步骤指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="step-indicator mb-12"
        >
          <div className="step-dot-active rounded-full" />
          <div className="step-dot-inactive" />
          <div className="step-dot-inactive" />
          <span className="text-sm text-text-muted ml-3">步骤 1 / 3</span>
        </motion.div>

        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
            你现在最需要用优势解决哪类问题？
          </h1>
          <p className="text-lg text-text-tertiary">
            选择一个您最关心的现实场景，我们将基于此进行深度调频
          </p>
        </motion.div>

        {/* 场景卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {SCENARIOS.map((scenario, index) => {
            const isSelected = selectedScenario === scenario.id;

            return (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                onClick={() => onSelectScenario(scenario.id)}
                className={`
                  text-left p-6 md:p-8 rounded-2xl border transition-all duration-300
                  ${isSelected
                    ? 'bg-brand-subtle border-brand shadow-glow'
                    : 'bg-bg-card border-border-light hover:border-border hover:shadow-card'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-medium tracking-wider uppercase ${
                    isSelected ? 'text-brand' : 'text-text-muted'
                  }`}>
                    场景 {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* 选中指示器 */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected
                      ? 'border-brand bg-brand'
                      : 'border-border-dark bg-transparent'
                    }
                  `}>
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </div>

                <h3 className={`text-lg md:text-xl font-semibold leading-relaxed ${
                  isSelected ? 'text-brand-dark' : 'text-text-primary'
                }`}>
                  {scenario.title}
                </h3>
              </motion.button>
            );
          })}
        </div>

        {/* 底部操作区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-bg-secondary rounded-2xl"
        >
          <p className="text-sm text-text-tertiary text-center sm:text-left">
            {selectedScenario
              ? '场景已选择，点击下一步继续'
              : '请选择一个场景以继续...'
            }
          </p>

          <motion.button
            onClick={onNext}
            disabled={!selectedScenario}
            whileHover={selectedScenario ? { scale: 1.02 } : {}}
            whileTap={selectedScenario ? { scale: 0.98 } : {}}
            className="btn-primary whitespace-nowrap"
          >
            下一步：选择优势
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
