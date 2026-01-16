// 职业匹配算法
// 基于用户的优势组合，计算与各职业的匹配度

import { StrengthId } from './gallup-strengths';
import { Career, CAREER_DATABASE } from './career-data';

// ============================================================
// 匹配结果类型
// ============================================================

/**
 * 职业匹配结果
 */
export interface CareerMatch {
  /** 职业信息 */
  career: Career;
  /** 匹配分数（0-100） */
  matchScore: number;
  /** 匹配原因说明 */
  matchReason: string;
  /** 优势使用方式 */
  strengthUsage: Array<{
    strengthId: StrengthId;
    usage: string;
  }>;
  /** 需要注意的事项 */
  watchOut: string;
  /** 核心优势匹配度（哪些优势被有效使用） */
  matchedStrengths: StrengthId[];
  /** 未匹配的核心优势（哪些优势未被有效使用） */
  unmatchedStrengths: StrengthId[];
}

// ============================================================
// 匹配算法
// ============================================================

/**
 * 匹配配置
 */
interface MatchConfig {
  /** 核心优势权重 */
  coreWeight: number;
  /** 辅助优势权重 */
  secondaryWeight: number;
  /** 用户优势与职业优势的重叠度权重 */
  overlapWeight: number;
  /** 领域适配度权重 */
  domainFitWeight: number;
}

/**
 * 默认匹配配置
 */
const DEFAULT_CONFIG: MatchConfig = {
  coreWeight: 0.5,      // 50% 权重给核心优势匹配
  secondaryWeight: 0.2, // 20% 权重给辅助优势匹配
  overlapWeight: 0.2,   // 20% 权重给重叠度
  domainFitWeight: 0.1, // 10% 权重给领域适配
};

/**
 * 计算单个职业的匹配分数
 */
function calculateMatchScore(
  career: Career,
  userStrengths: StrengthId[],
  config: MatchConfig = DEFAULT_CONFIG
): number {
  let score = 0;

  // 1. 核心优势匹配
  const coreMatches = career.coreStrengths.filter((s) =>
    userStrengths.includes(s)
  ).length;
  const coreScore = (coreMatches / career.coreStrengths.length) * 100;
  score += coreScore * config.coreWeight;

  // 2. 辅助优势匹配（如果有）
  if (career.secondaryStrengths && career.secondaryStrengths.length > 0) {
    const secondaryMatches = career.secondaryStrengths.filter((s) =>
      userStrengths.includes(s)
    ).length;
    const secondaryScore =
      (secondaryMatches / career.secondaryStrengths.length) * 100;
    score += secondaryScore * config.secondaryWeight;
  }

  // 3. 优势重叠度（用户优势在职业中的使用程度）
  const usedStrengths = [
    ...career.coreStrengths,
    ...(career.secondaryStrengths || []),
  ];
  const userUsedStrengths = userStrengths.filter((s) =>
    usedStrengths.includes(s)
  ).length;
  const overlapScore = (userUsedStrengths / userStrengths.length) * 100;
  score += overlapScore * config.overlapWeight;

  // 4. 领域适配度（用户优势与职业分类的匹配）
  const domainScore = calculateDomainFit(career, userStrengths);
  score += domainScore * config.domainFitWeight;

  return Math.min(100, Math.round(score));
}

/**
 * 计算领域适配度
 */
function calculateDomainFit(career: Career, userStrengths: StrengthId[]): number {
  // 定义各职业分类的典型优势组合
  const domainProfiles: Record<
    string,
    { ideal: StrengthId[]; good: StrengthId[] }
  > = {
    technology: {
      ideal: ['analytical', 'learner', 'intellection', 'strategic'],
      good: ['focus', 'discipline', 'restorative', 'ideation'],
    },
    business: {
      ideal: ['woo', 'communication', 'competition', 'strategic'],
      good: ['activator', 'significance', 'responsibility', 'arranger'],
    },
    creative: {
      ideal: ['ideation', 'maximizer', 'communication', 'intellection'],
      good: ['input', 'learner', 'empathy', 'connectedness'],
    },
    service: {
      ideal: ['empathy', 'relator', 'harmony', 'individualization'],
      good: ['responsibility', 'developer', 'positivity', 'adaptability'],
    },
    education: {
      ideal: ['developer', 'empathy', 'individualization', 'communication'],
      good: ['learner', 'positivity', 'responsibility', 'connectedness'],
    },
    healthcare: {
      ideal: ['restorative', 'empathy', 'responsibility', 'deliberative'],
      good: ['harmony', 'relator', 'discipline', 'learner'],
    },
    leadership: {
      ideal: ['command', 'responsibility', 'strategic', 'activator'],
      good: ['developer', 'woo', 'communication', 'self-assurance'],
    },
    operations: {
      ideal: ['discipline', 'arranger', 'responsibility', 'focus'],
      good: ['harmony', 'consistency', 'deliberative', 'analytical'],
    },
  };

  const profile = domainProfiles[career.category];
  if (!profile) return 50;

  // 计算用户优势与领域理想优势的匹配度
  const idealMatches = profile.ideal.filter((s) =>
    userStrengths.includes(s)
  ).length;
  const goodMatches = profile.good.filter((s) => userStrengths.includes(s))
    .length;

  // 理想优势权重更高
  return (idealMatches * 25 + goodMatches * 12.5) / profile.ideal.length;
}

/**
 * 生成匹配原因说明
 */
function generateMatchReason(
  career: Career,
  userStrengths: StrengthId[],
  matchScore: number
): string {
  const matchedCore = career.coreStrengths.filter((s) =>
    userStrengths.includes(s)
  );

  if (matchScore >= 80) {
    return `这个职业与你的优势高度匹配。你的${matchedCore.join('、')}优势都能在这个职业中得到充分发挥。这是一个让你既能发挥天赋，又能获得成就感的理想选择。`;
  } else if (matchScore >= 60) {
    return `这个职业与你的优势有较好的匹配度。你的${matchedCore.join('、')}优势在这里可以发挥价值，可能需要在一些方面进行适应和学习。`;
  } else if (matchScore >= 40) {
    return `这个职业与你的优势有一定匹配度。虽然不是最理想的选择，但你的部分优势（如${matchedCore.join('、')}）仍然可以在这里发挥作用。`;
  } else {
    return `这个职业与你的优势匹配度一般。你可能需要在其他方面投入更多努力来弥补优势的不匹配，建议考虑其他更匹配的职业方向。`;
  }
}

/**
 * 生成优势使用方式说明
 */
function generateStrengthUsage(
  career: Career,
  userStrengths: StrengthId[]
): Array<{ strengthId: StrengthId; usage: string }> {
  return career.strengthUsage
    .filter((item) => userStrengths.includes(item.strengthId))
    .map((item) => ({
      strengthId: item.strengthId,
      usage: item.description,
    }));
}

/**
 * 找出用户哪些优势在这个职业中未被有效使用
 */
function findUnmatchedStrengths(
  career: Career,
  userStrengths: StrengthId[]
): StrengthId[] {
  const usedInCareer = new Set([
    ...career.coreStrengths,
    ...(career.secondaryStrengths || []),
  ]);

  return userStrengths.filter((s) => !usedInCareer.has(s));
}

/**
 * 匹配所有职业，返回按匹配分数排序的结果
 */
export function matchCareers(
  userStrengths: StrengthId[],
  options?: {
    limit?: number; // 最多返回多少个结果
    minScore?: number; // 最低匹配分数
    config?: MatchConfig; // 自定义匹配配置
  }
): CareerMatch[] {
  const limit = options?.limit || 10;
  const minScore = options?.minScore || 0;
  const config = options?.config || DEFAULT_CONFIG;

  // 计算所有职业的匹配分数
  const matches: CareerMatch[] = CAREER_DATABASE.map((career) => {
    const matchScore = calculateMatchScore(career, userStrengths, config);
    const matchReason = generateMatchReason(career, userStrengths, matchScore);
    const strengthUsage = generateStrengthUsage(career, userStrengths);
    const matchedStrengths = [
      ...career.coreStrengths,
      ...(career.secondaryStrengths || []),
    ].filter((s) => userStrengths.includes(s));
    const unmatchedStrengths = findUnmatchedStrengths(career, userStrengths);

    return {
      career,
      matchScore,
      matchReason,
      strengthUsage,
      watchOut: career.watchOut,
      matchedStrengths,
      unmatchedStrengths,
    };
  });

  // 过滤低分结果并排序
  return matches
    .filter((m) => m.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * 获取 TOP 匹配职业
 */
export function getTopCareerMatches(
  userStrengths: StrengthId[],
  topN: number = 3
): CareerMatch[] {
  return matchCareers(userStrengths, { limit: topN, minScore: 40 });
}

/**
 * 获取某个分类的最佳匹配职业
 */
export function getBestMatchInCategory(
  userStrengths: StrengthId[],
  category: Career['category']
): CareerMatch | null {
  const categoryCareers = CAREER_DATABASE.filter(
    (c) => c.category === category
  );

  if (categoryCareers.length === 0) return null;

  const matches = categoryCareers.map((career) => {
    const matchScore = calculateMatchScore(career, userStrengths);
    const matchReason = generateMatchReason(career, userStrengths, matchScore);
    const strengthUsage = generateStrengthUsage(career, userStrengths);
    const matchedStrengths = [
      ...career.coreStrengths,
      ...(career.secondaryStrengths || []),
    ].filter((s) => userStrengths.includes(s));
    const unmatchedStrengths = findUnmatchedStrengths(career, userStrengths);

    return {
      career,
      matchScore,
      matchReason,
      strengthUsage,
      watchOut: career.watchOut,
      matchedStrengths,
      unmatchedStrengths,
    };
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);
  return matches[0] || null;
}

/**
 * 获取所有分类的最佳匹配
 */
export function getBestMatchByCategory(
  userStrengths: StrengthId[]
): Record<string, CareerMatch | null> {
  const categories = [
    'technology',
    'business',
    'creative',
    'service',
    'education',
    'healthcare',
    'leadership',
    'operations',
  ] as const;

  const result: Record<string, CareerMatch | null> = {};

  for (const category of categories) {
    result[category] = getBestMatchInCategory(userStrengths, category);
  }

  return result;
}
