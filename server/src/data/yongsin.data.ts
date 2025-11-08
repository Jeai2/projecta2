// server/src/data/yongsin.data.ts
// 용신 시스템 전용 데이터 파일

// =================================================================
// 용신 시스템 인터페이스 정의
// =================================================================

// 개별 Tier 분석 결과
export interface TierAnalysis {
  tier: number; // 1~6
  name: string; // "전왕용신", "조후용신" 등
  isDominant: boolean; // 이 Tier가 주체가 될 수 있는가?
  yongsin: string; // 결정된 용신 천간 (단일)
  confidence: number; // 확신도 (0-100)
  reason: string; // 선정 이유
  details?: Record<string, unknown>; // 추가 분석 데이터
}

// 최종 용신 결과
export interface YongsinResult {
  primaryYongsin: string; // 최종 선정된 용신 천간 (단일)
  selectedTier: TierAnalysis | null; // 선정된 Tier 분석 결과
  allAnalyses: TierAnalysis[]; // 전체 Tier 분석 결과
  confidence: number; // 최종 확신도
  summary: string; // 요약 설명
}

// 오행 카운트 인터페이스
export interface OhaengCount {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
  total: number;
}

// =================================================================
// Tier별 판단 기준값
// =================================================================

// Tier 3: 전왕용신 (從格) 기준
export const JEONWANG_CRITERIA = {
  // 기본 조건 (가장 엄격)
  BASIC: {
    MIN_SCORE_RANGE: [0.0, 1.25], // 극약 구간
    MAX_SCORE_RANGE: [8.75, 10.0], // 극강 구간
    PURITY_THRESHOLD: 0.75, // 75% 이상
    MIN_DOMINANT_COUNT: 6, // 8개 중 6개 이상
  },

  // 변수 조건 1 (중간 엄격)
  VARIABLE1: {
    MIN_SCORE_RANGE: [1.25, 3.75], // 약 구간
    MAX_SCORE_RANGE: [6.25, 8.75], // 강 구간
    PURITY_THRESHOLD: 0.5, // 50% 이상
    MIN_DOMINANT_COUNT: 4, // 8개 중 4개 이상
    REQUIRES_HAPHWA: true, // 천간합/지지합 필요
  },

  // 변수 조건 2 (가장 완화)
  VARIABLE2: {
    MIN_SCORE_RANGE: [3.75, 5.0], // 중약 구간
    MAX_SCORE_RANGE: [5.0, 6.25], // 중강 구간
    PURITY_THRESHOLD: 0.35, // 35% 이상
    MIN_DOMINANT_COUNT: 3, // 8개 중 3개 이상
    REQUIRES_HAPHWA: true, // 천간합/지지합 필요
    REQUIRES_DAEWOON: true, // 대운 지원 필요
  },
};

// Tier 2: 조후용신 (調候) 기준 - 강화 버전
export const JOHU_CRITERIA = {
  // 기후 불균형 판단 기준
  DOMINANT_THRESHOLD: 45, // 한 기후가 45% 이상이면 극단적
  DIFFERENCE_THRESHOLD: 15, // 1위-2위 차이가 15% 이상이면 불균형

  // 위치별 가중치 (지지)
  POSITION_WEIGHTS: {
    YEAR: 5, // 년지
    MONTH: 10, // 월지 (가장 중요)
    DAY: 3, // 일지
    HOUR: 1, // 시지
  },

  // 천간 기여도 (위치 불문)
  GAN_WEIGHTS: {
    壬: 3,
    辛: 3, // 임, 신 → 한 (가중치 3)
    丙: 3,
    乙: 3, // 병, 을 → 난 (가중치 3)
    丁: 3,
    庚: 3, // 정, 경 → 조 (가중치 3)
    癸: 3,
    甲: 3, // 계, 갑 → 습 (가중치 3)
    戊: 1,
    己: 1, // 무, 기 → 중립 (가중치 1)
  },

  // 천간 → 기후 매핑
  GAN_CLIMATE_MAP: {
    壬: "寒",
    辛: "寒", // 임, 신 → 한
    丙: "暖",
    乙: "暖", // 병, 을 → 난
    丁: "燥",
    庚: "燥", // 정, 경 → 조
    癸: "濕",
    甲: "濕", // 계, 갑 → 습
    戊: "燥",
    己: "燥", // 무, 기 → 조 (토는 습기 흡수)
  },

  // 지지 → 기후 성질 매핑 (복합 가능)
  JI_CLIMATE_MAP: {
    亥: ["寒", "燥"],
    子: ["寒"],
    丑: ["寒", "濕"],
    寅: ["寒", "濕"],
    卯: ["濕"],
    辰: ["暖", "濕"],
    巳: ["暖", "濕"],
    午: ["暖"],
    未: ["暖", "燥"],
    申: ["暖", "燥"],
    酉: ["燥"],
    戌: ["寒", "燥"],
  },

  // 기후별 권장 용신 매핑
  CLIMATE_YONGSIN_MAP: {
    寒: ["火"], // 한 과다 → 화 (온화)
    暖: ["水"], // 난 과다 → 수 (식혀줌)
    燥: ["水"], // 조 과다 → 수 (촉촉하게)
    濕: ["火", "土"], // 습 과다 → 화+토 (말리고 흡수)
  },
};

// Tier 4: 병약용신 (病藥) 기준
export const BYEONGYAK_CRITERIA = {
  // 고립 기준 (특정 천간/지지가 적군에게 포위된 상태)
  ISOLATION: {
    MIN_ENEMY_DIRECTIONS: 2, // 최소 2방향 이상에서 적군
    CHECK_POSITIONS: ["prev", "next", "same"], // 앞기둥, 뒤기둥, 같은기둥지지
  },

  // 과다 기준 (특정 오행이 과도하게 많음) - 우선순위별
  EXCESS: {
    // 우선순위 1: 3개 + 간여지동 + 연속배치
    PRIORITY_1: {
      MIN_COUNT: 3,
      REQUIRES_GANYJIDONG: true,
      REQUIRES_CONSECUTIVE: true, // 붙어있는 같은 오행
    },

    // 우선순위 2: 우선순위1 + 생해주는 오행 1개 이하
    PRIORITY_2: {
      MIN_COUNT: 3,
      REQUIRES_GANYJIDONG: true,
      REQUIRES_CONSECUTIVE: true,
      MAX_SUPPORTING_OHAENG: 1, // 생해주는 오행 1개 이하
    },

    // 우선순위 3: 단순 개수
    PRIORITY_3: {
      MIN_COUNT: 4,
    },
  },
};

// Tier 5: 통관용신 (通關) 기준
export const TONGGWAN_CRITERIA = {
  // 대치 세력 기준
  CONFLICT_MIN_COUNT: 3, // 각 세력이 최소 3개 이상
  BALANCE_TOLERANCE: 1, // 세력 차이가 1개 이하면 팽팽한 대치

  // 극하는 관계 매핑
  CONFLICT_RELATIONS: {
    木土: { conflicting: ["木", "土"], mediator: "火" }, // 木剋土 → 火通關
    火金: { conflicting: ["火", "金"], mediator: "土" }, // 火剋金 → 土通關
    土水: { conflicting: ["土", "水"], mediator: "金" }, // 土剋水 → 金通關
    金木: { conflicting: ["金", "木"], mediator: "水" }, // 金剋木 → 水通關
    水火: { conflicting: ["水", "火"], mediator: "木" }, // 水剋火 → 木通關
  },
};

// Tier 1: 억부용신 (抑扶) 기준 (디폴트)
export const EOKBU_CRITERIA = {
  // 신강신약 점수 기준 (새 35점 체계)
  WEAK_THRESHOLD: 14.0, // 14.0 미만 = 약함 (태약+신약) → 扶 (도움 필요)
  STRONG_THRESHOLD: 21.0, // 21.0 초과 = 강함 (신강+태강+극왕) → 抑 (억제 필요)

  // 부조 오행 (도움을 주는 오행)
  SUPPORT_RELATIONS: {
    木: ["水", "木"], // 木을 돕는 오행: 水生木, 木比助
    火: ["木", "火"], // 火를 돕는 오행: 木生火, 火比助
    土: ["火", "土"], // 土를 돕는 오행: 火生土, 土比助
    金: ["土", "金"], // 金을 돕는 오행: 土生金, 金比助
    水: ["金", "水"], // 水를 돕는 오행: 金生水, 水比助
  },

  // 억제 오행 (억제하는 오행)
  SUPPRESS_RELATIONS: {
    木: ["金", "土"], // 木을 억제: 金剋木, 木剋土(설기)
    火: ["水", "金"], // 火를 억제: 水剋火, 火剋金(설기)
    土: ["木", "水"], // 土를 억제: 木剋土, 土剋水(설기)
    金: ["火", "木"], // 金을 억제: 火剋金, 金剋木(설기)
    水: ["土", "火"], // 水를 억제: 土剋水, 水剋火(설기)
  },
};

// Tier 6: 격국용신 (格局) 기준 (보조적)
export const GYEOKGUK_CRITERIA = {
  // 격국 성패 요인 (추후 구현 예정)
  FORMATION_SUCCESS_FACTORS: {
    // 정관격, 정재격, 식신격 등의 성패 조건
    // 현재는 플레이스홀더
  },
};

// =================================================================
// 월지-계절 매핑 데이터
// =================================================================

export const MONTHJI_TO_SEASON: { [key: string]: string } = {
  // 춘계 (봄)
  寅: "SPRING",
  卯: "SPRING",
  辰: "SPRING",
  // 하계 (여름)
  巳: "SUMMER",
  午: "SUMMER",
  未: "SUMMER",
  // 추계 (가을)
  申: "AUTUMN",
  酉: "AUTUMN",
  戌: "AUTUMN",
  // 동계 (겨울)
  亥: "WINTER",
  子: "WINTER",
  丑: "WINTER",
};

// =================================================================
// 오행 관계 매핑
// =================================================================

// 오행 상생 관계
export const OHAENG_SAENGSAENG: { [key: string]: string } = {
  木: "火", // 木生火
  火: "土", // 火生土
  土: "金", // 土生金
  金: "水", // 金生水
  水: "木", // 水生木
};

// 오행 상극 관계
export const OHAENG_SANGGEUK: { [key: string]: string } = {
  木: "土", // 木剋土
  火: "金", // 火剋金
  土: "水", // 土剋水
  金: "木", // 金剋木
  水: "火", // 水剋火
};

// =================================================================
// 유틸리티 함수
// =================================================================

/**
 * 사주 pillars에서 오행 개수를 계산합니다
 */
export function countOhaeng(
  pillars: Record<string, { ganOhaeng?: string; jiOhaeng?: string }>
): OhaengCount {
  const count: OhaengCount = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
    total: 0,
  };

  // 각 기둥의 천간+지지 오행을 카운트
  Object.values(pillars).forEach(
    (pillar: { ganOhaeng?: string; jiOhaeng?: string }) => {
      if (pillar.ganOhaeng) {
        count[pillar.ganOhaeng as keyof OhaengCount]++;
        count.total++;
      }
      if (pillar.jiOhaeng) {
        count[pillar.jiOhaeng as keyof OhaengCount]++;
        count.total++;
      }
    }
  );

  return count;
}

/**
 * 사주 데이터에서 오행 개수를 계산합니다 (countOhaengInSaju)
 * 실제 구현은 yongsin.service.ts에서 GAN_TO_OHAENG, JI_TO_OHAENG을 import해서 사용
 */
export function countOhaengInSaju(): {
  counts: Record<string, number>;
  total: number;
} {
  // 이 함수는 yongsin.service.ts에서 실제 구현됨
  return { counts: { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }, total: 0 };
}

/**
 * 월지로부터 계절을 판단합니다
 */
export function getSeasonFromMonthJi(monthJi: string): string {
  return MONTHJI_TO_SEASON[monthJi] || "UNKNOWN";
}

/**
 * 특정 오행이 고립되었는지 확인합니다
 */
export function isOhaengIsolated(
  ohaengCount: OhaengCount,
  targetOhaeng: keyof OhaengCount
): boolean {
  return ohaengCount[targetOhaeng] === 0;
}

/**
 * 특정 오행의 위치들이 연속적으로 붙어있는지 확인
 */
export function isOhaengConsecutive(positions: number[]): boolean {
  if (positions.length < 2) return true; // 1개 이하는 항상 연속

  const sorted = [...positions].sort((a, b) => a - b);

  // 1) 천간끼리 연속인지 확인 (0,2,4,6)
  const ganPositions = sorted.filter((p) => p % 2 === 0);
  if (ganPositions.length >= 2) {
    let ganConsecutive = true;
    for (let i = 1; i < ganPositions.length; i++) {
      if (ganPositions[i] - ganPositions[i - 1] !== 2) {
        ganConsecutive = false;
        break;
      }
    }
    if (ganConsecutive && ganPositions.length === positions.length) return true;
  }

  // 2) 지지끼리 연속인지 확인 (1,3,5,7)
  const jiPositions = sorted.filter((p) => p % 2 === 1);
  if (jiPositions.length >= 2) {
    let jiConsecutive = true;
    for (let i = 1; i < jiPositions.length; i++) {
      if (jiPositions[i] - jiPositions[i - 1] !== 2) {
        jiConsecutive = false;
        break;
      }
    }
    if (jiConsecutive && jiPositions.length === positions.length) return true;
  }

  // 3) 위치상 연속인지 확인 (혼합)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) {
      return false;
    }
  }
  return true;
}

/**
 * 특정 오행이 과다한지 확인합니다 (기존 단순 버전)
 */
export function isOhaengExcess(
  ohaengCount: OhaengCount,
  targetOhaeng: keyof OhaengCount
): boolean {
  const count = ohaengCount[targetOhaeng];
  const ratio = count / ohaengCount.total;
  return (
    count >= BYEONGYAK_CRITERIA.EXCESS.PRIORITY_3.MIN_COUNT || ratio >= 0.5 // 50% 이상
  );
}

/**
 * 두 오행이 상극 관계인지 확인합니다
 */
export function isConflictingOhaeng(ohaeng1: string, ohaeng2: string): boolean {
  return (
    OHAENG_SANGGEUK[ohaeng1] === ohaeng2 || OHAENG_SANGGEUK[ohaeng2] === ohaeng1
  );
}

/**
 * 타겟 오행이 다른 오행에게 극당하는지 확인 (적군 판단)
 */
export function isEnemyToTarget(
  targetOhaeng: string,
  otherOhaeng: string
): boolean {
  // 나를 극하는 오행인지 확인
  return OHAENG_SANGGEUK[otherOhaeng] === targetOhaeng;
}

/**
 * 타겟 오행과 같거나 생해주는 오행인지 확인 (아군 판단)
 */
export function isFriendToTarget(
  targetOhaeng: string,
  otherOhaeng: string
): boolean {
  // 같은 오행이거나 나를 생해주는 오행
  if (targetOhaeng === otherOhaeng) return true;

  // 생생 관계 확인
  return OHAENG_SAENGSAENG[otherOhaeng] === targetOhaeng;
}

/**
 * 특정 오행이 간여지동 보너스를 받는 위치들을 확인
 */
export function getGanyjidongPositions(
  targetOhaeng: string,
  pillars: Array<{ gan: string; ji: string }>
): number[] {
  const ganyjidongPositions: number[] = [];

  // GAN_OHENG, JI_OHENG를 import해서 사용해야 하지만,
  // 순환 참조를 피하기 위해 여기서는 직접 매핑 사용
  const GAN_TO_OHAENG: Record<string, string> = {
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

  const JI_TO_OHAENG: Record<string, string> = {
    子: "水",
    丑: "土",
    寅: "木",
    卯: "木",
    辰: "土",
    巳: "火",
    午: "火",
    未: "土",
    申: "金",
    酉: "金",
    戌: "土",
    亥: "水",
  };

  pillars.forEach((pillar, index) => {
    const ganOhaeng = GAN_TO_OHAENG[pillar.gan];
    const jiOhaeng = JI_TO_OHAENG[pillar.ji];

    // 천간과 지지가 모두 타겟 오행과 같으면 간여지동
    if (ganOhaeng === targetOhaeng && jiOhaeng === targetOhaeng) {
      ganyjidongPositions.push(index * 2); // 천간 위치
      ganyjidongPositions.push(index * 2 + 1); // 지지 위치
    }
  });

  return ganyjidongPositions;
}

/**
 * 특정 오행을 생해주는 오행들의 개수를 확인
 */
export function countSupportingOhaengs(
  targetOhaeng: string,
  ohaengCount: { counts: Record<string, number>; total: number }
): number {
  let supportCount = 0;

  // 생생 관계에서 타겟을 생해주는 오행들 찾기
  Object.entries(OHAENG_SAENGSAENG).forEach(
    ([supportingOhaeng, resultOhaeng]) => {
      if (
        resultOhaeng === targetOhaeng &&
        ohaengCount.counts[supportingOhaeng] > 0
      ) {
        supportCount += ohaengCount.counts[supportingOhaeng];
      }
    }
  );

  return supportCount;
}
