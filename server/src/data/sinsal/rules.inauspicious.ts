// server/src/data/sinsal/rules.inauspicious.ts

export type GanjiRule = { type: "ganji"; values: string[] };
export type PairRule = {
  type: "pair";
  base: "dayJi" | "yearJi";
  pairs: { [key: string]: string };
  allowedPositions?: ("year" | "month" | "day" | "hour")[];
};
export type CriteriaRule = {
  type: "criteria";
  base: "dayGan" | "dayJi" | "monthJi" | "yearJi";
  target: "gan" | "ji";
  rules: { [key: string]: string | string[] };
};
export type SinsalRule = GanjiRule | PairRule | CriteriaRule;

export const SINSAL_RULES_INAUSPICIOUS: { [name: string]: SinsalRule } = {
  양인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: { 甲: "卯", "丙,戊": "午", 庚: "酉", 壬: "子" },
  },
  백호: { type: "ganji", values: ["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"] },
  괴강: { type: "ganji", values: ["庚辰", "庚戌", "壬辰", "壬戌", "戊戌"] },
  원진: { type: "pair", base: "dayJi", pairs: { 子: "未", 丑: "午", 寅: "酉", 卯: "申", 辰: "亥", 巳: "戌" } },
  귀문관: { type: "pair", base: "dayJi", pairs: { 子: "酉", 丑: "午", 寅: "未", 卯: "申", 辰: "亥", 巳: "戌" } },
  급각: {
    type: "criteria",
    base: "monthJi",
    target: "ji",
    rules: {
      "寅,卯,辰": ["亥", "子"],
      "巳,午,未": ["卯", "未"],
      "申,酉,戌": ["寅", "戌"],
      "亥,子,丑": ["丑", "辰"],
    },
  },
  홍염: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      "甲,乙": "午",
      丙: "寅",
      丁: "未",
      "戊,己": "辰",
      庚: "戌",
      辛: "酉",
      壬: "子",
      癸: "申",
    },
  },
  탕화: { type: "criteria", base: "dayJi", target: "ji", rules: { "寅,午,戌": "午", "巳,酉,丑": "丑", "申,子,辰": "寅" } },
  고란: { type: "criteria", base: "dayGan", target: "ji", rules: { 甲: "寅", 乙: "巳", 丁: "巳", 戊: "申", 辛: "亥" } },
  음양차착: { type: "criteria", base: "dayGan", target: "ji", rules: { 丙: ["午", "子"], 丁: ["未", "丑"], 戊: ["申", "寅"],
    辛: ["卯", "酉"], 壬: ["辰", "戌"], 癸: ["巳", "亥"] } },
  고과살: { type: "criteria", base: "dayGan", target: "ji", rules: { 丙: ["午", "子"], 丁: ["未", "丑"], 戊: ["申", "寅"],
    辛: ["卯", "酉"], 壬: ["辰", "戌"], 癸: ["巳", "亥"] } },
  과인살: { type: "criteria", base: "dayGan", target: "ji", rules: { 丙: ["午", "子"], 丁: ["未", "丑"], 戊: ["申", "寅"],
    辛: ["卯", "酉"], 壬: ["辰", "戌"], 癸: ["巳", "亥"] } },
};


