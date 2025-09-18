// src/services/sinsal.service.ts
// jjhome 만세력 엔辰 - 통합 申살(神殺) 계산 서비스 v3 (타입-안전, 전체 규칙 적용)
// 12申살과 酉산 코드의 모든 길申/흉살을 명확한 타입과 구조로 계산한다.

/* import { GANJI } from "../data/saju.data"; */
import type { StarElement } from "../types/saju.d";

// -----------------------------------------------------------------------------
// 1. 타입 및 데이터 정의 (Types & Data Definitions)
// -----------------------------------------------------------------------------

type PillarKey = "year" | "month" | "day" | "hour";
type Pillar = { key: PillarKey; gan: string; ji: string; ganji: string };
type SajuInfo = {
  pillars: Pillar[];
  dayGan: string;
  dayJi: string;
  monthJi: string;
  yearJi: string;
  dayGanji: string;
  gender: "M" | "W";
};
export type SinsalHit = { name: string; elements: StarElement[] };
export type SinsalResult = { [key in PillarKey]: SinsalHit[] };

type BaseKey = "dayGan" | "dayJi" | "monthJi" | "yearJi";

// 申살 규칙의 종류를 명확한 타입으로 정의
type GanjiRule = { type: "ganji"; values: string[] };
type PairRule = {
  type: "pair";
  base: "dayJi" | "yearJi";
  pairs: { [key: string]: string };
  allowedPositions?: ("year" | "month" | "day" | "hour")[];
};
type CriteriaRule = {
  type: "criteria";
  base: BaseKey;
  target: "gan" | "ji";
  rules: { [key: string]: string | string[] };
};
type SinsalRule = GanjiRule | PairRule | CriteriaRule;

// [주석] 규칙 데이터 분리: 길신/흉신/12신살
import { SINSAL_12_MAP, getSamhapGroup, SINSAL_RULES_AUSPICIOUS, SINSAL_RULES_INAUSPICIOUS } from "../data/sinsal";
const SINSAL_RULES: { [sinsalName: string]: SinsalRule } = {
  ...SINSAL_RULES_AUSPICIOUS,
  ...SINSAL_RULES_INAUSPICIOUS,
};

// 12신살 맵/그룹 판정은 데이터 모듈에서 import

/* // 12申살 규칙 데이터
const SINSAL_12_NAMES = [
  "겁살",
  "재살",
  "천살",
  "지살",
  "연살",
  "월살",
  "망申살",
  "장성살",
  "반안살",
  "역마살",
  "육亥살",
  "화개살",
];
const SINSAL_12_GROUP_START_INDEX: { [key: string]: number } = {
  亥: 9,
  卯: 9,
  未: 9,
  寅: 0,
  午: 0,
  戌: 0,
  巳: 3,
  酉: 3,
  丑: 3,
  申: 6,
  子: 6,
  辰: 6,
};
const JIJI_ORDER_FOR_12SINSAL = [
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
  "子",
  "丑",
]; */

// -----------------------------------------------------------------------------
// 2. 申살 계산 엔辰 (Sinsal Calculation Engine)
// -----------------------------------------------------------------------------

// [주석] 성별에 따라 달라지는 특수 申살(고申, 과숙)을 계산하는 함수
/* function calculateGoshinGwasuk(saju: SajuInfo, result: SinsalResult) {
  const { gender, yearJi, pillars } = saju;
  const GOSHIN_RULE: { [key: string]: string } = {
    "寅,卯,辰": "巳",
    "巳,午,未": "申",
    "申,酉,戌": "亥",
    "亥,子,丑": "寅",
  };
  const GWASUK_RULE: { [key: string]: string } = {
    "寅,卯,辰": "丑",
    "巳,午,未": "辰",
    "申,酉,戌": "未",
    "亥,子,丑": "戌",
  };

  const rule = gender === "M" ? GOSHIN_RULE : GWASUK_RULE;
  const sinsalName = gender === "M" ? "고申" : "과숙";

  for (const [key, targetJi] of Object.entries(rule)) {
    if (key.split(",").includes(yearJi)) {
      pillars.forEach((p) => {
        if (p.ji === targetJi) {
          // 이름(string) 대申, 근원지 정보를 담은 객체(SinsalHit)를 push 합니다.
          result[p.key].push({
            name: sinsalName,
            elements: [
              { pillar: "year", type: "ji", character: yearJi }, // 기준이 된 년지
              { pillar: p.key, type: "ji", character: p.ji }, // 결과가 나타난 지지
            ],
          });
        }
      });
    }
  }
}

// [주석] 일주를 기준으로 공망을 계산하는 함수
function calculateGongmang(saju: SajuInfo, result: SinsalResult) {
  const GONGMANG_MAP: { [key: string]: string[] } = {
    갑子순: ["戌", "亥"],
    갑戌순: ["申", "酉"],
    갑申순: ["午", "未"],
    갑午순: ["辰", "巳"],
    갑辰순: ["寅", "卯"],
    갑寅순: ["子", "丑"],
  };
  const cycleStart = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];
  let currentCycle = "";
  const dayGanjiIndex = GANJI.indexOf(saju.dayGanji);

  for (const start of cycleStart) {
    const startIndex = GANJI.indexOf(start);
    if (dayGanjiIndex >= startIndex && dayGanjiIndex < startIndex + 10) {
      currentCycle = start + "순";
      break;
    }
  }

  const gongmangPair = GONGMANG_MAP[currentCycle];
  if (gongmangPair) {
    saju.pillars.forEach((p) => {
      if (gongmangPair.includes(p.ji)) {
        // 이름(string) 대申, 근원지 정보를 담은 객체(SinsalHit)를 push 합니다.
        result[p.key].push({
          name: "공망",
          elements: [
            { pillar: "day", type: "gan", character: saju.dayGan }, // 기준이 된 일간
            { pillar: "day", type: "ji", character: saju.dayJi }, // 기준이 된 일지
            { pillar: p.key, type: "ji", character: p.ji }, // 결과가 나타난 지지
          ],
        });
      }
    });
  }
} */

/**
 * 모든 申살을 계산하여 반환하는 메寅 함수
 */
export const getAllSinsals = (
  pillars: { year: string; month: string; day: string; hour: string },
  gender: "M" | "W"
): SinsalResult => {
  const pillarArray: Pillar[] = [
    {
      key: "year",
      gan: pillars.year[0],
      ji: pillars.year[1],
      ganji: pillars.year,
    },
    {
      key: "month",
      gan: pillars.month[0],
      ji: pillars.month[1],
      ganji: pillars.month,
    },
    { key: "day", gan: pillars.day[0], ji: pillars.day[1], ganji: pillars.day },
    {
      key: "hour",
      gan: pillars.hour[0],
      ji: pillars.hour[1],
      ganji: pillars.hour,
    },
  ];
  const saju: SajuInfo = {
    pillars: pillarArray,
    dayGan: pillars.day[0],
    dayJi: pillars.day[1],
    monthJi: pillars.month[1],
    yearJi: pillars.year[1],
    dayGanji: pillars.day,
    gender,
  };

  const result: SinsalResult = { year: [], month: [], day: [], hour: [] };
  if (!saju.dayJi) return result;

  // 1. 12申살 계산
  const group = getSamhapGroup(saju.yearJi);
  if (group) {
    const ruleSet = SINSAL_12_MAP[group];
    saju.pillars.forEach((p) => {
      const sinsalName = ruleSet[p.ji];
      if (sinsalName && !result[p.key].some((h) => h.name === sinsalName)) {
        result[p.key].push({
          name: sinsalName,
          elements: [
            { pillar: "year", type: "ji", character: saju.yearJi },
            { pillar: p.key, type: "ji", character: p.ji },
          ],
        });
      }
    });
  }

  // 2. 기타 申살 계산
  Object.entries(SINSAL_RULES).forEach(([sinsalName, rule]) => {
    switch (rule.type) {
      case "ganji": {
        saju.pillars.forEach((p) => {
          if (rule.values.includes(p.ganji)) {
            result[p.key].push({
              name: sinsalName,
              elements: [
                { pillar: p.key, type: "gan", character: p.gan },
                { pillar: p.key, type: "ji", character: p.ji },
              ],
            });
          }
        });
        break;
      }
      case "pair": {
        const baseValue = saju[rule.base];
        const basePillarKey = rule.base === "dayJi" ? "day" : "year";
        const pairValue = rule.pairs[baseValue];
        if (pairValue) {
          saju.pillars.forEach((p) => {
            if (
              p.ji === pairValue &&
              !result[p.key].some((h) => h.name === sinsalName)
            ) {
              result[p.key].push({
                name: sinsalName,
                elements: [
                  { pillar: basePillarKey, type: "ji", character: baseValue },
                  { pillar: p.key, type: "ji", character: p.ji },
                ],
              });
            }
          });
        }
        break;
      }
      case "criteria": {
        const criteriaBase = saju[rule.base];

        if (sinsalName === "천을귀인") {
          console.log(`\n--- [디버깅] '천을귀인' 규칙 확인 시작 ---`);
          console.log(`- 기준 글자 (일간): "${criteriaBase}"`);
        }

        for (const [key, target] of Object.entries(rule.rules)) {
          if (key.split(",").includes(criteriaBase)) {
            if (sinsalName === "천을귀인") {
              console.log(
                `- 일치하는 규칙 발견: key="${key}", target="${target}"`
              );
            }

            saju.pillars.forEach((p) => {
              const targetValue = rule.target === "gan" ? p.gan : p.ji;
              const targets = Array.isArray(target) ? target : [target];

              if (sinsalName === "천을귀인") {
                console.log(
                  `- 기둥 "${
                    p.key
                  }" 확인 중... 지지: "${targetValue}". 규칙: [${targets.join(
                    ","
                  )}] 포함 여부: ${targets.includes(targetValue)}`
                );
              }

              if (
                targets.includes(targetValue) &&
                !result[p.key].some((h) => h.name === sinsalName)
              ) {
                const basePillarKey = rule.base
                  .replace("Gan", "")
                  .replace("Ji", "") as PillarKey;
                const baseType = rule.base.includes("Gan") ? "gan" : "ji";
                result[p.key].push({
                  name: sinsalName,
                  elements: [
                    {
                      pillar: basePillarKey,
                      type: baseType,
                      character: criteriaBase,
                    },
                    {
                      pillar: p.key,
                      type: rule.target,
                      character: targetValue,
                    },
                  ],
                });
              }
            });
          }
        }
        break;
      }
    }
  });

  return result;
};
