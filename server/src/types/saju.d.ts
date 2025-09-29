// server/src/types/saju.d.ts (신규 생성)

// --- 데이터 타입 정의 ---
export interface PillarData {
  gan: string;
  ji: string;
  ganOhaeng: string;
  jiOhaeng: string;
  ganSipsin: string | null;
  jiSipsin: string | null;
  sibiwunseong: string;
  sinsal: SinsalHit[];
}

export interface StarElement {
  pillar: "year" | "month" | "day" | "hour" | "daewoon" | "sewoon";
  type: "gan" | "ji";
  character: string;
}

export interface SinsalHit {
  name: string;
  elements: StarElement[];
}

// 지지 간 관계 타입 정의
export interface RelationshipResult {
  cheonganhap: string[]; // 천간합 관계
  cheonganchung: string[]; // 천간충 관계
  yukhap: string[]; // 육합 관계
  samhap: string[]; // 삼합 관계
  amhap: string[]; // 암합 관계
  banghap: string[]; // 방합 관계
  yukchung: string[]; // 육충 관계
  yukhyung: string[]; // 육형 관계
  yukpa: string[]; // 육파 관계
  yukae: string[]; // 육해 관계
}

export interface RelationshipDetail {
  type: string; // 관계 유형 (yukhap, samhap, etc.)
  ji1: string; // 첫 번째 지지
  ji2: string; // 두 번째 지지
  pillar1: string; // 첫 번째 기둥 (year, month, day, hour)
  pillar2: string; // 두 번째 기둥
}

export interface StarData {
  name: string;
  type: "길신" | "흉살";
  description: string;
  details: string;
  elements: StarElement[];
  illustration: string;
}

export interface SajuData {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  sipsin: {
    year: { gan: string | null; ji: string | null };
    month: { gan: string | null; ji: string | null };
    day: { gan: string | null; ji: string | null };
    hour: { gan: string | null; ji: string | null };
  };
  sibiwunseong: { year: string; month: string; day: string; hour: string };
  sinsal: import("../services/sinsal.service").SinsalResult; // ✅ sinsal.service의 결과 타입을 직접 사용
  napeum: NapeumResult;
  jijanggan: { year: string[]; month: string[]; day: string[]; hour: string[] }; // ✅ 지장간 데이터 추가
  relationships?: RelationshipResult; // ✅ 지지 간 관계 데이터 추가 (선택적)
  wangseStrength?: import("../services/wangse-strength.service").WangseResult; // ✅ 왕쇠강약 분석 추가 (선택적)
  currentDaewoon: Daewoon | null;
  currentSewoon: SewoonData;
  daewoonFull: Daewoon[];
  currentWoolwoon: import("../services/woolwoon.service").WoolwoonData[];
  nextYearWoolwoon: import("../services/woolwoon.service").WoolwoonData[];
}

export interface Trait {
  name: string; // 특징의 이름 (예: "강력한 리더십")
  source: string; // 근거가 되는 사주 요소 (예: "일간 甲목")
  description: string; // 해당 특징에 대한 설명
}

export interface DayPillarContent {
  title: string;
  symbol: string;
  keywords: string[];
  personality: {
    summary: string;
    strengths: string;
    weaknesses: string;
  };
  lifeTheme: {
    wealth: string;
    love: string;
    spouse: string;
    health: string;
    career: string;
  };
  advice: string;
}

export interface DayPillarInterpretation {
  title: string; // 예: "갑자(甲子) 일주"
  imageUrl: string; // 일주를 상징하는 이미지 URL
  summary: string; // 일주에 대한 한 줄 요약
  detailedAnalysis: {
    dayGan: string; // 일간(甲)의 특징 요약
    dayJi: string; // 일지(子)의 특징 요약
    interaction: string; // 일간과 일지의 관계(십신, 십이운성 등)로 본 핵심 해석
  };
  advice: string; // 해당 일주를 위한 조언
}

export interface PersonalityInterpretation {
  summary: string; // 성격 종합 요약
  positiveTraits: Trait[]; // 긍정적 성향 목록
  negativeTraits: Trait[]; // 보완할 점 목록
  advice: string; // 종합 조언
}

// --- 해석 결과 타입 정의 ---
export interface InterpretationResult {
  dayMasterNature: { base: string; custom: string | null };
  dayMasterCharacter: string;
  sipsinAnalysis: string;
  sibiwunseongAnalysis: string;
  combinationAnalysis: string[];
  hwaEuiPrompt: string;
  sinsalAnalysis: StarData[];
  gilsinAnalysis: StarData[];
  personality: PersonalityInterpretation;
  dayPillar?: DayPillarContent;
}

// --- 최종 결과물 타입 정의 ---
export interface FortuneResult {
  sajuData: SajuData;
  interpretation: InterpretationResult;
}
