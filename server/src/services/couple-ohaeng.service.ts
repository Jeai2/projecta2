// server/src/services/couple-ohaeng.service.ts
// 커플 궁합 - 오행 분석 서비스
// ─────────────────────────────────────────────────────────────────────────────
// 두 사람의 사주원국 오행을 산출하고, 합(合) 보정 후
// 서로 부족한 오행을 채워줄 수 있는지 판단합니다.
// ─────────────────────────────────────────────────────────────────────────────

import { getSipsin } from "./sipsin.service";

// ══════════════════════════════════════════════════════════════════════════════
// 타입 정의
// ══════════════════════════════════════════════════════════════════════════════

export type OhaengType = "木" | "火" | "土" | "金" | "水";

export interface OhaengCount {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

export interface HapDetail {
  /** 합의 종류 */
  type: "삼합" | "반합" | "방합" | "반방합" | "육합";
  /** 합을 이루는 지지 글자들 */
  characters: string[];
  /** 합화 결과 오행 */
  result: OhaengType;
  /** 합 이름 (예: "인오술삼합") */
  resultName: string;
  /** 부여되는 보너스 카운트 */
  bonus: number;
}

export interface PersonOhaengAnalysis {
  /** 사주원국 8글자(천간4 + 지지4) 기본 오행 개수 */
  baseCount: OhaengCount;
  /** 합(合)으로 인한 오행 보정 개수 */
  hapBonus: OhaengCount;
  /** 기본 + 보정 합계 */
  totalCount: OhaengCount;
  /** totalCount가 0인 오행 (부족) */
  lacking: OhaengType[];
  /** totalCount >= 3인 오행 (과다) */
  excess: OhaengType[];
  /** 발견된 합 상세 */
  hapDetails: HapDetail[];
}

export interface OhaengFillInfo {
  /** 부족한 오행 */
  ohaeng: OhaengType;
  /** 상대방이 이 오행을 가지고 있어 채울 수 있는가 */
  canFill: boolean;
  /** 채우는 측의 해당 오행 총 개수 */
  fillerCount: number;
}

export interface CoupleOhaengCompatibility {
  /** 내가 부족한 오행 → 상대가 채울 수 있는지 각각 */
  partnerFillsMine: OhaengFillInfo[];
  /** 상대가 부족한 오행 → 내가 채울 수 있는지 각각 */
  iFillPartner: OhaengFillInfo[];
  /** 두 사람 모두 없는 오행 (서로 채울 수 없음) */
  bothLacking: OhaengType[];
  /** 오행 보완 지수 0–100 */
  complementScore: number;
  /** 한 줄 요약 */
  summary: string;
}

// ── 일지 분석 ─────────────────────────────────────────────────────────────────

export interface IljiPersonResult {
  /** 긍정 / 부정 / 중립 */
  sentiment: "긍정" | "부정" | "중립";
  reason: string;
}

export interface IljiAnalysisResult {
  /** 일지-일지 관계 유형 (우선순위 적용 후 하나) */
  relationshipType: "충" | "방합" | "삼합" | "애증" | "형" | "원진" | "귀문" | "없음";
  /** 관계에서 기준이 되는 오행 (충·합 계열에만 존재) */
  targetOhaeng: OhaengType | null;
  my: IljiPersonResult;
  partner: IljiPersonResult;
  summary: string;
}

// ── 일간 인력/척력 ────────────────────────────────────────────────────────────

export interface IlganCompatibilityResult {
  myAttractsPartner: boolean;
  partnerAttractsMe: boolean;
  myRepelsPartner: boolean;
  partnerRepelsMe: boolean;
  /** 세부 결과 */
  result: "쌍방인력" | "단방인력" | "쌍방척력" | "단방척력" | "인척혼재" | "중립";
  /** 화면 표기용 */
  label: "인력" | "척력" | "중립";
}

export interface CoupleOhaengResult {
  my: PersonOhaengAnalysis;
  partner: PersonOhaengAnalysis;
  compatibility: CoupleOhaengCompatibility;
  ilji: IljiAnalysisResult;
  ilgan: IlganCompatibilityResult;
}

/** 컨트롤러 → 서비스로 전달하는 요청 타입 */
export interface PillarInput {
  gan: string;       // 천간 한자 (예: 甲)
  ji: string;        // 지지 한자 (예: 子)
  ganOhaeng: string; // 천간 오행 (예: 木)
  jiOhaeng: string;  // 지지 오행 (예: 水)
}

export interface PillarsInput {
  year: PillarInput;
  month: PillarInput;
  day: PillarInput;
  hour: PillarInput;
}

export interface CoupleOhaengRequest {
  myPillars: PillarsInput;
  partnerPillars: PillarsInput;
  myGender: "M" | "W";
  partnerGender: "M" | "W";
}

// ══════════════════════════════════════════════════════════════════════════════
// 내부 상수 — 합(合) 조합표
// ══════════════════════════════════════════════════════════════════════════════

const OHAENG_LIST: OhaengType[] = ["木", "火", "土", "金", "水"];

/** 방합 (방향합, 3자 완전): 보너스 +2 */
const BANGHAP_GROUPS: [string, string, string, OhaengType, string][] = [
  ["寅", "卯", "辰", "木", "인묘진방합"],
  ["巳", "午", "未", "火", "사오미방합"],
  ["申", "酉", "戌", "金", "신유술방합"],
  ["亥", "子", "丑", "水", "해자축방합"],
];

/** 삼합 (3자 완전): 보너스 +2 */
const SAMHAP_GROUPS: [string, string, string, OhaengType, string][] = [
  ["申", "子", "辰", "水", "신자진삼합"],
  ["寅", "午", "戌", "火", "인오술삼합"],
  ["巳", "酉", "丑", "金", "사유축삼합"],
  ["亥", "卯", "未", "木", "해묘미삼합"],
];

/**
 * 반방합 (방합에서 2자): 보너스 +1
 * — 같은 오행의 반방합이 이미 인정된 경우 중복 적용 안 함
 */
const BAN_BANGHAP_PAIRS: [string, string, OhaengType, string][] = [
  ["寅", "卯", "木", "인묘반방합"],
  ["卯", "辰", "木", "묘진반방합"],
  ["巳", "午", "火", "사오반방합"],
  ["午", "未", "火", "오미반방합"],
  ["申", "酉", "金", "신유반방합"],
  ["酉", "戌", "金", "유술반방합"],
  ["亥", "子", "水", "해자반방합"],
  ["子", "丑", "水", "자축반방합"],
];

/**
 * 반합 (삼합 중심 글자 포함 2자): 보너스 +1
 * — 중심: 水=子, 火=午, 金=酉, 木=卯
 */
const BAN_SAMHAP_PAIRS: [string, string, OhaengType, string][] = [
  ["申", "子", "水", "신자반합"],  // 水局 중심=子
  ["子", "辰", "水", "자진반합"],
  ["寅", "午", "火", "인오반합"],  // 火局 중심=午
  ["午", "戌", "火", "오술반합"],
  ["巳", "酉", "金", "사유반합"],  // 金局 중심=酉
  ["酉", "丑", "金", "유축반합"],
  ["亥", "卯", "木", "해묘반합"],  // 木局 중심=卯
  ["卯", "未", "木", "묘미반합"],
];

/** 육합 (2자 지지합): 보너스 +1 */
const YUKHAP_PAIRS: [string, string, OhaengType, string][] = [
  ["子", "丑", "土", "자축합화토"],
  ["寅", "亥", "木", "인해합화목"],
  ["卯", "戌", "火", "묘술합화화"],
  ["辰", "酉", "金", "진유합화금"],
  ["巳", "申", "水", "사신합화수"],
  ["午", "未", "火", "오미합화화"],
];

// ══════════════════════════════════════════════════════════════════════════════
// 내부 헬퍼
// ══════════════════════════════════════════════════════════════════════════════

function emptyCount(): OhaengCount {
  return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
}

// ══════════════════════════════════════════════════════════════════════════════
// 한 사람의 오행 분석
// ══════════════════════════════════════════════════════════════════════════════

function calcPersonOhaeng(pillars: PillarsInput): PersonOhaengAnalysis {
  // ── 1. 8글자 기본 오행 카운트 ──────────────────────────────────────────────
  const baseCount = emptyCount();
  const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour];

  for (const p of pillarList) {
    if (p.ganOhaeng in baseCount) baseCount[p.ganOhaeng as OhaengType]++;
    if (p.jiOhaeng in baseCount) baseCount[p.jiOhaeng as OhaengType]++;
  }

  // ── 2. 4개 지지(地支)로 합(合) 검출 ───────────────────────────────────────
  const jiSet = new Set(pillarList.map((p) => p.ji));
  const hapBonus = emptyCount();
  const hapDetails: HapDetail[] = [];

  /**
   * 우선순위: 방합 > 반방합, 삼합 > 반합
   * — 완전한 합이 인정되면 그 오행의 부분합은 중복 적용 안 함
   */
  const fullBangHapOhaeng = new Set<OhaengType>(); // 방합 성립한 오행
  const fullSamHapOhaeng = new Set<OhaengType>();  // 삼합 성립한 오행
  const banBangHapOhaeng = new Set<OhaengType>();  // 반방합 이미 인정한 오행
  const banSamHapOhaeng = new Set<OhaengType>();   // 반합 이미 인정한 오행

  // ① 방합 (3자, +2)
  for (const [a, b, c, result, name] of BANGHAP_GROUPS) {
    if (jiSet.has(a) && jiSet.has(b) && jiSet.has(c)) {
      hapBonus[result] += 2;
      hapDetails.push({
        type: "방합",
        characters: [a, b, c],
        result,
        resultName: name,
        bonus: 2,
      });
      fullBangHapOhaeng.add(result);
    }
  }

  // ② 삼합 (3자, +2)
  for (const [a, b, c, result, name] of SAMHAP_GROUPS) {
    if (jiSet.has(a) && jiSet.has(b) && jiSet.has(c)) {
      hapBonus[result] += 2;
      hapDetails.push({
        type: "삼합",
        characters: [a, b, c],
        result,
        resultName: name,
        bonus: 2,
      });
      fullSamHapOhaeng.add(result);
    }
  }

  // ③ 반방합 (2자, 방합 미성립 오행만, +1, 오행당 1회)
  for (const [a, b, result, name] of BAN_BANGHAP_PAIRS) {
    if (
      !fullBangHapOhaeng.has(result) &&
      !banBangHapOhaeng.has(result) &&
      jiSet.has(a) &&
      jiSet.has(b)
    ) {
      hapBonus[result] += 1;
      hapDetails.push({
        type: "반방합",
        characters: [a, b],
        result,
        resultName: name,
        bonus: 1,
      });
      banBangHapOhaeng.add(result);
    }
  }

  // ④ 반합 (2자, 삼합 미성립 오행만, +1, 오행당 1회)
  for (const [a, b, result, name] of BAN_SAMHAP_PAIRS) {
    if (
      !fullSamHapOhaeng.has(result) &&
      !banSamHapOhaeng.has(result) &&
      jiSet.has(a) &&
      jiSet.has(b)
    ) {
      hapBonus[result] += 1;
      hapDetails.push({
        type: "반합",
        characters: [a, b],
        result,
        resultName: name,
        bonus: 1,
      });
      banSamHapOhaeng.add(result);
    }
  }

  // ⑤ 육합 (2자, +1) — 다른 합과 중복 허용
  for (const [a, b, result, name] of YUKHAP_PAIRS) {
    if (jiSet.has(a) && jiSet.has(b)) {
      hapBonus[result] += 1;
      hapDetails.push({
        type: "육합",
        characters: [a, b],
        result,
        resultName: name,
        bonus: 1,
      });
    }
  }

  // ── 3. 합산 ───────────────────────────────────────────────────────────────
  const totalCount = emptyCount();
  for (const o of OHAENG_LIST) {
    totalCount[o] = baseCount[o] + hapBonus[o];
  }

  // ── 4. 부족 오행 (totalCount === 0) / 과다 오행 (totalCount >= 3) ─────────
  const lacking = OHAENG_LIST.filter((o) => totalCount[o] === 0);
  const excess = OHAENG_LIST.filter((o) => totalCount[o] >= 3);

  return { baseCount, hapBonus, totalCount, lacking, excess, hapDetails };
}

// ══════════════════════════════════════════════════════════════════════════════
// 두 사람 보완 관계 판단
// ══════════════════════════════════════════════════════════════════════════════

function calcCompatibility(
  my: PersonOhaengAnalysis,
  partner: PersonOhaengAnalysis,
): CoupleOhaengCompatibility {
  // 내가 부족한 오행 → 상대가 2개 이상 보유해야 채울 수 있음
  const partnerFillsMine: OhaengFillInfo[] = my.lacking.map((o) => ({
    ohaeng: o,
    canFill: partner.totalCount[o] >= 2,
    fillerCount: partner.totalCount[o],
  }));

  // 상대가 부족한 오행 → 내가 2개 이상 보유해야 채울 수 있음
  const iFillPartner: OhaengFillInfo[] = partner.lacking.map((o) => ({
    ohaeng: o,
    canFill: my.totalCount[o] >= 2,
    fillerCount: my.totalCount[o],
  }));

  // 둘 다 없는 오행
  const bothLacking = OHAENG_LIST.filter(
    (o) => my.totalCount[o] === 0 && partner.totalCount[o] === 0,
  );

  // 보완 지수 계산
  const totalLacking = my.lacking.length + partner.lacking.length;

  if (totalLacking === 0) {
    return {
      partnerFillsMine,
      iFillPartner,
      bothLacking,
      complementScore: 100,
      summary:
        "두 사람 모두 오행이 고루 갖춰져 있어, 어떤 에너지도 균형 있게 나눌 수 있습니다.",
    };
  }

  const filledCount =
    partnerFillsMine.filter((f) => f.canFill).length +
    iFillPartner.filter((f) => f.canFill).length;

  const complementScore = Math.round((filledCount / totalLacking) * 100);

  let summary: string;
  if (complementScore === 100) {
    summary =
      "서로의 부족한 오행을 완벽하게 채워주는 이상적인 보완 궁합입니다.";
  } else if (complementScore >= 70) {
    summary =
      "서로의 부족한 오행 대부분을 채워주는 좋은 보완 관계입니다.";
  } else if (complementScore >= 40) {
    summary =
      "일부 오행은 서로 채워주지만, 함께 보완해 나가야 할 부분도 있습니다.";
  } else if (complementScore > 0) {
    summary =
      "서로 채울 수 있는 오행보다 공통으로 부족한 오행이 더 많습니다.";
  } else {
    summary =
      "서로에게 부족한 오행이 겹쳐, 보완보다는 같은 결핍을 함께 갖는 관계입니다.";
  }

  return {
    partnerFillsMine,
    iFillPartner,
    bothLacking,
    complementScore,
    summary,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 일지 분석 — 상수
// ══════════════════════════════════════════════════════════════════════════════

/** 지지 → 오행 */
const JI_OHAENG_MAP: Record<string, OhaengType> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

/** 충 쌍 */
const CHUNG_PAIRS: [string, string][] = [
  ["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"],
];

/**
 * 형 쌍 (2글자 조합)
 * — 寅申(충), 丑未(충), 巳申(육합/애증)은 우선순위 상위에서 처리되므로
 *   실질적으로 도달하는 쌍은 寅巳 / 丑戌 / 戌未 / 子卯
 */
const HYUNG_PAIRS: [string, string][] = [
  ["寅", "巳"], ["巳", "申"],  // 寅巳申 삼형
  ["丑", "戌"], ["戌", "未"],  // 丑戌未 삼형
  ["子", "卯"],                // 자묘 상형
];
/** 자형 대상 지지 (같은 글자끼리 형) */
const SELF_HYUNG_CHARS = new Set(["辰", "午", "酉", "亥"]);

/** 원진 쌍 */
const WONJIN_PAIRS: [string, string][] = [
  ["子", "未"], ["丑", "午"], ["寅", "酉"], ["卯", "申"], ["辰", "亥"], ["巳", "戌"],
];

/** 귀문관살 쌍 (데이터 기준) */
const GWIMUN_PAIRS: [string, string][] = [
  ["子", "酉"], ["丑", "午"], ["寅", "未"], ["卯", "申"], ["辰", "亥"], ["巳", "戌"],
];

/** 현침살 — ganji (천간+지지) 기준 */
const HYUN_CHIM_SAL_SET = new Set([
  "甲申", "甲午", "辛未", "辛卯", "甲子", "甲戌", "甲辰", "甲寅",
  "乙卯", "丁卯", "己卯", "丙申", "庚申", "壬申", "戊午",
  "辛巳", "辛丑", "辛亥", "辛酉", "癸卯",
]);

// ══════════════════════════════════════════════════════════════════════════════
// 일지 분석 — 헬퍼
// ══════════════════════════════════════════════════════════════════════════════

function pairMatch(a: string, b: string, pairs: [string, string][]): boolean {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/** 두 지지가 같은 방합 그룹에 속하는지 → 결과 오행 반환 */
function getBangHapOhaeng(jiA: string, jiB: string): OhaengType | null {
  if (jiA === jiB) return null;
  for (const [a, b, c, ohaeng] of BANGHAP_GROUPS) {
    if ([a, b, c].includes(jiA) && [a, b, c].includes(jiB)) return ohaeng;
  }
  return null;
}

/** 두 지지가 같은 삼합 그룹에 속하는지 → 결과 오행 반환 */
function getSamHapOhaeng(jiA: string, jiB: string): OhaengType | null {
  if (jiA === jiB) return null;
  for (const [a, b, c, ohaeng] of SAMHAP_GROUPS) {
    if ([a, b, c].includes(jiA) && [a, b, c].includes(jiB)) return ohaeng;
  }
  return null;
}

/** 두 지지가 육합인지 → 결과 오행 반환 */
function getYukHapOhaeng(jiA: string, jiB: string): OhaengType | null {
  for (const [a, b, ohaeng] of YUKHAP_PAIRS) {
    if ((jiA === a && jiB === b) || (jiA === b && jiB === a)) return ohaeng;
  }
  return null;
}

/** 사람의 사주 지지4 중 형 관계 존재 여부 */
function hasHyungInJi(pillars: PillarsInput): boolean {
  const jis = [pillars.year.ji, pillars.month.ji, pillars.day.ji, pillars.hour.ji];
  const s = new Set(jis);
  const cnt: Record<string, number> = {};
  for (const j of jis) cnt[j] = (cnt[j] || 0) + 1;

  if (s.has("寅") && s.has("巳") && s.has("申")) return true; // 삼형
  if (s.has("丑") && s.has("戌") && s.has("未")) return true; // 삼형
  if (s.has("子") && s.has("卯")) return true;                // 상형
  for (const ch of SELF_HYUNG_CHARS) {
    if ((cnt[ch] ?? 0) >= 2) return true;                     // 자형
  }
  return false;
}

/** 사주 내 현침살 존재 여부 */
function hasHyunChimSal(pillars: PillarsInput): boolean {
  return [pillars.year, pillars.month, pillars.day, pillars.hour].some(
    (p) => HYUN_CHIM_SAL_SET.has(p.gan + p.ji),
  );
}

/** 사주 천간에 상관 또는 편인 존재 여부 */
function hasSangGwanOrPyeonIn(pillars: PillarsInput): boolean {
  const pillarsStr = {
    year:  pillars.year.gan  + pillars.year.ji,
    month: pillars.month.gan + pillars.month.ji,
    day:   pillars.day.gan   + pillars.day.ji,
    hour:  pillars.hour.gan  + pillars.hour.ji,
  };
  const sipsin = getSipsin(pillars.day.gan, pillarsStr);
  const targets = ["상관", "편인"];
  return (
    targets.includes(sipsin.year.gan  ?? "") ||
    targets.includes(sipsin.month.gan ?? "") ||
    targets.includes(sipsin.hour.gan  ?? "")
  );
}

/** 오행 기준 긍/부/중 판정 */
function ohaengSentiment(
  ohaeng: OhaengType,
  analysis: PersonOhaengAnalysis,
): "긍정" | "부정" | "중립" {
  if (analysis.lacking.includes(ohaeng)) return "긍정";
  if (analysis.excess.includes(ohaeng))  return "부정";
  return "중립";
}

function ohaengReason(
  sentiment: "긍정" | "부정" | "중립",
  relType: string,
  ohaeng: OhaengType,
): string {
  if (sentiment === "긍정") return `${relType}으로 ${ohaeng} 기운이 들어와 부족한 오행을 채워줍니다`;
  if (sentiment === "부정") return `${relType}으로 ${ohaeng} 기운이 들어와 이미 과한 오행에 더해집니다`;
  return `${relType}의 ${ohaeng} 기운이 사주에 중립적으로 작용합니다`;
}

function iljiSummary(
  relType: string,
  my: "긍정" | "부정" | "중립",
  partner: "긍정" | "부정" | "중립",
): string {
  if (my === "긍정" && partner === "긍정")
    return `일지의 ${relType} 관계로 서로에게 긍정적인 영향을 주는 궁합입니다.`;
  if (my === "부정" && partner === "부정")
    return `일지의 ${relType} 관계가 서로에게 부담이 될 수 있는 궁합입니다.`;
  return `일지의 ${relType} 관계로 한쪽에는 긍정, 한쪽에는 부담이 됩니다.`;
}

// ══════════════════════════════════════════════════════════════════════════════
// 일지 분석 — 메인
// ══════════════════════════════════════════════════════════════════════════════

function calcIljiAnalysis(
  myPillars: PillarsInput,
  partnerPillars: PillarsInput,
  myAnalysis: PersonOhaengAnalysis,
  partnerAnalysis: PersonOhaengAnalysis,
): IljiAnalysisResult {
  const myJi      = myPillars.day.ji;
  const partnerJi = partnerPillars.day.ji;

  // ── a. 충 ─────────────────────────────────────────────────────────────────
  if (pairMatch(myJi, partnerJi, CHUNG_PAIRS)) {
    const myTarget      = JI_OHAENG_MAP[partnerJi];
    const partnerTarget = JI_OHAENG_MAP[myJi];
    const mySent        = ohaengSentiment(myTarget, myAnalysis);
    const partnerSent   = ohaengSentiment(partnerTarget, partnerAnalysis);
    return {
      relationshipType: "충",
      targetOhaeng: myTarget,
      my:      { sentiment: mySent,      reason: ohaengReason(mySent, "충", myTarget) },
      partner: { sentiment: partnerSent, reason: ohaengReason(partnerSent, "충", partnerTarget) },
      summary: iljiSummary("충", mySent, partnerSent),
    };
  }

  // ── b. 방합 ───────────────────────────────────────────────────────────────
  const bangHapO = getBangHapOhaeng(myJi, partnerJi);
  if (bangHapO) {
    const mySent      = ohaengSentiment(bangHapO, myAnalysis);
    const partnerSent = ohaengSentiment(bangHapO, partnerAnalysis);
    return {
      relationshipType: "방합",
      targetOhaeng: bangHapO,
      my:      { sentiment: mySent,      reason: ohaengReason(mySent, "방합", bangHapO) },
      partner: { sentiment: partnerSent, reason: ohaengReason(partnerSent, "방합", bangHapO) },
      summary: iljiSummary("방합", mySent, partnerSent),
    };
  }

  // ── c. 삼합 ───────────────────────────────────────────────────────────────
  const samHapO = getSamHapOhaeng(myJi, partnerJi);
  if (samHapO) {
    const mySent      = ohaengSentiment(samHapO, myAnalysis);
    const partnerSent = ohaengSentiment(samHapO, partnerAnalysis);
    return {
      relationshipType: "삼합",
      targetOhaeng: samHapO,
      my:      { sentiment: mySent,      reason: ohaengReason(mySent, "삼합", samHapO) },
      partner: { sentiment: partnerSent, reason: ohaengReason(partnerSent, "삼합", samHapO) },
      summary: iljiSummary("삼합", mySent, partnerSent),
    };
  }

  // ── d. 육합 (육합 = 귀문 → 애증) ─────────────────────────────────────────
  const yukHapO = getYukHapOhaeng(myJi, partnerJi);
  if (yukHapO) {
    const mySent      = ohaengSentiment(yukHapO, myAnalysis);
    const partnerSent = ohaengSentiment(yukHapO, partnerAnalysis);
    return {
      relationshipType: "애증",
      targetOhaeng: yukHapO,
      my:      { sentiment: mySent,      reason: ohaengReason(mySent, "육합(귀문)", yukHapO) },
      partner: { sentiment: partnerSent, reason: ohaengReason(partnerSent, "육합(귀문)", yukHapO) },
      summary: "일지가 육합이면서 귀문 관계로, 강한 끌림과 갈등이 공존하는 애증의 궁합입니다.",
    };
  }

  // ── e. 형 ─────────────────────────────────────────────────────────────────
  const isSelfHyung =
    myJi === partnerJi && SELF_HYUNG_CHARS.has(myJi);
  if (isSelfHyung || pairMatch(myJi, partnerJi, HYUNG_PAIRS)) {
    const myPos      = hasHyungInJi(myPillars)      || hasHyunChimSal(myPillars);
    const partnerPos = hasHyungInJi(partnerPillars)  || hasHyunChimSal(partnerPillars);
    const mySent: "긍정" | "부정"      = myPos ? "긍정" : "부정";
    const partnerSent: "긍정" | "부정" = partnerPos ? "긍정" : "부정";

    const myHasH = hasHyungInJi(myPillars);
    const partnerHasH = hasHyungInJi(partnerPillars);
    return {
      relationshipType: "형",
      targetOhaeng: null,
      my: {
        sentiment: mySent,
        reason: mySent === "긍정"
          ? (myHasH ? "사주 지지에 이미 형이 있어 형 에너지에 익숙합니다" : "현침살로 형 에너지를 다룰 수 있습니다")
          : "사주 내 형이나 현침살이 없어 상대의 형 기운이 부담될 수 있습니다",
      },
      partner: {
        sentiment: partnerSent,
        reason: partnerSent === "긍정"
          ? (partnerHasH ? "사주 지지에 이미 형이 있어 형 에너지에 익숙합니다" : "현침살로 형 에너지를 다룰 수 있습니다")
          : "사주 내 형이나 현침살이 없어 상대의 형 기운이 부담될 수 있습니다",
      },
      summary: iljiSummary("형", mySent, partnerSent),
    };
  }

  // ── f. 원진 / 귀문 ────────────────────────────────────────────────────────
  const isWonjin = pairMatch(myJi, partnerJi, WONJIN_PAIRS);
  const isGwimun = pairMatch(myJi, partnerJi, GWIMUN_PAIRS);
  if (isWonjin || isGwimun) {
    const myPos      = hasSangGwanOrPyeonIn(myPillars);
    const partnerPos = hasSangGwanOrPyeonIn(partnerPillars);
    const mySent: "긍정" | "부정"      = myPos ? "긍정" : "부정";
    const partnerSent: "긍정" | "부정" = partnerPos ? "긍정" : "부정";
    const relType = isWonjin && isGwimun ? "원진·귀문" : isWonjin ? "원진" : "귀문";
    return {
      relationshipType: isWonjin ? "원진" : "귀문",
      targetOhaeng: null,
      my: {
        sentiment: mySent,
        reason: mySent === "긍정"
          ? "천간의 상관·편인이 원진·귀문 에너지를 순화시킵니다"
          : "천간에 상관·편인이 없어 관계의 긴장이 심화될 수 있습니다",
      },
      partner: {
        sentiment: partnerSent,
        reason: partnerSent === "긍정"
          ? "천간의 상관·편인이 원진·귀문 에너지를 순화시킵니다"
          : "천간에 상관·편인이 없어 관계의 긴장이 심화될 수 있습니다",
      },
      summary: `일지의 ${relType} 관계${
        mySent === "긍정" || partnerSent === "긍정"
          ? "이지만 특수한 십신이 이를 완화합니다."
          : "로 심리적 긴장이나 갈등이 생길 수 있습니다."
      }`,
    };
  }

  // ── 없음 ──────────────────────────────────────────────────────────────────
  return {
    relationshipType: "없음",
    targetOhaeng: null,
    my:      { sentiment: "중립", reason: "특별한 일지 관계가 없습니다" },
    partner: { sentiment: "중립", reason: "특별한 일지 관계가 없습니다" },
    summary: "두 일지 사이에 특별한 신살 관계가 없습니다.",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 일간 인력/척력 분석
// ══════════════════════════════════════════════════════════════════════════════

/**
 * 인력 맵: 내 키가 끌어당기는 상대 키
 * 己 남/여는 발신 항목 없음 (다른 간의 인력 타깃으로만 존재)
 */
const ILGAN_ATTRACT_MAP: Record<string, string> = {
  "甲M": "庚W", "甲W": "癸M",
  "乙M": "壬W", "乙W": "癸W",
  "丙M": "壬W", "丙W": "壬M",
  "丁M": "乙W", "丁W": "戊M",
  "戊M": "甲W", "戊W": "甲M",
  "辛M": "丁W", "辛W": "己M",
  "庚M": "戊W", "庚W": "己M",
  "壬M": "庚W", "壬W": "庚M",
  "癸M": "己W", "癸W": "己M",
};

/** 척력 맵: 내 키가 밀어내는 상대 키 */
const ILGAN_REPEL_MAP: Record<string, string> = {
  "甲M": "壬W", "甲W": "庚M",
  "乙M": "辛W", "乙W": "辛M",
  "丙M": "戊W", "丙W": "甲M",
  "丁M": "癸W", "丁W": "戊M",
  "戊M": "辛W", "戊W": "丙M",
  "己M": "乙W", "己W": "乙M",
  "辛M": "壬W", "辛W": "己M",
  "庚M": "癸W", "庚W": "戊M",
  "壬M": "戊W", "壬W": "戊M",
  "癸M": "丁W", "癸W": "乙M",
};

function calcIlganCompatibility(
  myDayGan: string,
  myGender: "M" | "W",
  partnerDayGan: string,
  partnerGender: "M" | "W",
): IlganCompatibilityResult {
  const myKey = `${myDayGan}${myGender}`;
  const partnerKey = `${partnerDayGan}${partnerGender}`;

  const myAttractsPartner = ILGAN_ATTRACT_MAP[myKey] === partnerKey;
  const partnerAttractsMe = ILGAN_ATTRACT_MAP[partnerKey] === myKey;
  const myRepelsPartner = ILGAN_REPEL_MAP[myKey] === partnerKey;
  const partnerRepelsMe = ILGAN_REPEL_MAP[partnerKey] === myKey;

  const attractCount = (myAttractsPartner ? 1 : 0) + (partnerAttractsMe ? 1 : 0);
  const repelCount = (myRepelsPartner ? 1 : 0) + (partnerRepelsMe ? 1 : 0);

  let result: IlganCompatibilityResult["result"];
  let label: IlganCompatibilityResult["label"];

  if (attractCount === 2 && repelCount === 0) {
    result = "쌍방인력"; label = "인력";
  } else if (attractCount === 1 && repelCount === 0) {
    result = "단방인력"; label = "인력";
  } else if (repelCount === 2 && attractCount === 0) {
    result = "쌍방척력"; label = "척력";
  } else if (repelCount === 1 && attractCount === 0) {
    result = "단방척력"; label = "척력";
  } else if (attractCount > 0 && repelCount > 0) {
    result = "인척혼재";
    label = attractCount >= repelCount ? "인력" : "척력";
  } else {
    result = "중립"; label = "중립";
  }

  return { myAttractsPartner, partnerAttractsMe, myRepelsPartner, partnerRepelsMe, result, label };
}

// ══════════════════════════════════════════════════════════════════════════════
// 공개 엔트리 포인트
// ══════════════════════════════════════════════════════════════════════════════

export function analyzeCoupleOhaeng(
  req: CoupleOhaengRequest,
): CoupleOhaengResult {
  const my = calcPersonOhaeng(req.myPillars);
  const partner = calcPersonOhaeng(req.partnerPillars);
  const compatibility = calcCompatibility(my, partner);
  const ilji = calcIljiAnalysis(req.myPillars, req.partnerPillars, my, partner);
  const ilgan = calcIlganCompatibility(
    req.myPillars.day.gan,
    req.myGender,
    req.partnerPillars.day.gan,
    req.partnerGender,
  );
  return { my, partner, compatibility, ilji, ilgan };
}
