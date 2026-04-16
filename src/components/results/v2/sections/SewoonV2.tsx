// src/components/results/v2/sections/SewoonV2.tsx
// Chapter 10 — 세운 분석 (세운표 + 천간·지지 작용)

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GAN_TO_OHAENG,
  JI_TO_OHAENG,
  PILLAR_KO,
  parseGanRel,
  parseJiRel,
  type ParsedRel,
} from "@/utils/sipsinParser";

// ── 오행 색상 ──────────────────────────────────────────────────────
const ohaengStyle: Record<string, { bg: string; border: string; text: string }> = {
  木: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  火: { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700"    },
  土: { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700"   },
  金: { bg: "bg-slate-100",  border: "border-slate-300",   text: "text-slate-600"   },
  水: { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700"    },
};

const ohaengPill: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

// ── 해설 텍스트 치환 헬퍼 ──────────────────────────────────────────
const GAN_KO_FULL: Record<string, string> = {
  甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토",
  己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수",
};
const GAN_HANJA_FULL: Record<string, string> = {
  甲: "甲木", 乙: "乙木", 丙: "丙火", 丁: "丁火", 戊: "戊土",
  己: "己土", 庚: "庚金", 辛: "辛金", 壬: "壬水", 癸: "癸水",
};
const LOC_HANJA: Record<string, string> = {
  년간: "年干", 월간: "月干", 일간: "日干", 시간: "時干",
};

function formatInterpText(text: string | null | undefined, pillars: any): string {
  if (!text) return "";
  return text.replace(/☆\{USER 사주원국의 ([甲乙丙丁戊己庚辛壬癸])\}/g, (match, hanja) => {
    const locs: string[] = [];
    if (pillars?.year?.gan === hanja)  locs.push("년간");
    if (pillars?.month?.gan === hanja) locs.push("월간");
    if (pillars?.day?.gan === hanja)   locs.push("일간");
    if (pillars?.hour?.gan === hanja)  locs.push("시간");
    if (locs.length === 0) return match;
    const koName = GAN_KO_FULL[hanja] ?? hanja;
    const hjName = GAN_HANJA_FULL[hanja] ?? hanja;
    return locs.map((loc) => `${loc}(${LOC_HANJA[loc]}) ${koName}(${hjName})`).join(", ");
  });
}

// ── 공통 UI 컴포넌트 ───────────────────────────────────────────────

function GanjiChar({ char, ohaeng, dimmed = false }: { char: string; ohaeng: string; dimmed?: boolean }) {
  const s = ohaengStyle[ohaeng] ?? { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" };
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-8 h-8 rounded-lg border font-myeongjo font-bold text-lg leading-none",
      dimmed ? "bg-gray-50 border-gray-100 text-gray-300" : [s.bg, s.border, s.text],
    )}>
      {char}
    </span>
  );
}

function HanjaBadge({ char, ohaeng, dimmed = false, size = "md" }: {
  char: string; ohaeng: string; dimmed?: boolean; size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg"
    ? "text-2xl px-3 py-2 min-w-[3rem]"
    : size === "sm"
      ? "text-base px-2 py-0.5 min-w-[1.75rem]"
      : "text-xl px-2.5 py-1 min-w-[2.25rem]";
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-lg border font-myeongjo font-bold leading-none",
      sizeClass,
      dimmed ? "bg-gray-100 border-gray-200 text-gray-300"
             : (ohaengPill[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-800"),
    )}>
      {char}
    </span>
  );
}

function SipsinBadge({ label, dimmed = false }: { label: string; dimmed?: boolean }) {
  return (
    <span className={cn("text-[11px] font-medium", dimmed ? "text-gray-300" : "text-text-subtle")}>
      {label}
    </span>
  );
}

function RelBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    합: "bg-blue-50 border-blue-200 text-blue-600",
    충: "bg-rose-50 border-rose-200 text-rose-500",
    형: "bg-purple-50 border-purple-200 text-purple-600",
    파: "bg-orange-50 border-orange-200 text-orange-500",
    해: "bg-yellow-50 border-yellow-200 text-yellow-600",
  };
  const key = Object.keys(styles).find((k) => type.includes(k)) ?? "";
  return (
    <span className={cn(
      "text-[11px] rounded-full px-2.5 py-0.5 border font-medium",
      styles[key] ?? "bg-gray-50 border-gray-200 text-gray-500",
    )}>
      {type}
    </span>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-5">
      {title}
    </h3>
  );
}

function EmptyNote({ text = "없음" }: { text?: string }) {
  return <p className="text-sm text-text-subtle italic mb-6">{text}</p>;
}

function RelRow({ rel, relType, dimRight = false }: { rel: ParsedRel; relType: string; dimRight?: boolean }) {
  const label1 = PILLAR_KO[rel.pillar1] ?? rel.pillar1;
  const label2 = PILLAR_KO[rel.pillar2] ?? rel.pillar2;
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char1} ohaeng={rel.ohaeng1} size="sm" />
        <SipsinBadge label={rel.sipsin1 ?? label1} />
        <span className="text-[10px] text-text-subtle">{label1}</span>
      </div>
      <RelBadge type={relType} />
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char2} ohaeng={rel.ohaeng2} dimmed={dimRight} size="sm" />
        <SipsinBadge label={rel.sipsin2 ?? label2} dimmed={dimRight} />
        <span className="text-[10px] text-text-subtle">{label2}</span>
      </div>
    </div>
  );
}

// ── 세운표 컴포넌트 ────────────────────────────────────────────────

function SewoonTable({
  sewoonList,
  currentYear,
}: {
  sewoonList: { year: number; ganji: string; sipsin: { gan: string | null; ji: string | null }; sibiwunseong: string | null }[];
  currentYear: number;
}) {
  const colCls = (isCurrent: boolean) =>
    cn("flex-1 min-w-[3rem] text-center", isCurrent && "bg-amber-50/60");

  const cellWrap = (isCurrent: boolean, isPast: boolean, py = "py-2") =>
    cn("flex flex-col items-center justify-center gap-1", py, isPast && "opacity-40");

  const sortedList = [...sewoonList].sort((a, b) => b.year - a.year);

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="min-w-fit">
        {/* 연도 행 */}
        <div className="flex border-b border-gray-100 bg-gray-50/60">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`yr-${s.year}`} className={colCls(isCurrent)}>
                <div className={cn("py-1.5 flex flex-col items-center gap-0.5", isPast && "opacity-40")}>
                  <span className={cn("text-[10px] font-semibold", isCurrent ? "text-amber-700" : "text-text-subtle")}>
                    {s.year}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] bg-amber-100 text-amber-700 border border-amber-200 rounded px-1 leading-none py-0.5">
                      올해
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 십성(간) 행 */}
        <div className="flex border-b border-gray-100">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`sg-${s.year}`} className={colCls(isCurrent)}>
                <div className={cn(cellWrap(isCurrent, isPast, "py-1.5"), isPast && "opacity-50")}>
                  <span className="text-[10px] text-text-subtle leading-none">{s.sipsin.gan ?? "—"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 천간 행 */}
        <div className="flex border-b border-gray-100">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`gan-${s.year}`} className={colCls(isCurrent)}>
                <div className={cellWrap(isCurrent, isPast, "py-2.5")}>
                  <GanjiChar char={s.ganji[0]} ohaeng={GAN_TO_OHAENG[s.ganji[0]] ?? "土"} dimmed={isPast} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 지지 행 */}
        <div className="flex border-b border-gray-100">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`ji-${s.year}`} className={colCls(isCurrent)}>
                <div className={cellWrap(isCurrent, isPast, "py-2.5")}>
                  <GanjiChar char={s.ganji[1]} ohaeng={JI_TO_OHAENG[s.ganji[1]] ?? "土"} dimmed={isPast} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 십성(지) 행 */}
        <div className="flex border-b border-gray-100">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`sj-${s.year}`} className={colCls(isCurrent)}>
                <div className={cn(cellWrap(isCurrent, isPast, "py-1.5"), isPast && "opacity-50")}>
                  <span className="text-[10px] text-text-subtle leading-none">{s.sipsin.ji ?? "—"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 십이운성 행 */}
        <div className="flex">
          {sortedList.map((s) => {
            const isCurrent = s.year === currentYear;
            const isPast = s.year < currentYear;
            return (
              <div key={`sw-${s.year}`} className={colCls(isCurrent)}>
                <div className={cn(cellWrap(isCurrent, isPast, "py-1.5"), isPast && "opacity-50")}>
                  <span className="text-[10px] text-text-subtle leading-none">{s.sibiwunseong ?? "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 현재 세운 요약 카드 ────────────────────────────────────────────

function CurrentSewoonCard({
  sewoon,
  currentYear,
  pillars,
}: {
  sewoon: { year: number; ganji: string; sipsin: { gan: string | null; ji: string | null }; sibiwunseong: string | null };
  currentYear: number;
  pillars: any;
}) {
  const ganOhaeng = GAN_TO_OHAENG[sewoon.ganji[0]] ?? "土";
  const jiOhaeng  = JI_TO_OHAENG[sewoon.ganji[1]]  ?? "土";
  const sGan = ohaengStyle[ganOhaeng] ?? { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };
  const sJi  = ohaengStyle[jiOhaeng]  ?? { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-5 mb-6">
      <div className="flex items-start gap-4">
        {/* 간지 */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <span className={cn("text-3xl font-myeongjo font-bold", sGan.text)}>
            {sewoon.ganji[0]}
          </span>
          <span className={cn("text-3xl font-myeongjo font-bold", sJi.text)}>
            {sewoon.ganji[1]}
          </span>
        </div>

        {/* 구분선 */}
        <div className="w-px self-stretch bg-amber-100 shrink-0" />

        {/* 상세 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-light">{sewoon.year}년 세운</span>
            <span className="text-xs text-text-subtle">({sewoon.ganji})</span>
          </div>
          <div className="flex gap-3 flex-wrap text-[12px] text-text-muted">
            <span>
              천간 십성:{" "}
              <span className="font-medium text-text-light">{sewoon.sipsin.gan ?? "—"}</span>
            </span>
            <span>
              지지 십성:{" "}
              <span className="font-medium text-text-light">{sewoon.sipsin.ji ?? "—"}</span>
            </span>
            <span>
              십이운성:{" "}
              <span className="font-medium text-text-light">{sewoon.sibiwunseong ?? "—"}</span>
            </span>
          </div>
          {/* 오행 배지 */}
          <div className="flex gap-2 flex-wrap mt-1">
            <span className={cn("text-[11px] rounded-md px-2 py-0.5 border font-medium", ohaengPill[ganOhaeng])}>
              {sewoon.ganji[0]} · {ganOhaeng}
            </span>
            <span className={cn("text-[11px] rounded-md px-2 py-0.5 border font-medium", ohaengPill[jiOhaeng])}>
              {sewoon.ganji[1]} · {jiOhaeng}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export const SewoonV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sajuData = fortuneResult?.saju?.sajuData;

  if (!sajuData?.currentSewoon) {
    return (
      <SectionFrame chapterNum={10} title="세운 분석">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">세운 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const {
    currentSewoon,
    currentDaewoon,
    pillars,
    sewoonForCurrentDaewoon,
    currentSewoonRelationships: sewoonRels,
    currentSewoonInterp: sewoonInterp,
  } = sajuData;

  const currentYear = new Date().getFullYear();
  const userName = fortuneResult?.userInfo?.name || "당신";

  // ── 세운+대운+원국 확장 기둥 (파서 주입) ─────────────────────────
  const daewoonPillarData = currentDaewoon
    ? {
        gan: currentDaewoon.ganji[0],
        ji:  currentDaewoon.ganji[1],
        ganOhaeng: GAN_TO_OHAENG[currentDaewoon.ganji[0]] ?? "土",
        jiOhaeng:  JI_TO_OHAENG[currentDaewoon.ganji[1]]  ?? "土",
        ganSipsin: currentDaewoon.sipsin.gan,
        jiSipsin:  currentDaewoon.sipsin.ji,
        sibiwunseong: currentDaewoon.sibiwunseong ?? "",
        sinsal: [],
      }
    : undefined;

  const sewoonPillarData = {
    gan: currentSewoon.ganji[0],
    ji:  currentSewoon.ganji[1],
    ganOhaeng: GAN_TO_OHAENG[currentSewoon.ganji[0]] ?? "土",
    jiOhaeng:  JI_TO_OHAENG[currentSewoon.ganji[1]]  ?? "土",
    ganSipsin: currentSewoon.sipsin.gan,
    jiSipsin:  currentSewoon.sipsin.ji,
    sibiwunseong: currentSewoon.sibiwunseong ?? "",
    sinsal: [],
  };

  const extPillars = {
    ...pillars,
    ...(daewoonPillarData ? { daewoon: daewoonPillarData } : {}),
    sewoon: sewoonPillarData,
  };

  // ── 관계 파싱 ────────────────────────────────────────────────────
  const PILLAR_ORDER: Record<string, number> = { year: 0, month: 1, day: 2, hour: 3, daewoon: 4, sewoon: 5 };

  const ganRels = (list: string[]) =>
    list.flatMap((s) => { const r = parseGanRel(s, extPillars); return r ? [r] : []; });

  const jiRels = (list: string[]) => {
    const rels = list.flatMap((s) => { const r = parseJiRel(s, extPillars); return r ? [r] : []; });
    return rels.sort((a, b) => {
      const aKey = Math.min(PILLAR_ORDER[a.pillar1] ?? 99, PILLAR_ORDER[a.pillar2] ?? 99);
      const bKey = Math.min(PILLAR_ORDER[b.pillar1] ?? 99, PILLAR_ORDER[b.pillar2] ?? 99);
      return aKey - bKey;
    });
  };

  const cheonganhapRels   = ganRels(sewoonRels?.cheonganhap   ?? []);
  const cheonganchungRels = ganRels(sewoonRels?.cheonganchung ?? []);
  const hasCheonganAction = cheonganhapRels.length > 0 || cheonganchungRels.length > 0;

  const samhapRels  = jiRels(sewoonRels?.samhap  ?? []);
  const banghapRels = jiRels(sewoonRels?.banghap ?? []);
  const yukchungRels = jiRels(sewoonRels?.yukchung ?? []);
  const yukhyungRels = jiRels(sewoonRels?.yukhyung ?? []);
  const yukpaRels    = jiRels(sewoonRels?.yukpa    ?? []);
  const yukaeRels    = jiRels(sewoonRels?.yukae    ?? []);
  const yukhapRels   = jiRels(sewoonRels?.yukhap   ?? []);

  const hyungChungPaHaeRels: { rel: ParsedRel; type: string }[] = [
    ...yukchungRels.map((r) => ({ rel: r, type: "충" })),
    ...yukhyungRels.map((r) => ({ rel: r, type: "형" })),
    ...yukpaRels.map((r)    => ({ rel: r, type: "파" })),
    ...yukaeRels.map((r)    => ({ rel: r, type: "해" })),
  ];

  const hasJijiAction =
    samhapRels.length > 0 ||
    banghapRels.length > 0 ||
    hyungChungPaHaeRels.length > 0 ||
    yukhapRels.length > 0;

  return (
    <SectionFrame
      chapterNum={10}
      title="세운 분석"
      description="매년 바뀌는 1년 단위의 운세 흐름을 살펴봅니다."
    >
      {/* ── 세운표 ─────────────────────────────────────────────────── */}
      {sewoonForCurrentDaewoon && sewoonForCurrentDaewoon.length > 0 ? (
        <SewoonTable sewoonList={sewoonForCurrentDaewoon} currentYear={currentYear} />
      ) : (
        <div className="mb-6 text-sm text-text-subtle italic">세운 목록 정보 없음</div>
      )}

      <p className="mt-2 mb-6 text-[11px] text-text-subtle leading-relaxed text-center">
        세운은 매년 바뀌며, 대운의 큰 흐름 위에서 그 해의 구체적인 기운을 더합니다.
      </p>

      <p className="mb-8 text-[13px] leading-[1.9] text-text-muted">
        세운(歲運)은 한 해 동안 흐르는 기운입니다. 대운이 10년의 큰 물길이라면,
        세운은 그 안에서 매년 변화하는 작은 물결과도 같습니다. 같은 대운 안에 있더라도
        세운에 따라 그 해의 삶의 질감과 방향이 달라지게 됩니다.
      </p>

      {/* ════════════════════════════════════════
          세운의 의미
      ════════════════════════════════════════ */}
      {(sewoonInterp?.ganjiInterp || sewoonInterp?.ganjiIlganInterp) && (
        <div className="mb-6">
          <SectionHeader title="세운의 의미" />
          {/* 아이콘(세로) + 해석 나란히 */}
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <HanjaBadge
                char={currentSewoon.ganji[0]}
                ohaeng={GAN_TO_OHAENG[currentSewoon.ganji[0]] ?? "土"}
                size="sm"
              />
              <HanjaBadge
                char={currentSewoon.ganji[1]}
                ohaeng={JI_TO_OHAENG[currentSewoon.ganji[1]] ?? "土"}
                size="sm"
              />
            </div>
            <div className="space-y-6">
              {sewoonInterp.ganjiInterp && (
                <p className="text-[13px] leading-[1.9] text-text-muted whitespace-pre-wrap">
                  {formatInterpText(sewoonInterp.ganjiInterp, pillars)}
                </p>
              )}
              {sewoonInterp.ganjiIlganInterp && (
                <p className="text-[13px] leading-[1.9] text-text-muted whitespace-pre-wrap">
                  {formatInterpText(sewoonInterp.ganjiIlganInterp, pillars)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 현재 세운 요약 카드 ──────────────────────────────────────── */}
      <CurrentSewoonCard
        sewoon={currentSewoon}
        currentYear={currentYear}
        pillars={pillars}
      />

      {/* ════════════════════════════════════════
          천간(天干) — 세운 작용
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <SectionHeader title="천간(天干) · 세운 작용" />

        {hasCheonganAction ? (
          <>
            <p className="text-[13px] leading-[1.9] text-text-muted mb-4">
              세운의 천간(天干)은 이 한 해 동안 {userName}이 바깥 세상과 어떤 방식으로
              부딪히고 교류하게 될지를 보여줍니다. 합(合)은 끌어당기는 인연과 변화를,
              충(沖)은 자극과 갈등, 혹은 능동적 행동을 암시합니다.
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              {cheonganhapRels.map((rel, i) => {
                const hapType = sewoonRels?.cheonganhapTypes?.[i];
                return <RelRow key={`hap${i}`} rel={rel} relType={hapType ?? "합"} />;
              })}
              {cheonganchungRels.map((rel, i) => (
                <RelRow key={`chung${i}`} rel={rel} relType="충" />
              ))}
            </div>

            {/* 천간 해설 */}
            {(() => {
              const entries: { label?: string; text: string; ilganText?: string; rel: ParsedRel }[] = [];
              cheonganhapRels.forEach((rel, i) => {
                const h = sewoonInterp?.cheonganhap[i];
                if (h) entries.push({ label: h.name, hapType: h.hapType, text: h.essence, ilganText: h.ilganEssence, rel } as any);
              });
              cheonganchungRels.forEach((rel, i) => {
                const c = sewoonInterp?.cheonganchung[i];
                if (c) entries.push({ label: c.name, text: c.essence, ilganText: c.ilganEssence, rel });
              });
              if (entries.length === 0) return null;
              return (
                <div className="space-y-3 pt-2">
                  {entries.map((e, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[13px] leading-[1.9] text-text-muted">
                        {e.label && (
                          <span className="font-semibold text-text-light">{e.label}{" — "}</span>
                        )}
                        {formatInterpText(e.text, pillars)}
                      </p>
                      {e.ilganText && (
                        <p className="text-[13px] leading-[1.9] text-text-muted">
                          {formatInterpText(e.ilganText, pillars)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <EmptyNote text="이 해의 세운 천간이 사주·대운과 합·충 관계를 이루지 않습니다." />
        )}
      </div>

      {/* ════════════════════════════════════════
          지지(地支) — 세운 작용
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <SectionHeader title="지지(地支) · 세운 작용" />

        {hasJijiAction ? (
          <>
            <p className="text-[13px] leading-[1.9] text-text-muted mb-4">
              세운의 지지(地支)는 이 한 해 동안 실제 삶의 현장에서 일어나는 사건·환경·관계의
              변화를 나타냅니다. 합(合)은 새로운 결합과 안정을, 충(沖)·형(刑)은 변동과 긴장을
              암시합니다.
            </p>

            {/* 관계 시각화 */}
            <div className="flex flex-wrap gap-4 mb-4">
              {samhapRels.map((rel, i)  => <RelRow key={`s${i}`}  rel={rel} relType="삼합" />)}
              {banghapRels.map((rel, i) => <RelRow key={`b${i}`}  rel={rel} relType="방합" />)}
              {yukhapRels.map((rel, i)  => <RelRow key={`y${i}`}  rel={rel} relType="육합" />)}
              {hyungChungPaHaeRels.map((item, i) => (
                <RelRow key={`h${i}`} rel={item.rel} relType={item.type} />
              ))}
            </div>

            {/* 지지 해설 */}
            {(() => {
              const entries: {
                label?: string;
                essence: string;
                ilganEssence?: string;
                description: string;
                effect?: string;
              }[] = [];

              samhapRels.forEach((_, i) => {
                const s = sewoonInterp?.samhap[i];
                if (s) entries.push({ label: s.name, essence: s.essence, ilganEssence: s.ilganEssence, description: s.description, effect: s.effect });
              });
              banghapRels.forEach((_, i) => {
                const b = sewoonInterp?.banghap[i];
                if (b) entries.push({ label: b.name, essence: b.essence, ilganEssence: b.ilganEssence, description: b.description, effect: b.effect });
              });
              yukhapRels.forEach((_, i) => {
                const y = sewoonInterp?.yukhap[i];
                if (y) entries.push({ label: y.name, essence: y.essence, ilganEssence: y.ilganEssence, description: y.description, effect: y.effect });
              });

              const interpByType = {
                충: sewoonInterp?.yukchung ?? [],
                형: sewoonInterp?.yukhyung ?? [],
                파: sewoonInterp?.yukpa    ?? [],
                해: sewoonInterp?.yukae    ?? [],
              } as Record<string, NonNullable<typeof sewoonInterp>["yukchung"]>;

              const counters: Record<string, number> = { 충: 0, 형: 0, 파: 0, 해: 0 };
              hyungChungPaHaeRels.forEach((item) => {
                const type = item.type;
                const idx = counters[type] ?? 0;
                const j = interpByType[type]?.[idx];
                if (j) entries.push({ label: j.name, essence: j.essence, ilganEssence: j.ilganEssence, description: j.description, effect: j.effect });
                counters[type] = idx + 1;
              });

              if (entries.length === 0) return null;
              return (
                <div className="space-y-4 mb-2">
                  {entries.map((e, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-[13px] leading-[1.9] text-text-muted">
                        {e.label && (
                          <span className="font-semibold text-text-light">{e.label}{" — "}</span>
                        )}
                        {formatInterpText(e.essence, pillars)}
                      </p>
                      {e.ilganEssence && (
                        <p className="text-[13px] leading-[1.9] text-text-muted">
                          {formatInterpText(e.ilganEssence, pillars)}
                        </p>
                      )}
                      {e.description && (
                        <p className="text-[13px] leading-[1.9] text-text-muted">
                          {formatInterpText(e.description, pillars)}
                        </p>
                      )}
                      {e.effect && (
                        <p className="text-[13px] leading-[1.9] text-text-muted">
                          {formatInterpText(e.effect, pillars)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <EmptyNote text="이 해의 세운 지지가 사주·대운과 특별한 관계를 이루지 않습니다." />
        )}
      </div>
    </SectionFrame>
  );
};
