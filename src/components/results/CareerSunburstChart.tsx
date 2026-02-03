// 사주 기반 직무 역량 선버스트 차트 (십신 → 5대 그룹 / 10대 세부 역량)
// ECharts sunburst, 2링: Inner=5대 직무 그룹, Outer=10대 세부 역량

import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

export interface SunburstGroupValues {
  비겁: number;
  식상: number;
  재성: number;
  관성: number;
  인성: number;
}

/** 2단계: 사주원국 일간 제외 7위치 십신 개수 (10키) */
export type SipsinCount = Record<
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인",
  number
>;

// ─── 차트에 보이는 텍스트 (직접 수정) ─────────────────────────────────
// 중앙(루트) 텍스트
const CENTER_LABEL = "십성(十星)";

// 안쪽 링: 5대 그룹 표시명 (차트에 그대로 노출)
const INNER_RING_LABELS: Record<keyof SunburstGroupValues, string> = {
  비겁: "비겁",
  식상: "식상",
  재성: "재성",
  관성: "관성",
  인성: "인성",
};

// 바깥 링: 10개 십신 표시명 (차트에 그대로 노출)
const OUTER_LABELS = {
  비겁: ["비견", "겁재"],
  식상: ["식신", "상관"],
  재성: ["정재", "편재"],
  관성: ["정관", "편관"],
  인성: ["정인", "편인"],
} as const;

// 바깥 링 상세 라벨 (툴팁·설명용)
const SIPSIN_PERSONA_LABELS: Record<keyof SipsinCount, string> = {
  비견: "비견(독보적 개척자)",
  겁재: "겁재(치열한 쟁취자)",
  식신: "식신(몰입하는 장인)",
  상관: "상관(화려한 반역자)",
  정재: "정재(철저한 관리자)",
  편재: "편재(비상한 설계사)",
  정관: "정관(고결한 중재자)",
  편관: "편관(불굴의 수호자)",
  정인: "정인(확고한 결정자)",
  편인: "편인(비범한 통찰가)",
};

// 드릴다운 시 차트 아래에 표시할 십신별 한 줄 설명 (선택)
const SIPSIN_DESCRIPTIONS: Record<keyof SipsinCount, string> = {
  비견: "외부의 간섭 없이 스스로 목표를 설정하고 달성하는 능력",
  겁재: "경쟁 우위를 점하기 위한 공격적인 전략 수립 및 위기 돌파 능력.",
  식신: "한 분야를 깊게 파고들어, 원천 기술을 확보하거나, 제품의 완성도를 높이는 연구 역량.",
  상관: "기존의 틀을 깨는 창의적인 아이디어로, 고객의 니즈를 관통하는 마케팅 및 커뮤니케이션 능력.",
  정재: "정해진 자원을 1원 단위까지 정밀하게 관리하며, 조직의 안정성을 유지하는 운영 역량.",
  편재: "넓은 시야로 시장의 흐름을 읽고, 대규모 자본이나 인력을 움직이는 프로젝트 매니징 역량.",
  정관: "사회적 규범과 사내 원칙을 준수하며, 합리적인 시스템을 구축하는 관리자적 역량.",
  편관: "극도의 스트레스 상황에서도 결단력을 발휘하여, 조직의 난제를 해결하는 야전 사령관적 역량.",
  정인: "데이터와 명분을 근거로 사안을 검토하여, 진행 여부를 결정하거나 보류시키는 게이트키핑 능력.",
  편인: "보이지 않는 이면의 정보를 분석하여 틈새시장을 찾아내거나 특수 기술을 습득하는 직관적 분석력.",
};

// 그룹별 고정 색상 (dayGan 없을 때: 1단계 기본값)
const GROUP_COLORS: Record<
  keyof SunburstGroupValues,
  { base: string; light: string }
> = {
  비겁: { base: "#16a34a", light: "#86efac" },
  식상: { base: "#dc2626", light: "#fca5a5" },
  재성: { base: "#ca8a04", light: "#fde047" },
  관성: { base: "#475569", light: "#cbd5e1" },
  인성: { base: "#0369a1", light: "#7dd3fc" },
};

// 일간별 십신 카테고리 → 오행 (색상 매칭용, 백엔드 DAYGAN_SIPSIN_TO_OHAENG와 동일)
const DAYGAN_SIPSIN_TO_OHAENG: Record<
  string,
  Record<keyof SunburstGroupValues, "木" | "火" | "土" | "金" | "水">
> = {
  甲: { 비겁: "木", 식상: "火", 재성: "土", 관성: "金", 인성: "水" },
  乙: { 비겁: "木", 식상: "火", 재성: "土", 관성: "金", 인성: "水" },
  丙: { 비겁: "火", 식상: "土", 재성: "金", 관성: "水", 인성: "木" },
  丁: { 비겁: "火", 식상: "土", 재성: "金", 관성: "水", 인성: "木" },
  戊: { 비겁: "土", 식상: "金", 재성: "水", 관성: "木", 인성: "火" },
  己: { 비겁: "土", 식상: "金", 재성: "水", 관성: "木", 인성: "火" },
  庚: { 비겁: "金", 식상: "水", 재성: "木", 관성: "火", 인성: "土" },
  辛: { 비겁: "金", 식상: "水", 재성: "木", 관성: "火", 인성: "土" },
  壬: { 비겁: "水", 식상: "木", 재성: "火", 관성: "土", 인성: "金" },
  癸: { 비겁: "水", 식상: "木", 재성: "火", 관성: "土", 인성: "金" },
};

// 오행별 색상 (일간에 따라 그룹 색상 매칭)
const OHAENG_COLORS: Record<
  "木" | "火" | "土" | "金" | "水",
  { base: string; light: string }
> = {
  木: { base: "#16a34a", light: "#86efac" },
  火: { base: "#dc2626", light: "#fca5a5" },
  土: { base: "#ca8a04", light: "#fde047" },
  金: { base: "#475569", light: "#cbd5e1" },
  水: { base: "#0369a1", light: "#7dd3fc" },
};

function getGroupColors(
  group: keyof SunburstGroupValues,
  dayGan: string | null | undefined
): { base: string; light: string } {
  if (dayGan && DAYGAN_SIPSIN_TO_OHAENG[dayGan]) {
    const ohaeng = DAYGAN_SIPSIN_TO_OHAENG[dayGan][group];
    return OHAENG_COLORS[ohaeng];
  }
  return GROUP_COLORS[group];
}

// 그룹 내 2등분 비율: 시각적 다양성을 위해 5:5가 아닌 약간씩 다른 비율 (결정적)
const SPLIT_RATIOS: Record<keyof SunburstGroupValues, [number, number]> = {
  비겁: [0.48, 0.52],
  식상: [0.55, 0.45],
  재성: [0.45, 0.55],
  관성: [0.52, 0.48],
  인성: [0.5, 0.5],
};

function buildSunburstData(
  values: SunburstGroupValues,
  dayGan?: string | null
): Record<string, unknown>[] {
  const groups: (keyof SunburstGroupValues)[] = [
    "비겁",
    "식상",
    "재성",
    "관성",
    "인성",
  ];
  const children: Record<string, unknown>[] = [];

  groups.forEach((key) => {
    const value = Math.max(0, values[key]);
    const [r1, r2] = SPLIT_RATIOS[key];
    const v1 = Math.round(value * r1);
    const v2 = Math.round(value * r2);
    const labels = OUTER_LABELS[key];
    const { base, light } = getGroupColors(key, dayGan);
    children.push({
      name: INNER_RING_LABELS[key],
      value,
      itemStyle: { color: base },
      children: [
        { name: labels[0], value: v1, itemStyle: { color: light } },
        { name: labels[1], value: v2, itemStyle: { color: light } },
      ],
    });
  });

  return [{ name: CENTER_LABEL, children }];
}

// 5대 그룹 → 해당 십신 2개 키
const GROUP_TO_SIPSIN_KEYS: Record<
  keyof SunburstGroupValues,
  [keyof SipsinCount, keyof SipsinCount]
> = {
  비겁: ["비견", "겁재"],
  식상: ["식신", "상관"],
  재성: ["정재", "편재"],
  관성: ["정관", "편관"],
  인성: ["정인", "편인"],
};

/** 2단계: 일간 제외 7위치 십신 개수로 선버스트 데이터 생성 (실제 사주원국 기반) */
function buildSunburstDataFromSipsinCount(
  sipsinCount: SipsinCount,
  dayGan?: string | null
): Record<string, unknown>[] {
  const groups: (keyof SunburstGroupValues)[] = [
    "비겁",
    "식상",
    "재성",
    "관성",
    "인성",
  ];
  const children: Record<string, unknown>[] = [];

  groups.forEach((key) => {
    const labels = OUTER_LABELS[key];
    const { base, light } = getGroupColors(key, dayGan);
    const [sipsinA, sipsinB] = GROUP_TO_SIPSIN_KEYS[key];
    const v1 = sipsinCount[sipsinA] ?? 0;
    const v2 = sipsinCount[sipsinB] ?? 0;
    const value = v1 + v2;
    children.push({
      name: INNER_RING_LABELS[key],
      value,
      itemStyle: { color: base },
      children: [
        { name: labels[0], value: v1, itemStyle: { color: light } },
        { name: labels[1], value: v2, itemStyle: { color: light } },
      ],
    });
  });

  return [{ name: CENTER_LABEL, children }];
}

interface CareerSunburstChartProps {
  /** 1단계: 오행 비율 기반 5대 그룹 값 (sipsinCount 없을 때 사용) */
  groupValues: SunburstGroupValues;
  /** 2단계: 사주원국 일간 제외 7위치 십신 개수 (있으면 이걸로 표시) */
  sipsinCount?: SipsinCount | null;
  /** 일간(한자, 예: 甲). 있으면 해당 일간의 십신→오행 매핑으로 색상 적용 */
  dayGan?: string | null;
  className?: string;
}

export const CareerSunburstChart: React.FC<CareerSunburstChartProps> = ({
  groupValues,
  sipsinCount,
  dayGan,
  className = "",
}) => {
  const [selectedSipsin, setSelectedSipsin] = useState<
    keyof SipsinCount | null
  >(null);

  const option = useMemo(() => {
    const data =
      sipsinCount != null
        ? buildSunburstDataFromSipsinCount(sipsinCount, dayGan)
        : buildSunburstData(groupValues, dayGan);
    return {
      tooltip: {
        trigger: "item",
        formatter: (params: {
          name: string;
          value?: number;
          treePathInfo?: { name: string }[];
        }) => {
          const path =
            params.treePathInfo?.map((p) => p.name).filter(Boolean) || [];
          const value = params.value != null ? params.value : 0;
          // sipsinCount 모드: 개수(숫자만), groupValues 모드: 비중(%)
          const valueLabel =
            path.length >= 2
              ? sipsinCount != null
                ? `개수: ${value}`
                : `점수: ${value}%`
              : "";
          const valueLine = valueLabel ? `<br/>${valueLabel}` : "";
          // 마지막 노드가 십신이면 페르소나 설명까지 함께 노출
          const lastName = path[path.length - 1] as
            | keyof SipsinCount
            | undefined;
          const persona =
            lastName && lastName in SIPSIN_PERSONA_LABELS
              ? SIPSIN_PERSONA_LABELS[lastName]
              : undefined;

          const mainLine = persona ?? path.join(" > ");
          return `${mainLine}${valueLine}`;
        },
      },
      series: [
        {
          type: "sunburst",
          data,
          radius: [0, "95%"],
          label: {
            show: true,
            rotate: 0,
            formatter: (params: { name: string }) => params.name,
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.5)",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.2)",
            },
          },
        },
      ],
    };
  }, [groupValues, sipsinCount, dayGan]);

  const handleChartClick = (params: { data?: { name?: string } }) => {
    const name = params.data?.name;
    if (name && name in SIPSIN_PERSONA_LABELS) {
      setSelectedSipsin(name as keyof SipsinCount);
    } else {
      setSelectedSipsin(null);
    }
  };

  return (
    <div className={className} style={{ width: "100%", minHeight: 320 }}>
      <ReactECharts
        option={option}
        style={{ height: 320, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        onEvents={{ click: handleChartClick }}
      />
      {selectedSipsin && (
        <div className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
          <div className="font-medium text-gray-900">
            {SIPSIN_PERSONA_LABELS[selectedSipsin]}
          </div>
          <div className="mt-1 text-gray-600">
            {SIPSIN_DESCRIPTIONS[selectedSipsin]}
          </div>
        </div>
      )}
    </div>
  );
};
