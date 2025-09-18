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
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed top-0 left-0 bg-background-sub p-6 border-r border-border-muted">
      <div
        className="text-3xl font-bold text-text-light mb-12 cursor-pointer"
        onClick={() => onNavigate("home")}
      >
        LOGO
      </div>
      <nav className="flex flex-col justify-between flex-grow">
        <ul className="flex flex-col gap-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === currentPage;

            return (
              <li key={item.id} className="relative">
                <a
                  href="#"
                  onClick={(e) => handleMenuClick(e, item.id)}
                  className={`relative flex items-center gap-3 p-3 rounded-lg text-lg transition-colors overflow-hidden ${
                    isActive
                      ? "text-accent-gold font-semibold bg-accent-gold/10"
                      : "text-text-muted hover:bg-background-main hover:text-text-light"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-menu-line"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                    />
                  )}
                  <span className="w-6">
                    {isActive ? (
                      <Icon size={22} className="text-accent-gold" />
                    ) : (
                      <Icon size={22} />
                    )}
                  </span>
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* 프리미엄 메뉴 섹션 */}
        <div className="my-6">
          <h3 className="text-sm font-medium text-text-muted mb-3 px-3">
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
                    className={`relative flex items-center gap-3 p-3 rounded-lg text-base transition-colors overflow-hidden ${
                      isActive
                        ? "text-accent-gold font-semibold bg-accent-gold/10"
                        : "text-text-muted hover:bg-background-main hover:text-text-light"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-premium-line"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                      />
                    )}
                    <span className="w-6">
                      {isActive ? (
                        <Icon size={20} className="text-accent-gold" />
                      ) : (
                        <Icon size={20} />
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
        <div className="my-6">
          <h3 className="text-sm font-medium text-text-muted mb-3 px-3">
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
                    className={`relative flex items-center gap-3 p-3 rounded-lg text-base transition-colors overflow-hidden ${
                      isActive
                        ? "text-accent-gold font-semibold bg-accent-gold/10"
                        : "text-text-muted hover:bg-background-main hover:text-text-light"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-offline-line"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full"
                      />
                    )}
                    <span className="w-6">
                      {isActive ? (
                        <Icon size={20} className="text-accent-gold" />
                      ) : (
                        <Icon size={20} />
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
        <div className="my-6">
          <h3 className="text-sm font-medium text-text-muted mb-3 px-3">
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
                    className="flex items-center gap-3 p-3 rounded-lg text-base text-text-muted hover:bg-background-main hover:text-text-light transition-colors"
                  >
                    <Icon size={20} />
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
