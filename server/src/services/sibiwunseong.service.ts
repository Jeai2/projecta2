// src/services/sibiwunseong.service.ts
// jjhome 만세력 엔진 - 십이운성 계산 서비스
// 사주의 각 지지가 일간을 기준으로 어떤 에너지 단계에 있는지를 계산한다.

import { SIBIWUNSEONG_TABLE } from '../data/saju.data';

/**
 * 사주팔자 각 기둥의 십이운성을 계산한다.
 * @param dayGan 일간 (기준점)
 * @param pillars 사주팔자 객체
 * @returns 각 기둥별 지지의 십이운성
 */
export const getSibiwunseong = (dayGan: string, pillars: { year: string, month: string, day: string, hour: string }) => {
  // 지지(한글자)를 받아 십이운성을 찾아 반환하는 내부 함수
  const calc = (ji: string): string => {
    // 지지 글자가 없거나 유효하지 않으면 빈 문자열 반환
    if (!ji) return '';
    // SIBIWUNSEONG_TABLE에서 일간과 지지를 키로 값을 찾음
    return SIBIWUNSEONG_TABLE[dayGan]?.[ji] || '';
  };

  return {
    year:  calc(pillars.year[1]),
    month: calc(pillars.month[1]),
    day:   calc(pillars.day[1]),
    hour:  calc(pillars.hour[1]),
  };
};
