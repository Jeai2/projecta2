// src/components/results/v2/sections/SinsalV2.tsx

import { useState } from "react";
import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import type { StarData } from "@/types/fortune";
import { ChevronDown, ChevronUp } from "lucide-react";

const SinsalCard = ({ star }: { star: StarData }) => {
  const [open, setOpen] = useState(false);

  const originLabel = star.elements
    .map((el) => (el.character ? `${el.pillar}의 ${el.character.trim()}` : ""))
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition"
      >
        <div className="min-w-0">
          <p className="font-semibold text-text-light text-sm">{star.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{star.description}</p>
          {originLabel && (
            <p className="text-[11px] text-text-subtle mt-1">{originLabel}</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {open ? (
            <ChevronUp className="w-4 h-4 text-text-subtle" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-subtle" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-background-sub">
          <p className="text-sm leading-[1.8] text-text-muted whitespace-pre-wrap">
            {star.details}
          </p>
        </div>
      )}
    </div>
  );
};

export const SinsalV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sinsalData = fortuneResult?.saju?.interpretation?.sinsalAnalysis ?? [];

  return (
    <SectionFrame
      chapterNum={9}
      title="살의(殺意)"
      description="사주에 숨겨져 당신의 삶에 특별한 영향을 미치는 기운(살)들을 분석합니다."
    >
      {sinsalData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-text-muted py-12 gap-2">
          <p className="text-sm font-medium">해당 없음</p>
          <p className="text-xs text-text-subtle">
            사주에 특별히 작용하는 살(殺)이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sinsalData.map((star) => (
            <SinsalCard key={star.name} star={star} />
          ))}
        </div>
      )}
    </SectionFrame>
  );
};
