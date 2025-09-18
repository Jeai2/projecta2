// src/App.tsx (더욱 단순해진 최종본)

import { useState } from "react";
import { DesktopLayout } from "./components/layout/DesktopLayout";
import { MobileLayout } from "./components/layout/MobileLayout";
import { useFortuneStore } from "./store/fortuneStore";
import { CurrentPageContent } from "./CurrentPageContent";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const { isResultMode, resetFortuneResult } = useFortuneStore();

  const handleNavigate = (page: string) => {
    console.log("App: 페이지 네비게이션", page);
    setCurrentPage(page);
    if (page !== "jonghap") {
      resetFortuneResult();
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <DesktopLayout
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onProfileClick={() => handleNavigate("profile")}
          isResultMode={isResultMode}
        >
          {/* ✅ 에러 해결: CurrentPageContent를 children으로 전달합니다. */}
          <CurrentPageContent currentPage={currentPage} />
        </DesktopLayout>
      </div>

      <div className="lg:hidden">
        <MobileLayout onNavigate={handleNavigate} isResultMode={isResultMode}>
          {/* ✅ 에러 해결: CurrentPageContent를 children으로 전달합니다. */}
          <CurrentPageContent currentPage={currentPage} />
        </MobileLayout>
      </div>
    </>
  );
}

export default App;
