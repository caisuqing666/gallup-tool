'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ResultData } from '@/lib/types';
import { useTypewriter } from '@/app/hooks/useTypewriter';
import html2canvas from 'html2canvas';
import Toast, { type ToastType } from './Toast';

interface ResultPageProps {
  data: ResultData;
  isMockResult?: boolean;
  onSave?: (data: ResultData) => void;
  onRegenerate?: () => void;
  onBack?: () => void;
}

export default function ResultPage({ data, isMockResult = false, onSave, onRegenerate, onBack }: ResultPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 打字机效果
  const { displayedText: highlightText, isTyping: isTypingHighlight } = useTypewriter(
    data.highlight,
    { speed: 30, delay: 0, resetOnChange: true, interruptible: true }
  );

  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showBlindspot, setShowBlindspot] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 保存为图片
  const handleSaveClick = async () => {
    if (isSaving || !containerRef.current) return;

    setIsSaving(true);
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAFAF8',
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          setToast({ message: '保存失败：无法生成图片', type: 'error' });
          setIsSaving(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gallup_result_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setToast({ message: '已保存到本地', type: 'success' });
        if (onSave) onSave(data);
        setIsSaving(false);
      }, 'image/png');
    } catch (e) {
      setToast({ message: '保存失败', type: 'error' });
      setIsSaving(false);
    }
  };

  // 重置状态
  useEffect(() => {
    setShowDiagnosis(false);
    setShowBlindspot(false);
    setShowActions(false);
    setShowTips(false);
  }, [data.highlight]);

  // 渐进显示各模块
  useEffect(() => {
    if (!isTypingHighlight && highlightText === data.highlight && data.highlight.length > 0) {
      const timers = [
        setTimeout(() => setShowDiagnosis(true), 400),
        setTimeout(() => setShowBlindspot(true), 800),
        setTimeout(() => setShowActions(true), 1200),
        setTimeout(() => setShowTips(true), 1600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isTypingHighlight, highlightText, data.highlight]);

  if (!mounted) {
    return <div className="min-h-screen bg-bg-primary" />;
  }

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Mock 数据提示 */}
      {isMockResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-status-warning/10 border border-status-warning/30 text-status-warning px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <span>示例输出（演示模式）</span>
          </div>
        </motion.div>
      )}

      <div className="min-h-screen bg-bg-primary px-4 py-8 md:py-12" ref={containerRef}>
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          {onBack && (
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="back-button mb-8"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回修改</span>
            </motion.button>
          )}

          {/* 高光词条 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-brand-subtle border border-brand/20 rounded-2xl p-8 md:p-10 mb-4">
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-brand-dark leading-tight min-h-[80px] md:min-h-[100px]">
                {highlightText}
                {isTypingHighlight && <span className="typing-cursor" />}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-text-muted tracking-wider uppercase">
              <span className="w-8 h-px bg-border" />
              <span>基于优势的行动方案</span>
              <span className="w-8 h-px bg-border" />
            </div>
          </motion.div>

          {/* 模块一：系统诊断 */}
          {showDiagnosis && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-domain-strategic/10 text-domain-strategic flex items-center justify-center text-sm font-bold">1</span>
                  <h2 className="text-lg font-semibold text-text-primary">系统诊断</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">{data.judgment}</p>

                {/* 优势配比分析 */}
                {(data.strengthConflicts || data.strengthBasement) && (
                  <div className="mt-6 pt-6 border-t border-border-light space-y-4">
                    {data.strengthConflicts && data.strengthConflicts.length > 0 && (
                      <div className="bg-status-warning/5 border border-status-warning/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-status-warning text-sm font-medium">高频内耗检测</span>
                        </div>
                        <div className="space-y-1">
                          {data.strengthConflicts.map((conflict, idx) => (
                            <p key={idx} className="text-sm text-text-secondary">
                              {conflict} 发生了高频内耗
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {data.strengthBasement && (
                      <div className="bg-status-error/5 border border-status-error/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-status-error text-sm font-medium">Basement 状态</span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          你的「{data.strengthBasement}」优势目前处于地下室状态，需要调整使用方式
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* 模块二：盲区提醒 */}
          {showBlindspot && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-status-warning/10 text-status-warning flex items-center justify-center text-sm font-bold">2</span>
                  <h2 className="text-lg font-semibold text-text-primary">盲区提醒</h2>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded-full">反直觉视角</span>
                </div>
                <p className="text-text-secondary leading-relaxed">{data.blindspot}</p>
              </div>
            </motion.section>
          )}

          {/* 模块三：行动建议 */}
          {showActions && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-domain-executing/10 text-domain-executing flex items-center justify-center text-sm font-bold">3</span>
                  <h2 className="text-lg font-semibold text-text-primary">替代性行动</h2>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded-full">今日即可启动</span>
                </div>
                <ul className="space-y-4">
                  {data.actions.map((action, index) => {
                    const parts = action.split('：');
                    const actionName = parts.length > 1 ? parts[0] : null;
                    const actionDesc = parts.length > 1 ? parts.slice(1).join('：') : action;

                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        <span className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          {actionName && (
                            <p className="text-brand font-medium mb-1">{actionName}</p>
                          )}
                          <p className="text-text-secondary leading-relaxed">{actionDesc}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.section>
          )}

          {/* 模块四：优势锦囊 */}
          {showTips && data.advantageTips && data.advantageTips.instruction && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-domain-relationship/10 text-domain-relationship flex items-center justify-center text-sm font-bold">4</span>
                    <h2 className="text-lg font-semibold text-text-primary">优势锦囊</h2>
                  </div>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded-full">旋钮调节</span>
                </div>

                <p className="text-text-secondary leading-relaxed mb-6">{data.advantageTips.instruction}</p>

                {/* 调节指示器 */}
                <div className="grid md:grid-cols-2 gap-4">
                  {data.advantageTips.reduce && data.advantageTips.reduce.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-status-error flex items-center gap-2">
                        <span>调低</span>
                      </h3>
                      {data.advantageTips.reduce.map((item, index) => (
                        <div key={index} className="bg-status-error/5 border border-status-error/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-text-primary font-medium">「{item.strength}」</span>
                            <span className="text-status-error text-sm font-bold">-{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-status-error/10 rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: '100%' }}
                              animate={{ width: `${100 - item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-status-error/60 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-text-muted">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.advantageTips.increase && data.advantageTips.increase.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-status-success flex items-center gap-2">
                        <span>调高</span>
                      </h3>
                      {data.advantageTips.increase.map((item, index) => (
                        <div key={index} className="bg-status-success/5 border border-status-success/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-text-primary font-medium">「{item.strength}」</span>
                            <span className="text-status-success text-sm font-bold">+{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-status-success/10 rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-status-success/60 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-text-muted">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* 底部按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-12"
          >
            {onSave && (
              <motion.button
                onClick={handleSaveClick}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                {isSaving ? '保存中...' : '保存为图片'}
              </motion.button>
            )}
            {onRegenerate && (
              <motion.button
                onClick={onRegenerate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                换个场景
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
