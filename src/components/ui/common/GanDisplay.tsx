import React from "react";
import { cn } from "@/lib/utils";

interface GanDisplayProps {
  character: string;
  className?: string;
}

export const GanDisplay: React.FC<GanDisplayProps> = ({
  character,
  className,
}) => (
  <div
    className={cn(
      "w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700/60 border border-gray-500",
      className
    )}
  >
    <span className="text-xl font-bold text-white">{character}</span>
  </div>
);
