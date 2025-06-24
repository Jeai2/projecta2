// src/components/results/sections/SectionPagination.tsx

import React from "react";
import { Button } from "@/components/ui/common/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SectionPaginationProps {
  prevSectionId?: string;
  nextSectionId?: string;
}

export const SectionPagination: React.FC<SectionPaginationProps> = ({
  prevSectionId,
  nextSectionId,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
      {/* 이전 버튼: prevSectionId가 있을 때만 보임 */}
      {prevSectionId ? (
        <Button asChild variant="outline">
          <a href={`#${prevSectionId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 이전
          </a>
        </Button>
      ) : (
        // 이전 버튼이 없을 때 공간을 차지할 빈 div
        <div></div>
      )}

      {/* 다음 버튼: nextSectionId가 있을 때만 보임 */}
      {nextSectionId && (
        <Button asChild variant="outline">
          <a href={`#${nextSectionId}`}>
            다음 <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      )}
    </div>
  );
};
