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
  sinsal: string[];
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
  sinsal: { year: string[]; month: string[]; day: string[]; hour: string[] };
  napeum: NapeumResult;
  currentDaewoon: Daewoon | null;
  currentSewoon: SewoonData;
  daewoonFull: Daewoon[];
}

// --- 해석 결과 타입 정의 ---
export interface InterpretationResult {
  dayMasterNature: { base: string; custom: string | null };
  dayMasterCharacter: string;
  sipsinAnalysis: string;
  sibiwunseongAnalysis: string;
  sinsalAnalysis: string;
  combinationAnalysis: string[];
  hwaEuiPrompt: string;
}

// --- 최종 결과물 타입 정의 ---
export interface FortuneResult {
  sajuData: SajuData;
  interpretation: InterpretationResult;
}
