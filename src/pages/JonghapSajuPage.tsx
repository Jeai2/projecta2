// src/pages/JonghapSajuPage.tsx

import { useState } from 'react';
import { FortunePageLayout } from "@/components/layout/FortunePageLayout"; // ✅ 1. 새로운 레이아웃 부품을 가져온다.
import { UserInfoForm } from '@/components/forms/UserInfoForm';
import type { UserData } from '@/components/forms/UserInfoForm';
import { FortuneResult } from "@/components/results/FortuneResult";

const JonghapSajuPage = () => {
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);

  const handleFortuneSubmit = (data: UserData) => {
    console.log("페이지가 전달받은 데이터:", data);
    setFormData(data);
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setFormData(null);
  };

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/7c3aed/ffffff?text=Total+Saju"
      title="종합 사주"
      description="타고난 사주팔자를 통해 알아보는 나의 모든 것"
    >
      {/* 값에 따라 폼 또는 결과를 보여줌 */}
      {showResult ? (
        <FortuneResult data={formData} onReset={handleReset} />
      ) : (
        <UserInfoForm
          title="사주 정보 입력"
          buttonText="종합사주 보기"
          onSubmit={handleFortuneSubmit}
        />
      )}
    </FortunePageLayout>
  );
};

export default JonghapSajuPage;
