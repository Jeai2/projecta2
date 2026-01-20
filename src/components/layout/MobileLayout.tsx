// src/components/layout/MobileLayout.tsx (최종 완성본)

import React, { useState } from "react";
import { DrawerMenuMobile } from "../ui/mobile/DrawerMenuMobile";
import { HeaderBarMobile } from "../ui/mobile/HeaderBarMobile";
import { ResultsToc } from "../results/layout/ResultsToc"; // ✅ 1. '결과 목차' 컴포넌트 import
import { useFortuneStore } from "@/store/fortuneStore"; // ✅ 2. 스토어 import
import { MenuIcon } from "../ui/common/Icons";

// ✅ 3. App.tsx로부터 받을 props 타입을 최종 확정합니다.
interface MobileLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  isResultMode: boolean;
  isExpertMode?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  onNavigate,
  isResultMode,
  isExpertMode = false,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { resetFortuneResult } = useFortuneStore();

  const handleExit = () => {
    resetFortuneResult();
    onNavigate("home");
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200">
      {!isExpertMode && (
        <HeaderBarMobile
          onMenuClick={() => setIsDrawerOpen(true)}
          onLogoClick={isResultMode ? handleExit : () => onNavigate("home")}
        />
      )}

      {isExpertMode && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-background-sub text-text-light shadow-lg"
          aria-label="사이드바 열기"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      )}

      {isResultMode ? (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
            isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <nav
            className={`absolute top-0 right-0 h-full w-[280px] bg-background-sub shadow-lg transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ 이제 ResultsToc은 props 없이 스스로 동작합니다. */}
            <ResultsToc />
          </nav>
        </div>
      ) : (
        <DrawerMenuMobile
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={onNavigate}
        />
      )}

      <main className={isExpertMode ? "p-4" : "pt-14 p-4"}>{children}</main>
    </div>
  );
};
