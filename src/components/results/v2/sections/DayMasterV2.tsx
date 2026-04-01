// src/components/results/v2/sections/DayMasterV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** SajuPillarLight와 동일한 오행 배지 (천간·지지 한자) */
const ohaengPill: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

const OHAENG_HANGUL: Record<string, string> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};

function IljuHanjaBadge({ char, ohaeng }: { char: string; ohaeng: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-[2.25rem] items-center justify-center rounded-lg border px-2.5 py-1 text-xl font-myeongjo font-bold leading-none",
        ohaengPill[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-800"
      )}
    >
      {char}
    </span>
  );
}

function IljuOhaengText({ ohaeng }: { ohaeng: string }) {
  const hangul = OHAENG_HANGUL[ohaeng] ?? "";
  if (!hangul) return null;
  return (
    <span className="text-[11px] text-text-muted">
      <span className="font-medium text-text-light">{hangul}</span>
      <span className="text-text-subtle">({ohaeng})</span>
    </span>
  );
}

function buildDayMasterDetailIntro(displayName: string | undefined): string {
  const name = displayName?.trim();
  if (name && name !== "미입력") {
    return `일주(日柱)는 태어난 생일로 사주팔자의 ${name}님을 뜻하는 주체이며, 기준점으로 잡을 수가 있습니다. 
    '나'를 뜻하는 일간(日干)과 이를 받쳐주는 일지(日支)로 구성됩니다.`;
  }
  return "일주(日柱)는 태어난 생일로 사주팔자에서 당신을 뜻하는 주체이며, 기준점으로 잡을 수가 있습니다. '나'를 뜻하는 일간(日干)과 이를 받쳐주는 일지(日支)로 구성됩니다.";
}

export const DayMasterV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData || !fortuneResult.saju?.interpretation) {
    return (
      <SectionFrame chapterNum={4} title="일간 해석">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">해석 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { sajuData, interpretation } = fortuneResult.saju;
  const { pillars } = sajuData;
  const dayGan = pillars.day.gan;
  const dayJi = pillars.day.ji;
  const dayGanOhaeng = pillars.day.ganOhaeng;
  const dayJiOhaeng = pillars.day.jiOhaeng;

  const { dayMasterNature, dayMasterCharacter, iljuDayMaster } = interpretation;

  /** 일간(천간) 해석 */
  const ilganText =
    dayMasterNature.custom?.trim() || dayMasterCharacter?.trim() || "";

  /** 일주(일주론) 해석 */
  const iljuText = iljuDayMaster?.detail?.trim() || "";

  const summaryText = iljuDayMaster?.iljuSummary?.trim() || dayMasterNature.base;
  const detailIntro = buildDayMasterDetailIntro(fortuneResult.userInfo?.name);

  return (
    <SectionFrame
      chapterNum={4}
      title="일주 해석"
      description="사주에서 '나'를 뜻하는 일간과 일주를 중심으로 해석합니다."
    >
      {/* 4기둥 — 일주 강조 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        <SajuPillarLight title="시주" data={pillars.hour} shouldDimOthers />
        <SajuPillarLight
          title="일주"
          data={pillars.day}
          isHighlighted
          shouldDimOthers
        />
        <SajuPillarLight title="월주" data={pillars.month} shouldDimOthers />
        <SajuPillarLight title="년주" data={pillars.year} shouldDimOthers />
      </div>

      {/* 요약 */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-3">
          요약
        </h3>
        <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
          {summaryText}
        </p>
      </div>

      {/* 자세한 해석 — INTRO + 일간 블록 + 일주 블록 */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-3">
          자세한 해석
        </h3>
        <p className="text-sm leading-relaxed text-text-subtle mb-6">
          {detailIntro}
        </p>

        {/* ── 일간 ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <IljuHanjaBadge char={dayGan} ohaeng={dayGanOhaeng} />
            <div>
              <p className="text-xs font-semibold text-accent-gold tracking-widest uppercase leading-none mb-0.5">
                일간
              </p>
              <IljuOhaengText ohaeng={dayGanOhaeng} />
            </div>
          </div>
          {ilganText ? (
            <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
              {ilganText}
            </p>
          ) : (
            <p className="text-sm text-text-subtle italic">천간 해석 준비 중</p>
          )}
        </div>

        {/* ── 일주 ── */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <IljuHanjaBadge char={dayGan} ohaeng={dayGanOhaeng} />
            <IljuHanjaBadge char={dayJi} ohaeng={dayJiOhaeng} />
            <div>
              <p className="text-xs font-semibold text-accent-gold tracking-widest uppercase leading-none mb-0.5">
                일주
              </p>
              <span className="text-[11px] text-text-muted">
                <span className="font-medium text-text-light">
                  {OHAENG_HANGUL[dayGanOhaeng] ?? ""}
                </span>
                <span className="text-text-subtle">({dayGanOhaeng})</span>
                <span className="text-text-subtle mx-0.5">·</span>
                <span className="font-medium text-text-light">
                  {OHAENG_HANGUL[dayJiOhaeng] ?? ""}
                </span>
                <span className="text-text-subtle">({dayJiOhaeng})</span>
              </span>
            </div>
          </div>
          {iljuText ? (
            <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
              {iljuText}
            </p>
          ) : (
            <p className="text-sm text-text-subtle italic">일주론 해석 준비 중</p>
          )}
        </div>
      </div>
    </SectionFrame>
  );
};
