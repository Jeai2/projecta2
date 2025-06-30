// src/types/fortune.d.ts

// 이 타입들은 server/src/controllers/fortune.controller.ts 파일에 정의된 타입과
// 정확히 일치해야 합니다.

// 납음오행
export interface NapeumOhengElement {
  name: string;
  oheng: "木" | "火" | "土" | "金" | "水";
  description: string;
}

export interface NapeumResult {
  year: NapeumOhengElement | null;
  month: NapeumOhengElement | null;
  day: NapeumOhengElement | null;
  hour: NapeumOhengElement | null;
}

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

// 십성
export interface SipsinPillar {
  gan: string | null;
  ji: string | null;
}

export interface SinsalHit {
  name: string;
  elements: StarElement[];
}

// 십이운성
export interface SibiwunseongPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

// 신살
export interface SinsalResult {
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
}

// 대운
export interface Daewoon {
  age: number;
  year: number;
  ganji: string;
  sipsin: { gan: string | null; ji: string | null };
  sibiwunseong: string | null;
}

// 세운
export interface SewoonData {
  year: number;
  ganji: string;
  sipsin: { gan: string | null; ji: string | null };
  sibiwunseong: string | null;
}

// 전체 사주 데이터
export interface SajuData {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  sipsin: {
    year: SipsinPillar;
    month: SipsinPillar;
    day: SipsinPillar;
    hour: SipsinPillar;
  };
  sibiwunseong: SibiwunseongPillars;
  sinsal: SinsalResult;
  napeum: NapeumResult;
  currentDaewoon: Daewoon | null;
  currentSewoon: SewoonData;
  daewoonFull: Daewoon[];
}

// 전체 해석 결과
export interface InterpretationResult {
  dayMasterNature: { base: string; custom: string | null };
  dayMasterCharacter: string;
  hwaEuiPrompt: string;
  sipsinAnalysis: string; // ✅ 백엔드와 동일하게 string 타입으로 수정
  sibiwunseongAnalysis: string; // ✅ 백엔드와 동일하게 string 타입으로 수정
  sinsalAnalysis: StarData[]; // 이 타입도 string일 가능성이 높으므로 함께 수정합니다.
  gilsinAnalysis: StarData[]; // 길신 데이터
  combinationAnalysis: string[];
}

// AI 응답
export interface AiGeneratedOutput {
  refinedText: string;
  imageUrl: string;
}

// API 성공 시 최종 응답 데이터 전체
export interface FortuneResponseData {
  userInfo: { birthDate: string; gender: "M" | "W" };
  saju: {
    sajuData: SajuData;
    interpretation: InterpretationResult;
  };
  aiResponse: AiGeneratedOutput | null;
}

// ✅ [추가] '살'을 구성하는 개별 요소의 상세 정보 타입
export interface SinsalElement {
  pillar: "년주" | "월주" | "일주" | "시주"; // 어느 기둥인지
  type: "천간" | "지지"; // 천간인지 지지인지
  character: string; // 실제 글자 (예: '巳')
}

// '살의' 섹션의 개별 카드 데이터 타입
export interface StarData {
  name: string; // 살의 이름 (예: "귀문관살")
  description: string; // 한 줄 요약
  details: string; // 상세 정의
  elements: StarElement[]; // 구성 요소 (예: ["巳", "戌"])
  illustration: string; // 일러스트 이미지 경로
}
