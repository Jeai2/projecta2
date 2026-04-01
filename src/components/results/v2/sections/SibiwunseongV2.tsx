// src/components/results/v2/sections/SibiwunseongV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle } from "lucide-react";
import {
  sibiwunseongDescriptions,
  type SibiwunseongDesc,
} from "@/data/sibiwunseongDescriptions";

const PILLAR_ORDER = [
  { key: "hour" as const, label: "시주" },
  { key: "day" as const, label: "일주" },
  { key: "month" as const, label: "월주" },
  { key: "year" as const, label: "년주" },
];

function SiwiCircle({ name }: { name: string }) {
  const desc: SibiwunseongDesc | undefined = sibiwunseongDescriptions[name];
  const rgb = desc?.bongbeopRgb ?? "156, 163, 175";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-sm"
        style={{
          borderColor: `rgba(${rgb}, 0.5)`,
          background: `rgba(${rgb}, 0.08)`,
        }}
      >
        <span
          className="text-sm font-bold leading-none"
          style={{ color: `rgba(${rgb}, 0.9)` }}
        >
          {desc?.hanja?.[0] ?? name[0]}
        </span>
      </div>
      <span className="text-[11px] font-semibold text-text-light leading-none">
        {name}
      </span>
      {desc?.keyword && (
        <span className="text-[9px] text-text-subtle leading-none tracking-wide">
          {desc.keyword}
        </span>
      )}
    </div>
  );
}

function SiwiBongbeopCard({ name }: { name: string }) {
  const desc = sibiwunseongDescriptions[name];
  if (!desc) return null;
  const rgb = desc.bongbeopRgb;

  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{
        borderColor: `rgba(${rgb}, 0.25)`,
        background: `rgba(${rgb}, 0.04)`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-xs font-bold"
          style={{ color: `rgba(${rgb}, 0.85)` }}
        >
          {name}
        </span>
        <span className="text-[10px] text-text-subtle">{desc.hanja}</span>
      </div>
      <p className="text-[13px] leading-[1.8] text-text-muted">{desc.bongbeop}</p>
    </div>
  );
}

export const SibiwunseongV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sajuData = fortuneResult?.saju?.sajuData;
  const sibiwunseongAnalysis =
    fortuneResult?.saju?.interpretation?.sibiwunseongAnalysis;

  if (!sajuData?.pillars) {
    return (
      <SectionFrame chapterNum={6} title="십이운성">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">십이운성 분석 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { pillars } = sajuData;
  const uniqueNames = [
    ...new Set(
      [...PILLAR_ORDER].reverse().map((p) => pillars[p.key].sibiwunseong).filter(Boolean),
    ),
  ];

  return (
    <SectionFrame
      chapterNum={6}
      title="십이운성"
      description="인생의 12가지 단계를 통해 타고난 에너지의 강약과 흐름을 분석합니다."
    >
      {/* 4기둥 — 십이운성 강조 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        <SajuPillarLight title="시주" data={pillars.hour} siwiMode />
        <SajuPillarLight title="일주" data={pillars.day} siwiMode />
        <SajuPillarLight title="월주" data={pillars.month} siwiMode />
        <SajuPillarLight title="년주" data={pillars.year} siwiMode />
      </div>

      {/* 운성 원형 뱃지 */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-4">
          나의 십이운성
        </h3>
        <div className="flex justify-center gap-6 sm:gap-8">
          {PILLAR_ORDER.map((p) => {
            const name = pillars[p.key].sibiwunseong;
            if (!name) return null;
            return (
              <div key={p.key} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-subtle mb-1">{p.label}</span>
                <SiwiCircle name={name} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 운성별 봉법 해석 카드 */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-3">
          운성 해석
        </h3>
        <div className="space-y-3">
          {uniqueNames.map((name) => (
            <SiwiBongbeopCard key={name} name={name} />
          ))}
        </div>
      </div>

      {/* 종합 분석 텍스트 */}
      {sibiwunseongAnalysis && (
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-3">
            종합 분석
          </h3>
          <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap">
            {sibiwunseongAnalysis}
          </p>
        </div>
      )}
    </SectionFrame>
  );
};
