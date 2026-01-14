'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExplainData, DecideData, GallupResult } from '@/lib/types';
import Toast, { type ToastType } from './Toast';
import { exportToImage } from '@/lib/export';

// 解释页组件
function ExplainPage({ data }: { data: ExplainData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          理解发生了什么
        </h1>
        <p className="text-text-secondary text-sm">
          只描述，不判断
        </p>
      </div>

      {/* 单优势行为表现 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card rounded-2xl border border-border-light p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">你的优势在做什么</h2>
        <div className="space-y-4">
          {data.strengthManifestations.map((item, index) => (
            <div key={index} className="bg-bg-secondary rounded-xl p-4">
              <div className="text-brand font-medium mb-2">{item.strengthId}</div>
              <p className="text-text-secondary leading-relaxed">{item.behaviors}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 优势组合互动 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bg-card rounded-2xl border border-border-light p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">优势之间在发生什么</h2>
        <p className="text-text-secondary leading-relaxed">{data.strengthInteractions}</p>
      </motion.section>

      {/* 认知盲区 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-status-warning/5 border border-status-warning/20 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">你可能没意识到</h2>
        <p className="text-text-secondary leading-relaxed">{data.blindspots}</p>
      </motion.section>

      {/* 总结性说明 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-brand/5 border-l-4 border-brand rounded-r-2xl p-6"
      >
        <p className="text-text-primary font-medium text-lg">{data.summary}</p>
      </motion.section>
    </motion.div>
  );
}

// 判定页组件
function DecidePage({ data }: { data: DecideData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          现在该怎么做
        </h1>
        <p className="text-text-secondary text-sm">
          只判断，不解释
        </p>
      </div>

      {/* 核心判词 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-text-primary text-white rounded-2xl p-6 sm:p-8 shadow-lg"
      >
        <div className="text-[10px] text-accent uppercase tracking-wider font-medium mb-4">
          优势使用判定
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
          {data.verdict}
        </h2>
      </motion.section>

      {/* 更应该做什么 */}
      {data.doMore.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-brand/5 border-l-4 border-brand rounded-r-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-brand mb-4">✓ 更应该做</h2>
          <div className="space-y-4">
            {data.doMore.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✓
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium mb-1">{item.action}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-text-muted mb-2">
                      <span className="bg-bg-secondary px-2 py-1 rounded">
                        时机：{item.timing}
                      </span>
                      <span className="bg-bg-secondary px-2 py-1 rounded">
                        标准：{item.criteria}
                      </span>
                    </div>
                    <p className="text-status-error text-sm font-medium">
                      否则，{item.consequence}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 更应该少做 */}
      {data.doLess.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-status-error/5 border-l-4 border-status-error rounded-r-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-status-error mb-4">✕ 更应该少做</h2>
          <div className="space-y-4">
            {data.doLess.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-status-error text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✕
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary font-medium mb-1">{item.action}</p>
                    <p className="text-text-secondary text-sm mb-2">替代：{item.replacement}</p>
                    <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded inline-block">
                      从：{item.timing}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 责任边界 */}
      {data.boundaries.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-domain-strategic/5 border border-domain-strategic/20 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4">责任边界</h2>
          <div className="space-y-3">
            {data.boundaries.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-text-secondary text-sm">
                    <span className="text-brand font-medium">负责：</span>{item.responsibleFor}
                  </p>
                  <p className="text-text-secondary text-sm mt-1">
                    <span className="text-status-error font-medium">不负责：</span>{item.notResponsibleFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 用对力判断规则 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-accent/10 border border-accent/30 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-text-primary font-medium mb-1">用对力判断规则</p>
            <p className="text-text-secondary text-sm">{data.checkRule}</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

// 主页面组件
interface ResultPageProps {
  explainData: ExplainData;
  decideData: DecideData;
  onSave?: (savedData: GallupResult) => void;
  onRegenerate?: () => void;
  onBack?: () => void;
}

export default function ResultPage({
  explainData,
  decideData,
  onSave,
  onRegenerate,
  onBack,
}: ResultPageProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'explain' | 'decide'>('explain');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 保存当前页面为图片
  const handleSaveAsImage = async () => {
    if (isSaving || !contentRef.current) return;

    setIsSaving(true);
    try {
      await exportToImage(contentRef.current, {
        filename: `gallup_${activeTab}_${Date.now()}`,
        format: 'png',
        scale: 2,
      });

      setToast({ message: '已保存到本地', type: 'success' });
      if (onSave) {
        onSave({ explain: explainData, decide: decideData });
      }
    } catch (e) {
      setToast({ message: '保存失败', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-bg-primary px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          {onBack && (
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回修改</span>
            </motion.button>
          )}

          {/* 页面切换标签 */}
          <div className="flex gap-2 mb-8 bg-bg-card rounded-xl p-1.5 border border-border-light">
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'explain'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              理解发生了什么
            </button>
            <button
              onClick={() => setActiveTab('decide')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'decide'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              现在该怎么做
            </button>
          </div>

          {/* 内容区域 - 添加 ref 用于导出 */}
          <div ref={contentRef}>
            <AnimatePresence mode="wait">
              {activeTab === 'explain' ? (
                <motion.div
                  key="explain"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExplainPage data={explainData} />
                </motion.div>
              ) : (
                <motion.div
                  key="decide"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DecidePage data={decideData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 底部操作按钮 */}
          <div className="mt-8 flex gap-4 justify-center">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-6 py-3 border-2 border-border-light rounded-xl text-text-primary font-medium hover:bg-bg-card transition-colors"
              >
                重新生成
              </button>
            )}
            <button
              onClick={handleSaveAsImage}
              disabled={isSaving}
              className="px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? '保存中...' : `保存${activeTab === 'explain' ? '解释页' : '判定页'}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
