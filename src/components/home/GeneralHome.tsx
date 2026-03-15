import { Heart, Coins, Sparkles, Compass, Users, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

interface GeneralHomeProps {
  onNavigate: (page: string) => void;
}

export const GeneralHome = ({ onNavigate }: GeneralHomeProps) => {
  const [query, setQuery] = useState("");

  const handleConsult = () => {
    onNavigate("ai-consult");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-10">

      {/* 히어로 — AI 상담 인풋 */}
      <div className="relative rounded-3xl overflow-hidden mb-10 shadow-xl">
        {/* 배경 이미지 */}
        <img
          src="/full.png"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/70" />

        {/* 콘텐츠 */}
        <div className="relative z-10 px-6 sm:px-12 py-14 sm:py-20 max-w-xl mx-auto text-center">
          <p className="text-xs text-amber-300/90 font-semibold tracking-widest uppercase mb-4">AI 사주 상담</p>
          <h1 className="text-3xl sm:text-4xl font-myeongjo font-bold text-white mb-3 leading-snug drop-shadow">
            무엇이 궁금하세요?
          </h1>
          <p className="text-white/60 text-sm mb-8">
            사주·운세·진로·인연 — 무엇이든 물어보세요
          </p>
          <div
            className="flex items-center gap-3 bg-black/30 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-4 cursor-text group hover:bg-black/40 hover:border-white/35 transition"
            onClick={handleConsult}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConsult()}
              onClick={(e) => e.stopPropagation()}
              placeholder="오늘 무엇이 궁금하세요?"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/45 outline-none"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleConsult(); }}
              className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 hover:bg-amber-300 transition"
            >
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-gray-200">
              <img
                src="/manicon.png"
                alt="만세력 아이콘"
                className="w-50 h-50 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-myeongjo font-bold text-gray-800">
                무료 만세력
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                복잡한 절차 없이 생년월일시만 알면
              </p>
              <p className="text-gray-500 text-sm">
                내 사주팔자(四柱八字) 원국을 즉시 확인할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex md:justify-end">
            <button
              onClick={() => onNavigate("manse")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-md hover:bg-slate-800 transition"
            >
              무료 만세력 보러가기
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: "오늘의 운세",
            description: "야등이가 오늘의 흐름을 비춰드려요",
            icon: Star,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
            badge: "free",
            onClick: () => onNavigate("today"),
          },
          {
            title: "내 일주",
            description: "일주론으로 보는 내 일주",
            icon: Heart,
            iconBg: "bg-pink-50",
            iconColor: "text-pink-500",
            badge: "free",
            onClick: () => onNavigate("ilju"),
          },
          {
            title: "2026년 신년운세",
            description: "다가오는 한 해의 흐름을 점검",
            icon: Sparkles,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-500",
            badge: "free",
            onClick: () => onNavigate("sinnyeon"),
          },
          {
            title: "내 진로 직업 찾기",
            description: "나에게 맞는 진로와 직업 방향",
            icon: Compass,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            badge: "paid",
            onClick: () => onNavigate("career"),
          },
          {
            title: "커플궁합",
            description: "우리의 인연 궁합을 확인",
            icon: Users,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
            badge: "paid",
            onClick: () => onNavigate("couple"),
          },
          {
            title: "종합사주",
            description: "사주 전체 흐름과 핵심 정리",
            icon: Coins,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
            badge: "paid",
            onClick: () => onNavigate("jonghap"),
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={card.onClick}
              className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <span
                className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  card.badge === "free"
                    ? "bg-blue-50 text-blue-500"
                    : "bg-red-50 text-red-400"
                }`}
              >
                {card.badge === "free" ? "무료" : "유료"}
              </span>
              <div
                className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center ${card.iconColor} mb-4 group-hover:scale-110 transition`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
