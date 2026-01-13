'use client';

import { motion } from 'framer-motion';
import { ResultData } from '@/lib/types';
import { getBehaviorDescription, getBehaviorResult } from './result-helpers';

interface AdvantageTipsSectionProps {
  advantageTips: ResultData['advantageTips'];
}

export default function AdvantageTipsSection({ advantageTips }: AdvantageTipsSectionProps) {
  if (!advantageTips || !advantageTips.instruction) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-bg-card rounded-2xl border border-border-light p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-full bg-domain-relationship/10 text-domain-relationship flex items-center justify-center text-sm font-bold">4</span>
            <h2 className="text-lg font-semibold text-text-primary">现在的用力方式指令</h2>
          </div>
          <p className="text-sm text-text-muted ml-11">不是你能力不够，是顺序用反了。</p>
        </div>

        {/* 核心结论 */}
        <CoreConclusion />

        {/* 两栏结构 */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* 左栏：调低 */}
          {advantageTips.reduce && advantageTips.reduce.length > 0 && (
            <ReduceColumn items={advantageTips.reduce} />
          )}

          {/* 右栏：调高 */}
          {advantageTips.increase && advantageTips.increase.length > 0 && (
            <IncreaseColumn items={advantageTips.increase} />
          )}
        </div>
      </div>
    </motion.section>
  );
}

// 核心结论
function CoreConclusion() {
  return (
    <div className="bg-brand-subtle/30 border border-brand/10 rounded-xl p-4 sm:p-5 mb-6">
      <p className="text-text-primary leading-relaxed font-medium">
        你现在需要的，不是多做一点，而是把力气用对。
        <br />
        有些能力继续放大，只会让你更累；
        <br />
        有些能力先顶上，反而能帮你稳住局面。
      </p>
    </div>
  );
}

// 左栏：调低
function ReduceColumn({ items }: { items: Array<{ strength: string; percentage: number; reason: string }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-status-error flex items-center gap-2 mb-4">
        <span className="text-status-error">❌ 这段时间，先别这么用力</span>
      </h3>
      {items.map((item, index) => (
        <BehaviorCard
          key={index}
          item={item}
          isReduce={true}
        />
      ))}
    </div>
  );
}

// 右栏：调高
function IncreaseColumn({ items }: { items: Array<{ strength: string; percentage: number; reason: string }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-status-success flex items-center gap-2 mb-4">
        <span className="text-status-success">✅ 现在更适合这样做</span>
      </h3>
      {items.map((item, index) => (
        <BehaviorCard
          key={index}
          item={item}
          isReduce={false}
        />
      ))}
    </div>
  );
}

// 行为卡片（可复用）
function BehaviorCard({ item, isReduce }: { item: { strength: string; percentage: number; reason: string }; isReduce: boolean }) {
  const bgColor = isReduce ? 'bg-status-error/5' : 'bg-status-success/5';
  const borderColor = isReduce ? 'border-status-error/20' : 'border-status-success/20';
  const barBg = isReduce ? 'bg-status-error/10' : 'bg-status-success/10';
  const barColor = isReduce ? 'bg-status-error/60' : 'bg-status-success/60';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
      <p className="text-text-primary font-medium mb-3 text-sm">
        {getBehaviorDescription(item.strength, isReduce)}
      </p>
      <div className={`h-2 ${barBg} rounded-full overflow-hidden mb-3`}>
        <motion.div
          initial={{ width: isReduce ? '100%' : '0%' }}
          animate={{ width: `${isReduce ? 100 - item.percentage : item.percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>
      <p className="text-xs text-text-muted italic">
        {isReduce ? '继续这样做的结果：' : '这样做的结果：'}
        <br />
        {getBehaviorResult(item.strength, isReduce)}
      </p>
    </div>
  );
}
