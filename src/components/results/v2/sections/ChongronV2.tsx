// src/components/results/v2/sections/ChongronV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle } from "lucide-react";

export const ChongronV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData) {
    return (
      <SectionFrame chapterNum={11} title="총론">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">사주 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { pillars } = fortuneResult.saju.sajuData;

  return (
    <SectionFrame
      chapterNum={11}
      title="총론"
    >
      {/* 기둥 4개 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <SajuPillarLight title="시주(時)" data={pillars.hour} />
        <SajuPillarLight title="일주(日)" data={pillars.day} />
        <SajuPillarLight title="월주(月)" data={pillars.month} />
        <SajuPillarLight title="년주(年)" data={pillars.year} />
      </div>

      {/* 범례 */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-3 text-[11px] text-text-subtle">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
          木
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-200 inline-block" />
          火
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200 inline-block" />
          土
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
          金
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200 inline-block" />
          水
        </span>
        <span className="ml-auto text-accent-lavender">십이운성</span>
        <span className="text-accent-teal">신살</span>
        <span className="text-accent-gold">귀인</span>
      </div>
    </SectionFrame>
  );
};
