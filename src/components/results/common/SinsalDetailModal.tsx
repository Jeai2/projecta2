import React from "react";
import { motion } from "framer-motion";
import { XIcon } from "@/components/ui/common/Icons";
import type { SinsalData } from "@/types/fortune";

interface SinsalDetailModalProps {
  sinsal: SinsalData;
  onClose: () => void;
  layoutId: string;
}

export const SinsalDetailModal: React.FC<SinsalDetailModalProps> = ({
  sinsal,
  onClose,
  layoutId,
}) => {
  return (
    // 배경 레이어
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      {/* 모달 컨텐츠 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        layoutId={layoutId}
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시 배경 클릭 방지
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden"
      >
        {/* 일러스트 영역 */}
        <div className="bg-gray-800 h-48 flex items-center justify-center">
          <img
            src={sinsal.illustration}
            alt={sinsal.name}
            className="object-cover h-full w-full opacity-50"
          />
          <span className="absolute text-white/50">일러스트 영역</span>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
          <h3 className="text-2xl font-bold text-accent-gold mb-2">
            {sinsal.name}
          </h3>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-text-muted">
            {sinsal.details}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
