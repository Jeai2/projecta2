// src/components/results/v2/sections/SipsinV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GAN_TO_OHAENG,
  GAN_HANGUL_TO_HANJA,
  PILLAR_KO,
  parseGanRel,
  parseJiRel,
  getFrozenPillarKeys,
  type ParsedRel,
} from "@/utils/sipsinParser";

// ── 오행 스타일 ────────────────────────────────────────────────────────
const ohaengPill: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};
const OHAENG_HANGUL: Record<string, string> = {
  木: "목", 火: "화", 土: "토", 金: "금", 水: "수",
};

// ── 공통 컴포넌트 ──────────────────────────────────────────────────────
function HanjaBadge({
  char, ohaeng, dimmed = false, size = "md",
}: {
  char: string; ohaeng: string; dimmed?: boolean; size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "text-2xl px-3 py-2 min-w-[3rem]"
    : size === "sm" ? "text-base px-2 py-0.5 min-w-[1.75rem]"
    : "text-xl px-2.5 py-1 min-w-[2.25rem]";
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-lg border font-myeongjo font-bold leading-none",
      sizeClass,
      dimmed ? "bg-gray-100 border-gray-200 text-gray-300"
             : (ohaengPill[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-800")
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

function OhaengTag({ ohaeng }: { ohaeng: string }) {
  return (
    <span className={cn(
      "text-[10px] rounded-full px-2 py-0.5 border",
      ohaengPill[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-500"
    )}>
      {OHAENG_HANGUL[ohaeng]}({ohaeng})
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
      styles[key] ?? "bg-gray-50 border-gray-200 text-gray-500"
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

function SubHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-3.5 rounded-full bg-amber-200" />
      <p className="text-[11px] font-semibold text-text-light tracking-wide">{title}</p>
    </div>
  );
}

function EmptyNote({ text = "없음" }: { text?: string }) {
  return <p className="text-sm text-text-subtle italic mb-6">{text}</p>;
}

/** 해설 박스 — 각 섹션 하단에 표시 */
function InterpBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 mb-5 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-[13px] leading-[1.85] text-amber-900 space-y-1.5">
      <div className="flex items-center gap-1.5 mb-1">
        <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-semibold text-amber-600 tracking-wide">해설</span>
      </div>
      {children}
    </div>
  );
}

function InterpLine({ label, text }: { label?: string; text: string }) {
  return (
    <p className="text-[13px] text-amber-900 leading-[1.85]">
      {label && <span className="font-semibold text-amber-700 mr-1.5">{label}</span>}
      {text}
    </p>
  );
}

function InterpList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, i) => (
        <li key={i} className="text-[11px] rounded-full px-2.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-800">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** 관계 쌍 한 줄 표시 */
function RelRow({
  rel, relType, dimRight = false,
}: {
  rel: ParsedRel; relType: string; dimRight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char1} ohaeng={rel.ohaeng1} />
        {rel.sipsin1 && <SipsinBadge label={rel.sipsin1} />}
        <span className="text-[10px] text-text-subtle">{PILLAR_KO[rel.pillar1]}</span>
      </div>
      <RelBadge type={relType} />
      <div className="flex flex-col items-center gap-1">
        <HanjaBadge char={rel.char2} ohaeng={rel.ohaeng2} dimmed={dimRight} />
        {rel.sipsin2 && <SipsinBadge label={rel.sipsin2} dimmed={dimRight} />}
        <span className="text-[10px] text-text-subtle">{PILLAR_KO[rel.pillar2]}</span>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────
export const SipsinV2 = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData) {
    return (
      <SectionFrame chapterNum={5} title="십신 분석">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">십신 분석 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { sajuData } = fortuneResult.saju;
  const { pillars, relationships, dangnyeong, saryeong, gyeokguk, sipsinV2Interpretation: interp } = sajuData;

  // ── 파싱 ────────────────────────────────────────────────────────────
  const ganRels = (list: string[]) =>
    list.flatMap((s) => { const r = parseGanRel(s, pillars); return r ? [r] : []; });
  const jiRels = (list: string[]) =>
    list.flatMap((s) => { const r = parseJiRel(s, pillars); return r ? [r] : []; });

  const cheonganhapRels = ganRels(relationships?.cheonganhap ?? []);
  const cheonganchungRels = ganRels(relationships?.cheonganchung ?? []);
  const samhapRels = jiRels(relationships?.samhap ?? []);
  const banghapRels = jiRels(relationships?.banghap ?? []);
  const yukchungRels = jiRels(relationships?.yukchung ?? []);
  const yukhyungRels = jiRels(relationships?.yukhyung ?? []);
  const yukpaRels = jiRels(relationships?.yukpa ?? []);
  const yukaeRels = jiRels(relationships?.yukae ?? []);
  const yukhapRels = jiRels(relationships?.yukhap ?? []);
  const amhapRels = jiRels(relationships?.amhap ?? []);

  // 잔존 천간 (합거 제외)
  const frozenKeys = getFrozenPillarKeys(relationships?.cheonganhap ?? []);
  const pillarEntries = [
    { key: "year", data: pillars.year },
    { key: "month", data: pillars.month },
    { key: "day", data: pillars.day },
    { key: "hour", data: pillars.hour },
  ];
  const remainingGans = pillarEntries
    .filter((e) => !frozenKeys.has(e.key))
    .map((e) => ({
      key: e.key,
      gan: e.data.gan,
      ohaeng: e.data.ganOhaeng,
      sipsin: e.data.ganSipsin,
    }));

  // 당령 한자 변환
  const dangHanja = dangnyeong
    ? GAN_HANGUL_TO_HANJA[dangnyeong.dangnyeongGan] ?? dangnyeong.dangnyeongGan
    : null;
  const dangOhaeng = dangHanja ? GAN_TO_OHAENG[dangHanja] ?? "" : "";

  // 사령 한자 변환
  const saryHanja = saryeong
    ? GAN_HANGUL_TO_HANJA[saryeong.saryeongGan] ?? saryeong.saryeongGan
    : null;
  const saryOhaeng = saryHanja ? GAN_TO_OHAENG[saryHanja] ?? "" : "";

  // 형충파해 통합
  const hyungChungPaHaeRels: { rel: ParsedRel; type: string; dimRight: boolean }[] = [
    ...yukchungRels.map((r) => ({ rel: r, type: "충", dimRight: true })),
    ...yukhyungRels.map((r) => ({ rel: r, type: "형", dimRight: true })),
    ...yukpaRels.map((r) => ({ rel: r, type: "파", dimRight: false })),
    ...yukaeRels.map((r) => ({ rel: r, type: "해", dimRight: false })),
  ];

  return (
    <SectionFrame
      chapterNum={5}
      title="십신 분석"
      description="글자와 글자 사이에서 '나'를 알아보자"
    >
      {/* ── 원국 4기둥 ── */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-10">
        <SajuPillarLight title="시주" data={pillars.hour} sipsinMode />
        <SajuPillarLight title="일주" data={pillars.day} sipsinMode />
        <SajuPillarLight title="월주" data={pillars.month} sipsinMode />
        <SajuPillarLight title="년주" data={pillars.year} sipsinMode />
      </div>

      {/* ════════════════════════════════════════
          1. 월지(月支) 파악
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <SectionHeader title="월지(月支) 파악" />

        {/* 월지 글자 */}
        <div className="flex items-center gap-3 mb-4">
          <HanjaBadge char={pillars.month.ji} ohaeng={pillars.month.jiOhaeng} size="lg" />
          <div>
            <p className="text-xs font-semibold text-text-light mb-0.5">월지</p>
            <OhaengTag ohaeng={pillars.month.jiOhaeng} />
          </div>
        </div>

        {/* 월지 해설 */}
        {interp?.wolji && (
          <InterpBox>
            <InterpLine label={interp.wolji.title} text={`${interp.wolji.season}`} />
            <InterpLine text={interp.wolji.essence} />
            <InterpLine text={interp.wolji.description} />
            {interp.wolji.characteristics.length > 0 && (
              <InterpList items={interp.wolji.characteristics} />
            )}
            <InterpLine label="일간 영향:" text={interp.wolji.dayMasterNote} />
          </InterpBox>
        )}

        {/* 당령 */}
        <div className="mb-6">
          <SubHeader title="당령(當令)" />
          {dangHanja ? (
            <>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <HanjaBadge char={dangHanja} ohaeng={dangOhaeng} />
                <div>
                  <p className="text-[11px] text-text-subtle">
                    {dangnyeong!.dangnyeongGan}({dangHanja}) · {OHAENG_HANGUL[dangOhaeng]}({dangOhaeng})
                  </p>
                  <span className="text-[10px] text-accent-lavender">{dangnyeong!.jeolgi}</span>
                </div>
              </div>
              {interp?.dangnyeong && (
                <InterpBox>
                  <InterpLine label={interp.dangnyeong.title} text={interp.dangnyeong.essence} />
                  <InterpLine text={interp.dangnyeong.meaning} />
                  <InterpLine label="절기 맥락:" text={interp.dangnyeong.jeolgiNote} />
                  <InterpLine label="분석 참고:" text={interp.dangnyeong.aiNote} />
                </InterpBox>
              )}
            </>
          ) : (
            <EmptyNote text="당령 데이터 없음" />
          )}
        </div>

        {/* 사령 */}
        <div>
          <SubHeader title="사령(司令)" />
          {saryHanja ? (
            <>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <HanjaBadge char={saryHanja} ohaeng={saryOhaeng} />
                <div>
                  <p className="text-[11px] text-text-subtle">
                    {saryeong!.saryeongGan}({saryHanja}) · {OHAENG_HANGUL[saryOhaeng]}({saryOhaeng})
                  </p>
                  <span className="text-[10px] text-accent-teal">{saryeong!.role}</span>
                </div>
              </div>
              {interp?.saryeong && (
                <InterpBox>
                  {interp.saryeong.role && (
                    <>
                      <InterpLine label={interp.saryeong.role.korName} text={interp.saryeong.role.essence} />
                      <InterpLine text={interp.saryeong.role.description} />
                      <InterpLine label="기운 강도:" text={interp.saryeong.role.powerLevel} />
                    </>
                  )}
                  {interp.saryeong.ganNote && (
                    <InterpLine label="천간 특성:" text={interp.saryeong.ganNote} />
                  )}
                </InterpBox>
              )}
            </>
          ) : (
            <EmptyNote text="사령 데이터 없음" />
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          2. 천간(天干)
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <SectionHeader title="천간(天干)" />

        {/* 천간의 합 */}
        <div className="mb-6">
          <SubHeader title="천간의 합" />
          {cheonganhapRels.length === 0 ? (
            <EmptyNote />
          ) : (
            <>
              {cheonganhapRels.map((rel, i) => {
                const hapInterp = interp?.cheonganhap[i];
                return (
                  <div key={i}>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <div className="flex flex-col items-center gap-1">
                        <HanjaBadge char={rel.char1} ohaeng={rel.ohaeng1} dimmed />
                        {rel.sipsin1 && <SipsinBadge label={rel.sipsin1} dimmed />}
                        <span className="text-[10px] text-gray-300">{PILLAR_KO[rel.pillar1]}</span>
                      </div>
                      <RelBadge type="합" />
                      <div className="flex flex-col items-center gap-1">
                        <HanjaBadge char={rel.char2} ohaeng={rel.ohaeng2} dimmed />
                        {rel.sipsin2 && <SipsinBadge label={rel.sipsin2} dimmed />}
                        <span className="text-[10px] text-gray-300">{PILLAR_KO[rel.pillar2]}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
                        동결
                      </span>
                    </div>
                    {hapInterp && (
                      <InterpBox>
                        <InterpLine label={hapInterp.name} text={hapInterp.essence} />
                        <InterpLine text={hapInterp.description} />
                        <InterpLine label="사주 작용:" text={hapInterp.effect} />
                        <InterpLine label="동결 의미:" text={hapInterp.frozen} />
                      </InterpBox>
                    )}
                  </div>
                );
              })}
              {/* 잔존 천간 */}
              {remainingGans.length > 0 && (
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-text-subtle">살아있는 천간</span>
                  {remainingGans.map((r, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <HanjaBadge char={r.gan} ohaeng={r.ohaeng} size="sm" />
                      {r.sipsin && <SipsinBadge label={r.sipsin} />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* 천간의 충 */}
        <div>
          <SubHeader title="천간의 충" />
          {cheonganchungRels.length === 0 ? (
            <EmptyNote />
          ) : (
            cheonganchungRels.map((rel, i) => {
              const chungInterp = interp?.cheonganchung[i];
              return (
                <div key={i}>
                  <RelRow rel={rel} relType="충" dimRight />
                  {chungInterp && (
                    <InterpBox>
                      <InterpLine label={chungInterp.name} text={chungInterp.essence} />
                      <InterpLine text={chungInterp.description} />
                      <InterpLine label="사주 작용:" text={chungInterp.effect} />
                    </InterpBox>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          3. 지지(地支)
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <SectionHeader title="지지(地支)" />

        {/* 삼합 · 방합 */}
        <div className="mb-6">
          <SubHeader title="삼합 · 방합" />
          {samhapRels.length === 0 && banghapRels.length === 0 ? (
            <EmptyNote />
          ) : (
            <>
              {samhapRels.map((rel, i) => {
                const si = interp?.samhap[i];
                return (
                  <div key={`s${i}`}>
                    <RelRow rel={rel} relType="삼합" />
                    {si && (
                      <InterpBox>
                        <InterpLine label={si.name} text={si.essence} />
                        <InterpLine text={si.description} />
                        <InterpLine label="사주 작용:" text={si.effect} />
                      </InterpBox>
                    )}
                  </div>
                );
              })}
              {banghapRels.map((rel, i) => {
                const bi = interp?.banghap[i];
                return (
                  <div key={`b${i}`}>
                    <RelRow rel={rel} relType="방합" />
                    {bi && (
                      <InterpBox>
                        <InterpLine label={bi.name} text={bi.essence} />
                        <InterpLine text={bi.description} />
                        <InterpLine label="사주 작용:" text={bi.effect} />
                      </InterpBox>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* 형 · 충 · 파 · 해 */}
        <div className="mb-6">
          <SubHeader title="형 · 충 · 파 · 해" />
          {hyungChungPaHaeRels.length === 0 ? (
            <EmptyNote />
          ) : (
            hyungChungPaHaeRels.map((item, idx) => {
              const interpByType = {
                충: interp?.yukchung ?? [],
                형: interp?.yukhyung ?? [],
                파: interp?.yukpa ?? [],
                해: interp?.yukae ?? [],
              } as Record<string, NonNullable<typeof interp>["yukchung"]>;
              const sameTypeBefore = hyungChungPaHaeRels.slice(0, idx).filter((x) => x.type === item.type).length;
              const ji = interpByType[item.type]?.[sameTypeBefore];
              return (
                <div key={idx}>
                  <RelRow rel={item.rel} relType={item.type} dimRight={item.dimRight} />
                  {ji && (
                    <InterpBox>
                      <InterpLine label={ji.name} text={ji.essence} />
                      <InterpLine text={ji.description} />
                      <InterpLine label="사주 작용:" text={ji.effect} />
                    </InterpBox>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 육합 · 암합 */}
        <div>
          <SubHeader title="육합 · 암합" />
          {yukhapRels.length === 0 && amhapRels.length === 0 ? (
            <EmptyNote />
          ) : (
            <>
              {yukhapRels.map((rel, i) => {
                const yi = interp?.yukhap[i];
                return (
                  <div key={`y${i}`}>
                    <RelRow rel={rel} relType="육합" />
                    {yi && (
                      <InterpBox>
                        <InterpLine label={yi.name} text={yi.essence} />
                        <InterpLine text={yi.description} />
                        <InterpLine label="사주 작용:" text={yi.effect} />
                      </InterpBox>
                    )}
                  </div>
                );
              })}
              {amhapRels.length > 0 && (
                <div>
                  {amhapRels.map((rel, i) => <RelRow key={`a${i}`} rel={rel} relType="암합" />)}
                  {interp?.amhap && (
                    <InterpBox>
                      <InterpLine text={interp.amhap.concept} />
                      <InterpLine label="이 사주:" text={interp.amhap.note} />
                    </InterpBox>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          4. 격국(格局)
      ════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-6">
        <SectionHeader title="격국(格局)" />

        {!gyeokguk ? (
          <EmptyNote text="격국 데이터 없음" />
        ) : (
          <>
            {/* 격 이름 */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 min-w-[5rem]">
                <span className="text-base font-bold text-amber-800 leading-none">
                  {gyeokguk.gyeokguk?.name ?? "격국 미확정"}
                </span>
                {gyeokguk.isSuccess ? (
                  <span className="text-[10px] text-emerald-600 mt-1">성격</span>
                ) : (
                  <span className="text-[10px] text-rose-400 mt-1">파격</span>
                )}
              </div>
            </div>

            {gyeokguk.reason && (
              <p className="text-[15px] leading-[1.9] text-text-muted whitespace-pre-wrap mb-6">
                {gyeokguk.reason}
              </p>
            )}

            {/* 격국 해설 */}
            {interp?.gyeokguk && (
              <InterpBox>
                <InterpLine label={interp.gyeokguk.name} text={interp.gyeokguk.essence} />
                <InterpLine text={interp.gyeokguk.description} />
                <InterpLine label="성격 조건:" text={interp.gyeokguk.successCondition} />
                <InterpLine label="파격 조건:" text={interp.gyeokguk.breakCondition} />
              </InterpBox>
            )}

            {/* 격 용신 */}
            <div className="mb-6">
              <SubHeader title="격 용신(用神)" />
              {gyeokguk.yongsinType ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-semibold text-text-light">
                      {gyeokguk.yongsinType}
                    </span>
                  </div>
                  {interp?.yongsin && (
                    <InterpBox>
                      <InterpLine label={interp.yongsin.type} text={interp.yongsin.essence} />
                      <InterpLine text={interp.yongsin.description} />
                      <InterpLine label="삶의 방향:" text={interp.yongsin.lifeTheme} />
                      <InterpLine label="주의사항:" text={interp.yongsin.caution} />
                    </InterpBox>
                  )}
                  {interp?.gyeokguk && (
                    <p className="text-[12px] text-text-subtle mt-1">{interp.gyeokguk.yongsinGuide}</p>
                  )}
                </>
              ) : (
                <EmptyNote text="용신 데이터 없음" />
              )}
            </div>

            {/* 격 상신 */}
            <div>
              <SubHeader title="격 상신(相神)" />
              {interp?.sangsin ? (
                <InterpBox>
                  <InterpLine text={interp.sangsin.concept} />
                  {interp.sangsin.roles.map((r, i) => (
                    <InterpLine key={i} label={r.role + ":"} text={r.description} />
                  ))}
                  <InterpLine label="운에서의 중요성:" text={interp.sangsin.importanceNote} />
                </InterpBox>
              ) : (
                <p className="text-sm text-text-subtle italic">준비 중</p>
              )}
            </div>
          </>
        )}
      </div>
    </SectionFrame>
  );
};
