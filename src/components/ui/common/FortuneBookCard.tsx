// src/components/ui/common/FortuneBookCard.tsx

import React from "react";
import { Button } from "./Button"; // 우리의 기존 버튼 컴포넌트를 재활용한다.

// 이 카드가 받을 정보의 타입을 정의한다 (TypeScript)
interface FortuneBookCardProps {
  imageUrl: string;
  title: string;
  author: string;
  savedDate: string;
  onViewClick: () => void; // '다시보기' 버튼 클릭 시 실행될 함수
}

/**
 * '운세 보관함'에서 개별 운세 항목을 보여주는 카드 컴포넌트.
 * 책과 같은 디자인을 가진다.
 */
export const FortuneBookCard: React.FC<FortuneBookCardProps> = ({
  imageUrl,
  title,
  author,
  savedDate,
  onViewClick,
}) => {
  return (
    <div className="flex items-center bg-background-sub p-4 rounded-lg border border-white/10 gap-6">
      {/* 1. 왼쪽: 책 표지 이미지 */}
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-24 h-36 object-cover rounded-md"
        />
      </div>

      {/* 2. 가운데: 텍스트 정보 */}
      <div className="flex-grow flex flex-col justify-between h-36 py-1">
        <div>
          <h3 className="text-lg font-bold text-text-light">{title}</h3>
          <p className="text-sm text-text-muted mt-2">저자: {author}</p>
          <p className="text-sm text-text-muted">보관일: {savedDate}</p>
        </div>
        <p className="text-xs text-accent-teal">보관 기간: 30일 남음</p>
      </div>

      {/* 3. 오른쪽: 다시보기 버튼 */}
      <div className="flex-shrink-0">
        <Button variant="outline" onClick={onViewClick}>
          다시보기
        </Button>
      </div>
    </div>
  );
};
