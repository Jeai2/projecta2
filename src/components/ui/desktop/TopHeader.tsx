// 이 컴포넌트는 메인 콘텐츠 영역의 최상단에 위치하며, 사용자 관련 정보를 표시한다.

import { Bell, Gem, User } from "lucide-react";

interface TopHeaderProps {
  onProfileClick: () => void;
}

export const TopHeader = ({ onProfileClick }: TopHeaderProps) => {
  return (
    <header className="flex items-center justify-end h-20 px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-accent-gold">
          <Gem size={18} />
          <span className="font-semibold text-lg tracking-wider">269</span>
        </div>
        <button className="text-base text-text-muted hover:text-text-light transition-colors">
          Upgrade a plan
        </button>
        <button className="text-text-muted hover:text-text-light transition-colors">
          <Bell size={22} />
        </button>
        {/* 이 버튼을 클릭하면, 부모로부터 전달받은 onProfileClick 함수를 실행한다. */}
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-accent-lavender flex items-center justify-center"
        >
          <User size={22} className="text-background-main" />
        </button>
      </div>
    </header>
  );
};
