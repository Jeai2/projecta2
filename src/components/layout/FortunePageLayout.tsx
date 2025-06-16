// src/components/layout/FortunePageLayout.tsx

import React from "react";

// 이 레이아웃이 필요로 하는 정보의 타입을 정의
interface FortunePageLayoutProps {
  imageUrl: string;
  title: string;
  description: React.ReactNode; // 설명 부분에는 줄바꿈(<br/>) 등이 들어갈 수 있도록 ReactNode 타입을 사용
  children: React.ReactNode; // 정보 입력 폼 등, 이 레이아웃이 감쌀 내용
}

/**
 * 모든 운세 페이지에서 공통으로 사용될 표준 레이아웃 컴포넌트.
 * 상단 이미지, 중단 설명, 말단 콘텐츠(children)의 구조를 가진다.
 */
export const FortunePageLayout: React.FC<FortunePageLayoutProps> = ({
  imageUrl,
  title,
  description,
  children,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* 1. 상단: 대표 이미지 */}
      <div className="w-full h-48 sm:h-64 mb-8 rounded-2xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. 중단: 설명 */}
      <div className="text-center mb-10">
        <h1 className="text-h1-xl sm:text-4xl font-bold text-text-light">
          {title}
        </h1>
        <p className="text-body-md text-text-muted mt-3">{description}</p>
      </div>

      {/* 3. 말단: 정보 입력 폼 등 메인 콘텐츠 */}
      <div className="bg-background-sub p-6 sm:p-8 rounded-2xl">{children}</div>
    </div>
  );
};
