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
      title="만세력 서비스"
      description="사주팔자 원국을 직접 확인해 보세요."
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
