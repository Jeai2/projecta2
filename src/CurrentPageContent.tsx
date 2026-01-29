// src/CurrentPageContent.tsx (새 파일)

import { GeneralHome } from "./components/home/GeneralHome";
import { ExpertDashboard } from "./components/home/ExpertDashboard";
import CoupleGungapPage from "./pages/CoupleGungapPage";
import FortuneArchivePage from "./pages/FortuneArchivePage";
import InquiryPage from "./pages/InquiryPage";
import JonghapSajuPage from "./pages/JonghapSajuPage";
import { ProfilePage } from "./pages/ProfilePage";
import SinnyeonUnsePage from "./pages/SinnyeonUnsePage";
import TodayFortunePage from "./pages/TodayFortunePage";
import MansePage from "./pages/MansePage";
import IljuPage from "./pages/IljuPage";
import CareerPage from "./pages/CareerPage";
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
  if (currentPage === "ilju") {
    return <IljuPage />;
  }
  if (currentPage === "career") {
    return <CareerPage />;
  }
  return <HomePageContent isExpertMode={isExpertMode} onNavigate={onNavigate} />;
};
