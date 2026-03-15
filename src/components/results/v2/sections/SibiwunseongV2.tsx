// src/components/results/v2/sections/SibiwunseongV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { AlertCircle } from "lucide-react";

export const SibiwunseongV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sibiwunseongAnalysis =
    fortuneResult?.saju?.interpretation?.sibiwunseongAnalysis;

  if (!sibiwunseongAnalysis) {
    return (
      <SectionFrame chapterNum={6} title="십이운성">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">십이운성 분석 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame
      chapterNum={6}
      title="십이운성"
      description="인생의 12가지 단계를 통해 타고난 에너지의 강약과 흐름을 분석합니다."
    >
      <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
        {sibiwunseongAnalysis}
      </p>
    </SectionFrame>
  );
};
