// src/components/results/v2/sections/HwaEuiV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { AlertCircle } from "lucide-react";

export const HwaEuiV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (
    !fortuneResult?.aiResponse?.imageUrl ||
    !fortuneResult?.aiResponse?.refinedText
  ) {
    return (
      <SectionFrame chapterNum={2} title="화의(畵意)">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">화의 정보를 불러올 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { imageUrl, refinedText } = fortuneResult.aiResponse;

  return (
    <SectionFrame
      chapterNum={2}
      title="화의(畵意)"
      description="사주팔자를 한 폭의 그림으로 형상화하여 그 안에 담긴 의미를 해석합니다."
    >
      {/* AI 생성 이미지 */}
      <div className="rounded-xl overflow-hidden aspect-video bg-background-sub mb-6">
        <img
          src={imageUrl}
          alt="사주 화의"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>

      {/* 해석 텍스트 */}
      <blockquote className="border-l-2 border-accent-gold pl-5">
        <p className="font-myeongjo text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap italic">
          {refinedText}
        </p>
      </blockquote>
    </SectionFrame>
  );
};
