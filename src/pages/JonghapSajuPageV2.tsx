// src/pages/JonghapSajuPageV2.tsx
// 종합 사주 페이지 V2 — 앱 통일 디자인

import { useFortuneStore } from "@/store/fortuneStore";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";
import { ChapterNav, CHAPTER_TITLES } from "@/components/results/v2/ChapterNav";
import { ForewordV2 } from "@/components/results/v2/sections/ForewordV2";
import { HwaEuiV2 } from "@/components/results/v2/sections/HwaEuiV2";
import { MySajuIntroV2 } from "@/components/results/v2/sections/MySajuIntroV2";
import { DayMasterV2 } from "@/components/results/v2/sections/DayMasterV2";
import { SipsinV2 } from "@/components/results/v2/sections/SipsinV2";
import { SibiwunseongV2 } from "@/components/results/v2/sections/SibiwunseongV2";
import { SinsalV2 } from "@/components/results/v2/sections/SinsalV2";
import { GilsinV2 } from "@/components/results/v2/sections/GilsinV2";
import { DaewoonV2 } from "@/components/results/v2/sections/DaewoonV2";
import { Clock } from "lucide-react";

const ComingSoon = ({ chapterNum }: { chapterNum: number }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100">
      <span className="block text-[11px] font-semibold text-accent-gold tracking-widest uppercase mb-1">
        Chapter {String(chapterNum).padStart(2, "0")}
      </span>
      <h2 className="font-myeongjo text-2xl font-bold text-text-light">
        {CHAPTER_TITLES[chapterNum - 1]}
      </h2>
    </div>
    <div className="px-6 sm:px-8 py-16 flex flex-col items-center justify-center text-center gap-2">
      <Clock className="w-7 h-7 text-gray-300" />
      <p className="text-sm font-medium text-text-muted">준비 중</p>
      <p className="text-xs text-text-subtle">곧 업데이트될 예정입니다.</p>
    </div>
  </div>
);

const JonghapSajuPageV2 = () => {
  const { fortuneResult, resultCurrentPage } = useFortuneStore();

  const renderSection = () => {
    if (!fortuneResult) return null;

    switch (resultCurrentPage) {
      case 1:  return <ForewordV2 />;
      case 2:  return <HwaEuiV2 />;
      case 3:  return <MySajuIntroV2 />;
      case 4:  return <DayMasterV2 />;
      case 5:  return <SipsinV2 />;
      case 6:  return <SibiwunseongV2 />;
      case 7:  return <SinsalV2 />;
      case 8:  return <GilsinV2 />;
      case 9:  return <DaewoonV2 />;
      default: return <ComingSoon chapterNum={resultCurrentPage} />;
    }
  };

  // 입력 폼 (결과 없을 때)
  if (!fortuneResult) {
    return (
      <FortunePageLayout
        title="종합 사주"
        description="타고난 사주팔자를 통해 알아보는 나의 모든 것"
        contentWrapperClassName="p-0 bg-transparent"
      >
        <UserInfoForm buttonText="종합사주 보기" />
      </FortunePageLayout>
    );
  }

  const total = CHAPTER_TITLES.length;
  const progressPercent = (resultCurrentPage / total) * 100;
  const currentTitle = CHAPTER_TITLES[resultCurrentPage - 1] ?? "";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">

      {/* 상단 진행 표시 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-subtle">
            {String(resultCurrentPage).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium text-text-muted">
            {currentTitle}
          </span>
        </div>
        {/* 진행 바 */}
        <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-gold rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 섹션 콘텐츠 */}
      <div className="animate-in fade-in-50 duration-400" key={resultCurrentPage}>
        {renderSection()}
      </div>

      {/* 챕터 네비게이션 */}
      <ChapterNav />
    </div>
  );
};

export default JonghapSajuPageV2;
