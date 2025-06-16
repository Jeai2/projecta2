import { MenuIcon } from "../common/Icons";

// ✅ 1. onLogoClick prop을 받도록 인터페이스를 수정한다.
interface HeaderBarMobileProps {
  onMenuClick: () => void;
  onLogoClick: () => void;
}

export const HeaderBarMobile = ({
  onMenuClick,
  onLogoClick,
}: HeaderBarMobileProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-14 px-4 bg-background-main/80 backdrop-blur-sm border-b border-b-white/10">
      {/* 로고: 클릭 시 onLogoClick 함수를 실행한다. */}
      <div
        className="text-xl font-bold text-text-light cursor-pointer"
        onClick={onLogoClick} // ✅ 2. onClick 이벤트를 연결한다.
      >
        LOGO
      </div>

      {/* 메뉴 버튼 */}
      <button
        onClick={onMenuClick}
        className="p-2 text-text-light"
        aria-label="메뉴 열기"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
    </header>
  );
};
