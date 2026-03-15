// src/components/results/v2/ChapterNav.tsx
// 챕터 이동 네비게이션 + 목차 모달

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlignJustify } from "lucide-react";
import { useFortuneStore } from "@/store/fortuneStore";
import { cn } from "@/lib/utils";

export const CHAPTER_TITLES = [
  "서문",
  "화의(畵意)",
  "사주팔자",
  "일간 해석",
  "십신 분석",
  "십이운성",
  "초년·청년기",
  "중년·말년",
  "살의(殺意)",
  "길신(吉神)",
  "연애와 결혼",
  "적성과 직업",
  "건강",
  "대운 분석",
  "세운 분석",
  "절운 분석",
  "총평",
];

export const ChapterNav = () => {
  const { resultCurrentPage, setResultCurrentPage, resetFortuneResult } =
    useFortuneStore();
  const [tocOpen, setTocOpen] = useState(false);

  const total = CHAPTER_TITLES.length;
  const prevTitle =
    resultCurrentPage > 1 ? CHAPTER_TITLES[resultCurrentPage - 2] : null;
  const nextTitle =
    resultCurrentPage < total ? CHAPTER_TITLES[resultCurrentPage] : null;

  return (
    <>
      {/* 목차 모달 */}
      {tocOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm"
          onClick={() => setTocOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-myeongjo font-bold text-text-light text-base">
                목차
              </span>
              <button
                onClick={() => {
                  resetFortuneResult();
                  setTocOpen(false);
                }}
                className="text-xs text-text-muted hover:text-system-danger transition px-2 py-1 rounded"
              >
                처음으로
              </button>
            </div>
            <ul className="overflow-y-auto max-h-[60vh] py-2">
              {CHAPTER_TITLES.map((ch, i) => (
                <li key={ch}>
                  <button
                    onClick={() => {
                      setResultCurrentPage(i + 1);
                      setTocOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center gap-3",
                      resultCurrentPage === i + 1
                        ? "bg-accent-gold/10 text-accent-gold font-semibold"
                        : "text-text-muted hover:bg-gray-50"
                    )}
                  >
                    <span className="text-[10px] text-text-subtle font-mono w-5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {ch}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 네비게이션 바 */}
      <div className="mt-6 flex items-center gap-3">
        {/* 이전 */}
        <button
          onClick={() =>
            setResultCurrentPage(Math.max(1, resultCurrentPage - 1))
          }
          disabled={resultCurrentPage === 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-muted hover:border-accent-gold hover:text-accent-gold transition disabled:opacity-25 disabled:pointer-events-none flex-1 min-w-0"
        >
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          <span className="truncate hidden sm:inline text-xs">
            {prevTitle}
          </span>
          <span className="truncate sm:hidden text-xs">이전</span>
        </button>

        {/* 목차 버튼 */}
        <button
          onClick={() => setTocOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-text-muted hover:border-gray-300 hover:bg-gray-50 transition flex-shrink-0 whitespace-nowrap"
        >
          <AlignJustify className="w-3.5 h-3.5" />
          <span>
            {resultCurrentPage} / {total}
          </span>
        </button>

        {/* 다음 */}
        <button
          onClick={() =>
            setResultCurrentPage(Math.min(total, resultCurrentPage + 1))
          }
          disabled={resultCurrentPage === total}
          className="flex items-center justify-end gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-muted hover:border-accent-gold hover:text-accent-gold transition disabled:opacity-25 disabled:pointer-events-none flex-1 min-w-0"
        >
          <span className="truncate hidden sm:inline text-xs">
            {nextTitle}
          </span>
          <span className="truncate sm:hidden text-xs">다음</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </>
  );
};
