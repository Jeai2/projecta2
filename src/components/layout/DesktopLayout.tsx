import { Sidebar as SidebarForLayout } from "../ui/desktop/Sidebar";
import { TopHeader } from "../ui/desktop/TopHeader";
import { ResultsToc } from "../results/layout/ResultsToc";

interface DesktopLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onProfileClick: () => void;
  isResultMode: boolean;
}

export const DesktopLayout = ({
  children,
  currentPage,
  onNavigate,
  onProfileClick,
  isResultMode,
}: DesktopLayoutProps) => {
  return (
    <div className="bg-background-main min-h-screen text-text-light">
      {isResultMode && currentPage === "jonghap" ? (
        <aside className="hidden lg:flex flex-col w-60 h-screen fixed top-0 left-0 bg-background-sub border-r border-white/5">
          <ResultsToc />
        </aside>
      ) : (
        <SidebarForLayout currentPage={currentPage} onNavigate={onNavigate} />
      )}
      <div className="lg:ml-60">
        <TopHeader onProfileClick={onProfileClick} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
