// src/pages/MansePage.tsx

import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { ManseForm } from "@/components/forms/ManseForm";
import ManseServiceBox from "@/components/results/ManseServiceBox";
import { useFortuneStore } from "@/store/fortuneStore";

const MansePage = () => {
  const { fortuneResult, resetFortuneResult } = useFortuneStore();

  const handleReset = () => {
    resetFortuneResult();
  };

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/A98A62/333333?text=Manseoryeok"
      title="和義 만세력 1.0"
      description=""
    >
      {fortuneResult ? (
        <ManseServiceBox
          sajuData={fortuneResult.saju.sajuData}
          userInfo={fortuneResult.userInfo}
          onReset={handleReset}
        />
      ) : (
        <ManseForm />
      )}
    </FortunePageLayout>
  );
};

export default MansePage;
