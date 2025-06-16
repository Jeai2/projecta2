import { Sidebar as SidebarForLayout } from "../ui/desktop/Sidebar";
import { TopHeader } from "../ui/desktop/TopHeader";

interface DesktopLayoutProps {
  children: React.ReactNode;
  currentPage: string; // 현재 페이지 상태를 받는다.
  onNavigate: (page: string) => void; // 페이지 이동 함수를 받는다.
  onProfileClick: () => void; // 프로필 클릭 핸들러도 유지한다.
}

export const DesktopLayout = ({
  children,
  currentPage,
  onNavigate,
  onProfileClick,
}: DesktopLayoutProps) => {
  return (
    <div className="bg-background-main min-h-screen text-text-light">
      <SidebarForLayout currentPage={currentPage} onNavigate={onNavigate} />
      <div className="lg:ml-60">
        <TopHeader onProfileClick={onProfileClick} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
