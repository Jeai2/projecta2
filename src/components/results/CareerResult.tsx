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
import {
  DAY_GAN_MODAL_PROFILES,
  type DayGanModalProfile,
  type MonthGroup,
} from "@/data/dayGanModalProfiles";
import { FloatingPillarsWidget } from "@/components/layout/FloatingPillarsWidget";
import { sibiwunseongDescriptions } from "@/data/sibiwunseongDescriptions";
import { ArchetypeChart, type ArchetypeCode } from "./ArchetypeChart";
import { ARCHETYPE_DESCRIPTIONS } from "@/data/archetypeDescriptions";
import { CareerChat, type CareerChatContext } from "./CareerChat";

/** 당령(천간) → 당령배합 base 문자열 */
const DANGNYEONG_BASE: Record<string, string> = {
  계: "신계갑병기",
  갑: "신계갑병기",
  을: "계을병무경",
  병: "계을병무경",
  정: "을정기경임",
  경: "을정기경임",
  신: "정무신임갑",
  임: "정무신임갑",
};

/** 사주원국 오행 비율 1개 이하일 때 표기할 부족한 오행 환경 설명 */
const DEFICIENT_OHAENG_WORK_STYLE: Record<
  "木" | "火" | "土" | "金" | "水",
  string
> = {
  金: "기준이 딱 정해진 일에서 정확하게 판단하고 결과 내는 게 편한 환경",
  水: "사람·정보·일이 계속 오가며 상황에 따라 유연하게 움직여야 하는 환경",
  木: "사람이나 일의 가능성을 키워가며, 시간이 지나면서 성장이 보이는 환경",
  火: "가만히 조용한 곳보다, 눈에 보이게 드러나고 에너지를 계속 써야 하는 환경",
  土: "앞에서 튀는 곳보다, 전체를 안정적으로 굴리고 관리해야 하는 환경",
};

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
  /** @deprecated jobRecommendationsBySource 사용 */
  jobCategories?: {
    title: string;
    professions: string;
    icon: string;
  }[];
  /** 4가지 출처별 직업 추천 (당령, 사령, 아키타입6, 부족한 오행) */
  jobRecommendationsBySource?: {
    dangnyeong: {
      source: string;
      label: string;
      items: { title: string; professions: string; icon: string }[];
    };
    saryeong: {
      source: string;
      label: string;
      items: { title: string; professions: string; icon: string }[];
    };
    archetype: {
      source: string;
      label: string;
      items: { title: string; professions: string; icon: string }[];
    };
    deficientOhaeng: {
      source: string;
      label: string;
      items: { title: string; professions: string; icon: string }[];
    };
  };
  // 만세력 네 기둥(년/월/일/시) 요약 (예: "甲子")
  pillarsSummary?: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 각 기둥의 천간 오행 (木火土金水)
  pillarsOhaengSummary?: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 현재 대운 (간지/시작 나이/시작 연도)
  currentDaewoon?: {
    ganji: string;
    age: number;
    year: number;
  } | null;
  // 십이운성 봉법 (년/월/일/시 각 기둥)
  pillarsSibiwunseong?: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 십이운성 거법 (년/월/일/시 각 기둥)
  pillarsSibiwunseongGeopbeop?: {
    year: string;
    month: string;
    day: string;
    hour: string;
  } | null;
  debug?: {
    source?: string;
    saryeongGan?: string;
    dangnyeongGan?: string;
    saryeongInPillars?: boolean;
    dangnyeongInPillars?: boolean;
  };
  archetype?: {
    scores: Record<"R" | "I" | "A" | "S" | "E" | "C", number>;
    daewoonScores?: Record<"R" | "I" | "A" | "S" | "E" | "C", number>;
    timeUnknown?: boolean;
  };
  timeUnknown?: boolean;
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
    null,
  );
  const [jobLegacyModal, setJobLegacyModal] = useState<JobLegacyItem | null>(
    null,
  );
  const [selectedArchetype, setSelectedArchetype] =
    useState<ArchetypeCode | null>(null);
  const [dayGanProfile, setDayGanProfile] = useState<DayGanModalProfile | null>(
    null,
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
            typeof item === "object" && "value" in item ? item.value : 0,
          ),
        1, // 최소 1로 보장하여 0으로 나누기 방지
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
      {/* 만세력 네 기둥(년/월/일/시) 플로팅 위젯 */}
      <FloatingPillarsWidget
        pillars={result.pillarsSummary}
        daewoonGanji={result.currentDaewoon?.ganji ?? null}
      />
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
                  {result.name}님의 천부운용(天賦運用)
                </h3>
              </div>
            </div>
            {(result.timeUnknown ?? result.archetype?.timeUnknown) && (
              <p className="text-sm text-amber-900 bg-amber-50 rounded-lg px-4 py-2 mt-2">
                출생 시간이 입력되지 않아, 오행·십성·직무 역량은 대략적인
                참고치입니다.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* 왼쪽: 5원소 밸런스 지수 (레이더 차트) */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                오행
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

          {/* 십이운성 봉법·거법 */}
          {(result.pillarsSibiwunseong ||
            result.pillarsSibiwunseongGeopbeop) && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  십이운성
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    12 Stages of Cycle
                  </span>
                </h4>
                <p className="text-xs text-gray-500 mb-5">
                  에너지 흐름으로 보는 상태
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 봉법 */}
                  {result.pillarsSibiwunseong &&
                    (() => {
                      const val = result.pillarsSibiwunseong!.month || "－";
                      const desc = sibiwunseongDescriptions[val];
                      const rgb = desc?.bongbeopRgb || "129, 140, 248";
                      return (
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div
                              className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-base font-bold bg-white sibiwun-pulse"
                              style={
                                {
                                  "--pulse-rgb": rgb,
                                  borderColor: `rgba(${rgb}, 0.35)`,
                                  color: `rgba(${rgb}, 1)`,
                                } as React.CSSProperties
                              }
                            >
                              {val}
                            </div>
                            <span
                              className="text-[10px] font-medium mt-0.5"
                              style={{ color: `rgba(${rgb}, 0.6)` }}
                            >
                              일간(日干)
                            </span>
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-semibold text-gray-800 mb-1">
                              개인적인 컨디션
                              {desc && (
                                <span className="ml-1.5 text-xs font-normal text-gray-400">
                                  {desc.hanja} · {desc.keyword}
                                </span>
                              )}
                            </p>
                            <p className="text-xs leading-relaxed text-gray-600">
                              {desc?.bongbeop ||
                                "해석 데이터가 아직 등록되지 않았습니다."}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  {/* 거법 */}
                  {result.pillarsSibiwunseongGeopbeop &&
                    (() => {
                      const val =
                        result.pillarsSibiwunseongGeopbeop!.month || "－";
                      const desc = sibiwunseongDescriptions[val];
                      const rgb = desc?.geopbeopRgb || "245, 158, 11";
                      return (
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div
                              className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-base font-bold bg-white sibiwun-pulse"
                              style={
                                {
                                  "--pulse-rgb": rgb,
                                  borderColor: `rgba(${rgb}, 0.35)`,
                                  color: `rgba(${rgb}, 1)`,
                                } as React.CSSProperties
                              }
                            >
                              {val}
                            </div>
                            <span
                              className="text-[10px] font-medium mt-0.5"
                              style={{ color: `rgba(${rgb}, 0.6)` }}
                            >
                              월간(月干)
                            </span>
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-semibold text-gray-800 mb-1">
                              사회적인 컨디션
                              {desc && (
                                <span className="ml-1.5 text-xs font-normal text-gray-400">
                                  {desc.hanja} · {desc.keyword}
                                </span>
                              )}
                            </p>
                            <p className="text-xs leading-relaxed text-gray-600">
                              {desc?.geopbeop ||
                                "해석 데이터가 아직 등록되지 않았습니다."}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>
            </div>
          )}

          {/* 당사주 유산 + 요약 정보 (전승 | 일간 직능 | 잠재력 배합) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                <button
                  type="button"
                  className="bg-amber-50 rounded-xl p-6 border border-amber-200 cursor-pointer w-full text-left"
                  onClick={() => setJobLegacyModal(legacy)}
                >
                  <div className="text-sm text-amber-700 mb-2">
                    전승(傳承){" "}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      Heritage
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-amber-800">
                    {rootSymbol}
                  </div>
                </button>
              );
            })()}
            <button
              type="button"
              className="bg-amber-50 rounded-xl p-6 border border-amber-200 cursor-pointer w-full text-left"
              onClick={() => {
                const gan = result.ohaengChart?.dayGan;
                if (!gan) {
                  setDayGanProfile(null);
                  return;
                }
                // 당령(당령 천간) → 월 그룹 매핑
                const dang = result.debug?.dangnyeongGan;
                const dangToMonthGroup: Partial<Record<string, MonthGroup>> = {
                  해자월: "해자월",
                  자축월: "자축월",
                  인묘월: "인묘월",
                  묘진월: "묘진월",
                  사오월: "사오월",
                  오미월: "오미월",
                  신유월: "신유월",
                  유술월: "유술월",
                  // 당령 한글 → 월군 매핑
                  임: "해자월",
                  계: "자축월",
                  갑: "인묘월",
                  을: "묘진월",
                  병: "사오월",
                  정: "오미월",
                  경: "신유월",
                  신: "유술월",
                };
                const monthGroup: MonthGroup =
                  (dang && dangToMonthGroup[dang]) || "자축월";

                const profile = DAY_GAN_MODAL_PROFILES.find(
                  (p) => p.dayGan === gan && p.monthGroup === monthGroup,
                );
                if (!profile) {
                  setDayGanProfile(null);
                  return;
                }
                setDayGanProfile(profile);
              }}
            >
              <div className="text-sm text-amber-700 mb-2">
                일간 직능{" "}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Day Master
                </span>
              </div>
              <div className="text-4xl font-bold text-amber-800">
                {result.ohaengChart?.dayGan ?? "-"}
              </div>
            </button>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="text-sm text-blue-700 mb-2">
                잠재력 배합{" "}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  Potential Base
                </span>
              </div>
              {(() => {
                const dang = result.debug?.dangnyeongGan;
                const base = dang ? DANGNYEONG_BASE[dang] : null;
                if (!base) return null;
                return (
                  <div className="text-4xl font-bold text-blue-800">{base}</div>
                );
              })()}
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">BEST WORK STYLE</div>
              <div className="text-sm leading-relaxed text-gray-800">
                {(() => {
                  const breakdown = result.ohaengChart?.breakdown;
                  const ohaengList: ("木" | "火" | "土" | "金" | "水")[] = [
                    "木",
                    "火",
                    "土",
                    "金",
                    "水",
                  ];
                  if (!breakdown?.gan || !breakdown?.ji) {
                    return (
                      <span className="font-medium">자유로운 창작 환경</span>
                    );
                  }
                  const deficient = ohaengList.filter((o) => {
                    const total =
                      (breakdown.gan[o] ?? 0) + (breakdown.ji[o] ?? 0);
                    return total <= 1;
                  });
                  if (deficient.length === 0) {
                    return (
                      <span className="font-medium">자유로운 창작 환경</span>
                    );
                  }
                  return (
                    <ul className="space-y-2 list-none">
                      {deficient.map((o) => (
                        <li key={o} className="flex flex-wrap gap-1">
                          <span className="font-semibold shrink-0">
                            {o}의 환경
                          </span>
                          <span className="text-gray-700">
                            – {DEFICIENT_OHAENG_WORK_STYLE[o]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 커리어 아키타입 (홀랜드 육각형) — 사이버 테마 */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900 p-8 text-white shadow-[0_0_24px_rgba(34,211,238,0.08)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-cyan-400/50 bg-cyan-400/10 font-mono text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              ⬡
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-100">
                사주 아키타입6
              </h3>
              <p className="text-xs font-mono text-cyan-400/80">
                SAJU ARCHETYPE 6
              </p>
            </div>
          </div>
          {result.archetype?.scores ? (
            <>
              <ArchetypeChart
                scores={result.archetype.scores}
                daewoonScores={result.archetype.daewoonScores}
                maxScore={1000}
                size={320}
                onArchetypeSelect={(code) =>
                  setSelectedArchetype((prev) => (prev === code ? null : code))
                }
              />
              {result.archetype.timeUnknown && (
                <p className="mt-4 text-center font-mono text-xs text-cyan-400/70">
                  [ 출생 시간 미입력 · 대략적 참고치 ]
                </p>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-white/60">
              아키타입 데이터를 불러오는 중입니다.
            </div>
          )}
          <div className="relative mt-6 border-t border-cyan-500/20 pt-6">
            {result.archetype?.scores && (
              <p className="text-xs text-slate-500/80 mb-3">
                차트 라벨을 클릭하면 해당 유형 설명을 볼 수 있습니다.
              </p>
            )}
            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedArchetype
                ? ARCHETYPE_DESCRIPTIONS[selectedArchetype]
                : result.successTip}
            </p>
          </div>
        </div>

        {/* 추천 직업 분야 (출처 구분 없이 통합 표시) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⭐</span>
            <h3 className="text-xl font-bold text-gray-800">추천 직업 분야</h3>
          </div>
          {result.jobRecommendationsBySource ? (
            (() => {
              const blocks = [
                result.jobRecommendationsBySource.dangnyeong,
                result.jobRecommendationsBySource.saryeong,
                result.jobRecommendationsBySource.archetype,
                result.jobRecommendationsBySource.deficientOhaeng,
              ];
              const seen = new Set<string>();
              const allItems: {
                title: string;
                professions: string;
                icon: string;
              }[] = [];
              for (const block of blocks) {
                for (const item of block?.items ?? []) {
                  const key = `${item.title}|${item.professions}`;
                  if (!seen.has(key)) {
                    seen.add(key);
                    allItems.push(item);
                  }
                }
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allItems.map((category, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <JobCategoryIcon type={category.icon} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-base text-gray-800 mb-1">
                            {category.title}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {category.professions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(result.jobCategories ?? []).map((category, idx) => (
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
          )}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              야등이의 말하는 본인의 진로
            </h4>
            <CareerChat
              context={(() => {
                const ctx: CareerChatContext = {
                  name: result.name,
                  energyType: result.energyType,
                  energyDescription: result.energyDescription,
                  keywords: result.keywords,
                  pillarsSummary: result.pillarsSummary
                    ? {
                        ...result.pillarsSummary,
                        hour: result.pillarsSummary.hour ?? null,
                      }
                    : undefined,
                  archetype: result.archetype
                    ? {
                        scores: result.archetype.scores,
                        timeUnknown: result.archetype.timeUnknown,
                      }
                    : undefined,
                  successTip: result.successTip,
                  jobLegacyMale: result.jobLegacyMale ?? undefined,
                  jobLegacyFemale: result.jobLegacyFemale ?? undefined,
                };
                if (result.jobRecommendationsBySource) {
                  const blocks = [
                    result.jobRecommendationsBySource.dangnyeong,
                    result.jobRecommendationsBySource.saryeong,
                    result.jobRecommendationsBySource.archetype,
                    result.jobRecommendationsBySource.deficientOhaeng,
                  ];
                  const seen = new Set<string>();
                  ctx.jobItems = [];
                  for (const block of blocks) {
                    for (const item of block?.items ?? []) {
                      const key = `${item.title}|${item.professions}`;
                      if (!seen.has(key)) {
                        seen.add(key);
                        ctx.jobItems!.push({
                          title: item.title,
                          professions: item.professions,
                        });
                      }
                    }
                  }
                }
                return ctx;
              })()}
            />
          </div>
          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <p>본 분석은 화의명리 관점과 해석방법을 바탕으로 한 분석입니다.</p>
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

      {/* 일간 모달: 일간별 data.ts에서 내용 참조 */}
      <AnimatePresence>
        {dayGanProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setDayGanProfile(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="daygan-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg w-full max-w-xl overflow-hidden"
            >
              <div className="px-8 py-8 relative space-y-6">
                <button
                  type="button"
                  onClick={() => setDayGanProfile(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded"
                  aria-label="닫기"
                >
                  <XIcon className="w-4 h-4" aria-hidden />
                </button>

                <p className="text-xs text-gray-400" aria-hidden>
                  일간 분석
                </p>
                <h3
                  id="daygan-modal-title"
                  className="text-xl font-bold text-gray-900 leading-tight"
                >
                  {dayGanProfile.coreTitle}
                </h3>

                <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p>{dayGanProfile.coreOneLiner}</p>
                  <p>
                    <span className="font-semibold text-gray-900">상태</span>:{" "}
                    {dayGanProfile.state}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">
                      필수 조건
                    </span>
                    : {dayGanProfile.condition}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">성향</span>:{" "}
                    {dayGanProfile.tendency}
                  </p>
                </section>

                <section className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    🛠 핵심 직능 (Key Competencies)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    {dayGanProfile.competencies.map((comp, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-xl p-3"
                      >
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          {comp.category}
                        </p>
                        <p className="font-semibold text-gray-900 mb-1">
                          {comp.name}
                        </p>
                        <p className="leading-relaxed">{comp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
