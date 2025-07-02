import React from "react";
import { cn } from "@/lib/utils";
import { HANJA_TO_HANGUL, HANJA_TO_OHENG } from "./iconUtils";

interface CharacterIconProps {
  character: string;
  className?: string;
}

export const CharacterIcon: React.FC<CharacterIconProps> = ({
  character,
  className,
}) => {
  const hangul = HANJA_TO_HANGUL[character] || "?";
  const ohaeng = HANJA_TO_OHENG[character] || "...";

  // 오행에 따른 색상 Tailwind 클래스 매핑
  const ohaengColors: { [key: string]: string } = {
    木: "text-green-400",
    火: "text-red-400",
    土: "text-yellow-400",
    金: "text-gray-400",
    水: "text-blue-400",
  };

  const ohaengChar = ohaeng.slice(-1); // "陽木" -> "木"
  const ohaengColorClass = ohaengColors[ohaengChar] || "text-gray-500";

  return (
    <div
      className={cn(
        "relative w-16 h-16 bg-gray-800/80 border border-white/10 rounded-lg p-1 flex flex-col justify-center items-center font-myeongjo",
        className
      )}
    >
      <span className="absolute top-1 left-1.5 text-xs text-text-muted">
        {hangul}
      </span>
      <span className="text-4xl font-bold text-text-light">{character}</span>
      <span
        className={cn("absolute bottom-1 right-1.5 text-xs", ohaengColorClass)}
      >
        {ohaeng}
      </span>
    </div>
  );
};
