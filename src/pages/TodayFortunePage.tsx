// src/pages/TodaysFortunePage.tsx

import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";
import { FortuneResult } from "@/components/results/FortuneResult";
// ✅ 1. API 전체 응답 타입을 import 합니다.
import type { FortuneResponseData } from "@/types/fortune";

const TodayFortunePage = () => {
  // 화면 전환 및 데이터 저장을 위한 상태
  const [fortuneResult, setFortuneResult] =
    useState<FortuneResponseData | null>(null);

  // ✅ 3. UserInfoForm으로부터 성공적인 API 결과를 전달받을 함수입니다.
  const handleSuccess = (data: FortuneResponseData) => {
    console.log("오늘의 운세 페이지가 받은 데이터:", data);
    setFortuneResult(data);
  };

  // ✅ 4. 결과를 리셋하고 다시 입력 폼으로 돌아가는 함수입니다.
  const handleReset = () => {
    setFortuneResult(null);
  };

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/16a34a/ffffff?text=Today"
      title="AI 오늘의 운세"
      description={
        <>
          대륙의 제왕들도 매일 보았던
          <br />
          명리학에 기반한 오늘의 운세
        </>
      }
    >
      {/* ✅ 5. 조건부 렌더링: 
        fortuneResult에 데이터가 없으면(초기 상태) 입력 폼을,
        데이터가 있으면 결과 컴포넌트를 보여줍니다.
      */}
      {fortuneResult ? (
        <FortuneResult data={fortuneResult} onReset={handleReset} />
      ) : (
        <UserInfoForm
          title="사주 정보 입력"
          buttonText="오늘의 운세 보기"
          onSuccess={handleSuccess} // ✅ 6. prop 이름을 onSuccess로 변경하고, 정의한 함수를 전달합니다.
        />
      )}
    </FortunePageLayout>
  );
};

export default TodayFortunePage;
