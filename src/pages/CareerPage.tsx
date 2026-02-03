// src/pages/CareerPage.tsx
// 진로 직업 찾기 페이지

import { useState } from "react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { CareerForm } from "@/components/forms/CareerForm";
import { CareerResult } from "@/components/results/CareerResult";

interface OhaengChartData {
  data: {
    label: string;
    value: number;
    count: number;
    ohaeng: "木" | "火" | "土" | "金" | "水";
  }[];
  total: number;
  breakdown: {
    gan: {
      木: number;
      火: number;
      土: number;
      金: number;
      水: number;
      total: number;
    };
    ji: {
      木: number;
      火: number;
      土: number;
      金: number;
      水: number;
      total: number;
    };
  };
}

interface CareerResultData {
  name: string;
  gender?: "M" | "W";
  jobLegacyMale?: { label: string; careerTitle: string; careerDescription: string } | null;
  jobLegacyFemale?: { label: string; careerTitle: string; careerDescription: string } | null;
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
  ohaengChart?: OhaengChartData | null;
}

const CareerPage = () => {
  const [careerResult, setCareerResult] = useState<CareerResultData | null>(
    null,
  );

  const handleResult = (result: CareerResultData) => {
    setCareerResult(result);
  };

  const handleReset = () => {
    setCareerResult(null);
  };

  return (
    <FortunePageLayout
      title="내 진로 직업 찾기"
      description="21세기 맞춤 진로 방향성"
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
