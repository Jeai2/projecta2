import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";
import { FortuneResult } from "@/components/results/FortuneResult";
// ✅ 1. API 전체 응답 타입을 import 합니다.
import type { FortuneResponseData } from "@/types/fortune";

const SinnyeonUnsePage = () => {
  // ✅ 2. API 최종 결과를 담을 단 하나의 state를 생성합니다.
  const [fortuneResult, setFortuneResult] =
    useState<FortuneResponseData | null>(null);

  // ✅ 3. UserInfoForm으로부터 성공적인 API 결과를 전달받을 함수입니다.
  const handleSuccess = (data: FortuneResponseData) => {
    console.log("신년 운세 페이지가 받은 데이터:", data);
    setFortuneResult(data);
  };

  // ✅ 4. 결과를 리셋하고 다시 입력 폼으로 돌아가는 함수입니다.
  const handleReset = () => {
    setFortuneResult(null);
  };

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/334155/ffffff?text=New+Year"
      title="2025년 신년운세"
      description={
        <>
          다가오는 한 해의 길흉화복을 미리 확인하고
          <br />
          새로운 기회를 준비하세요.
        </>
      }
    >
      {/* ✅ 5. fortuneResult 데이터 유무에 따라 폼 또는 결과를 보여줍니다. */}
      {fortuneResult ? (
        <FortuneResult data={fortuneResult} onReset={handleReset} />
      ) : (
        <UserInfoForm
          title="사주 정보 입력"
          buttonText="신년운세 보기"
          onSuccess={handleSuccess} // ✅ 6. onSuccess prop으로 함수를 전달합니다.
        />
      )}
    </FortunePageLayout>
  );
};

export default SinnyeonUnsePage;
