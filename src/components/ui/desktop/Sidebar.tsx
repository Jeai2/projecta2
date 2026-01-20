// 이 컴포넌트는 데스크톱 레이아웃의 좌측에 고정되는 네비게이션 바다.
// 오직 데스크톱 화면에서만 보이도록 설계되었다.

// src/components/ui/desktop/Sidebar.tsx

import {
  mainMenuItems,
  secondaryMenuItems,
  premiumMenuItems,
  offlineMenuItems,
} from "@/config/menuConfig";
import { motion } from "framer-motion";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  const handleMenuClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    console.log("Sidebar: 메뉴 클릭됨", pageId);
    onNavigate(pageId);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/60">
        <div className="w-8 h-8 border border-accent-gold text-accent-gold rounded flex items-center justify-center font-myeongjo font-bold text-lg mr-3">
          PRO
        </div>
        <div>
          <span className="font-myeongjo font-bold text-slate-100 block leading-none">
            Hwa-Ui
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            Expert Console
          </span>
        </div>
      </div>
      <nav className="flex flex-col justify-between flex-grow">
        <ul className="flex flex-col gap-2 px-3 py-6">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === currentPage;

            return (
              <li key={item.id} className="relative">
                <a
                  href="#"
                  onClick={(e) => handleMenuClick(e, item.id)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors overflow-hidden ${
                    isActive
                      ? "text-white bg-white/5"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-menu-line"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                    />
                  )}
                  <span className="w-5">
                    {isActive ? (
                      <Icon size={18} className="text-accent-gold" />
                    ) : (
                      <Icon size={18} />
                    )}
                  </span>
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* 프리미엄 메뉴 섹션 */}
        <div className="mb-6 px-3">
          <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-3 px-3 tracking-wider">
            프리미엄 서비스
          </h3>
          <ul className="flex flex-col gap-2">
            {premiumMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentPage;

              return (
                <li key={item.id} className="relative">
                  <a
                    href="#"
                    onClick={(e) => handleMenuClick(e, item.id)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors overflow-hidden ${
                      isActive
                      ? "text-white bg-white/5"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-premium-line"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                      />
                    )}
                  <span className="w-5">
                      {isActive ? (
                      <Icon size={18} className="text-accent-gold" />
                      ) : (
                      <Icon size={18} />
                      )}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 오프라인 서비스 섹션 */}
        <div className="mb-6 px-3">
          <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-3 px-3 tracking-wider">
            오프라인 서비스
          </h3>
          <ul className="flex flex-col gap-2">
            {offlineMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentPage;

              return (
                <li key={item.id} className="relative">
                  <a
                    href="#"
                    onClick={(e) => handleMenuClick(e, item.id)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors overflow-hidden ${
                      isActive
                      ? "text-white bg-white/5"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-offline-line"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                      />
                    )}
                  <span className="w-5">
                      {isActive ? (
                      <Icon size={18} className="text-accent-gold" />
                      ) : (
                      <Icon size={18} />
                      )}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 보조 메뉴 섹션 */}
        <div className="mb-6 px-3">
          <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-3 px-3 tracking-wider">
            기타
          </h3>
          <ul className="flex flex-col gap-2">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    href="#"
                    onClick={(e) => handleMenuClick(e, item.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
