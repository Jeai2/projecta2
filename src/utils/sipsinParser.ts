// src/utils/sipsinParser.ts
// relationships string[] → UI용 구조화 파서

import type { PillarData } from "@/types/fortune";

// ── 오행 매핑 ────────────────────────────────────────────────────────────

export const GAN_TO_OHAENG: Record<string, string> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

export const JI_TO_OHAENG: Record<string, string> = {
  寅: "木", 卯: "木",
  巳: "火", 午: "火",
  辰: "土", 戌: "土", 丑: "土", 未: "土",
  申: "金", 酉: "金",
  亥: "水", 子: "水",
};

/** 천간 한글 → 한자 (당령·사령 표시용) */
export const GAN_HANGUL_TO_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

/** 기둥 영문 → 한국어 */
export const PILLAR_KO: Record<string, string> = {
  year: "년주", month: "월주", day: "일주", hour: "시주",
  daewoon: "대운",
};

// ── 타입 ─────────────────────────────────────────────────────────────────

export interface ParsedRel {
  char1: string;
  ohaeng1: string;
  sipsin1: string | null;
  pillar1: string;
  char2: string;
  ohaeng2: string;
  sipsin2: string | null;
  pillar2: string;
}

type PillarsMap = {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  hour: PillarData;
  daewoon?: PillarData;
};

// ── 파서 ─────────────────────────────────────────────────────────────────

/** "壬丁(day-month)" 형식 → { char1, char2, pillar1, pillar2 } */
function parseRelStr(str: string): { char1: string; char2: string; pillar1: string; pillar2: string } | null {
  const match = str.match(/^(.)(.)\((.+)-(.+)\)$/);
  if (!match) return null;
  return { char1: match[1], char2: match[2], pillar1: match[3], pillar2: match[4] };
}

/** 천간 관계 파싱 (cheonganhap, cheonganchung) */
export const parseGanRel = (str: string, pillars: PillarsMap): ParsedRel | null => {
  const parsed = parseRelStr(str);
  if (!parsed) return null;
  const { char1, char2, pillar1, pillar2 } = parsed;
  const p1 = pillars[pillar1 as keyof PillarsMap];
  const p2 = pillars[pillar2 as keyof PillarsMap];
  if (!p1 || !p2) return null;
  return {
    char1, ohaeng1: GAN_TO_OHAENG[char1] ?? "", sipsin1: p1.ganSipsin, pillar1,
    char2, ohaeng2: GAN_TO_OHAENG[char2] ?? "", sipsin2: p2.ganSipsin, pillar2,
  };
};

/** 지지 관계 파싱 (yukhap, samhap, banghap, amhap, yukchung, yukhyung, yukpa, yukae) */
export const parseJiRel = (str: string, pillars: PillarsMap): ParsedRel | null => {
  const parsed = parseRelStr(str);
  if (!parsed) return null;
  const { char1, char2, pillar1, pillar2 } = parsed;
  const p1 = pillars[pillar1 as keyof PillarsMap];
  const p2 = pillars[pillar2 as keyof PillarsMap];
  if (!p1 || !p2) return null;
  return {
    char1, ohaeng1: JI_TO_OHAENG[char1] ?? "", sipsin1: p1.jiSipsin, pillar1,
    char2, ohaeng2: JI_TO_OHAENG[char2] ?? "", sipsin2: p2.jiSipsin, pillar2,
  };
};

/** 천간합 기준으로 동결된 기둥 키 반환 */
export const getFrozenPillarKeys = (cheonganhap: string[]): Set<string> => {
  const frozen = new Set<string>();
  cheonganhap.forEach((str) => {
    const match = str.match(/\((.+)-(.+)\)/);
    if (match) {
      frozen.add(match[1]);
      frozen.add(match[2]);
    }
  });
  return frozen;
};
