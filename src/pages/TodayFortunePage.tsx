// src/pages/TodayFortunePage.tsx

import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { TodayFortuneForm } from "@/components/forms/TodayFortuneForm";
import { TodayFortuneResult } from "@/components/results/TodayFortuneResult";
// ✅ 1. 오늘의 운세 전용 API 응답 타입을 import 합니다.
import type { TodayFortuneResponse } from "@/types/today-fortune";

const TodayFortunePage = () => {
  // 화면 전환 및 데이터 저장을 위한 상태
  const [fortuneResult, setFortuneResult] =
    useState<TodayFortuneResponse | null>(null);

  // ✅ 3. TodayFortuneForm으로부터 성공적인 API 결과를 전달받을 함수입니다.
  const handleSuccess = (data: TodayFortuneResponse) => {
    console.log("오늘의 운세 페이지가 받은 데이터:", data);
    setFortuneResult(data);
  };

  // ✅ 4. 결과를 리셋하고 다시 입력 폼으로 돌아가는 함수입니다.
  const handleReset = () => {
    setFortuneResult(null);
  };

  // 오늘 날짜 포맷팅 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const weekday = weekdays[today.getDay()];

    return `${year}.${month}.${day} ${weekday}`;
  };

  return (
    <FortunePageLayout
      title="오늘의 운세"
      description={
        <>
          <span className="text-accent-gold font-semibold">
            {getTodayDate()}
          </span>
        </>
      }
      contentWrapperClassName="p-0 bg-transparent"
    >
      {/* ✅ 5. 조건부 렌더링: 
        fortuneResult에 데이터가 없으면(초기 상태) 입력 폼을,
        데이터가 있으면 결과 컴포넌트를 보여줍니다.
      */}
      {fortuneResult ? (
        <TodayFortuneResult data={fortuneResult} onReset={handleReset} />
      ) : (
        <TodayFortuneForm onSuccess={handleSuccess} />
      )}
    </FortunePageLayout>
  );
};

export default TodayFortunePage;
