// src/components/results/CoupleResult.tsx
// 커플 궁합 결과 — SectionFrame 스타일, 사주팔자/대운/세운/궁합 통일

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Zap,
  Sun,
  MapPin,
  CalendarDays,
  BookOpen,
  FileText,
  ChevronDown,
  Clock,
  Shield,
  Heart,
  Eye,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/common/Button";
import { SectionFrame } from "@/components/results/v2/SectionFrame";
import { SajuPillarLight } from "@/components/results/v2/SajuPillarLight";
import { DaewoonWaveChart } from "@/components/results/DaewoonWaveChart";
import { SewoonWaveChart } from "@/components/results/SewoonWaveChart";
import type {
  FortuneResponseData,
  PillarData,
  Daewoon,
  SewoonData,
} from "@/types/fortune";

const PILLAR_ORDER = ["시주", "일주", "월주", "년주"] as const;
const PILLAR_MAP = {
  시주: "hour",
  일주: "day",
  월주: "month",
  년주: "year",
} as const;

const GAN_TO_OHENG: Record<string, string> = {
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

const OHENG_SANGSAENG: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
const OHENG_SANGGEUK: Record<string, string> = {
  木: "土",
  火: "金",
  土: "水",
  金: "木",
  水: "火",
};

const GAN_POLARITY: Record<string, number> = {
  甲: 0, 乙: 1, 丙: 0, 丁: 1, 戊: 0, 己: 1, 庚: 0, 辛: 1, 壬: 0, 癸: 1,
};
const OHAENG_CYCLE = ["木", "火", "土", "金", "水"];

function getSipsin(dayGan: string, targetGan: string): string {
  const dOh = GAN_TO_OHENG[dayGan];
  const tOh = GAN_TO_OHENG[targetGan];
  if (!dOh || !tOh) return "";
  const same = GAN_POLARITY[dayGan] === GAN_POLARITY[targetGan];
  const di = OHAENG_CYCLE.indexOf(dOh);
  const ti = OHAENG_CYCLE.indexOf(tOh);
  const diff = (ti - di + 5) % 5;
  if (diff === 0) return same ? "비견" : "겁재";
  if (diff === 1) return same ? "식신" : "상관";
  if (diff === 2) return same ? "편재" : "정재";
  if (diff === 3) return same ? "편관" : "정관";
  return same ? "편인" : "정인";
}

const YUKAP_PAIRS: [string, string][] = [["子","丑"],["寅","亥"],["卯","戌"],["辰","酉"],["巳","申"],["午","未"]];
const CHUNG_PAIRS: [string, string][] = [["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]];

function getJiRelation(ji1: string, ji2: string): { type: string; strength: "강" | "중" | "약" } {
  for (const [a, b] of YUKAP_PAIRS)
    if ((ji1 === a && ji2 === b) || (ji1 === b && ji2 === a)) return { type: "육합", strength: "강" };
  for (const [a, b] of CHUNG_PAIRS)
    if ((ji1 === a && ji2 === b) || (ji1 === b && ji2 === a)) return { type: "충", strength: "약" };
  return { type: "없음", strength: "중" };
}

const OHENG_LABEL: Record<string, string> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};


/** 오행별 색상 토큰 (bar 차트 및 보완 UI용) */
const OHAENG_COLOR_MAP = {
  木: { bar: "bg-emerald-500", barBonus: "bg-emerald-200", text: "text-emerald-700" },
  火: { bar: "bg-rose-500",    barBonus: "bg-rose-200",    text: "text-rose-700"    },
  土: { bar: "bg-amber-400",   barBonus: "bg-amber-200",   text: "text-amber-700"   },
  金: { bar: "bg-slate-400",   barBonus: "bg-slate-200",   text: "text-slate-600"   },
  水: { bar: "bg-blue-500",    barBonus: "bg-blue-200",    text: "text-blue-700"    },
} as const;

interface PersonBlockProps {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  /** 생시 미입력 시 시주를 빈 박스로 표시 */
  hourPillarUnknown?: boolean;
}

const DaewoonSewoonLine: React.FC<{
  currentDaewoon: Daewoon | null;
  currentSewoon: SewoonData;
}> = ({ currentDaewoon, currentSewoon }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mt-2">
    <span>
      대운{" "}
      <span className="font-myeongjo font-semibold text-text-light">
        {currentDaewoon?.ganji ?? "—"}
      </span>
      {currentDaewoon && (
        <span className="ml-1">({currentDaewoon.year}년)</span>
      )}
    </span>
    <span className="text-gray-300">|</span>
    <span>
      세운{" "}
      <span className="font-myeongjo font-semibold text-text-light">
        {currentSewoon.ganji ?? "—"}
      </span>{" "}
      {currentSewoon.year}년
    </span>
  </div>
);

const PersonBlock: React.FC<PersonBlockProps> = ({
  pillars,
  hourPillarUnknown = false,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {PILLAR_ORDER.map((label) => (
        <SajuPillarLight
          key={label}
          title={label}
          data={pillars[PILLAR_MAP[label]]}
          isEmpty={label === "시주" && hourPillarUnknown}
        />
      ))}
    </div>
  </div>
);

/** birthDate: "YYYY-MM-DD" → 한국나이 (생일 무관, 1월 1일마다 +1). 유효하지 않으면 null */
function getKoreanAge(birthDate: string | undefined): number | null {
  if (!birthDate || birthDate.length < 4) return null;
  const year = parseInt(birthDate.slice(0, 4), 10);
  if (isNaN(year)) return null;
  const currentYear = new Date().getFullYear();
  return currentYear - year + 1;
}

function getOhaengRelationship(
  o1: string,
  o2: string,
): { type: "상생" | "상극" | "비슷"; desc: string } {
  if (o1 === o2)
    return { type: "비슷", desc: "같은 오행으로 기운이 통합니다." };
  if (OHENG_SANGSAENG[o1] === o2)
    return {
      type: "상생",
      desc: `${OHENG_LABEL[o1]}이(가) ${OHENG_LABEL[o2]}을(를) 돕는 관계입니다.`,
    };
  if (OHENG_SANGSAENG[o2] === o1)
    return {
      type: "상생",
      desc: `${OHENG_LABEL[o2]}이(가) ${OHENG_LABEL[o1]}을(를) 돕는 관계입니다.`,
    };
  if (OHENG_SANGGEUK[o1] === o2)
    return {
      type: "상극",
      desc: `${OHENG_LABEL[o1]}이(가) ${OHENG_LABEL[o2]}을(를) 제어하는 관계입니다.`,
    };
  if (OHENG_SANGGEUK[o2] === o1)
    return {
      type: "상극",
      desc: `${OHENG_LABEL[o2]}이(가) ${OHENG_LABEL[o1]}을(를) 제어하는 관계입니다.`,
    };
  return { type: "비슷", desc: "서로 중립적인 오행 관계입니다." };
}

// ── 상세요소 탭 ───────────────────────────────────────────────────────────────

type DetailTabId = "basic" | "pillar" | "special";

interface DetailItemData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
}

const DetailCard: React.FC<DetailItemData> = ({
  icon: Icon,
  title,
  subtitle,
  accentClass,
  bgClass,
  borderClass,
  dotClass,
}) => (
  <div className={`rounded-xl p-5 border ${bgClass} ${borderClass}`}>
    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-lg bg-white/70 border ${borderClass} shadow-sm mt-0.5 shrink-0`}
      >
        <Icon size={14} className={accentClass} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h5 className="text-sm font-bold text-text-light leading-tight">
            {title}
          </h5>
          <span
            className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border ${borderClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            <span className={accentClass}>준비 중</span>
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">{subtitle}</p>
        <div className="mt-3 h-8 rounded-lg bg-white/50 border border-dashed border-gray-200 flex items-center justify-center">
          <span className="text-[10px] text-text-subtle">
            분석 데이터 준비 중
          </span>
        </div>
      </div>
    </div>
  </div>
);

const DETAIL_TABS: { id: DetailTabId; label: string }[] = [
  { id: "basic", label: "기초 비교" },
  { id: "pillar", label: "궁위 분석" },
  { id: "special", label: "충합·신살" },
];

const DETAIL_ITEMS: Record<DetailTabId, DetailItemData[]> = {
  basic: [
    {
      id: "ohaeng",
      title: "오행분석",
      subtitle:
        "두 사람의 오행 분포를 비교하고 서로 보완하는 오행을 파악합니다.",
      icon: Zap,
      accentClass: "text-amber-600",
      bgClass: "bg-amber-50/60",
      borderClass: "border-amber-100",
      dotClass: "bg-amber-400",
    },
    {
      id: "ilgan",
      title: "일간분석",
      subtitle:
        "일간(나를 나타내는 천간)으로 두 사람의 본성과 기질을 분석합니다.",
      icon: Sun,
      accentClass: "text-rose-500",
      bgClass: "bg-rose-50/60",
      borderClass: "border-rose-100",
      dotClass: "bg-rose-400",
    },
    {
      id: "ilji",
      title: "일지분석",
      subtitle:
        "일지(배우자궁)의 글자로 두 사람의 배우자에 대한 자세를 봅니다.",
      icon: MapPin,
      accentClass: "text-emerald-600",
      bgClass: "bg-emerald-50/60",
      borderClass: "border-emerald-100",
      dotClass: "bg-emerald-400",
    },
    {
      id: "wolji",
      title: "월지분석",
      subtitle:
        "월지(사회궁)로 두 사람이 실생활에서 어떻게 맞닿는지 파악합니다.",
      icon: CalendarDays,
      accentClass: "text-teal-600",
      bgClass: "bg-teal-50/60",
      borderClass: "border-teal-100",
      dotClass: "bg-teal-400",
    },
  ],
  pillar: [
    {
      id: "nyeonju",
      title: "년주비교",
      subtitle:
        "두 사람의 년주를 비교하여 뿌리와 가치관의 차이를 분석합니다.",
      icon: BookOpen,
      accentClass: "text-violet-600",
      bgClass: "bg-violet-50/60",
      borderClass: "border-violet-100",
      dotClass: "bg-violet-400",
    },
    {
      id: "wolju",
      title: "월주비교",
      subtitle:
        "두 사람의 월주를 비교하여 사회적 성격과 목표를 분석합니다.",
      icon: FileText,
      accentClass: "text-blue-600",
      bgClass: "bg-blue-50/60",
      borderClass: "border-blue-100",
      dotClass: "bg-blue-400",
    },
    {
      id: "siju",
      title: "시주비교",
      subtitle:
        "두 사람의 시주를 비교하여 미래와 자녀 관계를 분석합니다.",
      icon: Clock,
      accentClass: "text-slate-600",
      bgClass: "bg-slate-50/60",
      borderClass: "border-slate-200",
      dotClass: "bg-slate-400",
    },
  ],
  special: [
    {
      id: "hyeongchung",
      title: "형충파해 분석",
      subtitle:
        "두 사람의 사주 사이에 발생하는 충돌 기운을 분석합니다.",
      icon: Shield,
      accentClass: "text-rose-600",
      bgClass: "bg-rose-50/60",
      borderClass: "border-rose-100",
      dotClass: "bg-rose-500",
    },
    {
      id: "hap",
      title: "합 분석",
      subtitle:
        "삼합·방합·육합으로 두 사주 간 결합하는 기운과 시너지를 봅니다.",
      icon: Heart,
      accentClass: "text-emerald-600",
      bgClass: "bg-emerald-50/60",
      borderClass: "border-emerald-100",
      dotClass: "bg-emerald-500",
    },
    {
      id: "sinsal",
      title: "신살분석",
      subtitle:
        "두 사람의 신살이 서로에게 미치는 영향을 분석합니다.",
      icon: Eye,
      accentClass: "text-amber-600",
      bgClass: "bg-amber-50/60",
      borderClass: "border-amber-100",
      dotClass: "bg-amber-500",
    },
    {
      id: "sibiwunseong",
      title: "십이운성 분석",
      subtitle:
        "두 사람의 십이운성 단계를 비교하여 인생 주기의 조화를 봅니다.",
      icon: Activity,
      accentClass: "text-teal-600",
      bgClass: "bg-teal-50/60",
      borderClass: "border-teal-100",
      dotClass: "bg-teal-500",
    },
  ],
};

// ── 오행 분석 API 응답 타입 ───────────────────────────────────────────────────

interface OhaengPersonAnalysis {
  baseCount: Record<string, number>;
  hapBonus: Record<string, number>;
  totalCount: Record<string, number>;
  lacking: string[];
  excess: string[];
  hapDetails: {
    type: string;
    characters: string[];
    result: string;
    resultName: string;
    bonus: number;
  }[];
}

interface OhaengFillInfo {
  ohaeng: string;
  canFill: boolean;
  fillerCount: number;
}

interface IlganCompatibilityResult {
  myAttractsPartner: boolean;
  partnerAttractsMe: boolean;
  myRepelsPartner: boolean;
  partnerRepelsMe: boolean;
  result: "쌍방인력" | "단방인력" | "쌍방척력" | "단방척력" | "인척혼재" | "중립";
  label: "인력" | "척력" | "중립";
}

interface IljiPersonResult {
  sentiment: "긍정" | "부정" | "중립";
  reason: string;
}

interface IljiAnalysisResult {
  relationshipType: "충" | "방합" | "삼합" | "애증" | "형" | "원진" | "귀문" | "없음";
  targetOhaeng: string | null;
  my: IljiPersonResult;
  partner: IljiPersonResult;
  summary: string;
}

interface WoljiPersonResult {
  sentiment: "긍정" | "부정" | "중립";
  reason: string;
}

interface WoljiAnalysisResult {
  relationshipType: "방합" | "삼합" | "충" | "귀문" | "원진" | "형" | "없음";
  targetOhaeng: string | null;
  my: WoljiPersonResult;
  partner: WoljiPersonResult;
  summary: string;
}

interface NyeonjuAnalysisResult {
  a: "긍정" | "부정" | "중립";
  b: "긍정" | "부정" | "중립";
  ab: "강" | "중" | "약";
  c: "강" | "중" | "약";
  final: string;
  aSipsin: { mySeesPartner: string; partnerSeesMe: string };
  bSipsin: { my: string; partner: string };
  cRelType: "방합" | "삼합" | "충" | "형" | "원진" | "귀문" | "없음";
}

interface CoupleOhaengApiResult {
  my: OhaengPersonAnalysis;
  partner: OhaengPersonAnalysis;
  compatibility: {
    partnerFillsMine: OhaengFillInfo[];
    iFillPartner: OhaengFillInfo[];
    bothLacking: string[];
    complementScore: number;
    summary: string;
  };
  wolji: WoljiAnalysisResult;
  ilji: IljiAnalysisResult;
  ilgan: IlganCompatibilityResult;
  nyeonju: NyeonjuAnalysisResult;
}

// ── 오행 bar 한 줄 ────────────────────────────────────────────────────────────

const OHAENG_LIST_ORDERED = ["木", "火", "土", "金", "水"] as const;

const OhaengBar: React.FC<{
  ohaeng: string;
  base: number;
  bonus: number;
  maxCount: number;
  isLacking: boolean;
}> = ({ ohaeng, base, bonus, maxCount, isLacking }) => {
  const total = base + bonus;
  const color = OHAENG_COLOR_MAP[ohaeng as keyof typeof OHAENG_COLOR_MAP];
  const baseW  = maxCount > 0 ? (base  / maxCount) * 100 : 0;
  const bonusW = maxCount > 0 ? (bonus / maxCount) * 100 : 0;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-4 text-center text-xs font-bold font-myeongjo shrink-0 ${
          isLacking ? "text-gray-300" : (color?.text ?? "text-gray-500")
        }`}
      >
        {ohaeng}
      </span>

      {/* bar: base(진함) + bonus(연함) */}
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ${color?.bar ?? "bg-gray-400"}`}
          style={{ width: `${baseW}%` }}
        />
        {bonus > 0 && (
          <div
            className={`h-full transition-all duration-500 ${color?.barBonus ?? "bg-gray-200"}`}
            style={{ width: `${bonusW}%` }}
          />
        )}
      </div>

      <span
        className={`text-xs font-semibold w-5 text-right shrink-0 ${
          isLacking ? "text-gray-300" : (color?.text ?? "text-gray-600")
        }`}
      >
        {isLacking ? "─" : total}
      </span>
    </div>
  );
};

// ── 오행분석 카드 (전체 너비) ─────────────────────────────────────────────────

const OhaengCard: React.FC<{
  result: CoupleOhaengApiResult | null;
  loading: boolean;
  item: DetailItemData;
}> = ({ result, loading, item }) => {
  const [isOpen, setIsOpen] = useState(false);

  /* 로딩 */
  if (loading) {
    return (
      <div className={`rounded-xl border ${item.bgClass} ${item.borderClass}`}>
        <div className="flex items-center gap-3 p-5">
          <div className={`p-2 rounded-lg bg-white/70 border ${item.borderClass} shadow-sm shrink-0`}>
            <Zap size={14} className={item.accentClass} />
          </div>
          <h5 className="text-sm font-bold text-text-light flex-1">{item.title}</h5>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-3.5 h-3.5 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin shrink-0" />
            분석 중…
          </div>
        </div>
      </div>
    );
  }

  /* 데이터 없으면 준비 중 placeholder */
  if (!result) return <DetailCard {...item} />;

  const { my, partner, compatibility } = result;

  const maxCount = Math.max(
    ...OHAENG_LIST_ORDERED.map((o) =>
      Math.max(my.totalCount[o] ?? 0, partner.totalCount[o] ?? 0),
    ),
    1,
  );

  return (
    <div className={`rounded-xl border ${item.bgClass} ${item.borderClass}`}>
      {/* 헤더 — 클릭으로 토글 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-5 text-left"
      >
        <div className={`p-2 rounded-lg bg-white/70 border ${item.borderClass} shadow-sm mt-0.5 shrink-0`}>
          <Zap size={14} className={item.accentClass} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-bold text-text-light leading-tight mb-1">
            {item.title}
          </h5>
          <p className="text-xs text-text-muted leading-relaxed">{item.subtitle}</p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 접히는 콘텐츠 */}
      {isOpen && <div className="px-5 pb-5">

      {/* 오행 보완 관계 — 좌우 병렬 (막대 위) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 나의 부족 오행 */}
        <div>
          <p className="text-[11px] font-semibold text-text-muted mb-1.5">나의 부족 오행</p>
          {compatibility.partnerFillsMine.filter((f) => f.canFill).length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {compatibility.partnerFillsMine.filter((f) => f.canFill).map((f) => {
                const color = OHAENG_COLOR_MAP[f.ohaeng as keyof typeof OHAENG_COLOR_MAP];
                return (
                  <span
                    key={f.ohaeng}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border w-fit bg-white border-emerald-200 text-emerald-700"
                  >
                    <span className={`font-myeongjo ${color?.text ?? ""}`}>{f.ohaeng}</span>
                    <span>✓ 상대가 채워줌</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-text-subtle font-medium">—</p>
          )}
        </div>

        {/* 상대방의 부족 오행 */}
        <div>
          <p className="text-[11px] font-semibold text-text-muted mb-1.5">상대방의 부족 오행</p>
          {compatibility.iFillPartner.filter((f) => f.canFill).length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {compatibility.iFillPartner.filter((f) => f.canFill).map((f) => {
                const color = OHAENG_COLOR_MAP[f.ohaeng as keyof typeof OHAENG_COLOR_MAP];
                return (
                  <span
                    key={f.ohaeng}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border w-fit bg-white border-emerald-200 text-emerald-700"
                  >
                    <span className={`font-myeongjo ${color?.text ?? ""}`}>{f.ohaeng}</span>
                    <span>✓ 내가 채워줌</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-text-subtle font-medium">—</p>
          )}
        </div>
      </div>

      {/* 요약 */}
      <p className="text-xs text-text-muted leading-relaxed mb-5">
        {compatibility.summary}
      </p>

      {/* 구분선 + 오행 막대 차트 */}
      <div className="border-t border-amber-100/80 pt-4">
        <div className="grid grid-cols-2 gap-5">
          {/* 나 */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted mb-2.5">나</p>
            <div className="space-y-2.5">
              {OHAENG_LIST_ORDERED.map((o) => (
                <OhaengBar
                  key={o}
                  ohaeng={o}
                  base={my.baseCount[o] ?? 0}
                  bonus={my.hapBonus[o] ?? 0}
                  maxCount={maxCount}
                  isLacking={my.lacking.includes(o)}
                />
              ))}
            </div>
            {my.hapDetails.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {my.hapDetails.map((h, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-white/60 border border-gray-200 px-1.5 py-0.5 rounded text-gray-400"
                  >
                    {h.resultName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 상대방 */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted mb-2.5">상대방</p>
            <div className="space-y-2.5">
              {OHAENG_LIST_ORDERED.map((o) => (
                <OhaengBar
                  key={o}
                  ohaeng={o}
                  base={partner.baseCount[o] ?? 0}
                  bonus={partner.hapBonus[o] ?? 0}
                  maxCount={maxCount}
                  isLacking={partner.lacking.includes(o)}
                />
              ))}
            </div>
            {partner.hapDetails.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {partner.hapDetails.map((h, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-white/60 border border-gray-200 px-1.5 py-0.5 rounded text-gray-400"
                  >
                    {h.resultName}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>}
    </div>
  );
};

// ── 일간 인력/척력 카드 ───────────────────────────────────────────────────────

const ILGAN_LABEL_MAP: Record<string, string> = {
  甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토",
  己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수",
};

const IlganCard: React.FC<{
  result: CoupleOhaengApiResult | null;
  loading: boolean;
  item: DetailItemData;
  myDayGan: string;
  partnerDayGan: string;
  myGender: "M" | "W";
  partnerGender: "M" | "W";
}> = ({ result, loading, item, myDayGan, partnerDayGan, myGender, partnerGender }) => {
  const [open, setOpen] = useState(false);

  const ilgan = result?.ilgan ?? null;
  const labelColor =
    ilgan?.label === "인력"
      ? "bg-rose-50 text-rose-600 border border-rose-200"
      : ilgan?.label === "척력"
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "bg-stone-50 text-stone-500 border border-stone-200";

  const myLabel = `${ILGAN_LABEL_MAP[myDayGan] ?? myDayGan}(${myGender === "M" ? "남" : "여"})`;
  const partnerLabel = `${ILGAN_LABEL_MAP[partnerDayGan] ?? partnerDayGan}(${partnerGender === "M" ? "남" : "여"})`;

  const RESULT_DESC: Record<string, string> = {
    쌍방인력: "두 일간이 서로를 끌어당기는 쌍방 인력 관계입니다.",
    단방인력: "한쪽의 일간이 상대를 끌어당기는 단방 인력 관계입니다.",
    쌍방척력: "두 일간이 서로 밀어내는 쌍방 척력 관계입니다.",
    단방척력: "한쪽의 일간이 상대를 밀어내는 단방 척력 관계입니다.",
    인척혼재: "한쪽은 끌어당기고 한쪽은 밀어내는 복합적인 관계입니다.",
    중립: "두 일간 사이에 특별한 인력 또는 척력이 없는 중립 관계입니다.",
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
          {!loading && ilgan && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${labelColor}`}>
              {ilgan.result}
            </span>
          )}
          {loading && <span className="text-xs text-stone-400">분석 중…</span>}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* 본문 */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {loading ? (
            <p className="text-xs text-stone-400 text-center py-4">분석 중…</p>
          ) : !ilgan ? (
            <p className="text-xs text-stone-400 text-center py-4">데이터를 불러올 수 없습니다.</p>
          ) : (
            <>
              {/* 좌우 인물 + 중앙 결과 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center space-y-1">
                  <p className="text-xs text-stone-400">나의 일간</p>
                  <p className="text-sm font-semibold text-stone-700">{myLabel}</p>
                  <div className="text-[10px] space-y-0.5">
                    {ilgan.myAttractsPartner && <p className="text-rose-500">→ 인력</p>}
                    {ilgan.myRepelsPartner && <p className="text-blue-500">→ 척력</p>}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold shrink-0 ${labelColor}`}>
                  {ilgan.result}
                </div>
                <div className="flex-1 text-center space-y-1">
                  <p className="text-xs text-stone-400">상대 일간</p>
                  <p className="text-sm font-semibold text-stone-700">{partnerLabel}</p>
                  <div className="text-[10px] space-y-0.5">
                    {ilgan.partnerAttractsMe && <p className="text-rose-500">← 인력</p>}
                    {ilgan.partnerRepelsMe && <p className="text-blue-500">← 척력</p>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {RESULT_DESC[ilgan.result] ?? ""}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── 일지 분석 카드 ────────────────────────────────────────────────────────────

const REL_BADGE: Record<string, { bg: string; text: string }> = {
  충:   { bg: "bg-red-50",    text: "text-red-600 border border-red-200" },
  방합: { bg: "bg-emerald-50", text: "text-emerald-600 border border-emerald-200" },
  삼합: { bg: "bg-green-50",  text: "text-green-600 border border-green-200" },
  애증: { bg: "bg-purple-50", text: "text-purple-600 border border-purple-200" },
  형:   { bg: "bg-orange-50", text: "text-orange-600 border border-orange-200" },
  원진: { bg: "bg-slate-50",  text: "text-slate-600 border border-slate-200" },
  귀문: { bg: "bg-slate-50",  text: "text-slate-600 border border-slate-200" },
  없음: { bg: "bg-stone-50",  text: "text-stone-400 border border-stone-200" },
};

const SENT_STYLE: Record<string, string> = {
  긍정: "text-emerald-600",
  부정: "text-red-500",
  중립: "text-stone-400",
};
const SENT_ICON: Record<string, string> = { 긍정: "●", 부정: "●", 중립: "○" };

const IljiCard: React.FC<{
  result: CoupleOhaengApiResult | null;
  loading: boolean;
  item: DetailItemData;
}> = ({ result, loading, item }) => {
  const [open, setOpen] = useState(false);
  const ilji = result?.ilji ?? null;
  const badge = ilji ? (REL_BADGE[ilji.relationshipType] ?? REL_BADGE["없음"]) : null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
          {!loading && ilji && badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${badge.text}`}>
              {ilji.relationshipType}
              {ilji.targetOhaeng ? ` · ${ilji.targetOhaeng}` : ""}
            </span>
          )}
          {loading && <span className="text-xs text-stone-400">분석 중…</span>}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {loading ? (
            <p className="text-xs text-stone-400 text-center py-4">분석 중…</p>
          ) : !ilji ? (
            <p className="text-xs text-stone-400 text-center py-4">데이터를 불러올 수 없습니다.</p>
          ) : (
            <>
              {/* 나 / 상대 긍부정 */}
              <div className="grid grid-cols-2 gap-3">
                {(["my", "partner"] as const).map((who) => {
                  const r = who === "my" ? ilji.my : ilji.partner;
                  return (
                    <div key={who} className="rounded-lg bg-stone-50 p-3 space-y-1">
                      <p className="text-[10px] text-stone-400">{who === "my" ? "나" : "상대"}</p>
                      <p className={`text-sm font-bold flex items-center gap-1 ${SENT_STYLE[r.sentiment]}`}>
                        <span>{SENT_ICON[r.sentiment]}</span>
                        {r.sentiment}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">{ilji.summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── 월지 분석 카드 ────────────────────────────────────────────────────────────

const WoljiCard: React.FC<{
  result: CoupleOhaengApiResult | null;
  loading: boolean;
  item: DetailItemData;
}> = ({ result, loading, item }) => {
  const [open, setOpen] = useState(false);
  const wolji = result?.wolji ?? null;
  const badge = wolji ? (REL_BADGE[wolji.relationshipType] ?? REL_BADGE["없음"]) : null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
          {!loading && wolji && badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${badge.text}`}>
              {wolji.relationshipType}
              {wolji.targetOhaeng ? ` · ${wolji.targetOhaeng}` : ""}
            </span>
          )}
          {loading && <span className="text-xs text-stone-400">분석 중…</span>}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {loading ? (
            <p className="text-xs text-stone-400 text-center py-4">분석 중…</p>
          ) : !wolji ? (
            <p className="text-xs text-stone-400 text-center py-4">데이터를 불러올 수 없습니다.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {(["my", "partner"] as const).map((who) => {
                  const r = who === "my" ? wolji.my : wolji.partner;
                  return (
                    <div key={who} className="rounded-lg bg-stone-50 p-3 space-y-1">
                      <p className="text-[10px] text-stone-400">{who === "my" ? "나" : "상대"}</p>
                      <p className={`text-sm font-bold flex items-center gap-1 ${SENT_STYLE[r.sentiment]}`}>
                        <span>{SENT_ICON[r.sentiment]}</span>
                        {r.sentiment}
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">{r.reason}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">{wolji.summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── 년주 비교 카드 ────────────────────────────────────────────────────────────

const FINAL_STRENGTH: Record<string, { label: string; color: string }> = {
  강강: { label: "강강", color: "text-emerald-600 border border-emerald-200 bg-emerald-50" },
  강중: { label: "강중", color: "text-teal-600 border border-teal-200 bg-teal-50" },
  강약: { label: "강약", color: "text-amber-600 border border-amber-200 bg-amber-50" },
  중강: { label: "중강", color: "text-sky-600 border border-sky-200 bg-sky-50" },
  중중: { label: "중중", color: "text-stone-500 border border-stone-200 bg-stone-50" },
  중약: { label: "중약", color: "text-orange-500 border border-orange-200 bg-orange-50" },
  약강: { label: "약강", color: "text-violet-600 border border-violet-200 bg-violet-50" },
  약중: { label: "약중", color: "text-pink-500 border border-pink-200 bg-pink-50" },
  약약: { label: "약약", color: "text-red-500 border border-red-200 bg-red-50" },
};

// ── 십신 라벨 — 가치관의 결 (수정 가능) ──────────────────────────────────────
const SIPSIN_LABEL: Record<string, { main: string; sub: string }> = {
  비견: { main: "각자 기준을 존중하는 구조를 원한다", sub: "간섭하지 말고, 독립적으로 굴러가길 바람" },
  겁재: { main: "경쟁과 속도를 같이 맞출 수 있는 구조를 원한다", sub: "느리거나 수동적인 흐름을 싫어함" },
  식신: { main: "무리하지 않고 지속 가능한 흐름을 원한다", sub: "과도한 변화나 압박 없이 꾸준함 유지" },
  상관: { main: "정체되지 않고 계속 변화하는 구조를 원한다", sub: "틀에 묶인 관계를 답답해함" },
  정재: { main: "예측 가능하고 안정적인 운영을 원한다", sub: "계획, 책임, 지속성 중요" },
  편재: { main: "기회를 살리고 흐름을 타는 구조를 원한다", sub: "고정된 틀보다 유연한 선택 선호" },
  정관: { main: "명확한 기준과 역할이 있는 구조를 원한다", sub: "선, 규칙, 책임 분명해야 안정" },
  편관: { main: "결정이 빠르고 실행이 강한 구조를 원한다", sub: "우유부단, 애매한 상태를 견디지 못함" },
  정인: { main: "서로를 이해하고 배워가는 관계를 원한다", sub: "안정적이고 끊기지 않는 관계" },
  편인: { main: "정의되지 않고 열려있는 관계를 원한다", sub: "정답 강요, 획일화된 방식 거부" },
};

// ── 십신 라벨 — 내면의 뿌리 (수정 가능) ─────────────────────────────────────
const SIPSIN_ROOT_LABEL: Record<string, { main: string; sub: string }> = {
  비견: { main: "더 나은 삶을 위해 나답게 살것이다", sub: "자기 기준, 동등성, 자존" },
  겁재: { main: "더 나은 삶을 위해 만들어 갈것이다", sub: "경쟁, 생존, 주도권" },
  식신: { main: "안락한 삶을 위해 꾸준히 나아갈 것이다", sub: "여유, 안정, 자연스러움" },
  상관: { main: "안락한 삶을 위해 깨고 도전할 것이다", sub: "직설, 반항, 개성" },
  정재: { main: "매력적인 삶을 위해 꾸준히 만들어 나갈 것이다", sub: "관리, 책임, 현실성" },
  편재: { main: "매력적인 삶을 위해 들어온 기회를 놓치지 않을 것이다", sub: "유동성, 사업성, 외향성" },
  정관: { main: "안정된 삶을 위해서 책임을 다해 일궈나갈 것이다", sub: "규범, 책임, 사회성" },
  편관: { main: "안정된 삶을 위해서 가만히 있지 않을 것이다", sub: "압박, 긴장, 돌파력" },
  정인: { main: "지혜로운 삶을 위해 제대로 알고 삶을 터득할 것이다", sub: "보호, 수용, 안정적 해석" },
  편인: { main: "지혜로운 삶을 위해 나만의 방식으로 삶을 터득할 것이다", sub: "주관, 독특함, 왜곡 가능성" },
};

// ── 월주비교 해석 (수정 가능) ─────────────────────────────────────────────────
const WOLJU_MY_DESC: Record<string, { main: string; sub: string }> = {
  비견: { main: "비견 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  겁재: { main: "겁재 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  식신: { main: "식신 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  상관: { main: "상관 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정재: { main: "정재 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편재: { main: "편재 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정관: { main: "정관 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편관: { main: "편관 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정인: { main: "정인 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편인: { main: "편인 — 월주 해석 예시 문구", sub: "키워드1, 키워드2" },
};

// ── 시주비교 해석 (수정 가능) ─────────────────────────────────────────────────
const SIJU_MY_DESC: Record<string, { main: string; sub: string }> = {
  비견: { main: "비견 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  겁재: { main: "겁재 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  식신: { main: "식신 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  상관: { main: "상관 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정재: { main: "정재 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편재: { main: "편재 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정관: { main: "정관 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편관: { main: "편관 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  정인: { main: "정인 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
  편인: { main: "편인 — 시주 해석 예시 문구", sub: "키워드1, 키워드2" },
};

const NYEONJU_COMPAT_DESC: Record<string, string> = {
  강강: "가치관·뿌리가 잘 맞고 년지 에너지도 상호 보완적인 최상의 조합입니다.",
  강중: "가치관이 잘 맞으며 년지는 중립적으로 큰 충돌 없이 흐릅니다.",
  강약: "내면의 가치관은 잘 맞지만, 년지의 긴장 에너지를 함께 다독일 필요가 있습니다.",
  중강: "가치관은 중간 정도 맞으며, 년지의 강한 기운이 관계를 보완합니다.",
  중중: "특별히 튀지 않는 안정적인 중간 조합으로, 노력 여부에 따라 방향이 결정됩니다.",
  중약: "가치관이 어긋나고 년지도 충돌하는 에너지가 있어 배려와 소통이 중요합니다.",
  약강: "근본적 가치관 차이가 있지만, 년지가 강하게 서로를 묶어주는 독특한 관계입니다.",
  약중: "가치관 충돌이 있으며 년지도 중립적이어서 서로 이해하려는 노력이 필요합니다.",
  약약: "가치관과 년지 모두 에너지 충돌이 있어 깊은 이해와 인내가 요구됩니다.",
};

const NyeonjuCard: React.FC<{
  result: CoupleOhaengApiResult | null;
  loading: boolean;
  item: DetailItemData;
  myYearGan: string;
  partnerYearGan: string;
  myYearJi: string;
  partnerYearJi: string;
}> = ({ result, loading, item, myYearGan, partnerYearGan, myYearJi, partnerYearJi }) => {
  const [open, setOpen] = useState(false);
  const nyeonju = result?.nyeonju ?? null;
  const finalInfo = nyeonju ? (FINAL_STRENGTH[nyeonju.final] ?? null) : null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
          {!loading && nyeonju && finalInfo && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${finalInfo.color}`}>
              {nyeonju.final}
            </span>
          )}
          {loading && <span className="text-xs text-stone-400">분석 중…</span>}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {loading ? (
            <p className="text-xs text-stone-400 text-center py-4">분석 중…</p>
          ) : !nyeonju ? (
            <p className="text-xs text-stone-400 text-center py-4">데이터를 불러올 수 없습니다.</p>
          ) : (
            <>
              {/* 년주 글자 표시 */}
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 mb-1">나의 년주</p>
                  <p className="text-lg font-bold font-myeongjo text-stone-700">{myYearGan}{myYearJi}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold shrink-0 ${finalInfo?.color ?? "text-stone-500"}`}>
                  {nyeonju.final}
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 mb-1">상대 년주</p>
                  <p className="text-lg font-bold font-myeongjo text-stone-700">{partnerYearGan}{partnerYearJi}</p>
                </div>
              </div>

              {/* Step a: 가치관의 결 */}
              <div className="rounded-lg bg-violet-50/60 border border-violet-100 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-violet-700">가치관의 결</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {(["나", "상대"] as const).map((who, i) => {
                    const raw = i === 0 ? nyeonju.aSipsin.mySeesPartner : nyeonju.aSipsin.partnerSeesMe;
                    const label = SIPSIN_LABEL[raw];
                    return (
                      <div key={who} className="space-y-0.5">
                        <p className="text-[10px] text-stone-400">{who}의 시선</p>
                        {label ? (
                          <>
                            <p className="font-semibold text-stone-700 leading-snug">{label.main}</p>
                            <p className="text-[10px] text-stone-400 leading-snug">{label.sub}</p>
                          </>
                        ) : (
                          <p className="font-semibold text-stone-700">{raw || "—"}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className={`text-xs font-semibold ${SENT_STYLE[nyeonju.a]} hidden`}>
                  {SENT_ICON[nyeonju.a]} {nyeonju.a}
                </p>
              </div>

              {/* Step b: 내면의 뿌리 */}
              <div className="rounded-lg bg-sky-50/60 border border-sky-100 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-sky-700">내면의 뿌리</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {(["나", "상대"] as const).map((who, i) => {
                    const raw = i === 0 ? nyeonju.bSipsin.my : nyeonju.bSipsin.partner;
                    const label = SIPSIN_ROOT_LABEL[raw];
                    return (
                      <div key={who} className="space-y-0.5">
                        <p className="text-[10px] text-stone-400">{who}의 뿌리</p>
                        {label ? (
                          <>
                            <p className="font-semibold text-stone-700 leading-snug">{label.main}</p>
                            <p className="text-[10px] text-stone-400 leading-snug">{label.sub}</p>
                          </>
                        ) : (
                          <p className="font-semibold text-stone-700">{raw || "—"}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className={`text-xs font-semibold ${SENT_STYLE[nyeonju.b]} hidden`}>
                  {SENT_ICON[nyeonju.b]} {nyeonju.b}
                </p>
              </div>

              {/* Step c: 환경의 조화 */}
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-stone-600">환경의 조화</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {nyeonju.cRelType === "없음" ? "자연스러운 흐름" : nyeonju.cRelType}
                  </p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                  nyeonju.c === "강" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  nyeonju.c === "약" ? "bg-red-50 text-red-500 border-red-200" :
                  "bg-stone-100 text-stone-500 border-stone-200"
                }`}>
                  {nyeonju.c === "강" ? "잘 맞아요" : nyeonju.c === "약" ? "차이 있어요" : "무난해요"}
                </span>
              </div>

              {/* 최종 요약 */}
              <p className="text-xs text-stone-500 leading-relaxed">
                {NYEONJU_COMPAT_DESC[nyeonju.final] ?? ""}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── 월주비교 카드 ─────────────────────────────────────────────────────────────
const WoljuCard: React.FC<{
  item: DetailItemData;
  myMonthGan: string; partnerMonthGan: string;
  myMonthJi: string; partnerMonthJi: string;
  myDayGan: string; partnerDayGan: string;
}> = ({ item, myMonthGan, partnerMonthGan, myMonthJi, partnerMonthJi, myDayGan, partnerDayGan }) => {
  const [open, setOpen] = useState(false);
  const jiRel = getJiRelation(myMonthJi, partnerMonthJi);
  const aMy = getSipsin(myMonthGan, partnerMonthGan);
  const aPartner = getSipsin(partnerMonthGan, myMonthGan);
  const bMy = getSipsin(myDayGan, myMonthGan);
  const bPartner = getSipsin(partnerDayGan, partnerMonthGan);

  const renderLabel = (
    raw: string,
    descMap: Record<string, { main: string; sub: string }>,
    label: string,
  ) => {
    const d = descMap[raw];
    return (
      <div className="space-y-0.5">
        <p className="text-[10px] text-stone-400">{label}</p>
        {d ? (
          <>
            <p className="font-semibold text-stone-700 leading-snug text-xs">{d.main}</p>
            <p className="text-[10px] text-stone-400 leading-snug">{d.sub}</p>
          </>
        ) : (
          <p className="font-semibold text-stone-700 text-xs">{raw || "—"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {/* 월주 글자 */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <p className="text-[10px] text-stone-400 mb-1">나의 월주</p>
              <p className="text-lg font-bold font-myeongjo text-stone-700">{myMonthGan}{myMonthJi}</p>
            </div>
            <div className="w-8 h-px bg-stone-200" />
            <div className="text-center">
              <p className="text-[10px] text-stone-400 mb-1">상대 월주</p>
              <p className="text-lg font-bold font-myeongjo text-stone-700">{partnerMonthGan}{partnerMonthJi}</p>
            </div>
          </div>

          {/* Step a: 사회적 시선 */}
          <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-blue-700">사회적 시선</p>
            <div className="grid grid-cols-2 gap-3">
              {renderLabel(aMy, SIPSIN_LABEL, "나의 시선")}
              {renderLabel(aPartner, SIPSIN_LABEL, "상대의 시선")}
            </div>
          </div>

          {/* Step b: 사회적 성향 */}
          <div className="rounded-lg bg-sky-50/60 border border-sky-100 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-sky-700">사회적 성향</p>
            <div className="grid grid-cols-2 gap-3">
              {renderLabel(bMy, WOLJU_MY_DESC, "나의 성향")}
              {renderLabel(bPartner, WOLJU_MY_DESC, "상대의 성향")}
            </div>
          </div>

          {/* Step c: 사회적 환경 */}
          <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-600">사회적 환경</p>
              <p className="text-xs text-stone-500 mt-0.5">
                {jiRel.type === "없음" ? "자연스러운 흐름" : jiRel.type}
              </p>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
              jiRel.strength === "강" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              jiRel.strength === "약" ? "bg-red-50 text-red-500 border-red-200" :
              "bg-stone-100 text-stone-500 border-stone-200"
            }`}>
              {jiRel.strength === "강" ? "잘 맞아요" : jiRel.strength === "약" ? "차이 있어요" : "무난해요"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── 시주비교 카드 ─────────────────────────────────────────────────────────────
const SijuCard: React.FC<{
  item: DetailItemData;
  myHourGan: string; partnerHourGan: string;
  myHourJi: string; partnerHourJi: string;
  myDayGan: string; partnerDayGan: string;
}> = ({ item, myHourGan, partnerHourGan, myHourJi, partnerHourJi, myDayGan, partnerDayGan }) => {
  const [open, setOpen] = useState(false);
  const jiRel = getJiRelation(myHourJi, partnerHourJi);
  const aMy = getSipsin(myHourGan, partnerHourGan);
  const aPartner = getSipsin(partnerHourGan, myHourGan);
  const bMy = getSipsin(myDayGan, myHourGan);
  const bPartner = getSipsin(partnerDayGan, partnerHourGan);

  const renderLabel = (
    raw: string,
    descMap: Record<string, { main: string; sub: string }>,
    label: string,
  ) => {
    const d = descMap[raw];
    return (
      <div className="space-y-0.5">
        <p className="text-[10px] text-stone-400">{label}</p>
        {d ? (
          <>
            <p className="font-semibold text-stone-700 leading-snug text-xs">{d.main}</p>
            <p className="text-[10px] text-stone-400 leading-snug">{d.sub}</p>
          </>
        ) : (
          <p className="font-semibold text-stone-700 text-xs">{raw || "—"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-sm font-semibold text-stone-700">{item.title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
          {/* 시주 글자 */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <p className="text-[10px] text-stone-400 mb-1">나의 시주</p>
              <p className="text-lg font-bold font-myeongjo text-stone-700">{myHourGan}{myHourJi}</p>
            </div>
            <div className="w-8 h-px bg-stone-200" />
            <div className="text-center">
              <p className="text-[10px] text-stone-400 mb-1">상대 시주</p>
              <p className="text-lg font-bold font-myeongjo text-stone-700">{partnerHourGan}{partnerHourJi}</p>
            </div>
          </div>

          {/* Step a: 미래의 시선 */}
          <div className="rounded-lg bg-violet-50/60 border border-violet-100 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-violet-700">미래의 시선</p>
            <div className="grid grid-cols-2 gap-3">
              {renderLabel(aMy, SIPSIN_LABEL, "나의 시선")}
              {renderLabel(aPartner, SIPSIN_LABEL, "상대의 시선")}
            </div>
          </div>

          {/* Step b: 미래 성향 */}
          <div className="rounded-lg bg-sky-50/60 border border-sky-100 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-sky-700">미래 성향</p>
            <div className="grid grid-cols-2 gap-3">
              {renderLabel(bMy, SIJU_MY_DESC, "나의 성향")}
              {renderLabel(bPartner, SIJU_MY_DESC, "상대의 성향")}
            </div>
          </div>

          {/* Step c: 미래 환경 */}
          <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-600">미래 환경</p>
              <p className="text-xs text-stone-500 mt-0.5">
                {jiRel.type === "없음" ? "자연스러운 흐름" : jiRel.type}
              </p>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
              jiRel.strength === "강" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              jiRel.strength === "약" ? "bg-red-50 text-red-500 border-red-200" :
              "bg-stone-100 text-stone-500 border-stone-200"
            }`}>
              {jiRel.strength === "강" ? "잘 맞아요" : jiRel.strength === "약" ? "차이 있어요" : "무난해요"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface CoupleResultProps {
  myFortune: FortuneResponseData;
  partnerFortune: FortuneResponseData;
  onReset: () => void;
}

export const CoupleResult: React.FC<CoupleResultProps> = ({
  myFortune,
  partnerFortune,
  onReset,
}) => {
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabId>("basic");
  const [seohoText, setSeohoText] = useState<string | null>(null);
  const [seohoLoading, setSeohoLoading] = useState(false);

  const [ohaengResult, setOhaengResult] = useState<CoupleOhaengApiResult | null>(null);
  const [ohaengLoading, setOhaengLoading] = useState(false);

  const myPillars = myFortune.saju.sajuData.pillars;
  const partnerPillars = partnerFortune.saju.sajuData.pillars;
  const myDayGan = myPillars.day.gan;
  const partnerDayGan = partnerPillars.day.gan;
  const myGender = (myFortune.userInfo?.gender ?? "M") as "M" | "W";
  const partnerGender = (partnerFortune.userInfo?.gender ?? "M") as "M" | "W";
  const myOhaeng = GAN_TO_OHENG[myDayGan] ?? "";
  const partnerOhaeng = GAN_TO_OHENG[partnerDayGan] ?? "";
  const relationship = getOhaengRelationship(myOhaeng, partnerOhaeng);
  const myAge = getKoreanAge(myFortune.userInfo?.birthDate);
  const partnerAge = getKoreanAge(partnerFortune.userInfo?.birthDate);

  // 마운트 시 오행 분석 자동 호출
  useEffect(() => {
    const fetchOhaeng = async () => {
      setOhaengLoading(true);
      try {
        const res = await axios.post<{ error: boolean; data: CoupleOhaengApiResult }>(
          "/api/fortune/couple-ohaeng",
          { myPillars, partnerPillars, myGender, partnerGender },
        );
        if (!res.data.error && res.data.data) {
          setOhaengResult(res.data.data);
        }
      } catch {
        // silent fail — 카드는 준비 중 상태 유지
      } finally {
        setOhaengLoading(false);
      }
    };
    fetchOhaeng();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSeohoInterpretation = async () => {
    if (seohoLoading || seohoText) return;
    setSeohoLoading(true);

    const pillarStr = (p: typeof myPillars) =>
      `년주 ${p.year.gan}${p.year.ji} / 월주 ${p.month.gan}${p.month.ji} / 일주 ${p.day.gan}${p.day.ji} / 시주 ${p.hour.gan}${p.hour.ji}`;

    const message = [
      "두 사람의 사주 궁합을 깊이 있게 해석해주세요.",
      "",
      "[나의 사주]",
      pillarStr(myPillars),
      `일간 오행: ${myOhaeng}(${OHENG_LABEL[myOhaeng] ?? ""})`,
      "",
      "[상대방 사주]",
      pillarStr(partnerPillars),
      `일간 오행: ${partnerOhaeng}(${OHENG_LABEL[partnerOhaeng] ?? ""})`,
      "",
      `일간 오행 관계: ${relationship.type} — ${relationship.desc}`,
      "",
      "두 사람의 기질적 조화, 오행 관계, 실생활에서의 궁합 흐름, 서로 보완하는 부분과 조율이 필요한 부분을 구체적으로 해석해주세요.",
    ].join("\n");

    try {
      const res = await axios.post<{
        error?: boolean;
        reply?: string;
        message?: string;
      }>("/api/fortune/mook-a", { message, teacher: "seoho" });
      setSeohoText(
        res.data.error || !res.data.reply
          ? (res.data.message ?? "잠시 후 다시 시도해 주세요.")
          : res.data.reply,
      );
    } catch {
      setSeohoText("잠시 후 다시 시도해 주세요.");
    } finally {
      setSeohoLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-400">
      {/* 나의 정보 · 상대방 정보 — 데스크톱: 좌우 병렬, 모바일: 위아래 직렬 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionFrame
          chapterNum={1}
          title={myAge != null ? `나의 정보 (${myAge}세)` : "나의 정보"}
          hideChapter
          headerExtra={
            <DaewoonSewoonLine
              currentDaewoon={myFortune.saju.sajuData.currentDaewoon}
              currentSewoon={myFortune.saju.sajuData.currentSewoon}
            />
          }
        >
          <PersonBlock
            pillars={myPillars}
            hourPillarUnknown={myFortune.userInfo?.timeUnknown ?? false}
          />
        </SectionFrame>
        <SectionFrame
          chapterNum={2}
          title={
            partnerAge != null ? `상대방 정보 (${partnerAge}세)` : "상대방 정보"
          }
          hideChapter
          headerExtra={
            <DaewoonSewoonLine
              currentDaewoon={partnerFortune.saju.sajuData.currentDaewoon}
              currentSewoon={partnerFortune.saju.sajuData.currentSewoon}
            />
          }
        >
          <PersonBlock
            pillars={partnerPillars}
            hourPillarUnknown={partnerFortune.userInfo?.timeUnknown ?? false}
          />
        </SectionFrame>
      </div>

      {/* 대운과 세운 분석 */}
      <SectionFrame
        chapterNum={3}
        title="타이밍"
        description="운의 흐름으로 보는 지금 이 순간"
        hideChapter
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              대운 흐름
              <span className="ml-2 text-xs font-normal text-gray-500">
                10 Luck Lines
              </span>
            </h4>
            <DaewoonWaveChart
              myFortune={myFortune}
              partnerFortune={partnerFortune}
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              세운 흐름
              <span className="ml-2 text-xs font-normal text-gray-500">
                Annual Lines
              </span>
            </h4>
            <SewoonWaveChart
              myFortune={myFortune}
              partnerFortune={partnerFortune}
            />
          </div>
        </div>
      </SectionFrame>

      {/* 상세요소 */}
      <SectionFrame
        chapterNum={4}
        title="상세요소"
        description="글자와 글자 사이의 요소들"
        hideChapter
      >
        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeDetailTab === tab.id
                  ? "bg-stone-800 text-white shadow-sm"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeDetailTab === "basic" ? (
          <div className="space-y-4">
            {/* 오행분석 — 전체 너비 */}
            <OhaengCard
              result={ohaengResult}
              loading={ohaengLoading}
              item={DETAIL_ITEMS.basic[0]}
            />
            {/* 일간분석 — 전체 너비 */}
            <IlganCard
              result={ohaengResult}
              loading={ohaengLoading}
              item={DETAIL_ITEMS.basic[1]}
              myDayGan={myDayGan}
              partnerDayGan={partnerDayGan}
              myGender={myGender}
              partnerGender={partnerGender}
            />
            {/* 일지분석 — 전체 너비 */}
            <IljiCard
              result={ohaengResult}
              loading={ohaengLoading}
              item={DETAIL_ITEMS.basic[2]}
            />
            {/* 월지분석 — 전체 너비 */}
            <WoljiCard
              result={ohaengResult}
              loading={ohaengLoading}
              item={DETAIL_ITEMS.basic[3]}
            />
          </div>
        ) : activeDetailTab === "pillar" ? (
          <div className="space-y-4">
            {/* 년주비교 — 전체 너비 */}
            <NyeonjuCard
              result={ohaengResult}
              loading={ohaengLoading}
              item={DETAIL_ITEMS.pillar[0]}
              myYearGan={myPillars.year.gan}
              partnerYearGan={partnerPillars.year.gan}
              myYearJi={myPillars.year.ji}
              partnerYearJi={partnerPillars.year.ji}
            />
            {/* 월주·시주 — 2열 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WoljuCard
                item={DETAIL_ITEMS.pillar[1]}
                myMonthGan={myPillars.month.gan}
                partnerMonthGan={partnerPillars.month.gan}
                myMonthJi={myPillars.month.ji}
                partnerMonthJi={partnerPillars.month.ji}
                myDayGan={myDayGan}
                partnerDayGan={partnerDayGan}
              />
              <SijuCard
                item={DETAIL_ITEMS.pillar[2]}
                myHourGan={myPillars.hour.gan}
                partnerHourGan={partnerPillars.hour.gan}
                myHourJi={myPillars.hour.ji}
                partnerHourJi={partnerPillars.hour.ji}
                myDayGan={myDayGan}
                partnerDayGan={partnerDayGan}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DETAIL_ITEMS[activeDetailTab].map((item) => (
              <DetailCard key={item.id} {...item} />
            ))}
          </div>
        )}

      </SectionFrame>

      {/* 서호의 궁합 해석 */}
      <SectionFrame
        chapterNum={5}
        title="서호의 궁합 해석"
        description="두 사람의 사주를 읽고 풀어내는 AI 궁합 이야기"
        hideChapter
      >
        <div className="flex items-start gap-4">
          <img
            src="/Suho_chat.png"
            alt="서호"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-text-light">서호</span>
              <span className="text-[10px] font-semibold text-amber-700 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                마음을 읽는 통찰가
              </span>
            </div>

            {!seohoText && !seohoLoading && (
              <button
                onClick={fetchSeohoInterpretation}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:scale-95 transition-all shadow-sm"
              >
                서호에게 궁합 해석 받기
              </button>
            )}

            {seohoLoading && (
              <div className="flex items-center gap-2.5 py-3 text-sm text-text-muted">
                <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin shrink-0" />
                서호가 두 사람의 사주를 읽고 있습니다…
              </div>
            )}

            {seohoText && (
              <div className="bg-amber-50/70 rounded-2xl rounded-tl-sm p-5 border border-amber-100 text-sm text-text-light leading-relaxed whitespace-pre-wrap">
                {seohoText}
              </div>
            )}
          </div>
        </div>
      </SectionFrame>

      {/* 다시하기 */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-2xl px-8"
        >
          다시하기
        </Button>
      </div>
    </div>
  );
};
