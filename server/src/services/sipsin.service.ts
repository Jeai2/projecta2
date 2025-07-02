// [수석 설계자 노트]
// jjhome 만세력 엔진 (Sipsin Service)
// 이 파일은 오직 '십성'을 계산하는 책임만 가진다.
// 데이터는 saju.data.ts 에서 가져오고, 계산된 결과만 반환한다.

import { SIPSIN_TABLE } from "../data/saju.data"; // 데이터 저장소에서 십성 조견표를 가져옴

/**
 * 사주팔자 각 기둥의 십성을 계산한다.
 * @param dayGan 일간 (기준점)
 * @param pillars 사주팔자 객체
 * @returns 각 기둥별 천간과 지지의 십성
 */
export const getSipsin = (
  dayGan: string,
  pillars: { year: string; month: string; day: string; hour: string }
) => {
  const calc = (target: string, type: "h" | "e"): string | null => {
    // target 글자가 없는 경우 null 반환
    if (!target) return null;

    // SIPSIN_TABLE에서 일간(dayGan)과 대상 글자(target)로 십성을 찾음
    // 타입 추론이 가능하도록 명시적으로 타입을 지정해줌
    const tableForType: { [key: string]: { [key: string]: string } } =
      SIPSIN_TABLE[type];
    return tableForType[dayGan]?.[target] || null;
  };

  return {
    year: { gan: calc(pillars.year[0], "h"), ji: calc(pillars.year[1], "e") },
    month: {
      gan: calc(pillars.month[0], "h"),
      ji: calc(pillars.month[1], "e"),
    },
    day: { gan: "본원", ji: calc(pillars.day[1], "e") },
    hour: { gan: calc(pillars.hour[0], "h"), ji: calc(pillars.hour[1], "e") },
  };
};
