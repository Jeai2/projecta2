// server/src/data/sinsal/rules.auspicious.ts

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
export type ComplexRule = {
  type: "complex";
  conditions: {
    hasAny?: string[]; // 하나라도 있으면
    hasRepeat?: string[]; // 같은 글자 반복
    hasAll?: string[]; // 모두 있어야 함
  };
};
export type SinsalRule = GanjiRule | PairRule | CriteriaRule | ComplexRule;

export const SINSAL_RULES_AUSPICIOUS: { [name: string]: SinsalRule } = {
  천을귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      "甲,戊,庚": ["丑", "未"],
      "乙,己": ["子", "申"],
      "丙,丁": ["亥", "酉"],
      "壬,癸": ["巳", "卯"],
      辛: ["午", "寅"],
    },
  },
  태극귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      "甲,乙": ["子", "午"],
      "丙,丁": ["卯", "酉"],
      "戊,己": ["辰", "戌", "丑", "未"],
      "庚,辛": ["寅", "亥"],
      "壬,癸": ["巳", "申"],
    },
  },
  천덕귀인: {
    type: "criteria",
    base: "monthJi",
    target: "gan",
    rules: {
      寅: "丁",
      卯: "申",
      辰: "壬",
      巳: "辛",
      午: "亥",
      未: "甲",
      申: "癸",
      酉: "寅",
      戌: "丙",
      亥: "乙",
      子: "巳",
      丑: "庚",
    },
  },
  월덕귀인: {
    type: "criteria",
    base: "monthJi",
    target: "gan",
    rules: {
      "寅,午,戌": "丙",
      "巳,酉,丑": "庚",
      "申,子,辰": "壬",
      "亥,卯,未": "甲",
    },
  },
  문창귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "巳",
      乙: "午",
      "丙,戊": "申",
      "丁,己": "酉",
      庚: "亥",
      辛: "子",
      壬: "寅",
      癸: "卯",
    },
  },
  금여: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "辰",
      乙: "巳",
      "丙,戊": "未",
      "丁,己": "申",
      庚: "戌",
      辛: "亥",
      壬: "丑",
      癸: "寅",
    },
  },
  암록: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "亥",
      乙: "戌",
      "丙,戊": "申",
      "丁,己": "未",
      庚: "巳",
      辛: "辰",
      壬: "寅",
      癸: "丑",
    },
  },
  학당귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "亥",
      乙: "午",
      "丙,戊": "寅",
      "丁,己": "酉",
      庚: "巳",
      辛: "子",
      壬: "申",
      癸: "卯",
    },
  },
  천관귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "未",
      乙: "辰",
      丙: "巳",
      丁: "寅",
      戊: "卯",
      己: "酉",
      庚: "亥",
      辛: "申",
      壬: "酉",
      癸: "午",
    },
  },
  천주귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      "甲,丙": "巳",
      "乙,丁": "午",
      戊: "申",
      己: "酉",
      庚: "亥",
      辛: "子",
      壬: "寅",
      癸: "卯",
    },
  },
  문곡귀인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "亥",
      乙: "子",
      "丙,戊": "寅",
      "丁,己": "卯",
      庚: "巳",
      辛: "午",
      壬: "申",
      癸: "酉",
    },
  },
  천문성: {
    type: "complex",
    conditions: {
      hasAny: ["卯", "戌", "亥", "未"], // 묘, 술, 해, 미 중 하나라도 지지에 있으면 성립
      hasRepeat: ["寅", "酉"], // 인인, 유유 등 같은 글자가 두 번 반복되는 경우 성립
    },
  },
};
