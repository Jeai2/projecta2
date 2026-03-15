// src/components/results/v2/SajuPillarLight.tsx
// 라이트 테마 사주 기둥 컴포넌트

import React from "react";
import type { PillarData, SinsalHit } from "@/types/fortune";
import { cn } from "@/lib/utils";

const ohaengLight: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

interface SajuPillarLightProps {
  title: string;
  data: PillarData;
  isHighlighted?: boolean;
  shouldDimOthers?: boolean;
  /** 시주 등 시간 미입력 시 빈 박스로 표시 */
  isEmpty?: boolean;
}

export const SajuPillarLight: React.FC<SajuPillarLightProps> = ({
  title,
  data,
  isHighlighted,
  shouldDimOthers,
  isEmpty = false,
}) => {
  const guiin =
    data.sinsal.find((s: SinsalHit) => s.name.includes("귀인"))?.name || "";
  const otherSinsal =
    data.sinsal.find((s: SinsalHit) => !s.name.includes("귀인"))?.name || "";

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-1 transition-all duration-300">
        <span className="text-xs font-semibold mb-0.5 text-text-muted">{title}</span>
        <span className="text-[10px] text-text-subtle h-4 flex items-center">&nbsp;</span>
        <div className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-3 text-center min-h-[48px]" />
        <div className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-3 text-center min-h-[48px]" />
        <span className="text-[10px] text-text-subtle h-4 flex items-center">&nbsp;</span>
        <span className="text-[10px] text-text-muted h-4 flex items-center">생시 미입력</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300",
        shouldDimOthers && !isHighlighted && "opacity-30",
        isHighlighted && "scale-[1.03]"
      )}
    >
      {/* 기둥 제목 */}
      <span
        className={cn(
          "text-xs font-semibold mb-0.5",
          isHighlighted ? "text-accent-gold" : "text-text-muted"
        )}
      >
        {title}
      </span>

      {/* 천간 십성 */}
      <span className="text-[10px] text-text-subtle h-4 flex items-center">
        {data.ganSipsin || ""}
      </span>

      {/* 천간 */}
      <div
        className={cn(
          "w-full rounded-lg border text-2xl font-bold font-myeongjo py-3 text-center",
          ohaengLight[data.ganOhaeng] || "bg-gray-50 border-gray-200 text-gray-700",
          isHighlighted && "ring-2 ring-accent-gold/40"
        )}
      >
        {data.gan}
      </div>

      {/* 지지 */}
      <div
        className={cn(
          "w-full rounded-lg border text-2xl font-bold font-myeongjo py-3 text-center",
          ohaengLight[data.jiOhaeng] || "bg-gray-50 border-gray-200 text-gray-700",
          isHighlighted && "ring-2 ring-accent-gold/40"
        )}
      >
        {data.ji}
      </div>

      {/* 지지 십성 */}
      <span className="text-[10px] text-text-subtle h-4 flex items-center">
        {data.jiSipsin || ""}
      </span>

      {/* 십이운성 */}
      <span className="text-[10px] text-accent-lavender h-4 flex items-center">
        {data.sibiwunseong || ""}
      </span>

      {/* 신살 */}
      <span className="text-[10px] text-accent-teal h-4 flex items-center text-center leading-tight">
        {otherSinsal}
      </span>

      {/* 귀인 */}
      <span className="text-[10px] text-accent-gold font-semibold h-4 flex items-center text-center">
        {guiin}
      </span>
    </div>
  );
};
