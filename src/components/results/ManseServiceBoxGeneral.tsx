import React, { useState } from "react";
import type { FortuneResponseData, SajuData } from "../../types/fortune.d.ts";

interface ManseServiceBoxGeneralProps {
  sajuData: FortuneResponseData["saju"]["sajuData"];
  userInfo: {
    name?: string;
    birthDate: string;
    gender: "M" | "W";
    birthPlace?: string;
    calendarType: "solar" | "lunar";
    birthTime?: string;
    timeUnknown?: boolean;
  };
  onReset: () => void;
}

const ManseServiceBoxGeneral: React.FC<ManseServiceBoxGeneralProps> = ({
  sajuData,
  userInfo,
  onReset,
}) => {
  const hasHour: boolean = Boolean(
    userInfo.timeUnknown === undefined
      ? userInfo.birthTime && userInfo.birthTime.trim() !== ""
      : !userInfo.timeUnknown
  );

  const formatDateLabel = (raw?: string) => {
    if (!raw) return "";
    const [y, m, d] = raw.split("-");
    if (!y || !m || !d) return raw;
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  };

  const convertToLunarDate = (solarDate: string, birthTime?: string) => {
    const date = new Date(solarDate);
    date.setDate(date.getDate() - 30);
    const lunarDate = date.toISOString().split("T")[0].replace(/-/g, "-");
    if (birthTime && birthTime.trim() !== "") {
      return `${lunarDate} ${birthTime}`;
    }
    return lunarDate;
  };

  const getLunarLabel = () => {
    const lunarRaw = convertToLunarDate(userInfo.birthDate, userInfo.birthTime);
    if (!lunarRaw) return "";
    const [datePart, timePart] = lunarRaw.split(" ");
    const formatted = formatDateLabel(datePart);
    return timePart ? `${formatted} ${timePart}` : formatted;
  };

  const userName =
    userInfo.name && userInfo.name.trim() !== "" ? userInfo.name : "사용자";
  const birthYear = Number(userInfo.birthDate?.split("-")[0] || 0);

  const pillars = (sajuData as SajuData)?.pillars;
  const GAN_HANJA_TO_HANGUL: Record<string, string> = {
    甲: "갑",
    乙: "을",
    丙: "병",
    丁: "정",
    戊: "무",
    己: "기",
    庚: "경",
    辛: "신",
    壬: "임",
    癸: "계",
  };
  const JI_HANJA_TO_HANGUL: Record<string, string> = {
    子: "자",
    丑: "축",
    寅: "인",
    卯: "묘",
    辰: "진",
    巳: "사",
    午: "오",
    未: "미",
    申: "신",
    酉: "유",
    戌: "술",
    亥: "해",
  };
  const toHangulGan = (value?: string) =>
    value ? GAN_HANJA_TO_HANGUL[value] || value : "";
  const toHangulJi = (value?: string) =>
    value ? JI_HANJA_TO_HANGUL[value] || value : "";
  const formatYongsinValue = (value?: string) =>
    value ? toHangulGan(value) : "—";
  const HANJA_TO_HANGUL: Record<string, string> = {
    ...GAN_HANJA_TO_HANGUL,
    ...JI_HANJA_TO_HANGUL,
  };
  const convertToHangul = (hanjaStr: string): string => {
    return hanjaStr
      .split("")
      .map((char) => HANJA_TO_HANGUL[char] || char)
      .join("");
  };
  const JIJANGGAN_DATA: {
    [key: string]: {
      초기?: { gan: string; days: number };
      중기?: { gan: string; days: number };
      정기?: { gan: string; days: number };
    };
  } = {
    자: {
      초기: { gan: "壬", days: 20 },
      정기: { gan: "癸", days: 10 },
    },
    축: {
      초기: { gan: "癸", days: 9 },
      중기: { gan: "辛", days: 3 },
      정기: { gan: "己", days: 18 },
    },
    인: {
      초기: { gan: "戊", days: 7 },
      중기: { gan: "丙", days: 7 },
      정기: { gan: "甲", days: 16 },
    },
    묘: {
      초기: { gan: "甲", days: 10 },
      정기: { gan: "乙", days: 20 },
    },
    진: {
      초기: { gan: "乙", days: 9 },
      중기: { gan: "癸", days: 3 },
      정기: { gan: "戊", days: 18 },
    },
    사: {
      초기: { gan: "戊", days: 7 },
      중기: { gan: "庚", days: 7 },
      정기: { gan: "丙", days: 16 },
    },
    오: {
      초기: { gan: "丙", days: 10 },
      정기: { gan: "丁", days: 20 },
    },
    미: {
      초기: { gan: "丁", days: 9 },
      중기: { gan: "乙", days: 3 },
      정기: { gan: "己", days: 18 },
    },
    신: {
      초기: { gan: "戊", days: 7 },
      중기: { gan: "壬", days: 7 },
      정기: { gan: "庚", days: 16 },
    },
    유: {
      초기: { gan: "庚", days: 10 },
      정기: { gan: "辛", days: 20 },
    },
    술: {
      초기: { gan: "辛", days: 9 },
      중기: { gan: "丁", days: 3 },
      정기: { gan: "戊", days: 18 },
    },
    해: {
      초기: { gan: "戊", days: 7 },
      중기: { gan: "甲", days: 7 },
      정기: { gan: "壬", days: 16 },
    },
  };
  const getJijangganForJi = (jiHanja?: string) => {
    const jiHangul = toHangulJi(jiHanja);
    const data = JIJANGGAN_DATA[jiHangul];
    if (!data) return { 초기: "-", 중기: "-", 정기: "-" };
    return {
      초기: data.초기?.gan || "-",
      중기: "중기" in data ? data.중기?.gan || "-" : "-",
      정기: data.정기?.gan || "-",
    };
  };
  const dayGan = pillars?.day?.gan || "";
  const SIPSIN_TABLE_H: Record<string, Record<string, string>> = {
    甲: {
      甲: "비견",
      乙: "겁재",
      丙: "식신",
      丁: "상관",
      戊: "편재",
      己: "정재",
      庚: "편관",
      辛: "정관",
      壬: "편인",
      癸: "정인",
    },
    乙: {
      乙: "비견",
      甲: "겁재",
      丁: "식신",
      丙: "상관",
      己: "편재",
      戊: "정재",
      辛: "편관",
      庚: "정관",
      癸: "편인",
      壬: "정인",
    },
    丙: {
      丙: "비견",
      丁: "겁재",
      戊: "식신",
      己: "상관",
      庚: "편재",
      辛: "정재",
      壬: "편관",
      癸: "정관",
      甲: "편인",
      乙: "정인",
    },
    丁: {
      丁: "비견",
      丙: "겁재",
      己: "식신",
      戊: "상관",
      辛: "편재",
      庚: "정재",
      癸: "편관",
      壬: "정관",
      乙: "편인",
      甲: "정인",
    },
    戊: {
      戊: "비견",
      己: "겁재",
      庚: "식신",
      辛: "상관",
      壬: "편재",
      癸: "정재",
      甲: "편관",
      乙: "정관",
      丙: "편인",
      丁: "정인",
    },
    己: {
      己: "비견",
      戊: "겁재",
      辛: "식신",
      庚: "상관",
      癸: "편재",
      壬: "정재",
      乙: "편관",
      甲: "정관",
      丁: "편인",
      丙: "정인",
    },
    庚: {
      庚: "비견",
      辛: "겁재",
      壬: "식신",
      癸: "상관",
      甲: "편재",
      乙: "정재",
      丙: "편관",
      丁: "정관",
      戊: "편인",
      己: "정인",
    },
    辛: {
      辛: "비견",
      庚: "겁재",
      癸: "식신",
      壬: "상관",
      乙: "편재",
      甲: "정재",
      丁: "편관",
      丙: "정관",
      己: "편인",
      戊: "정인",
    },
    壬: {
      壬: "비견",
      癸: "겁재",
      甲: "식신",
      乙: "상관",
      丙: "편재",
      丁: "정재",
      戊: "편관",
      己: "정관",
      庚: "편인",
      辛: "정인",
    },
    癸: {
      癸: "비견",
      壬: "겁재",
      乙: "식신",
      甲: "상관",
      丁: "편재",
      丙: "정재",
      己: "편관",
      戊: "정관",
      辛: "편인",
      庚: "정인",
    },
  };
  const getSipsinForGan = (targetGan?: string) =>
    dayGan && targetGan ? SIPSIN_TABLE_H[dayGan]?.[targetGan] || "" : "";
  const columns = [
    {
      title: "시주",
      gan: hasHour ? toHangulGan(pillars?.hour?.gan) : "",
      ji: hasHour ? toHangulJi(pillars?.hour?.ji) : "",
      ganRaw: hasHour ? pillars?.hour?.gan || "" : "",
      jiRaw: hasHour ? pillars?.hour?.ji || "" : "",
      ganSipsin: hasHour ? pillars?.hour?.ganSipsin || "" : "",
      jiSipsin: hasHour ? pillars?.hour?.jiSipsin || "" : "",
      sibiwunseong: hasHour ? pillars?.hour?.sibiwunseong || "" : "",
    },
    {
      title: "일주",
      gan: toHangulGan(pillars?.day?.gan),
      ji: toHangulJi(pillars?.day?.ji),
      ganRaw: pillars?.day?.gan || "",
      jiRaw: pillars?.day?.ji || "",
      ganSipsin: pillars?.day?.ganSipsin || "",
      jiSipsin: pillars?.day?.jiSipsin || "",
      sibiwunseong: pillars?.day?.sibiwunseong || "",
    },
    {
      title: "월주",
      gan: toHangulGan(pillars?.month?.gan),
      ji: toHangulJi(pillars?.month?.ji),
      ganRaw: pillars?.month?.gan || "",
      jiRaw: pillars?.month?.ji || "",
      ganSipsin: pillars?.month?.ganSipsin || "",
      jiSipsin: pillars?.month?.jiSipsin || "",
      sibiwunseong: pillars?.month?.sibiwunseong || "",
    },
    {
      title: "년주",
      gan: toHangulGan(pillars?.year?.gan),
      ji: toHangulJi(pillars?.year?.ji),
      ganRaw: pillars?.year?.gan || "",
      jiRaw: pillars?.year?.ji || "",
      ganSipsin: pillars?.year?.ganSipsin || "",
      jiSipsin: pillars?.year?.jiSipsin || "",
      sibiwunseong: pillars?.year?.sibiwunseong || "",
    },
  ];

  const hanjaToOhaeng: { [key: string]: string } = {
    甲: "木",
    乙: "木",
    丙: "火",
    丁: "火",
    戊: "土",
    己: "土",
    庚: "金",
    辛: "金",
    壬: "水",
    癸: "水",
    子: "水",
    丑: "土",
    寅: "木",
    卯: "木",
    辰: "土",
    巳: "火",
    午: "火",
    未: "土",
    申: "金",
    酉: "金",
    戌: "土",
    亥: "水",
  };
  const ohaengColors: { [key: string]: string } = {
    木: "text-green-600",
    火: "text-red-600",
    土: "text-yellow-600",
    金: "text-gray-600",
    水: "text-blue-600",
  };
  const getOhaengColor = (character: string) => {
    const ohaeng = hanjaToOhaeng[character];
    return ohaengColors[ohaeng] || "text-gray-600";
  };

  const [selectedDaewoonIndex, setSelectedDaewoonIndex] = useState<
    number | null
  >(null);
  const [summaryTab, setSummaryTab] = useState<
    "sinsal" | "relations" | "gongmang"
  >("sinsal");
  const [sinsalPillars, setSinsalPillars] = useState<{
    year: boolean;
    day: boolean;
  }>({ year: false, day: true });
  const [sewoonData, setSewoonData] = useState<Array<{
    year: number;
    ganji: string;
    ganSipsin: string;
    jiSipsin: string;
    sibiwunseong: string;
  }> | null>(null);
  const [loadingSewoon, setLoadingSewoon] = useState(false);

  const fetchSewoonData = async (daewoonStartYear: number, dayGan: string) => {
    setLoadingSewoon(true);
    try {
      const response = await fetch(
        `/api/fortune/sewoon?daewoonStartYear=${daewoonStartYear}&dayGan=${dayGan}`
      );
      const data = await response.json();
      if (data.data && data.data.sewoonData) {
        setSewoonData(data.data.sewoonData);
      }
    } catch (error) {
      console.error("세운 데이터 가져오기 실패:", error);
    } finally {
      setLoadingSewoon(false);
    }
  };

  const handleDaewoonSelect = (index: number) => {
    setSelectedDaewoonIndex(index);
    const daewoonStartYear = (sajuData as SajuData).daewoonFull[index].year;
    fetchSewoonData(daewoonStartYear, (sajuData as SajuData).pillars.day.gan);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
        >
          ← 다시 입력
        </button>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-accent-gold">{userName}</span>님의 사주원국
            </h1>
            <div className="mt-1 text-sm text-gray-500">
              {userInfo.gender === "M" ? "남성" : "여성"}
              {" · "}
              양력 {formatDateLabel(userInfo.birthDate)}
              {" · "}
              음력 {getLunarLabel() || "-"}
              {userInfo.birthPlace && userInfo.birthPlace.trim() !== "" && (
                <>
                  {" · "}
                  {userInfo.birthPlace} 출생
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          사주원국표
        </h2>
        <div className="grid grid-cols-5 gap-2">
          <div className="rounded-lg bg-gray-50 text-center text-sm font-semibold text-gray-700 py-2"></div>
          {columns.map((col) => (
            <div
              key={`header-${col.title}`}
              className="rounded-lg bg-gray-50 text-center text-sm font-semibold text-gray-700 py-2"
            >
              {col.title}
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            십성
          </div>
          {columns.map((col, index) => (
            <div
              key={`ganSipsin-${index}`}
              className="rounded-lg border border-gray-200 bg-white text-center text-xs font-medium text-gray-600 py-2"
            >
              {col.ganSipsin || "—"}
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            천간
          </div>
          {columns.map((col, index) => (
            <div
              key={`gan-${index}`}
              className={`rounded-lg border border-gray-200 bg-white text-center text-xl font-bold py-3 ${getOhaengColor(
                col.ganRaw
              )}`}
            >
              {col.gan || "—"}
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            지지
          </div>
          {columns.map((col, index) => (
            <div
              key={`ji-${index}`}
              className={`rounded-lg border border-gray-200 bg-white text-center text-xl font-bold py-3 ${getOhaengColor(
                col.jiRaw
              )}`}
            >
              {col.ji || "—"}
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            십성
          </div>
          {columns.map((col, index) => (
            <div
              key={`jiSipsin-${index}`}
              className="rounded-lg border border-gray-200 bg-white text-center text-xs font-medium text-gray-600 py-2"
            >
              {col.jiSipsin || "—"}
            </div>
          ))}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            지장간
          </div>
          {columns.map((col, index) => {
            const jijanggan = getJijangganForJi(col.jiRaw);
            return (
              <div
                key={`jijanggan-${index}`}
                className="rounded-lg border border-gray-200 bg-white text-center text-xs font-medium text-gray-600 py-2 space-y-1"
              >
                {(
                  [jijanggan.초기, jijanggan.중기, jijanggan.정기] as string[]
                ).map((gan, ganIndex) => {
                  if (!gan || gan === "-") {
                    return (
                      <div key={`jij-${ganIndex}`} className="text-gray-400">
                        —
                      </div>
                    );
                  }
                  const sipsin = getSipsinForGan(gan);
                  return (
                    <div
                      key={`jij-${ganIndex}`}
                      className="flex justify-center gap-1"
                    >
                      <span className={getOhaengColor(gan)}>
                        {toHangulGan(gan)}
                      </span>
                      <span className="text-gray-500">{sipsin || "-"}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="rounded-lg bg-gray-50 text-center text-xs font-semibold text-gray-600 py-2">
            십이운성
          </div>
          {columns.map((col, index) => (
            <div
              key={`sibi-${index}`}
              className="rounded-lg border border-gray-200 bg-white text-center text-xs font-medium text-gray-600 py-2"
            >
              {col.sibiwunseong || "—"}
            </div>
          ))}
        </div>
        {!hasHour && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            시간 미입력으로 시주가 비어 있습니다.
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">사주원국 파악</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
          <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-indigo-200 from-indigo-50 via-white to-indigo-100">
            <div className="text-xs text-gray-500 mb-1">신강신약</div>
            <div className="font-semibold text-gray-800">
              {(sajuData as SajuData)?.wangseStrength?.levelDetail || "—"}{" "}
              <span className="text-gray-400">
                (
                {(sajuData as SajuData)?.wangseStrength?.finalScore !==
                undefined
                  ? Math.round(
                      (sajuData as SajuData).wangseStrength!.finalScore
                    )
                  : "—"}
                /35)
              </span>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-indigo-200 from-indigo-50 via-white to-indigo-100">
            <div className="text-xs text-gray-500 mb-1">억부/조후용신</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-gray-500">억부</span>
              <span className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-xs font-semibold text-gray-800">
                {formatYongsinValue(
                  (sajuData as SajuData)?.yongsin?.allAnalyses?.find(
                    (analysis) => analysis.name === "억부용신"
                  )?.yongsin
                )}
              </span>
              <span className="h-3 w-px bg-indigo-200" />
              <span className="text-gray-500">조후</span>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {formatYongsinValue(
                  (sajuData as SajuData)?.yongsin?.allAnalyses?.find(
                    (analysis) => analysis.name === "조후용신"
                  )?.yongsin
                )}
              </span>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-indigo-200 from-indigo-50 via-white to-indigo-100">
            <div className="text-xs text-gray-500 mb-1">격국</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-xs font-semibold text-gray-800">
                {(sajuData as SajuData)?.gyeokguk?.gyeokguk?.name || "—"}
              </span>
              <span className="h-3 w-px bg-indigo-200" />
              <span className="text-gray-500">용신</span>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {(sajuData as SajuData)?.gyeokguk?.yongsinType || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setSummaryTab("sinsal")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                summaryTab === "sinsal"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              신살
            </button>
            <button
              onClick={() => setSummaryTab("relations")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                summaryTab === "relations"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              형충회합
            </button>
            <button
              onClick={() => setSummaryTab("gongmang")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                summaryTab === "gongmang"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              공망
            </button>
          </div>

          <div className="rounded-lg bg-white border border-gray-200 p-4 text-sm text-gray-700">
            {summaryTab === "sinsal" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">신살 기준</span>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sinsalPillars.year}
                        onChange={(e) =>
                          setSinsalPillars((prev) => ({
                            ...prev,
                            year: e.target.checked,
                          }))
                        }
                      />
                      년주
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sinsalPillars.day}
                        onChange={(e) =>
                          setSinsalPillars((prev) => ({
                            ...prev,
                            day: e.target.checked,
                          }))
                        }
                      />
                      일주
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const sinsalMap = (sajuData as SajuData)
                      ?.sinsal as unknown as Record<
                      string,
                      Array<{ name: string }>
                    > | null;
                    const list = [
                      ...(sinsalPillars.year ? sinsalMap?.year || [] : []),
                      ...(sinsalPillars.day ? sinsalMap?.day || [] : []),
                    ];
                    const uniqueNames = Array.from(
                      new Set(list.map((item) => item.name).filter(Boolean))
                    );
                    if (uniqueNames.length === 0) {
                      return (
                        <span className="text-xs text-gray-500">
                          해당 기준 신살이 없습니다.
                        </span>
                      );
                    }
                    return uniqueNames.map((name) => (
                      <span
                        key={`sinsal-${name}`}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        {name}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            )}
            {summaryTab === "relations" && (
              <div className="space-y-3">
                <div className="text-xs text-gray-500">형충회합</div>
                {(() => {
                  const relationships = (sajuData as SajuData)
                    ?.relationships as Record<string, string[]> | null;
                  if (!relationships) {
                    return <div className="text-sm text-gray-500">없음</div>;
                  }
                  const relationMeta: Record<
                    string,
                    { icon: string; className: string; suffix: string }
                  > = {
                    cheonganhap: {
                      icon: "🔒",
                      className:
                        "bg-stone-100 text-emerald-800 border-emerald-200",
                      suffix: "합",
                    },
                    cheonganchung: {
                      icon: "🔓",
                      className: "bg-stone-100 text-rose-800 border-rose-200",
                      suffix: "충",
                    },
                    yukhap: {
                      icon: "💑",
                      className: "bg-green-100 text-green-800 border-green-200",
                      suffix: "육합",
                    },
                    samhap: {
                      icon: "⚙️",
                      className: "bg-green-100 text-blue-800 border-blue-200",
                      suffix: "삼합",
                    },
                    amhap: {
                      icon: "🌑",
                      className:
                        "bg-green-100 text-indigo-800 border-indigo-200",
                      suffix: "암합",
                    },
                    banghap: {
                      icon: "👪",
                      className: "bg-green-100 text-teal-800 border-teal-200",
                      suffix: "방합",
                    },
                    yukchung: {
                      icon: "⚡",
                      className: "bg-green-100 text-red-800 border-red-200",
                      suffix: "충",
                    },
                    yukhyung: {
                      icon: "⚔️",
                      className:
                        "bg-green-100 text-orange-800 border-orange-200",
                      suffix: "형",
                    },
                    yukpa: {
                      icon: "💥",
                      className:
                        "bg-green-100 text-purple-800 border-purple-200",
                      suffix: "파",
                    },
                    yukae: {
                      icon: "☠️",
                      className: "bg-green-100 text-gray-800 border-gray-200",
                      suffix: "해",
                    },
                  };
                  const badges: React.ReactElement[] = [];
                  Object.entries(relationMeta).forEach(([key, meta]) => {
                    const items = relationships[key] || [];
                    items.forEach((rel, index) => {
                      const ganji = rel.split("(")[0];
                      const hangul = convertToHangul(ganji);
                      badges.push(
                        <span
                          key={`${key}-${ganji}-${index}`}
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${meta.className}`}
                        >
                          {meta.icon}
                          {hangul}
                          {meta.suffix}
                        </span>
                      );
                    });
                  });
                  if (badges.length === 0) {
                    return <div className="text-sm text-gray-500">없음</div>;
                  }
                  return <div className="flex flex-wrap gap-1">{badges}</div>;
                })()}
              </div>
            )}
            {summaryTab === "gongmang" && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">공망</span>
                <span className="font-semibold text-gray-900">
                  {(() => {
                    const gongmangList = (
                      sajuData as unknown as { gongmang?: string[] }
                    ).gongmang;
                    return gongmangList && gongmangList.length > 0
                      ? gongmangList.join(", ")
                      : "—";
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          대운표
        </h2>
        <div className="grid grid-cols-10 gap-2">
          {(sajuData as SajuData)?.daewoonFull
            ?.slice()
            .reverse()
            .map((daewoon, index) => {
              const originalIndex =
                (sajuData as SajuData).daewoonFull.length - 1 - index;
              const isSelected = originalIndex === selectedDaewoonIndex;
              return (
                <div
                  key={originalIndex}
                  onClick={() => handleDaewoonSelect(originalIndex)}
                  className={`cursor-pointer rounded-lg border p-2 text-center transition ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {birthYear ? `${daewoon.year - birthYear + 1}세` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {daewoon.sipsin.gan || "-"}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      daewoon.ganji[0]
                    )}`}
                  >
                    {toHangulGan(daewoon.ganji[0])}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      daewoon.ganji[1]
                    )}`}
                  >
                    {toHangulJi(daewoon.ganji[1])}
                  </div>
                  <div className="text-xs text-gray-500">
                    {daewoon.sipsin.ji || "-"}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          세운표
        </h2>
        {loadingSewoon ? (
          <div className="text-center text-sm text-gray-500 py-6">
            세운 데이터를 불러오는 중...
          </div>
        ) : !sewoonData ? (
          <div className="text-center text-sm text-gray-500 py-6">
            대운을 선택하면 해당 기간의 세운표가 표시됩니다.
          </div>
        ) : (
          <div className="grid grid-cols-10 gap-2">
            {sewoonData.map((sewoon) => (
              <div
                key={sewoon.year}
                className="rounded-lg border border-gray-200 p-2 text-center"
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {sewoon.year}년
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {sewoon.ganSipsin || "-"}
                </div>
                <div
                  className={`text-sm font-bold mb-1 ${getOhaengColor(
                    sewoon.ganji[0]
                  )}`}
                >
                  {toHangulGan(sewoon.ganji[0])}
                </div>
                <div
                  className={`text-sm font-bold mb-1 ${getOhaengColor(
                    sewoon.ganji[1]
                  )}`}
                >
                  {toHangulJi(sewoon.ganji[1])}
                </div>
                <div className="text-xs text-gray-500">
                  {sewoon.jiSipsin || "-"}
                </div>
                <div className="text-[11px] text-gray-400">
                  {sewoon.sibiwunseong || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManseServiceBoxGeneral;
