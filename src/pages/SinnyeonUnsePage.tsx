// src/pages/SinnyeonUnsePage.tsx

import { FortunePageLayout } from "@/components/layout/FortunePageLayout"; // ✅ 1. 새로운 레이아웃 부품을 가져온다.
import { UserInfoForm } from '@/components/forms/UserInfoForm';
import type { UserData } from '@/components/forms/UserInfoForm';

// ✅ 2. 페이지 컴포넌트를 정의한다.
const SinnyeonUnsePage = () => {
  const handleFortuneSubmit = (data: UserData) => {
    console.log("페이지가 전달받은 데이터:", data);
    alert("입력된 정보를 브라우저 개발자 도구 콘솔에서 확인하세요.");
  }; 
  
  return (
    // ✅ 3. FortunePageLayout을 '틀'로 사용한다.
    <FortunePageLayout
      imageUrl="https://placehold.co/1200x400/334155/ffffff?text=New+Year"
      title="2025년 신년운세"
      description={
        <>
          다가오는 한 해의 길흉화복을 미리 확인하고
          <br />
          새로운 기회를 준비하세요.
        </>
      }
    >
      {/* ✅ 3. '틀'의 children으로 정보 입력 폼을 넣어준다. */}
      <UserInfoForm 
        title="사주 정보 입력" 
        buttonText="신년운세 보기" 
        onSubmit={handleFortuneSubmit}
      />
    </FortunePageLayout>
  );
};

export default SinnyeonUnsePage;
