// src/components/results/CareerResult.tsx
// 진로 직업 찾기 결과 컴포넌트

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Sparkles,
  BookOpen,
  FileText,
  Users,
  Zap,
  Target,
  Shield,
  Heart,
  Eye,
  Flame,
  Award,
  type LucideIcon,
} from "lucide-react";
import {
  CareerSunburstChart,
  type SunburstGroupValues,
  type SipsinCount,
} from "@/components/results/CareerSunburstChart";
import { XIcon } from "@/components/ui/common/Icons";

interface OhaengChartData {
  data: {
    label: string;
    value: number;
    count: number;
    ohaeng: "木" | "火" | "土" | "金" | "水";
  }[];
  total: number;
  breakdown: {
    gan: {
      木: number;
      火: number;
      土: number;
      金: number;
      水: number;
      total: number;
    };
    ji: {
      木: number;
      火: number;
      土: number;
      金: number;
      水: number;
      total: number;
    };
  };
}

interface JobLegacyItem {
  label: string;
  careerTitle: string;
  careerDescription: string;
  resultJi?: string;
  resultOheng?: string;
  inheritedDNA?: string;
  corePowers?: string[];
  modernCareerDNA?: string;
}

interface CareerResultData {
  name: string;
  gender?: "M" | "W";
  jobLegacyMale?: JobLegacyItem | null;
  jobLegacyFemale?: JobLegacyItem | null;
  energyType: string; // 수식어 (예: "넓은 대지")
  energyDescription: string;
  keywords: string[];
  imageUrl?: string; // 에너지 타입 이미지 URL
  energyOhaeng?: "木" | "火" | "土" | "金" | "水"; // 천간(오행) 색상용
  jobCategories: {
    title: string;
    professions: string;
    icon: string;
  }[];
  successTip: string;
  jobSatisfaction: number;
  suitabilityData: {
    category: string;
    characteristics: string;
    suitability: number;
  }[];
  ohaengChart?:
    | (OhaengChartData & {
        sipsinCount?: SipsinCount;
        dayGan?: string | null;
        currentAge?: number;
        isOver40?: boolean;
        sinsalCapabilitiesUnder40?: {
          name: string;
          careerTitle: string;
          careerDescription: string;
          careerImageUrl?: string;
          potentialAbility?: string;
          expertOpinion?: string;
          luckyAction?: string;
        }[];
        sinsalCapabilitiesOver40?: {
          name: string;
          careerTitle: string;
          careerDescription: string;
          careerImageUrl?: string;
          potentialAbility?: string;
          expertOpinion?: string;
          luckyAction?: string;
        }[];
      })
    | null; // 오행 그래프 + 십신 개수 + 일간(선버스트) + 신살 직무 배지
}

interface CareerResultProps {
  result: CareerResultData;
  onReset: () => void;
}

type SinsalCapabilityItem = {
  name: string;
  /** 모달에서만 사용: 신살명 표기 (예: 년살(도화살)) */
  modalDisplayName?: string;
  careerTitle: string;
  careerDescription: string;
  careerImageUrl?: string;
  /** 전문 역량 진단 보고서 섹션 */
  potentialAbility?: string;
  expertOpinion?: string;
  luckyAction?: string;
};

/** 신살별 테마 색상(hex) + 라인 아이콘 */
const SINSAL_THEME: Record<string, { color: string; icon: LucideIcon }> = {
  역마살: { color: "#0ea5e9", icon: Globe },
  역마: { color: "#0ea5e9", icon: Globe },
  도화살: { color: "#ec4899", icon: Sparkles },
  화개살: { color: "#8b5cf6", icon: BookOpen },
  화개: { color: "#8b5cf6", icon: BookOpen },
  문창귀인: { color: "#6366f1", icon: FileText },
  천을귀인: { color: "#eab308", icon: Users },
  천덕귀인: { color: "#22c55e", icon: Shield },
  백호: { color: "#ef4444", icon: Zap },
  괴강: { color: "#dc2626", icon: Zap },
  원진: { color: "#f43f5e", icon: Heart },
  귀문관: { color: "#a855f7", icon: Eye },
  고란: { color: "#d946ef", icon: Sparkles },
  과인: { color: "#14b8a6", icon: Award },
  효신: { color: "#0d9488", icon: Heart },
  천문성: { color: "#3b82f6", icon: Target },
  현침: { color: "#64748b", icon: Zap },
  홍염: { color: "#f97316", icon: Flame },
  연살: { color: "#06b6d4", icon: Globe },
  망신살: { color: "#78716c", icon: Target },
  망신: { color: "#78716c", icon: Target },
  장성살: { color: "#b45309", icon: Zap },
  장성: { color: "#b45309", icon: Zap },
  반안살: { color: "#ca8a04", icon: Award },
  반안: { color: "#ca8a04", icon: Award },
  월살: { color: "#64748b", icon: Target },
  재살: { color: "#94a3b8", icon: Shield },
  겁살: { color: "#475569", icon: Zap },
  육해살: { color: "#0d9488", icon: Heart },
  육해: { color: "#0d9488", icon: Heart },
  천살: { color: "#64748b", icon: Eye },
  지살: { color: "#57534e", icon: BookOpen },
};
const DEFAULT_SINSAL_THEME = { color: "#64748b", icon: Award };

function getSinsalTheme(name: string) {
  return SINSAL_THEME[name] ?? DEFAULT_SINSAL_THEME;
}

/** 육각형 배지: SVG 배경 방식 (clip-path·drop-shadow 제거로 성능 최적화), stroke로 선명한 테두리 */
const SinsalBadgeButton: React.FC<{
  item: SinsalCapabilityItem;
  onOpenModal: () => void;
}> = ({ item, onOpenModal }) => {
  const { color, icon: Icon } = getSinsalTheme(item.name);

  // flat-top hexagon: viewBox 0 0 100 86.6 (비율 1 : 0.866)
  const hexPath = "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z";

  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="group relative flex min-h-[72px] w-full items-center justify-center focus:outline-none focus-visible:ring-0"
      style={
        {
          "--hex-shadow": "drop-shadow(0 1px 2px rgba(0,0,0,0.04))",
          "--hex-shadow-hover": "drop-shadow(0 10px 8px rgba(0,0,0,0.1))",
        } as React.CSSProperties
      }
    >
      {/* 육각형만 리프팅·그림자: SVG+콘텐츠 그룹에만 translate + drop-shadow (사각형 box-shadow 없음) */}
      <div
        className="relative w-full min-w-[56px] max-w-[72px] backdrop-blur-sm transition-[transform,filter] duration-300 group-hover:-translate-y-0.5 group-hover:[filter:var(--hex-shadow-hover)] group-focus-visible:-translate-y-0.5 group-focus-visible:[filter:var(--hex-shadow-hover)]"
        style={{
          aspectRatio: "1 / 0.866",
          filter: "var(--hex-shadow)",
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 86.6"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path
            d={hexPath}
            fill="rgba(255,255,255,0.6)"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
        {/* 내부 콘텐츠: SVG 위에 z-index로 표시, 육각형 중앙 정렬 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 p-1.5 text-center">
          <Icon
            className="w-4 h-4 shrink-0 stroke-[1.5]"
            style={{ color }}
            aria-hidden
          />
          <span
            className="text-[10px] font-bold leading-tight line-clamp-2"
            style={{ color }}
          >
            {item.name}
          </span>
        </div>
      </div>
    </button>
  );
};

// 레이더 차트 컴포넌트
const RadarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const padding = 44;
  const size = 200 + padding * 2;
  const center = size / 2;
  const radius = 80;
  const numPoints = data.length;
  const angleStep = (2 * Math.PI) / numPoints;

  // 데이터의 실제 최대값 계산
  const actualMaxValue = Math.max(...data.map((item) => item.value), 1);
  // 적당히 과장되게 보이도록 최대값의 120%를 기준으로 스케일링 (최대값이 약 83% 위치에 오도록)
  const maxValue = actualMaxValue * 1.2;

  // 각 점의 좌표 계산
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2; // 시작점을 위로
    // 스케일링된 최대값을 기준으로 계산
    const valueRadius = (radius * item.value) / maxValue;
    const x = center + valueRadius * Math.cos(angle);
    const y = center + valueRadius * Math.sin(angle);
    return { x, y, label: item.label, value: item.value };
  });

  // 레이더 차트 영역을 그리기 위한 path 생성
  const pathData =
    points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  // 그리드 라인 (스케일링된 최대값 기준으로 동적 생성)
  // 최대값의 25%, 50%, 75%, 100% 위치에 그리드 라인 표시
  const gridLevels = [0.25, 0.5, 0.75, 1.0].map((ratio) => maxValue * ratio);
  const gridLines = gridLevels.map((level) => {
    const levelRadius = (radius * level) / maxValue;
    return (
      <circle
        key={level}
        cx={center}
        cy={center}
        r={levelRadius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // 축 라인
  const axes = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={x2}
        y2={y2}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // 레이블: 패딩 안에 들어가도록 labelRadius 조정, 한 줄로 표기
  const labelRadius = radius + 24;
  const labels = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return (
      <text
        key={index}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-700 font-medium"
        style={{ fontSize: 11 }}
      >
        {item.label}
      </text>
    );
  });

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${size} ${size}`}
      className="max-w-[280px] mx-auto"
      style={{ minHeight: 288 }}
    >
      {gridLines}
      {axes}
      <path
        d={pathData}
        fill="rgba(180, 83, 9, 0.2)"
        stroke="rgb(180, 83, 9)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="rgb(180, 83, 9)"
        />
      ))}
      {labels}
    </svg>
  );
};

// 바 차트 아이템 컴포넌트
const BarChartItem = ({
  label,
  value,
  englishLabel,
}: {
  label: string;
  value: number;
  englishLabel?: string;
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 font-medium">
          {label}
          {englishLabel && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              {englishLabel}
            </span>
          )}
        </span>
        <span className="text-gray-800 font-bold">{value}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const JobCategoryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "education":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M22 10L12 5L2 10L12 15L22 10Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "art":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "startup":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "professional":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L15 21L12 17L9 21L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 13H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <span className="text-2xl">💼</span>;
  }
};

export const CareerResult: React.FC<CareerResultProps> = ({
  result,
  onReset,
}) => {
  const [sinsalModal, setSinsalModal] = useState<SinsalCapabilityItem | null>(
    null
  );
  const [jobLegacyModal, setJobLegacyModal] = useState<JobLegacyItem | null>(
    null
  );

  const ohaengTextColor: Record<string, string> = {
    木: "text-green-600",
    火: "text-red-600",
    土: "text-yellow-600",
    金: "text-gray-600",
    水: "text-blue-600",
  };
  const energyColorClass = result.energyOhaeng
    ? ohaengTextColor[result.energyOhaeng] || "text-gray-800"
    : "text-gray-800";

  // 오행 그래프 데이터 (API에서 받은 데이터 또는 기본값)
  const ohaengChartData = result.ohaengChart?.data || [
    { label: "木 (기획)", value: 85, count: 0, ohaeng: "木" },
    { label: "火 (실행)", value: 78, count: 0, ohaeng: "火" },
    { label: "土 (운용)", value: 65, count: 0, ohaeng: "土" },
    { label: "金 (판단)", value: 45, count: 0, ohaeng: "金" },
    { label: "水 (통찰)", value: 52, count: 0, ohaeng: "水" },
  ];

  // 오행과 직무 역량 매핑
  const ohaengToCareerMapping: Record<
    string,
    { label: string; englishLabel: string }
  > = {
    木: { label: "추진력", englishLabel: "기획/실행" },
    火: { label: "전달력", englishLabel: "소통/공유" },
    土: { label: "결속력", englishLabel: "운영/중재" },
    金: { label: "돌파력", englishLabel: "분석/전문성" },
    水: { label: "통찰력", englishLabel: "전략/학습" },
  };

  // 오행 차트 데이터에서 각 오행의 value를 가져와서 직무 역량 값으로 계산
  // 최대값을 70%로 맞추고 나머지를 비례적으로 조정
  const getCareerValue = (ohaeng: "木" | "火" | "土" | "金" | "水"): number => {
    const ohaengData = ohaengChartData.find((item) => {
      if (typeof item === "string") return false;
      return item.ohaeng === ohaeng;
    });
    if (typeof ohaengData === "object" && "value" in ohaengData) {
      const originalValue = ohaengData.value;

      // 현재 데이터의 최대값 찾기
      const maxValue = Math.max(
        ...ohaengChartData
          .filter((item) => typeof item === "object" && "value" in item)
          .map((item) =>
            typeof item === "object" && "value" in item ? item.value : 0
          ),
        1 // 최소 1로 보장하여 0으로 나누기 방지
      );

      // 최대값을 70%로 스케일링하고 나머지도 비례 조정
      const scaleFactor = 70 / maxValue;
      const scaledValue = originalValue * scaleFactor;

      return Math.round(scaledValue);
    }
    return 0;
  };

  // 선버스트용 5대 그룹 값 (오행 비율 매핑: 목→비겁, 화→식상, 토→재성, 금→관성, 수→인성)
  const sunburstGroupValues: SunburstGroupValues = {
    비겁: getCareerValue("木"),
    식상: getCareerValue("火"),
    재성: getCareerValue("土"),
    관성: getCareerValue("金"),
    인성: getCareerValue("水"),
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* 1. 타고난 기운 섹션 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border-4 border-green-200 overflow-hidden">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.energyType}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                {result.name}님의 기운
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                {result.name}님의 잠재 속성은{" "}
                <span
                  className={`font-extrabold tracking-tight ${energyColorClass}`}
                >
                  {result.energyType}
                </span>
                입니다
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                {result.energyDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 통합 적성 지표 섹션 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {result.name}님의 통합 지표
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* 왼쪽: 5원소 밸런스 지수 (레이더 차트) */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                천부운용(天賦運用)
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Innate Capability
                </span>
              </h4>
              <div className="flex justify-center items-center">
                <RadarChart
                  data={ohaengChartData.map((item) => ({
                    label: typeof item === "string" ? item : item.label,
                    value: typeof item === "string" ? 0 : item.value,
                  }))}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                직무 역량 지표
                <span className="ml-2 text-xs font-normal text-gray-500">
                  CAREER DNA
                </span>
              </h4>
              <div className="space-y-4">
                <BarChartItem
                  label={ohaengToCareerMapping["木"].label}
                  value={getCareerValue("木")}
                  englishLabel={ohaengToCareerMapping["木"].englishLabel}
                />
                <BarChartItem
                  label={ohaengToCareerMapping["火"].label}
                  value={getCareerValue("火")}
                  englishLabel={ohaengToCareerMapping["火"].englishLabel}
                />
                <BarChartItem
                  label={ohaengToCareerMapping["土"].label}
                  value={getCareerValue("土")}
                  englishLabel={ohaengToCareerMapping["土"].englishLabel}
                />
                <BarChartItem
                  label={ohaengToCareerMapping["金"].label}
                  value={getCareerValue("金")}
                  englishLabel={ohaengToCareerMapping["金"].englishLabel}
                />
                <BarChartItem
                  label={ohaengToCareerMapping["水"].label}
                  value={getCareerValue("水")}
                  englishLabel={ohaengToCareerMapping["水"].englishLabel}
                />
              </div>
            </div>
          </div>

          {/* 직무 역량 아래: 선버스트 차트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                십성 능력
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Sipsin Capability
                </span>
              </h4>
              <CareerSunburstChart
                groupValues={sunburstGroupValues}
                sipsinCount={result.ohaengChart?.sipsinCount}
                dayGan={result.ohaengChart?.dayGan}
                className="min-h-[320px]"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                신살 능력
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Sinsal Capability
                </span>
              </h4>
              {(() => {
                const isOver40 = result.ohaengChart?.isOver40 ?? false;
                const under40 =
                  result.ohaengChart?.sinsalCapabilitiesUnder40 ?? [];
                const over40 =
                  result.ohaengChart?.sinsalCapabilitiesOver40 ?? [];
                // 나이에 따라 한 섹션만 표시: 40세 미만 → 년·월 기준만, 40세 이상 → 년·월·일 기준
                const rawList = isOver40 ? over40 : under40;
                // 이름 기준 중복 제거 (같은 신살이 여러 번 오면 하나만 표시)
                const seen = new Set<string>();
                const list = rawList.filter((item) => {
                  if (seen.has(item.name)) return false;
                  seen.add(item.name);
                  return true;
                });
                const label = isOver40 ? "년·월·일 기준" : "년·월 기준";
                if (list.length === 0) {
                  return (
                    <div className="min-h-[200px] flex items-center justify-center text-sm text-gray-500">
                      {isOver40
                        ? "40세 이후 기준 보유 신살이 없습니다."
                        : "보유한 특수 신살이 없습니다."}
                    </div>
                  );
                }
                return (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      {label}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 min-h-[72px]">
                      {list.map((item) => (
                        <SinsalBadgeButton
                          key={item.name}
                          item={item}
                          onOpenModal={() => setSinsalModal(item)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 당사주 유산 (사주 성별에 따라 해당 1개만 노출, 성공 적합도 박스와 비슷한 디자인) */}
          {(() => {
            const legacy =
              result.gender === "W"
                ? result.jobLegacyFemale
                : result.jobLegacyMale;
            if (legacy == null) return null;
            const rootSymbol =
              legacy.resultJi && legacy.resultOheng
                ? `${legacy.resultJi}${legacy.resultOheng}`
                : legacy.label;
            return (
              <div className="mb-6 flex justify-start md:justify-start">
                <button
                  type="button"
                  className="bg-amber-50 rounded-xl p-6 border border-amber-200 cursor-pointer w-full md:w-[363px] text-left"
                  onClick={() => setJobLegacyModal(legacy)}
                >
                  <div className="text-sm text-amber-700 mb-2">전승(傳承)</div>
                  <div className="text-2xl font-bold text-amber-800 mb-1">
                    {rootSymbol}
                  </div>
                </button>
              </div>
            );
          })()}

          {/* 요약 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="text-sm text-amber-700 mb-2">성공 적합도</div>
              <div className="text-4xl font-bold text-amber-800">92%</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">핵심 속성</div>
              <div className="text-xl font-bold text-blue-800">
                벽갑인화 (나무와 불)
              </div>
            </div>
          </div>

          {/* 분석 소견 및 추가 정보 */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h5 className="text-base font-bold text-gray-800 mb-3">
                분석 소견
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                당신의 명조는 木, 火의 기운이 조화롭게 흐르고 있습니다. 이는
                새로운 가치를 창조하고 외부에 널리 알리는 '전략적 메신저'의
                자질이 매우 높음을 의미합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">
                  BEST WORK STYLE
                </div>
                <div className="text-base font-semibold text-gray-800">
                  자유로운 창작 환경
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">LUCK TIMING</div>
                <div className="text-base font-semibold text-gray-800">
                  2026년 하반기
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 추천 직업 분야 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⭐</span>
            <h3 className="text-xl font-bold text-gray-800">추천 직업 분야</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.jobCategories.map((category, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <JobCategoryIcon type={category.icon} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">
                      {category.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {category.professions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 성공을 위한 조언 */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-xl font-bold">성공을 위한 조언</h3>
          </div>
          <p className="text-white/90 text-base leading-relaxed mb-6">
            {result.successTip}
          </p>
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">직무 만족도 예상</span>
              <span className="text-lg font-bold">
                {result.jobSatisfaction}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${result.jobSatisfaction}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. 운세 데이터 기반 직무 적합성 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-6 h-6 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M3 3v18h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 16l4-4 4 4 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">
              운세 데이터 기반 직무 적합성
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    오행 분류
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    대표 특성
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    적합 지수
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.suitabilityData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.characteristics}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">
                      {item.suitability}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <p>
              본 분석은 사주 오행과 십신 이론을 바탕으로 한 시뮬레이션입니다.
            </p>
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
            >
              <span>다시 분석하기</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M1 4v6h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 20v-6h-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.49 9A9 9 0 003.51 15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.51 9A9 9 0 0020.49 15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 특수 직무 재능 배지 클릭 시 설명 모달 — 텍스트 중심, 타이포·여백·미니멀 아이콘·단순 페이드인 */}
      <AnimatePresence>
        {sinsalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSinsalModal(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sinsal-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSinsalModal(null)}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg w-full max-w-md overflow-hidden cursor-pointer"
            >
              {sinsalModal.careerImageUrl && (
                <div className="bg-gray-50 flex items-center justify-center p-6">
                  <img
                    src={sinsalModal.careerImageUrl}
                    alt=""
                    className="max-h-20 max-w-full object-contain"
                  />
                </div>
              )}
              <div className="px-8 py-8 relative space-y-8">
                <button
                  type="button"
                  onClick={() => setSinsalModal(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded"
                  aria-label="닫기"
                >
                  <XIcon className="w-4 h-4" aria-hidden />
                </button>
                <p className="text-sm text-gray-500 pr-8" aria-hidden>
                  {sinsalModal.modalDisplayName ?? sinsalModal.name}
                </p>
                <h3
                  id="sinsal-modal-title"
                  className="text-xl font-bold text-gray-900 pr-8 leading-tight"
                >
                  {sinsalModal.careerTitle}
                </h3>
                {sinsalModal.careerDescription && (
                  <p className="text-sm text-gray-600 leading-relaxed pr-8 -mt-1">
                    {sinsalModal.careerDescription}
                  </p>
                )}

                {/* 잠재역량 */}
                <section>
                  <p className="text-xs text-gray-400 mb-2">잠재역량</p>
                  <p className="text-base font-semibold text-gray-900 leading-relaxed">
                    {sinsalModal.potentialAbility ?? sinsalModal.careerTitle}
                  </p>
                </section>

                {/* 전문가 소견 — 연한 회색 박스 */}
                <section>
                  <p className="text-xs text-gray-400 mb-2">발현 조건</p>
                  <div className="rounded-xl bg-gray-100 border border-gray-200 p-4">
                    <p className="text-base font-semibold text-gray-900 leading-relaxed">
                      {sinsalModal.expertOpinion ??
                        sinsalModal.careerDescription}
                    </p>
                  </div>
                </section>

                {/* 럭키 액션 — 신살 테마 색상 강조 박스 */}
                <section>
                  <p className="text-xs text-gray-400 mb-2">발현 행동</p>
                  <div
                    className="rounded-xl border-l-4 p-4"
                    style={{
                      borderLeftColor:
                        getSinsalTheme(sinsalModal.name).color ?? "#64748b",
                      backgroundColor: `${
                        getSinsalTheme(sinsalModal.name).color ?? "#64748b"
                      }12`,
                    }}
                  >
                    <p className="text-base font-semibold text-gray-900 leading-relaxed">
                      {sinsalModal.luckyAction ??
                        "이 신살의 특성을 활용한 행동을 추천합니다."}
                    </p>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 당사주 유산 클릭 시 설명 모달 (신살 능력 모달과 동일한 톤) */}
      <AnimatePresence>
        {jobLegacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setJobLegacyModal(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-legacy-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg w-full max-w-md overflow-hidden"
            >
              <div className="px-8 py-8 relative space-y-4">
                <button
                  type="button"
                  onClick={() => setJobLegacyModal(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded"
                  aria-label="닫기"
                >
                  <XIcon className="w-4 h-4" aria-hidden />
                </button>
                <p className="text-xs text-gray-500" aria-hidden>
                  BaseLine
                </p>
                <h3
                  id="job-legacy-modal-title"
                  className="text-xl font-bold text-gray-900 leading-tight"
                >
                  {jobLegacyModal.label}
                </h3>
                {jobLegacyModal.resultJi && jobLegacyModal.resultOheng && (
                  <p className="text-sm text-gray-600">
                    뿌리 지지: {jobLegacyModal.resultJi}
                    {jobLegacyModal.resultOheng}
                  </p>
                )}

                {/* Inherited DNA */}
                {jobLegacyModal.inheritedDNA && (
                  <section className="pt-2 space-y-1">
                    <p className="text-xs text-gray-400">Inherited DNA</p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {jobLegacyModal.inheritedDNA}
                    </p>
                  </section>
                )}

                {/* Core Power */}
                {jobLegacyModal.corePowers &&
                  jobLegacyModal.corePowers.length > 0 && (
                    <section className="pt-2 space-y-2">
                      <p className="text-xs text-gray-400">
                        핵심 역량 (Core Power)
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                        {jobLegacyModal.corePowers.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                {/* Modern Career DNA */}
                {jobLegacyModal.modernCareerDNA && (
                  <section className="pt-2 space-y-1">
                    <p className="text-xs text-gray-400">Modern Career DNA</p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {jobLegacyModal.modernCareerDNA}
                    </p>
                  </section>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
