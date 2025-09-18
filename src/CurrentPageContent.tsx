// src/CurrentPageContent.tsx (새 파일)

import { HeroSection } from "./components/ui/desktop/HeroSection";
import { ContentGrid } from "./components/ui/desktop/ContentGrid";
import CoupleGungapPage from "./pages/CoupleGungapPage";
import FortuneArchivePage from "./pages/FortuneArchivePage";
import InquiryPage from "./pages/InquiryPage";
import JonghapSajuPage from "./pages/JonghapSajuPage";
import { ProfilePage } from "./pages/ProfilePage";
import SinnyeonUnsePage from "./pages/SinnyeonUnsePage";
import TodayFortunePage from "./pages/TodayFortunePage";
import MansePage from "./pages/MansePage";

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

interface CurrentPageContentProps {
  currentPage: string;
}

export const CurrentPageContent = ({
  currentPage,
}: CurrentPageContentProps) => {
  console.log("CurrentPageContent: 현재 페이지", currentPage);

  if (currentPage === "jonghap") return <JonghapSajuPage />;
  if (currentPage === "profile") return <ProfilePage />;
  if (currentPage === "couple") return <CoupleGungapPage />;
  if (currentPage === "today") return <TodayFortunePage />;
  if (currentPage === "inquiry") return <InquiryPage />;
  if (currentPage === "storage") return <FortuneArchivePage />;
  if (currentPage === "sinnyeon") return <SinnyeonUnsePage />;
  if (currentPage === "manse") {
    console.log("CurrentPageContent: MansePage 렌더링");
    return <MansePage />;
  }
  return <HomePageContent />;
};
