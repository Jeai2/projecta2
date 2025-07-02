import React from "react";
import { motion } from "framer-motion";
import { CHARACTER_ICON_MAP } from "@/components/ui/common/iconUtils";
import type { StarData } from "@/types/fortune";

interface SinsalSummaryCardProps {
  data: StarData;
  onClick: () => void;
  layoutId: string;
}

export const SinsalSummaryCard: React.FC<SinsalSummaryCardProps> = ({
  data,
  onClick,
  layoutId,
}) => {
  const originDescription = data.elements
    .map((el) => (el.character ? `${el.pillar}의 ${el.character.trim()}` : ""))
    .join("와 ");

  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors flex flex-col space-y-3"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h4 className="text-lg font-bold text-accent-gold text-center">
        {data.name}
      </h4>

      <div className="flex items-center justify-center space-x-4">
        {data.elements.map((el, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              {/* ✅ .trim() 적용 (2/3): 아이콘 맵 조회 시 */}
              {CHARACTER_ICON_MAP[el.character?.trim()] || (
                <span className="text-3xl">?</span>
              )}
              {/* ✅ .trim() 적용 (3/3): 글자 표시 시 */}
              <span className="text-xl font-bold mt-1">
                {el.character?.trim()}
              </span>
            </div>
            {index < data.elements.length - 1 && (
              <span className="text-lg font-semibold">+</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-center text-text-muted pt-2 border-t border-white/10">
        {`${originDescription}의 관계`}
      </p>
    </motion.div>
  );
};
