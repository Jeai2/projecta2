import { Sidebar as SidebarForLayout } from "../ui/desktop/Sidebar";
import { TopHeader } from "../ui/desktop/TopHeader";
import { ResultsToc } from "../results/layout/ResultsToc";

interface DesktopLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onProfileClick: () => void;
  isResultMode: boolean;
  showHeader?: boolean;
}

export const DesktopLayout = ({
  children,
  currentPage,
  onNavigate,
  onProfileClick,
  isResultMode,
  showHeader = true,
}: DesktopLayoutProps) => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200">
      {isResultMode && currentPage === "jonghap" ? (
        <aside className="hidden lg:flex flex-col w-60 h-screen fixed top-0 left-0 bg-background-sub border-r border-white/5">
          <ResultsToc />
        </aside>
      ) : (
        <SidebarForLayout currentPage={currentPage} onNavigate={onNavigate} />
      )}
      <div className="lg:ml-60">
        {showHeader && <TopHeader onProfileClick={onProfileClick} />}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
