// src/components/results/v2/SectionFrame.tsx
// 모든 V2 섹션의 공통 카드 프레임

import React from "react";

interface SectionFrameProps {
  chapterNum: number;
  title: string;
  description?: string;
  /** 제목 아래, 본문 위에 배치할 추가 내용 */
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  hideChapter?: boolean;
}

export const SectionFrame: React.FC<SectionFrameProps> = ({
  chapterNum,
  title,
  description,
  headerExtra,
  children,
  hideChapter = false,
}) => {
  const numStr = String(chapterNum).padStart(2, "0");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 챕터 헤더 */}
      <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100">
        {!hideChapter && (
          <span className="block text-[11px] font-semibold text-accent-gold tracking-widest uppercase mb-1">
            Chapter {numStr}
          </span>
        )}
        <h2 className="font-myeongjo text-2xl sm:text-3xl font-bold text-text-light leading-snug">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
        {headerExtra}
      </div>

      {/* 본문 */}
      <div className="px-6 sm:px-8 py-7">{children}</div>
    </div>
  );
};
