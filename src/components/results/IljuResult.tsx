// src/components/results/IljuResult.tsx
// 일주론 결과 표시 컴포넌트

import React from "react";

interface IljuResultData {
  iljuData: {
    name: string;
    characteristic: string; // 성격 + 성향 통합
    career: string;
    spouse: string;
    wealth: string;
    health: string;
  };
  dayGan: string;
  dayJi: string;
  dayGanji: string;
}

interface IljuResultProps {
  iljuData: IljuResultData;
  onReset: () => void;
}

const categoryConfig = [
  {
    key: "characteristic" as const,
    label: "특성",
    emoji: "✨",
    gradient: "from-pink-100 via-rose-50 to-pink-100",
    borderColor: "border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    key: "career" as const,
    label: "진로",
    emoji: "🌟",
    gradient: "from-purple-100 via-violet-50 to-purple-100",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    key: "spouse" as const,
    label: "배우자",
    emoji: "💕",
    gradient: "from-rose-100 via-pink-50 to-rose-100",
    borderColor: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    key: "wealth" as const,
    label: "재물운",
    emoji: "💰",
    gradient: "from-amber-100 via-yellow-50 to-amber-100",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    key: "health" as const,
    label: "건강",
    emoji: "🌿",
    gradient: "from-emerald-100 via-green-50 to-emerald-100",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export const IljuResult: React.FC<IljuResultProps> = ({ iljuData, onReset }) => {
  const { iljuData: data, dayGan, dayJi, dayGanji } = iljuData;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-gray-600 inline-flex items-center gap-1 mb-4 transition-colors"
        >
          <span>←</span>
          <span>다시 입력</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-3">
            나의 일주론
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border border-pink-100">
            <span className="text-2xl font-bold text-gray-800">{dayGanji}</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">
              {dayGan} + {dayJi}
            </span>
          </div>
        </div>
      </div>

      {/* 일주 정보 카드 */}
      <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 rounded-3xl border border-pink-100/50 shadow-lg backdrop-blur-sm">
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-white/80 rounded-full border border-pink-200 mb-3">
            <span className="text-sm font-semibold text-gray-700">{data.name} 일주</span>
          </div>
          <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto mt-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">일간</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {dayGan}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">일지</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                {dayJi}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리별 카드 */}
      <div className="space-y-4">
        {categoryConfig.map((config) => {
          const content = data[config.key];
          return (
            <div
              key={config.key}
              className={`group relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.gradient} p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start gap-4">
                {/* 이모지 아이콘 */}
                <div className={`flex-shrink-0 w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
                  {config.emoji}
                </div>
                
                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold ${config.iconColor} mb-2`}>
                    {config.label}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {content}
                  </p>
                </div>
              </div>
              
              {/* 장식 요소 */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${config.gradient} opacity-20 rounded-full blur-3xl -z-0`}></div>
            </div>
          );
        })}
      </div>

      {/* 하단 여백 */}
      <div className="h-8"></div>
    </div>
  );
};
