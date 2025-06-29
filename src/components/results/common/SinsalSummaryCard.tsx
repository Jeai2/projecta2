import React from "react";
import { motion } from "framer-motion";
import { jijinIcons } from "@/components/ui/common/iconUtils";
import type { SinsalData } from "@/types/fortune";

interface SinsalSummaryCardProps {
  data: SinsalData;
  onClick: () => void;
  layoutId: string;
}

export const SinsalSummaryCard: React.FC<SinsalSummaryCardProps> = ({
  data,
  onClick,
  layoutId,
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        {data.elements.map((el, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              {jijinIcons[el] || <span className="text-3xl">?</span>}
              <span className="text-xl font-bold mt-1">{el}</span>
            </div>
            {index < data.elements.length - 1 && (
              <span className="text-lg">&</span>
            )}
          </React.Fragment>
        ))}
        <div className="flex-grow">
          <h4 className="text-lg font-bold text-accent-gold">{data.name}</h4>
          <p className="text-sm text-text-muted">{data.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
