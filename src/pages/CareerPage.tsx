// src/pages/CareerPage.tsx
// 진로 직업 찾기 페이지

import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { CareerForm } from "@/components/forms/CareerForm";
import { CareerResult } from "@/components/results/CareerResult";

interface CareerResultData {
  name: string;
  energyType: string;
  energyDescription: string;
  keywords: string[];
  energyOhaeng?: "木" | "火" | "土" | "金" | "水";
  jobCategories: {
    title: string;
    professions: string;
    icon: string;
  }[];
  successTip: string;
  jobSatisfaction: number;
  suitabilityData: {
    category: string;
    characteristics: string;
    suitability: number;
  }[];
}

const CareerPage = () => {
  const [careerResult, setCareerResult] = useState<CareerResultData | null>(null);

  const handleResult = (result: CareerResultData) => {
    setCareerResult(result);
  };

  const handleReset = () => {
    setCareerResult(null);
  };

  return (
    <FortunePageLayout
      title="내 진로 직업 찾기"
      description="나에게 맞는 진로와 직업 방향"
      contentWrapperClassName="p-0 bg-transparent"
    >
      {careerResult ? (
        <CareerResult result={careerResult} onReset={handleReset} />
      ) : (
        <CareerForm onResult={handleResult} />
      )}
    </FortunePageLayout>
  );
};

export default CareerPage;
