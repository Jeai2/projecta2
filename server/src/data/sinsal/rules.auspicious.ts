// server/src/data/sinsal/rules.auspicious.ts

export type GanjiRule = { type: "ganji"; values: string[] };
export type PairRule = {
  type: "pair";
  base: "dayJi" | "yearJi";
  pairs: { [key: string]: string };
  allowedPositions?: ("year" | "month" | "day" | "hour")[];
};

export type AdjacentPairRule = {
  type: "adjacentPair";
  base: "dayJi" | "yearJi";
  pairs: { [key: string]: string };
  // 인접한 기둥만 확인: year-month, month-day, day-hour
};

export type DayHourPairRule = {
  type: "dayHourPair";
  base: "dayGan";
  target: "ji";
  rules: { [key: string]: string[] };
  // 일주(일간+일지)와 시주(시간+시지) 간의 관계만 확인
};

export type PillarPairRule = {
  type: "pillarPair";
  pillar1: "day"; // 첫 번째 기둥 (일주)
  pillar2: "hour"; // 두 번째 기둥 (시주)
  rules: { [key: string]: string[] }; // 일주-시주 조합 규칙
  // 예: { "丙午": ["甲子", "庚子"], "丁未": ["乙丑", "辛丑"] }
};

export type MonthBasedRule = {
  type: "monthBased";
  base: "monthJi"; // 월지 기준
  target: "dayHour"; // 일지 또는 시지 중 하나
  rules: { [key: string]: string }; // 월지 -> 일지/시지 규칙
  // 예: { "子": "巳", "午": "巳", "卯": "巳", "酉": "巳" }
};

export type AllGanRule = {
  type: "allGan";
  base: "allGan"; // 모든 천간 기준
  target: "ji"; // 지지에서 확인
  rules: { [key: string]: string | string[] }; // 천간 -> 찾을 지지 규칙 (단일 또는 배열)
  // 예: { "甲": "午", "乙": ["寅", "申"] }
};
export type CriteriaRule = {
  type: "criteria";
  base: "dayGan" | "dayJi" | "monthJi" | "yearJi";
  target: "gan" | "ji";
  rules: { [key: string]: string | string[] };
};

export type ComplexCriteriaRule = {
  type: "complexCriteria";
  base: "dayGan" | "dayJi" | "monthJi" | "yearJi";
  target: "gan" | "ji";
  rules: { [key: string]: string[] }; // 모든 조건이 동시에 만족되어야 함
};
export type ComplexRule = {
  type: "complex";
  conditions: {
    hasAny?: string[];
    hasRepeat?: string[];
    hasAll?: string[];
  };
};
export type SinsalRule = GanjiRule | PairRule | AdjacentPairRule | DayHourPairRule | PillarPairRule | MonthBasedRule | AllGanRule | CriteriaRule | ComplexCriteriaRule | ComplexRule;

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
      hasAny: ["卯", "戌", "亥", "未"],
      hasRepeat: ["寅", "酉"],
    },
  },
  천의성: {
    type: "criteria",
    base: "monthJi",
    target: "ji",
    rules: {
      寅: "丑",
      卯: "寅",
      辰: "卯",
      巳: "未",
      午: "巳",
      未: "午",
      申: "未",
      酉: "申",
      戌: "酉",
      亥: "戌",
      子: "亥",
      丑: "子",
    },
  },
};
