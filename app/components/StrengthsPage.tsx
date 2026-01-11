'use client';

import { useState, useMemo } from 'react';
import { ALL_STRENGTHS, DOMAIN_COLORS, DOMAIN_NAMES, StrengthId, StrengthDomain } from '@/lib/gallup-strengths';

interface StrengthsPageProps {
  selectedStrengths: StrengthId[];
  onSelectStrength: (strengthId: StrengthId) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function StrengthsPage({
  selectedStrengths,
  onSelectStrength,
  onMoveUp,
  onMoveDown,
  onNext,
  onBack,
}: StrengthsPageProps) {
  const [activeTab, setActiveTab] = useState<StrengthDomain>('executing');

  const canProceed = selectedStrengths.length >= 3 && selectedStrengths.length <= 5;
  const selectedCount = selectedStrengths.length;

  // 按领域分组
  const strengthsByDomain = useMemo(() => ({
    executing: ALL_STRENGTHS.filter(s => s.domain === 'executing'),
    influencing: ALL_STRENGTHS.filter(s => s.domain === 'influencing'),
    relationship: ALL_STRENGTHS.filter(s => s.domain === 'relationship'),
    strategic: ALL_STRENGTHS.filter(s => s.domain === 'strategic'),
  }), []);

  const domains: StrengthDomain[] = ['executing', 'influencing', 'relationship', 'strategic'];

  const getRank = (strengthId: StrengthId) => {
    const index = selectedStrengths.indexOf(strengthId);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="page-container">
      <div className="page-content-wide">
        {/* 返回按钮 */}
        {onBack && (
          <button
            onClick={onBack}
            className="back-button mb-10"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
        )}

        {/* 步骤指示器 */}
        <div className="step-indicator mb-12">
          <div className="step-dot-completed" />
          <div className="step-dot-active rounded-full" />
          <div className="step-dot-inactive" />
          <span className="text-sm text-text-muted ml-3">步骤 2 / 3</span>
        </div>

        {/* 标题区 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
            选择你的 <span className="text-gradient">Top 5</span> 优势
          </h1>
          <p className="text-lg text-text-tertiary mb-6">
            按报告顺序选择你最突出的 3-5 项优势
          </p>

          {/* 选择计数器 */}
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${canProceed
              ? 'bg-status-success/10 text-status-success border border-status-success/20'
              : 'bg-bg-secondary text-text-tertiary border border-border'
            }
          `}>
            <span>已选择</span>
            <span className="font-bold">{selectedCount}</span>
            <span>/</span>
            <span>5</span>
          </div>
        </div>

        {/* 领域标签页 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {domains.map((domain) => {
            const isActive = activeTab === domain;
            const color = DOMAIN_COLORS[domain];
            const selectedInDomain = strengthsByDomain[domain].filter(
              s => selectedStrengths.includes(s.id)
            ).length;

            return (
              <button
                key={domain}
                onClick={() => setActiveTab(domain)}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive
                    ? 'text-white shadow-card'
                    : 'bg-bg-card text-text-secondary border border-border hover:border-border-dark'
                  }
                `}
                style={{
                  backgroundColor: isActive ? color : undefined,
                }}
              >
                {DOMAIN_NAMES[domain]}
                {selectedInDomain > 0 && (
                  <span className={`
                    ml-2 px-1.5 py-0.5 text-xs rounded-full
                    ${isActive ? 'bg-white/20' : 'bg-bg-tertiary'}
                  `}>
                    {selectedInDomain}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 优势选择区 */}
        <div className="bg-bg-card rounded-2xl border border-border-light p-6 md:p-8 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {strengthsByDomain[activeTab].map((strength) => {
              const isSelected = selectedStrengths.includes(strength.id);
              const rank = getRank(strength.id);
              const isDisabled = !isSelected && selectedStrengths.length >= 5;
              const color = DOMAIN_COLORS[strength.domain];

              return (
                <button
                  key={strength.id}
                  onClick={() => !isDisabled && onSelectStrength(strength.id)}
                  disabled={isDisabled}
                  className={`
                    relative px-5 py-3 rounded-xl text-base font-medium transition-all duration-300
                    ${isSelected
                      ? 'text-white shadow-card'
                      : isDisabled
                        ? 'bg-bg-secondary text-text-muted cursor-not-allowed opacity-50'
                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? color : undefined,
                  }}
                >
                  {rank && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-text-primary text-white text-xs font-bold flex items-center justify-center shadow-soft">
                      {rank}
                    </span>
                  )}
                  {strength.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 已选优势列表 */}
        {selectedStrengths.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
              已选优势排序
            </h3>
            <div className="space-y-2 max-w-2xl mx-auto">
              {selectedStrengths.map((strengthId, index) => {
                const strength = ALL_STRENGTHS.find(s => s.id === strengthId);
                if (!strength) return null;
                const color = DOMAIN_COLORS[strength.domain];
                const canMoveUp = index > 0 && onMoveUp;
                const canMoveDown = index < selectedStrengths.length - 1 && onMoveDown;

                return (
                  <div
                    key={strengthId}
                    className="flex items-center gap-4 p-4 bg-bg-card rounded-xl border border-border-light"
                  >
                    {/* 排名标识 */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </div>

                    {/* 优势名称 */}
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-text-primary font-medium">{strength.name}</span>
                      <span className="text-xs text-text-muted px-2 py-1 rounded-full bg-bg-secondary">
                        {DOMAIN_NAMES[strength.domain]}
                      </span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1">
                      {canMoveUp && (
                        <button
                          onClick={() => onMoveUp(index)}
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                          title="上移"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}
                      {canMoveDown && (
                        <button
                          onClick={() => onMoveDown(index)}
                          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                          title="下移"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStrength(strengthId)}
                        className="p-2 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors"
                        title="移除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 完成提示 */}
        {selectedStrengths.length === 5 && (
          <p className="text-center text-status-success font-medium mb-6">
            已捕捉到你的核心优势组合
          </p>
        )}

        {/* 底部操作区 */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="btn-primary text-lg px-12"
          >
            下一步：描述困惑
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
