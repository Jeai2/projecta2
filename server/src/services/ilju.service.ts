// server/src/services/ilju.service.ts
// 일주론 서비스

import { getIljuData } from "../data/ilju.data";
import { getSajuDetails } from "./saju.service";

/**
 * 일주론 데이터를 가져옵니다
 * @param birthDate 생년월일
 * @param gender 성별
 * @param calendarType 양음력
 * @returns 일주론 데이터
 */
export async function getIljuAnalysis(
  birthDate: Date,
  gender: "M" | "W",
  calendarType: "solar" | "lunar"
) {
  // 사주 데이터 가져오기 (일간, 일지 추출용)
  const sajuResult = await getSajuDetails(birthDate, gender);

  const dayGan = sajuResult.sajuData.pillars.day.gan;
  const dayJi = sajuResult.sajuData.pillars.day.ji;
  const dayGanji = `${dayGan}${dayJi}`;

  // 일주론 데이터 가져오기
  const raw = getIljuData(dayGan, dayJi);

  if (!raw) {
    throw new Error(`일주론 데이터를 찾을 수 없습니다: ${dayGanji}`);
  }

  // personality+tendency(legacy) → characteristic 통합
  const characteristic =
    raw.characteristic ||
    (raw.personality && raw.tendency
      ? `${raw.personality} ${raw.tendency}`
      : raw.personality || raw.tendency || "");

  const iljuData = {
    name: raw.name,
    characteristic,
    career: raw.career,
    spouse: raw.spouse,
    wealth: raw.wealth,
    health: raw.health,
  };

  return {
    iljuData,
    dayGan,
    dayJi,
    dayGanji,
  };
}
