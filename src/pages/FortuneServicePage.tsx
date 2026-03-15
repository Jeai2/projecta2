// src/pages/FortuneServicePage.tsx
// 운세 놀이터 — 클릭하면 해당 페이지로 이동하는 카드 모음

import { Star, Heart, Sparkles, Cookie, Dices, Compass, Users, Coins } from "lucide-react";

interface FortuneServicePageProps {
  onNavigate: (page: string) => void;
}

const FortuneServicePage = ({ onNavigate }: FortuneServicePageProps) => {
  const cards = [
    {
      title: "오늘의 운세",
      description: "야등이가 오늘의 흐름을 비춰드려요",
      icon: Star,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      badge: "free" as const,
      onClick: () => onNavigate("today"),
    },
    {
      title: "내 일주",
      description: "일주론으로 보는 내 일주",
      icon: Heart,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      badge: "free" as const,
      onClick: () => onNavigate("ilju"),
    },
    {
      title: "내 진로 직업 찾기",
      description: "나에게 맞는 진로와 직업 방향",
      icon: Compass,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      badge: "paid" as const,
      onClick: () => onNavigate("career"),
    },
    {
      title: "2026년 신년운세",
      description: "다가오는 한 해의 흐름을 점검",
      icon: Sparkles,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      badge: "free" as const,
      onClick: () => onNavigate("sinnyeon"),
    },
    {
      title: "커플궁합",
      description: "우리의 인연 궁합을 확인",
      icon: Users,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      badge: "paid" as const,
      onClick: () => onNavigate("couple"),
    },
    {
      title: "종합사주",
      description: "사주 전체 흐름과 핵심 정리",
      icon: Coins,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      badge: "paid" as const,
      onClick: () => onNavigate("jonghap"),
    },
    {
      title: "포춘쿠키",
      description: "오늘의 한 마디를 쿠키에 담아드릴게요",
      icon: Cookie,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      badge: "soon" as const,
      onClick: () => {},
    },
    {
      title: "윷점",
      description: "윷을 던져 오늘의 운을 점쳐보세요",
      icon: Dices,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      badge: "soon" as const,
      onClick: () => {},
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-10">
      <h1 className="text-xl font-bold text-gray-900 mb-1">운세</h1>
      <p className="text-sm text-gray-500 mb-8">궁금한 걸 바로 확인해보세요</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSoon = card.badge === "soon";
          return (
            <div
              key={card.title}
              onClick={isSoon ? undefined : card.onClick}
              className={`relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition group ${
                isSoon ? "cursor-default opacity-80" : "hover:shadow-md cursor-pointer"
              }`}
            >
              <span
                className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  card.badge === "free"
                    ? "bg-blue-50 text-blue-500"
                    : card.badge === "paid"
                    ? "bg-red-50 text-red-400"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {card.badge === "free" ? "무료" : card.badge === "paid" ? "유료" : "준비중"}
              </span>
              <div
                className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center ${card.iconColor} mb-4 ${
                  !isSoon && "group-hover:scale-110"
                } transition`}
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

export default FortuneServicePage;
