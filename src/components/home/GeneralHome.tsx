import { Heart, Coins, Sparkles, Compass, Users } from "lucide-react";

interface GeneralHomeProps {
  onNavigate: (page: string) => void;
}

export const GeneralHome = ({ onNavigate }: GeneralHomeProps) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden mb-10 shadow-lg group">
        <img
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          src="/heroimage.png"
          alt="오늘의 운세"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 sm:px-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-semibold mb-4 w-fit border border-white/20">
            Free
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-myeongjo font-bold text-white mb-2">
            오늘의 운세
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            작은 행운부터 큰 기회까지, 야등이가 오늘의 흐름을 미리 비춰드릴게요
          </p>
          <div className="mt-6">
            <button
              onClick={() => onNavigate("today")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 text-gray-900 text-sm font-semibold shadow-md hover:bg-white transition"
            >
              운세보러가기
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "내 일주",
            description: "일주론으로 보는 내 일주",
            icon: Heart,
            iconBg: "bg-pink-50",
            iconColor: "text-pink-500",
          },
          {
            title: "내 진로 직업 찾기",
            description: "나에게 맞는 진로와 직업 방향",
            icon: Compass,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
          },
          {
            title: "2026년 신년운세",
            description: "다가오는 한 해의 흐름을 점검",
            icon: Sparkles,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-500",
          },
          {
            title: "커플궁합",
            description: "우리의 인연 궁합을 확인",
            icon: Users,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
          },
          {
            title: "종합사주",
            description: "사주 전체 흐름과 핵심 정리",
            icon: Coins,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
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
