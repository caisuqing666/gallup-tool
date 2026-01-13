'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultData } from '@/lib/types';
import Toast, { type ToastType } from './Toast';
import { ScenarioId } from '@/lib/scenarios';
import HighlightCard from './HighlightCard';
import DiagnosisSection from './DiagnosisSection';
import BlindspotSection from './BlindspotSection';
import ActionSection from './ActionSection';
import AdvantageTipsSection from './AdvantageTipsSection';
import ResultFooter from './ResultFooter';
import { useProgressiveReveal } from '@/app/hooks/useProgressiveReveal';
import { exportToImage, exportToPDF } from '@/lib/export';

interface ResultPageProps {
  data: ResultData;
  scenario?: ScenarioId;
  isMockResult?: boolean;
  onSave?: (data: ResultData) => void;
  onRegenerate?: () => void;
  onBack?: () => void;
}

export default function ResultPage({ data, scenario, isMockResult = false, onSave, onRegenerate, onBack }: ResultPageProps) {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [forceShowAll, setForceShowAll] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 使用渐进式显示 Hook（4 个模块）
  const [visibleStep, markAsVisible, resetReveal] = useProgressiveReveal(4, {
    baseDelay: 400,
    stepDelay: 400,
    autoPlay: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 重置渐进式显示
  useEffect(() => {
    resetReveal();
    setForceShowAll(false);
  }, [data.highlight, resetReveal]);

  // 保存为图片
  const handleSaveClick = async () => {
    if (isSaving || !containerRef.current) return;

    setIsSaving(true);
    try {
      // 生成图片前，强制显示所有模块（确保图片包含完整内容）
      setForceShowAll(true);
      
      // 等待一小段时间，确保 DOM 更新完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await exportToImage(containerRef.current, {
        filename: `gallup_result_${Date.now()}`,
        format: 'png',
        scale: 2,
      });

      setToast({ message: '已保存到本地', type: 'success' });
      if (onSave) onSave(data);
    } catch (e) {
      setToast({ message: '保存失败', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // 导出为 PDF
  const handleExportPDF = async () => {
    if (isSaving || !containerRef.current) return;

    setIsSaving(true);
    try {
      setForceShowAll(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await exportToPDF(containerRef.current, {
        filename: `gallup_result_${Date.now()}.pdf`,
        scale: 2,
      });

      setToast({ message: 'PDF 导出成功', type: 'success' });
    } catch (e) {
      setToast({ message: 'PDF 导出失败', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // 是否显示各个模块（渐进式显示 或 强制显示全部）
  const showDiagnosis = forceShowAll || visibleStep >= 1;
  const showBlindspot = forceShowAll || visibleStep >= 2;
  const showActions = forceShowAll || visibleStep >= 3;
  const showTips = forceShowAll || visibleStep >= 4;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
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

      <div 
        className="min-h-screen bg-bg-primary px-4 sm:px-6 py-8 sm:py-12 transition-all duration-500"
        ref={containerRef}
      >
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
          <HighlightCard highlight={data.highlight} />

          {/* 模块一：系统诊断 */}
          <AnimatePresence>
            {showDiagnosis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <DiagnosisSection data={data} scenario={scenario} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 模块二：盲区提醒 */}
          <AnimatePresence>
            {showBlindspot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <BlindspotSection data={data} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 模块三：一键止乱 */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ActionSection data={data} scenario={scenario} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 模块四：现在的用力方式指令 */}
          <AnimatePresence>
            {showTips && data.advantageTips && data.advantageTips.instruction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AdvantageTipsSection advantageTips={data.advantageTips} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 底部按钮 */}
          <ResultFooter
            data={data}
            isSaving={isSaving}
            onSave={onSave}
            onRegenerate={onRegenerate}
            onHandleSaveClick={handleSaveClick}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>
    </>
  );
}
