// src/pages/IljuPage.tsx
// 일주론 페이지

import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { IljuForm } from "@/components/forms/IljuForm";
import { IljuResult } from "@/components/results/IljuResult";

interface IljuResultData {
  iljuData: {
    name: string;
    personality: string;
    tendency: string;
    career: string;
    spouse: string;
    wealth: string;
    health: string;
  };
  dayGan: string;
  dayJi: string;
  dayGanji: string;
}

const IljuPage = () => {
  const [iljuResult, setIljuResult] = useState<IljuResultData | null>(null);

  const handleResult = (result: IljuResultData) => {
    setIljuResult(result);
  };

  const handleReset = () => {
    setIljuResult(null);
  };

  return (
    <FortunePageLayout
      title="일주론"
      description="일주로 보는 나의 성격과 운명"
      contentWrapperClassName="p-0 bg-transparent"
    >
      {iljuResult ? (
        <IljuResult iljuData={iljuResult} onReset={handleReset} />
      ) : (
        <IljuForm onResult={handleResult} />
      )}
    </FortunePageLayout>
  );
};

export default IljuPage;
