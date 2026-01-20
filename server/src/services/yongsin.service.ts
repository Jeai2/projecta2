// server/src/services/yongsin.service.ts
// 용신 분석 메인 서비스

import {
  YongsinResult,
  TierAnalysis,
  EOKBU_CRITERIA,
  JOHU_DAY_MONTH_YONGSIN_MAP,
} from "../data/yongsin.data";
import { GAN_OHENG } from "../data/saju.data";
import type { SajuData } from "../types/saju.d";

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

// =================================================================
// 조후용신 (Tier 2) 분석 함수들
// =================================================================
/**
 * Tier 2: 조후용신 분석
 */
export function analyzeTier2_Johu(sajuData: SajuData): TierAnalysis {
  const dayGan = sajuData.pillars.day.gan;
  const monthJi = sajuData.pillars.month.ji;
  const mappedCandidates = JOHU_DAY_MONTH_YONGSIN_MAP[dayGan]?.[monthJi] || [];
  if (mappedCandidates.length > 0) {
    const primaryMapped = mappedCandidates[0];
    return {
      tier: 2,
      name: "조후용신",
      isDominant: true,
      yongsin: primaryMapped,
      confidence: 80,
      reason: `${dayGan}일간 ${monthJi}월 맵핑 → ${mappedCandidates.join("/")}`,
      details: {
        mappedCandidates,
      },
    };
  }
  return {
    tier: 2,
    name: "조후용신",
    isDominant: false,
    yongsin: "",
    confidence: 0,
    reason: "조후용신 맵핑 없음",
    details: {
      mappedCandidates: [],
    },
  };
}

/**
 * Tier 1: 억부용신 분석
 */
export function analyzeTier1_Eokbu(sajuData: SajuData): TierAnalysis {
  // 신강신약 점수 확인 (새 35점 체계)
  const wangseScore = sajuData.wangseStrength?.finalScore ?? 17.5; // 기본값 17.5 (중간)
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
    tier: 1,
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

/**
 * 메인 용신 분석 함수
 */
export function analyzeYongsin(
  sajuData: SajuData,
  currentDaewoon: { ganji: string } | null = null
): YongsinResult {
  void currentDaewoon;
  // 억부/조후만 분석 (전왕/병약/통관 제외)
  const eokbu = analyzeTier1_Eokbu(sajuData);
  const johu = analyzeTier2_Johu(sajuData);
  const analyses = [eokbu, johu];

  const primaryYongsin = eokbu.yongsin || johu.yongsin || "";
  const confidence = Math.max(eokbu.confidence, johu.confidence);

  return {
    primaryYongsin,
    selectedTier: null,
    allAnalyses: analyses,
    confidence,
    summary: `억부용신: ${eokbu.yongsin || "-"} / 조후용신: ${
      johu.yongsin || "-"
    }`,
  };
}
