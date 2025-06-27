// src/components/results/common/SajuPillar.tsx (새 파일)

import React from "react";
import type { PillarData } from "@/types/fortune";

// 오행에 따른 색상 Tailwind 클래스 매핑
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
  isHighlighted?: boolean;
}

export const SajuPillar: React.FC<SajuPillarProps> = ({ title, data }) => {
  // 귀인 정보만 필터링 (예시: 천을귀인, 태극귀인)
  const guiin = data.sinsal
    .filter((s) => s.includes("귀인"))
    .slice(0, 1)
    .join(", ");

  return (
    <div className="text-center space-y-1 text-sm flex flex-col">
      <div className="font-semibold text-text-muted">{title}</div>
      <div className="text-xs text-text-muted h-5 flex items-center justify-center">
        {data.ganSipsin || ""}
      </div>
      <div
        className={`p-2 rounded-md text-2xl font-bold border ${
          ohaengColors[data.ganOhaeng] || "bg-gray-700"
        }`}
      >
        {data.gan}
      </div>
      <div
        className={`p-2 rounded-md text-2xl font-bold border ${
          ohaengColors[data.jiOhaeng] || "bg-gray-700"
        }`}
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
        {data.sinsal.find((s) => !s.includes("귀인")) || ""}
      </div>
      <div className="text-xs text-accent-gold h-5 flex items-center justify-center">
        {guiin || ""}
      </div>
    </div>
  );
};
