// src/components/results/v2/sections/EarlyYearsV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle, Clock } from "lucide-react";

const PILLAR_MAP: Record<string, "year" | "month" | "day" | "hour"> = {
  년주: "year",
  월주: "month",
  일주: "day",
  시주: "hour",
};

export const EarlyYearsV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData) {
    return (
      <SectionFrame chapterNum={7} title="초년·청년기">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">데이터를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { pillars } = fortuneResult.saju.sajuData;

  return (
    <SectionFrame
      chapterNum={7}
      title="초년·청년기"
      description="인생 전반부, 초년(년주)과 청년(월주) 시절의 환경과 에너지를 분석합니다."
    >
      {/* 년주·월주 강조 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        {(["시주", "일주", "월주", "년주"] as const).map((title) => (
          <SajuPillarLight
            key={title}
            title={title}
            data={pillars[PILLAR_MAP[title]]}
            isHighlighted={title === "년주" || title === "월주"}
            shouldDimOthers
          />
        ))}
      </div>

      {/* 준비 중 안내 */}
      <div className="border-t border-gray-100 pt-6 flex flex-col items-center justify-center text-center gap-2 py-10">
        <Clock className="w-7 h-7 text-gray-300" />
        <p className="text-sm font-medium text-text-muted">해석 준비 중</p>
        <p className="text-xs text-text-subtle">
          백엔드 해석 로직 연동 후 표시됩니다.
        </p>
      </div>
    </SectionFrame>
  );
};
