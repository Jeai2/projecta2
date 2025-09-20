// server/src/data/sinsal/rules.inauspicious.ts

export type GanjiRule = { type: "ganji"; values: string[] };
export type PairRule = {
  type: "pair";
  base: "dayJi" | "yearJi" | "ji";
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
  base: "dayGan" | "dayJi" | "monthJi" | "yearJi" | "hourJi" | "hourGan" | "yearGan" | "monthGan"; 
  target: "gan" | "ji" | "dayji";
  rules: { [key: string]: string | string[] };
};

export type ComplexCriteriaRule = {
  type: "complexCriteria";
  base: "dayGan" | "dayJi" | "monthJi" | "yearJi";
  target: "gan" | "ji";
  rules: { [key: string]: string[] };
};
export type ComplexRule = {
  type: "complex";
  conditions: {
    hasAny?: string[];           // 하나라도 있으면
    hasRepeat?: string[];        // 같은 글자 반복
    hasAll?: string[];           // 모두 있어야 함
  };
};
export type GongmangRule = { type: "gongmang" };
export type SinsalRule = GanjiRule | PairRule | AdjacentPairRule | DayHourPairRule | PillarPairRule | MonthBasedRule | AllGanRule | CriteriaRule | ComplexCriteriaRule | ComplexRule | GongmangRule;

export const SINSAL_RULES_INAUSPICIOUS: { [name: string]: SinsalRule } = {
  양인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: { 甲: "卯", "丙,戊": "午", 庚: "酉", 壬: "子" },
  },
  백호: { type: "ganji", values: ["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"] },
  괴강: { type: "ganji", values: ["庚辰", "庚戌", "戊辰", "壬辰", "壬戌", "戊戌"] },
  효신: { type: "ganji", values: ["甲子", "乙亥", "丙寅", "丁卯", "戊午", "己巳", "庚辰", "庚戌", "辛未", "辛丑", "壬申", "癸酉"] },
  원진: { type: "adjacentPair", base: "dayJi", pairs: { 子: "未", 丑: "午", 寅: "酉", 卯: "申", 辰: "亥", 巳: "戌" } },
  귀문관: { type: "adjacentPair", base: "dayJi", pairs: { 子: "酉", 丑: "午", 寅: "未", 卯: "申", 辰: "亥", 巳: "戌" } },
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
  부벽: {
    type: "monthBased",
    base: "monthJi",
    target: "dayHour",
    rules: {
      "子": "巳", "午": "巳", "卯": "巳", "酉": "巳",
      "寅": "酉", "巳": "酉", "申": "酉", "亥": "酉",
      "辰": "戌", "戌": "戌", "丑": "戌", "未": "戌"
    },
  },
  비인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "酉",
      乙: "戌",
      丙: "子",
      丁: "丑",
      戊: "子",
      己: "丑",
      庚: "丑",
      辛: "辰)",
      壬: "午",
      癸: "未",
    },
  },
  천공: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "申",
      乙: "酉",
      丙: "子",
      丁: "亥",
      戊: "子",
      己: "亥",
      庚: "寅",
      辛: "卯",
    },
  },
  현침: {
    type: "ganji",
    values: ["甲申", "甲午", "辛未", "辛卯", "甲子", "甲戌", "甲辰", "甲寅", "乙卯", "丁卯", "己卯", "丙申", "庚申", "壬申", "戊午", "辛巳", "辛丑", "辛亥", "辛酉", "癸卯"],
  },
  홍염: {
    type: "allGan",
    base: "allGan",
    target: "ji",
    rules: {
      甲: ["午", "申"],
      乙: "午",
      丙: "寅",
      丁: "未",
      "戊,己": "辰",
      庚: ["戌", "申"],
      辛: "酉",
      壬: ["子", "申"],
      癸: "申",
    },
  },
  탕화: {
    type: "complexCriteria",
    base: "dayJi",
    target: "ji",
    rules: {
      丑: ["午", "未", "戌"], 
      寅: ["寅", "巳", "申"], 
      午: ["丑", "辰", "午"], 
    },
  },
  고란: { type: "criteria", base: "dayGan", target: "dayji", rules: { 甲: "寅", 乙: "巳", 丁: "巳", 戊: "申", 辛: "亥" } },
  음착: { 
    type: "ganji", 
    values: ["辛卯", "辛酉", "丁未", "丁丑", "癸巳", "癸亥"] 
  },
  양차: { 
    type: "ganji", 
    values: ["丙午", "丙子", "壬辰", "壬戌", "戊申", "戊寅"] 
  },

  과인: { type: "criteria", base: "dayGan", target: "ji", rules: { 丙: ["午", "子"], 丁: ["未", "丑"], 戊: ["申", "寅"],
    辛: ["卯", "酉"], 壬: ["辰", "戌"], 癸: ["巳", "亥"] } },
  상충: {
    type: "complexCriteria",
    base: "dayJi",
    target: "ji",
    rules: {
      丑: ["午", "未", "戌"], 
      寅: ["寅", "巳", "申"], 
      午: ["丑", "辰", "午"], 
    },
  },
  혈인: {
    type: "pair",
    base: "ji",
    pairs: {
      子: "戌",
      丑: "酉",
      寅: "申",
      卯: "未",
      辰: "午",
      巳: "巳",
    },
  },
  욕망: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "寅",
      乙: "卯",
      丁: "未",
      戊: "戌",
      己: "未",
      庚: "申",
      辛: "卯",
    },
  },
  유하: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "酉",
      乙: "戌",
      丙: "未",
      丁: "申",
      戊: "巳",
      己: "午",
      庚: "辰",
      辛: "卯",
      壬: "亥",
      癸: "寅",
    },
  },
  옥여: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      甲: "辰",
      乙: "巳",
      庚: "戌",
      辛: "亥",
   },
  },
  구인: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      丙: "子",
      丁: "丑",
      戊: "子",
      己: "丑",
      壬: "午",
      癸: "未",
   },
  },
  광음: {
    type: "criteria",
    base: "dayGan",
    target: "ji",
    rules: {
      戊: "戌",
      庚: ["辰", "戌"],
      壬: "戌戌",
   },
  }
  ,
  // 공망살: 60갑자 6개 갑(甲) 시작 순서 기준으로 공망 지지 2개를 판정
  공망: { type: "gongmang" }
}