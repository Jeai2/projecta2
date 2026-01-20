import { Gem, User } from "lucide-react";
import { useUiStore } from "@/store/uiStore";

export const ModeSwitcherFloating = () => {
  const { isExpertMode, toggleExpertMode } = useUiStore();

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-gray-200 px-3 py-2 rounded-full shadow-xl">
        <span
          className={`text-xs font-semibold pl-1 ${
            isExpertMode ? "text-accent-gold" : "text-gray-500"
          }`}
        >
          {isExpertMode ? "전문가 모드" : "일반 모드"}
        </span>
        <button
          onClick={toggleExpertMode}
          className={`w-14 h-8 rounded-full relative mode-toggle-track focus:outline-none ${
            isExpertMode ? "bg-accent-gold" : "bg-gray-200"
          }`}
          aria-label="모드 전환"
        >
          <div
            className={`absolute left-1 top-1 w-6 h-6 rounded-full shadow-md mode-toggle-thumb flex items-center justify-center ${
              isExpertMode
                ? "translate-x-6 bg-slate-900 text-accent-gold"
                : "translate-x-0 bg-white text-gray-600"
            }`}
          >
            {isExpertMode ? (
              <Gem className="w-3.5 h-3.5" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
