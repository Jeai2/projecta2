// src/CurrentPageContent.tsx (새 파일)

import { GeneralHome } from "./components/home/GeneralHome";
import { ExpertDashboard } from "./components/home/ExpertDashboard";
import CoupleGungapPage from "./pages/CoupleGungapPage";
import FortuneArchivePage from "./pages/FortuneArchivePage";
import InquiryPage from "./pages/InquiryPage";
import JonghapSajuPage from "./pages/JonghapSajuPageV2";
import { ProfilePage } from "./pages/ProfilePage";
import SinnyeonUnsePage from "./pages/SinnyeonUnsePage";
import TodayFortunePage from "./pages/TodayFortunePage";
import MansePage from "./pages/MansePage";
import IljuPage from "./pages/IljuPage";
import CareerPage from "./pages/CareerPage";
import AIConsultPage from "./pages/AIConsultPage";
import FortuneServicePage from "./pages/FortuneServicePage";
import LoginPage from "./pages/LoginPage";
import FortuneCookiePage from "./pages/FortuneCookiePage";
import YutJeomPage from "./pages/YutJeomPage";
import { useUiStore } from "./store/uiStore";

const HomePageContent = ({
  isExpertMode,
  onNavigate,
}: {
  isExpertMode: boolean;
  onNavigate: (page: string) => void;
}) => (isExpertMode ? <ExpertDashboard /> : <GeneralHome onNavigate={onNavigate} />);

interface CurrentPageContentProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const CurrentPageContent = ({
  currentPage,
  onNavigate,
}: CurrentPageContentProps) => {
  console.log("CurrentPageContent: 현재 페이지", currentPage);
  const { isExpertMode } = useUiStore();

  if (currentPage === "jonghap") return <JonghapSajuPage />;
  if (currentPage === "profile")
    return <ProfilePage onNavigate={onNavigate} />;
  if (currentPage === "couple") return <CoupleGungapPage />;
  if (currentPage === "today") return <TodayFortunePage />;
  if (currentPage === "inquiry") return <InquiryPage />;
  if (currentPage === "storage") return <FortuneArchivePage />;
  if (currentPage === "sinnyeon") return <SinnyeonUnsePage />;
  if (currentPage === "manse") {
    console.log("CurrentPageContent: MansePage 렌더링");
    return <MansePage />;
  }
  if (currentPage === "ilju") {
    return <IljuPage />;
  }
  if (currentPage === "career") {
    return <CareerPage />;
  }
  if (currentPage.startsWith("ai-consult")) {
    const initialCharacter = currentPage.includes(":")
      ? (currentPage.split(":")[1] as import("./config/characterProfiles").CharacterId)
      : undefined;
    return <AIConsultPage initialCharacter={initialCharacter} />;
  }
  if (currentPage === "service" || currentPage === "fortune") {
    return <FortuneServicePage onNavigate={onNavigate} />;
  }
  if (currentPage === "cookie") {
    return <FortuneCookiePage />;
  }
  if (currentPage === "yut") {
    return <YutJeomPage />;
  }
  if (currentPage === "login") {
    return <LoginPage onNavigate={onNavigate} />;
  }
  return <HomePageContent isExpertMode={isExpertMode} onNavigate={onNavigate} />;
};
