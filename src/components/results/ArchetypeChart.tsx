// src/components/results/ArchetypeChart.tsx
// 홀랜드 6유형 육각형 레이더 차트 — 사이버 테마

import { useState } from "react";

export type ArchetypeCode = "R" | "I" | "A" | "S" | "E" | "C";

interface ArchetypeChartProps {
  scores: Record<ArchetypeCode, number>;
  daewoonScores?: Record<ArchetypeCode, number> | null;
  maxScore?: number;
  size?: number;
  className?: string;
  onArchetypeSelect?: (code: ArchetypeCode) => void;
}

const ARCHETYPE_LABELS: Record<ArchetypeCode, { name: string; label: string }> =
  {
    R: { name: "실천", label: "The Solid" },
    I: { name: "탐구", label: "The Insight" },
    A: { name: "감성", label: "The Spark" },
    S: { name: "조화", label: "The Harmony" },
    E: { name: "추진", label: "The Drive" },
    C: { name: "조직", label: "The System" },
  };

const ORDER: ArchetypeCode[] = ["R", "I", "A", "S", "E", "C"];

const CYAN = "#22d3ee";
const MAGENTA = "#e879f9";
const BG_GRID = "rgba(34, 211, 238, 0.08)";

/** 육각형 꼭짓점 각도 (R이 위쪽, 시계방향) */
function getHexagonPoints(
  size: number,
  values: number[],
  maxVal: number,
): string {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 2 - (i * Math.PI) / 3;
    const r = maxVal > 0 ? (values[i] / maxVal) * radius : 0;
    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy - Math.sin(angle) * r,
    });
  }
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

/** 육각형 배경 그리드 꼭짓점 (최대 반경) */
function getHexagonOutline(size: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.45;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 2 - (i * Math.PI) / 3;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy - Math.sin(angle) * radius,
    });
  }
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

/** 라벨 위치 (육각형 바깥) */
function getLabelPosition(
  size: number,
  index: number,
): { x: number; y: number } {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.48;
  const angle = Math.PI / 2 - (index * Math.PI) / 3;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy - Math.sin(angle) * radius,
  };
}

export function ArchetypeChart({
  scores,
  daewoonScores,
  maxScore = 1000,
  size = 320,
  className = "",
  onArchetypeSelect,
}: ArchetypeChartProps) {
  const [daewoonOn, setDaewoonOn] = useState(false);
  const hasDaewoon = daewoonScores && Object.keys(daewoonScores).length > 0;

  const displayScores: Record<ArchetypeCode, number> =
    hasDaewoon && daewoonOn ? daewoonScores! : scores;

  const values = ORDER.map((code) => displayScores[code] ?? 0);
  const maxVal = Math.max(...values, 1);
  const displayMax = Math.max(maxVal, maxScore * 0.1);
  const polygonPoints = getHexagonPoints(size, values, displayMax);
  const outlinePoints = getHexagonOutline(size);
  const halfValues = ORDER.map(() => displayMax * 0.5);
  const strokeColor = daewoonOn ? MAGENTA : CYAN;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {hasDaewoon && (
        <button
          type="button"
          onClick={() => setDaewoonOn(!daewoonOn)}
          className={`mb-4 rounded border px-4 py-2 text-xs font-mono tracking-widest transition ${
            daewoonOn
              ? "border-[#e879f9] bg-[#e879f9]/20 text-[#e879f9] shadow-[0_0_12px_rgba(232,121,249,0.4)]"
              : "border-cyan-400/60 bg-cyan-400/10 text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]"
          }`}
        >
          [ 대운 {daewoonOn ? "ON" : "OFF"} ]
        </button>
      )}
      <div className="relative rounded-lg bg-slate-900/50 p-4 ring-1 ring-cyan-500/30">
        {/* 그리드 배경 */}
        <div
          className="absolute inset-0 rounded-lg opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(${BG_GRID} 1px, transparent 1px),
              linear-gradient(90deg, ${BG_GRID} 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative overflow-visible"
        >
          <defs>
            <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* 배경 육각형 (사이버 그리드) */}
          <polygon
            points={outlinePoints}
            fill="none"
            stroke={strokeColor}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <polygon
            points={outlinePoints}
            fill="none"
            stroke={strokeColor}
            strokeOpacity="0.15"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* 50% 보조선 */}
          <polygon
            points={getHexagonPoints(size, halfValues, displayMax)}
            fill="none"
            stroke={strokeColor}
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* 아키타입 폴리곤 + 글로우 */}
          <polygon
            points={polygonPoints}
            fill="url(#polyGrad)"
            stroke={strokeColor}
            strokeWidth="2"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}66)`,
            }}
          />
          {/* 라벨 (클릭 시 해당 아키타입 설명 표시) */}
          {ORDER.map((code, i) => {
            const pos = getLabelPosition(size, i);
            const label = ARCHETYPE_LABELS[code];
            const scoreVal = values[i];
            const handleClick = () => onArchetypeSelect?.(code);
            return (
              <g
                key={code}
                onClick={handleClick}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleClick()
                }
                role={onArchetypeSelect ? "button" : undefined}
                tabIndex={onArchetypeSelect ? 0 : undefined}
                style={{
                  cursor: onArchetypeSelect ? "pointer" : "default",
                }}
                className={
                  onArchetypeSelect
                    ? "transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                    : undefined
                }
              >
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgb(241 245 249)"
                  fontWeight="600"
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.03em",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {label.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={strokeColor}
                  fontWeight="700"
                  style={{
                    fontSize: "15px",
                    fontFamily: "ui-monospace, monospace",
                    filter: `drop-shadow(0 0 6px ${strokeColor}99)`,
                  }}
                >
                  {Math.round(scoreVal)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
