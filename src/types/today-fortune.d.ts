// src/types/today-fortune.d.ts
// 오늘의 운세(일진 기반) 전용 타입 정의

export interface IljinData {
  date: string; // YYYY-MM-DD 형식
  ganji: string; // 일진 간지 (예: "甲子")
  gan: string; // 천간
  ji: string; // 지지
  ohaeng: {
    gan: "木" | "火" | "土" | "金" | "水"; // 천간 오행
    ji: "木" | "火" | "土" | "金" | "水"; // 지지 오행
  };
  direction: "東" | "西" | "南" | "北" | "中央"; // 방향
  color: string; // 길한 색상
  number: string; // 길한 숫자
  time: {
    good: string[]; // 좋은 시간대
    bad: string[]; // 피해야 할 시간대
  };
}

export interface IljinFortune {
  summary: string; // 일진 요약
  general: string; // 일반적인 운세
  work: string; // 업무/사업 운세
  love: string; // 연애/인간관계 운세
  health: string; // 건강 운세
  money: string; // 재물 운세
  relations: string; // 인간관계 운세
  documents: string; // 문서/계약 운세
  advice: string; // 오늘의 조언
  lucky: {
    direction: string; // 길한 방향
    color: string; // 길한 색상
    number: string; // 길한 숫자
    time: string; // 길한 시간대
  };
  avoid: {
    direction: string; // 피해야 할 방향
    color: string; // 피해야 할 색상
    time: string; // 피해야 할 시간대
  };
}

export interface LukimComponent {
  type: "birthYearGan" | "birthYearJi" | "dayGan" | "hourJi";
  label: string;
  symbol: string;
  value: number;
}

export interface LukimFortune {
  value: number;
  summary: string;
  components: LukimComponent[];
}

export interface TodayFortuneResponse {
  userInfo: {
    name?: string;
    birthDate: string;
    gender: "M" | "W";
    calendarType: "solar" | "lunar";
    birthTime?: string;
    timeUnknown?: boolean;
  };
  iljin: IljinData;
  fortune: IljinFortune;
  sipsinOfToday?: {
    dayGan: string; // 사용자 일간
    gan?: string | null; // 일진 천간의 십성
    ji?: string | null; // 일진 지지의 십성
  };
  compatibility?: {
    ganCompatibility: number;
    jiCompatibility: number;
    harmonyBonus: number;
    daewoonSupport: number;
    totalScore: number;
    analysis: {
      ganRelation: string;
      jiRelation: string;
      specialHarmony: string[];
      daewoonEffect: string;
    };
  };
  lukim?: LukimFortune | null;
  generatedAt: string; // 생성 시간
}
