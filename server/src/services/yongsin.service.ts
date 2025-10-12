// server/src/services/yongsin.service.ts
// 용신 분석 메인 서비스

import {
  YongsinResult,
  TierAnalysis,
  JEONWANG_CRITERIA,
  JOHU_CRITERIA,
  BYEONGYAK_CRITERIA,
  TONGGWAN_CRITERIA,
  EOKBU_CRITERIA,
  isEnemyToTarget,
  isOhaengConsecutive,
  getGanyjidongPositions,
  countSupportingOhaengs,
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
 * 오행별 천간 매핑
 */
const OHAENG_TO_GAN_MAP = {
  木: { yang: "甲", eum: "乙" },
  火: { yang: "丙", eum: "丁" },
  土: { yang: "戊", eum: "己" },
  金: { yang: "庚", eum: "辛" },
  水: { yang: "壬", eum: "癸" },
};

/**
 * 사주 원국에서 실제 용신 천간을 찾습니다
 * @param requiredOhaeng 필요한 오행 ("木", "火" 등)
 * @param pillars 사주 원국 천간지
 * @returns 실제 용신 천간
 */
function findActualYongsin(
  requiredOhaeng: string,
  pillars: {
    year: { gan: string; ji: string };
    month: { gan: string; ji: string };
    day: { gan: string; ji: string };
    hour: { gan: string; ji: string };
  }
): string {
  const ganMap =
    OHAENG_TO_GAN_MAP[requiredOhaeng as keyof typeof OHAENG_TO_GAN_MAP];
  if (!ganMap) {
    throw new Error(`Unknown ohaeng: ${requiredOhaeng}`);
  }

  // 원국 천간들 수집
  const gansInSaju = [
    pillars.year.gan,
    pillars.month.gan,
    pillars.day.gan,
    pillars.hour.gan,
  ];

  const hasYang = gansInSaju.includes(ganMap.yang);
  const hasEum = gansInSaju.includes(ganMap.eum);

  // 1차: 둘 다 있으면 양간 우선
  if (hasYang && hasEum) {
    return ganMap.yang;
  }

  // 2차: 양간만 있으면 양간
  if (hasYang) {
    return ganMap.yang;
  }

  // 3차: 음간만 있으면 음간
  if (hasEum) {
    return ganMap.eum;
  }

  // 4차: 둘 다 없으면 양간 기본값
  return ganMap.yang;
}

/**
 * 지배적 오행을 억제하는 오행을 찾습니다 (오행 상극 관계)
 * @param dominantOhaeng 지배적 오행
 * @returns 억제하는 오행
 */
function getSuppressingOhaeng(dominantOhaeng: string): string {
  const suppressingMap: Record<string, string> = {
    木: "金", // 금극목
    火: "水", // 수극화
    土: "木", // 목극토
    金: "火", // 화극금
    水: "土", // 토극수
  };

  return suppressingMap[dominantOhaeng] || dominantOhaeng;
}

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

  // 용신 천간 결정
  let actualYongsin = "";
  if (isDominant && dominantOhaeng) {
    // 지배적 오행을 억제하는 오행을 찾아서 천간으로 변환
    const suppressingOhaeng = getSuppressingOhaeng(dominantOhaeng);
    actualYongsin = findActualYongsin(suppressingOhaeng, sajuData.pillars);
  }

  return {
    tier: 1,
    name: "전왕용신",
    isDominant,
    yongsin: actualYongsin,
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
        )}, 지배오행 ${dominantOhaeng} → ${actualYongsin} 용신`
      : `전왕용신 조건 불만족: 점수 ${score.toFixed(1)}`,
    details: {
      score,
      ohaengDistribution: ohaengCount.counts,
      haphwaBonus,
      conditionMet: isDominant ? conditionMet : null,
      dominantOhaeng,
      suppressingOhaeng:
        isDominant && dominantOhaeng
          ? getSuppressingOhaeng(dominantOhaeng)
          : null,
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
  let actualYongsin = "";
  let confidence = 0;
  let reason = "";

  if (imbalanceAnalysis.isDominant && imbalanceAnalysis.dominantClimate) {
    const recommendedOhaengList =
      JOHU_CRITERIA.CLIMATE_YONGSIN_MAP[
        imbalanceAnalysis.dominantClimate as keyof typeof JOHU_CRITERIA.CLIMATE_YONGSIN_MAP
      ] || [];

    // 첫 번째 권장 오행을 선택해서 천간으로 변환
    if (recommendedOhaengList.length > 0) {
      const primaryOhaeng = recommendedOhaengList[0];
      actualYongsin = findActualYongsin(primaryOhaeng, sajuData.pillars);
    }

    // 확신도 계산 (불균형이 클수록 높음)
    if (imbalanceAnalysis.dominantPercentage >= 60) confidence = 90;
    else if (imbalanceAnalysis.dominantPercentage >= 50) confidence = 80;
    else if (imbalanceAnalysis.difference >= 25) confidence = 75;
    else confidence = 65;

    reason = `${
      imbalanceAnalysis.dominantClimate
    } 과다 (${imbalanceAnalysis.dominantPercentage.toFixed(
      1
    )}%) → ${actualYongsin} 용신`;
  } else {
    reason = `기후 균형 상태 (최고 ${imbalanceAnalysis.dominantPercentage.toFixed(
      1
    )}%, 차이 ${imbalanceAnalysis.difference.toFixed(1)}%)`;
  }

  return {
    tier: 2,
    name: "조후용신",
    isDominant: imbalanceAnalysis.isDominant,
    yongsin: actualYongsin,
    confidence,
    reason,
    details: {
      rawScores,
      normalizedScores,
      dominantClimate: imbalanceAnalysis.dominantClimate,
      dominantPercentage: imbalanceAnalysis.dominantPercentage,
      difference: imbalanceAnalysis.difference,
      recommendedOhaengList: imbalanceAnalysis.isDominant
        ? JOHU_CRITERIA.CLIMATE_YONGSIN_MAP[
            imbalanceAnalysis.dominantClimate as keyof typeof JOHU_CRITERIA.CLIMATE_YONGSIN_MAP
          ]
        : [],
    },
  };
}

/**
 * 특정 천간이 적군에게 포위되어 고립되었는지 확인
 */
function isGanIsolated(
  targetGan: string,
  position: number,
  pillars: Array<{ gan: string; ji: string }>
): boolean {
  const targetOhaeng = GAN_OHENG[targetGan as keyof typeof GAN_OHENG];
  if (!targetOhaeng) return false;

  let enemyCount = 0;

  // 1) 앞 기둥 천간 확인 (있다면)
  if (position > 0) {
    const prevGan = pillars[position - 1].gan;
    const prevOhaeng = GAN_OHENG[prevGan as keyof typeof GAN_OHENG];
    if (prevOhaeng && isEnemyToTarget(targetOhaeng, prevOhaeng)) {
      enemyCount++;
    }
  }

  // 2) 뒤 기둥 천간 확인 (있다면)
  if (position < pillars.length - 1) {
    const nextGan = pillars[position + 1].gan;
    const nextOhaeng = GAN_OHENG[nextGan as keyof typeof GAN_OHENG];
    if (nextOhaeng && isEnemyToTarget(targetOhaeng, nextOhaeng)) {
      enemyCount++;
    }
  }

  // 3) 같은 기둥 지지 확인
  const sameJi = pillars[position].ji;
  const sameOhaeng = JI_OHENG[sameJi as keyof typeof JI_OHENG];
  if (sameOhaeng && isEnemyToTarget(targetOhaeng, sameOhaeng)) {
    enemyCount++;
  }

  // 포위 조건: 2방향 이상에서 적군
  return enemyCount >= BYEONGYAK_CRITERIA.ISOLATION.MIN_ENEMY_DIRECTIONS;
}

/**
 * 사주에서 고립된 천간들을 찾기
 */
function findIsolatedElements(
  pillars: Array<{ gan: string; ji: string }>
): Array<{ element: string; position: number; type: "cheongan" }> {
  const isolated: Array<{
    element: string;
    position: number;
    type: "cheongan";
  }> = [];

  // 각 기둥의 천간 검사
  pillars.forEach((pillar, index) => {
    if (isGanIsolated(pillar.gan, index, pillars)) {
      isolated.push({
        element: pillar.gan,
        position: index,
        type: "cheongan",
      });
    }
  });

  return isolated;
}

/**
 * 과다 오행 분석 (우선순위별)
 */
function analyzeExcessOhaengs(
  pillars: Array<{ gan: string; ji: string }>,
  ohaengCount: { counts: Record<string, number>; total: number }
) {
  const results: Array<{
    ohaeng: string;
    priority: number;
    count: number;
    hasGanyjidong: boolean;
    isConsecutive: boolean;
    supportingCount: number;
    reason: string;
  }> = [];

  // 각 오행별로 과다 조건 확인
  Object.entries(ohaengCount.counts).forEach(([ohaeng, count]) => {
    if (count < BYEONGYAK_CRITERIA.EXCESS.PRIORITY_1.MIN_COUNT) return;

    // 해당 오행의 모든 위치 수집
    const ohaengPositions: number[] = [];
    pillars.forEach((pillar, pillarIndex) => {
      const ganOhaeng = GAN_OHENG[pillar.gan as keyof typeof GAN_OHENG];
      const jiOhaeng = JI_OHENG[pillar.ji as keyof typeof JI_OHENG];

      if (ganOhaeng === ohaeng) ohaengPositions.push(pillarIndex * 2);
      if (jiOhaeng === ohaeng) ohaengPositions.push(pillarIndex * 2 + 1);
    });

    // 간여지동 확인
    const ganyjidongPositions = getGanyjidongPositions(ohaeng, pillars);
    const hasGanyjidong = ganyjidongPositions.length > 0;

    // 연속성 확인
    const isConsecutive = isOhaengConsecutive(ohaengPositions);

    // 생해주는 오행 개수 확인
    const supportingCount = countSupportingOhaengs(ohaeng, {
      counts: ohaengCount.counts,
      total: ohaengCount.total,
    });

    // 우선순위 판단
    let priority = 0;
    let reason = "";

    // 우선순위 1: 3개 + 간여지동 + 연속
    if (
      count >= BYEONGYAK_CRITERIA.EXCESS.PRIORITY_1.MIN_COUNT &&
      hasGanyjidong &&
      isConsecutive
    ) {
      priority = 1;
      reason = `${ohaeng} ${count}개 + 간여지동 + 연속배치`;
    }
    // 우선순위 2: 우선순위1 + 생해주는 오행 1개 이하
    else if (
      count >= BYEONGYAK_CRITERIA.EXCESS.PRIORITY_2.MIN_COUNT &&
      hasGanyjidong &&
      isConsecutive &&
      supportingCount <=
        BYEONGYAK_CRITERIA.EXCESS.PRIORITY_2.MAX_SUPPORTING_OHAENG
    ) {
      priority = 2;
      reason = `${ohaeng} ${count}개 + 간여지동 + 연속 + 생해주는 오행 ${supportingCount}개`;
    }
    // 우선순위 3: 단순 개수
    else if (count >= BYEONGYAK_CRITERIA.EXCESS.PRIORITY_3.MIN_COUNT) {
      priority = 3;
      reason = `${ohaeng} ${count}개 과다`;
    }

    if (priority > 0) {
      results.push({
        ohaeng,
        priority,
        count,
        hasGanyjidong,
        isConsecutive,
        supportingCount,
        reason,
      });
    }
  });

  // 우선순위 순으로 정렬 (낮은 숫자가 높은 우선순위)
  results.sort((a, b) => a.priority - b.priority);

  return results;
}

/**
 * Tier 3: 병약용신 분석
 * 특정 오행이 고립되거나 과다할 때 적용
 */
export function analyzeTier3_Byeongyak(sajuData: SajuData): TierAnalysis {
  const ohaengCount = countOhaengInSaju(sajuData.pillars);

  // 새로운 고립 로직: 포위된 천간 찾기
  const pillarsArray = [
    sajuData.pillars.year,
    sajuData.pillars.month,
    sajuData.pillars.day,
    sajuData.pillars.hour,
  ];
  const isolatedElements = findIsolatedElements(pillarsArray);

  // 새로운 과다 오행 분석 (우선순위별)
  const excessAnalysis = analyzeExcessOhaengs(pillarsArray, ohaengCount);

  let actualYongsin = "";
  let confidence = 0;
  let reason = "";
  let isDominant = false;

  // 1순위: 고립된 천간 보강 (가장 긴급)
  if (isolatedElements.length > 0) {
    const isolatedElement = isolatedElements[0]; // 첫 번째 고립 천간
    const targetOhaeng =
      GAN_OHENG[isolatedElement.element as keyof typeof GAN_OHENG];
    actualYongsin = findActualYongsin(targetOhaeng, sajuData.pillars);
    confidence = 90;
    reason = `${isolatedElement.element}(${targetOhaeng}) 포위 고립 → ${actualYongsin} 보강 용신`;
    isDominant = true;
  }
  // 2순위: 과다한 오행 억제 (새로운 우선순위 기준)
  else if (excessAnalysis.length > 0) {
    const topExcess = excessAnalysis[0]; // 최고 우선순위 과다 오행
    const suppressingOhaeng = getSuppressingOhaeng(topExcess.ohaeng);
    actualYongsin = findActualYongsin(suppressingOhaeng, sajuData.pillars);

    // 우선순위별 신뢰도 차등
    const confidenceMap = { 1: 85, 2: 80, 3: 70 };
    confidence =
      confidenceMap[topExcess.priority as keyof typeof confidenceMap] || 70;

    reason = `${topExcess.reason} → ${actualYongsin} 억제 용신`;
    isDominant = true;
  } else {
    reason = "병약용신 조건 불만족 (포위 고립/과다 오행 없음)";
  }

  return {
    tier: 3,
    name: "병약용신",
    isDominant,
    yongsin: actualYongsin,
    confidence,
    reason,
    details: {
      ohaengDistribution: ohaengCount.counts,
      isolatedElements: isolatedElements.map((el) => ({
        element: el.element,
        position: el.position,
        ohaeng: GAN_OHENG[el.element as keyof typeof GAN_OHENG],
      })),
      excessAnalysis: excessAnalysis.map((excess) => ({
        ohaeng: excess.ohaeng,
        priority: excess.priority,
        count: excess.count,
        reason: excess.reason,
        hasGanyjidong: excess.hasGanyjidong,
        isConsecutive: excess.isConsecutive,
        supportingCount: excess.supportingCount,
      })),
      total: ohaengCount.total,
    },
  };
}

export function analyzeTier4_Tonggwan(sajuData: SajuData): TierAnalysis {
  const ohaengCount = countOhaengInSaju(sajuData.pillars);

  // 모든 극하는 관계 조합 확인
  const conflictAnalysis = [];

  for (const [key, relation] of Object.entries(
    TONGGWAN_CRITERIA.CONFLICT_RELATIONS
  )) {
    const [ohaeng1, ohaeng2] = relation.conflicting;
    const count1 = ohaengCount.counts[ohaeng1] || 0;
    const count2 = ohaengCount.counts[ohaeng2] || 0;

    // 각 세력이 최소 기준 이상이고, 팽팽한 대치인지 확인
    if (
      count1 >= TONGGWAN_CRITERIA.CONFLICT_MIN_COUNT &&
      count2 >= TONGGWAN_CRITERIA.CONFLICT_MIN_COUNT
    ) {
      const difference = Math.abs(count1 - count2);
      if (difference <= TONGGWAN_CRITERIA.BALANCE_TOLERANCE) {
        conflictAnalysis.push({
          relation: key,
          ohaeng1,
          ohaeng2,
          count1,
          count2,
          difference,
          mediator: relation.mediator,
          intensity: count1 + count2, // 총 세력 크기
        });
      }
    }
  }

  let actualYongsin = "";
  let confidence = 0;
  let reason = "";
  let isDominant = false;

  if (conflictAnalysis.length > 0) {
    // 가장 강한 대치 상황 선택 (총 세력이 큰 것)
    const strongestConflict = conflictAnalysis.reduce((prev, current) =>
      current.intensity > prev.intensity ? current : prev
    );

    // 통관용신 결정
    const mediatorOhaeng = strongestConflict.mediator;
    actualYongsin = findActualYongsin(mediatorOhaeng, sajuData.pillars);

    // 신뢰도 계산 (대치가 팽팽할수록, 세력이 클수록 높음)
    const balanceScore = 100 - strongestConflict.difference * 10; // 차이가 적을수록 높음
    const intensityScore = Math.min(strongestConflict.intensity * 5, 50); // 세력이 클수록 높음
    confidence = Math.min(balanceScore + intensityScore, 95);

    reason = `${strongestConflict.ohaeng1}(${strongestConflict.count1})剋${strongestConflict.ohaeng2}(${strongestConflict.count2}) 대치 → ${actualYongsin} 통관 용신`;
    isDominant = true;
  } else {
    reason = "통관용신 조건 불만족 (팽팽한 극하는 대치 없음)";
  }

  return {
    tier: 4,
    name: "통관용신",
    isDominant,
    yongsin: actualYongsin,
    confidence,
    reason,
    details: {
      conflictAnalysis: conflictAnalysis.map((conflict) => ({
        relation: conflict.relation,
        ohaeng1: conflict.ohaeng1,
        ohaeng2: conflict.ohaeng2,
        count1: conflict.count1,
        count2: conflict.count2,
        mediator: conflict.mediator,
        intensity: conflict.intensity,
      })),
    },
  };
}

export function analyzeTier5_Eokbu(sajuData: SajuData): TierAnalysis {
  // 신강신약 점수 확인 (새 35점 체계)
  const wangseScore = sajuData.wangseStrength?.finalScore || 17.5; // 기본값 17.5 (중간)
  const dayMasterGan = sajuData.pillars.day.gan;
  const dayMasterOhaeng = GAN_OHENG[dayMasterGan as keyof typeof GAN_OHENG];

  let actualYongsin = "";
  let confidence = 0;
  let reason = "";
  let isDominant = false;
  let yongsinType = "";

  // 1. 약함 → 부조용신 (扶)
  if (wangseScore < EOKBU_CRITERIA.WEAK_THRESHOLD) {
    const supportOhaengs =
      EOKBU_CRITERIA.SUPPORT_RELATIONS[
        dayMasterOhaeng as keyof typeof EOKBU_CRITERIA.SUPPORT_RELATIONS
      ];

    // 가장 적절한 부조 오행 선택 (생해주는 오행 우선)
    let selectedOhaeng = "";
    if (supportOhaengs.includes(dayMasterOhaeng)) {
      // 비견(같은 오행)이 있으면 우선 선택
      selectedOhaeng = dayMasterOhaeng;
    } else {
      // 생해주는 오행 선택 (첫 번째가 생해주는 오행)
      selectedOhaeng = supportOhaengs[0];
    }

    actualYongsin = findActualYongsin(selectedOhaeng, sajuData.pillars);
    yongsinType = "부조용신";

    // 신뢰도: 점수가 낮을수록 높음 (35점 체계)
    confidence = Math.max(90 - Math.floor(wangseScore * 2), 60);
    reason = `일간 ${dayMasterGan}(${dayMasterOhaeng}) 약함(${wangseScore.toFixed(
      1
    )}) → ${actualYongsin} ${yongsinType}`;
    isDominant = true;
  }
  // 2. 강함 → 억제용신 (抑)
  else if (wangseScore > EOKBU_CRITERIA.STRONG_THRESHOLD) {
    const suppressOhaengs =
      EOKBU_CRITERIA.SUPPRESS_RELATIONS[
        dayMasterOhaeng as keyof typeof EOKBU_CRITERIA.SUPPRESS_RELATIONS
      ];

    // 가장 적절한 억제 오행 선택 (극하는 오행 우선)
    const selectedOhaeng = suppressOhaengs[0]; // 첫 번째가 극하는 오행

    actualYongsin = findActualYongsin(selectedOhaeng, sajuData.pillars);
    yongsinType = "억제용신";

    // 신뢰도: 점수가 높을수록 높음 (35점 체계)
    confidence = Math.min(Math.floor((wangseScore - 21) * 5) + 70, 95);
    reason = `일간 ${dayMasterGan}(${dayMasterOhaeng}) 강함(${wangseScore.toFixed(
      1
    )}) → ${actualYongsin} ${yongsinType}`;
    isDominant = true;
  }
  // 3. 중간 → 균형 상태 (용신 불필요)
  else {
    reason = `일간 ${dayMasterGan}(${dayMasterOhaeng}) 균형(${wangseScore.toFixed(
      1
    )}) → 억부용신 불필요`;
    confidence = 50;
  }

  return {
    tier: 5,
    name: "억부용신",
    isDominant,
    yongsin: actualYongsin,
    confidence,
    reason,
    details: {
      wangseScore,
      dayMasterGan,
      dayMasterOhaeng,
      yongsinType,
      threshold: {
        weak: EOKBU_CRITERIA.WEAK_THRESHOLD,
        strong: EOKBU_CRITERIA.STRONG_THRESHOLD,
      },
    },
  };
}

export function analyzeTier6_Gyeokguk(): TierAnalysis {
  // TODO: 격국용신 구현
  return {
    tier: 6,
    name: "격국용신",
    isDominant: false,
    yongsin: "",
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
    analyzeTier3_Byeongyak(sajuData),
    analyzeTier4_Tonggwan(sajuData),
    analyzeTier5_Eokbu(sajuData),
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
      summary: `${dominantAnalysis.name} 적용: ${dominantAnalysis.yongsin}`,
    };
  }

  // 모든 조건 불만족시 기본값 (토 용신을 천간으로 변환)
  const defaultYongsin = findActualYongsin("土", sajuData.pillars);
  return {
    primaryYongsin: defaultYongsin,
    selectedTier: null,
    allAnalyses: analyses,
    confidence: 30,
    summary: `특정 용신 조건 불만족, 기본 용신 적용: ${defaultYongsin}`,
  };
}
