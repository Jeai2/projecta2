// server/src/services/jinsin.service.ts
// 진신 계산 로직

// JinsinResult 타입 정의
interface JinsinResult {
  jinsin: string;
  jinsinType: string;
  strength: number;
  reason: string;
  supportingFactors: string[];
  conflictingFactors: string[];
  confidence: number;
}

interface JinsinCalculationOptions {
  debugMode?: boolean;
  birthDate?: Date;
}

import { analyzeSaryeong } from "./saryeong.service";
import { GAN_OHENG, JI_OHENG } from "../data/saju.data";

/**
 * 한글 천간을 한자 천간으로 변환
 */
const HANGUL_TO_HANJA: Record<string, string> = {
  갑: "甲",
  을: "乙",
  병: "丙",
  정: "丁",
  무: "戊",
  기: "己",
  경: "庚",
  신: "辛",
  임: "壬",
  계: "癸",
};

/**
 * 양간 정의 (갑, 병, 무, 경, 임)
 */
const YANGGAN = ["甲", "丙", "戊", "庚", "壬"];

/**
 * 생극 관계
 */
const SAENGKEUK_RELATIONS = {
  // 생(生) 관계: 첫 번째 오행이 두 번째 오행을 생함
  saeng: {
    木: "火", // 목생화
    火: "土", // 화생토
    土: "金", // 토생금
    金: "水", // 금생수
    水: "木", // 수생목
  },
  // 극(剋) 관계: 첫 번째 오행이 두 번째 오행을 극함
  keuk: {
    木: "土", // 목극토
    火: "金", // 화극금
    土: "水", // 토극수
    金: "木", // 금극목
    水: "火", // 수극화
  },
};

/**
 * 득령 판단 함수
 * 일간 기준으로 월지가 비겁(같은 오행) 또는 인성(생관계)에 해당하면 득령
 */
function isDeukryeong(dayGanOhaeng: string, monthJiOhaeng: string): boolean {
  // 비겁: 같은 오행
  if (dayGanOhaeng === monthJiOhaeng) {
    return true;
  }
  // 인성: 월지가 일간을 생함
  if (
    SAENGKEUK_RELATIONS.saeng[
      monthJiOhaeng as keyof typeof SAENGKEUK_RELATIONS.saeng
    ] === dayGanOhaeng
  ) {
    return true;
  }
  return false;
}

/**
 * 진신/가신 판별 함수
 */
function determineJinsinGasin(
  pillars: { year: string; month: string; day: string; hour: string },
  monthBranch: string,
  yongsinHanja: string,
  isDeukryeongResult: boolean
): { jinsin: string | null; gasin: string[] } {
  let jinsin: string | null = null;
  const gasin: string[] = [];

  // 사주원국 천간 배열
  const allGans = [
    pillars.year[0],
    pillars.month[0],
    pillars.day[0],
    pillars.hour[0],
  ];

  // 1. 득령 확인
  if (!isDeukryeongResult) {
    // 득령이 아니면 진신/가신 없음
    return { jinsin: null, gasin: [] };
  }

  // 2. 용신(사령 천간)이 사주원국에 있는지 확인
  const yongsinInPillars = allGans.includes(yongsinHanja);
  if (!yongsinInPillars) {
    // 용신이 사주원국에 없으면 진신/가신 없음
    return { jinsin: null, gasin: [] };
  }

  // 3. 진신 = 용신(사령 천간)
  jinsin = yongsinHanja;

  // 4. 가신 판별: 진신을 극하는 오행의 양간만 선택
  const jinsinOhaeng = GAN_OHENG[jinsin];
  const keukOhaeng =
    SAENGKEUK_RELATIONS.keuk[
      jinsinOhaeng as keyof typeof SAENGKEUK_RELATIONS.keuk
    ];

  // 사주원국에서 진신을 극하는 오행의 양간만 가신으로 선택
  const dayGan = pillars.day[0];
  for (const gan of allGans) {
    if (gan !== jinsin && gan !== dayGan) {
      const ganOhaeng = GAN_OHENG[gan];
      // 양간이면서 진신을 극하는 오행
      if (YANGGAN.includes(gan) && ganOhaeng === keukOhaeng) {
        gasin.push(gan);
      }
    }
  }

  return { jinsin, gasin };
}

/**
 * 진신 계산 메인 함수
 */
export function calculateJinsin(
  pillars: { year: string; month: string; day: string; hour: string },
  options: JinsinCalculationOptions = {}
): JinsinResult {
  const dayGan = pillars.day[0]; // 일간 (한자)
  const monthBranch = pillars.month[1]; // 월지 (한자)
  const dayGanOhaeng = GAN_OHENG[dayGan]; // 일간 오행
  const monthJiOhaeng = JI_OHENG[monthBranch]; // 월지 오행

  if (options.debugMode) {
    console.log("🔍 [진신] 일간:", dayGan, "오행:", dayGanOhaeng);
    console.log("🔍 [진신] 월지:", monthBranch, "오행:", monthJiOhaeng);
    console.log("🔍 [진신] 사주:", pillars);
  }

  // 1. 용신 = 사령 천간
  if (!options.birthDate) {
    throw new Error("진신 계산을 위해서는 생년월일시(birthDate)가 필요합니다.");
  }

  // analyzeSaryeong은 한자 지지를 받아서 사령 천간을 한글로 반환
  const saryeongResult = analyzeSaryeong(options.birthDate, monthBranch);
  const yongsinHangul = saryeongResult.saryeongGan; // 사령 천간 (한글)
  const yongsinHanja = HANGUL_TO_HANJA[yongsinHangul] || yongsinHangul; // 한자로 변환

  if (options.debugMode) {
    console.log(
      "🔍 [진신] 사령 천간 (용신):",
      yongsinHangul,
      "→",
      yongsinHanja
    );
  }

  // 2. 득령 판단
  const isDeukryeongResult = isDeukryeong(dayGanOhaeng, monthJiOhaeng);

  if (options.debugMode) {
    console.log("🔍 [진신] 득령:", isDeukryeongResult);
  }

  // 3. 진신/가신 판별
  const { jinsin, gasin } = determineJinsinGasin(
    pillars,
    monthBranch,
    yongsinHanja,
    isDeukryeongResult
  );

  if (options.debugMode) {
    console.log("🔍 [진신] 진신:", jinsin, "가신:", gasin);
  }

  // 4. 결과 반환
  const finalJinsin = jinsin || "미판별";
  const jinsinStrength = jinsin ? 85 : 0;
  const confidence = jinsin ? 80 : 20;

  return {
    jinsin: finalJinsin,
    jinsinType: finalJinsin,
    strength: jinsinStrength,
    reason: `용신: ${yongsinHanja}, 진신: ${jinsin || "없음"}${
      gasin.length > 0 ? `, 가신: ${gasin.join(", ")}` : ""
    }`,
    supportingFactors: jinsin
      ? [`${jinsin}이 사령으로 진신 조건 만족`]
      : ["진신 조건에 맞는 천간이 없음"],
    conflictingFactors: gasin,
    confidence,
  };
}
