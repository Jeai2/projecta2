// src/pages/CoupleGungapPage.tsx

import { useState } from 'react';
import { FortunePageLayout } from '@/components/layout/FortunePageLayout';
import { CoupleGungapForm } from '@/components/forms/CoupleGungapForm'; // ✅ 새로운 폼을 import
import { CoupleResult } from '@/components/results/CoupleResult';

const CoupleGungapPage = () => {
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState<any>(null); // 타입은 나중에 더 구체화

  const handleFortuneSubmit = (data: any) => {
    console.log("페이지가 전달받은 데이터:", data);
    setFormData(data);
    setShowResult(true);
  };
  
  const handleReset = () => {
    setShowResult(false);
    setFormData(null);
  }

  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/db2777/ffffff?text=Couple"
      title="커플 궁합"
      description="나와 상대방의 사주를 통해 알아보는 환상의 케미"
    >
      {showResult ? (
        <CoupleResult myData={formData.me} partnerData={formData.partner} onReset={handleReset} />
      ) : (
        <CoupleGungapForm onSubmit={handleFortuneSubmit} />
      )}
    </FortunePageLayout>
  );
};

export default CoupleGungapPage;