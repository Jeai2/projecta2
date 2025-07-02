// server/src/services/saju.service.ts (최종 완성본)

import { getSipsin } from "./sipsin.service";
import { getSibiwunseong } from "./sibiwunseong.service";
import { getDaewoon } from "./daewoon.service";
import { getSewoonForYear } from "./sewoon.service";
import { getAllSinsals } from "./sinsal.service";
import {
  getSeasonalDataForYear,
  getLoadedSeasonalData,
} from "./seasonal-data.loader";
import { GAN, JI, GANJI, GAN_OHENG, JI_OHENG } from "../data/saju.data"; // ✅ 오행 데이터 import
import { interpretSaju } from "./sajuInterpret.service";
import { getNapeumFromPillars } from "../hwa-eui/data/hwa-eui.data";
import { SajuData, InterpretationResult, FortuneResult } from "../types/saju.d";

type SeasonalData = { [year: number]: { name: string; date: Date }[] };

// 내부 계산 함수 (수정 없음)
const getYearGanjiByYear = (year: number): string => {
  const ganIndex = (year - 4) % 10;
  const jiIndex = (year - 4) % 12;
  return GAN[(ganIndex + 10) % 10] + JI[(jiIndex + 12) % 12];
};

const getMonthGanji = (
  date: Date,
  yearGan: string,
  seasonalData: SeasonalData
): string => {
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

  const monthOrder = Math.floor(foundingIndex / 2);
  const monthJiIndex = (monthOrder + 1) % 12;
  const monthJi = JI[monthJiIndex];

  const yearGanIndex = GAN.indexOf(yearGan);
  const monthGanStartIndex = [0, 5].includes(yearGanIndex)
    ? 2
    : [1, 6].includes(yearGanIndex)
    ? 4
    : [2, 7].includes(yearGanIndex)
    ? 6
    : [3, 8].includes(yearGanIndex)
    ? 8
    : 0;

  const finalGanIndex = (monthGanStartIndex + monthJiIndex - 2 + 10) % 10;
  const monthGan = GAN[finalGanIndex];

  return monthGan + monthJi;
};

const getJulianDay = (y: number, m: number, d: number): number => {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    b -
    1524.5
  );
};

// 일주 계산 함수 (선생님께서 찾아주신 정확한 기준점이 적용된 최종 버전)
const getDayGanji = (date: Date): string => {
  // 기준점: 1982년 8월 9일 (월요일)은 '갑자일'
  // 해당 날짜 자정(0시)의 율리우스력(JD)은 2445190.5 입니다.
  const BASE_JD = 2445190.5;
  // '갑자'는 60갑자 배열(GANJI)에서 0번째에 위치합니다.
  const BASE_GANJI_INDEX = 0;

  const jd = getJulianDay(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const dayDifference = jd - BASE_JD;

  const idx = (BASE_GANJI_INDEX + dayDifference) % 60;
  const correctedIdx = Math.floor((idx + 60) % 60);

  return GANJI[correctedIdx];
};

const getHourGanji = (date: Date, dayGan: string): string => {
  const hour = date.getHours();
  const min = date.getMinutes();
  const hourJiIndex =
    hour === 23 && min >= 30 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const hourJi = JI[hourJiIndex];

  const dayGanIndex = GAN.indexOf(dayGan);
  const startGanIndex = [0, 5].includes(dayGanIndex)
    ? 0
    : [1, 6].includes(dayGanIndex)
    ? 2
    : [2, 7].includes(dayGanIndex)
    ? 4
    : [3, 8].includes(dayGanIndex)
    ? 6
    : 8;

  const hourGan = GAN[(startGanIndex + hourJiIndex) % 10];
  return hourGan + hourJi;
};

// 메인 엔진 (getSajuDetails)
export const getSajuDetails = async (
  birthDate: Date,
  gender: "M" | "W"
): Promise<FortuneResult> => {
  await getSeasonalDataForYear(birthDate.getFullYear());
  await getSeasonalDataForYear(birthDate.getFullYear() - 1);
  const SEASONAL_DATA = getLoadedSeasonalData();

  let sajuYear = birthDate.getFullYear();
  const yearSeasons = SEASONAL_DATA[sajuYear];
  if (yearSeasons && birthDate < yearSeasons[2].date) {
    sajuYear -= 1;
  }
  const yearPillar = getYearGanjiByYear(sajuYear);
  const monthPillar = getMonthGanji(birthDate, yearPillar[0], SEASONAL_DATA);
  let dayPillar: string;
  if (birthDate.getHours() === 23 && birthDate.getMinutes() >= 30) {
    const nextDay = new Date(birthDate);
    nextDay.setDate(nextDay.getDate() + 1);
    dayPillar = getDayGanji(nextDay);
  } else {
    dayPillar = getDayGanji(birthDate);
  }
  const hourPillar = getHourGanji(birthDate, dayPillar[0]);
  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
  const dayGan = dayPillar[0];

  const sipsin = getSipsin(dayGan, pillars);
  const sibiwunseong = getSibiwunseong(dayGan, pillars);
  const sinsal = getAllSinsals(pillars, gender);
  const napeum = getNapeumFromPillars(pillars);
  const daewoonFull = getDaewoon(
    birthDate,
    gender,
    { yearPillar, monthPillar, dayPillar },
    SEASONAL_DATA
  );
  const currentYear = new Date().getFullYear();
  const currentDaewoon =
    daewoonFull.find(
      (d) => currentYear >= d.year && currentYear < d.year + 10
    ) || null;
  const currentSewoon = getSewoonForYear(currentYear, dayGan);

  // ✅ 3. 최종 sajuData 객체를 조립하는 부분을 오행 정보가 포함되도록 수정합니다.
  const sajuData: SajuData = {
    pillars: {
      year: {
        gan: yearPillar[0],
        ji: yearPillar[1],
        ganOhaeng: GAN_OHENG[yearPillar[0]],
        jiOhaeng: JI_OHENG[yearPillar[1]],
        ganSipsin: sipsin.year.gan,
        jiSipsin: sipsin.year.ji,
        sibiwunseong: sibiwunseong.year,
        sinsal: sinsal.year,
      },
      month: {
        gan: monthPillar[0],
        ji: monthPillar[1],
        ganOhaeng: GAN_OHENG[monthPillar[0]],
        jiOhaeng: JI_OHENG[monthPillar[1]],
        ganSipsin: sipsin.month.gan,
        jiSipsin: sipsin.month.ji,
        sibiwunseong: sibiwunseong.month,
        sinsal: sinsal.month,
      },
      day: {
        gan: dayPillar[0],
        ji: dayPillar[1],
        ganOhaeng: GAN_OHENG[dayPillar[0]],
        jiOhaeng: JI_OHENG[dayPillar[1]],
        ganSipsin: sipsin.day.gan,
        jiSipsin: sipsin.day.ji,
        sibiwunseong: sibiwunseong.day,
        sinsal: sinsal.day,
      },
      hour: {
        gan: hourPillar[0],
        ji: hourPillar[1],
        ganOhaeng: GAN_OHENG[hourPillar[0]],
        jiOhaeng: JI_OHENG[hourPillar[1]],
        ganSipsin: sipsin.hour.gan,
        jiSipsin: sipsin.hour.ji,
        sibiwunseong: sibiwunseong.hour,
        sinsal: sinsal.hour,
      },
    },
    sipsin,
    sibiwunseong,
    sinsal,
    napeum,
    currentDaewoon,
    currentSewoon,
    daewoonFull,
  };

  const interpretation: InterpretationResult = interpretSaju(sajuData);

  return {
    sajuData,
    interpretation,
  };
};
