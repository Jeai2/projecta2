// src/pages/InputPage.tsx

import { useState } from "react";
import { UserInfoForm } from "@/components/forms/UserInfoForm";
import { FortuneResult } from "@/components/results/FortuneResult";
// ✅ 1. API 전체 응답 타입을 import 합니다.
import type { FortuneResponseData } from "@/types/fortune";

const InputPage = () => {
  // ✅ 2. API 최종 결과를 담을 단 하나의 state를 생성합니다.
  const [fortuneResult, setFortuneResult] =
    useState<FortuneResponseData | null>(null);

  // ✅ 3. UserInfoForm으로부터 성공적인 API 결과를 전달받을 함수입니다.
  const handleSuccess = (data: FortuneResponseData) => {
    console.log("입력 페이지가 받은 데이터:", data);
    setFortuneResult(data);
  };

  // ✅ 4. 결과를 리셋하고 다시 입력 폼으로 돌아가는 함수입니다.
  const handleReset = () => {
    setFortuneResult(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* ✅ 5. fortuneResult 데이터 유무에 따라 폼 또는 결과를 보여줍니다. */}
      {fortuneResult ? (
        <FortuneResult data={fortuneResult} onReset={handleReset} />
      ) : (
        <UserInfoForm
          title="사주 정보 입력"
          buttonText="운세 보기"
          onSuccess={handleSuccess} // ✅ 6. onSuccess prop으로 함수를 전달합니다.
        />
      )}
    </div>
  );
};

export default InputPage;
