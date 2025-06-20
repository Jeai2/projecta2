// server/src/services/saju.service.ts
import { getSipsin } from "./sipsin.service";
import { getSibiwunseong } from "./sibiwunseong.service";
import { getDaewoon, Daewoon } from "./daewoon.service";
import { getSewoonForYear, SewoonData } from "./sewoon.service";
import { getAllSinsals } from "./sinsal.service"; // ✅ 1. 신살 서비스를 import 합니다.
import {
  getSeasonalDataForYear,
  getLoadedSeasonalData,
} from "./seasonal-data.loader";
import { GAN, JI, GANJI } from "../data/saju.data";
import { interpretSaju, InterpretationResult } from "./sajuInterpret.service";

type SeasonalData = { [year: number]: { name: string; date: Date }[] };

// ✅ 2. SajuData 타입(설계도)에 sinsal 항목을 추가합니다.
export interface SajuData {
  pillars: { year: string; month: string; day: string; hour: string };
  sipsin: ReturnType<typeof getSipsin>;
  sibiwunseong: ReturnType<typeof getSibiwunseong>;
  sinsal: ReturnType<typeof getAllSinsals>; // 신살 데이터 타입 추가
  currentDaewoon: Daewoon | null;
  currentSewoon: SewoonData;
  daewoonFull: Daewoon[];
}

export interface FortuneResult {
  sajuData: SajuData;
  interpretation: InterpretationResult;
}

// 내부 계산 함수
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

const getDayGanji = (date: Date): string => {
  const baseDate = new Date("2024-05-05T00:00:00+09:00");
  const baseGanjiIndex = 0;

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate.getTime() - baseDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const correctedIdx = (baseGanjiIndex + (dayDiff % 60) + 60) % 60;

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

// 메인 엔진
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
  // ✅ 3. 신살 계산 로직을 호출합니다.
  const sinsal = getAllSinsals(pillars, gender);
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

  // ✅ 4. 계산된 sinsal 결과를 sajuData 객체에 포함시킵니다.
  const sajuData: SajuData = {
    pillars,
    sipsin,
    sibiwunseong,
    sinsal: sinsal, // 신살 데이터 포함
    currentDaewoon,
    currentSewoon,
    daewoonFull,
  };

  const interpretation = interpretSaju(sajuData);

  return {
    sajuData,
    interpretation,
  };
};
