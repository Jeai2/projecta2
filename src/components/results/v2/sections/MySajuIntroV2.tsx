// src/components/results/v2/sections/MySajuIntroV2.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import { SectionFrame } from "../SectionFrame";
import { SajuPillarLight } from "../SajuPillarLight";
import { AlertCircle } from "lucide-react";
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

function GanjiBadge({ char, ohaeng, dimmed = false }: { char: string; ohaeng: string; dimmed?: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 font-myeongjo font-bold text-xl leading-none",
      dimmed
        ? "bg-gray-50 border-gray-100 text-gray-300"
        : (ohaengBadge[ohaeng] ?? "bg-gray-50 border-gray-200 text-gray-700")
    )}>
      {char}
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

export const MySajuIntroV2 = () => {
  const { fortuneResult } = useFortuneStore();

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

  const { pillars, wangseStrength } = fortuneResult.saju.sajuData;
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
        ㅇㅇㅇ
      </p>
      {/* 신강신약 */}
      {wangseStrength && (
        <div className="border-t border-gray-100 pt-6 mb-6">
          <SectionHeader title="신강신약" />

          <p className="text-[13px] leading-[1.9] text-text-muted mb-5">
            신강(身强)과 신약(身弱)은 {userName}님의 기운이 외부로 소모가 큰지, 내부에 쌓여있는지를 나타내는 세기입니다.
            본원(本原) 즉, '나'를 뜻하는 일간(日干)의 오행(五行)을 기준으로 판단합니다. 내부에 쌓여 '나'를 도와주는 기운은 '득(得)'했다고 하고,
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
            <span className="font-semibold text-text-light">{wangseStrength.level}</span> 사주입니다.{" "}
            {wangseStrength.levelDetail}
          </p>
        </div>
      )}
    </SectionFrame>
  );
};
