// server/src/services/wangse-strength.service.ts
// 왕쇠강약 계산 전용 서비스

import { getSipsinWithScores } from "./sipsin.service";
import { WANGSE_WEIGHTS, YANGGAN_LIST } from "../data/saju.data";
import { JIJANGGAN_DATA } from "../data/jijanggan";
import {
  CHEONGANHAPHWA,
  YUKHAPHWA,
  SAMHAPHWA,
  BANGHAPHWA,
} from "../data/relationship.data";

// 왕쇠강약 결과 인터페이스
export interface WangseResult {
  ganType: "양간" | "음간";
  rawScore: number; // Raw 총점 (4로 나누기 전)
  finalScore: number; // 최종 점수 (0-10)
  level: string; // "극왕", "왕", "중", "쇠", "극쇠" 등
  levelDetail: string; // "극왕", "태왕", "왕", "중화(왕)" 등
  deukryeongGan?: string; // 득령한 천간 (지장간 중)
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
 * 버전1: 새로운 왕쇠강약 계산을 위한 유틸리티 함수들
 */

/**
 * 오행 생극 관계 확인
 */
const OHAENG_SUPPORT: Record<string, string[]> = {
  木: ["木", "水"], // 목은 목과 수(수생목)의 도움을 받음
  火: ["火", "木"], // 화는 화와 목(목생화)의 도움을 받음
  土: ["土", "火"], // 토는 토와 화(화생토)의 도움을 받음
  金: ["金", "土"], // 금은 금과 토(토생금)의 도움을 받음
  水: ["水", "金"], // 수는 수와 금(금생수)의 도움을 받음
};

/**
 * 일간을 도와주는 오행인지 확인
 */
function isSupportingOhaeng(
  dayGanOhaeng: string,
  targetOhaeng: string
): boolean {
  return OHAENG_SUPPORT[dayGanOhaeng]?.includes(targetOhaeng) || false;
}

/**
 * 득령 계산: 월지 지장간 중 일간과 같은 오행 찾기 (7점)
 */
function calculateDeukryeong(
  dayGan: string,
  monthJi: string
): { score: number; gan: string | null } {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];

  // 월지 지장간 확인
  const jijangganElements = JIJANGGAN_DATA[monthJi];
  if (!jijangganElements) {
    return { score: 0, gan: null };
  }

  // 지장간 중에서 일간과 같은 오행을 찾음 (초기 → 중기 → 정기 순)
  for (const element of jijangganElements) {
    const elementOhaeng = GAN_TO_OHAENG[element.gan];
    if (elementOhaeng === dayGanOhaeng) {
      return { score: 7, gan: element.gan }; // 득령 천간 반환
    }
  }

  // 없으면 오행 지원 확인 (수생목 등)
  for (const element of jijangganElements) {
    const elementOhaeng = GAN_TO_OHAENG[element.gan];
    if (isSupportingOhaeng(dayGanOhaeng, elementOhaeng)) {
      return { score: 7, gan: element.gan }; // 생해주는 천간 반환
    }
  }

  return { score: 0, gan: null };
}

/**
 * 득지 계산: 일지가 일간을 도와주는 오행인지 확인 (4점)
 */
function calculateDeukji(dayGan: string, dayJi: string): number {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];
  const dayJiOhaeng = JI_TO_OHAENG[dayJi];

  return isSupportingOhaeng(dayGanOhaeng, dayJiOhaeng) ? 4 : 0;
}

/**
 * 통근 계산: 각 지지의 지장간에 일간과 같은 오행이 있는지 확인
 * 일지/월지: 3점, 시지: 3점, 년지: 2점
 */
function calculateTonggeun(
  dayGan: string,
  pillars: { year: string; month: string; day: string; hour: string }
): number {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];
  let totalScore = 0;

  const jiPositions = [
    { ji: pillars.year[1], score: 2, name: "년지" }, // 년지: 2점
    { ji: pillars.month[1], score: 3, name: "월지" }, // 월지: 3점
    { ji: pillars.day[1], score: 3, name: "일지" }, // 일지: 3점
    { ji: pillars.hour[1], score: 3, name: "시지" }, // 시지: 3점
  ];

  for (const position of jiPositions) {
    const jijangganElements = JIJANGGAN_DATA[position.ji];
    if (jijangganElements) {
      // 지장간에 일간과 같은 오행이 있는지 확인
      const hasRootGan = jijangganElements.some((element) => {
        const elementOhaeng = GAN_TO_OHAENG[element.gan];
        return elementOhaeng === dayGanOhaeng;
      });

      if (hasRootGan) {
        totalScore += position.score;
      }
    }
  }

  return totalScore;
}

/**
 * 득세 계산: 나머지 글자들 (천간 2점, 지지 3점)
 * 천간: 년간, 월간, 시간 중 일간 도움 오행
 * 지지: 년지, 시지만 (월지/일지는 득령/득지에서 처리됨)
 */
function calculateDeukse(
  dayGan: string,
  pillars: { year: string; month: string; day: string; hour: string }
): number {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];
  let totalScore = 0;

  // 천간 체크 (년간, 월간, 시간) - 각 2점
  const ganPositions = [
    pillars.year[0], // 년간
    pillars.month[0], // 월간
    pillars.hour[0], // 시간 (일간은 제외)
  ];

  for (const gan of ganPositions) {
    const ganOhaeng = GAN_TO_OHAENG[gan];
    if (isSupportingOhaeng(dayGanOhaeng, ganOhaeng)) {
      totalScore += 2;
    }
  }

  // 지지 체크 (년지, 시지만) - 각 3점
  const jiPositions = [
    pillars.year[1], // 년지
    pillars.hour[1], // 시지
  ];

  for (const ji of jiPositions) {
    const jiOhaeng = JI_TO_OHAENG[ji];
    if (isSupportingOhaeng(dayGanOhaeng, jiOhaeng)) {
      totalScore += 3;
    }
  }

  return totalScore;
}

/**
 * 간여지동 보너스 계산: 같은 기둥에서 천간과 지지가 같은 오행일 때
 * - 일간과 같은 오행 OR 일간을 도와주는 오행: +4점
 * - 이외 오행: -4점
 */
function calculateNewGanyjidongBonus(
  dayGan: string,
  pillars: { year: string; month: string; day: string; hour: string }
): number {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];
  let totalBonus = 0;

  const pillarPositions = [
    { gan: pillars.year[0], ji: pillars.year[1], name: "년주" },
    { gan: pillars.month[0], ji: pillars.month[1], name: "월주" },
    { gan: pillars.day[0], ji: pillars.day[1], name: "일주" },
    { gan: pillars.hour[0], ji: pillars.hour[1], name: "시주" },
  ];

  for (const pillar of pillarPositions) {
    const ganOhaeng = GAN_TO_OHAENG[pillar.gan];
    const jiOhaeng = JI_TO_OHAENG[pillar.ji];

    // 간여지동 확인: 천간과 지지가 같은 오행인가?
    if (ganOhaeng === jiOhaeng) {
      // 일간과 같은 오행이거나 일간을 도와주는 오행인지 확인
      const isSupporting = isSupportingOhaeng(dayGanOhaeng, ganOhaeng);

      if (isSupporting) {
        totalBonus += 4; // 도움이 되는 간여지동: +4점
      } else {
        totalBonus -= 4; // 도움이 안 되는 간여지동: -4점
      }
    }
  }

  return totalBonus;
}

/**
 * 지지합 보너스 계산: 지지끼리 합화했을 때 결과가 일간을 도와주는 오행일 때 (5점)
 * 조건: 육합, 삼합, 방합 모두 해당, 붙어있어야 함
 */
function calculateJijiHapBonus(
  dayGan: string,
  pillars: { year: string; month: string; day: string; hour: string }
): number {
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];
  let totalBonus = 0;

  const jiArray = [
    pillars.year[1],
    pillars.month[1],
    pillars.day[1],
    pillars.hour[1],
  ];

  // 육합 체크 (붙어있는 지지끼리)
  for (let i = 0; i < jiArray.length - 1; i++) {
    const ji1 = jiArray[i];
    const ji2 = jiArray[i + 1];

    // 육합 확인
    const yukhap = YUKHAPHWA[ji1];
    if (yukhap && yukhap.partner === ji2) {
      const resultOhaeng = yukhap.result;
      if (isSupportingOhaeng(dayGanOhaeng, resultOhaeng)) {
        totalBonus += 5;
      }
    }
  }

  // 삼합 체크 (3개가 연속으로 붙어있을 때)
  for (let i = 0; i < jiArray.length - 2; i++) {
    const ji1 = jiArray[i];
    const ji2 = jiArray[i + 1];
    const ji3 = jiArray[i + 2];

    // 삼합 확인
    const samhap = SAMHAPHWA[ji1];
    if (
      samhap &&
      samhap.partners.includes(ji2) &&
      samhap.partners.includes(ji3)
    ) {
      const resultOhaeng = samhap.result;
      if (isSupportingOhaeng(dayGanOhaeng, resultOhaeng)) {
        totalBonus += 5;
      }
    }
  }

  // 방합 체크 (3개가 연속으로 붙어있을 때)
  for (let i = 0; i < jiArray.length - 2; i++) {
    const ji1 = jiArray[i];
    const ji2 = jiArray[i + 1];
    const ji3 = jiArray[i + 2];

    // 방합 확인
    const banghap = BANGHAPHWA[ji1];
    if (
      banghap &&
      banghap.partners.includes(ji2) &&
      banghap.partners.includes(ji3)
    ) {
      const resultOhaeng = banghap.result;
      if (isSupportingOhaeng(dayGanOhaeng, resultOhaeng)) {
        totalBonus += 5;
      }
    }
  }

  return totalBonus;
}

/**
 * 충/형/해/파 관계 데이터
 */
const CHUNG_RELATIONS = [
  ["자", "오"],
  ["축", "미"],
  ["인", "신"],
  ["묘", "유"],
  ["진", "술"],
  ["사", "해"],
];

const HYEONG_RELATIONS = [
  ["자", "묘"],
  ["묘", "자"], // 자묘형
  ["축", "술"],
  ["술", "축"], // 축술형
  ["인", "사"],
  ["사", "신"],
  ["신", "인"], // 인사신 삼형
  ["진", "진"],
  ["오", "오"],
  ["유", "유"],
  ["해", "해"], // 자형
];

const HAE_RELATIONS = [
  ["자", "미"],
  ["미", "자"], // 자미해
  ["축", "오"],
  ["오", "축"], // 축오해
  ["인", "사"],
  ["사", "인"], // 인사해
  ["묘", "진"],
  ["진", "묘"], // 묘진해
  ["술", "해"],
  ["해", "술"], // 술해해
  ["유", "신"],
  ["신", "유"], // 유신해
];

const PA_RELATIONS = [
  ["자", "유"],
  ["유", "자"], // 자유파
  ["오", "묘"],
  ["묘", "오"], // 오묘파
  ["축", "진"],
  ["진", "축"], // 축진파
  ["미", "술"],
  ["술", "미"], // 미술파
];

/**
 * 지지 충/형/해/파 삭감 계산 (50% 삭감)
 */
function calculateJijiReductionPenalty(pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): string[] {
  const jiArray = [
    pillars.year[1],
    pillars.month[1],
    pillars.day[1],
    pillars.hour[1],
  ];
  const affectedJi: string[] = [];

  // 충 관계 확인
  for (const [ji1, ji2] of CHUNG_RELATIONS) {
    if (jiArray.includes(ji1) && jiArray.includes(ji2)) {
      if (!affectedJi.includes(ji1)) affectedJi.push(ji1);
      if (!affectedJi.includes(ji2)) affectedJi.push(ji2);
    }
  }

  // 형 관계 확인
  for (const [ji1, ji2] of HYEONG_RELATIONS) {
    if (jiArray.includes(ji1) && jiArray.includes(ji2)) {
      if (!affectedJi.includes(ji1)) affectedJi.push(ji1);
      if (!affectedJi.includes(ji2)) affectedJi.push(ji2);
    }
  }

  // 해 관계 확인
  for (const [ji1, ji2] of HAE_RELATIONS) {
    if (jiArray.includes(ji1) && jiArray.includes(ji2)) {
      if (!affectedJi.includes(ji1)) affectedJi.push(ji1);
      if (!affectedJi.includes(ji2)) affectedJi.push(ji2);
    }
  }

  // 파 관계 확인
  for (const [ji1, ji2] of PA_RELATIONS) {
    if (jiArray.includes(ji1) && jiArray.includes(ji2)) {
      if (!affectedJi.includes(ji1)) affectedJi.push(ji1);
      if (!affectedJi.includes(ji2)) affectedJi.push(ji2);
    }
  }

  return affectedJi;
}

/**
 * 천간합 삭감 계산 (50% 삭감)
 */
function calculateCheonganHapPenalty(pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): string[] {
  const ganArray = [
    pillars.year[0],
    pillars.month[0],
    pillars.day[0],
    pillars.hour[0],
  ];
  const affectedGan: string[] = [];

  // 천간합 관계 확인
  for (const gan of ganArray) {
    const hapPartner = CHEONGANHAPHWA[gan];
    if (hapPartner && ganArray.includes(hapPartner.partner)) {
      if (!affectedGan.includes(gan)) affectedGan.push(gan);
      if (!affectedGan.includes(hapPartner.partner))
        affectedGan.push(hapPartner.partner);
    }
  }

  return affectedGan;
}

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
 * 8단계 레벨 분류 - 주석처리 (새 테이블로 교체 예정)
 * 삭제 금지: 사용자 승인 필요
 */
/*
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
*/

/**
 * 버전1: 신강신약 7단계 레벨 분류 (자평진전 기반)
 * 양간/음간 구분 없이 통합된 신강신약 체계
 */
function classifyNewWangseLevel(score: number): {
  level: string;
  levelDetail: string;
} {
  if (score < 0) {
    return { level: "극약", levelDetail: "극약" };
  } else if (score >= 0 && score < 7) {
    return { level: "태약", levelDetail: "태약" };
  } else if (score >= 7 && score < 14) {
    return { level: "신약", levelDetail: "신약" };
  } else if (score >= 14 && score < 21) {
    return { level: "중화", levelDetail: "중화" };
  } else if (score >= 21 && score < 28) {
    return { level: "신강", levelDetail: "신강" };
  } else if (score >= 28 && score <= 35) {
    return { level: "태강", levelDetail: "태강" };
  } else {
    return { level: "극왕", levelDetail: "극왕" };
  }
}

/**
 * 버전1: 새로운 신강신약 계산 함수
 */
export function calculateNewWangseStrength(
  pillars: { year: string; month: string; day: string; hour: string },
  dayGan: string
): WangseResult {
  // 0. 양간/음간 판별 (UI 호환성을 위해 유지)
  const isYanggan = YANGGAN_LIST.includes(dayGan);
  const ganType: "양간" | "음간" = isYanggan ? "양간" : "음간";

  console.log("🔍 [왕쇠강약] pillars:", pillars);
  console.log("🔍 [왕쇠강약] dayGan:", dayGan);

  // 1. 기본 가중치 4대 요소 계산
  const deukryeongResult = calculateDeukryeong(dayGan, pillars.month[1]); // 득령 7점
  const deukryeong = deukryeongResult.score;
  const deukryeongGan = deukryeongResult.gan; // 득령 천간 저장
  const deukji = calculateDeukji(dayGan, pillars.day[1]); // 득지 4점
  const tonggeun = calculateTonggeun(dayGan, pillars); // 통근 2-3점
  const deukse = calculateDeukse(dayGan, pillars); // 득세 1-2점

  console.log(
    "🔍 [왕쇠강약] 득령:",
    deukryeong,
    "득지:",
    deukji,
    "통근:",
    tonggeun,
    "득세:",
    deukse
  );

  // 2. 보너스 계산
  const ganyjidongBonus = calculateNewGanyjidongBonus(dayGan, pillars); // 간여지동 ±4점
  const jijiHapBonus = calculateJijiHapBonus(dayGan, pillars); // 지지합 5점

  // 3. 삭감 대상 확인
  const affectedJi = calculateJijiReductionPenalty(pillars); // 충형해파 50% 삭감
  const affectedGan = calculateCheonganHapPenalty(pillars); // 천간합 50% 삭감

  // 4. 기본 점수 합산
  const baseScore = deukryeong + deukji + tonggeun + deukse;

  // 5. 보너스 합산 (삭감 적용 전)
  const totalBonus = ganyjidongBonus + jijiHapBonus;

  // 6. 삭감 적용 (득령 25%, 득지 50%)
  // 지지 삭감: 득령, 득지, 통근, 득세 중 해당 지지 점수
  let jiReduction = 0;
  if (affectedJi.includes(pillars.month[1])) jiReduction += deukryeong * 0.25; // 득령 삭감 25%
  if (affectedJi.includes(pillars.day[1])) jiReduction += deukji * 0.5; // 득지 삭감 50%
  // 통근, 득세 지지 부분도 삭감 (복잡하므로 간소화)

  // 천간 삭감: 득세 천간 부분, 간여지동 천간 부분
  let ganReduction = 0;
  // 간소화: 천간합이 있으면 전체 보너스의 일부 삭감
  if (affectedGan.length > 0) {
    ganReduction = totalBonus * 0.2; // 간소화된 삭감
  }

  // 7. 최종 점수 계산
  const finalScore = Math.max(
    0,
    baseScore + totalBonus - jiReduction - ganReduction
  );

  // 8. 레벨 분류
  const { level, levelDetail } = classifyNewWangseLevel(finalScore);

  // 9. 결과 반환 (기존 인터페이스 호환성 유지)
  return {
    ganType, // 실제 양간/음간 구분
    rawScore: baseScore + totalBonus, // 삭감 전 점수
    finalScore,
    level,
    levelDetail,
    deukryeongGan: deukryeongGan || undefined, // 득령 천간
    breakdown: {
      pillarScores: [], // 간소화
      bonuses: totalBonus,
      penalties: jiReduction + ganReduction,
      weightedTotal: baseScore,
      baseScore: baseScore,
      ganyjidongBonus: ganyjidongBonus,
    },
    analysis: `신강신약 ${levelDetail} (${finalScore.toFixed(1)}점)`,
  };
}

/**
 * 왕쇠강약 메인 계산 함수 (기존 버전 - 호환성 유지)
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

  // 11. 레벨 분류 - 새로운 신강신약 체계 적용
  const { level, levelDetail } = classifyNewWangseLevel(finalScore);

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
