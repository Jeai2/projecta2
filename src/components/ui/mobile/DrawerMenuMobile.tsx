// src/components/ui/mobile/DrawerMenuMobile.tsx

import { XIcon } from "../common/Icons";
import { mainMenuItems, secondaryMenuItems } from "@/config/menuConfig"; // ✅ 1. 설정 파일에서 메뉴 데이터 가져오기

interface DrawerMenuMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void; // ✅ 2. 페이지 이동 함수를 props로 받는다
}

export const DrawerMenuMobile = ({
  isOpen,
  onClose,
  onNavigate,
}: DrawerMenuMobileProps) => {
  const handleMenuClick = (pageId: string) => {
    onNavigate(pageId);
    onClose(); // 메뉴 항목 클릭 시 메뉴가 닫히도록
  };

  const allMenuItems = [...mainMenuItems, ...secondaryMenuItems]; // ✅ 3. 주 메뉴와 보조 메뉴를 합친다

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
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
          {/* ✅ 4. 통합된 메뉴 데이터를 기반으로 링크 생성 */}
          {allMenuItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={() => handleMenuClick(item.id)}
              className="p-3 text-lg rounded-md text-text-light hover:bg-white/10 flex items-center gap-3"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};
