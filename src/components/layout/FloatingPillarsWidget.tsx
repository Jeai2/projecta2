import React, { useState } from "react";

interface FloatingPillarsWidgetProps {
  // 간지 문자열 (예: "甲子")
  pillars?: {
    year?: string | null;
    month?: string | null;
    day?: string | null;
    hour?: string | null;
  };
  // 현재 대운 간지 (예: "甲子")
  daewoonGanji?: string | null;
}

/**
 * 만세력 네 기둥(년/월/일/시)을 화면 우측 하단에 작게 띄워두는 플로팅 위젯.
 * 진로/직업 결과 등을 보면서 사주팔자를 수시로 확인할 수 있게 한다.
 */
export const FloatingPillarsWidget: React.FC<FloatingPillarsWidgetProps> = ({
  pillars,
  daewoonGanji,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!pillars) return null;

  const { year, month, day, hour } = pillars;
  if (!year && !month && !day && !hour) return null;

  const daewoonDisplay = daewoonGanji ?? "-";

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-slate-900/85 text-white rounded-2xl shadow-xl backdrop-blur px-4 py-3">
          <div className="flex items-end gap-4">
            <div className="flex flex-col text-[10px] text-slate-300 leading-tight gap-1">
              <span>년</span>
              <span>월</span>
              <span>일</span>
              <span>시</span>
              <span>운</span>
            </div>
            <div className="flex flex-col text-2xl font-semibold leading-tight gap-1">
              <span>{year ?? "-"}</span>
              <span>{month ?? "-"}</span>
              <span>{day ?? "-"}</span>
              <span>{hour ?? "-"}</span>
              <span>{daewoonDisplay}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/90 text-slate-100 shadow-lg backdrop-blur hover:bg-slate-800 transition-colors text-xs"
        aria-label={isOpen ? "만세력 플로팅 패널 접기" : "만세력 플로팅 패널 펼치기"}
      >
        {isOpen ? "접기" : "년월일시"}
      </button>
    </div>
  );
};

