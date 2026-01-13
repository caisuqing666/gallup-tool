'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultData } from '@/lib/types';
import { ScenarioId } from '@/lib/scenarios';
import { getStopButtonText } from './result-helpers';

interface ActionSectionProps {
  data: ResultData;
  scenario?: ScenarioId;
}

export default function ActionSection({ data, scenario }: ActionSectionProps) {
  const [isStopButtonExpanded, setIsStopButtonExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
        {/* 主按钮：停止乱想，直接选一个（开关模式） */}
        <StopButton
          isExpanded={isStopButtonExpanded}
          onToggle={() => setIsStopButtonExpanded(!isStopButtonExpanded)}
          scenario={scenario}
        />

        {/* 展开内容：固定三条清理指令 */}
        <AnimatePresence>
          {isStopButtonExpanded && (
            <ActionList actions={data.actions} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// 停止按钮
function StopButton({ isExpanded, onToggle, scenario }: { isExpanded: boolean; onToggle: () => void; scenario?: string }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`w-full mb-4 transition-all duration-300 ${
        isExpanded
          ? 'bg-gray-300/30 border-2 border-gray-400 cursor-default'
          : 'bg-brand/10 border-2 border-brand hover:bg-brand/20'
      } rounded-xl p-4 sm:p-6 flex items-center justify-between group`}
      whileHover={isExpanded ? {} : { scale: 1.01 }}
      whileTap={isExpanded ? {} : { scale: 0.99 }}
      disabled={isExpanded}
    >
      <div className="flex items-center gap-3">
        {/* 开关图标 */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isExpanded
              ? 'bg-gray-500 text-white'
              : 'bg-brand text-white'
          }`}
        >
          {isExpanded ? (
            // 已激活：对勾图标 ✓
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            // 未激活：播放图标 ▶
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
        <span
          className={`text-lg sm:text-xl font-bold transition-all duration-300 ${
            isExpanded ? 'text-gray-600' : 'text-brand'
          }`}
        >
          {isExpanded ? '已止乱' : getStopButtonText(scenario)}
        </span>
      </div>
      {!isExpanded && (
        <svg
          className="w-5 h-5 text-brand transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </motion.button>
  );
}

// 行动列表
function ActionList({ actions }: { actions: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="bg-bg-secondary rounded-xl p-4 sm:p-6 space-y-6">
        <p className="text-text-primary font-medium text-center mb-6">
          现在开始，按下面做。
        </p>

        {actions.map((action, index) => (
          <ActionItem key={index} action={action} index={index} />
        ))}

        {/* 封口句 */}
        <div className="mt-8 pt-6 border-t border-border-light">
          <p className="text-text-secondary leading-relaxed text-center italic">
            做到这一步，今天已经足够。
            <br />
            不需要更清楚，也不需要更完美。
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// 单个行动项
function ActionItem({ action, index }: { action: string; index: number }) {
  // 按换行符分割，第一行是标题
  const lines = action.split('\n');
  const actionTitle = lines[0] || '';
  const actionContent = lines.slice(1).join('\n');

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-3"
    >
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-brand font-semibold mb-3 text-base">{actionTitle}</p>
          <div className="text-text-secondary leading-relaxed space-y-1.5 whitespace-pre-line">
            {actionContent.split('\n').map((line, lineIdx) => {
              // 处理👉开头的行，使其更突出
              if (line.startsWith('👉')) {
                return (
                  <p key={lineIdx} className="text-text-primary font-medium mt-2 italic">
                    {line}
                  </p>
                );
              }
              return (
                <p key={lineIdx} className={lineIdx === 0 ? 'font-medium' : ''}>
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
