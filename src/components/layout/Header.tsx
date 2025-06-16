// 트랜스포머 Header: 모바일 + 데스크톱 통합, onLogoClick 기능 추가
import { useState } from "react";
import { MenuIcon, XIcon } from "../ui/common/Icons";

const menuItems = [
  "종합사주",
  "신년운세",
  "이성운세",
  "재물운세",
  "커플궁합",
  "오늘의 운세",
];

const DrawerMenuMobile = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <div
    className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    aria-hidden={!isOpen}
    role="dialog"
  >
    <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
    <nav
      className={`absolute top-0 right-0 h-full w-[280px] bg-background-sub shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-2 h-14 items-center">
        <button
          onClick={onClose}
          className="p-2 text-text-light"
          aria-label="메뉴 닫기"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-col p-4">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            className="p-3 text-lg rounded-md text-text-light hover:bg-white/10"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  </div>
);

export const Header = ({ onLogoClick }: { onLogoClick?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-8 bg-background-main border-b border-white/10">
        <div className="flex items-center justify-between w-full max-w-container mx-auto">
          <div>
            {onLogoClick ? (
              <button
                onClick={onLogoClick}
                className="text-2xl font-bold text-text-light"
              >
                LOGO
              </button>
            ) : (
              <a href="/" className="text-2xl font-bold text-text-light">
                LOGO
              </a>
            )}
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-base text-text-muted hover:text-text-light transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex">
            <button className="px-6 py-2 text-base rounded-md bg-accent-gold text-background-main font-semibold">
              로그인
            </button>
          </div>
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-text-light"
              aria-label="메뉴 열기"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      <DrawerMenuMobile isOpen={isMenuOpen} onClose={toggleMenu} />
      <div className="h-20" />
    </>
  );
};
