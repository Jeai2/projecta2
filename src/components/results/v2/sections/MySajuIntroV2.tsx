// src/components/results/v2/sections/MySajuIntroV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle } from "lucide-react";

export const MySajuIntroV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData) {
    return (
      <SectionFrame chapterNum={3} title="사주팔자">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">사주 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { pillars, wangseStrength } = fortuneResult.saju.sajuData;
  const userName = fortuneResult.userInfo?.name || "당신";

  return (
    <SectionFrame
      chapterNum={3}
      title="사주팔자"
      description="태어난 시기의 기운으로 '나'를 알아보자"
    >
      {/* 기둥 4개 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <SajuPillarLight title="시주(時)" data={pillars.hour} bareMode />
        <SajuPillarLight title="일주(日)" data={pillars.day} bareMode />
        <SajuPillarLight title="월주(月)" data={pillars.month} bareMode />
        <SajuPillarLight title="년주(年)" data={pillars.year} bareMode />
      </div>
      {/* 오행 범례 — 그리드 하단 오른쪽 정렬 */}
      <div className="flex items-center justify-end gap-3 mt-3 mb-6 text-[11px] text-text-subtle">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
          목(木)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-200 inline-block" />
          화(火)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200 inline-block" />
          토(土)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
          금(金)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200 inline-block" />
          수(水)
        </span>
      </div>

      <p className="mb-10 text-[13px] leading-[1.9] text-text-muted">
        사주팔자(사주팔자)
      </p>
      {/* 신강/신약 설명 */}
      {wangseStrength && (
        <p className="text-[13px] leading-[1.9] text-text-muted">
          <span className="font-semibold text-text-light">{userName}</span>님의 사주는{" "}
          <span className="font-semibold text-text-light">{wangseStrength.level}</span> 사주입니다.{" "}
          {wangseStrength.levelDetail}
        </p>
      )}
    </SectionFrame>
  );
};
