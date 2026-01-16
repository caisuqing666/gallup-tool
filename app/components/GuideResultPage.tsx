'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrengthGuideResult, StrengthGuide } from '@/lib/types';
import { DOMAIN_COLORS } from '@/lib/gallup-strengths';
import Toast, { type ToastType } from './Toast';
import { exportToImage } from '@/lib/export';

interface GuideResultPageProps {
  guideData: StrengthGuideResult;
  strengths: string[];
  onRegenerate?: () => void;
  onBack?: () => void;
}

// 个人化标签组件
function PersonalLabelSection({ data }: { data: StrengthGuideResult['personalLabel'] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl p-6 sm:p-8 border border-brand/20"
    >
      <div className="text-center">
        <p className="text-sm text-text-muted mb-2">你的优势标签</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 font-serif">
          {data.label}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {data.meaning}
        </p>
        {data.basedOn.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {data.basedOn.map((strength, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/60 rounded-full text-sm text-text-tertiary border border-brand/10"
              >
                {strength}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

// 一句话总结组件
function OneLinerSection({ oneLiner }: { oneLiner: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-text-primary text-white rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <svg className="w-6 h-6 text-accent flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg sm:text-xl leading-relaxed">{oneLiner}</p>
      </div>
    </motion.section>
  );
}

// 单个优势指南卡片
function StrengthGuideCard({ guide, index }: { guide: StrengthGuide; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-bg-card rounded-2xl border border-border-light overflow-hidden"
    >
      {/* 标题栏 - 可点击展开 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: DOMAIN_COLORS['strategic'] as string }}
          />
          <h3 className="text-lg font-semibold text-text-primary">{guide.strengthName}</h3>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-5 h-5 text-text-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* 这意味着什么 */}
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-2">这意味着</h4>
                <p className="text-text-secondary leading-relaxed">{guide.whatItMeans}</p>
              </div>

              {/* 最佳发挥场景 */}
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-2">最佳发挥场景</h4>
                <ul className="space-y-1">
                  {guide.bestScenarios.map((scenario, idx) => (
                    <li key={idx} className="text-text-secondary text-sm flex items-start gap-2">
                      <span className="text-brand mt-1">•</span>
                      {scenario}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 日常应用 */}
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-3">日常应用</h4>
                <div className="space-y-3">
                  <div className="bg-bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">🌅 早晨启动</p>
                    <p className="text-text-secondary text-sm">{guide.dailyPractice.morning}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">💼 工作中</p>
                    <p className="text-text-secondary text-sm">{guide.dailyPractice.working}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">🌙 晚间恢复</p>
                    <p className="text-text-secondary text-sm">{guide.dailyPractice.evening}</p>
                  </div>
                </div>
              </div>

              {/* 能量管理 */}
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-3">能量管理</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">⚡ 充能时刻</p>
                    <p className="text-text-secondary text-sm">{guide.energyTips.chargeWhen}</p>
                  </div>
                  <div className="bg-status-error/10 rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">🔋 需要休息</p>
                    <p className="text-text-secondary text-sm">{guide.energyTips.restWhen}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 优势组合建议组件
function ComboGuideSection({ comboGuide }: { comboGuide: StrengthGuideResult['comboGuide'] }) {
  const [activeTab, setActiveTab] = useState<'synergy' | 'tension'>('synergy');
  const hasSynergy = comboGuide.synergyPairs.length > 0;
  const hasTension = comboGuide.tensionPairs.length > 0;

  if (!hasSynergy && !hasTension) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border-light p-6"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4 font-serif">优势组合指南</h3>

      {/* 标签切换 */}
      {(hasSynergy && hasTension) && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('synergy')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'synergy'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            协同组合
          </button>
          <button
            onClick={() => setActiveTab('tension')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'tension'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            需要平衡
          </button>
        </div>
      )}

      {/* 协同组合 */}
      {(activeTab === 'synergy' || !hasTension) && hasSynergy && (
        <div className="space-y-3">
          {comboGuide.synergyPairs.map((pair, index) => (
            <div key={index} className="bg-accent/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-sm font-medium">
                  {pair.strengths[0]}
                </span>
                <span className="text-text-muted">+</span>
                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-sm font-medium">
                  {pair.strengths[1]}
                </span>
              </div>
              <p className="text-text-secondary text-sm">{pair.howToUse}</p>
            </div>
          ))}
        </div>
      )}

      {/* 需要平衡的组合 */}
      {(activeTab === 'tension' || !hasSynergy) && hasTension && (
        <div className="space-y-3">
          {comboGuide.tensionPairs.map((pair, index) => (
            <div key={index} className="bg-status-warning/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-status-warning/20 text-status-warning rounded text-sm font-medium">
                  {pair.strengths[0]}
                </span>
                <span className="text-text-muted">↔️</span>
                <span className="px-2 py-1 bg-status-warning/20 text-status-warning rounded text-sm font-medium">
                  {pair.strengths[1]}
                </span>
              </div>
              <p className="text-text-secondary text-sm">{pair.howToBalance}</p>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

// 本周行动建议组件
function WeeklyActionsSection({ weeklyActions }: { weeklyActions: StrengthGuideResult['weeklyActions'] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border-light p-6"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4 font-serif">本周行动建议</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {weeklyActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-brand/5 to-transparent rounded-lg p-4 border border-brand/10"
          >
            <p className="text-xs font-medium text-brand mb-2">{action.day}</p>
            <p className="text-text-secondary text-sm leading-relaxed">{action.action}</p>
            <p className="text-xs text-text-muted mt-2">💡 {action.strengthUsed}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// 主组件
export default function GuideResultPage({ guideData, strengths, onRegenerate, onBack }: GuideResultPageProps) {
  const [mounted, setMounted] = useState(false);
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
        filename: `strength_guide_${Date.now()}`,
        format: 'png',
        scale: 2,
      });

      setToast({ message: '已保存到本地', type: 'success' });
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

          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 font-serif">
              优势发挥指南
            </h1>
            <p className="text-text-secondary text-sm">基于你的 TOP5 优势生成</p>
          </motion.div>

          {/* 内容区域 - 添加 ref 用于导出 */}
          <div ref={contentRef} className="space-y-6">
            <PersonalLabelSection data={guideData.personalLabel} />
            <OneLinerSection oneLiner={guideData.oneLiner} />

            {/* 优势指南卡片列表 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary font-serif">单个优势指南</h3>
              {guideData.strengthGuides.map((guide, index) => (
                <StrengthGuideCard key={guide.strengthId} guide={guide} index={index} />
              ))}
            </div>

            <ComboGuideSection comboGuide={guideData.comboGuide} />
            <WeeklyActionsSection weeklyActions={guideData.weeklyActions} />
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
              {isSaving ? '保存中...' : '保存指南'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
