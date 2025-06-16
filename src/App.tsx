import { useState } from "react";
import { DesktopLayout } from "./components/layout/DesktopLayout";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HeroSection } from "./components/ui/desktop/HeroSection";
import { ContentGrid } from "./components/ui/desktop/ContentGrid";
import { ProfilePage } from "./pages/ProfilePage";
import JonghapSajuPage from "./pages/JonghapSajuPage";
import CoupleGungapPage from "./pages/CoupleGungapPage";
import TodayFortunePage from "./pages/TodayFortunePage";
import InquiryPage from "./pages/InquiryPage";
import FortuneArchivePage from "./pages/FortuneArchivePage";
import SinnyeonUnsePage from "./pages/SinnyeonUnsePage";

const cardItems = [
  {
    imageUrl: "https://placehold.co/600x400/1B1F2A/ffffff?text=Astrology",
    title: "Astrology",
    description: "Astrology studies celestial bodies...",
    views: "122.8K",
    likes: "10.4K",
  },
  {
    imageUrl: "https://placehold.co/600x400/1B1F2A/ffffff?text=Tarot+Reading",
    title: "Tarot Reading",
    description: "Tarot uses cards for insights into...",
    views: "54K",
    likes: "21.1K",
  },
  {
    imageUrl: "https://placehold.co/600x400/1B1F2A/ffffff?text=Physiognomy",
    title: "Physiognomy",
    description: "Physiognomy assesses character...",
    views: "23.6K",
    likes: "42K",
  },
];

const HomePageContent = () => (
  <>
    <HeroSection
      title="DON'T LET THE FUTURE SURPRISE YOU!"
      buttonText="BOOK YOUR READING"
      imageUrl="https://placehold.co/1200x400/0B1F2A/ffffff?text=HERO+IMAGE"
    />
    <ContentGrid items={cardItems} />
  </>
);

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const CurrentPageContent = () => {
    if (currentPage === "profile") return <ProfilePage />;
    if (currentPage === "jonghap") return <JonghapSajuPage />;
    if (currentPage === "couple") return <CoupleGungapPage />;
    if (currentPage === "today") return <TodayFortunePage />;
    if (currentPage === "inquiry") return <InquiryPage />;
    if (currentPage === "storage") return <FortuneArchivePage />;
    if (currentPage === "sinnyeon") return <SinnyeonUnsePage />;
    return <HomePageContent />;
  };

  return (
    <>
      {/* 데스크톱 세계 */}
      <div className="hidden lg:block">
        <DesktopLayout
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onProfileClick={() => handleNavigate("profile")}
        >
          <CurrentPageContent />
        </DesktopLayout>
      </div>

      {/* 모바일 세계 */}
      <div className="lg:hidden">
        <MobileLayout onNavigate={handleNavigate}>
          <CurrentPageContent />
        </MobileLayout>
      </div>
    </>
  );
}

export default App;
