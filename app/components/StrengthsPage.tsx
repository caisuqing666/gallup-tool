'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_STRENGTHS, DOMAIN_COLORS } from '@/lib/gallup-strengths';

interface StrengthsPageProps {
  selectedStrengths: string[];
  onSelectStrength: (strengthId: string) => void;
  onNext: () => void;
}

export default function StrengthsPage({
  selectedStrengths,
  onSelectStrength,
  onNext,
}: StrengthsPageProps) {
  const [hoveredStrength, setHoveredStrength] = useState<string | null>(null);

  const canProceed = selectedStrengths.length >= 3 && selectedStrengths.length <= 5;
  const selectedCount = selectedStrengths.length;

  // 按领域分组
  const strengthsByDomain = {
    executing: ALL_STRENGTHS.filter(s => s.domain === 'executing'),
    influencing: ALL_STRENGTHS.filter(s => s.domain === 'influencing'),
    relationship: ALL_STRENGTHS.filter(s => s.domain === 'relationship'),
    strategic: ALL_STRENGTHS.filter(s => s.domain === 'strategic'),
  };

  const domainNames: Record<string, string> = {
    executing: '执行力 EXECUTING',
    influencing: '影响力 INFLUENCING',
    relationship: '关系建立 RELATIONSHIP',
    strategic: '战略思维 STRATEGIC',
  };

  const getRank = (strengthId: string) => {
    const index = selectedStrengths.indexOf(strengthId);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white px-4 py-16 relative overflow-hidden">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* 步骤指示器 */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <div className="h-1 w-12 bg-cyber-emerald rounded-full"></div>
          <div className="h-1 w-12 bg-white/10 rounded-full"></div>
          <span className="cyber-label ml-2">Phase 02: Strength Coding</span>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            告诉我你的 <span className="text-cyber-emerald">Top 5</span> 项优势
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className={`px-4 py-1 rounded-full text-sm font-mono transition-all duration-300 ${canProceed ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/30' : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
              STRENGTHS_SELECTED: {selectedCount}/5
            </div>
          </div>
        </div>

        {/* 优势标签云 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {Object.entries(strengthsByDomain).map(([domain, strengths]) => (
            <div key={domain} className="glass-card p-6 border-white/5 bg-white/[0.02]">
              <h3 className="cyber-label mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] }}></span>
                {domainNames[domain]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength) => {
                  const isSelected = selectedStrengths.includes(strength.id);
                  const rank = getRank(strength.id);
                  const isDisabled = !isSelected && selectedStrengths.length >= 5;
                  const color = DOMAIN_COLORS[strength.domain];

                  return (
                    <motion.button
                      key={strength.id}
                      onClick={() => !isDisabled && onSelectStrength(strength.id)}
                      onMouseEnter={() => setHoveredStrength(strength.id)}
                      onMouseLeave={() => setHoveredStrength(null)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      className={`
                        relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border
                        ${isSelected
                          ? 'text-white border-transparent'
                          : isDisabled
                            ? 'bg-transparent text-gray-700 border-white/5 opacity-30 cursor-not-allowed'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                        }
                      `}
                      style={{
                        backgroundColor: isSelected ? color : undefined,
                        boxShadow: isSelected ? `0 0 15px ${color}40` : undefined,
                      }}
                    >
                      {rank && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-cyber-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                          {rank}
                        </span>
                      )}
                      {strength.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 核心优势捕获提示 */}
        <AnimatePresence>
          {selectedStrengths.length === 5 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-cyber-emerald mb-4"
            >
              已捕捉到你的核心优势组合
            </motion.div>
          )}
        </AnimatePresence>
        {/* 指引说明 */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
            建议按报告顺序选择前 5 项。这 5 种能量的相互激荡，构成了你解决问题的独特底层操作系统。
          </p>
        </div>

        {/* 底部交互区 */}
        <div className="sticky bottom-8 flex justify-center">
          <motion.button
            onClick={onNext}
            disabled={!canProceed}
            className="cyber-button text-lg px-16 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            下一步：输入当前困惑
          </motion.button>
        </div>
      </div>
    </div>
  );
}
