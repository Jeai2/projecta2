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
}
import { getWangsanghyususaScore } from "../data/wangsanghyususa.data";
import { JIJANGGAN_DATA } from "../data/jijanggan";
import { calculateNewWangseStrength } from "./wangse-strength.service";

/**
 * 천간-오행 매핑
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

/**
 * 생극 관계 (파이썬 로직 기반)
 * 파이썬의 relations 구조를 TypeScript로 변환
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
 * 오행 세력 계산 함수 (파이썬 로직 기반)
 */
function calculateElementStrength(pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): Record<string, number> {
  const strength: Record<string, number> = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  } as const;

  // 1. 지지별 세력 계산 (왕상휴수사 데이터 활용)
  const jis = [
    pillars.year[1],
    pillars.month[1],
    pillars.day[1],
    pillars.hour[1],
  ];

  for (const ji of jis) {
    // 각 오행별로 왕상휴수사 점수 합산
    const ohaengs = ["木", "火", "土", "金", "水"] as const;
    for (const ohaeng of ohaengs) {
      const score = getWangsanghyususaScore(ohaeng, ji);
      strength[ohaeng] += score;
    }
  }

  // 2. 천간별 세력 추가 (0.3 가중치)
  const gans = [
    pillars.year[0],
    pillars.month[0],
    pillars.day[0],
    pillars.hour[0],
  ];

  for (const gan of gans) {
    const ohaeng = GAN_TO_OHAENG[gan] as keyof typeof strength;
    if (ohaeng && Object.prototype.hasOwnProperty.call(strength, ohaeng)) {
      strength[ohaeng] += 0.3; // 천간 투출 시 세력 추가
    }
  }

  return strength;
}

/**
 * 용신 판단 함수 (파이썬 로직 기반)
 */
function determineYongsin(
  dayGan: string,
  strength: Record<string, number>,
  isStrong: boolean
): string {
  const dayOhaeng = GAN_TO_OHAENG[dayGan];

  if (isStrong) {
    // 신강: 설기(泄氣) 우선, 약하면 극(剋)
    let yongsin =
      SAENGKEUK_RELATIONS.saeng[
        dayOhaeng as keyof typeof SAENGKEUK_RELATIONS.saeng
      ]; // 설기

    if (yongsin && strength[yongsin] < 0.5) {
      // 설기가 약하면 극 사용
      yongsin =
        SAENGKEUK_RELATIONS.keuk[
          dayOhaeng as keyof typeof SAENGKEUK_RELATIONS.keuk
        ];
    }

    return yongsin || dayOhaeng;
  } else {
    // 신약: 비견(같은 오행) 우선, 약하면 인성(생조)
    let yongsin = dayOhaeng; // 비견 (같은 오행)

    if (strength[yongsin] < 0.5) {
      // 비견이 약하면 인성(생조하는 오행) 사용
      const foundKey = Object.keys(SAENGKEUK_RELATIONS.saeng).find(
        (key) =>
          SAENGKEUK_RELATIONS.saeng[
            key as keyof typeof SAENGKEUK_RELATIONS.saeng
          ] === dayOhaeng
      );
      yongsin = foundKey || dayOhaeng;
    }

    return yongsin;
  }
}

/**
 * 진신/가신 판별 함수 (파이썬 로직 기반)
 */
function determineJinsinGasin(
  pillars: { year: string; month: string; day: string; hour: string },
  monthBranch: string,
  yongsin: string
): { jinsin: string | null; gasin: string[] } {
  let jinsin: string | null = null;
  const gasin: string[] = [];

  // 월령의 지장간에서 진신 찾기
  const jijangganData = JIJANGGAN_DATA[monthBranch];

  if (jijangganData) {
    // 본기(정기)와 중기에서 진신 찾기
    for (const element of jijangganData) {
      if (element.role === "정기" || element.role === "중기") {
        const elementOhaeng = GAN_TO_OHAENG[element.gan];

        // 용신과 일치하고 천간에 투출되면 진신
        if (elementOhaeng === yongsin) {
          const allGans = [
            pillars.year[0],
            pillars.month[0],
            pillars.day[0],
            pillars.hour[0],
          ];

          if (allGans.includes(element.gan)) {
            jinsin = element.gan;
            break;
          }
        }
      }
    }
  }

  // 나머지 천간은 가신 (일간 제외)
  const allGans = [
    pillars.year[0],
    pillars.month[0],
    pillars.day[0],
    pillars.hour[0],
  ];
  const dayGan = pillars.day[0];

  for (const gan of allGans) {
    if (gan !== jinsin && gan !== dayGan) {
      gasin.push(gan);
    }
  }

  return { jinsin, gasin };
}

/**
 * 진신 계산 메인 함수 (파이썬 로직 기반)
 */
export function calculateJinsin(
  pillars: { year: string; month: string; day: string; hour: string },
  options: JinsinCalculationOptions = {}
): JinsinResult {
  const dayGan = pillars.day[0]; // 일간
  const monthBranch = pillars.month[1]; // 월지
  const dayGanOhaeng = GAN_TO_OHAENG[dayGan];

  if (options.debugMode) {
    console.log("🔍 [진신] 일간:", dayGan, "오행:", dayGanOhaeng);
    console.log("🔍 [진신] 사주:", pillars);
  }

  // 1. 오행 세력 계산
  const strength = calculateElementStrength(pillars);

  // 2. 신강신약 판단 (기존 서비스 활용)
  const wangseResult = calculateNewWangseStrength(pillars, dayGan);
  const isStrong = wangseResult.level === "신강";

  if (options.debugMode) {
    console.log("🔍 [진신] 오행 세력:", strength);
    console.log(
      "🔍 [진신] 신강신약:",
      wangseResult.level,
      "isStrong:",
      isStrong
    );
  }

  // 3. 용신 판단
  const yongsin = determineYongsin(dayGan, strength, isStrong);

  if (options.debugMode) {
    console.log("🔍 [진신] 용신:", yongsin);
  }

  // 4. 진신/가신 판별
  const { jinsin, gasin } = determineJinsinGasin(pillars, monthBranch, yongsin);

  if (options.debugMode) {
    console.log("🔍 [진신] 진신:", jinsin, "가신:", gasin);
  }

  // 5. 결과 반환
  const finalJinsin = jinsin || "미판별";
  const jinsinStrength = jinsin ? 85 : 0;
  const confidence = jinsin ? 80 : 20;

  return {
    jinsin: finalJinsin,
    jinsinType: finalJinsin,
    strength: jinsinStrength,
    reason: `용신: ${yongsin}, 진신: ${jinsin || "없음"}`,
    supportingFactors: jinsin
      ? [`${jinsin}이 월령에서 용신으로 작용`]
      : ["진신 조건에 맞는 천간이 없음"],
    conflictingFactors: gasin,
    confidence,
  };
}
