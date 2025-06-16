// src/components/layout/MobileLayout.tsx

import React, { useState } from "react";
import { DrawerMenuMobile } from "../ui/mobile/DrawerMenuMobile";
import { HeaderBarMobile } from "../ui/mobile/HeaderBarMobile"; // Header 대신 HeaderBarMobile을 사용

interface MobileLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export const MobileLayout = ({ children, onNavigate }: MobileLayoutProps) => {
  // 1. 드로어 메뉴의 열림/닫힘 상태를 MobileLayout이 직접 관리한다.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="bg-background-main min-h-screen text-text-light">
      {/* 2. HeaderBarMobile은 로고 클릭과 메뉴 열기 기능만 담당한다. */}
      <HeaderBarMobile
        onMenuClick={() => setIsDrawerOpen(true)}
        onLogoClick={() => onNavigate("home")}
      />
      {/* 3. DrawerMenuMobile에 상태와 함께 onNavigate 함수를 전달한다. */}
      <DrawerMenuMobile
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={onNavigate}
      />
      {/* 4. 헤더의 높이만큼 콘텐츠 영역에 상단 패딩을 주어 겹치지 않게 한다. */}
      <main className="pt-14 p-4">{children}</main>
    </div>
  );
};
