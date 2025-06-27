// src/pages/JonghapSajuPage.tsx (최종 완성본)

import { useFortuneStore } from "@/store/fortuneStore";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";
import { NavigationHelper } from "@/components/results/layout/NavigationHelper";
import { ForewordSection } from "@/components/results/sections/ForewordSection";
import { HwaEuiSection } from "@/components/results/sections/HwaEuiSection";
import { MySajuIntro } from "@/components/results/sections/MySajuIntro";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/common/Card";

const JonghapSajuPage = () => {
  const { fortuneResult, resultCurrentPage } = useFortuneStore();

  const renderCurrentPageContent = () => {
    if (!fortuneResult) return null;

    switch (resultCurrentPage) {
      case 1:
        return <ForewordSection />;
      case 2:
        return <HwaEuiSection />;
      case 3:
        return <MySajuIntro />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{resultCurrentPage}. 페이지</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-8 text-center text-text-muted min-h-[300px] flex items-center justify-center">
                콘텐츠 준비 중입니다.
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  if (!fortuneResult) {
    return (
      <FortunePageLayout
        imageUrl="https://placehold.co/1200x400/7c3aed/ffffff?text=Total+Saju"
        title="종합 사주"
        description="타고난 사주팔자를 통해 알아보는 나의 모든 것"
      >
        <UserInfoForm title="사주 정보 입력" buttonText="종합사주 보기" />
      </FortunePageLayout>
    );
  }

  return (
    <div className="w-full">
      <div className="min-h-[60vh] animate-in fade-in-50 duration-500">
        {renderCurrentPageContent()}
      </div>
      <NavigationHelper />
    </div>
  );
};

export default JonghapSajuPage;
