// 트랜스포머 Header: 모바일 + 데스크톱 통합, onLogoClick 기능 추가
import { useState } from "react";
import { MenuIcon } from "../ui/common/Icons";
import { DrawerMenuMobile } from "../ui/mobile/DrawerMenuMobile";
import { mainMenuItems, premiumMenuItems } from "@/config/menuConfig";
import { Search } from "lucide-react";

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header = ({
  onLogoClick,
  onNavigate,
  currentPage,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const desktopMenuItems = [...mainMenuItems, ...premiumMenuItems];
  const handleLogoClick = onLogoClick ?? (() => onNavigate("home"));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between h-full w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-accent-gold text-white rounded flex items-center justify-center font-myeongjo font-bold text-lg">
                S:L
              </div>
              <span className="font-myeongjo font-bold text-lg text-gray-800 group-hover:text-accent-gold transition">
                사주로그
              </span>
            </button>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            {desktopMenuItems.map((item) => {
              const isActive = item.id === currentPage;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? "text-gray-900 border-accent-gold"
                      : "text-gray-500 border-transparent hover:text-accent-gold hover:border-accent-gold"
                  }`}
                >
                  <span className="py-5 inline-block">{item.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
              <Search className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
              <img
                className="w-full h-full object-cover"
                src="https://placehold.co/100x100/EAE7E1/333333?text=U"
                alt="user"
              />
            </div>
          </div>
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700"
              aria-label="메뉴 열기"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      <DrawerMenuMobile
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        onNavigate={onNavigate}
      />
      <div className="h-20" />
    </>
  );
};
