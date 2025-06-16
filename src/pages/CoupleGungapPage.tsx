// src/pages/CoupleGungapPage.tsx

import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";

const CoupleGungapPage = () => {
  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/db2777/ffffff?text=Couple"
      title="커플 궁합"
      description="나와 상대방의 사주를 통해 알아보는 환상의 케미"
    >
      {/* 커플 궁합은 2명의 정보가 필요하므로, UserInfoForm을 두 번 사용한다. */}
      <div className="space-y-8">
        <UserInfoForm
          title="나의 정보 입력"
          buttonText="" // 버튼은 맨 마지막에 하나만 필요하므로 텍스트를 비운다.
        />
        <UserInfoForm title="상대방 정보 입력" buttonText="커플궁합 보기" />
      </div>
    </FortunePageLayout>
  );
};

export default CoupleGungapPage;
