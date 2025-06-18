// src/services/saju.engine.ts
// jjhome 만세력 엔진 v3.2 - '현재'의 운세에 집중

import { getSipsin } from './sipsin.service';
import { getSibiwunseong } from './sibiwunseong.service';
// [주석] Daewoon 타입을 import하여 대운 데이터의 구조를 명확히 합니다.
import { getDaewoon, Daewoon } from './daewoon.service';
// [주석] 새로 만든 세운 계산 서비스를 가져옵니다.
import { getSewoonForYear } from './sewoon.service';
import { getSeasonalDataForYear, getLoadedSeasonalData } from './seasonal-data.loader';
import { GAN, JI, GANJI } from '../data/saju.data';

// [주석] 다른 파일에서도 이 타입을 사용해야 할 수 있으므로, 나중에 별도의 types.ts 파일로 분리하는 것을 고려해볼 수 있습니다.
type SeasonalData = { [year: number]: { name: string; date: Date }[] };

// ---------------------------------------------------
// 1. 내부 계산 함수 (Internal Calculators)
// 모듈 외부로 노출할 필요가 없는 내부 계산용 함수들
// ---------------------------------------------------

const getYearGanjiByYear = (year: number): string => {
  const ganIndex = (year - 4) % 10;
  const jiIndex = (year - 4) % 12;
  return GAN[(ganIndex + 10) % 10] + JI[(jiIndex + 12) % 12];
};

// [주석] getMonthGanji 함수가 이제 로드된 seasonalData를 파라미터로 받아 사용합니다.
const getMonthGanji = (date: Date, yearGan: string, seasonalData: SeasonalData): string => {
    const year = date.getFullYear();
    const seasons = seasonalData[year] || seasonalData[year - 1];
    if (!seasons) return "";
    let foundingIndex = -1;
    for (let i = seasons.length - 1; i >= 0; i--) {
        if (i % 2 === 0 && date >= seasons[i].date) {
            foundingIndex = i;
            break;
        }
    }
    const DONGJI_INDEX = seasons.length > 0 ? seasons.length - 2 : -1;
    if (foundingIndex === -1 && DONGJI_INDEX !== -1) {
        foundingIndex = DONGJI_INDEX;
    }

  const monthJiIndex = (Math.floor(foundingIndex / 2) + 2) % 12;
  const monthJi = JI[monthJiIndex];

  const yearGanIndex = GAN.indexOf(yearGan);
  // [코드 간결성 유지] 월간을 찾는 간결한 로직
  const monthGanStartIndex =
    [0, 5].includes(yearGanIndex) ? 2 : // 갑/기 -> 병
    [1, 6].includes(yearGanIndex) ? 4 : // 을/경 -> 무
    [2, 7].includes(yearGanIndex) ? 6 : // 병/신 -> 경
    [3, 8].includes(yearGanIndex) ? 8 : // 정/임 -> 임
    /*[4, 9]*/ 0;                      // 무/계 -> 갑

  const finalGanIndex = (monthGanStartIndex + monthJiIndex - 2 + 10) % 10;
  const monthGan = GAN[finalGanIndex];

  return monthGan + monthJi;
};

const getJulianDay = (y: number, m: number, d: number): number => {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
};

// [수정] 율리우스력 기준점을 '갑자일' 기준으로 최종 정정
const getDayGanji = (date: Date): string => {
  // 기준점: 1982년 8월 9일 (임술년 무신월 갑자일)의 율리우스력
  const BASE_JD = 2445191.5;
  // '갑자'는 60갑자 배열(GANJI)에서 0번째에 위치.
  const BASE_GANJI_INDEX = 0; 

  const jd = getJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const dayDifference = jd - BASE_JD;
  
  const idx = (BASE_GANJI_INDEX + dayDifference) % 60;
  // Javascript의 % 연산자는 음수 나머지를 반환할 수 있으므로, 항상 양수가 되도록 보정
  const correctedIdx = Math.floor((idx + 60) % 60);
  
  return GANJI[correctedIdx];
};

const getHourGanji = (date: Date, dayGan: string): string => {
  const hour = date.getHours();
  const min = date.getMinutes();
  const hourJiIndex = (hour === 23 && min >= 30) ? 0 : Math.floor((hour + 1) / 2) % 12;
  const hourJi = JI[hourJiIndex];

  const dayGanIndex = GAN.indexOf(dayGan);
  const startGanIndex =
    [0, 5].includes(dayGanIndex) ? 0 : // 갑기 -> 갑
    [1, 6].includes(dayGanIndex) ? 2 : // 을경 -> 병
    [2, 7].includes(dayGanIndex) ? 4 : // 병신 -> 무
    [3, 8].includes(dayGanIndex) ? 6 : // 정임 -> 경
    /*[4, 9]*/ 8;                      // 무계 -> 임

  const hourGan = GAN[(startGanIndex + hourJiIndex) % 10];
  return hourGan + hourJi;
};

// ---------------------------------------------------
// 2. 메인 사주 엔진 (외부 노출 함수)
// ---------------------------------------------------

// [수정] getSajuDetails를 async 함수로 변경하여 비동기 처리
export const getSajuDetails = async (birthDate: Date, gender: 'M' | 'W') => {
  
  // 1. 필요한 절기 데이터를 동적으로 불러옵니다.
  await getSeasonalDataForYear(birthDate.getFullYear());
  await getSeasonalDataForYear(birthDate.getFullYear() - 1); // 입춘 이전 출생 고려
  const SEASONAL_DATA = getLoadedSeasonalData();

  // 2. 사주팔자 계산 (로드된 데이터 사용)
  let sajuYear = birthDate.getFullYear();
  const yearSeasons = SEASONAL_DATA[sajuYear];
  
  if (yearSeasons && birthDate < yearSeasons[2].date) {
    sajuYear -= 1;
  }
  
  const yearPillar = getYearGanjiByYear(sajuYear);
  const monthPillar = getMonthGanji(birthDate, yearPillar[0], SEASONAL_DATA);

  // 야자시(夜子時)를 고려하여 일주를 계산
  let dayPillar: string;
  if (birthDate.getHours() === 23 && birthDate.getMinutes() >= 30) {
    const nextDay = new Date(birthDate);
    nextDay.setDate(nextDay.getDate() + 1);
    dayPillar = getDayGanji(nextDay);
  } else {
    dayPillar = getDayGanji(birthDate);
  }

  const hourPillar = getHourGanji(birthDate, dayPillar[0]);

  // 3. 십성, 십이운성, 대운 계산
  const dayGan = dayPillar[0];
  const pillars = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
  const sipsin = getSipsin(dayGan, pillars);
  const sibiwunseong = getSibiwunseong(dayGan, pillars);
  const daewoonFull = getDaewoon(birthDate, gender, { yearPillar, monthPillar, dayPillar }, SEASONAL_DATA);
  
  // [주석] 4. '현재'에 초점을 맞춘 운세 정보를 계산합니다.
  const currentYear = new Date().getFullYear();
  
  // [주석] 4-1. 전체 대운 정보에서 현재 내가 어떤 대운에 속해있는지 찾아냅니다.
  const currentDaewoon = daewoonFull.find((d: Daewoon) => currentYear >= d.year && currentYear < d.year + 10) || null;
  
  // [주석] 4-2. 새로 만든 세운 서비스를 호출하여 '올해'의 운세를 계산합니다.
  const currentSewoon = getSewoonForYear(currentYear, dayGan);

  // [주석] 5. 최종적으로 사용자에게 필요한 모든 정보를 구조화하여 반환합니다.
  return { 
    pillars,       // 사주 원국
    sipsin,        // 원국의 십성
    sibiwunseong,  // 원국의 십이운성
    currentDaewoon, // 현재 대운 정보
    currentSewoon, // 올해 세운 정보
    daewoonFull,   // UI에서는 숨기거나, '전체 대운 보기' 같은 버튼으로 제공할 수 있는 참고용 데이터
  };
};
