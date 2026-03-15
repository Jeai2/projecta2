// src/components/results/v2/sections/DayMasterV2.tsx

import { useState } from "react";
import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export const DayMasterV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const [customOpen, setCustomOpen] = useState(false);

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

  return (
    <SectionFrame
      chapterNum={4}
      title="일간 해석"
      description={`당신을 상징하는 핵심 기운, 일간(${dayGan})을 중심으로 성향과 에너지를 분석합니다.`}
    >
      {/* 4기둥 — 일주 강조 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        <SajuPillarLight
          title="시주"
          data={pillars.hour}
          shouldDimOthers
        />
        <SajuPillarLight
          title="일주"
          data={pillars.day}
          isHighlighted
          shouldDimOthers
        />
        <SajuPillarLight
          title="월주"
          data={pillars.month}
          shouldDimOthers
        />
        <SajuPillarLight
          title="년주"
          data={pillars.year}
          shouldDimOthers
        />
      </div>

      {/* 기본 해석 */}
      <div className="border-t border-gray-100 pt-6">
        <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
          {interpretation.dayMasterNature.base}
        </p>
      </div>

      {/* 심층 분석 — 있을 때만 */}
      {interpretation.dayMasterNature.custom && (
        <div className="mt-5">
          <button
            onClick={() => setCustomOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-accent-gold hover:text-accent-gold/75 transition"
          >
            심층 분석 보기
            {customOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          {customOpen && (
            <div className="mt-4 p-5 bg-background-sub rounded-xl">
              <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
                {interpretation.dayMasterNature.custom}
              </p>
            </div>
          )}
        </div>
      )}
    </SectionFrame>
  );
};
