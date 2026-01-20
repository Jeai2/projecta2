// src/pages/MansePage.tsx

import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { ManseForm } from "@/components/forms/ManseForm";
import ManseServiceBox from "@/components/results/ManseServiceBox";
import ManseServiceBoxGeneral from "@/components/results/ManseServiceBoxGeneral";
import { useFortuneStore } from "@/store/fortuneStore";
import { useUiStore } from "@/store/uiStore";

const MansePage = () => {
  const { fortuneResult, resetFortuneResult } = useFortuneStore();
  const { isExpertMode } = useUiStore();

  const handleReset = () => {
    resetFortuneResult();
  };

  return (
    <FortunePageLayout
      title="화의 만세력"
      description="내가 보는 운명의 지도, 정통 만세력"
      contentWrapperClassName="p-0 bg-transparent"
    >
      {fortuneResult ? (
        isExpertMode ? (
          <ManseServiceBox
            sajuData={fortuneResult.saju.sajuData}
            userInfo={fortuneResult.userInfo}
            onReset={handleReset}
          />
        ) : (
          <ManseServiceBoxGeneral
            sajuData={fortuneResult.saju.sajuData}
            userInfo={fortuneResult.userInfo}
            onReset={handleReset}
          />
        )
      ) : (
        <ManseForm />
      )}
    </FortunePageLayout>
  );
};

export default MansePage;
