// src/components/results/CoupleResult.tsx
// 커플 궁합 결과 — SectionFrame 스타일, 사주팔자/대운/세운/궁합 통일

import React, { useState } from "react";
import axios from "axios";
import {
  Zap,
  Sun,
  MapPin,
  CalendarDays,
  BookOpen,
  FileText,
  Users,
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

const OHENG_LABEL: Record<string, string> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};

/** 일간 박스용 오행별 색상 (배경·테두리·텍스트) */
const OHENG_BOX_CLASS: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

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
  { id: "basic", label: "기초 분석" },
  { id: "pillar", label: "기둥 비교" },
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
      id: "ilju",
      title: "일주비교",
      subtitle: "두 사람의 일주를 비교하여 일상 속 궁합을 분석합니다.",
      icon: Users,
      accentClass: "text-indigo-600",
      bgClass: "bg-indigo-50/60",
      borderClass: "border-indigo-100",
      dotClass: "bg-indigo-400",
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

  const myPillars = myFortune.saju.sajuData.pillars;
  const partnerPillars = partnerFortune.saju.sajuData.pillars;
  const myDayGan = myPillars.day.gan;
  const partnerDayGan = partnerPillars.day.gan;
  const myOhaeng = GAN_TO_OHENG[myDayGan] ?? "";
  const partnerOhaeng = GAN_TO_OHENG[partnerDayGan] ?? "";
  const relationship = getOhaengRelationship(myOhaeng, partnerOhaeng);
  const myAge = getKoreanAge(myFortune.userInfo?.birthDate);
  const partnerAge = getKoreanAge(partnerFortune.userInfo?.birthDate);

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
              대운 비교
              <span className="ml-2 text-xs font-normal text-gray-500">
                궁합 그래프
              </span>
            </h4>
            <DaewoonWaveChart
              myFortune={myFortune}
              partnerFortune={partnerFortune}
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              세운 비교
              <span className="ml-2 text-xs font-normal text-gray-500">
                궁합 그래프
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DETAIL_ITEMS[activeDetailTab].map((item) => (
            <DetailCard key={item.id} {...item} />
          ))}
        </div>

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
