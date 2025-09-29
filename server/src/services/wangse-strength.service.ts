// server/src/services/wangse-strength.service.ts
// 왕쇠강약 계산 전용 서비스

import { getSipsinWithScores } from "./sipsin.service";
import { WANGSE_WEIGHTS, YANGGAN_LIST } from "../data/saju.data";

// 왕쇠강약 결과 인터페이스
export interface WangseResult {
  ganType: "양간" | "음간";
  rawScore: number; // Raw 총점 (4로 나누기 전)
  finalScore: number; // 최종 점수 (0-10)
  level: string; // "극왕", "왕", "중", "쇠", "극쇠" 등
  levelDetail: string; // "극왕", "태왕", "왕", "중화(왕)" 등
  breakdown: {
    pillarScores: PillarScore[]; // 각 기둥별 점수
    bonuses: number; // 월령 보너스
    penalties: number; // 패널티
    weightedTotal: number; // 가중치 적용 총점
    baseScore: number; // 기본 점수 (÷4 후)
    ganyjidongBonus: number; // 간여지동 보너스
  };
  analysis: string; // 분석 설명
}

// 기둥별 점수 상세
export interface PillarScore {
  pillar: string; // "년간", "년지", "월간", "월지", "일지", "시간", "시지"
  sipsinName: string | null; // 십성 이름
  baseScore: number; // 기본 십성 점수
  weight: number; // 가중치
  weightedScore: number; // 가중치 적용 점수
}

// 월령 득령 확인 (간단한 버전 - 나중에 확장 가능)
const SEASONAL_SUPPORT: Record<string, string[]> = {
  春: ["甲", "乙"], // 봄: 목 왕성
  夏: ["丙", "丁"], // 여름: 화 왕성
  秋: ["庚", "辛"], // 가을: 금 왕성
  冬: ["壬", "癸"], // 겨울: 수 왕성
};

/**
 * 현재 월에 해당하는 계절을 반환
 */
function getCurrentSeason(month: number): string {
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
}

/**
 * 월령 보너스 계산
 */
function getSeasonalBonus(dayGan: string, month: number): number {
  const season = getCurrentSeason(month);
  const supportedGans = SEASONAL_SUPPORT[season];
  return supportedGans.includes(dayGan) ? 5 : 0;
}

/**
 * 오행 매핑 (간여지동 확인용)
 */
const GAN_TO_OHAENG: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const JI_TO_OHAENG: Record<string, string> = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
};

/**
 * 십성별 간여지동 보너스 점수
 */
const GANYJIDONG_BONUS: Record<string, number> = {
  비견: 1.0,
  겁재: 1.0,
  정인: 1.5,
  편인: 1.5,
  식신: -0.5,
  상관: -0.5,
  정재: -1.0,
  편재: -1.0,
  정관: -1.5,
  편관: -1.5,
};

/**
 * 간여지동 보너스 계산
 * 천간과 지지가 같은 오행일 때 해당 십성에 따른 보너스 적용
 */
function calculateGanyjidongBonus(
  pillars: { year: string; month: string; day: string; hour: string },
  sipsinScores: {
    year: {
      gan: { name: string | null; score: number };
      ji: { name: string | null; score: number };
    };
    month: {
      gan: { name: string | null; score: number };
      ji: { name: string | null; score: number };
    };
    day: {
      gan: { name: string | null; score: number };
      ji: { name: string | null; score: number };
    };
    hour: {
      gan: { name: string | null; score: number };
      ji: { name: string | null; score: number };
    };
  }
): number {
  let totalBonus = 0;

  // 각 기둥별로 간여지동 확인
  const pillarData = [
    {
      name: "year",
      gan: pillars.year[0],
      ji: pillars.year[1],
      ganSipsin: sipsinScores.year.gan.name,
      jiSipsin: sipsinScores.year.ji.name,
    },
    {
      name: "month",
      gan: pillars.month[0],
      ji: pillars.month[1],
      ganSipsin: sipsinScores.month.gan.name,
      jiSipsin: sipsinScores.month.ji.name,
    },
    {
      name: "day",
      gan: pillars.day[0],
      ji: pillars.day[1],
      ganSipsin: sipsinScores.day.gan.name,
      jiSipsin: sipsinScores.day.ji.name,
    },
    {
      name: "hour",
      gan: pillars.hour[0],
      ji: pillars.hour[1],
      ganSipsin: sipsinScores.hour.gan.name,
      jiSipsin: sipsinScores.hour.ji.name,
    },
  ];

  for (const pillar of pillarData) {
    const ganOhaeng = GAN_TO_OHAENG[pillar.gan];
    const jiOhaeng = JI_TO_OHAENG[pillar.ji];

    // 간여지동 확인: 천간과 지지가 같은 오행인가?
    if (ganOhaeng === jiOhaeng) {
      // 천간 보너스 (일간은 본원이므로 제외)
      if (pillar.name !== "day" || pillar.ganSipsin !== "본원") {
        const ganBonus = pillar.ganSipsin
          ? GANYJIDONG_BONUS[pillar.ganSipsin] || 0
          : 0;
        totalBonus += ganBonus;
      }

      // 지지 보너스
      const jiBonus = pillar.jiSipsin
        ? GANYJIDONG_BONUS[pillar.jiSipsin] || 0
        : 0;
      totalBonus += jiBonus;
    }
  }

  return totalBonus;
}

/**
 * 패널티 계산 (현재는 세력만 고려하여 패널티 없음)
 */
function calculatePenalties(): number {
  // 순수 세력만 고려하므로 패널티 없음
  return 0;
}

/**
 * 8단계 레벨 분류
 */
function classifyWangseLevel(
  score: number,
  isYanggan: boolean
): { level: string; levelDetail: string } {
  const yangganLevels = [
    { level: "극쇠", detail: "극쇠" }, // 0.0-1.25
    { level: "쇠", detail: "태쇠" }, // 1.25-2.5
    { level: "쇠", detail: "쇠" }, // 2.5-3.75
    { level: "중", detail: "중화(쇠)" }, // 3.75-5.0
    { level: "중", detail: "중화(왕)" }, // 5.0-6.25
    { level: "왕", detail: "왕" }, // 6.25-7.5
    { level: "왕", detail: "태왕" }, // 7.5-8.75
    { level: "극왕", detail: "극왕" }, // 8.75-10.0
  ];

  const eumganLevels = [
    { level: "신약", detail: "극약" }, // 0.0-1.25
    { level: "약", detail: "신약" }, // 1.25-2.5
    { level: "약", detail: "약" }, // 2.5-3.75
    { level: "중", detail: "중화(약)" }, // 3.75-5.0
    { level: "중", detail: "중화(강)" }, // 5.0-6.25
    { level: "강", detail: "강" }, // 6.25-7.5
    { level: "강", detail: "신강" }, // 7.5-8.75
    { level: "신강", detail: "극강" }, // 8.75-10.0
  ];

  const levels = isYanggan ? yangganLevels : eumganLevels;
  const index = Math.min(7, Math.max(0, Math.floor(score * 0.8)));

  return { level: levels[index].level, levelDetail: levels[index].detail };
}

/**
 * 왕쇠강약 메인 계산 함수
 */
export function calculateWangseStrength(
  pillars: { year: string; month: string; day: string; hour: string },
  dayGan: string,
  birthMonth: number
): WangseResult {
  // 1. 양간/음간 판별
  const isYanggan = YANGGAN_LIST.includes(dayGan);
  const ganType: "양간" | "음간" = isYanggan ? "양간" : "음간";

  // 2. 가중치 선택
  const weights = isYanggan ? WANGSE_WEIGHTS.YANGGAN : WANGSE_WEIGHTS.EUMGAN;

  // 3. 십성과 점수 계산
  const sipsinScores = getSipsinWithScores(dayGan, pillars);

  // 4. 기둥별 점수 계산
  const pillarScores: PillarScore[] = [
    {
      pillar: "년간",
      sipsinName: sipsinScores.year.gan.name,
      baseScore: sipsinScores.year.gan.score,
      weight: weights.yearGan,
      weightedScore: sipsinScores.year.gan.score * weights.yearGan,
    },
    {
      pillar: "년지",
      sipsinName: sipsinScores.year.ji.name,
      baseScore: sipsinScores.year.ji.score,
      weight: weights.yearJi,
      weightedScore: sipsinScores.year.ji.score * weights.yearJi,
    },
    {
      pillar: "월간",
      sipsinName: sipsinScores.month.gan.name,
      baseScore: sipsinScores.month.gan.score,
      weight: weights.monthGan,
      weightedScore: sipsinScores.month.gan.score * weights.monthGan,
    },
    {
      pillar: "월지",
      sipsinName: sipsinScores.month.ji.name,
      baseScore: sipsinScores.month.ji.score,
      weight: weights.monthJi,
      weightedScore: sipsinScores.month.ji.score * weights.monthJi,
    },
    {
      pillar: "일지",
      sipsinName: sipsinScores.day.ji.name,
      baseScore: sipsinScores.day.ji.score,
      weight: weights.dayJi,
      weightedScore: sipsinScores.day.ji.score * weights.dayJi,
    },
    {
      pillar: "시간",
      sipsinName: sipsinScores.hour.gan.name,
      baseScore: sipsinScores.hour.gan.score,
      weight: weights.hourGan,
      weightedScore: sipsinScores.hour.gan.score * weights.hourGan,
    },
    {
      pillar: "시지",
      sipsinName: sipsinScores.hour.ji.name,
      baseScore: sipsinScores.hour.ji.score,
      weight: weights.hourJi,
      weightedScore: sipsinScores.hour.ji.score * weights.hourJi,
    },
  ];

  // 5. 가중치 적용 총점
  const weightedTotal = pillarScores.reduce(
    (sum, p) => sum + p.weightedScore,
    0
  );

  // 6. 월령 보너스
  const bonuses = getSeasonalBonus(dayGan, birthMonth);

  // 7. 패널티
  const penalties = calculatePenalties();

  // 8. 기본 점수 계산 (가중치 총점 + 월령 보너스) ÷ 4
  const baseScore = Math.max(
    0,
    Math.min(10, (weightedTotal + bonuses + penalties) / 4)
  );

  // 9. 간여지동 보너스 계산
  const ganyjidongBonus = calculateGanyjidongBonus(pillars, sipsinScores);

  // 10. 최종 점수 (기본 점수 + 간여지동 보너스)
  const finalScore = Math.max(0, Math.min(10, baseScore + ganyjidongBonus));

  // 11. 레벨 분류
  const { level, levelDetail } = classifyWangseLevel(finalScore, isYanggan);

  // 12. 분석 설명 생성
  const analysis = generateAnalysis(
    ganType,
    level,
    levelDetail,
    finalScore,
    bonuses,
    ganyjidongBonus
  );

  return {
    ganType,
    rawScore: weightedTotal + bonuses + penalties, // Raw 점수 (4로 나누기 전)
    finalScore,
    level,
    levelDetail,
    breakdown: {
      pillarScores,
      bonuses,
      penalties,
      weightedTotal,
      baseScore, // 기본 점수 추가
      ganyjidongBonus, // 간여지동 보너스 추가
    },
    analysis,
  };
}

/**
 * 분석 설명 생성
 */
function generateAnalysis(
  ganType: "양간" | "음간",
  level: string,
  levelDetail: string,
  finalScore: number,
  bonuses: number,
  ganyjidongBonus: number
): string {
  let analysis = `${ganType} 일간의 `;

  if (ganType === "양간") {
    analysis += `왕쇠 상태는 "${levelDetail}"입니다. `;
    if (level === "극왕" || level === "왕") {
      analysis += "매우 강한 상태로 기운이 넘치지만 과도할 수 있습니다.";
    } else if (level === "중") {
      analysis += "균형 잡힌 상태로 안정적인 기운을 보입니다.";
    } else {
      analysis += "약한 상태로 도움과 지원이 필요합니다.";
    }
  } else {
    analysis += `강약 상태는 "${levelDetail}"입니다. `;
    if (level === "신강" || level === "강") {
      analysis += "매우 강한 상태로 자립심과 추진력이 뛰어납니다.";
    } else if (level === "중") {
      analysis += "균형 잡힌 상태로 조화로운 기운을 보입니다.";
    } else {
      analysis += "약한 상태로 인성의 도움이나 비겁의 지원이 필요합니다.";
    }
  }

  if (bonuses > 0) {
    analysis += ` 현재 계절의 도움을 받고 있습니다(+${bonuses}).`;
  }

  if (ganyjidongBonus > 0) {
    analysis += ` 간여지동으로 인한 추가 도움이 있습니다(+${ganyjidongBonus.toFixed(
      1
    )}).`;
  } else if (ganyjidongBonus < 0) {
    analysis += ` 간여지동으로 인한 약화 요소가 있습니다(${ganyjidongBonus.toFixed(
      1
    )}).`;
  }

  analysis += ` (점수: ${finalScore.toFixed(2)}/10)`;

  return analysis;
}
