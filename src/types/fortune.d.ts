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
  sinsal: string[];
}

// 십성
export interface SipsinPillar {
  gan: string | null;
  ji: string | null;
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
  sibiunseongAnalysis: string; // ✅ 백엔드와 동일하게 string 타입으로 수정
  sinsalAnalysis: string; // 이 타입도 string일 가능성이 높으므로 함께 수정합니다.
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
