/**
 * 육임정단(六壬精斷) 계산 엔진
 *
 * A. 월장 (月將) - 절기 기준 월장 지지 결정
 * B. 천지반도 - 월장가시 + 시계방향 짝꿍1 + 천장 짝꿍2 + 둔간 짝꿍3
 * C. 사과 (四課) - 4개의 과
 * D. 삼전 - (예정)
 */

import { getSeasonalData } from "./seasonal-data.loader";
import { getDayGanji } from "./saju.service";
import { GAN } from "../data/saju.data";

export type WoljangJi = "子" | "亥" | "戌" | "酉" | "申" | "未" | "午" | "巳" | "辰" | "卯" | "寅" | "丑";

/** 월장 범위: [시작절기, 끝절기] - target >= 시작절기.date && target < 끝절기.date */
const WOLJANG_RANGES: { ji: WoljangJi; start: string; end: string }[] = [
  { ji: "子", start: "대한", end: "우수" } /* 대한 ~ 입춘 */,
  { ji: "亥", start: "우수", end: "경칩" },
  { ji: "戌", start: "춘분", end: "청명" },
  { ji: "酉", start: "곡우", end: "입하" },
  { ji: "申", start: "소만", end: "망종" },
  { ji: "未", start: "하지", end: "소서" },
  { ji: "午", start: "대서", end: "입추" },
  { ji: "巳", start: "처서", end: "백로" },
  { ji: "辰", start: "추분", end: "한로" },
  { ji: "卯", start: "상강", end: "입동" },
  { ji: "寅", start: "소설", end: "대설" },
  { ji: "丑", start: "동지", end: "소한" } /* 동지 ~ 소한 (연말~연초) */,
];

function getJeolgiDate(
  seasonal: { name: string; date: Date }[],
  name: string
): Date | null {
  const found = seasonal.find((s) => s.name === name);
  return found ? found.date : null;
}

/**
 * 절기 기준 월장(月將) 지지를 반환한다.
 *
 * @param targetDate 점시(占時) 또는 대상 날짜
 * @returns 월장 지지 (子, 亥, 戌, ... 등) 또는 null (데이터 부족 시)
 *
 * @example
 * // 2026-02-04 12:00 (입춘 당일) → 子
 * // 2026-03-15 (춘분~청명 구간) → 戌
 */
export function getWoljang(targetDate: Date): WoljangJi | null {
  const year = targetDate.getFullYear();

  const seasonalThis = getSeasonalData(year);
  const seasonalNext = getSeasonalData(year + 1);

  if (!seasonalThis.length) return null;

  for (const range of WOLJANG_RANGES) {
    const startDate = getJeolgiDate(seasonalThis, range.start);
    let endDate: Date | null;

    if (range.end === "소한" && range.start === "동지") {
      // 丑: 동지 ~ (다음해) 소한
      endDate = getJeolgiDate(seasonalNext, "소한");
    } else {
      endDate = getJeolgiDate(seasonalThis, range.end);
    }

    if (!startDate || !endDate) continue;

    if (targetDate >= startDate && targetDate < endDate) {
      return range.ji;
    }
  }

  return null;
}

/**
 * 현실 시간을 점시(占時) 지지로 변환한다.
 * 한국 기준: 동경(일본) 시간대 +30분 적용.
 * 경계: 각 지지 끝 29분, 다음 지지 시작 30분. 전자/후자 구분 없음.
 *
 * @param targetDate 점치 시각 (로컬 시간)
 * @returns 점시 지지 (子, 丑, 寅, ... 등)
 *
 * @example
 * // 2026-02-26 00:17 → 子
 * // 2026-02-26 12:00 → 午
 */
export function getJeomsi(targetDate: Date): WoljangJi {
  const h = targetDate.getHours();
  const m = targetDate.getMinutes();
  const total = h * 60 + m;

  // 子: 23:30~01:29
  if (total >= 1410 || total < 90) return "子";
  if (total < 210) return "丑"; // 01:30~03:29
  if (total < 330) return "寅"; // 03:30~05:29
  if (total < 450) return "卯"; // 05:30~07:29
  if (total < 570) return "辰"; // 07:30~09:29
  if (total < 690) return "巳"; // 09:30~11:29
  if (total < 810) return "午"; // 11:30~13:29
  if (total < 930) return "未"; // 13:30~15:29
  if (total < 1050) return "申"; // 15:30~17:29
  if (total < 1170) return "酉"; // 17:30~19:29
  if (total < 1290) return "戌"; // 19:30~21:29
  return "亥"; // 21:30~23:29
}

/** 12지지 표준 순서 (시계방향: 子→丑→寅→…→亥) */
const JI_STANDARD_ORDER: WoljangJi[] = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",
];

/**
 * 천반 배치: 점시 위치에 월장을 두고, 시계방향(子→丑→寅→…→亥)으로 이어 붙인다.
 * 예: 午시 亥월장 → 천반 순서 亥,子,丑,寅,卯,辰,巳,午,未,申,酉,戌
 */

/** 12천장 (天將) */
export type Cheonjang =
  | "貴"
  | "蛇"
  | "朱"
  | "合"
  | "句"
  | "靑"
  | "空"
  | "白"
  | "常"
  | "玄"
  | "陰"
  | "后";

const CHEONJANG_ORDER: Cheonjang[] = [
  "貴", "蛇", "朱", "合", "句", "靑", "空", "白", "常", "玄", "陰", "后",
];

/** 귀인(貴人) 지지: [낮, 밤] - 일간별 */
const GWIGIN_MAP: Record<string, [WoljangJi, WoljangJi]> = {
  甲: ["丑", "未"],
  乙: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  戊: ["丑", "未"],
  己: ["子", "申"],
  庚: ["丑", "未"],
  辛: ["午", "寅"],
  壬: ["巳", "卯"],
  癸: ["巳", "卯"],
};

/** 낮 시진: 묘진사오미신 (05:30~17:29) */
const DAY_JIS: WoljangJi[] = ["卯", "辰", "巳", "午", "未", "申"];
/** 시계방향(해자축인묘진) 지반 → 귀인 지반이 여기 있으면 시계방향 */
const CW_JIBAN: WoljangJi[] = ["亥", "子", "丑", "寅", "卯", "辰"];

/** 둔간(遁干) 또는 공망(空亡) - 짝꿍3 */
export type Dunggan = string; // 甲~癸 또는 "공망"

export interface CheonjibandoPair {
  /** 지반(地盤) - 고정 위치의 지지 */
  jiban: WoljangJi;
  /** 천반(天盤) - 월장가시로 배치된 지지 */
  cheonban: WoljangJi;
  /** 천장(天將) - 짝꿍2 */
  cheonjang?: Cheonjang;
  /** 둔간(遁干) 또는 공망(空亡) - 짝꿍3 */
  dunggan?: Dunggan;
}

/**
 * 천지반도(天地盤圖)를 계산한다.
 * 짝꿍1: 월장가시 + 시계방향 지반↔천반
 * 짝꿍2: 일운 일간 기준 귀인 배치 + 천장 매칭
 * 짝꿍3: 일운 일지 기준 둔간(甲~癸) + 공망(2자리)
 *
 * @param targetDate 점치 시각 (로컬 시간)
 * @returns 12개 짝꿍 배열 (지반↔천반↔천장↔둔간/공망), 또는 null (월장 데이터 부족 시)
 */
export function getCheonjibando(targetDate: Date): CheonjibandoPair[] | null {
  const jeomsi = getJeomsi(targetDate);
  const woljang = getWoljang(targetDate);
  if (!woljang) return null;

  // 점시에서 시작하는 시계방향 지지 순서 (지반)
  const jeomsiIdx = JI_STANDARD_ORDER.indexOf(jeomsi);
  const jibanOrder: WoljangJi[] = [];
  for (let i = 0; i < 12; i++) {
    jibanOrder.push(JI_STANDARD_ORDER[(jeomsiIdx + i) % 12]);
  }

  // 천반: 월장을 맨 앞에 두고 시계방향(子→丑→…→亥)으로 이어 붙임
  const woljangIdx = JI_STANDARD_ORDER.indexOf(woljang);
  const cheonbanOrder: WoljangJi[] = [];
  for (let i = 0; i < 12; i++) {
    cheonbanOrder.push(JI_STANDARD_ORDER[(woljangIdx + i) % 12]);
  }

  const pairs: CheonjibandoPair[] = jibanOrder.map((jiban, i) => ({
    jiban,
    cheonban: cheonbanOrder[i],
  }));

  // 짝꿍2: 천장 배치
  const iljinGanji = getDayGanji(targetDate);
  const ilwoonGan = iljinGanji[0]; // 일운의 일간
  const gwiginEntry = GWIGIN_MAP[ilwoonGan];
  if (!gwiginEntry) return pairs;

  const [dayGwigin, nightGwigin] = gwiginEntry;
  const isDay = DAY_JIS.includes(jeomsi);
  const gwiginJi = isDay ? dayGwigin : nightGwigin;

  // 천반 === 귀인 지지인 위치 찾기 (귀인 배치)
  const gwiginPairIdx = pairs.findIndex((p) => p.cheonban === gwiginJi);
  if (gwiginPairIdx < 0) return pairs;

  const gwiginJiban = pairs[gwiginPairIdx].jiban;
  const isClockwise = CW_JIBAN.includes(gwiginJiban);

  // 귀인 위치에 貴, 나머지 천장을 방향에 따라 배치
  const jibanToCheonjang = new Map<WoljangJi, Cheonjang>();
  for (let i = 0; i < 12; i++) {
    const idx = isClockwise
      ? (gwiginPairIdx + i) % 12
      : (gwiginPairIdx - i + 12) % 12;
    jibanToCheonjang.set(pairs[idx].jiban, CHEONJANG_ORDER[i]);
  }

  let result = pairs.map((p) => ({
    ...p,
    cheonjang: jibanToCheonjang.get(p.jiban),
  }));

  // 짝꿍3: 둔간(遁干) + 공망(空亡)
  const ilwoonJi = iljinGanji.charAt(1) as WoljangJi; // 일운의 일지
  const dungganStartIdx = result.findIndex((p) => p.cheonban === ilwoonJi);
  if (dungganStartIdx >= 0) {
    const cheonbanToDunggan = new Map<WoljangJi, Dunggan>();
    for (let i = 0; i < 12; i++) {
      const idx = (dungganStartIdx + i) % 12;
      const pair = result[idx];
      cheonbanToDunggan.set(
        pair.cheonban,
        i < 10 ? GAN[i] : "공망"
      );
    }
    result = result.map((p) => ({
      ...p,
      dunggan: cheonbanToDunggan.get(p.cheonban),
    }));
  }

  return result;
}

/** 기궁(基宮) 도표: 일간 → 기궁 (일간의 體) */
const GIGUNG_MAP: Record<string, WoljangJi> = {
  甲: "寅",
  乙: "辰",
  丙: "巳",
  丁: "未",
  戊: "巳",
  己: "未",
  庚: "申",
  辛: "戌",
  壬: "亥",
  癸: "丑",
};

/** 천지반도에서 지반으로 행 조회 */
function findPairByJiban(
  cheonjibando: CheonjibandoPair[],
  jiban: WoljangJi
): CheonjibandoPair | undefined {
  return cheonjibando.find((p) => p.jiban === jiban);
}

/** 1과: 일간(기궁) + 일간 상신 + 1과 천장 + 1과 둔간 */
export interface Sagwa1 {
  gan: string;
  gigung: WoljangJi;
  sangsin: WoljangJi;
  cheonjang?: Cheonjang;
  dunggan?: Dunggan;
}

/** 2과: 2과 지반 + 2과 상신 + 2과 천장 + 2과 둔간 */
export interface Sagwa2 {
  jiban: WoljangJi;
  sangsin: WoljangJi;
  cheonjang?: Cheonjang;
  dunggan?: Dunggan;
}

/** 3과: 일지 + 일지 상신 + 일지 천장 + 일지 둔간 */
export interface Sagwa3 {
  jiban: WoljangJi; // 일지
  sangsin: WoljangJi;
  cheonjang?: Cheonjang;
  dunggan?: Dunggan;
}

/** 4과: 4과 지반 + 4과 상신 + 4과 천장 + 4과 둔간 */
export interface Sagwa4 {
  jiban: WoljangJi;
  sangsin: WoljangJi;
  cheonjang?: Cheonjang;
  dunggan?: Dunggan;
}

export interface Sagwa {
  gw1: Sagwa1;
  gw2: Sagwa2;
  gw3: Sagwa3;
  gw4: Sagwa4;
}

/**
 * 사과(四課)를 계산한다.
 * 천지반도(B)를 기반으로 4개의 과를 도출.
 *
 * @param targetDate 점치 시각 (로컬 시간)
 * @returns 사과 4개 (gw1~gw4), 또는 null (천지반도/기궁 데이터 부족 시)
 */
export function getSagwa(targetDate: Date): Sagwa | null {
  const cheonjibando = getCheonjibando(targetDate);
  if (!cheonjibando) return null;

  const iljinGanji = getDayGanji(targetDate);
  const ilwoonGan = iljinGanji.charAt(0);
  const ilwoonJi = iljinGanji.charAt(1) as WoljangJi;

  const gigung = GIGUNG_MAP[ilwoonGan];
  if (!gigung) return null;

  // 1과: 지반=기궁
  const pair1 = findPairByJiban(cheonjibando, gigung);
  if (!pair1) return null;

  const gw1: Sagwa1 = {
    gan: ilwoonGan,
    gigung,
    sangsin: pair1.cheonban,
    cheonjang: pair1.cheonjang,
    dunggan: pair1.dunggan,
  };

  // 2과: 지반=1과 상신
  const pair2 = findPairByJiban(cheonjibando, gw1.sangsin);
  if (!pair2) return null;

  const gw2: Sagwa2 = {
    jiban: gw1.sangsin,
    sangsin: pair2.cheonban,
    cheonjang: pair2.cheonjang,
    dunggan: pair2.dunggan,
  };

  // 3과: 지반=일지
  const pair3 = findPairByJiban(cheonjibando, ilwoonJi);
  if (!pair3) return null;

  const gw3: Sagwa3 = {
    jiban: ilwoonJi,
    sangsin: pair3.cheonban,
    cheonjang: pair3.cheonjang,
    dunggan: pair3.dunggan,
  };

  // 4과: 지반=3과 상신
  const pair4 = findPairByJiban(cheonjibando, gw3.sangsin);
  if (!pair4) return null;

  const gw4: Sagwa4 = {
    jiban: gw3.sangsin,
    sangsin: pair4.cheonban,
    cheonjang: pair4.cheonjang,
    dunggan: pair4.dunggan,
  };

  return { gw1, gw2, gw3, gw4 };
}
