// src/components/results/common/SajuPillar.tsx

import React from "react";
import type { PillarData } from "@/types/fortune";
import { cn } from "@/lib/utils";

// 오행별 색상 매핑
const ohaengColors: { [key: string]: string } = {
  木: "bg-green-800/50 border-green-600 text-green-300",
  火: "bg-red-800/50 border-red-500 text-red-300",
  土: "bg-yellow-800/50 border-yellow-500 text-yellow-300",
  金: "bg-gray-500/50 border-gray-400 text-gray-200",
  水: "bg-blue-800/50 border-blue-500 text-blue-300",
};

interface SajuPillarProps {
  title: string;
  data: PillarData;
  isHighlighted?: boolean; // ✅ 강조 여부
  shouldDimOthers?: boolean;
}

export const SajuPillar: React.FC<SajuPillarProps> = ({
  title,
  data,
  isHighlighted,
  shouldDimOthers,
}) => {
  const guiin = data.sinsal.find((s) => s.includes("귀인")) || "";
  const otherSinsal = data.sinsal.find((s) => !s.includes("귀인")) || "";

  return (
    <div
      className={cn(
        "text-center space-y-1 text-sm flex flex-col p-2 rounded-lg transition-all duration-300",
        shouldDimOthers &&
          !isHighlighted &&
          "opacity-40 grayscale hover:opacity-60",
        isHighlighted && "bg-accent-gold/10 backdrop-blur-0 scale-105 z-10"
      )}
    >
      <div className="font-semibold text-text-muted">{title}</div>
      <div className="text-xs text-text-muted h-5 flex items-center justify-center">
        {data.ganSipsin || ""}
      </div>
      <div
        className={cn(
          "p-2 rounded-md text-2xl font-bold border",
          ohaengColors[data.ganOhaeng] || "bg-gray-700",
          isHighlighted && "border-accent-gold"
        )}
      >
        {data.gan}
      </div>
      <div
        className={cn(
          "p-2 rounded-md text-2xl font-bold border",
          ohaengColors[data.jiOhaeng] || "bg-gray-700",
          isHighlighted && "border-accent-gold"
        )}
      >
        {data.ji}
      </div>
      <div className="text-xs text-text-muted pt-1 h-5 flex items-center justify-center">
        {data.jiSipsin || ""}
      </div>
      <div className="text-xs text-accent-lavender h-5 flex items-center justify-center">
        {data.sibiwunseong || ""}
      </div>
      <div className="text-xs text-accent-teal h-5 flex items-center justify-center">
        {otherSinsal}
      </div>
      <div className="text-xs text-accent-gold h-5 flex items-center justify-center font-semibold">
        {guiin}
      </div>
    </div>
  );
};
