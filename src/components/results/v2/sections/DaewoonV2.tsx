// src/components/results/v2/sections/DaewoonV2.tsx
// Chapter 09 — 대운 분석 (대운표 + 해설)

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Daewoon } from "@/types/fortune";
import {
  GAN_TO_OHAENG,
  JI_TO_OHAENG,
  PILLAR_KO,
  GAN_HANGUL_TO_HANJA,
  parseGanRel,
  parseJiRel,
  type ParsedRel,
} from "@/utils/sipsinParser";

// ── 오행 색상 (대운표용) ──────────────────────────────────────────
const ohaengStyle: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  木: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  火: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  土: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  金: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-600",
  },
  水: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
};

// 오행 색상 (해설 배지용)
const ohaengPill: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

// ── 투간/방합삼합 조건 계산용 ──────────────────────────────────────

/** 지장간 한자 목록 (월지 투간 체크용) */
const JIJANGGAN_HJ: Record<string, string[]> = {
  子: ["壬", "癸"],
  丑: ["癸", "辛", "己"],
  寅: ["戊", "丙", "甲"],
  卯: ["甲", "乙"],
  辰: ["乙", "癸", "戊"],
  巳: ["戊", "庚", "丙"],
  午: ["丙", "己", "丁"],
  未: ["丁", "乙", "己"],
  申: ["戊", "壬", "庚"],
  酉: ["庚", "辛"],
  戌: ["辛", "丁", "戊"],
  亥: ["戊", "甲", "壬"],
};

/** 삼합화 결과 오행 */
const SAMHAP_RESULT_OHAENG: Record<string, string> = {
  寅: "火", 午: "火", 戌: "火",
  亥: "木", 卯: "木", 未: "木",
  巳: "金", 酉: "金", 丑: "金",
  申: "水", 子: "水", 辰: "水",
};

/** 방합화 결과 오행 */
const BANGHAP_RESULT_OHAENG: Record<string, string> = {
  寅: "木", 卯: "木", 辰: "木",
  巳: "火", 午: "火", 未: "火",
  申: "金", 酉: "金", 戌: "金",
  亥: "水", 子: "水", 丑: "水",
};

/** 60갑자 대운 이미지 맵 — 파일명만 채워넣으면 됩니다 (public/ 기준) */
const DAEWOON_GANJI_IMAGE: Record<string, string> = {
  甲子: "", 乙丑: "", 丙寅: "", 丁卯: "", 戊辰: "",
  己巳: "", 庚午: "", 辛未: "", 壬申: "", 癸酉: "",
  甲戌: "", 乙亥: "", 丙子: "", 丁丑: "", 戊寅: "",
  己卯: "", 庚辰: "", 辛巳: "", 壬午: "", 癸未: "",
  甲申: "", 乙酉: "", 丙戌: "", 丁亥: "", 戊子: "",
  己丑: "", 庚寅: "", 辛卯: "", 壬辰: "", 癸巳: "",
  甲午: "", 乙未: "28.png", 丙申: "", 丁酉: "", 戊戌: "",
  己亥: "", 庚子: "", 辛丑: "", 壬寅: "", 癸卯: "",
  甲辰: "", 乙巳: "", 丙午: "", 丁未: "", 戊申: "",
  己酉: "", 庚戌: "", 辛亥: "", 壬子: "", 癸丑: "",
  甲寅: "", 乙卯: "", 丙辰: "", 丁巳: "", 戊午: "",
  己未: "", 庚申: "", 辛酉: "", 壬戌: "", 癸亥: "",
};

// ── 해설 텍스트 변환 헬퍼 (사주 원국 치환 등) ────────────────────────
const GAN_KO_FULL: Record<string, string> = {
  甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토",
  己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수"
};
const GAN_HANJA_FULL: Record<string, string> = {
  甲: "甲木", 乙: "乙木", 丙: "丙火", 丁: "丁火", 戊: "戊土",
  己: "己土", 庚: "庚金", 辛: "辛金", 壬: "壬水", 癸: "癸水"
};
const LOC_HANJA: Record<string, string> = {
  년간: "年干", 월간: "月干", 일간: "日干", 시간: "時干",
};

function formatInterpText(text: string | null | undefined, pillars: any): string {
  if (!text) return "";
  return text.replace(/☆\{USER 사주원국의 ([甲乙丙丁戊己庚辛壬癸])\}/g, (match, hanja) => {
    const locs: string[] = [];
    if (pillars?.year?.gan === hanja) locs.push("년간");
    if (pillars?.month?.gan === hanja) locs.push("월간");
    if (pillars?.day?.gan === hanja) locs.push("일간");
    if (pillars?.hour?.gan === hanja) locs.push("시간");

    if (locs.length === 0) return match;

    const koName = GAN_KO_FULL[hanja] ?? hanja;
    const hjName = GAN_HANJA_FULL[hanja] ?? hanja;
    return locs.map((loc) => `${loc}(${LOC_HANJA[loc]}) ${koName}(${hjName})`).join(", ");
  });
}

// ── 대운표 전용 컴포넌트 ─────────────────────────────────────────

function GanjiChar({
  char,
  ohaeng,
  dimmed = false,
}: {
  char: string;
  ohaeng: string;
  dimmed?: boolean;
}) {
  const s = ohaengStyle[ohaeng] ?? {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-lg border font-myeongjo font-bold text-lg leading-none transition-opacity",
        dimmed
          ? "bg-gray-50 border-gray-100 text-gray-300"
          : [s.bg, s.border, s.text],
      )}
    >
      {char}
    </span>
  );
}

// ── 해설 섹션 공통 컴포넌트 (SipsinV2와 동일) ──────────────────

function HanjaBadge({
  char,
  ohaeng,
  dimmed = false,
  size = "md",
}: {
  char: string;
  ohaeng: string;
  dimmed?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "text-2xl px-3 py-2 min-w-[3rem]"
      : size === "sm"
        ? "text-base px-2 py-0.5 min-w-[1.75rem]"
        : "text-xl px-2.5 py-1 min-w-[2.25rem]";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-myeongjo font-bold leading-none",
        sizeClass,
        dimmed
          ? "bg-gray-100 border-gray-200 text-gray-300"
          : (ohaengPill[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-800"),
      )}
    >
      {char}
    </span>
  );
}

function SipsinBadge({
  label,
  dimmed = false,
}: {
  label: string;
  dimmed?: boolean;
}) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium",
        dimmed ? "text-gray-300" : "text-text-subtle",
      )}
    >
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
    <span
      className={cn(
        "text-[11px] rounded-full px-2.5 py-0.5 border font-medium",
        styles[key] ?? "bg-gray-50 border-gray-200 text-gray-500",
      )}
    >
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

function RelRow({
  rel,
  relType,
  dimRight = false,
}: {
  rel: ParsedRel;
  relType: string;
  dimRight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char1} ohaeng={rel.ohaeng1} />
        {rel.sipsin1 && <SipsinBadge label={rel.sipsin1} />}
        <span className="text-[10px] text-text-subtle">
          {PILLAR_KO[rel.pillar1]}
        </span>
      </div>
      <RelBadge type={relType} />
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char2} ohaeng={rel.ohaeng2} dimmed={dimRight} />
        {rel.sipsin2 && <SipsinBadge label={rel.sipsin2} dimmed={dimRight} />}
        <span className="text-[10px] text-text-subtle">
          {PILLAR_KO[rel.pillar2]}
        </span>
      </div>
    </div>
  );
}

// ── 현재 대운 요약 카드 ──────────────────────────────────────────

function CurrentDaewoonCard({
  daeun,
  currentYear,
  pillars,
}: {
  daeun: Daewoon;
  currentYear: number;
  pillars: {
    year: import("@/types/fortune").PillarData;
    month: import("@/types/fortune").PillarData;
    day: import("@/types/fortune").PillarData;
    hour: import("@/types/fortune").PillarData;
  };
}) {
  const gan = daeun.ganji[0];
  const ji = daeun.ganji[1];
  const ganOhaeng = GAN_TO_OHAENG[gan] ?? "土";
  const jiOhaeng = JI_TO_OHAENG[ji] ?? "土";

  const pillarList = [
    { label: "시주", data: pillars.hour },
    { label: "일주", data: pillars.day },
    { label: "월주", data: pillars.month },
    { label: "년주", data: pillars.year },
  ] as const;

  return (
    <div className="rounded-2xl border border-accent-gold/30 bg-gradient-to-br from-amber-50/60 to-white p-5 mb-8">
      {/* 사주팔자 4기둥 + 대운 한 행 */}
      <div className="flex gap-1 mb-3">
        {/* 대운 기둥 */}
        <div className="flex-1 flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white/70 py-2.5">
          <span className="text-[9px] text-accent-gold font-semibold">대운</span>
          <GanjiChar char={gan} ohaeng={ganOhaeng} />
          <GanjiChar char={ji} ohaeng={jiOhaeng} />
        </div>
        {/* 구분선 */}
        <div className="w-px bg-amber-200 mx-0.5 self-stretch" />
        {pillarList.map(({ label, data }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-white/70 py-2.5"
          >
            <span className="text-[9px] text-text-subtle">{label}</span>
            <GanjiChar char={data.gan} ohaeng={data.ganOhaeng} />
            <GanjiChar char={data.ji} ohaeng={data.jiOhaeng} />
          </div>
        ))}
      </div>

    </div>
  );
}

// ── 대운표 ───────────────────────────────────────────────────────

function DaewoonTable({
  daewoonFull,
  activeDaeun,
  currentYear,
}: {
  daewoonFull: Daewoon[];
  activeDaeun: Daewoon | null;
  currentYear: number;
}) {
  const cols = [...daewoonFull].reverse();

  const colStyle = (d: Daewoon) => ({
    isCurrent: activeDaeun?.year === d.year,
    isPast: currentYear >= d.year + 10,
  });

  const cellWrap = (isCurrent: boolean, isPast: boolean, extraCls = "") =>
    cn(
      "flex items-center justify-center",
      isCurrent ? "bg-amber-50/70" : isPast ? "bg-gray-50/40" : "bg-white",
      extraCls,
    );

  const colCls = (isCurrent: boolean) =>
    cn(
      "flex-1 text-center border-l border-gray-100 first:border-l-0",
      isCurrent && "border-l-amber-200 border-r border-r-amber-200",
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-text-subtle">← 미래</span>
        <span className="text-[10px] text-accent-gold tracking-widest uppercase font-semibold">
          전체 대운표
        </span>
        <span className="text-[10px] text-text-subtle">과거 →</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <div className="min-w-[480px]">
          {/* 나이 행 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`age-${d.year}`} className={colCls(isCurrent)}>
                  <div
                    className={cn(
                      cellWrap(isCurrent, isPast, "flex-col gap-0 py-2"),
                      isPast && "opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-semibold leading-none",
                        isCurrent ? "text-accent-gold" : "text-text-muted",
                      )}
                    >
                      {d.age}
                    </span>
                    <span className="text-[9px] text-text-subtle leading-none">
                      –{d.age + 9}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 현재 표시줄 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent } = colStyle(d);
              return (
                <div
                  key={`ind-${d.year}`}
                  className={cn(
                    "flex-1 flex items-center justify-center py-1",
                    isCurrent ? "bg-amber-50/70" : "bg-gray-50/30",
                  )}
                >
                  {isCurrent && (
                    <span className="text-[9px] font-bold text-accent-gold tracking-wide">
                      현재
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 십신(간) 행 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`sg-${d.year}`} className={colCls(isCurrent)}>
                  <div
                    className={cn(
                      cellWrap(isCurrent, isPast, "py-1.5"),
                      isPast && "opacity-50",
                    )}
                  >
                    <span className="text-[10px] text-text-muted leading-none">
                      {d.sipsin.gan ?? "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 천간 행 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`gan-${d.year}`} className={colCls(isCurrent)}>
                  <div className={cellWrap(isCurrent, isPast, "py-2.5")}>
                    <GanjiChar
                      char={d.ganji[0]}
                      ohaeng={GAN_TO_OHAENG[d.ganji[0]] ?? "土"}
                      dimmed={isPast}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 지지 행 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`ji-${d.year}`} className={colCls(isCurrent)}>
                  <div className={cellWrap(isCurrent, isPast, "py-2.5")}>
                    <GanjiChar
                      char={d.ganji[1]}
                      ohaeng={JI_TO_OHAENG[d.ganji[1]] ?? "土"}
                      dimmed={isPast}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 십신(지) 행 */}
          <div className="flex border-b border-gray-100">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`sj-${d.year}`} className={colCls(isCurrent)}>
                  <div
                    className={cn(
                      cellWrap(isCurrent, isPast, "py-1.5"),
                      isPast && "opacity-50",
                    )}
                  >
                    <span className="text-[10px] text-text-subtle leading-none">
                      {d.sipsin.ji ?? "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 십이운성 행 */}
          <div className="flex">
            {cols.map((d) => {
              const { isCurrent, isPast } = colStyle(d);
              return (
                <div key={`sw-${d.year}`} className={colCls(isCurrent)}>
                  <div
                    className={cn(
                      cellWrap(isCurrent, isPast, "py-1.5"),
                      isPast && "opacity-50",
                    )}
                  >
                    <span className="text-[10px] text-text-subtle leading-none">
                      {d.sibiwunseong ?? "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export const DaewoonV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const sajuData = fortuneResult?.saju?.sajuData;

  if (!sajuData?.daewoonFull?.length) {
    return (
      <SectionFrame chapterNum={9} title="대운 분석">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">대운 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const {
    daewoonFull,
    currentDaewoon,
    pillars,
    gyeokguk,
    wangseStrength,
    sipsinV2Interpretation: interp,
    currentDaewoonRelationships: daewoonRels,
    currentDaewoonInterp: daewoonInterp,
  } = sajuData;
  const currentYear = new Date().getFullYear();

  const activeDaeun =
    currentDaewoon ??
    daewoonFull.find(
      (d) => currentYear >= d.year && currentYear < d.year + 10,
    ) ??
    null;

  const userName = fortuneResult?.userInfo?.name || "당신";

  // ── 격국 유지/변화 조건 계산 ──────────────────────────────────
  const daewoonGan = activeDaeun?.ganji?.[0] ?? "";
  const daewoonJi = activeDaeun?.ganji?.[1] ?? "";
  const monthJi = pillars?.month?.ji ?? "";

  // 조건①: 월지 지장간 중 대운 천간 투간 여부
  const isTugan = daewoonGan !== "" && (JIJANGGAN_HJ[monthJi] ?? []).includes(daewoonGan);

  // 조건②: 방합·삼합 결과 오행 == 대운 천간 오행
  const daewoonGanOhaeng = GAN_TO_OHAENG[daewoonGan] ?? "";
  const hasSamhap = (daewoonRels?.samhap?.length ?? 0) > 0;
  const hasBanghap = (daewoonRels?.banghap?.length ?? 0) > 0;
  const hapOhaeng =
    (hasSamhap && SAMHAP_RESULT_OHAENG[daewoonJi]) ? SAMHAP_RESULT_OHAENG[daewoonJi] :
      (hasBanghap && BANGHAP_RESULT_OHAENG[daewoonJi]) ? BANGHAP_RESULT_OHAENG[daewoonJi] :
        "";
  const isSameOhaeng = hapOhaeng !== "" && hapOhaeng === daewoonGanOhaeng;

  // 조건③: 방합·삼합 결과 오행 == 사주 내 천간(일간 제외) 오행
  const matchingSajuGanForHap = hapOhaeng !== ""
    ? [
      { gan: pillars.year.gan, sipsin: pillars.year.ganSipsin },
      { gan: pillars.month.gan, sipsin: pillars.month.ganSipsin },
      { gan: pillars.hour.gan, sipsin: pillars.hour.ganSipsin },
    ].find(g => g.gan && GAN_TO_OHAENG[g.gan] === hapOhaeng)
    : undefined;
  const isSajuGanMatch = !!matchingSajuGanForHap;

  const isGyeokChanged = isTugan || isSameOhaeng || isSajuGanMatch;

  // ── 변화된 격 이름 계산 ──
  let changedGyeokSipsin = "";
  if (isTugan || isSameOhaeng) {
    // 조건①②: 대운 천간의 십신
    changedGyeokSipsin = activeDaeun?.sipsin?.gan ?? "";
  } else if (isSajuGanMatch && matchingSajuGanForHap) {
    // 조건③: 매칭된 사주 천간의 십신
    changedGyeokSipsin = matchingSajuGanForHap.sipsin ?? "";
  }
  const changedGyeokName = changedGyeokSipsin ? changedGyeokSipsin + "격" : "";
  const firstDaeun = daewoonFull[0];
  const strengthType =
    (sajuData.yongsin?.selectedTier?.details?.strengthType as string) || "";
  const favorableDirection =
    strengthType === "신강"
      ? "식상/재성/관성"
      : strengthType === "신약"
        ? "인성/비겁"
        : "";

  const BANGHAP_GROUP_TOP: Record<string, string> = {
    寅: "木",
    卯: "木",
    辰: "木",
    巳: "火",
    午: "火",
    未: "火",
    申: "金",
    酉: "金",
    戌: "金",
    亥: "水",
    子: "水",
    丑: "水",
  };
  const OHAENG_SIPSIN_TOP: Record<string, Record<string, string>> = {
    木: { 木: "비겁", 火: "식상", 土: "재성", 金: "관성", 水: "인성" },
    火: { 火: "비겁", 土: "식상", 金: "재성", 水: "관성", 木: "인성" },
    土: { 土: "비겁", 金: "식상", 水: "재성", 木: "관성", 火: "인성" },
    金: { 金: "비겁", 水: "식상", 木: "재성", 火: "관성", 土: "인성" },
    水: { 水: "비겁", 木: "식상", 火: "재성", 土: "관성", 金: "인성" },
  };
  const dayOhaengTop = GAN_TO_OHAENG[pillars.day.gan] ?? "土";
  const currentJi = activeDaeun?.ganji[1] ?? "";
  const currentBangOhaeng = BANGHAP_GROUP_TOP[currentJi] ?? "";
  const currentSipsinCategory =
    OHAENG_SIPSIN_TOP[dayOhaengTop]?.[currentBangOhaeng] ?? "";
  const YURI_SINGANG = ["식상", "재성", "관성"];
  const YURI_SINYAK = ["인성", "비겁"];
  const currentIsYuri =
    strengthType === "신강"
      ? YURI_SINGANG.includes(currentSipsinCategory)
      : strengthType === "신약"
        ? YURI_SINYAK.includes(currentSipsinCategory)
        : null;

  // ── 대운 가상 기둥 데이터 (파서에 daewoon 키로 주입) ─────────────
  const daewoonPillarData = activeDaeun
    ? {
      gan: activeDaeun.ganji[0],
      ji: activeDaeun.ganji[1],
      ganOhaeng: GAN_TO_OHAENG[activeDaeun.ganji[0]] ?? "土",
      jiOhaeng: JI_TO_OHAENG[activeDaeun.ganji[1]] ?? "土",
      ganSipsin: activeDaeun.sipsin.gan,
      jiSipsin: activeDaeun.sipsin.ji,
      sibiwunseong: activeDaeun.sibiwunseong ?? "",
      sinsal: [],
    }
    : undefined;
  const extPillars = {
    ...pillars,
    ...(daewoonPillarData ? { daewoon: daewoonPillarData } : {}),
  };

  // ── 대운-원국 관계 파싱 ──────────────────────────────────────────
  const PILLAR_ORDER: Record<string, number> = { year: 0, month: 1, day: 2, hour: 3, daewoon: 4 };
  const ganRels = (list: string[]) =>
    list.flatMap((s) => {
      const r = parseGanRel(s, extPillars);
      return r ? [r] : [];
    });
  const jiRels = (list: string[]) => {
    const rels = list.flatMap((s) => {
      const r = parseJiRel(s, extPillars);
      return r ? [r] : [];
    });
    return rels.sort((a, b) => {
      const aKey = Math.min(PILLAR_ORDER[a.pillar1] ?? 99, PILLAR_ORDER[a.pillar2] ?? 99);
      const bKey = Math.min(PILLAR_ORDER[b.pillar1] ?? 99, PILLAR_ORDER[b.pillar2] ?? 99);
      return aKey - bKey;
    });
  };

  const cheonganhapRels = ganRels(daewoonRels?.cheonganhap ?? []);
  const cheonganchungRels = ganRels(daewoonRels?.cheonganchung ?? []);
  const hasCheonganAction =
    cheonganhapRels.length > 0 || cheonganchungRels.length > 0;
  const samhapRels = jiRels(daewoonRels?.samhap ?? []);
  const banghapRels = jiRels(daewoonRels?.banghap ?? []);
  const yukchungRels = jiRels(daewoonRels?.yukchung ?? []);
  const yukhyungRels = jiRels(daewoonRels?.yukhyung ?? []);
  const yukpaRels = jiRels(daewoonRels?.yukpa ?? []);
  const yukaeRels = jiRels(daewoonRels?.yukae ?? []);
  const yukhapRels = jiRels(daewoonRels?.yukhap ?? []);

  const hyungChungPaHaeRels: {
    rel: ParsedRel;
    type: string;
    dimRight: boolean;
  }[] = [
      ...yukchungRels.map((r) => ({ rel: r, type: "충", dimRight: false })),
      ...yukhyungRels.map((r) => ({ rel: r, type: "형", dimRight: false })),
      ...yukpaRels.map((r) => ({ rel: r, type: "파", dimRight: false })),
      ...yukaeRels.map((r) => ({ rel: r, type: "해", dimRight: false })),
    ];

  return (
    <SectionFrame
      chapterNum={9}
      title="대운 분석"
      description="10년 단위로 흐르는 운명의 큰 물결을 살펴봅니다."
    >
      {/* 전체 대운표 */}
      <DaewoonTable
        daewoonFull={daewoonFull}
        activeDaeun={activeDaeun}
        currentYear={currentYear}
      />

      <p className="mt-5 mb-6 text-[11px] text-text-subtle leading-relaxed text-center">
        대운은 약 10년 주기로 바뀌며, 나만의 계절을 만들어가는 삶의 큰 흐름과 방향성에 영향을 줍니다.
      </p>

      {/* ── 대운표-해설 사이 설명글 ── 직접 수정 가능 ─────────────── */}
      <p className="mb-10 text-[13px] leading-[1.9] text-text-muted">
        운(運)이란, 기운의 흐름을 이야기합니다. 그 기운이 어느 시점에서 어떻게
        본인에게 작용하고 있는 지 한 번 보려고 합니다. 운(運)과의 관계와 그
        기운으로 인해서 본인이 세상을 어떠한 시각으로 바라보게 될 것인지, 어떠한
        사건과 환경으로 인하여, 어떤 행동을 취하게 될 것인지 파악해봅니다.
      </p>

      {/* ── 대운 지지 나열표 (방합 그룹 박스) ──────────────────────────── */}
      {(() => {
        // 방합 그룹 정의
        const BANGHAP_GROUP: Record<string, string> = {
          寅: "木",
          卯: "木",
          辰: "木",
          巳: "火",
          午: "火",
          未: "火",
          申: "金",
          酉: "金",
          戌: "金",
          亥: "水",
          子: "水",
          丑: "水",
        };
        const GROUP_BORDER: Record<string, string> = {
          木: "border-emerald-300",
          火: "border-rose-300",
          金: "border-slate-300",
          水: "border-blue-300",
          土: "border-amber-300",
        };
        // 연속 방합 그룹으로 묶기
        const cols = [...daewoonFull].reverse();
        const groups: { items: typeof cols; groupOhaeng: string }[] = [];
        for (const d of cols) {
          const groupOhaeng = BANGHAP_GROUP[d.ganji[1]] ?? "土";
          const last = groups[groups.length - 1];
          if (last && last.groupOhaeng === groupOhaeng) {
            last.items.push(d);
          } else {
            groups.push({ items: [d], groupOhaeng });
          }
        }

        const GROUP_KO: Record<string, string> = {
          木: "목",
          火: "화",
          金: "금",
          水: "수",
          土: "토",
        };
        const GROUP_TEXT_COLOR: Record<string, string> = {
          木: "text-emerald-600",
          火: "text-rose-500",
          金: "text-slate-500",
          水: "text-blue-500",
          土: "text-amber-500",
        };

        // 신강/신약 판별
        const wangseLevel = wangseStrength?.level ?? "";
        const isSingang = wangseLevel === "신강" || wangseLevel === "강";
        const isSinyak = wangseLevel === "신약" || wangseLevel === "약";

        // 일간 오행 기준 방합 오행 → 십성 카테고리
        const OHAENG_SIPSIN: Record<string, Record<string, string>> = {
          木: { 木: "비겁", 火: "식상", 土: "재성", 金: "관성", 水: "인성" },
          火: { 火: "비겁", 土: "식상", 金: "재성", 水: "관성", 木: "인성" },
          土: { 土: "비겁", 金: "식상", 水: "재성", 木: "관성", 火: "인성" },
          金: { 金: "비겁", 水: "식상", 木: "재성", 火: "관성", 土: "인성" },
          水: { 水: "비겁", 木: "식상", 火: "재성", 土: "관성", 金: "인성" },
        };
        const dayOhaeng = GAN_TO_OHAENG[pillars.day.gan] ?? "土";

        return (
          <div className="mb-8 overflow-x-auto">
            <div className="flex justify-center">
              <div className="flex gap-1.5 flex-wrap justify-center">
                {groups.map((group, gi) => (
                  <div
                    key={gi}
                    className={cn(
                      "flex rounded-lg border-2 overflow-hidden",
                      GROUP_BORDER[group.groupOhaeng],
                    )}
                  >
                    {group.items.map((d, di) => {
                      const ji = d.ganji[1];
                      const s = ohaengStyle[JI_TO_OHAENG[ji] ?? "土"] ?? {
                        text: "text-gray-500",
                      };
                      const isPast = currentYear >= d.year + 10;
                      return (
                        <div
                          key={d.year}
                          className={cn(
                            "flex flex-col items-center py-3 px-3 gap-1.5 min-w-[3rem] bg-white",
                            di < group.items.length - 1 &&
                            "border-r border-gray-100",
                          )}
                        >
                          <span className="text-[9px] font-medium text-text-subtle">
                            {d.age}세
                          </span>
                          <span
                            className={cn(
                              "font-myeongjo font-bold text-xl leading-none",
                              isPast ? "text-gray-200" : s.text,
                            )}
                          >
                            {ji}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* 오행 흐름 표기 */}
            <div className="flex justify-center items-center gap-1 mt-3">
              {groups.map((group, gi) => (
                <span key={gi} className="flex items-center gap-1">
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1">
                      {(() => {
                        const sipsin =
                          OHAENG_SIPSIN[dayOhaeng]?.[group.groupOhaeng];
                        const favorable = ["식상", "재성", "관성"].includes(
                          sipsin ?? "",
                        );
                        const unfavorable = ["인성", "비겁"].includes(
                          sipsin ?? "",
                        );
                        const isYuri =
                          (isSingang && favorable) || (isSinyak && unfavorable);
                        const isBulli =
                          (isSingang && unfavorable) || (isSinyak && favorable);
                        if (!isYuri && !isBulli) return null;
                        return (
                          <span
                            className={cn(
                              "text-[9px] font-semibold rounded px-1 py-0.5 leading-none",
                              isYuri
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-rose-50 text-rose-500 border border-rose-200",
                            )}
                          >
                            {isYuri ? "유리" : "불리"}
                          </span>
                        );
                      })()}
                      <span
                        className={cn(
                          "text-[12px] font-semibold font-sans",
                          GROUP_TEXT_COLOR[group.groupOhaeng],
                        )}
                      >
                        {GROUP_KO[group.groupOhaeng]}({group.groupOhaeng})
                      </span>
                    </span>
                    <span className="text-[10px] text-text-subtle">
                      {OHAENG_SIPSIN[dayOhaeng]?.[group.groupOhaeng] ?? ""}
                    </span>
                  </span>
                  {gi < groups.length - 1 && (
                    <span className="text-[11px] text-text-subtle mb-3">←</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      <p className="mt-5 mb-8 text-[13px] leading-[1.9] text-text-muted">
        대운(大運)이란, 내가 태어난 계절인 월지(月支)에서 출발하여, 삶 속에서 순차적으로 만나게 되는 내 삶의 공간을 체워주는 계절들입니다. {userName}의 대운(大運)은 {firstDaeun.year}년(만 {firstDaeun.age}세)을
        시작으로 10년마다 변화하며, 변화하는 시기마다 성격과 가치관 그리고 주변환경에 큰 영향을 주지만 그것은 '나'를 만드는 과정입니다.
        {strengthType && favorableDirection && (
          <>
            {" "}
            {userName}은(는) {strengthType}한 사주(四柱)로써{" "}
            {favorableDirection} 방(方)으로 흐르는 것이 유리합니다.
          </>
        )}
        {currentSipsinCategory && currentIsYuri !== null && (
          <>
            {" "}
            현재의 시점에서 {currentSipsinCategory} 방(方)으로 흐르기에{" "}
            {currentIsYuri ? "유리" : "불리"}합니다.
          </>
        )}
      </p>

      {/* ════════════════════════════════════════
          대운의 의미
      ════════════════════════════════════════ */}
      {(interp?.daewoonGanjiInterp || interp?.daewoonGanjiIlganInterp) && activeDaeun && (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <SectionHeader title="대운의 의미" />
          {/* 이미지 풀폭 */}
          {DAEWOON_GANJI_IMAGE[activeDaeun.ganji] && (
            <img
              src={`/${DAEWOON_GANJI_IMAGE[activeDaeun.ganji]}`}
              alt={`${activeDaeun.ganji} 대운`}
              className="w-full h-40 rounded-xl object-cover border border-gray-100 mb-4"
            />
          )}
          {/* 아이콘(세로) + 해석 나란히 */}
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <HanjaBadge
                char={activeDaeun.ganji[0]}
                ohaeng={GAN_TO_OHAENG[activeDaeun.ganji[0]] ?? "土"}
                size="sm"
              />
              <HanjaBadge
                char={activeDaeun.ganji[1]}
                ohaeng={JI_TO_OHAENG[activeDaeun.ganji[1]] ?? "土"}
                size="sm"
              />
            </div>
            <div className="space-y-6">
              {interp.daewoonGanjiInterp && (
                <p className="text-[13px] leading-[1.9] text-text-muted whitespace-pre-wrap">
                  {formatInterpText(interp.daewoonGanjiInterp, pillars)}
                </p>
              )}
              {interp.daewoonGanjiIlganInterp && (
                <p className="text-[13px] leading-[1.9] text-text-muted whitespace-pre-wrap">
                  {formatInterpText(interp.daewoonGanjiIlganInterp, pillars)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 현재 대운 요약 */}
      {activeDaeun && (
        <CurrentDaewoonCard
          daeun={activeDaeun}
          currentYear={currentYear}
          pillars={pillars}
        />
      )}

      {/* 현재 대운 해설 */}
      <p className="mb-3 text-[13px] leading-[1.9] text-text-muted">
        그러나 대운의 흐름은 유불리의 기준만으로 단정할 수 없으며, 실제 작용은
        보다 구체적인 구조 속에서 나타납니다. 이제 이 시기의 대운이 사주 원국과
        만나 삶에 어떤 변화를 만들어내는지 살펴보겠습니다. 다음은 대운이 내
        사주(四柱)에 어떤 모양인지를 격(格)으로 판단해봅니다.
      </p>

      {/* ════════════════════════════════════════
          격국(格局)
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <SectionHeader title="대운의 격국(格局)" />

        {/* ── 格局 아이콘 체인 ── */}
        {(() => {
          const jj = JIJANGGAN_HJ[monthJi] ?? [];
          const getRoleLabel = (idx: number): string => {
            if (jj.length === 2) return idx === 0 ? "초기" : "정기";
            return (["초기", "중기", "정기"])[idx] ?? "정기";
          };
          const OHAENG_KO: Record<string, string> = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };

          // Arrow helper — 라벨(+옵셔널 배지)이 화살표 위에 absolute로 올라탐
          const Arrow = ({ label, icon }: { label: string; icon?: { char: string; ohaeng: string } }) => (
            <div className="relative self-center mx-2 pt-7">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap">
                <span className="text-[11px] text-text-subtle leading-none">{label}</span>
                {icon && (
                  <span className={cn(
                    "inline-flex items-center justify-center rounded px-1.5 py-px border font-myeongjo font-bold text-[11px] leading-none",
                    ohaengPill[icon.ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-700",
                  )}>
                    {icon.char}
                  </span>
                )}
              </span>
              <span className="text-text-subtle text-base leading-none">→</span>
            </div>
          );

          // 格 유지: 월지 → 格 십신에 해당하는 원국 천간 (직접 계산)
          if (!isGyeokChanged) {
            const baseSipsin = gyeokguk?.gyeokguk?.baseSipsin;
            if (!baseSipsin) return null;

            // 년/월/시간 중 格의 십신이고 월지 지장간에 포함된 천간 찾기
            const matched = [
              { gan: pillars.year.gan, sipsin: pillars.year.ganSipsin, label: "년간" },
              { gan: pillars.month.gan, sipsin: pillars.month.ganSipsin, label: "월간" },
              { gan: pillars.hour.gan, sipsin: pillars.hour.ganSipsin, label: "시간" },
            ].find(c => c.sipsin === baseSipsin && jj.includes(c.gan));

            // fallback: saRyeongGan
            const saRyeongHanja = gyeokguk?.saRyeongGan
              ? (GAN_HANGUL_TO_HANJA[gyeokguk.saRyeongGan] ?? gyeokguk.saRyeongGan)
              : null;

            const displayGan = matched?.gan ?? saRyeongHanja;
            if (!displayGan) return null;

            const displayOhaeng = GAN_TO_OHAENG[displayGan] ?? "土";
            const displayLabel = matched?.label ?? "지장간";
            const displayIdx = jj.indexOf(displayGan);
            const displayRole = displayIdx !== -1 ? getRoleLabel(displayIdx) : "지장간";

            // 格 유지: 각 요소의 sipsin 계산
            const monthJiSipsin = pillars.month.jiSipsin ?? "";
            const displayGanSipsin =
              matched?.label === "년간" ? (pillars.year.ganSipsin ?? "") :
                matched?.label === "월간" ? (pillars.month.ganSipsin ?? "") :
                  matched?.label === "시간" ? (pillars.hour.ganSipsin ?? "") : "";

            return (
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <div className="flex flex-col items-center gap-1.5">
                  <HanjaBadge char={monthJi} ohaeng={JI_TO_OHAENG[monthJi] ?? "土"} size="md" />
                  <span className="text-[11px] text-text-subtle">{monthJiSipsin || "월지"}</span>
                </div>
                <Arrow label={displayRole} icon={{ char: displayGan, ohaeng: displayOhaeng }} />
                <div className="flex flex-col items-center gap-1.5">
                  <HanjaBadge char={displayGan} ohaeng={displayOhaeng} size="md" />
                  <span className="text-[11px] text-text-subtle">{displayGanSipsin || displayLabel}</span>
                </div>
              </div>
            );
          }

          // 格 변화 조건①: 대운 천간이 월지 지장간에 투간
          if (isTugan) {
            const ganIdx = jj.indexOf(daewoonGan);
            const role = ganIdx !== -1 ? getRoleLabel(ganIdx) : "투간";
            return (
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <div className="flex flex-col items-center gap-1.5">
                  <HanjaBadge char={monthJi} ohaeng={JI_TO_OHAENG[monthJi] ?? "土"} size="md" />
                  <span className="text-[11px] text-text-subtle">{pillars.month.jiSipsin || "월지"}</span>
                </div>
                <Arrow label={role} />
                <div className="flex flex-col items-center gap-1.5">
                  <HanjaBadge char={daewoonGan} ohaeng={daewoonGanOhaeng} size="md" />
                  <span className="text-[11px] text-text-subtle">{activeDaeun?.sipsin?.gan || "대운"}</span>
                </div>
              </div>
            );
          }

          // 格 변화 조건②③: 삼합/방합
          if (isSameOhaeng || isSajuGanMatch) {
            const hapRels = hasSamhap ? samhapRels : banghapRels;
            const jiMap = new Map<string, { ohaeng: string; sipsin: string | null }>();
            for (const rel of hapRels) {
              jiMap.set(rel.char1, { ohaeng: rel.ohaeng1, sipsin: rel.sipsin1 });
              jiMap.set(rel.char2, { ohaeng: rel.ohaeng2, sipsin: rel.sipsin2 });
            }
            const jiList = Array.from(jiMap.entries()).map(([char, v]) => ({ char, ...v }));
            const hapLabel = hasSamhap ? "삼합" : "방합";
            const targetGan = isSameOhaeng ? daewoonGan : (matchingSajuGanForHap?.gan ?? "");
            const targetOhaeng = isSameOhaeng ? daewoonGanOhaeng : (GAN_TO_OHAENG[targetGan] ?? "土");
            const targetSipsin = isSameOhaeng
              ? (activeDaeun?.sipsin?.gan ?? "대운")
              : (matchingSajuGanForHap?.sipsin ?? "");

            return (
              <div className="flex items-center gap-4 flex-wrap mb-6">
                {jiList.map(({ char, ohaeng, sipsin }) => (
                  <div key={char} className="flex flex-col items-center gap-1.5">
                    <HanjaBadge char={char} ohaeng={ohaeng} size="md" />
                    <span className="text-[11px] text-text-subtle">
                      {char === daewoonJi ? (activeDaeun?.sipsin?.ji || "대운") : (sipsin ?? "")}
                    </span>
                  </div>
                ))}
                <Arrow label={hapLabel} />
                <div className={cn(
                  "text-[12px] font-semibold px-2.5 py-1 rounded-full border self-center",
                  ohaengPill[hapOhaeng] ?? "bg-gray-50 border-gray-200 text-gray-700",
                )}>
                  {OHAENG_KO[hapOhaeng] ?? hapOhaeng}({hapOhaeng})
                </div>
                <Arrow label="오행" />
                {targetGan && (
                  <div className="flex flex-col items-center gap-1.5">
                    <HanjaBadge char={targetGan} ohaeng={targetOhaeng} size="md" />
                    <span className="text-[11px] text-text-subtle">{targetSipsin}</span>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })()}

        <div className="text-[13px] leading-[1.9] text-text-muted">
          {isGyeokChanged ? (
            <>
              <span className="text-text-light">
                <span className="inline-block px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800">
                  {gyeokguk?.gyeokguk?.name ?? "기존 격"}
                </span>이 변화됩니다.
              </span>{" "}
              현재 {userName}은(는) 대운으로 인하여{" "}
              <span className="inline-block px-1.5 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold">
                {changedGyeokName}
              </span>으로 변화가 되었고, 사용하고자 하는 기운이 변화가
              되므로{" "}
              <span className="font-semibold text-text-light">
                {changedGyeokSipsin}
              </span>을(를) 사용하는 것이 유리하게 작용된다고 볼 수
              있습니다.
              {interp?.daewoonGyeokgukInterp?.[changedGyeokSipsin] ? (
                <>{" "}{formatInterpText(interp.daewoonGyeokgukInterp[changedGyeokSipsin], pillars)}</>
              ) : null}
            </>
          ) : (
            <>
              <span className="text-text-light">
                <span className="inline-block px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800">
                  {gyeokguk?.gyeokguk?.name ?? "기존 격"}
                </span>이 유지됩니다.
              </span>{" "}
              유지가 된다는 것은 현재 대운에서도 {userName}의
              사주(四柱)가 사용하고자 하는 기운이 변함이 없다는 것과
              같습니다.
              {interp?.daewoonGyeokgukInterp?.[gyeokguk?.gyeokguk?.baseSipsin ?? ""] ? (
                <>{" "}{formatInterpText(interp.daewoonGyeokgukInterp[gyeokguk!.gyeokguk!.baseSipsin], pillars)}</>
              ) : null}
            </>
          )}
        </div>


      </div>

      <p className="text-[13px] leading-[1.9] text-text-muted mb-4 whitespace-pre-wrap">
        격(格)을 통해 이 시기 대운 속에서 드러나는 ‘나의 기준과 방향성’을 알아보았고,
        이제부터는 이러한 기준 위에서, 실제 삶의 흐름 속에 어떤 변화와 움직임이 나타나는지 천간의 작용을 통해 구체적으로 살펴보겠습니다.
      </p>


      {/* ════════════════════════════════════════
          천간(天干) — 대운 작용
      ════════════════════════════════════════ */}
      {hasCheonganAction ? (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <SectionHeader title="천간(天干) · 대운 작용" />

          <p className="text-[13px] leading-[1.9] text-text-muted mb-4 whitespace-pre-wrap">
            대운 천간(天干)으로 우리는 삶에 있어서 어떠한 모습이 반영될 것인지 미리 알 수가 있습니다. 천간(天干)의 특성상 드러나는 순수한 기운이기에, 대운이 변화된 시점부터 10년의 시기동안에 '나'라는 존재가 무엇을 위해서 살아가는 지를 알 수 있습니다.
          </p>

          <>
            <div className="flex flex-wrap gap-4 mb-3">
              {cheonganhapRels.map((rel, i) => {
                const hapType = daewoonRels?.cheonganhapTypes?.[i];
                return (
                  <RelRow key={`hap${i}`} rel={rel} relType={hapType ?? "합"} />
                );
              })}
              {cheonganchungRels.map((rel, i) => (
                <RelRow key={`chung${i}`} rel={rel} relType="충" />
              ))}
            </div>

            {(() => {
              const entries: {
                label: string;
                hapType?: "합" | "합반" | "합거";
                text: string;
                ilganText?: string;
                rel?: ParsedRel;
              }[] = [];
              cheonganhapRels.forEach((rel, i) => {
                const h = daewoonInterp?.cheonganhap[i];
                if (h)
                  entries.push({
                    label: h.name,
                    hapType: h.hapType,
                    text: h.essence,
                    ilganText: h.ilganEssence,
                    rel,
                  });
              });
              cheonganchungRels.forEach((rel, i) => {
                const c = daewoonInterp?.cheonganchung[i];
                if (c)
                  entries.push({
                    label: c.name,
                    text: c.essence,
                    ilganText: c.ilganEssence,
                    rel,
                  });
              });
              if (entries.length === 0) return null;
              return (
                <div className="space-y-4 mb-2">
                  {entries.map((e, i) => {
                    return (
                      <div key={i} className="space-y-2">
                        <p className="text-[13px] leading-[1.9] text-text-muted">
                          {e.label && (
                            <span className="font-semibold text-text-light">
                              {e.label}
                              {e.hapType && (
                                <span className="ml-1.5 text-[11px] font-normal text-text-subtle">
                                  ({e.hapType})
                                </span>
                              )}
                              {" — "}
                            </span>
                          )}
                          {formatInterpText(e.text, pillars)}
                        </p>
                        {e.ilganText && (
                          <p className="text-[13px] leading-[1.9] text-text-muted">
                            {formatInterpText(e.ilganText, pillars)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        </div>
      ) : (
        <p className="border-t border-gray-100 pt-6 mb-8 text-[13px] leading-[1.9] text-text-muted">
          현재 대운에서는 천간의 합(合) 또는 충(沖)이 직접적으로 형성되지 않아,
          바깥으로 드러나는 사건 변화보다 내부 정비와 흐름 유지가 더 중요하게
          작용할 수 있습니다. 이 시기에는 무리한 전환보다는 방향을 점검하고 다음
          변화를 준비하는 접근이 도움이 됩니다.
        </p>
      )}

      {/* ════════════════════════════════════════
          지지(地支) — 대운 작용
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <SectionHeader title="지지(地支) · 대운 작용" />

        {samhapRels.length === 0 &&
          banghapRels.length === 0 &&
          hyungChungPaHaeRels.length === 0 &&
          yukhapRels.length === 0 ? (
          <EmptyNote />
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-3">
              {samhapRels.map((rel, i) => (
                <RelRow key={`s${i}`} rel={rel} relType="삼합" />
              ))}
              {banghapRels.map((rel, i) => (
                <RelRow key={`b${i}`} rel={rel} relType="방합" />
              ))}
              {yukhapRels.map((rel, i) => (
                <RelRow key={`y${i}`} rel={rel} relType="육합" />
              ))}
              {hyungChungPaHaeRels.map((item, idx) => (
                <RelRow
                  key={`j${idx}`}
                  rel={item.rel}
                  relType={item.type}
                  dimRight={item.dimRight}
                />
              ))}
            </div>
            {(() => {
              const entries: {
                label?: string;
                essence: string;
                ilganEssence?: string;
                description: string;
                effect?: string;
              }[] = [];
              samhapRels.forEach((_, i) => {
                const s = daewoonInterp?.samhap[i];
                if (s)
                  entries.push({
                    label: s.name,
                    essence: s.essence,
                    ilganEssence: s.ilganEssence,
                    description: s.description,
                    effect: s.effect,
                  });
              });
              banghapRels.forEach((_, i) => {
                const b = daewoonInterp?.banghap[i];
                if (b)
                  entries.push({
                    label: b.name,
                    essence: b.essence,
                    ilganEssence: b.ilganEssence,
                    description: b.description,
                    effect: b.effect,
                  });
              });
              yukhapRels.forEach((_, i) => {
                const y = daewoonInterp?.yukhap[i];
                if (y)
                  entries.push({
                    label: y.name,
                    essence: y.essence,
                    ilganEssence: y.ilganEssence,
                    description: y.description,
                    effect: y.effect,
                  });
              });
              const interpByType = {
                충: daewoonInterp?.yukchung ?? [],
                형: daewoonInterp?.yukhyung ?? [],
                파: daewoonInterp?.yukpa ?? [],
                해: daewoonInterp?.yukae ?? [],
              } as Record<
                string,
                NonNullable<typeof daewoonInterp>["yukchung"]
              >;
              hyungChungPaHaeRels.forEach((item, idx) => {
                const sameTypeBefore = hyungChungPaHaeRels
                  .slice(0, idx)
                  .filter((x) => x.type === item.type).length;
                const j = interpByType[item.type]?.[sameTypeBefore];
                if (j)
                  entries.push({
                    label: j.name,
                    essence: j.essence,
                    ilganEssence: j.ilganEssence,
                    description: j.description,
                    effect: j.effect,
                  });
              });
              if (entries.length === 0) return null;
              return (
                <div className="space-y-4 mb-2">
                  {entries.map((e, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-[13px] leading-[1.9] text-text-muted">
                        {e.label && (
                          <span className="font-semibold text-text-light">
                            {e.label}{" — "}
                          </span>
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
        )}
      </div>
    </SectionFrame>
  );
};
