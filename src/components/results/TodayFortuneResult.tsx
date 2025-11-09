// src/components/results/TodayFortuneResult.tsx
// 오늘의 운세 전용 결과 컴포넌트 (일진 기반)

import React from "react";
import { Button } from "../ui/common/Button";
import type { TodayFortuneResponse } from "../../types/today-fortune";

interface TodayFortuneResultProps {
  data: TodayFortuneResponse | null;
  onReset: () => void;
}

export const TodayFortuneResult: React.FC<TodayFortuneResultProps> = ({
  data,
  onReset,
}) => {
  if (!data || !data.iljin || !data.fortune) {
    return (
      <div className="text-center text-text-muted">
        운세 결과를 불러오는 중입니다...
      </div>
    );
  }

  const { iljin, fortune } = data;

  // 오행 → 색상 클래스 매핑
  const ohaengToColorClass: Record<string, string> = {
    木: "text-green-400",
    火: "text-red-400",
    土: "text-yellow-400",
    金: "text-gray-300",
    水: "text-blue-400",
  };

  const formattedDate = new Date(iljin.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const compatibilityMetrics = data.compatibility
    ? [
        {
          label: "천간 상성",
          value: data.compatibility.ganCompatibility,
          accent: "text-emerald-300",
        },
        {
          label: "지지 상성",
          value: data.compatibility.jiCompatibility,
          accent: "text-emerald-300",
        },
        {
          label: "조화 보너스",
          value: data.compatibility.harmonyBonus,
          accent: "text-amber-300",
        },
        {
          label: "대운 지원",
          value: data.compatibility.daewoonSupport,
          accent: "text-sky-300",
        },
      ]
    : [];

  const compatibilityNotes = data.compatibility
    ? [
        data.compatibility.analysis.ganRelation,
        data.compatibility.analysis.jiRelation,
        data.compatibility.analysis.daewoonEffect,
      ].filter(Boolean)
    : [];

  const specialHarmony =
    data.compatibility?.analysis.specialHarmony?.filter(Boolean) ?? [];

  const themeCards = [
    {
      key: "work",
      title: "직업 · 사업",
      icon: "💼",
      content: fortune.work,
      border: "border-sky-400/40",
      gradient: "from-sky-500/15 via-sky-500/5 to-transparent",
    },
    {
      key: "money",
      title: "재물",
      icon: "💰",
      content: fortune.money,
      border: "border-amber-400/40",
      gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    },
    {
      key: "love",
      title: "연애 · 인간관계",
      icon: "💞",
      content: fortune.love,
      border: "border-pink-400/40",
      gradient: "from-pink-500/15 via-pink-500/5 to-transparent",
    },
    {
      key: "health",
      title: "건강",
      icon: "🌿",
      content: fortune.health,
      border: "border-emerald-400/40",
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    },
    {
      key: "relations",
      title: "협력 · 네트워크",
      icon: "🤝",
      content: fortune.relations ?? "-",
      border: "border-indigo-400/40",
      gradient: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    },
    {
      key: "documents",
      title: "계약 · 문서",
      icon: "📄",
      content: fortune.documents ?? "-",
      border: "border-violet-400/40",
      gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    },
  ];

  const highlightCards = [
    {
      key: "lucky",
      title: "길한 포인트",
      icon: "🍀",
      border: "border-emerald-400/40",
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      items: [
        { label: "방향", value: fortune.lucky.direction },
        { label: "색상", value: fortune.lucky.color },
        { label: "숫자", value: fortune.lucky.number },
        { label: "시간", value: fortune.lucky.time },
      ],
    },
    {
      key: "avoid",
      title: "주의 포인트",
      icon: "⚠️",
      border: "border-rose-400/40",
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      items: [
        { label: "방향", value: fortune.avoid.direction },
        { label: "색상", value: fortune.avoid.color },
        { label: "시간", value: fortune.avoid.time },
      ],
    },
    {
      key: "advice",
      title: "오늘의 조언",
      icon: "💫",
      border: "border-amber-400/40",
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      content: fortune.advice,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-500">
      <section className="relative overflow-hidden rounded-3xl border border-[#d9ccb7] bg-gradient-to-br from-[#fdfaf4] via-[#f5efe3] to-[#ebe4d9] p-8 shadow-xl shadow-amber-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,163,115,0.18),_transparent_60%)]" />
        <div className="relative z-10 space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            <span className="rounded-full border border-[#d9ccb7] bg-white/80 px-3 py-1">
              오늘의 운세
            </span>
            <span className="rounded-full border border-[#d9ccb7] bg-white/80 px-3 py-1">
              {formattedDate}
            </span>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-accent-gold/80">오늘의 일진</p>
                <div className="mt-2 text-5xl font-semibold tracking-tight text-accent-gold">
                  {iljin.ganji}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 sm:max-w-xs w-full">
                <div className="relative overflow-hidden rounded-lg border border-[#dacfbf] bg-white/85 px-3 py-3">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,231,225,0.55),_transparent_70%)]" />
                  <div className="relative z-10 space-y-1.5 text-center">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      천간
                    </p>
                    <div
                      className={`text-xl font-semibold ${
                        ohaengToColorClass[iljin.ohaeng.gan] || "text-slate-700"
                      }`}
                    >
                      {iljin.gan}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {iljin.ohaeng.gan}의 기운
                    </p>
                    <div className="flex items-center justify-center text-[10px] text-accent-gold">
                      <span className="rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2 py-0.5">
                        십성 {data.sipsinOfToday?.gan || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-[#dacfbf] bg-white/85 px-3 py-3">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,231,225,0.55),_transparent_70%)]" />
                  <div className="relative z-10 space-y-1.5 text-center">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      지지
                    </p>
                    <div
                      className={`text-xl font-semibold ${
                        ohaengToColorClass[iljin.ohaeng.ji] || "text-slate-700"
                      }`}
                    >
                      {iljin.ji}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {iljin.ohaeng.ji}의 기운
                    </p>
                    <div className="flex items-center justify-center text-[10px] text-accent-gold">
                      <span className="rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2 py-0.5">
                        십성 {data.sipsinOfToday?.ji || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-700">
              {fortune.summary}
            </p>

            <div className="relative overflow-hidden rounded-2xl border border-[#dacfbf] bg-white/80 p-6 shadow-lg shadow-amber-900/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,163,115,0.22),_transparent_75%)]" />
              <div className="relative z-10 space-y-3">
                <p className="text-sm font-semibold text-accent-gold">총평</p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {fortune.general}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {data.compatibility && (
        <section className="rounded-3xl border border-[#d9ccb7] bg-white/80 p-8 shadow-lg shadow-amber-900/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-accent-gold">
                상성 분석
              </h3>
              <p className="text-sm text-slate-500">
                총점 {data.compatibility.totalScore}점
              </p>
            </div>
            {specialHarmony.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specialHarmony.map((item, idx) => (
                  <span
                    key={`${item}-${idx}`}
                    className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {compatibilityMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-[#e2d7c5] bg-white/90 p-4 text-center"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {metric.label}
                </p>
                <p className={`mt-3 text-2xl font-semibold ${metric.accent}`}>
                  {metric.value > 0 ? `+${metric.value}` : metric.value}
                </p>
              </div>
            ))}
          </div>

          {compatibilityNotes.length > 0 && (
            <div className="mt-6 space-y-2 rounded-2xl border border-[#e2d7c5] bg-white/90 p-5">
              {compatibilityNotes.map((note, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-slate-700"
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-accent-gold">주제별 운세</h3>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {themeCards.map((card) => (
            <div
              key={card.key}
              className={`group relative overflow-hidden rounded-2xl border ${card.border.replace(
                "/40",
                "/30"
              )} bg-gradient-to-br ${
                card.gradient
              } p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/10`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_70%)]" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{card.icon}</span>
                  <p className="text-sm font-semibold text-slate-700">
                    {card.title}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {card.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlightCards.map((card) => (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-2xl border ${card.border.replace(
              "/40",
              "/30"
            )} bg-gradient-to-br ${card.gradient} p-6`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_75%)]" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{card.icon}</span>
                <p className="text-sm font-semibold text-slate-700">
                  {card.title}
                </p>
              </div>
              {"items" in card && card.items ? (
                <div className="space-y-3">
                  {card.items.map((item) => (
                    <div
                      key={`${card.key}-${item.label}`}
                      className="flex items-center justify-between text-sm text-slate-700"
                    >
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-slate-700">
                  {card.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="pt-4 text-center">
        <Button onClick={onReset} variant="outline" size="lg">
          다른 날 운세 보기
        </Button>
      </div>
    </div>
  );
};
