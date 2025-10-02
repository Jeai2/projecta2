// server/src/services/yongsin.service.ts
// 용신 분석 메인 서비스

import {
  YongsinResult,
  TierAnalysis,
  JEONWANG_CRITERIA,
  JOHU_CRITERIA,
} from "../data/yongsin.data";
import {
  CHEONGANHAPHWA,
  YUKHAPHWA,
  BANGHAPHWA,
  YUKCHUNG,
  YUKHYUNG,
  YUKPA,
  YUKAE,
} from "../data/relationship.data";
import { GAN_OHENG, JI_OHENG } from "../data/saju.data";
import type { SajuData, PillarData } from "../types/saju.d";

// =================================================================
// 유틸리티 함수들
// =================================================================

/**
 * 사주 데이터에서 오행 개수를 계산합니다
 */
function countOhaengInSaju(pillars: {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
  hour: { gan: string; ji: string };
}): { counts: Record<string, number>; total: number } {
  const counts: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  let total = 0;

  Object.values(pillars).forEach((pillar) => {
    const ganOhaeng = GAN_OHENG[pillar.gan];
    const jiOhaeng = JI_OHENG[pillar.ji];

    if (ganOhaeng) {
      counts[ganOhaeng]++;
      total++;
    }
    if (jiOhaeng) {
      counts[jiOhaeng]++;
      total++;
    }
  });

  return { counts, total };
}

// =================================================================
// 전왕용신 (Tier 1) 분석 함수들
// =================================================================

/**
 * 형충해파 체크 - 합이 가능한지 확인
 */
function canFormHap(
  gan1: string,
  gan2: string,
  ji1: string,
  ji2: string
): boolean {
  // 천간충, 지지충/형/파/해 체크
  const hasCheonganChung = false; // TODO: 천간충 체크 로직
  const hasJijiConflict =
    YUKCHUNG[ji1] === ji2 ||
    YUKHYUNG[ji1]?.includes(ji2) ||
    YUKPA[ji1] === ji2 ||
    YUKAE[ji1] === ji2;

  return !hasCheonganChung && !hasJijiConflict;
}

/**
 * 합화로 인한 추가 오행 카운트 계산
 */
function calculateHaphwaOhaengBonus(pillars: {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  hour: PillarData;
}): Record<string, number> {
  const bonus: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const pillarArray = [pillars.year, pillars.month, pillars.day, pillars.hour];

  // 천간합화 체크
  for (let i = 0; i < pillarArray.length; i++) {
    for (let j = i + 1; j < pillarArray.length; j++) {
      const pillar1 = pillarArray[i];
      const pillar2 = pillarArray[j];

      // 형충해파가 없을 때만 합화 가능
      if (canFormHap(pillar1.gan, pillar2.gan, pillar1.ji, pillar2.ji)) {
        const haphwaInfo = CHEONGANHAPHWA[pillar1.gan];
        if (haphwaInfo && haphwaInfo.partner === pillar2.gan) {
          bonus[haphwaInfo.result]++;
        }
      }
    }
  }

  // 지지합화 체크 (육합, 삼합, 방합)
  for (let i = 0; i < pillarArray.length; i++) {
    for (let j = i + 1; j < pillarArray.length; j++) {
      const ji1 = pillarArray[i].ji;
      const ji2 = pillarArray[j].ji;

      if (canFormHap("", "", ji1, ji2)) {
        // 육합화
        const yukhapInfo = YUKHAPHWA[ji1];
        if (yukhapInfo && yukhapInfo.partner === ji2) {
          bonus[yukhapInfo.result]++;
        }

        // 삼합화 (3개 조합이므로 별도 로직 필요)
        // TODO: 삼합화 로직 구현

        // 방합화
        const banghapInfo = BANGHAPHWA[ji1];
        if (banghapInfo && banghapInfo.partners.includes(ji2)) {
          bonus[banghapInfo.result]++;
        }
      }
    }
  }

  return bonus;
}

/**
 * 대운에서 오행 지원 체크
 */
function getDaewoonOhaengSupport(
  currentDaewoon: { ganji: string } | null,
  dominantOhaeng: string
): boolean {
  if (!currentDaewoon) return false;

  const daewoonGan = currentDaewoon.ganji[0];
  const daewoonJi = currentDaewoon.ganji[1];
  const daewoonGanOhaeng = GAN_OHENG[daewoonGan];
  const daewoonJiOhaeng = JI_OHENG[daewoonJi];

  return (
    daewoonGanOhaeng === dominantOhaeng || daewoonJiOhaeng === dominantOhaeng
  );
}

/**
 * 전왕용신 기본 조건 체크
 */
function checkJeonwangBasic(
  score: number,
  ohaengCount: ReturnType<typeof countOhaengInSaju>
): { isValid: boolean; dominantOhaeng: string | null } {
  const { BASIC } = JEONWANG_CRITERIA;

  // 점수 조건 체크
  const isExtremeScore =
    (score >= BASIC.MIN_SCORE_RANGE[0] && score <= BASIC.MIN_SCORE_RANGE[1]) ||
    (score >= BASIC.MAX_SCORE_RANGE[0] && score <= BASIC.MAX_SCORE_RANGE[1]);

  if (!isExtremeScore) return { isValid: false, dominantOhaeng: null };

  // 순수성 체크
  const maxCount = Math.max(...Object.values(ohaengCount.counts));
  const purity = maxCount / ohaengCount.total;
  const isPure =
    purity >= BASIC.PURITY_THRESHOLD && maxCount >= BASIC.MIN_DOMINANT_COUNT;

  if (!isPure) return { isValid: false, dominantOhaeng: null };

  // 지배적 오행 찾기
  const dominantOhaeng =
    Object.entries(ohaengCount.counts).find(
      ([, count]) => count === maxCount
    )?.[0] || null;

  return { isValid: true, dominantOhaeng };
}

/**
 * 전왕용신 변수 조건 1 체크
 */
function checkJeonwangVariable1(
  score: number,
  ohaengCount: ReturnType<typeof countOhaengInSaju>,
  haphwaBonus: Record<string, number>
): { isValid: boolean; dominantOhaeng: string | null } {
  const { VARIABLE1 } = JEONWANG_CRITERIA;

  // 점수 조건 체크
  const isValidScore =
    (score >= VARIABLE1.MIN_SCORE_RANGE[0] &&
      score <= VARIABLE1.MIN_SCORE_RANGE[1]) ||
    (score >= VARIABLE1.MAX_SCORE_RANGE[0] &&
      score <= VARIABLE1.MAX_SCORE_RANGE[1]);

  if (!isValidScore) return { isValid: false, dominantOhaeng: null };

  // 합화 보너스 적용한 카운트 계산
  const adjustedCounts = { ...ohaengCount.counts };
  Object.entries(haphwaBonus).forEach(([ohaeng, bonus]) => {
    adjustedCounts[ohaeng] = (adjustedCounts[ohaeng] || 0) + bonus;
  });

  const adjustedTotal = Object.values(adjustedCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const maxCount = Math.max(...Object.values(adjustedCounts));
  const purity = maxCount / adjustedTotal;

  const isPure =
    purity >= VARIABLE1.PURITY_THRESHOLD &&
    maxCount >= VARIABLE1.MIN_DOMINANT_COUNT;
  const hasHaphwa = Object.values(haphwaBonus).some((bonus) => bonus > 0);

  if (!isPure || !hasHaphwa) return { isValid: false, dominantOhaeng: null };

  // 지배적 오행 찾기
  const dominantOhaeng =
    Object.entries(adjustedCounts).find(
      ([, count]) => count === maxCount
    )?.[0] || null;

  return { isValid: true, dominantOhaeng };
}

/**
 * 전왕용신 변수 조건 2 체크
 */
function checkJeonwangVariable2(
  score: number,
  ohaengCount: ReturnType<typeof countOhaengInSaju>,
  haphwaBonus: Record<string, number>,
  currentDaewoon: { ganji: string } | null
): { isValid: boolean; dominantOhaeng: string | null } {
  const { VARIABLE2 } = JEONWANG_CRITERIA;

  // 점수 조건 체크
  const isValidScore =
    (score >= VARIABLE2.MIN_SCORE_RANGE[0] &&
      score <= VARIABLE2.MIN_SCORE_RANGE[1]) ||
    (score >= VARIABLE2.MAX_SCORE_RANGE[0] &&
      score <= VARIABLE2.MAX_SCORE_RANGE[1]);

  if (!isValidScore) return { isValid: false, dominantOhaeng: null };

  // 합화 보너스 적용한 카운트 계산
  const adjustedCounts = { ...ohaengCount.counts };
  Object.entries(haphwaBonus).forEach(([ohaeng, bonus]) => {
    adjustedCounts[ohaeng] = (adjustedCounts[ohaeng] || 0) + bonus;
  });

  const adjustedTotal = Object.values(adjustedCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const maxCount = Math.max(...Object.values(adjustedCounts));
  const dominantOhaeng =
    Object.entries(adjustedCounts).find(
      ([, count]) => count === maxCount
    )?.[0] || null;

  if (!dominantOhaeng) return { isValid: false, dominantOhaeng: null };

  const purity = maxCount / adjustedTotal;
  const isPure =
    purity >= VARIABLE2.PURITY_THRESHOLD &&
    maxCount >= VARIABLE2.MIN_DOMINANT_COUNT;
  const hasHaphwa = Object.values(haphwaBonus).some((bonus) => bonus > 0);
  const hasDaewoonSupport = getDaewoonOhaengSupport(
    currentDaewoon,
    dominantOhaeng
  );

  if (!isPure || !hasHaphwa || !hasDaewoonSupport) {
    return { isValid: false, dominantOhaeng: null };
  }

  return { isValid: true, dominantOhaeng };
}

/**
 * Tier 1: 전왕용신 분석
 */
export function analyzeTier1_JeonWang(
  sajuData: SajuData,
  currentDaewoon: { ganji: string } | null = null
): TierAnalysis {
  const score = sajuData.wangseStrength?.finalScore || 5.0;
  const ohaengCount = countOhaengInSaju(sajuData.pillars);
  const haphwaBonus = calculateHaphwaOhaengBonus(sajuData.pillars);

  // 3가지 조건 체크
  const basicResult = checkJeonwangBasic(score, ohaengCount);
  const variable1Result = checkJeonwangVariable1(
    score,
    ohaengCount,
    haphwaBonus
  );
  const variable2Result = checkJeonwangVariable2(
    score,
    ohaengCount,
    haphwaBonus,
    currentDaewoon
  );

  // 하나라도 만족하면 전왕용신 적용
  const isDominant =
    basicResult.isValid || variable1Result.isValid || variable2Result.isValid;

  let dominantOhaeng: string | null = null;
  let conditionMet = "";

  if (basicResult.isValid) {
    dominantOhaeng = basicResult.dominantOhaeng;
    conditionMet = "기본조건";
  } else if (variable1Result.isValid) {
    dominantOhaeng = variable1Result.dominantOhaeng;
    conditionMet = "변수조건1";
  } else if (variable2Result.isValid) {
    dominantOhaeng = variable2Result.dominantOhaeng;
    conditionMet = "변수조건2";
  }

  return {
    tier: 1,
    name: "전왕용신",
    isDominant,
    yongsin: dominantOhaeng ? [dominantOhaeng] : [],
    confidence: isDominant
      ? basicResult.isValid
        ? 95
        : variable1Result.isValid
        ? 80
        : 65
      : 0,
    reason: isDominant
      ? `${conditionMet} 만족: 점수 ${score.toFixed(
          1
        )}, 지배오행 ${dominantOhaeng}`
      : `전왕용신 조건 불만족: 점수 ${score.toFixed(1)}`,
    details: {
      score,
      ohaengDistribution: ohaengCount.counts,
      haphwaBonus,
      conditionMet: isDominant ? conditionMet : null,
    },
  };
}

// =================================================================
// 나머지 Tier 분석 함수들 (TODO)
// =================================================================

// =================================================================
// 조후용신 (Tier 2) 분석 함수들
// =================================================================

/**
 * 기후 점수 계산 (지지 + 천간)
 */
function calculateClimateScores(pillars: {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
  hour: { gan: string; ji: string };
}): Record<string, number> {
  const { POSITION_WEIGHTS, GAN_WEIGHTS, GAN_CLIMATE_MAP, JI_CLIMATE_MAP } =
    JOHU_CRITERIA;
  const scores: Record<string, number> = { 寒: 0, 暖: 0, 燥: 0, 濕: 0 };

  const positions = ["year", "month", "day", "hour"] as const;
  const positionWeights = [
    POSITION_WEIGHTS.YEAR,
    POSITION_WEIGHTS.MONTH,
    POSITION_WEIGHTS.DAY,
    POSITION_WEIGHTS.HOUR,
  ];

  positions.forEach((position, index) => {
    const pillar = pillars[position];
    const positionWeight = positionWeights[index];

    // 지지 기여도 계산
    const jiClimates =
      JI_CLIMATE_MAP[pillar.ji as keyof typeof JI_CLIMATE_MAP] || [];
    if (jiClimates.length > 0) {
      const baseScore = 1 / jiClimates.length; // 균등 분배
      jiClimates.forEach((climate: string) => {
        scores[climate as keyof typeof scores] += baseScore * positionWeight;
      });
    }

    // 천간 기여도 계산
    const ganClimate =
      GAN_CLIMATE_MAP[pillar.gan as keyof typeof GAN_CLIMATE_MAP];
    const ganWeight = GAN_WEIGHTS[pillar.gan as keyof typeof GAN_WEIGHTS];
    if (ganClimate && ganWeight) {
      scores[ganClimate as keyof typeof scores] += ganWeight;
    }
  });

  return scores;
}

/**
 * 기후 점수를 퍼센트로 정규화
 */
function normalizeClimateScores(
  scores: Record<string, number>
): Record<string, number> {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  if (total === 0) return { 寒: 25, 暖: 25, 燥: 25, 濕: 25 }; // 기본값

  const normalized: Record<string, number> = {};
  Object.entries(scores).forEach(([climate, score]) => {
    normalized[climate] = (score / total) * 100;
  });

  return normalized;
}

/**
 * 기후 불균형 분석
 */
function analyzeClimateImbalance(normalizedScores: Record<string, number>): {
  isDominant: boolean;
  dominantClimate: string | null;
  dominantPercentage: number;
  secondPercentage: number;
  difference: number;
} {
  const { DOMINANT_THRESHOLD, DIFFERENCE_THRESHOLD } = JOHU_CRITERIA;

  // 점수 순으로 정렬
  const sortedEntries = Object.entries(normalizedScores).sort(
    ([, a], [, b]) => b - a
  );

  const [dominantClimate, dominantPercentage] = sortedEntries[0];
  const [, secondPercentage] = sortedEntries[1];
  const difference = dominantPercentage - secondPercentage;

  // 불균형 판단
  const isDominant =
    dominantPercentage >= DOMINANT_THRESHOLD ||
    difference >= DIFFERENCE_THRESHOLD;

  return {
    isDominant,
    dominantClimate: isDominant ? dominantClimate : null,
    dominantPercentage,
    secondPercentage,
    difference,
  };
}

/**
 * Tier 2: 조후용신 분석
 */
export function analyzeTier2_Johu(sajuData: SajuData): TierAnalysis {
  // 1. 기후 점수 계산
  const rawScores = calculateClimateScores(sajuData.pillars);
  const normalizedScores = normalizeClimateScores(rawScores);

  // 2. 불균형 분석
  const imbalanceAnalysis = analyzeClimateImbalance(normalizedScores);

  // 3. 용신 결정
  let yongsinList: string[] = [];
  let confidence = 0;
  let reason = "";

  if (imbalanceAnalysis.isDominant && imbalanceAnalysis.dominantClimate) {
    const recommendedYongsin =
      JOHU_CRITERIA.CLIMATE_YONGSIN_MAP[
        imbalanceAnalysis.dominantClimate as keyof typeof JOHU_CRITERIA.CLIMATE_YONGSIN_MAP
      ] || [];
    yongsinList = recommendedYongsin;

    // 확신도 계산 (불균형이 클수록 높음)
    if (imbalanceAnalysis.dominantPercentage >= 60) confidence = 90;
    else if (imbalanceAnalysis.dominantPercentage >= 50) confidence = 80;
    else if (imbalanceAnalysis.difference >= 25) confidence = 75;
    else confidence = 65;

    reason = `${
      imbalanceAnalysis.dominantClimate
    } 과다 (${imbalanceAnalysis.dominantPercentage.toFixed(
      1
    )}%) → ${yongsinList.join(", ")} 용신`;
  } else {
    reason = `기후 균형 상태 (최고 ${imbalanceAnalysis.dominantPercentage.toFixed(
      1
    )}%, 차이 ${imbalanceAnalysis.difference.toFixed(1)}%)`;
  }

  return {
    tier: 2,
    name: "조후용신",
    isDominant: imbalanceAnalysis.isDominant,
    yongsin: yongsinList,
    confidence,
    reason,
    details: {
      rawScores,
      normalizedScores,
      dominantClimate: imbalanceAnalysis.dominantClimate,
      dominantPercentage: imbalanceAnalysis.dominantPercentage,
      difference: imbalanceAnalysis.difference,
    },
  };
}

export function analyzeTier3_Byeongyak(): TierAnalysis {
  // TODO: 병약용신 구현
  return {
    tier: 3,
    name: "병약용신",
    isDominant: false,
    yongsin: [],
    confidence: 0,
    reason: "병약용신 분석 미구현",
    details: {},
  };
}

export function analyzeTier4_Tonggwan(): TierAnalysis {
  // TODO: 통관용신 구현
  return {
    tier: 4,
    name: "통관용신",
    isDominant: false,
    yongsin: [],
    confidence: 0,
    reason: "통관용신 분석 미구현",
    details: {},
  };
}

export function analyzeTier5_Eokbu(): TierAnalysis {
  // TODO: 억부용신 구현
  return {
    tier: 5,
    name: "억부용신",
    isDominant: false,
    yongsin: [],
    confidence: 0,
    reason: "억부용신 분석 미구현",
    details: {},
  };
}

export function analyzeTier6_Gyeokguk(): TierAnalysis {
  // TODO: 격국용신 구현
  return {
    tier: 6,
    name: "격국용신",
    isDominant: false,
    yongsin: [],
    confidence: 0,
    reason: "격국용신 분석 미구현",
    details: {},
  };
}

/**
 * 메인 용신 분석 함수
 */
export function analyzeYongsin(
  sajuData: SajuData,
  currentDaewoon: { ganji: string } | null = null
): YongsinResult {
  // 모든 Tier 분석
  const analyses = [
    analyzeTier1_JeonWang(sajuData, currentDaewoon),
    analyzeTier2_Johu(sajuData),
    analyzeTier3_Byeongyak(),
    analyzeTier4_Tonggwan(),
    analyzeTier5_Eokbu(),
    analyzeTier6_Gyeokguk(),
  ];

  // 우선순위에 따라 주체 선정
  const dominantAnalysis = analyses.find((analysis) => analysis.isDominant);

  if (dominantAnalysis) {
    return {
      primaryYongsin: dominantAnalysis.yongsin,
      selectedTier: dominantAnalysis,
      allAnalyses: analyses,
      confidence: dominantAnalysis.confidence,
      summary: `${dominantAnalysis.name} 적용: ${dominantAnalysis.yongsin.join(
        ", "
      )}`,
    };
  }

  // 모든 조건 불만족시 기본값
  return {
    primaryYongsin: ["土"], // 기본 용신
    selectedTier: null,
    allAnalyses: analyses,
    confidence: 30,
    summary: "특정 용신 조건 불만족, 기본 용신 적용",
  };
}
