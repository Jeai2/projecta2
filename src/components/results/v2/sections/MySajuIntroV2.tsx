// src/components/results/v2/sections/MySajuIntroV2.tsx

import { useState, useRef, useEffect } from "react";
import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle, HelpCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 육십갑자 → 이미지 파일 매핑 (나머지 52개 추가 예정, 未완료)
const ganjiImageMap: Record<string, string> = {
  "庚寅": "/gungin.png",
  "戊戌": "/musul.png",
  "壬戌": "/imsul.png",
  "壬未": "/immi.png",
  "丁未": "/jeongmi.png",
  "己未": "/gimi.png",
  "乙未": "/eulmi.png",
  "辛未": "/sinmi.png",
  "辛巳": "/sinsa.png",
};

// 천간·지지 한자 → 한글 발음
const ganHangul: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};
const jiHangul: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사",
  午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};

// 일간 오행을 도와주는 오행 (같은 오행 + 생해주는 오행)
const OHAENG_SUPPORT: Record<string, string[]> = {
  木: ["木", "水"], 火: ["火", "木"], 土: ["土", "火"],
  金: ["金", "土"], 水: ["水", "金"],
};

// 십성-오행 관계 매핑 (생극제화)
const OHAENG_SAENG: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const OHAENG_GEUK: Record<string, string> = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
const OHAENG_SAENG_REV: Record<string, string> = { 木: "水", 火: "木", 土: "火", 金: "土", 水: "金" };
const OHAENG_GEUK_REV: Record<string, string> = { 木: "金", 火: "水", 土: "木", 金: "火", 水: "土" };
const OHAENG_NAME: Record<string, string> = { 木: "목(木)", 火: "화(火)", 土: "토(土)", 金: "금(金)", 水: "수(水)" };

const OHAENG_TEXT_COLOR: Record<string, string> = {
  木: "text-emerald-600",
  火: "text-rose-600",
  土: "text-amber-600",
  金: "text-slate-500",
  水: "text-blue-600",
};

const ohaengBadge: Record<string, string> = {
  木: "bg-emerald-50 border-emerald-200 text-emerald-800",
  火: "bg-rose-50 border-rose-200 text-rose-800",
  土: "bg-amber-50 border-amber-200 text-amber-800",
  金: "bg-slate-50 border-slate-300 text-slate-700",
  水: "bg-blue-50 border-blue-200 text-blue-800",
};

const wangseLevelStyle: Record<string, string> = {
  극약: "bg-blue-100 border-blue-300 text-blue-800",
  태약: "bg-blue-50 border-blue-200 text-blue-700",
  신약: "bg-sky-50 border-sky-200 text-sky-700",
  중화: "bg-emerald-50 border-emerald-200 text-emerald-700",
  신강: "bg-amber-50 border-amber-200 text-amber-800",
  태강: "bg-orange-50 border-orange-200 text-orange-700",
  극왕: "bg-rose-50 border-rose-200 text-rose-700",
};

// 천간 → 색상, 지지 → 동물
const ganColor: Record<string, string> = {
  甲: "푸른", 乙: "푸른", 丙: "붉은", 丁: "붉은", 戊: "노란",
  己: "노란", 庚: "하얀", 辛: "하얀", 壬: "검은", 癸: "검은",
};
const jiAnimal: Record<string, string> = {
  子: "쥐", 丑: "소", 寅: "호랑이", 卯: "토끼", 辰: "용", 巳: "뱀",
  午: "말", 未: "양", 申: "원숭이", 酉: "닭", 戌: "개", 亥: "돼지",
};

const JI_SEASON: Record<string, string> = {
  寅: "봄", 卯: "봄",
  巳: "여름", 午: "여름",
  申: "가을", 酉: "가을",
  亥: "겨울", 子: "겨울",
  辰: "환절기", 戌: "환절기", 丑: "환절기", 未: "환절기",
};

const JIJANGGAN: Record<string, { gan: string; ohaeng: string; role: string; days: number }[]> = {
  子: [{ gan: "癸", ohaeng: "水", role: "본기", days: 30 }],
  丑: [{ gan: "癸", ohaeng: "水", role: "여기", days: 9 }, { gan: "辛", ohaeng: "金", role: "중기", days: 3 }, { gan: "己", ohaeng: "土", role: "본기", days: 18 }],
  寅: [{ gan: "戊", ohaeng: "土", role: "여기", days: 7 }, { gan: "丙", ohaeng: "火", role: "중기", days: 7 }, { gan: "甲", ohaeng: "木", role: "본기", days: 16 }],
  卯: [{ gan: "甲", ohaeng: "木", role: "여기", days: 10 }, { gan: "乙", ohaeng: "木", role: "본기", days: 20 }],
  辰: [{ gan: "乙", ohaeng: "木", role: "여기", days: 9 }, { gan: "癸", ohaeng: "水", role: "중기", days: 3 }, { gan: "戊", ohaeng: "土", role: "본기", days: 18 }],
  巳: [{ gan: "戊", ohaeng: "土", role: "여기", days: 7 }, { gan: "庚", ohaeng: "金", role: "중기", days: 7 }, { gan: "丙", ohaeng: "火", role: "본기", days: 16 }],
  午: [{ gan: "丙", ohaeng: "火", role: "여기", days: 10 }, { gan: "己", ohaeng: "土", role: "중기", days: 10 }, { gan: "丁", ohaeng: "火", role: "본기", days: 10 }],
  未: [{ gan: "丁", ohaeng: "火", role: "여기", days: 9 }, { gan: "乙", ohaeng: "木", role: "중기", days: 3 }, { gan: "己", ohaeng: "土", role: "본기", days: 18 }],
  申: [{ gan: "戊", ohaeng: "土", role: "여기", days: 7 }, { gan: "壬", ohaeng: "水", role: "중기", days: 7 }, { gan: "庚", ohaeng: "金", role: "본기", days: 16 }],
  酉: [{ gan: "庚", ohaeng: "金", role: "여기", days: 10 }, { gan: "辛", ohaeng: "金", role: "본기", days: 20 }],
  戌: [{ gan: "辛", ohaeng: "金", role: "여기", days: 9 }, { gan: "丁", ohaeng: "火", role: "중기", days: 3 }, { gan: "戊", ohaeng: "土", role: "본기", days: 18 }],
  亥: [{ gan: "戊", ohaeng: "土", role: "여기", days: 7 }, { gan: "甲", ohaeng: "木", role: "중기", days: 7 }, { gan: "壬", ohaeng: "水", role: "본기", days: 16 }],
};

function GanjiBadge({ char, ohaeng, dimmed = false, size = "md", className }: { char: string; ohaeng: string; dimmed?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-[16px] border-2",
    md: "w-10 h-10 rounded-xl text-xl border-2",
    lg: "w-12 h-12 rounded-2xl text-[22px] border-2"
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center font-myeongjo font-bold leading-none",
      sizeClasses[size],
      dimmed
        ? "bg-gray-50 border-gray-100 text-gray-300"
        : (ohaengBadge[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-700"),
      className
    )}>
      {char}
    </span>
  );
}

function SectionHeader({ title, rightElement }: { title: string; rightElement?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      <h3 className="text-xs font-semibold text-accent-gold tracking-widest uppercase mb-0">
        {title}
      </h3>
      {rightElement}
    </div>
  );
}

export const MySajuIntroV2 = () => {
  const { fortuneResult } = useFortuneStore();
  const [showWangseInfo, setShowWangseInfo] = useState(false);
  const wangseInfoRef = useRef<HTMLDivElement>(null);
  const [showWoljiInfo, setShowWoljiInfo] = useState(false);
  const woljiInfoRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wangseInfoRef.current && !wangseInfoRef.current.contains(event.target as Node)) {
        setShowWangseInfo(false);
      }
    }
    if (showWangseInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWangseInfo]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (woljiInfoRef.current && !woljiInfoRef.current.contains(event.target as Node)) {
        setShowWoljiInfo(false);
      }
    }
    if (showWoljiInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWoljiInfo]);

  if (!fortuneResult?.saju?.sajuData) {
    return (
      <SectionFrame chapterNum={3} title="사주팔자">
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm">사주 정보를 표시할 수 없습니다.</p>
        </div>
      </SectionFrame>
    );
  }

  const { pillars, wangseStrength, sipsinV2Interpretation: interp } = fortuneResult.saju.sajuData;
  const userName = fortuneResult.userInfo?.name || "무명(無名)";

  // 신강신약 득령·득지·득세 계산
  const dayOhaeng = pillars.day.ganOhaeng;
  const supports = OHAENG_SUPPORT[dayOhaeng] ?? [];
  const isDeukRyeong = supports.includes(pillars.month.jiOhaeng);
  const isDeukJi = supports.includes(pillars.day.jiOhaeng);
  const deukseItems = [
    { char: pillars.year.gan, ohaeng: pillars.year.ganOhaeng, label: "년간" },
    { char: pillars.month.gan, ohaeng: pillars.month.ganOhaeng, label: "월간" },
    { char: pillars.hour.gan, ohaeng: pillars.hour.ganOhaeng, label: "시간" },
    { char: pillars.year.ji, ohaeng: pillars.year.jiOhaeng, label: "년지" },
    { char: pillars.hour.ji, ohaeng: pillars.hour.jiOhaeng, label: "시지" },
  ].map(item => ({ ...item, helps: supports.includes(item.ohaeng) }));

  // 신강/신약에 따른 오행 추천
  const isSingang = ["극왕", "태강", "신강", "중화"].includes(wangseStrength?.level ?? "");

  const getOhaengSpan = (ohaeng: string) => {
    if (!ohaeng) return null;
    return <span className={OHAENG_TEXT_COLOR[ohaeng]}>{OHAENG_NAME[ohaeng]}</span>;
  };

  const bigeobOhaeng = getOhaengSpan(dayOhaeng);
  const siksangOhaeng = getOhaengSpan(OHAENG_SAENG[dayOhaeng]);
  const jaeseongOhaeng = getOhaengSpan(OHAENG_GEUK[dayOhaeng]);
  const gwanseongOhaeng = getOhaengSpan(OHAENG_GEUK_REV[dayOhaeng]);
  const inseongOhaeng = getOhaengSpan(OHAENG_SAENG_REV[dayOhaeng]);

  // 월지 파생값
  const monthJi = pillars.month.ji;
  const monthJiOhaeng = pillars.month.jiOhaeng;
  const monthSeason = JI_SEASON[monthJi] ?? "";

  // 당령·사령 — 서버 데이터 사용
  const jijangganOfMonth = JIJANGGAN[monthJi] ?? [];
  const dangnyeongData = fortuneResult.saju.sajuData.dangnyeong;
  const saryeongData = fortuneResult.saju.sajuData.saryeong;

  // 한글 천간 → 한자 변환
  const GAN_HANGUL_TO_HANJA: Record<string, string> = {
    갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
    기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
  };
  const dangnyeongHanja = dangnyeongData
    ? (GAN_HANGUL_TO_HANJA[dangnyeongData.dangnyeongGan] ?? dangnyeongData.dangnyeongGan)
    : null;
  const saryeongHanja = saryeongData
    ? (GAN_HANGUL_TO_HANJA[saryeongData.saryeongGan] ?? saryeongData.saryeongGan)
    : null;

  // 지장간에서 인덱스 찾기
  const dangnyeongIdx = jijangganOfMonth.findIndex(s => s.gan === dangnyeongHanja);
  const saryeongIdx = jijangganOfMonth.findIndex(s => s.gan === saryeongHanja);
  const dangnyeongStem = dangnyeongIdx >= 0 ? jijangganOfMonth[dangnyeongIdx] : null;
  const saryeongStem = saryeongIdx >= 0 ? jijangganOfMonth[saryeongIdx] : null;

  // 일간에 유리한지
  const isDangnyeongHelps = dangnyeongStem ? supports.includes(dangnyeongStem.ohaeng) : false;
  const isSaryeongHelps = saryeongStem ? supports.includes(saryeongStem.ohaeng) : false;

  // 사령 role 한글 품요없이 서버 role 직접 사용 (초기/중기/정기 → 여기/중기/본기 매핑)
  const ROLE_LABEL: Record<string, string> = { 초기: "여기(餘氣)", 중기: "중기(中氣)", 정기: "본기(本氣)" };

  // 생년월일시 포맷: "1991年 11月 7日 寅時"
  const birthDate = fortuneResult.userInfo?.birthDate ?? "";
  const [birthYear, birthMonth, birthDay] = birthDate.split("-");
  const hourJi = pillars.hour?.ji;
  const birthLabel = [
    birthYear ? `${birthYear}年` : null,
    birthMonth ? `${parseInt(birthMonth)}月` : null,
    birthDay ? `${parseInt(birthDay)}日` : null,
    hourJi ? `${hourJi}時` : null,
  ].filter(Boolean).join(" ");

  return (
    <SectionFrame
      chapterNum={3}
      title="사주팔자"
      description="태어난 시기의 기운으로 '나'를 알아보자"
    >
      {/* 이름 + 생년월일시 */}
      <div className="mb-4 text-right">
        <p className="text-2xl font-semibold text-text-light">{userName}님</p>
        <p className="text-[16px] text-text-subtle mt-0.5 font-myeongjo">{birthLabel}</p>
      </div>

      {/* 기둥 4개 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <SajuPillarLight title="시주(時)" data={pillars.hour} bareMode />
        <SajuPillarLight title="일주(日)" data={pillars.day} bareMode />
        <SajuPillarLight title="월주(月)" data={pillars.month} bareMode />
        <SajuPillarLight title="년주(年)" data={pillars.year} bareMode />
      </div>
      {/* 오행 범례 — 그리드 하단 오른쪽 정렬 */}
      <div className="flex items-center justify-end gap-3 mt-3 mb-6 text-[11px] text-text-subtle">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
          목(木)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-200 inline-block" />
          화(火)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200 inline-block" />
          토(土)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
          금(金)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200 inline-block" />
          수(水)
        </span>
      </div>

      {/* 육십갑자 이미지 — 기둥 순서(시·일·월·년)에 맞춰 4열 */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
        {([pillars.hour, pillars.day, pillars.month, pillars.year] as const).map((pillar, i) => {
          const gan = pillar?.gan ?? "";
          const ji = pillar?.ji ?? "";
          const key = gan + ji;
          const src = ganjiImageMap[key];
          const hangul = (ganHangul[gan] ?? "") + (jiHangul[ji] ?? "");
          const description = gan && ji ? `${ganColor[gan] ?? ""} ${jiAnimal[ji] ?? ""}`.trim() : "";
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {src ? (
                <img src={src} alt={key} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12" />
              )}
              {key && (
                <span className="text-[14px] text-text-light font-sans text-center leading-tight">
                  {hangul}({key})
                </span>
              )}
              {description && (
                <span className="text-[12px] text-text-muted font-sans text-center leading-tight">
                  {description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mb-10 text-[13px] leading-[1.9] text-text-muted">
        우리가 쓰는 달력 뒤에는 60년을 주기로 순환하는 또 하나의 달력이 있습니다.
        만세력(萬歲曆)이라고 부르는 그 달력에서 {userName}님이 태어난 날을 찾으면,
        8개의 한자가 남습니다.
        {" "}
        {(() => {
          const getPillarText = (pillar: any, suffix: string, hanjaSuffix: string) => {
            const gan = pillar?.gan;
            const ji = pillar?.ji;
            if (!gan || !ji) return null;
            const hangul = (ganHangul[gan] ?? "") + (jiHangul[ji] ?? "");
            return `${hangul}${suffix}(${gan}${ji}${hanjaSuffix})`;
          };
          const parts = [
            getPillarText(pillars.year, "년", "年"),
            getPillarText(pillars.month, "월", "月"),
            getPillarText(pillars.day, "일", "日"),
            getPillarText(pillars.hour, "시", "時"),
          ].filter(Boolean);

          if (parts.length === 0) return null;
          return `즉, ${userName}님은 ${parts.join(" ")}에 태어났습니다.`;
        })()}
        <br />
        <br />
        사주팔자(四柱八字)의 시작은 신강신약(身强身弱)으로 시작합니다.
      </p>
      {/* 신강신약 */}
      {wangseStrength && (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <div className="relative inline-block" ref={wangseInfoRef}>
            <SectionHeader
              title="신강신약"
              rightElement={
                <button
                  onClick={() => setShowWangseInfo(!showWangseInfo)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label="신강신약 도움말"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              }
            />

            {showWangseInfo && (
              <div className="absolute top-8 left-0 z-10 w-full min-w-[280px] sm:w-[320px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-[13px] leading-relaxed text-text-subtle">
                <p className="font-semibold text-text-light mb-1.5">신강(身强)과 신약(身弱)</p>
                <p className="mb-3">
                  신(身)이란, 본원(本原)인 '나'일간(日干)의 몸(체,體)를 뜻하며, <span className="font-semibold text-text-light border-b border-accent-gold/40 pb-0.5">'나'가 기운을 활용하는 방향성을 세기 표기로 나타낸 것</span>입니다.
                  강약(强弱)으로 길흉(吉凶)을 완전히 판단하는 것은 불가하며, 이러한 판단은 위험합니다.
                </p>
                <p className="text-[12px] text-gray-400 bg-gray-50 p-2 rounded-lg mt-1">
                  위 3가지를 기준으로 총 7단계(극약~극왕)로 나의 에너지를 자세히 분류하지만, 통상 신강(身强)과 신약(身弱)으로 크게 구분합니다.
                </p>
              </div>
            )}
          </div>

          <p className="text-[13px] leading-[1.9] text-text-muted mb-5">
            신강(身强)과 신약(身弱)은 {userName}님의 기운이 외부로 소모가 큰지, 내부에 쌓여있는지를 나타내는 세기입니다.
            본원(本原) 즉, '나'를 뜻하는 일간(日干)의 오행(五行)을 기준으로 판단하며, 내부에 쌓여 '나'를 도와주는 기운은 '득(得)'했다고 하고,
            외부로 소모되는 기운은 '실(失)'했다고 합니다.
          </p>

          {/* 득령·득지·득세 시각화 — 가로형 */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {/* 일간 */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-accent-gold font-semibold">기준[{userName}]</span>
              <GanjiBadge char={pillars.day.gan} ohaeng={dayOhaeng} />
              <span className="text-[9px] text-transparent">-</span>
            </div>

            <span className="text-text-subtle text-sm">→</span>

            {/* 득령 */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-text-subtle">월지</span>
              <GanjiBadge char={pillars.month.ji} ohaeng={pillars.month.jiOhaeng} dimmed={!isDeukRyeong} />
              <span className={cn("text-[9px] font-semibold", isDeukRyeong ? "text-emerald-600" : "text-gray-300")}>
                {isDeukRyeong ? "득" : "실"}
              </span>
            </div>

            {/* 득지 */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-text-subtle">일지</span>
              <GanjiBadge char={pillars.day.ji} ohaeng={pillars.day.jiOhaeng} dimmed={!isDeukJi} />
              <span className={cn("text-[9px] font-semibold", isDeukJi ? "text-emerald-600" : "text-gray-300")}>
                {isDeukJi ? "득" : "실"}
              </span>
            </div>

            {/* 구분선 */}
            <div className="w-px h-8 bg-gray-200" />

            {/* 득세 */}
            {deukseItems.map(({ char, ohaeng, label, helps }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-text-subtle">세력</span>
                <GanjiBadge char={char} ohaeng={ohaeng} dimmed={!helps} />
                <span className={cn("text-[9px] font-semibold", helps ? "text-emerald-600" : "text-gray-300")}>
                  {helps ? "득" : "실"}
                </span>
              </div>
            ))}

            <span className="text-text-subtle text-sm">→</span>

            {/* 결과 */}
            <span className={cn(
              "text-[12px] font-semibold px-3 py-1 rounded-full border",
              wangseLevelStyle[wangseStrength.level] ?? "bg-gray-50 border-gray-200 text-gray-700"
            )}>
              {wangseStrength.level}
            </span>
          </div>

          <p className="text-[13px] leading-[1.9] text-text-muted">
            그러므로{" "}
            <span className="font-semibold text-text-light">{userName}</span>님의 사주는{" "}
            <span className="font-semibold text-text-light">{wangseStrength.level}</span>한 사주입니다.
            {" "}
            {isSingang ? (
              <>
                신강한 사주는 내부에 에너지를 쌓아 갈무리하는 방식을 너무나도 잘하지만, 외부로 발산하는 것은 잘 못하기에 운용방식에 있어서 {userName}님은 <span className="font-semibold text-accent-gold">{siksangOhaeng}, {jaeseongOhaeng}, {gwanseongOhaeng}</span> 기운을 활용하는 것 유리합니다.
              </>
            ) : (
              <>
                신약한 사주는 외부에서 에너지를 갈무리하는 방식을 너무나도 잘하지만, 내부로 수렴하는 것을 잘 못하기에 운용방식에 있어서 {userName}님은 <span className="font-semibold text-accent-gold">{inseongOhaeng}, {bigeobOhaeng}</span> 기운을 활용하는 것이 유리합니다.
              </>
            )}
          </p>
        </div>
      )}

      {/* 월지 */}
      <div className="border-t border-gray-100 pt-6 mb-6">
        <div className="relative inline-block" ref={woljiInfoRef}>
          <SectionHeader
            title="월령(月令)"
            rightElement={
              <button
                onClick={() => setShowWoljiInfo(!showWoljiInfo)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="월령 도움말"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            }
          />

          {showWoljiInfo && (
            <div className="absolute top-8 left-0 z-10 w-full min-w-[280px] sm:w-[320px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-[13px] leading-relaxed text-text-subtle">
              <p className="font-semibold text-text-light mb-1.5">월령(月令)이란</p>
              <p className="mb-3">
                월령(月令)은 월지(月支)의 다른 이름으로, <span className="font-semibold text-text-light border-b border-accent-gold/40 pb-0.5">사주를 주관하는 계절이자, 사주 전체에 명령을 내리는 강력한 기운</span>입니다.
                일간(日干)이 태어난 계절의 기운을 받아 도움을 얻으면, 주도권을 얻었다고 하여 <span className="font-semibold text-text-light">'득령(得令)'</span>, 그렇지 못하면 <span className="font-semibold text-text-light">'실령(失令)'</span>이라 합니다.
              </p>
              <p className="text-[12px] text-gray-400 bg-gray-50 p-2 rounded-lg mt-1">
                월지(月支)는 강약 판단의 중요한 기준이자, 대운(大運)의 필연적인 계절의 파노라마입니다.
              </p>
            </div>
          )}
        </div>

        <p className="text-[13px] leading-[1.9] text-text-muted mb-5">
          월지(月支)는 {userName}님이 태어난 달의 지지(地支)로, 그 계절(季節)의 기운을 사주 내에서 가장 강하게 발휘하는 자리입니다.
          일간(日干)의 오행(五行)이 월지의 기운에 의해 힘을 얻으면 '득령(得令)'이라 하고, 그렇지 못하면 '실령(失令)'이라 합니다.
        </p>

        {/* 월지 아이콘 + 지장간 한자 아이콘 */}
        <div className="grid grid-cols-[auto_auto_auto] gap-x-3 mb-6 justify-start items-center">

          {/* --- Row 1: Header Labels --- */}
          <div className="text-center pb-1.5 self-end">
            <span className="text-[10px] font-medium text-text-subtle">월지(月支)</span>
          </div>
          <div /> {/* 빈칸 */}
          <div className="text-center pb-1.5 self-end">
            <span className="text-[10px] font-medium text-text-subtle">지장간(地藏干)</span>
          </div>

          {/* --- Row 2: Badges & Box --- */}
          <div className="flex justify-center relative z-10">
            <GanjiBadge char={monthJi} ohaeng={monthJiOhaeng} size="lg" className="shadow-sm" />
          </div>

          <div className="flex justify-center text-gray-300 relative z-10">
            <ChevronRight className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-inner relative z-10">
            {jijangganOfMonth.map((stem, i) => (
              <GanjiBadge key={i} char={stem.gan} ohaeng={stem.ohaeng} size="md" className="bg-white shadow-sm" />
            ))}
          </div>

          {/* --- Row 3: Bottom Labels --- */}
          <div /> {/* 빈칸 */}
          <div /> {/* 빈칸 */}
          <div className="flex items-start gap-2 px-2 -mt-1 relative z-0 self-start">
            {jijangganOfMonth.map((stem, i) => {
              const isDng = i === dangnyeongIdx;
              const isSry = i === saryeongIdx;
              const label = isDng && isSry
                ? "당령·사령"
                : isDng ? "당령"
                  : isSry ? "사령"
                    : null;

              return (
                <div key={i} className="flex justify-center w-10">
                  {label ? (
                    <div className="flex flex-col items-center">
                      <div className="w-px h-3 bg-gray-200 mb-1" />
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border leading-tight whitespace-nowrap shadow-sm",
                        isDng && isSry ? "bg-amber-50 border-amber-200 text-amber-700"
                          : isSry ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                      )}>
                        {label}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* 당령 */}
        <div className="flex items-start gap-3 mb-4">
          <span className={cn(
            "flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border mt-0.5",
            isDangnyeongHelps
              ? (ohaengBadge[dangnyeongStem?.ohaeng ?? ""] ?? "bg-gray-50 border-gray-200 text-gray-700")
              : "bg-gray-50 border-gray-200 text-gray-400"
          )}>
            {userName} 당령(當令)
          </span>
          <p className="text-[13px] leading-[1.9] text-text-muted">
            {dangnyeongData ? (
              <>
                <span className="font-semibold text-text-light">{dangnyeongData.jeolgi}</span> 절기에 태어나,
                당령 천간은 <span className="font-semibold text-text-light">{dangnyeongHanja}({dangnyeongData.dangnyeongGan})</span>입니다.{" "}
                {isDangnyeongHelps ? (
                  <>당령 기운 {getOhaengSpan(dangnyeongStem?.ohaeng ?? "")}이 일간 {getOhaengSpan(dayOhaeng)}을 도와주므로, 절기의 기운이 {userName}님 편에 있습니다.</>
                ) : (
                  <>당령 기운 {getOhaengSpan(dangnyeongStem?.ohaeng ?? "")}이 일간 {getOhaengSpan(dayOhaeng)}을 돕지 않으므로, 절기의 기운이 {userName}님을 돕지 않습니다.</>
                )}
              </>
            ) : (
              <span className="text-gray-400">당령 데이터 없음</span>
            )}
          </p>
          {/* MySajuIntroV2 전용 당령 추가 해석 — server/src/data/interpretation/sipsin-v2.data.ts > MYSAJU_DANGNYEONG_INTERP 에서 수정 */}
          {interp?.mysajuDangnyeongText && (
            <p className="mt-2 text-[12px] leading-[1.85] text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              {interp.mysajuDangnyeongText}
            </p>
          )}
        </div>

        {/* 사령 */}
        <div className="flex items-start gap-3">
          <span className={cn(
            "flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border mt-0.5",
            isSaryeongHelps
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-gray-50 border-gray-200 text-gray-400"
          )}>
            {userName} 사령(司令)
          </span>
          <p className="text-[13px] leading-[1.9] text-text-muted">
            {saryeongData ? (
              <>
                절기 시작일로부터 <span className="font-semibold text-text-light">{saryeongData.daysFromStart}일</span> 경과,
                월지 {monthJi} 내 {ROLE_LABEL[saryeongData.role] ?? saryeongData.role} 구간의{" "}
                <span className="font-semibold text-text-light">{saryeongHanja}({saryeongData.saryeongGan})</span>이 사령(司令)하고 있습니다.{" "}
                {isSaryeongHelps ? (
                  <>사령 천간 {getOhaengSpan(saryeongStem?.ohaeng ?? "")} 기운이 일간 {getOhaengSpan(dayOhaeng)}을 도와주므로, 지장간의 실질 기운이 {userName}님에게 유리하게 작용합니다.</>
                ) : (
                  <>사령 천간 {getOhaengSpan(saryeongStem?.ohaeng ?? "")} 기운이 일간 {getOhaengSpan(dayOhaeng)}을 돕지 않으므로, 지장간의 실질 기운이 {userName}님에게 불리하게 작용합니다.</>
                )}
              </>
            ) : (
              <span className="text-gray-400">사령 데이터 없음</span>
            )}
          </p>
          {/* MySajuIntroV2 전용 사령 추가 해석 — server/src/data/interpretation/sipsin-v2.data.ts > MYSAJU_SARYEONG_INTERP 에서 수정 */}
          {interp?.mysajuSaryeongText && (
            <p className="mt-2 text-[12px] leading-[1.85] text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              {interp.mysajuSaryeongText}
            </p>
          )}
        </div>
      </div>
    </SectionFrame>
  );
};
