// src/pages/TodaysFortunePage.tsx
import { UserInfoForm } from "@/components/forms/UserInfoForm";

/**
 * '오늘의 운세' 페이지.
 * 사용자의 사주 정보를 입력받아 오늘의 운세를 제공한다.
 * 사용자가 제공한 참고 자료(스토리보드)를 기반으로 재구성되었다.
 */
const TodaysFortunePage = () => {
  return (
    // 페이지 전체를 감싸는 컨테이너
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* 1. 페이지 헤더 영역 */}
      <div className="relative text-center sm:text-left bg-background-sub p-8 rounded-2xl overflow-hidden mb-8">
        <div className="relative z-10">
          <h1 className="text-h1-xl text-text-light">AI 오늘의 운세</h1>
          <p className="text-body-md text-text-muted mt-2">
            대륙의 제왕들도 매일 보았던
            <br />
            명리학에 기반한 오늘의 운세
          </p>
        </div>
        {/* 장식용 원형 그래픽 */}
        <div className="absolute -top-10 -right-16 w-48 h-48 bg-gray-800/50 rounded-full" />
        <div className="absolute -top-4 -right-12 w-40 h-40 bg-background-main rounded-full" />
      </div>

      {/* 2. 사주 정보 입력 폼 영역 */}
      <div className="bg-background-sub p-6 sm:p-8 rounded-2xl">
        {/* 우리가 이전에 만든 UserInfoForm을 그대로 사용한다. */}
        {/* title과 buttonText만 교체하여 재활용성을 증명한다. */}
        <UserInfoForm title="사주 정보 입력" buttonText="무료로 운세 보기" />
      </div>
    </div>
  );
};

export default TodaysFortunePage;
