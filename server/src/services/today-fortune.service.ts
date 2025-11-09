// server/src/services/today-fortune.service.ts
// 오늘의 운세 전용 서비스 (일진 기반)

import { getDayGanji, getSajuDetails } from "./saju.service";
import {
  analyzeCompatibility,
  type CompatibilityResult,
} from "./compatibility.service";
import { SIPSIN_TABLE, JI } from "../data/saju.data";
import {
  getLukimInterpretation,
  type LukimInterpretation,
} from "../data/lukim-interpretations";
import type {
  TodayFortuneResponse,
  IljinData,
  IljinFortune,
} from "../../../src/types/today-fortune";

// 오행 매핑
const GAN_TO_OHAENG: Record<string, "木" | "火" | "土" | "金" | "水"> = {
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

const JI_TO_OHAENG: Record<string, "木" | "火" | "土" | "金" | "水"> = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
};

// 방향 매핑 (간지별)
const GANJI_TO_DIRECTION: Record<string, "東" | "西" | "南" | "北" | "中央"> = {
  甲子: "東",
  乙丑: "東",
  丙寅: "南",
  丁卯: "南",
  戊辰: "中央",
  己巳: "中央",
  庚午: "西",
  辛未: "西",
  壬申: "北",
  癸酉: "北",
  甲戌: "東",
  乙亥: "東",
  丙子: "南",
  丁丑: "南",
  戊寅: "中央",
  己卯: "中央",
  庚辰: "西",
  辛巳: "西",
  壬午: "北",
  癸未: "北",
  甲申: "東",
  乙酉: "東",
  丙戌: "南",
  丁亥: "南",
  戊子: "中央",
  己丑: "中央",
  庚寅: "西",
  辛卯: "西",
  壬辰: "北",
  癸巳: "北",
  甲午: "東",
  乙未: "東",
  丙申: "南",
  丁酉: "南",
  戊戌: "中央",
  己亥: "中央",
  庚子: "西",
  辛丑: "西",
  壬寅: "北",
  癸卯: "北",
  甲辰: "東",
  乙巳: "東",
  丙午: "南",
  丁未: "南",
  戊申: "中央",
  己酉: "中央",
  庚戌: "西",
  辛亥: "西",
  壬子: "北",
  癸丑: "北",
  甲寅: "東",
  乙卯: "東",
  丙辰: "南",
  丁巳: "南",
  戊午: "中央",
  己未: "中央",
  庚申: "西",
  辛酉: "西",
  壬戌: "北",
  癸亥: "北",
};

// 색상 매핑 (오행별)
const OHAENG_TO_COLOR: Record<string, string> = {
  木: "청색",
  火: "빨간색",
  土: "노란색",
  金: "흰색",
  水: "검은색",
};

// 숫자 매핑 (간지별)
const GANJI_TO_NUMBER: Record<string, string> = {
  甲子: "1, 3",
  乙丑: "2, 4",
  丙寅: "3, 5",
  丁卯: "4, 6",
  戊辰: "5, 7",
  己巳: "6, 8",
  庚午: "7, 9",
  辛未: "8, 10",
  壬申: "9, 1",
  癸酉: "10, 2",
  甲戌: "1, 3",
  乙亥: "2, 4",
  丙子: "3, 5",
  丁丑: "4, 6",
  戊寅: "5, 7",
  己卯: "6, 8",
  庚辰: "7, 9",
  辛巳: "8, 10",
  壬午: "9, 1",
  癸未: "10, 2",
  甲申: "1, 3",
  乙酉: "2, 4",
  丙戌: "3, 5",
  丁亥: "4, 6",
  戊子: "5, 7",
  己丑: "6, 8",
  庚寅: "7, 9",
  辛卯: "8, 10",
  壬辰: "9, 1",
  癸巳: "10, 2",
  甲午: "1, 3",
  乙未: "2, 4",
  丙申: "3, 5",
  丁酉: "4, 6",
  戊戌: "5, 7",
  己亥: "6, 8",
  庚子: "7, 9",
  辛丑: "8, 10",
  壬寅: "9, 1",
  癸卯: "10, 2",
  甲辰: "1, 3",
  乙巳: "2, 4",
  丙午: "3, 5",
  丁未: "4, 6",
  戊申: "5, 7",
  己酉: "6, 8",
  庚戌: "7, 9",
  辛亥: "8, 10",
  壬子: "9, 1",
  癸丑: "10, 2",
  甲寅: "1, 3",
  乙卯: "2, 4",
  丙辰: "3, 5",
  丁巳: "4, 6",
  戊午: "5, 7",
  己未: "6, 8",
  庚申: "7, 9",
  辛酉: "8, 10",
  壬戌: "9, 1",
  癸亥: "10, 2",
};

// 시간대 매핑 (간지별)
const GANJI_TO_TIME: Record<string, { good: string[]; bad: string[] }> = {
  甲子: { good: ["卯시", "辰시"], bad: ["午시", "未시"] },
  乙丑: { good: ["辰시", "巳시"], bad: ["未시", "申시"] },
  丙寅: { good: ["巳시", "午시"], bad: ["申시", "酉시"] },
  丁卯: { good: ["午시", "未시"], bad: ["酉시", "戌시"] },
  戊辰: { good: ["未시", "申시"], bad: ["戌시", "亥시"] },
  己巳: { good: ["申시", "酉시"], bad: ["亥시", "子시"] },
  庚午: { good: ["酉시", "戌시"], bad: ["子시", "丑시"] },
  辛未: { good: ["戌시", "亥시"], bad: ["丑시", "寅시"] },
  壬申: { good: ["亥시", "子시"], bad: ["寅시", "卯시"] },
  癸酉: { good: ["子시", "丑시"], bad: ["卯시", "辰시"] },
  // ... 나머지도 동일한 패턴으로 추가 가능
};

const createLukimValueMap = (): Record<string, number> => {
  const map: Record<string, number> = {};
  const assign = (symbols: string[], value: number) => {
    symbols.forEach((symbol) => {
      map[symbol] = value;
    });
  };

  assign(["甲", "己", "子", "午", "갑", "기", "자", "오"], 9);
  assign(["乙", "庚", "丑", "未", "을", "경", "축", "미"], 8);
  assign(["丙", "辛", "寅", "申", "병", "신", "인", "신"], 7);
  assign(["丁", "壬", "卯", "酉", "정", "임", "묘", "유"], 6);
  assign(["戊", "癸", "辰", "戌", "무", "계", "진", "술"], 5);
  assign(["巳", "亥", "사", "해"], 4);

  return map;
};

const LUKIM_VALUE_MAP = createLukimValueMap();

type LukimComponentType = "birthYearGan" | "birthYearJi" | "dayGan" | "hourJi";

interface LukimComponentDetail {
  type: LukimComponentType;
  label: string;
  symbol: string;
  value: number;
}

interface LukimCalculationResult {
  total: number;
  interpretation: LukimInterpretation | null;
  components: LukimComponentDetail[];
}

const getLukimNumericValue = (symbol: string): number | null => {
  if (!symbol) return null;
  return LUKIM_VALUE_MAP[symbol] ?? null;
};

const getHourBranchSymbol = (date: Date): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;
  const adjustedMinutes = (totalMinutes + 30) % 1440;
  const hourJiIndex = Math.floor(adjustedMinutes / 120);
  return JI[hourJiIndex];
};

const calculateLukimResult = (
  gender: "M" | "W",
  userPillars: {
    year: { gan: string; ji: string };
  },
  iljin: IljinData,
  referenceDate: Date
): LukimCalculationResult | null => {
  const birthSymbol =
    gender === "M" ? userPillars.year.gan : userPillars.year.ji;
  const birthComponent: LukimComponentDetail = {
    type: gender === "M" ? "birthYearGan" : "birthYearJi",
    label: gender === "M" ? "생년간" : "생년지",
    symbol: birthSymbol,
    value: getLukimNumericValue(birthSymbol) ?? 0,
  };

  const dayComponent: LukimComponentDetail = {
    type: "dayGan",
    label: "점일간",
    symbol: iljin.gan,
    value: getLukimNumericValue(iljin.gan) ?? 0,
  };

  const hourBranch = getHourBranchSymbol(referenceDate);
  const hourComponent: LukimComponentDetail = {
    type: "hourJi",
    label: "점시지",
    symbol: hourBranch,
    value: getLukimNumericValue(hourBranch) ?? 0,
  };

  const components = [birthComponent, dayComponent, hourComponent];

  if (components.some((component) => component.value === 0)) {
    return null;
  }

  const total = components.reduce((sum, component) => sum + component.value, 0);
  const interpretation = getLukimInterpretation(total);

  if (!interpretation) {
    return null;
  }

  return {
    total,
    interpretation,
    components,
  };
};

// 일진 데이터 생성
export const generateIljinData = (date: Date): IljinData => {
  const ganji = getDayGanji(date);
  const gan = ganji[0];
  const ji = ganji[1];

  return {
    date: date.toISOString().split("T")[0], // YYYY-MM-DD 형식
    ganji,
    gan,
    ji,
    ohaeng: {
      gan: GAN_TO_OHAENG[gan] || "木",
      ji: JI_TO_OHAENG[ji] || "水",
    },
    direction: GANJI_TO_DIRECTION[ganji] || "東",
    color: OHAENG_TO_COLOR[GAN_TO_OHAENG[gan] || "木"],
    number: GANJI_TO_NUMBER[ganji] || "1, 3",
    time: GANJI_TO_TIME[ganji] || {
      good: ["卯시", "辰시"],
      bad: ["午시", "未시"],
    },
  };
};

// 운세 풀이 생성 (상성 분석 반영)
export const generateFortuneWithCompatibility = (
  iljin: IljinData,
  compatibility: CompatibilityResult,
  lukim: LukimCalculationResult | null
): IljinFortune => {
  const { totalScore, analysis } = compatibility;

  // 상성에 따른 기본 톤 설정
  const isPositive = totalScore >= 20;
  const isNegative = totalScore < -10;

  const baseSummary = isPositive
    ? `${iljin.ganji} 일진과 매우 좋은 상성을 보입니다. 오늘은 당신에게 특별한 기회의 날이 될 것입니다.`
    : isNegative
    ? `${iljin.ganji} 일진과 조심스러운 관계입니다. 신중한 판단이 필요한 하루가 될 것 같습니다.`
    : `${iljin.ganji} 일진과 무난한 관계입니다. 평온하고 안정적인 하루가 예상됩니다.`;

  const lukimSummary = lukim?.interpretation?.summary ?? null;

  const workFortune = isPositive
    ? "업무에서 탁월한 성과를 낼 수 있는 날입니다. 새로운 프로젝트나 중요한 결정을 내리기에 최적의 시기입니다."
    : isNegative
    ? "업무에서는 신중함이 필요합니다. 급한 결정보다는 충분히 검토한 후 진행하세요."
    : "업무가 평소대로 순조롭게 진행될 것입니다. 꾸준히 노력하면 좋은 결과를 얻을 수 있습니다.";

  const loveFortune = isPositive
    ? "인간관계에서 특별한 만남이나 발전이 기대됩니다. 적극적으로 마음을 표현해보세요."
    : isNegative
    ? "인간관계에서 오해가 생기기 쉬운 날입니다. 말조심하고 상대방 입장을 이해하려 노력하세요."
    : "인간관계가 평온하게 유지될 것입니다. 기존 관계를 소중히 여기는 하루가 되겠습니다.";

  return {
    summary: lukimSummary ?? baseSummary,
    general: `${analysis.ganRelation} ${analysis.jiRelation} ${
      analysis.specialHarmony.length > 0
        ? `특히 ${analysis.specialHarmony.join(
            ", "
          )} 관계로 더욱 길한 기운이 있습니다.`
        : ""
    }`,
    work: workFortune,
    love: loveFortune,
    health: isPositive
      ? "건강 상태가 매우 좋은 날입니다. 활력이 넘치고 면역력도 강화될 것입니다."
      : isNegative
      ? "몸의 컨디션을 세심히 관리하세요. 과로를 피하고 충분한 휴식을 취하는 것이 중요합니다."
      : "건강 상태가 안정적입니다. 규칙적인 생활 리듬을 유지하세요.",
    money: isPositive
      ? "재물운이 상승하는 길한 날입니다. 투자나 새로운 수익 기회를 모색해볼 만합니다."
      : isNegative
      ? "재정 관리에 신중을 기하세요. 큰 지출이나 투자는 미루는 것이 좋겠습니다."
      : "재물운이 평온합니다. 기존 계획대로 착실히 저축하고 관리하세요.",
    relations: isPositive
      ? "주변 사람들과의 관계가 매우 원활할 것입니다. 새로운 인맥 형성에도 좋은 날입니다."
      : isNegative
      ? "대인관계에서 갈등이 생기기 쉬운 날입니다. 감정적인 대응보다는 이성적으로 접근하세요."
      : "대인관계가 평온하게 유지될 것입니다. 기존 관계를 더욱 돈독히 하는 데 집중하세요.",
    documents: isPositive
      ? "중요한 서류나 계약 관련 일들이 순조롭게 진행될 것입니다. 좋은 소식이 있을 수 있습니다."
      : isNegative
      ? "서류나 계약 관련 일에서는 세심한 검토가 필요합니다. 서두르지 말고 꼼꼼히 확인하세요."
      : "서류 관련 업무가 평소처럼 무난하게 처리될 것입니다.",
    advice: `${analysis.daewoonEffect}인 상황입니다. ${
      isPositive
        ? "이 좋은 기운을 놓치지 말고 적극적으로 행동하세요."
        : isNegative
        ? "조심스럽게 행동하되 너무 위축되지는 마세요."
        : "평상심을 유지하며 꾸준히 노력하세요."
    }`,
    lucky: {
      direction: iljin.direction,
      color: iljin.color,
      number: iljin.number,
      time: iljin.time.good.join(", "),
    },
    avoid: {
      direction: iljin.direction === "東" ? "西" : "東",
      color: iljin.color === "청색" ? "빨간색" : "청색",
      time: iljin.time.bad.join(", "),
    },
  };
};

// 메인 서비스 함수
export const getTodayFortune = async (userInfo: {
  name: string;
  gender: "M" | "W";
  calendarType: "solar" | "lunar";
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}): Promise<TodayFortuneResponse> => {
  const today = new Date();
  const iljin = generateIljinData(today);

  // 사용자 사주 계산
  const birthDateObj = new Date(
    `${userInfo.birthDate}T${userInfo.birthTime || "12:00"}:00`
  );
  const sajuResult = await getSajuDetails(birthDateObj, userInfo.gender);
  const userPillars = sajuResult.sajuData.pillars;
  const userDayGan = userPillars.day.gan;

  // PillarData를 Pillars 형식으로 변환
  const simplePillars = {
    year: userPillars.year.gan + userPillars.year.ji,
    month: userPillars.month.gan + userPillars.month.ji,
    day: userPillars.day.gan + userPillars.day.ji,
    hour: userPillars.hour.gan + userPillars.hour.ji,
  };

  // 1단계: 사용자 사주와 일진 상성 분석
  const compatibility = analyzeCompatibility(
    simplePillars,
    iljin,
    birthDateObj,
    userInfo.gender
  );

  // 기존 십성 계산
  const calcSipsin = (
    dayGan: string,
    target: string,
    type: "h" | "e"
  ): string | null => {
    if (!dayGan || !target) return null;
    const tableForType: { [key: string]: { [key: string]: string } } =
      SIPSIN_TABLE[type];
    return tableForType[dayGan]?.[target] || null;
  };

  const sipsinOfToday = {
    dayGan: userDayGan,
    gan: calcSipsin(userDayGan, iljin.gan, "h"),
    ji: calcSipsin(userDayGan, iljin.ji, "e"),
  };

  const lukimResult = calculateLukimResult(
    userInfo.gender,
    {
      year: {
        gan: userPillars.year.gan,
        ji: userPillars.year.ji,
      },
    },
    iljin,
    today
  );

  // 상성 분석을 반영한 운세 생성
  const fortune = generateFortuneWithCompatibility(
    iljin,
    compatibility,
    lukimResult
  );

  return {
    userInfo: {
      ...userInfo,
      timeUnknown: !userInfo.birthTime,
    },
    iljin,
    fortune,
    sipsinOfToday,
    compatibility, // 상성 분석 결과 추가
    lukim: lukimResult
      ? {
          value: lukimResult.total,
          summary: lukimResult.interpretation?.summary ?? "",
          components: lukimResult.components,
        }
      : null,
    generatedAt: new Date().toISOString(),
  };
};
