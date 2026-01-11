'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ResultData } from '@/lib/types';
import { useTypewriter } from '@/app/hooks/useTypewriter';
import html2canvas from 'html2canvas';

interface ResultPageProps {
  data: ResultData;
  onSave?: () => void;
  onRegenerate?: () => void;
}


export default function ResultPage({ data, onSave, onRegenerate }: ResultPageProps) {
  // 打字机效果：高光词条先显示，停顿 0.5 秒后显示其他内容
  const { displayedText: highlightText, isTyping: isTypingHighlight } = useTypewriter(
    data.highlight,
    30, // 打字速度
    0 // 无延迟，立即开始
  );

  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showBlindspot, setShowBlindspot] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // 长图捕获引用
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gallup_result_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (e) {
      console.error('保存长图失败', e);
    }
  };

  // 当 data.highlight 变化时，重置所有状态
  useEffect(() => {
    setShowDiagnosis(false);
    setShowBlindspot(false);
    setShowActions(false);
    setShowTips(false);
  }, [data.highlight]);

  // 高光词条打字完成后，延迟显示其他模块
  useEffect(() => {
    if (!isTypingHighlight && highlightText === data.highlight && data.highlight.length > 0) {
      const timer1 = setTimeout(() => setShowDiagnosis(true), 500); // 停顿 0.5 秒
      const timer2 = setTimeout(() => setShowBlindspot(true), 1000);
      const timer3 = setTimeout(() => setShowActions(true), 1500);
      const timer4 = setTimeout(() => setShowTips(true), 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
    return undefined;
  }, [isTypingHighlight, highlightText, data.highlight]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 backdrop-blur-sm" ref={containerRef}>
      <div className="max-w-3xl mx-auto">
        {/* 高光词条 - 打字机效果 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="bg-gradient-to-r from-green-500/20 via-green-400/20 to-green-500/20 border border-green-400/30 rounded-xl p-8 mb-4 backdrop-blur-sm">
            <h1 className="text-3xl md:text-5xl font-bold text-green-300 font-mono mb-4 leading-tight min-h-[120px] md:min-h-[150px]">
              {highlightText}
              {isTypingHighlight && (
                <span className="animate-pulse text-green-400">|</span>
              )}
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTypingHighlight ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-xs text-green-400/70 font-mono tracking-widest uppercase"
          >
            <span className="w-8 h-px bg-green-400/50"></span>
            <span>STRENGTH-BASED ACTION PLAN</span>
            <span className="w-8 h-px bg-green-400/50"></span>
          </motion.div>
        </motion.div>

        {/* 系统判断（深度解读）- 渐显效果 */}
        {showDiagnosis && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-green-900/30 via-gray-800 to-blue-900/30 border-l-4 border-green-400 p-6 rounded-lg mb-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-green-400">[模块 ①]</span>
              <span>系统诊断</span>
            </h2>
            <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-5">
              <p className="text-sm text-green-300/80 font-mono mb-3 uppercase tracking-wide font-semibold">深度解读：</p>
              <p className="text-gray-200 leading-relaxed text-base">
                {data.judgment}
              </p>
            </div>

            {/* 优势配比逻辑 - 更突出的展示 */}
            {(data.strengthConflicts || data.strengthBasement) && (
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                {data.strengthConflicts && data.strengthConflicts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-l-4 border-yellow-400 rounded-lg p-5 shadow-lg"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-yellow-300 font-mono uppercase tracking-wide mr-2 font-bold">
                        ⚔️ 高频内耗检测
                      </span>
                    </div>
                    <div className="text-base text-yellow-100 font-semibold mb-2 space-y-2">
                      {data.strengthConflicts.map((conflict, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-yellow-400">⚡</span>
                          <span>{conflict} 发生了高频内耗</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-yellow-300/80 mt-3 leading-relaxed">
                      不同领域的优势在同一场景中产生冲突，需要重新分配使用场景。这不是优势的问题，而是匹配的问题。
                    </p>
                  </motion.div>
                )}
                {data.strengthBasement && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-l-4 border-red-400 rounded-lg p-5 shadow-lg"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-red-300 font-mono uppercase tracking-wide mr-2 font-bold">
                        🚨 Basement（地下室状态）
                      </span>
                    </div>
                    <div className="text-base text-red-100 font-semibold mb-2 flex items-center gap-2">
                      <span className="text-red-400">📉</span>
                      <span>你的「{data.strengthBasement}」优势目前正处于 Basement（地下室状态）</span>
                    </div>
                    <p className="text-sm text-red-300/80 mt-3 leading-relaxed">
                      当优势被过度使用或误用时，会进入"地下室"状态，反而成为负担。这不是优势消失，而是被误用了。
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* 盲区提醒（反直觉视角）- 渐显效果 */}
        {showBlindspot && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-yellow-900/30 via-gray-800 to-orange-900/30 border-l-4 border-yellow-400 p-6 rounded-lg mb-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-yellow-400">[模块 ②]</span>
              <span>盲区提醒</span>
            </h2>
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-5">
              <p className="text-sm text-yellow-300/80 font-mono mb-2 uppercase tracking-wide">反直觉视角：</p>
              <p className="text-gray-100 leading-relaxed text-base">
                {data.blindspot}
              </p>
            </div>
          </motion.div>
        )}

        {/* 行动建议（替代性行动）- 渐显效果 */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-900/30 via-gray-800 to-purple-900/30 border-l-4 border-blue-400 p-6 rounded-lg mb-8 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-blue-400">[模块 ③]</span>
              <span>替代性行动</span>
            </h2>
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-6">
              <p className="text-base text-blue-200 font-semibold">
                今日即可启动的 {data.actions.length} 件事：
              </p>
            </div>
            <ul className="space-y-4">
              {data.actions.map((action, index) => {
                // 提取行动名称（如果有冒号分隔）
                const parts = action.split('：');
                const actionName = parts.length > 1 ? parts[0] : null;
                const actionDesc = parts.length > 1 ? parts.slice(1).join('：') : action;

                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-r from-gray-700/60 to-gray-700/40 p-5 rounded-lg border border-blue-400/20 shadow-md hover:border-blue-400/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-blue-400 font-mono text-lg font-bold flex-shrink-0 w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-400/30">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        {actionName && (
                          <p className="text-blue-300 font-bold mb-2 text-base">
                            {actionName}：
                          </p>
                        )}
                        <p className="text-gray-100 leading-relaxed text-base">
                          {actionDesc}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}

        {/* 优势锦囊（旋钮调节式建议）- 渐显效果 */}
        {showTips && data.advantageTips && data.advantageTips.instruction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 border-l-4 border-purple-400 p-6 rounded-lg mb-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white font-mono flex items-center gap-2">
                <span className="text-purple-400">[模块 ④]</span>
                <span>优势锦囊</span>
              </h2>
              <span className="text-xs text-purple-300 font-mono bg-purple-900/50 px-3 py-1.5 rounded-full border border-purple-400/30 font-bold">
                🎛️ 旋钮调节
              </span>
            </div>

            {/* 调节指令 */}
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-5 mb-6">
              <p className="text-base text-purple-100 leading-relaxed font-medium mb-3">
                {data.advantageTips.instruction}
              </p>
              <p className="text-xs text-purple-300/70 italic leading-relaxed">
                💡 这种**"旋钮调节"**式的比喻，让你觉得这个 AI 真的在帮你操纵内心的力量。
              </p>
            </div>

            {/* 旋钮式展示 */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* 需要调低的优势 */}
              {data.advantageTips.reduce && data.advantageTips.reduce.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm text-red-300 font-mono uppercase tracking-wide font-bold flex items-center gap-2">
                    <span>⬇️</span>
                    <span>调低优势</span>
                  </h3>
                  {data.advantageTips.reduce.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      className="bg-red-900/30 border border-red-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-200 font-semibold">「{item.strength}」</span>
                        <span className="text-red-400 font-mono text-lg font-bold">-{item.percentage}%</span>
                      </div>
                      {/* 旋钮视觉效果 */}
                      <div className="relative h-4 bg-red-900/50 rounded-full overflow-hidden mb-2 border border-red-700/30">
                        <div className="absolute inset-0 flex items-center justify-end pr-2 z-10">
                          <span className="text-xs text-red-400/60 font-mono font-bold">{100 - item.percentage}%</span>
                        </div>
                        <motion.div
                          initial={{ width: '100%' }}
                          animate={{ width: `${100 - item.percentage}%` }}
                          transition={{ duration: 1.2, delay: 1 + index * 0.1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-red-700/80 to-red-500/80 rounded-full relative"
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-red-300 shadow-lg ring-2 ring-red-400/30"></div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-red-300/70">{item.reason}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 需要调高的优势 */}
              {data.advantageTips.increase && data.advantageTips.increase.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm text-green-300 font-mono uppercase tracking-wide font-bold flex items-center gap-2">
                    <span>⬆️</span>
                    <span>调高优势</span>
                  </h3>
                  {data.advantageTips.increase.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      className="bg-green-900/30 border border-green-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-200 font-semibold">「{item.strength}」</span>
                        <span className="text-green-400 font-mono text-lg font-bold">+{item.percentage}%</span>
                      </div>
                      {/* 旋钮视觉效果 */}
                      <div className="relative h-4 bg-green-900/50 rounded-full overflow-hidden mb-2 border border-green-700/30">
                        <div className="absolute inset-0 flex items-center justify-end pr-2 z-10">
                          <span className="text-xs text-green-400/60 font-mono font-bold">{item.percentage}%</span>
                        </div>
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.2, delay: 1 + index * 0.1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-green-700/80 to-green-500/80 rounded-full relative"
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-2 border-green-300 shadow-lg ring-2 ring-green-400/30"></div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-green-300/70">{item.reason}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 底部交互按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          {onSave && (
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg hover:shadow-xl border border-green-500/30"
            >
              📸 生成我的专属行动锦囊（保存长图）
            </motion.button>
          )}
          {onRegenerate && (
            <motion.button
              onClick={onRegenerate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700/80 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium border border-gray-600/50"
            >
              🔄 换一个场景继续优化
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
