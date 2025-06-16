// src/pages/JonghapSajuPage.tsx

import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { UserInfoForm } from "@/components/forms/UserInfoForm";

const JonghapSajuPage = () => {
  return (
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/7c3aed/ffffff?text=Total+Saju"
      title="종합 사주"
      description="타고난 사주팔자를 통해 알아보는 나의 모든 것"
    >
      <UserInfoForm title="사주 정보 입력" buttonText="종합사주 보기" />
    </FortunePageLayout>
  );
};

export default JonghapSajuPage;
