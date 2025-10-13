// server/src/services/gyeokguk.service.ts
// 격국 판단 로직

import { JIJANGGAN_DATA } from "../data/jijanggan";
import {
  GYEOKGUK_DATA,
  SIPSIN_TO_GYEOKGUK,
  GyeokgukType,
} from "../data/gyeokguk.data";
import { GAN_OHENG } from "../data/saju.data";
import { SAMHAP } from "../data/relationship.data";
import { getSeasonalDataForYear } from "./seasonal-data.loader";
import { SajuData } from "../types/saju.d";

/**
 * 격국 분석 결과
 */
export interface GyeokgukAnalysis {
  gyeokguk: GyeokgukType | null; // 확정된 격국
  monthJiSipsin: string; // 월지 십성
  saRyeongGan: string | null; // 사령 천간 (격국을 이루는 지장간 천간)
  isSuccess: boolean; // 성격 여부
  breakFactors: string[]; // 파격 요인들
  yongsinType: string; // 용신 유형 ("印", "財", "官" 등)
  confidence: number; // 신뢰도 (0-100)
  reason: string; // 판단 근거
}

/**
 * 월지 유형 분류 (한자 기준)
 */
const WANGJI = ["子", "午", "卯", "酉"]; // 왕지 (旺地)
const SAENGJI = ["寅", "申", "巳", "亥"]; // 생지 (生地)
const GOJI = ["辰", "戌", "丑", "未"]; // 고지 (庫地)

/**
 * 투출/투간 확인 함수
 */
function checkTouchul(
  monthJi: string,
  pillars: {
    year: { gan: string; ji: string };
    month: { gan: string; ji: string };
    day: { gan: string; ji: string };
    hour: { gan: string; ji: string };
  }
): {
  touchul: { role: string; gan: string; ohaeng: string }[]; // 투출 (오행 같음)
  tougan: { role: string; gan: string }[]; // 투간 (천간 같음)
} {
  const jijangganElements = JIJANGGAN_DATA[monthJi] || [];
  // ⚠️ 일간(day.gan)은 제외! 년간, 월간, 시간만 확인
  const allGans = [
    pillars.year.gan,
    pillars.month.gan,
    // pillars.day.gan, // 일간 제외!
    pillars.hour.gan,
  ];

  const touchul: { role: string; gan: string; ohaeng: string }[] = [];
  const tougan: { role: string; gan: string }[] = [];

  for (const element of jijangganElements) {
    const elementOhaeng = GAN_OHENG[element.gan as keyof typeof GAN_OHENG];

    // 투간 확인 (같은 천간)
    if (allGans.includes(element.gan)) {
      tougan.push({
        role: element.role,
        gan: element.gan,
      });
    }

    // 투출 확인 (같은 오행)
    for (const gan of allGans) {
      const ganOhaeng = GAN_OHENG[gan as keyof typeof GAN_OHENG];
      if (
        ganOhaeng === elementOhaeng &&
        !tougan.some((t) => t.gan === element.gan)
      ) {
        touchul.push({
          role: element.role,
          gan: element.gan,
          ohaeng: elementOhaeng,
        });
        break;
      }
    }
  }

  return { touchul, tougan };
}

/**
 * 삼합/반합 확인 함수 (기존 SAMHAP 데이터 활용)
 */
function checkSamhap(
  monthJi: string,
  pillars: {
    year: { gan: string; ji: string };
    month: { gan: string; ji: string };
    day: { gan: string; ji: string };
    hour: { gan: string; ji: string };
  }
): boolean {
  const allJis = [
    pillars.year.ji,
    pillars.month.ji,
    pillars.day.ji,
    pillars.hour.ji,
  ];

  // SAMHAP 데이터를 활용하여 삼합/반합 확인
  const samhapPartners = SAMHAP[monthJi];
  if (!samhapPartners) return false;

  // 완전 삼합 (3개 모두 있음) 확인
  const hasFullSamhap = samhapPartners.every((ji) => allJis.includes(ji));
  if (hasFullSamhap) return true;

  // 반합 (2개 있음) 확인 - 월지 + 파트너 중 하나
  const hasHalfSamhap = samhapPartners.some((ji) => allJis.includes(ji));
  return hasHalfSamhap;
}

/**
 * 오행 생극 관계 확인 (도움 오행)
 */
const OHAENG_SUPPORT_MAP: Record<string, string[]> = {
  木: ["木", "水"], // 목은 목과 수(수생목)의 도움을 받음
  火: ["火", "木"], // 화는 화와 목(목생화)의 도움을 받음
  土: ["土", "火"], // 토는 토와 화(화생토)의 도움을 받음
  金: ["金", "土"], // 금은 금과 토(토생금)의 도움을 받음
  水: ["水", "金"], // 수는 수와 금(금생수)의 도움을 받음
};

/**
 * 세력 비교 함수 (지장간 오행과 같은 오행 및 도움 오행 개수로 판단)
 */
function compareStrength(
  element1: { role: string; gan: string },
  element2: { role: string; gan: string },
  pillars: {
    year: { gan: string; ji: string };
    month: { gan: string; ji: string };
    day: { gan: string; ji: string };
    hour: { gan: string; ji: string };
  }
): { role: string; gan: string } {
  const allGans = [
    pillars.year.gan,
    pillars.month.gan,
    pillars.day.gan,
    pillars.hour.gan,
  ];

  // 각 지장간 오행의 세력 계산
  const element1Ohaeng = GAN_OHENG[element1.gan as keyof typeof GAN_OHENG];
  const element2Ohaeng = GAN_OHENG[element2.gan as keyof typeof GAN_OHENG];

  const supportOhaengs1 = OHAENG_SUPPORT_MAP[element1Ohaeng] || [];
  const supportOhaengs2 = OHAENG_SUPPORT_MAP[element2Ohaeng] || [];

  // 원국에서 도움 오행 개수 계산
  let strength1 = 0;
  let strength2 = 0;

  for (const gan of allGans) {
    const ganOhaeng = GAN_OHENG[gan as keyof typeof GAN_OHENG];
    if (supportOhaengs1.includes(ganOhaeng)) strength1++;
    if (supportOhaengs2.includes(ganOhaeng)) strength2++;
  }

  // 세력이 같으면 정기 우선
  if (strength1 === strength2) {
    return element1.role === "정기" ? element1 : element2;
  }

  return strength1 > strength2 ? element1 : element2;
}

/**
 * 절기 기준 여기/정기 판단 함수
 */
async function getJijangganByDate(
  monthJi: string,
  birthDate: Date
): Promise<{ role: string; gan: string } | null> {
  try {
    const year = birthDate.getFullYear();
    const seasonalData = await getSeasonalDataForYear(year);

    if (!seasonalData || !seasonalData[year]) {
      // 절기 데이터가 없으면 정기 기본 반환
      const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
        (e) => e.role === "정기"
      );
      return jeongiElement ? { role: "정기", gan: jeongiElement.gan } : null;
    }

    const seasons = seasonalData[year];

    // 월별 절기 찾기 (간소화된 로직)
    let currentSeasonIndex = -1;
    for (let i = 0; i < seasons.length; i++) {
      if (seasons[i].date <= birthDate) {
        currentSeasonIndex = i;
      } else {
        break;
      }
    }

    if (currentSeasonIndex === -1) {
      // 절기를 찾을 수 없으면 정기 기본 반환
      const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
        (e) => e.role === "정기"
      );
      return jeongiElement ? { role: "정기", gan: jeongiElement.gan } : null;
    }

    // 절기 시작일로부터 경과 일수 계산
    const seasonStart = seasons[currentSeasonIndex].date;
    const daysDiff = Math.floor(
      (birthDate.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 여기 12일, 정기 18일 기준 (총 30일 기준)
    if (daysDiff <= 12) {
      // 여기 (초기)
      const yeogiElement = JIJANGGAN_DATA[monthJi]?.find(
        (e) => e.role === "초기"
      );
      return yeogiElement ? { role: "초기", gan: yeogiElement.gan } : null;
    } else {
      // 정기 (본기)
      const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
        (e) => e.role === "정기"
      );
      return jeongiElement ? { role: "정기", gan: jeongiElement.gan } : null;
    }
  } catch {
    // 오류 발생 시 정기 기본 반환
    const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
      (e) => e.role === "정기"
    );
    return jeongiElement ? { role: "정기", gan: jeongiElement.gan } : null;
  }
}

/**
 * 격국 판단 메인 함수
 */
export async function analyzeGyeokguk(
  sajuData: SajuData,
  birthDate?: Date // 생년월일 추가 (선택적)
): Promise<GyeokgukAnalysis> {
  const monthJi = sajuData.pillars.month.ji;

  // ✅ sipsin.month.ji는 string | null 타입 (예: "정인", "편재")
  const monthJiSipsin = sajuData.sipsin?.month?.ji || "";

  // 🔍 디버깅: 월지 십성 확인
  console.log("🔍 격국 분석 디버깅:");
  console.log("  - 월지:", monthJi);
  console.log("  - 월지 십성:", monthJiSipsin);
  console.log("  - sipsin.month:", sajuData.sipsin?.month);
  console.log("  - sipsin.month.ji:", sajuData.sipsin?.month?.ji);

  // 월지 십성으로 기본 격국 후보 찾기
  const gyeokgukCodes = SIPSIN_TO_GYEOKGUK[monthJiSipsin];
  if (!gyeokgukCodes || gyeokgukCodes.length === 0) {
    return {
      gyeokguk: null,
      monthJiSipsin,
      saRyeongGan: null,
      isSuccess: false,
      breakFactors: [],
      yongsinType: "",
      confidence: 0,
      reason: `월지 십성 '${monthJiSipsin}'에 해당하는 격국이 없습니다.`,
    };
  }

  const gyeokguk =
    GYEOKGUK_DATA[gyeokgukCodes[0] as keyof typeof GYEOKGUK_DATA];
  if (!gyeokguk) {
    return {
      gyeokguk: null,
      monthJiSipsin,
      saRyeongGan: null,
      isSuccess: false,
      breakFactors: [],
      yongsinType: "",
      confidence: 0,
      reason: `격국 코드 '${gyeokgukCodes[0]}'에 해당하는 격국 정의를 찾을 수 없습니다.`,
    };
  }

  const { touchul, tougan } = checkTouchul(monthJi, sajuData.pillars);

  let selectedElement: { role: string; gan: string } | null = null;
  let reason = "";

  // 월지 유형별 판단
  if (WANGJI.includes(monthJi)) {
    // 왕지: 투출/투간 없어도 정기를 격으로 잡음
    const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
      (e) => e.role === "정기"
    );
    if (jeongiElement) {
      selectedElement = { role: "정기", gan: jeongiElement.gan };
      reason = `왕지(${monthJi}) - 정기(${jeongiElement.gan}) 자동 채택`;
    }
  } else if (SAENGJI.includes(monthJi)) {
    // 생지: 투출/투간 조건에 따라 판단
    const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
      (e) => e.role === "정기"
    );
    const jeongiTouchul = touchul.find((t) => t.role === "정기");
    const jeongiTougan = tougan.find((t) => t.role === "정기");

    if (jeongiTouchul || jeongiTougan) {
      // 1. 정기가 투출/투간 → 정기 채택
      selectedElement = { role: "정기", gan: jeongiElement?.gan || "" };
      reason = `생지(${monthJi}) - 정기 투출/투간`;
    } else {
      // 2. 여기/중기가 투출/투간 → 세력 비교 (TODO: 구현 필요)
      const otherTouchul = touchul.filter((t) => t.role !== "정기");
      const otherTougan = tougan.filter((t) => t.role !== "정기");

      if (otherTouchul.length > 0 || otherTougan.length > 0) {
        // 여기/중기 중 세력이 강한 것 선택
        const candidates = [...otherTouchul, ...otherTougan];
        let strongestElement = candidates[0];

        for (let i = 1; i < candidates.length; i++) {
          strongestElement = compareStrength(
            strongestElement,
            candidates[i],
            sajuData.pillars
          );
        }

        selectedElement = {
          role: strongestElement.role,
          gan: strongestElement.gan,
        };
        reason = `생지(${monthJi}) - ${strongestElement.role}(${strongestElement.gan}) 세력 우세로 채택`;
      } else {
        // 3. 모두 투출/투간 안함 → 정기 채택
        selectedElement = { role: "정기", gan: jeongiElement?.gan || "" };
        reason = `생지(${monthJi}) - 투출/투간 없음, 정기 기본 채택`;
      }
    }
  } else if (GOJI.includes(monthJi)) {
    // 고지: 삼합 여부에 따라 판단
    const hasSamhap = checkSamhap(monthJi, sajuData.pillars);

    if (hasSamhap) {
      // 1. 삼합 있음 → 중기 채택
      const jungiElement = JIJANGGAN_DATA[monthJi]?.find(
        (e) => e.role === "중기"
      );
      if (jungiElement) {
        selectedElement = { role: "중기", gan: jungiElement.gan };
        reason = `고지(${monthJi}) - 삼합 성립, 중기(${jungiElement.gan}) 채택`;
      }
    } else {
      // 2. 삼합 없음 → 절기 기준으로 여기/정기 선택
      // birthDate가 없으면 정기를 기본으로 채택
      if (!birthDate) {
        const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
          (e) => e.role === "정기"
        );
        if (jeongiElement) {
          selectedElement = { role: "정기", gan: jeongiElement.gan };
          reason = `고지(${monthJi}) - 삼합 없음, 생년월일 없어 정기 기본 채택`;
        }
      } else {
        const dateBasedElement = await getJijangganByDate(monthJi, birthDate);

        if (dateBasedElement) {
          selectedElement = dateBasedElement;
          reason = `고지(${monthJi}) - 삼합 없음, 절기 기준 ${dateBasedElement.role}(${dateBasedElement.gan}) 채택`;
        } else {
          // 절기 판단 실패 시 정기 기본 채택
          const jeongiElement = JIJANGGAN_DATA[monthJi]?.find(
            (e) => e.role === "정기"
          );
          if (jeongiElement) {
            selectedElement = { role: "정기", gan: jeongiElement.gan };
            reason = `고지(${monthJi}) - 삼합 없음, 절기 판단 실패로 정기 기본 채택`;
          }
        }
      }
    }
  }

  // 성패 판단 및 용신 선정 (간단 구현)
  const isSuccess = true; // TODO: 실제 성패 판단 로직
  const yongsinType = gyeokguk.yongsin.success[0] || "";

  // 선정된 요소 정보를 reason에 추가
  if (selectedElement) {
    reason += ` (선정: ${selectedElement.role} ${selectedElement.gan})`;
  }

  return {
    gyeokguk,
    monthJiSipsin,
    saRyeongGan: selectedElement?.gan || null, // 사령 천간 (격국 기준 천간)
    isSuccess,
    breakFactors: [],
    yongsinType,
    confidence: 70, // 임시값
    reason,
  };
}
