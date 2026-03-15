// src/components/results/v2/sections/SipsinV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { AlertCircle } from "lucide-react";

export const SipsinV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sipsinAnalysis = fortuneResult?.saju?.interpretation?.sipsinAnalysis;

  if (!sipsinAnalysis) {
    return (
      <SectionFrame chapterNum={5} title="십신 분석">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">십신 분석 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame
      chapterNum={5}
      title="십신 분석"
      description="당신의 사회적 관계, 재능, 무의식적 욕구를 10가지 유형으로 분석합니다."
    >
      <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
        {sipsinAnalysis}
      </p>
    </SectionFrame>
  );
};
