'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ResultData } from '@/lib/types';
import { useTypewriter } from '@/app/hooks/useTypewriter';
import html2canvas from 'html2canvas';
import Toast, { type ToastType } from './Toast';
import { getScenarioConclusion } from '@/lib/scenario-conclusions';
import { ScenarioId } from '@/lib/scenarios';

interface ResultPageProps {
  data: ResultData;
  scenario?: ScenarioId;
  isMockResult?: boolean;
  onSave?: (data: ResultData) => void;
  onRegenerate?: () => void;
  onBack?: () => void;
}

// 将优势名称映射为行为描述（不显示优势名称）
function getBehaviorDescription(strength: string, isReduce: boolean): string {
  // 根据优势类型和场景返回对应的行为描述
  // 左栏（调低）：这段时间，先别这么用力
  if (isReduce) {
    const reduceBehaviors: Record<string, string> = {
      '责任': '把"万一出错"放在第一位',
      '搜集': '等所有信息都齐了再做决定',
      '分析': '反复想清楚每一种可能',
      '专注': '同时处理所有重要的事',
      '战略': '把所有可能性都考虑清楚',
      '沟通': '把话说得周全、体谅、不给人压力',
    };
    return reduceBehaviors[strength] || '继续用现在的方式用力';
  }
  
  // 右栏（调高）：现在更适合这样做
  const increaseBehaviors: Record<string, string> = {
    '责任': '允许自己在过程中再修正',
    '搜集': '先选一个方向站过去',
    '分析': '用"能不能推进"替代"对不对"',
    '专注': '只处理已经在手里的事',
    '战略': '先选一个方向站过去',
    '沟通': '用"能不能推进"替代"对不对"',
  };
  return increaseBehaviors[strength] || '先选一个方向站过去';
}

// 获取行为描述的结果说明
function getBehaviorResult(strength: string, isReduce: boolean): string {
  if (isReduce) {
    return '事情没更稳，你却越来越不敢选。';
  }
  return '事情会开始动，你也会慢慢松下来。';
}

// 系统诊断结论枚举（固定分类，增强权威感）
type DiagnosisType = '决策空转' | '用力反噬' | '优势错位' | '执行断裂';

// 根据场景映射到系统诊断结论
function getDiagnosisLabel(scenario?: ScenarioId): DiagnosisType {
  const diagnosisMap: Record<ScenarioId, DiagnosisType> = {
    'work-decision': '决策空转',
    'career-transition': '优势错位',
    'efficiency': '用力反噬',
    'communication': '执行断裂',
  };
  return scenario ? diagnosisMap[scenario] : '决策空转';
}

// 获取效能折损率（状态提示，不用精确数字）
function getEfficiencyStatus(scenario?: ScenarioId): { label: string; percentage: number } {
  const statusMap: Record<ScenarioId, { label: string; percentage: number }> = {
    'work-decision': { label: '推进效能偏低', percentage: 35 },
    'career-transition': { label: '选择效能不足', percentage: 40 },
    'efficiency': { label: '执行效能偏低', percentage: 30 },
    'communication': { label: '沟通效能不足', percentage: 35 },
  };
  return scenario ? statusMap[scenario] : { label: '推进效能偏低', percentage: 35 };
}

// 根据场景生成与上方箭头块呼应的按钮文案
function getStopButtonText(scenario?: ScenarioId): string {
  const buttonTextMap: Record<ScenarioId, string> = {
    'work-decision': '不再分析，选一个推进',
    'career-transition': '站到自己这边，选一个走',
    'efficiency': '不再硬撑，选一个方式',
    'communication': '不再解释，选一个边界',
  };
  return scenario ? buttonTextMap[scenario] : '不再分析，选一个推进';
}

export default function ResultPage({ data, scenario, isMockResult = false, onSave, onRegenerate, onBack }: ResultPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取场景对应的三段式结论
  const scenarioConclusion = scenario ? getScenarioConclusion(scenario) : null;

  // 解析高光词条：支持 "标题|辅助说明" 格式
  const highlightParts = data.highlight.split('|');
  const highlightTitle = highlightParts[0] || data.highlight;
  const highlightSubtitle = highlightParts[1] || '';

  // 打字机效果（只对标题生效）
  const { displayedText: highlightTitleText, isTyping: isTypingHighlight } = useTypewriter(
    highlightTitle,
    { speed: 30, delay: 0, resetOnChange: true, interruptible: true }
  );

  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showBlindspot, setShowBlindspot] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isStopButtonExpanded, setIsStopButtonExpanded] = useState(false);
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
    if (!isTypingHighlight && highlightTitleText === highlightTitle && highlightTitle.length > 0) {
      const timers = [
        setTimeout(() => setShowDiagnosis(true), 400),
        setTimeout(() => setShowBlindspot(true), 800),
        setTimeout(() => setShowActions(true), 1200),
        setTimeout(() => setShowTips(true), 1600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isTypingHighlight, highlightTitleText, highlightTitle]);

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
        className={`min-h-screen bg-bg-primary px-4 sm:px-6 py-8 sm:py-12 transition-all duration-500 ${
          isStopButtonExpanded ? 'saturate-50' : ''
        }`}
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-brand-subtle border border-brand/20 rounded-2xl p-6 sm:p-8 md:p-10 mb-4">
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-dark leading-tight px-2">
                  {highlightTitleText}
                  {isTypingHighlight && <span className="typing-cursor" />}
                </h1>
                {highlightSubtitle && (
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed px-2">
                    {highlightSubtitle}
                  </p>
                )}
              </div>
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
              <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-domain-strategic/10 text-domain-strategic flex items-center justify-center text-sm font-bold">1</span>
                  <h2 className="text-lg font-semibold text-text-primary">系统诊断</h2>
                </div>

                {/* 三段式结论结构 */}
                {scenarioConclusion ? (
                  <div className="space-y-6 sm:space-y-8">
                    {/* 1. 核心判词（The Verdict）- 反白效果，占据约1/3面积，字号最大（H1），加粗 */}
                    <div className="bg-text-primary text-white rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] shadow-lg relative">
                      {/* 身份标签：系统判断 */}
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                        系统判断
                      </span>
                      
                      {/* 诊断结论标签 */}
                      <div className="mb-4 sm:mb-6 pt-6 sm:pt-0">
                        <span className="inline-block px-3 py-1.5 bg-white/20 border border-white/30 rounded-md text-xs sm:text-sm font-medium text-white/90 tracking-wide">
                          [ 诊断结论：{getDiagnosisLabel(scenario)} ]
                        </span>
                      </div>
                      
                      {/* 核心断言：一句话最终裁决 - 最突出 */}
                      <div className="flex items-center">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                          {scenarioConclusion.verdict}
                        </h3>
                      </div>
                    </div>

                    {/* 2. 困境还原（The Experience）- 衬线体，大行间距，更具读感 */}
                    <div className="font-serif text-text-secondary leading-[2.0] sm:leading-[2.1] text-base sm:text-lg md:text-xl whitespace-pre-line px-2 sm:px-4">
                      {scenarioConclusion.experience}
                    </div>

                    {/* 3. 指令出口（The Pivot）- 治疗方向，权重仅次于黑盒子 */}
                    <div className="bg-brand-subtle/40 border-l-[5px] border-brand rounded-xl p-6 sm:p-7 md:p-9 mt-6 sm:mt-8 transition-all duration-300 hover:bg-brand-subtle/50">
                      <div className="flex items-start gap-4 sm:gap-5">
                        {/* 实心箭头图标 */}
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand/20 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 sm:w-7 sm:h-7 text-brand"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                          </svg>
                        </div>
                        <div className="flex-1 space-y-3">
                          {/* 治疗指令文案 */}
                          <p className="text-text-primary font-semibold text-lg sm:text-xl md:text-2xl leading-relaxed">
                            {scenarioConclusion.pivot}
                          </p>
                          
                          {/* 效能折损率可视化（状态提示） */}
                          {(() => {
                            const efficiency = getEfficiencyStatus(scenario);
                            const blocks = 5;
                            const filledBlocks = Math.round((efficiency.percentage / 100) * blocks);
                            
                            return (
                              <div className="pt-2 border-t border-border-light">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-text-secondary font-medium">
                                    当前状态：{efficiency.label}
                                  </span>
                                  <span className="text-xs text-text-muted">
                                    约 {efficiency.percentage - 10}–{efficiency.percentage + 10}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: blocks }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-3 flex-1 rounded ${
                                        i < filledBlocks
                                          ? 'bg-status-warning/60'
                                          : 'bg-border'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-text-muted mt-2 italic">
                                  当前状态下，你的有效推进能力不足一半。
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 如果没有场景结论，显示原来的 judgment
                  <p className="text-text-secondary leading-relaxed">{data.judgment}</p>
                )}

                {/* 系统诊断补充说明（有内耗 / Basement 时统一用人话总结） */}
                {(data.strengthConflicts || data.strengthBasement) && (
                  <div className="mt-6 pt-6 border-t border-border-light space-y-2">
                    <p className="text-sm text-text-secondary">
                      你已经想得足够多了，但并没有更接近决定。
                    </p>
                    <p className="text-sm text-text-secondary">
                      继续靠分析，只会让你更犹豫，而不是更笃定。
                    </p>
                    <p className="text-sm text-text-secondary">
                      你现在最用力的能力，暂时没有在帮你，反而在消耗你。
                    </p>
                    <p className="text-sm text-text-secondary">
                      先收一收，反而会让事情更容易推进。
                    </p>
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
              <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-status-warning/10 text-status-warning flex items-center justify-center text-sm font-bold">2</span>
                  <h2 className="text-lg font-semibold text-text-primary">盲区提醒</h2>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-1 rounded-full">反直觉视角</span>
                </div>
                <p className="text-text-secondary leading-relaxed">{data.blindspot}</p>
              </div>
            </motion.section>
          )}

          {/* 模块三：一键止乱 */}
          {showActions && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
                {/* 主按钮：停止乱想，直接选一个（开关模式） */}
                <motion.button
                  onClick={() => setIsStopButtonExpanded(!isStopButtonExpanded)}
                  className={`w-full mb-4 transition-all duration-300 ${
                    isStopButtonExpanded
                      ? 'bg-gray-300/30 border-2 border-gray-400 cursor-default'
                      : 'bg-brand/10 border-2 border-brand hover:bg-brand/20'
                  } rounded-xl p-4 sm:p-6 flex items-center justify-between group`}
                  whileHover={isStopButtonExpanded ? {} : { scale: 1.01 }}
                  whileTap={isStopButtonExpanded ? {} : { scale: 0.99 }}
                  disabled={isStopButtonExpanded}
                >
                  <div className="flex items-center gap-3">
                    {/* 开关图标 */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isStopButtonExpanded
                          ? 'bg-gray-500 text-white'
                          : 'bg-brand text-white'
                      }`}
                    >
                      {isStopButtonExpanded ? (
                        // 已激活：对勾图标 ✓
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        // 未激活：播放图标 ▶
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-lg sm:text-xl font-bold transition-all duration-300 ${
                        isStopButtonExpanded ? 'text-gray-600' : 'text-brand'
                      }`}
                    >
                      {isStopButtonExpanded ? '已止乱' : getStopButtonText(scenario)}
                    </span>
                  </div>
                  {!isStopButtonExpanded && (
                    <svg
                      className="w-5 h-5 text-brand transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </motion.button>

                {/* 展开内容：固定三条清理指令 */}
                {isStopButtonExpanded && (
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

                      {data.actions.map((action, index) => {
                        // 按换行符分割，第一行是标题
                        const lines = action.split('\n');
                        const actionTitle = lines[0] || '';
                        const actionContent = lines.slice(1).join('\n');

                        return (
                          <motion.div
                            key={index}
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
                      })}

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
                )}
              </div>
            </motion.section>
          )}

          {/* 模块四：现在的用力方式建议 */}
          {showTips && data.advantageTips && data.advantageTips.instruction && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-domain-relationship/10 text-domain-relationship flex items-center justify-center text-sm font-bold">4</span>
                    <h2 className="text-lg font-semibold text-text-primary">现在的用力方式建议</h2>
                  </div>
                  <p className="text-sm text-text-muted ml-11">不是你能力不够，是顺序用反了。</p>
                </div>

                {/* 核心结论 */}
                <div className="bg-brand-subtle/30 border border-brand/10 rounded-xl p-4 sm:p-5 mb-6">
                  <p className="text-text-primary leading-relaxed font-medium">
                    你现在需要的，不是多做一点，而是把力气用对。
                    <br />
                    有些能力继续放大，只会让你更累；
                    <br />
                    有些能力先顶上，反而能帮你稳住局面。
                  </p>
                </div>

                {/* 两栏结构 */}
                <div className="grid md:grid-cols-2 gap-4">
                  {data.advantageTips.reduce && data.advantageTips.reduce.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-status-error flex items-center gap-2 mb-4">
                        <span className="text-status-error">❌ 这段时间，先别这么用力</span>
                      </h3>
                      {data.advantageTips.reduce.map((item, index) => (
                        <div key={index} className="bg-status-error/5 border border-status-error/20 rounded-xl p-4">
                          <p className="text-text-primary font-medium mb-3 text-sm">
                            {getBehaviorDescription(item.strength, true)}
                          </p>
                          <div className="h-2 bg-status-error/10 rounded-full overflow-hidden mb-3">
                            <motion.div
                              initial={{ width: '100%' }}
                              animate={{ width: `${100 - item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-status-error/60 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-text-muted italic">
                            继续这样做的结果：
                            <br />
                            {getBehaviorResult(item.strength, true)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.advantageTips.increase && data.advantageTips.increase.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-status-success flex items-center gap-2 mb-4">
                        <span className="text-status-success">✅ 现在更适合这样做</span>
                      </h3>
                      {data.advantageTips.increase.map((item, index) => (
                        <div key={index} className="bg-status-success/5 border border-status-success/20 rounded-xl p-4">
                          <p className="text-text-primary font-medium mb-3 text-sm">
                            {getBehaviorDescription(item.strength, false)}
                          </p>
                          <div className="h-2 bg-status-success/10 rounded-full overflow-hidden mb-3">
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-status-success/60 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-text-muted italic">
                            这样做的结果：
                            <br />
                            {getBehaviorResult(item.strength, false)}
                          </p>
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
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8 sm:mt-12 px-4"
          >
            {onSave && (
              <motion.button
                onClick={handleSaveClick}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full sm:w-auto min-h-[48px] touch-manipulation"
              >
                {isSaving ? '保存中...' : '保存这份判断'}
              </motion.button>
            )}
            {onRegenerate && (
              <motion.button
                onClick={onRegenerate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full sm:w-auto min-h-[48px] touch-manipulation opacity-85 hover:opacity-95"
              >
                看看别的卡点
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
