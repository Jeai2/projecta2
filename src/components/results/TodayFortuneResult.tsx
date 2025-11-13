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

  const compatibilityNotes = data.compatibility
    ? [
        data.compatibility.analysis.ganRelation,
        data.compatibility.analysis.jiRelation,
        data.compatibility.analysis.daewoonEffect,
      ].filter(Boolean)
    : [];

  const specialHarmony =
    data.compatibility?.analysis.specialHarmony?.filter(
      (item) => item && item.type && item.base && item.target
    ) ?? [];

  const harmonySuffixMap: Record<string, string> = {
    천간합: "합",
    천간충: "충",
    천간극: "극",
    육합: "육합",
    삼합: "삼합",
    반합: "반합",
    방합: "방합",
    충: "충",
    형: "형",
    삼형: "삼형",
    파: "파",
    해: "해",
  };

  const harmonyStyleMap: Record<string, string> = {
    천간합: "border border-amber-400/50 bg-amber-500/10 text-amber-600",
    천간충: "border border-rose-400/60 bg-rose-500/10 text-rose-600",
    천간극: "border border-indigo-400/50 bg-indigo-500/10 text-indigo-600",
    육합: "border border-emerald-400/50 bg-emerald-500/10 text-emerald-600",
    삼합: "border border-teal-400/50 bg-teal-500/10 text-teal-600",
    반합: "border border-sky-400/50 bg-sky-500/10 text-sky-600",
    방합: "border border-lime-400/50 bg-lime-500/10 text-lime-600",
    충: "border border-rose-400/60 bg-rose-500/10 text-rose-600",
    형: "border border-orange-400/50 bg-orange-500/10 text-orange-600",
    삼형: "border border-orange-500/60 bg-orange-500/15 text-orange-700",
    파: "border border-red-400/50 bg-red-500/10 text-red-600",
    해: "border border-purple-400/50 bg-purple-500/10 text-purple-600",
  };

  const collapseDialOrder = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];

  const collapseSlotMeta: Record<
    string,
    { label: string; range: string; element: string; elementLabel: string }
  > = {
    子: { label: "子", range: "23:00 – 01:00", element: "水", elementLabel: "수" },
    丑: { label: "丑", range: "01:00 – 03:00", element: "土", elementLabel: "토" },
    寅: { label: "寅", range: "03:00 – 05:00", element: "木", elementLabel: "목" },
    卯: { label: "卯", range: "05:00 – 07:00", element: "木", elementLabel: "목" },
    辰: { label: "辰", range: "07:00 – 09:00", element: "土", elementLabel: "토" },
    巳: { label: "巳", range: "09:00 – 11:00", element: "火", elementLabel: "화" },
    午: { label: "午", range: "11:00 – 13:00", element: "火", elementLabel: "화" },
    未: { label: "未", range: "13:00 – 15:00", element: "土", elementLabel: "토" },
    申: { label: "申", range: "15:00 – 17:00", element: "金", elementLabel: "금" },
    酉: { label: "酉", range: "17:00 – 19:00", element: "金", elementLabel: "금" },
    戌: { label: "戌", range: "19:00 – 21:00", element: "土", elementLabel: "토" },
    亥: { label: "亥", range: "21:00 – 23:00", element: "水", elementLabel: "수" },
  };

  const tenGodAdjustmentMap: Record<string, number> = {
    식신: 0.7,
    정인: 0.6,
    편재: 0.6,
    정재: 0.5,
    비견: 0.3,
    정관: 0.2,
    편인: 0.2,
    편관: -0.4,
    겁재: -0.5,
    상관: -0.6,
  };

  const tenGodUtilityMap: Record<string, number> = {
    식신: 1.0,
    정인: 0.9,
    편재: 0.9,
    정재: 0.8,
    비견: 0.6,
    정관: 0.55,
    편인: 0.55,
    편관: 0.3,
    겁재: 0.25,
    상관: 0.2,
  };

  const yongsinRoleBonusMap: Record<string, number> = {
    용신: 0.5,
    희신: 0,
    한신: 0,
    기신: 0,
    구신: 0,
  };

  const clampValue = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const tenGodKey = fortune.tenGodKey ?? "";
  const baseWaveScore = data.fortuneScore?.finalScore ?? 0;
  const tenGodAdjustment = tenGodAdjustmentMap[tenGodKey] ?? 0;
  const yongsinRole = data.fortuneScore?.breakdown.daewoon?.gan.role ?? "";
  const yongsinBonus =
    (yongsinRoleBonusMap[yongsinRole] ?? 0) + (yongsinRole === "용신" ? 0.3 : 0);
  const waveScore = clampValue(
    baseWaveScore + tenGodAdjustment + yongsinBonus,
    0,
    10
  );

  const probabilityPercent = (() => {
    const L = baseWaveScore; // 길흉 점수 (0~10)
    const utility = tenGodUtilityMap[tenGodKey] ?? 0.5; // 십성 효용도 기본값 0.5
    const rawProbability = 100 * (0.7 * (L / 10) + 0.3 * utility);
    return Math.round(clampValue(rawProbability, 0, 100));
  })();

  const collapseData = data.fortuneScore?.collapse;
  const collapseSlotsData = collapseData?.slots ?? [];
  const collapseSlotMap = new Map(
    collapseSlotsData.map((slot) => [slot.branch, slot] as const)
  );
  const collapseTopBranches = new Set(collapseData?.topBranches ?? []);
  const collapseTopRanges = Array.from(collapseTopBranches)
    .map((branch) => collapseSlotMeta[branch]?.range)
    .filter(Boolean) as string[];

  const entanglementData = data.fortuneScore?.entanglement;
  const connectionStrength = entanglementData?.connectionStrength ?? 0;
  const resonanceStrength = entanglementData?.resonanceStrength ?? 0;
  const mainStrength = entanglementData?.mainStrength ?? Math.min(baseWaveScore / 10, 1);
  const connectionPercent = Math.round(connectionStrength * 100);
  const resonancePercent = Math.round(resonanceStrength * 100);
  const mainStrengthPercent = Math.round(mainStrength * 100);
  const entanglementComponents = entanglementData?.components ?? [];
  const elementLabelMap: Record<string, string> = {
    木: "목",
    火: "화",
    土: "토",
    金: "금",
    水: "수",
  };
  const dominantComponent = entanglementComponents.reduce<
    | (typeof entanglementComponents)[number]
    | null
  >((prev, curr) => {
    if (!prev) return curr;
    return curr.score > prev.score ? curr : prev;
  }, null);

  const collapseIndex = (() => {
    const L = baseWaveScore;
    const utility = tenGodUtilityMap[tenGodKey] ?? 0.5;
    const P_base = 0.7 * (L / 10) + 0.3 * utility;
    const C = Math.abs(collapseData?.wolwoon?.score ?? 0);
    const D = Math.abs(collapseData?.iljin?.score ?? 0);
    const event = (0.6 * C + 0.4 * D) / 3;
    const rawCollapse = 100 * (0.6 * P_base + 0.4 * event);
    return Math.round(clampValue(rawCollapse, 0, 100));
  })();

  const waveNormalized = 1 - Math.min(Math.max(waveScore / 10, 0), 1);
  const waveAmplitude = clampValue(0.1 + waveNormalized * 0.6, 0.1, 0.75);
  const waveFrequency = 1 + waveNormalized * 2.5;
  const wavePoints = Array.from({ length: 40 }).map((_, idx) => {
    const x = idx / 39;
    const y = 0.5 + Math.sin(x * Math.PI * waveFrequency) * waveAmplitude;
    return `${x * 100},${(1 - y) * 100}`;
  });

  const probabilityRadius = 52;
  const probabilityVisibleHeight = Math.max(
    0,
    Math.min((probabilityPercent / 100) * 140, 140)
  );

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
                상세 분석
              </h3>
            </div>
            {specialHarmony.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specialHarmony.map((item, idx) => {
                  const suffix =
                    harmonySuffixMap[item.type] ?? item.type.replace("천간", "");
                  const badgeText = `${item.base}${item.target}${suffix}`;
                  const titleParts = [
                    item.context,
                    item.type,
                    item.description,
                  ].filter(Boolean);
                  return (
                    <span
                      key={`${item.type}-${item.base}-${item.target}-${idx}`}
                      title={titleParts.join(" · ")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        harmonyStyleMap[item.type] ?? "border border-slate-300/50 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {badgeText}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Wave metric */}
            <div
              key="wave"
              className="rounded-2xl border border-[#e2d7c5] bg-white/90 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                기류
              </p>
              <div className="mt-3 h-24 w-full">
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full text-emerald-400"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="waveGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(59, 130, 246, 0.2)"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,100 L ${wavePoints.join(" ")} L 100,100`}
                    fill="url(#waveGradient)"
                    stroke="none"
                  />
                  <polyline
                    points={wavePoints.join(" ")}
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.8)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-emerald-600">
                기류 점수
                <span className="ml-2 rounded-md bg-emerald-500/10 px-2 py-0.5 text-base font-semibold text-emerald-500">
                  {waveScore.toFixed(1)} / 10
                </span>
              </p>
            </div>

            {/* Probability metric */}
            <div
              key="probability"
              className="rounded-2xl border border-[#e2d7c5] bg-white/90 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 text-center">
              조화
              </p>
              <div className="mt-3 flex items-center justify-center">
                <svg
                  viewBox="0 0 140 140"
                  className="h-28 w-28"
                >
                  <defs>
                    <linearGradient
                      id="probabilityGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="100%" stopColor="rgb(16, 185, 129)" />
                    </linearGradient>
                    <mask id="probabilityMask" maskUnits="userSpaceOnUse">
                      <rect
                        x="0"
                        y={140 - probabilityVisibleHeight}
                        width="140"
                        height={probabilityVisibleHeight}
                        fill="white"
                      />
                    </mask>
                  </defs>
                  <circle
                    cx="70"
                    cy="70"
                    r={probabilityRadius}
                    fill="none"
                    stroke="rgba(226, 232, 240, 0.7)"
                    strokeWidth={12}
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={probabilityRadius}
                    fill="none"
                    stroke="url(#probabilityGradient)"
                    strokeWidth={12}
                    mask="url(#probabilityMask)"
                  />
                  <text
                    x="70"
                    y="78"
                    textAnchor="middle"
                    className="fill-emerald-600 text-xl font-semibold"
                  >
                    {probabilityPercent}%
                  </text>
                </svg>
              </div>
              <p className="mt-2 text-[11px] text-slate-400 text-center">
              오늘의 기운이 모이는 힘
              </p>
            </div>

            {/* Collapse metric */}
            <div
              key="collapse"
              className="rounded-2xl border border-[#e2d7c5] bg-white/90 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 text-center">
                작용
              </p>
              <div className="mt-3 flex items-center justify-center">
                <svg viewBox="0 0 140 140" className="h-28 w-28">
                  <defs>
                    <linearGradient id="collapseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(248, 113, 113, 0.9)" />
                      <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke="rgba(226, 232, 240, 0.8)"
                    strokeWidth="12"
                  />
                  {collapseIndex >= 60 && collapseData && collapseSlotsData.length > 0 && (
                    <g>
                      {collapseDialOrder.map((branch, index) => {
                        const isActive = collapseTopBranches.has(branch);
                        if (!isActive) {
                          return null;
                        }
                        const segments = collapseDialOrder.length;
                        const startAngle = (index / segments) * 2 * Math.PI - Math.PI / 2;
                        const endAngle = ((index + 1) / segments) * 2 * Math.PI - Math.PI / 2;
                        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
                        const innerRadius = 46;
                        const outerRadius = 58;
                        const x1 = 70 + outerRadius * Math.cos(startAngle);
                        const y1 = 70 + outerRadius * Math.sin(startAngle);
                        const x2 = 70 + outerRadius * Math.cos(endAngle);
                        const y2 = 70 + outerRadius * Math.sin(endAngle);
                        const x3 = 70 + innerRadius * Math.cos(endAngle);
                        const y3 = 70 + innerRadius * Math.sin(endAngle);
                        const x4 = 70 + innerRadius * Math.cos(startAngle);
                        const y4 = 70 + innerRadius * Math.sin(startAngle);

                        return (
                          <path
                            key={`${branch}-${index}`}
                            d={`M${x1},${y1} A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${x2},${y2} L${x3},${y3} A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${x4},${y4} Z`}
                            fill="url(#collapseGradient)"
                            opacity={0.45 + Math.min(collapseSlotMap.get(branch)?.value ?? 0, 2) * 0.15}
                          />
                        );
                      })}
                    </g>
                  )}
                  <text
                    x="70"
                    y="76"
                    textAnchor="middle"
                    className="fill-rose-500 text-xl font-semibold"
                  >
                    {collapseIndex}%
                  </text>
                  <text
                    x="70"
                    y="94"
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px]"
                  >
                    용운 확률
                  </text>
                </svg>
              </div>
              <p className="mt-2 text-[11px] text-slate-400 text-center">
                {collapseIndex >= 60 && collapseTopRanges.length > 0
                  ? `용운 시점: ${collapseTopRanges.join(", ")}`
                  : "운이 강하게 작용하는 시점"}
              </p>
              {collapseIndex >= 60 && collapseTopBranches.size > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px] text-rose-500">
                  {collapseDialOrder
                    .filter((branch) => collapseTopBranches.has(branch))
                    .map((branch, idx) => {
                      const slotInfo = collapseSlotMeta[branch];
                      const slotData = collapseSlotMap.get(branch);
                      return (
                        <span
                          key={`${branch}-${idx}`}
                          className="rounded-full bg-rose-100 px-2.5 py-1 font-medium"
                          title={`${slotInfo.label} · ${slotInfo.elementLabel}`}
                        >
                          {slotInfo.range}
                          <span className="ml-1 text-[10px] text-rose-400">
                            Ct {slotData ? slotData.value.toFixed(2) : "0.00"}
                          </span>
                        </span>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Entanglement metric */}
            <div
              key="entanglement"
              className="rounded-2xl border border-[#e2d7c5] bg-white/90 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 text-center">
                공명
              </p>
              {entanglementData ? (
                <div className="mt-2 space-y-2">
                  <div className="relative flex h-28 items-center justify-center">
                    {(() => {
                      const circleSize = 70;
                      const maxSeparation = 60;
                      const minSeparation = 26;
                      const containerHeight = 112; // h-28
                      const separation =
                        maxSeparation - connectionStrength * (maxSeparation - minSeparation);
                      const firstLeft = (140 - separation - circleSize) / 2;
                      const secondLeft = firstLeft + separation;
                      const top = Math.max((containerHeight - circleSize) / 2, 0);
                      const overlapSize = 22 + resonanceStrength * 40;
                      const overlapLeft = firstLeft + circleSize / 2 + separation / 2 - overlapSize / 2;
                      const overlapTop = top + (circleSize - overlapSize) / 2;
                      const externalElement = dominantComponent?.element ?? "";
                      const externalLabel = elementLabelMap[externalElement ?? ""] ?? "-";

                      return (
                        <>
                          <div
                            className="absolute rounded-full bg-emerald-200/80 shadow-sm"
                            style={{
                              width: circleSize,
                              height: circleSize,
                              left: firstLeft,
                              top,
                            }}
                          >
                            <div className="flex h-full flex-col items-center justify-center text-[11px] font-semibold text-emerald-700">
                              <span>主氣</span>
                              <span className="mt-0.5 text-xs font-medium">
                                {elementLabelMap[entanglementData.mainElement ?? ""] ?? "-"}
                              </span>
                            </div>
                          </div>
                          <div
                            className="absolute rounded-full bg-sky-200/80 shadow-sm"
                            style={{
                              width: circleSize,
                              height: circleSize,
                              left: secondLeft,
                              top,
                            }}
                          >
                            <div className="flex h-full flex-col items-center justify-center text-[11px] font-semibold text-sky-700">
                              <span>客氣</span>
                              <span className="mt-0.5 text-xs font-medium">{externalLabel}</span>
                            </div>
                          </div>
                          <div
                            className="absolute rounded-full bg-gradient-to-br from-amber-200/80 via-rose-200/70 to-transparent shadow"
                            style={{
                              width: overlapSize,
                              height: overlapSize,
                              left: overlapLeft,
                              top: overlapTop,
                            }}
                          />
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      연결 {connectionPercent}%
                    </span>
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                      공명 {resonancePercent}%
                    </span>
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
                      원기 {mainStrengthPercent}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">공명 데이터를 불러오지 못했습니다.</p>
              )}
            </div>
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
