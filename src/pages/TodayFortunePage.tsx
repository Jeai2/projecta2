// src/pages/TodaysFortunePage.tsx

import { useState } from 'react';
import { FortunePageLayout } from "@/components/layout/FortunePageLayout"; // ✅ 1. 새로운 레이아웃 부품을 가져온다.
import { UserInfoForm } from '@/components/forms/UserInfoForm';
import type { UserData } from '@/components/forms/UserInfoForm';
import { FortuneResult } from "@/components/results/FortuneResult";

const TodaysFortunePage = () => {
  // 화면 전환 및 데이터 저장을 위한 상태
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);

  // 폼 제출 시 실행될 함수
  const handleFortuneSubmit = (data: UserData) => {
    console.log("오늘의 운세 페이지가 받은 데이터:", data);
    setFormData(data);
    setShowResult(true);
  };

  // '다시하기' 함수
  const handleReset = () => {
    setShowResult(false);
    setFormData(null);
  }

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/16a34a/ffffff?text=Today"
      title="AI 오늘의 운세"
      description={
        <>
          대륙의 제왕들도 매일 보았던<br />
          명리학에 기반한 오늘의 운세
        </>
      }
    >
      {/* showResult 값에 따라 폼 또는 결과를 선택적으로 보여줌 */}
      {showResult ? (
        <FortuneResult data={formData} onReset={handleReset} />
      ) : (
        <UserInfoForm
          title="사주 정보 입력"
          buttonText="오늘의 운세 보기"
          onSubmit={handleFortuneSubmit}
        />
      )}
    </FortunePageLayout>
  );
};

export default TodaysFortunePage;
