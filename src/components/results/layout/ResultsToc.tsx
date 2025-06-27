// src/components/results/layout/ResultsToc.tsx (최종 완성본)

import { cn } from "@/lib/utils";
import { useFortuneStore } from "@/store/fortuneStore";
import { Button } from "@/components/ui/common/Button";

const TABLE_OF_CONTENTS = [
  "서문",
  "화의(畵意)",
  "사주팔자",
  "일주 해석",
  "십신 해석",
  "십이운성 해석",
  "초년과 청년기",
  "중년과 말년",
  "살의(殺意)",
  "길신(吉神)",
  "연애와 결혼",
  "타고난 적성과 직업",
  "건강의 모든 것",
  "대운 분석",
  "세운 분석(올해)",
  "절운 분석",
  "총평",
];

export const ResultsToc = () => {
  // ✅ 필요한 모든 상태와 함수를 스토어에서 직접 가져옵니다.
  const { resultCurrentPage, setResultCurrentPage, resetFortuneResult } =
    useFortuneStore();

  return (
    <nav className="p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 text-accent-gold px-4">
        종합 사주 풀이
      </h3>
      <ul className="space-y-1 flex-grow overflow-y-auto">
        {TABLE_OF_CONTENTS.map((title, index) => {
          const pageNumber = index + 1;
          return (
            <li key={title}>
              <button
                onClick={() => setResultCurrentPage(pageNumber)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm",
                  resultCurrentPage === pageNumber
                    ? "bg-accent-gold/20 text-accent-gold font-semibold"
                    : "text-text-muted hover:bg-white/5"
                )}
              >
                {`${pageNumber}. ${title}`}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 px-4 flex-shrink-0">
        <Button
          onClick={resetFortuneResult} // ✅ '결과 닫기'는 상태 리셋으로 처리
          variant="outline"
          className="w-full"
        >
          결과 닫기
        </Button>
      </div>
    </nav>
  );
};
