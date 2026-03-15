// src/components/results/SewoonWaveChart.tsx
// 억부용신 기준: 용신/희신/한신 ↑ / 기신/구신 ↓ 세운 연도별 파동 차트

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { FortuneResponseData } from "@/types/fortune";

const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const GAN_OHENG: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土",
  庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

const JI_OHENG: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

const OHENG_SAENGSAENG: Record<string, string> = {
  木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
};

const OHENG_SANGGEUK: Record<string, string> = {
  木: "土", 火: "金", 土: "水", 金: "木", 水: "火",
};

type YongsinRole = "용신" | "희신" | "한신" | "기신" | "구신";

const ROLE_SCORE: Record<YongsinRole, number> = {
  용신: 2,
  희신: 1,
  한신: 0.5,
  기신: -1,
  구신: -2,
};

function invertMap(m: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(m).forEach(([k, v]) => { out[v] = k; });
  return out;
}

const PRODUCER_MAP = invertMap(OHENG_SAENGSAENG);
const CONTROLLER_MAP = invertMap(OHENG_SANGGEUK);

function getYearGanji(year: number): string {
  const ganIndex = ((year - 4) % 10 + 10) % 10;
  const jiIndex = ((year - 4) % 12 + 12) % 12;
  return GAN[ganIndex] + JI[jiIndex];
}

function deriveRoleMap(primaryYongsinGan: string): {
  primary?: string;
  hui?: string;
  han?: string;
  gi?: string;
  gu?: string;
} {
  const primary = GAN_OHENG[primaryYongsinGan];
  if (!primary) return {};
  const hui = PRODUCER_MAP[primary];
  const gi = CONTROLLER_MAP[primary];
  const gu = gi ? PRODUCER_MAP[gi] : undefined;
  const han = gi ? CONTROLLER_MAP[gi] : undefined;
  return { primary, hui, han, gi, gu };
}

function getRoleForElement(
  element: string | undefined,
  roles: ReturnType<typeof deriveRoleMap>
): YongsinRole {
  if (!element || !roles) return "기신";
  if (roles.primary === element) return "용신";
  if (roles.hui === element) return "희신";
  if (roles.han === element) return "한신";
  if (roles.gi === element) return "기신";
  if (roles.gu === element) return "구신";
  return "기신";
}

function getSewoonScore(
  ganji: string,
  roles: ReturnType<typeof deriveRoleMap>
): number {
  const gan = ganji[0];
  const ji = ganji[1];
  const ganOhaeng = GAN_OHENG[gan];
  const jiOhaeng = JI_OHENG[ji];
  const ganRole = getRoleForElement(ganOhaeng, roles);
  const jiRole = getRoleForElement(jiOhaeng, roles);
  return (ROLE_SCORE[ganRole] + ROLE_SCORE[jiRole]) / 2;
}

/** 연속된 상승 구간 추출 (y[i+1] > y[i]) */
function getRisingSections(values: number[]): { start: number; end: number }[] {
  const sections: { start: number; end: number }[] = [];
  let segStart = -1;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] > values[i]) {
      if (segStart === -1) segStart = i;
    } else {
      if (segStart !== -1) sections.push({ start: segStart, end: i + 1 });
      segStart = -1;
    }
  }
  if (segStart !== -1) sections.push({ start: segStart, end: values.length });
  return sections;
}

interface SewoonWaveChartProps {
  myFortune: FortuneResponseData;
  partnerFortune: FortuneResponseData;
}

const YEAR_AHEAD = 10; // 올해 기준 앞으로 10년 (총 10년)

export const SewoonWaveChart: React.FC<SewoonWaveChartProps> = ({
  myFortune,
  partnerFortune,
}) => {
  const option = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: YEAR_AHEAD },
      (_, i) => currentYear + i
    );

    const myPrimary = myFortune.saju?.sajuData?.yongsin?.primaryYongsin ?? myFortune.saju?.sajuData?.pillars?.day?.gan ?? "";
    const partnerPrimary = partnerFortune.saju?.sajuData?.yongsin?.primaryYongsin ?? partnerFortune.saju?.sajuData?.pillars?.day?.gan ?? "";

    const myRoles = deriveRoleMap(myPrimary);
    const partnerRoles = deriveRoleMap(partnerPrimary);

    const myRawScores = years.map((y) => getSewoonScore(getYearGanji(y), myRoles));
    const partnerRawScores = years.map((y) => getSewoonScore(getYearGanji(y), partnerRoles));
    const allScores = [...myRawScores, ...partnerRawScores];
    const minScore = allScores.length > 0 ? Math.min(...allScores) : 0;
    const offset = -minScore;
    const maxShifted = allScores.length > 0
      ? Math.max(...allScores.map((s) => s + offset))
      : 4;

    const myData = years.map((year, i) => ({
      value: [i, myRawScores[i] + offset] as [number, number],
      year,
      ganji: getYearGanji(year),
    }));

    const partnerData = years.map((year, i) => ({
      value: [i, partnerRawScores[i] + offset] as [number, number],
      year,
      ganji: getYearGanji(year),
    }));

    const overlapPoints = myData
      .map((d, i) => {
        const p = partnerData[i];
        if (!p || Math.abs(d.value[1] - p.value[1]) > 0.01) return null;
        return { coord: d.value, year: d.year, ganji: d.ganji };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    const myYValues = myData.map((d) => d.value[1]);
    const partnerYValues = partnerData.map((d) => d.value[1]);
    const myRisingSections = getRisingSections(myYValues);
    const partnerRisingSections = getRisingSections(partnerYValues);

    const legendData = ["나", "상대방"];
    if (overlapPoints.length > 0) legendData.push("겹침");
    if (myRisingSections.length > 0 || partnerRisingSections.length > 0) {
      legendData.push("나 상승", "상대방 상승");
    }

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params: { seriesName: string; data: unknown[] }[]) => {
          if (!params?.[0]?.data) return "";
          const idx = (params[0].data as [number, number])[0];
          const myP = params.find((p) => p.seriesName === "나");
          const partnerP = params.find((p) => p.seriesName === "상대방");
          const myVal = myP ? (myP.data as [number, number])[1] : null;
          const partnerVal = partnerP ? (partnerP.data as [number, number])[1] : null;
          const myD = myData[idx];
          const partnerD = partnerData[idx];
          let html = `<div class="text-xs">`;
          if (myD) html += `나: ${myD.ganji} (${myD.year}년) ${myVal != null ? `· ${myVal > 0 ? "↑" : "↓"}` : ""}<br/>`;
          if (partnerD) html += `상대방: ${partnerD.ganji} (${partnerD.year}년) ${partnerVal != null ? `· ${partnerVal > 0 ? "↑" : "↓"}` : ""}`;
          html += `</div>`;
          return html;
        },
      },
      legend: {
        data: legendData,
        bottom: 0,
        textStyle: { fontSize: 11 },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "15%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: years.map(String),
        axisLabel: { fontSize: 10, interval: 0 },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: Math.max(maxShifted + 0.5, 1),
        axisLabel: {
          formatter: (v: number) => (v > 0 ? "↑" : "0"),
          fontSize: 10,
        },
        splitLine: { lineStyle: { type: "dashed", opacity: 0.3 } },
      },
      series: [
        {
          name: "나",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: myData.map((d) => d.value),
          lineStyle: { width: 2, color: "#0ea5e9" },
          itemStyle: { color: "#0ea5e9" },
          markArea:
            myRisingSections.length > 0
              ? {
                  silent: true,
                  itemStyle: { color: "rgba(14, 165, 233, 0.12)" },
                  data: myRisingSections.map((s) => [
                    { xAxis: s.start },
                    { xAxis: s.end },
                  ]),
                }
              : undefined,
        },
        {
          name: "상대방",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: partnerData.map((d) => d.value),
          lineStyle: { width: 2, color: "#ec4899" },
          itemStyle: { color: "#ec4899" },
          markArea:
            partnerRisingSections.length > 0
              ? {
                  silent: true,
                  itemStyle: { color: "rgba(236, 72, 153, 0.12)" },
                  data: partnerRisingSections.map((s) => [
                    { xAxis: s.start },
                    { xAxis: s.end },
                  ]),
                }
              : undefined,
        },
        ...(overlapPoints.length > 0
          ? [
              {
                name: "겹침",
                type: "scatter",
                symbol: "diamond",
                symbolSize: 16,
                data: overlapPoints.map((p) => p.coord),
                itemStyle: {
                  color: "#f59e0b",
                  borderColor: "#fff",
                  borderWidth: 2,
                  shadowBlur: 6,
                  shadowColor: "rgba(245,158,11,0.6)",
                },
                emphasis: {
                  scale: 1.3,
                  itemStyle: { borderWidth: 2 },
                },
                tooltip: {
                  formatter: (params: { data: [number, number] }) => {
                    const ov = overlapPoints.find(
                      (p) =>
                        p.coord[0] === params.data[0] &&
                        p.coord[1] === params.data[1]
                    );
                    return ov
                      ? `겹침: ${ov.year}년 (${ov.ganji})<br/>나·상대방 세운이 같은 기운`
                      : "";
                  },
                },
                z: 10,
              },
            ]
          : []),
      ],
    };
  }, [myFortune, partnerFortune]);

  return (
    <div className="w-full min-h-[280px]">
      <ReactECharts option={option} style={{ height: 280 }} opts={{ renderer: "canvas" }} />
    </div>
  );
};
