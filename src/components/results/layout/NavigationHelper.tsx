// src/components/results/layout/NavigationHelper.tsx

import { Button } from "@/components/ui/common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/common/Select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFortuneStore } from "@/store/fortuneStore";

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

export const NavigationHelper = () => {
  const { resultCurrentPage, setResultCurrentPage } = useFortuneStore();
  const totalPages = TABLE_OF_CONTENTS.length;
  const progressPercent = (resultCurrentPage / totalPages) * 100;

  const handlePrev = () =>
    setResultCurrentPage(Math.max(1, resultCurrentPage - 1));
  const handleNext = () =>
    setResultCurrentPage(Math.min(totalPages, resultCurrentPage + 1));
  const handleSelectChange = (value: string) =>
    setResultCurrentPage(Number(value));

  return (
    <div className="w-full mt-12 p-4 rounded-lg border border-border-muted bg-background-sub sticky bottom-8 shadow-lg z-10">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            onClick={handlePrev}
            disabled={resultCurrentPage === 1}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={resultCurrentPage === totalPages}
            variant="outline"
            size="icon"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1">
          <Select
            value={String(resultCurrentPage)}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="목차" />
            </SelectTrigger>
            <SelectContent>
              {TABLE_OF_CONTENTS.map((title, index) => (
                <SelectItem key={title} value={String(index + 1)}>{`${
                  index + 1
                }. ${title}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-accent-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-text-muted mt-1">
          {resultCurrentPage} / {totalPages} ({Math.round(progressPercent)}%)
        </div>
      </div>
    </div>
  );
};
