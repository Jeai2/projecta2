import React, { useState } from "react";
import type {
  FortuneResponseData,
  WoolwoonData,
  SajuData,
} from "../../types/fortune.d.ts";

interface ManseServiceBoxProps {
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

const ManseServiceBox: React.FC<ManseServiceBoxProps> = ({
  sajuData,
  userInfo,
  onReset,
}) => {
  console.log("🔍 ManseServiceBox에서 받은 userInfo:", userInfo);

  // 시간 입력 여부(시주 표시/필터 반영 용도)
  const hasHour: boolean = Boolean(
    userInfo.timeUnknown === undefined
      ? userInfo.birthTime && userInfo.birthTime.trim() !== ""
      : !userInfo.timeUnknown
  );

  // 대운 선택 상태 관리
  const [selectedDaewoonIndex, setSelectedDaewoonIndex] = useState<
    number | null
  >(null);

  // 세운 데이터 상태 관리
  const [sewoonData, setSewoonData] = useState<Array<{
    year: number;
    ganji: string;
    ganSipsin: string;
    jiSipsin: string;
    sibiwunseong: string;
  }> | null>(null);

  const [loadingSewoon, setLoadingSewoon] = useState(false);

  // 월운 데이터 상태 관리
  const [woolwoonData, setWoolwoonData] = useState<WoolwoonData[] | null>(null);

  const [loadingWoolwoon, setLoadingWoolwoon] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 대운/세운 관계 데이터 상태 관리
  const [daewoonRelationships, setDaewoonRelationships] =
    useState<unknown>(null);
  const [sewoonRelationships, setSewoonRelationships] = useState<unknown>(null);

  // 선택된 신살 강조 상태 관리
  const [selectedSinsalElements, setSelectedSinsalElements] = useState<
    | {
        pillar: string;
        character: string;
      }[]
    | null
  >(null);

  // 관계 모드 선택 상태 관리
  const [relationshipMode, setRelationshipMode] = useState<
    "original" | "daewoon" | "sewoon"
  >("original");

  // 신살 요약 배지 상태 (대운/세운)
  const [daewoonSinsalNames, setDaewoonSinsalNames] = useState<string[] | null>(
    null
  );
  const [sewoonSinsalNames, setSewoonSinsalNames] = useState<string[] | null>(
    null
  );

  // 운별 신살 원본 결과 저장 (서버 응답 그대로 보관)
  const [daewoonSinsalResult, setDaewoonSinsalResult] = useState<Record<
    string,
    Array<{
      name: string;
      elements?: Array<{ pillar?: string }>;
      category?: string;
    }>
  > | null>(null);

  const yongsinData = (sajuData as SajuData)?.yongsin;
  const jinsinResult = (sajuData as SajuData)?.jinsin;

  const GAN_TO_OHAENG_KOR: Record<string, string> = {
    甲: "목",
    乙: "목",
    丙: "화",
    丁: "화",
    戊: "토",
    己: "토",
    庚: "금",
    辛: "금",
    壬: "수",
    癸: "수",
  };

  const GAN_TO_LABEL: Record<string, string> = {
    甲: "갑목",
    乙: "을목",
    丙: "병화",
    丁: "정화",
    戊: "무토",
    己: "기토",
    庚: "경금",
    辛: "신금",
    壬: "임수",
    癸: "계수",
  };

  const CATEGORY_LABELS: Array<{
    key: "hui" | "gi" | "gu" | "han";
    label: string;
  }> = [
    { key: "hui", label: "희신" },
    { key: "gi", label: "기신" },
    { key: "gu", label: "구신" },
    { key: "han", label: "한신" },
  ];

  type YongsinCardKey = "yongsin" | "hui" | "gi" | "gu" | "han";

  interface CardStyle {
    gradient: string;
    border: string;
    pillClass: string;
    valueClass: string;
  }

  const BASE_CARD_STYLE: Record<YongsinCardKey, CardStyle> = {
    yongsin: {
      gradient: "from-emerald-50 via-white to-emerald-100",
      border: "border-emerald-200",
      pillClass: "border border-emerald-200 bg-emerald-500/10 text-emerald-600",
      valueClass: "text-emerald-800",
    },
    hui: {
      gradient: "from-sky-50 via-white to-cyan-100",
      border: "border-sky-200",
      pillClass: "border border-sky-200 bg-sky-500/10 text-sky-600",
      valueClass: "text-sky-700",
    },
    gi: {
      gradient: "from-rose-50 via-white to-rose-100",
      border: "border-rose-200",
      pillClass: "border border-rose-200 bg-rose-500/10 text-rose-600",
      valueClass: "text-rose-700",
    },
    gu: {
      gradient: "from-amber-50 via-white to-amber-100",
      border: "border-amber-200",
      pillClass: "border border-amber-200 bg-amber-500/10 text-amber-600",
      valueClass: "text-amber-700",
    },
    han: {
      gradient: "from-slate-50 via-white to-gray-100",
      border: "border-slate-200",
      pillClass: "border border-slate-200 bg-slate-500/10 text-slate-600",
      valueClass: "text-slate-700",
    },
  };

  const ELEMENT_CARD_STYLE: Record<string, CardStyle> = {
    목: {
      gradient: "from-emerald-50 via-white to-emerald-100",
      border: "border-emerald-200",
      pillClass: "border border-emerald-200 bg-emerald-500/10 text-emerald-600",
      valueClass: "text-emerald-700",
    },
    화: {
      gradient: "from-rose-50 via-white to-rose-100",
      border: "border-rose-200",
      pillClass: "border border-rose-200 bg-rose-500/10 text-rose-600",
      valueClass: "text-rose-700",
    },
    토: {
      gradient: "from-amber-50 via-white to-amber-100",
      border: "border-amber-200",
      pillClass: "border border-amber-200 bg-amber-500/10 text-amber-600",
      valueClass: "text-amber-700",
    },
    금: {
      gradient: "from-slate-50 via-white to-slate-100",
      border: "border-slate-200",
      pillClass: "border border-slate-200 bg-slate-500/10 text-slate-600",
      valueClass: "text-slate-700",
    },
    수: {
      gradient: "from-sky-50 via-white to-sky-100",
      border: "border-sky-200",
      pillClass: "border border-sky-200 bg-sky-500/10 text-sky-600",
      valueClass: "text-sky-700",
    },
  };

  type GyeokgukCardKey =
    | "name"
    | "wollyeong"
    | "dangnyeong"
    | "saryeong"
    | "jinsin"
    | "gasin";

  const GYEOKGUK_CARD_META: Record<GyeokgukCardKey, CardStyle> = {
    name: {
      gradient: "from-indigo-50 via-white to-indigo-100",
      border: "border-indigo-200",
      pillClass: "border border-indigo-200 bg-indigo-500/10 text-indigo-600",
      valueClass: "text-indigo-700",
    },
    wollyeong: {
      gradient: "from-orange-50 via-white to-orange-100",
      border: "border-orange-200",
      pillClass: "border border-orange-200 bg-orange-500/10 text-orange-600",
      valueClass: "text-orange-700",
    },
    dangnyeong: {
      gradient: "from-amber-50 via-white to-amber-100",
      border: "border-amber-200",
      pillClass: "border border-amber-200 bg-amber-500/10 text-amber-600",
      valueClass: "text-amber-700",
    },
    saryeong: {
      gradient: "from-yellow-50 via-white to-yellow-100",
      border: "border-yellow-200",
      pillClass: "border border-yellow-200 bg-yellow-500/10 text-yellow-600",
      valueClass: "text-yellow-700",
    },
    jinsin: {
      gradient: "from-emerald-50 via-white to-emerald-100",
      border: "border-emerald-200",
      pillClass: "border border-emerald-200 bg-emerald-500/10 text-emerald-600",
      valueClass: "text-emerald-700",
    },
    gasin: {
      gradient: "from-sky-50 via-white to-sky-100",
      border: "border-sky-200",
      pillClass: "border border-sky-200 bg-sky-500/10 text-sky-600",
      valueClass: "text-sky-700",
    },
  };

  const OHAENG_TO_HANJA: Record<string, string> = {
    목: "木",
    화: "火",
    토: "土",
    금: "金",
    수: "水",
  };

  const HANJA_TO_OHAENG_KOR: Record<string, string> = {
    木: "목",
    火: "화",
    土: "토",
    金: "금",
    水: "수",
  };

  const OHAENG_COLOR_CLASS: Record<string, string> = {
    목: "text-green-600",
    화: "text-red-500",
    토: "text-amber-600",
    금: "text-slate-600",
    수: "text-blue-600",
  };

  const primaryYongsinHanja = yongsinData?.primaryYongsin || "";
  const primaryOhaengKor = primaryYongsinHanja
    ? GAN_TO_OHAENG_KOR[primaryYongsinHanja] || ""
    : "";
  const primaryOhaengHanja = primaryOhaengKor
    ? OHAENG_TO_HANJA[primaryOhaengKor] || ""
    : "";
  const primaryYongsinLabel = primaryYongsinHanja
    ? primaryOhaengHanja
      ? `${primaryYongsinHanja} (${primaryOhaengHanja})`
      : primaryYongsinHanja
    : "-";

  const categoryElements = CATEGORY_LABELS.reduce<Record<string, string>>(
    (acc, { key }) => {
      acc[key] = "-";
      return acc;
    },
    {}
  );

  if (primaryOhaengKor) {
    const PRODUCED_BY: Record<string, string> = {
      목: "수",
      화: "목",
      토: "화",
      금: "토",
      수: "금",
    };

    const CONTROLLED_BY: Record<string, string> = {
      목: "금",
      화: "수",
      토: "목",
      금: "화",
      수: "토",
    };

    const setCategoryElement = (
      key: "hui" | "gi" | "gu" | "han",
      elementKor?: string
    ) => {
      if (!elementKor) return;
      categoryElements[key] = OHAENG_TO_HANJA[elementKor] || elementKor || "-";
    };

    const huiElement = PRODUCED_BY[primaryOhaengKor];
    setCategoryElement("hui", huiElement);

    const giElement = CONTROLLED_BY[primaryOhaengKor];
    setCategoryElement("gi", giElement);

    if (giElement) {
      setCategoryElement("gu", PRODUCED_BY[giElement]);
      setCategoryElement("han", CONTROLLED_BY[giElement]);
    }
  }

  const renderGanChips = (list?: string[]) => {
    if (!list || list.length === 0) {
      return (
        <span className="inline-flex items-center justify-center rounded-md border border-dashed border-gray-300 px-2 py-1 text-[12px] font-medium text-gray-400">
          —
        </span>
      );
    }

    return list.map((gan, index) => {
      const element = GAN_TO_OHAENG_KOR[gan] || "";
      const colorClass =
        element && OHAENG_COLOR_CLASS[element]
          ? OHAENG_COLOR_CLASS[element]
          : "text-gray-800";

      return (
        <span
          key={`${gan}-${index}`}
          className={`inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/80 px-2 py-1 text-[12px] font-semibold ${colorClass}`}
          title={element ? `${gan} · ${element}` : gan}
        >
          {gan}
        </span>
      );
    });
  };

  const getCardStyle = (
    key: YongsinCardKey,
    elementKor: string | null
  ): CardStyle => {
    const base = BASE_CARD_STYLE[key];
    if (!elementKor) return base;
    const elementStyle = ELEMENT_CARD_STYLE[elementKor];
    if (!elementStyle) return base;
    return elementStyle;
  };

  // 분석 드롭박스 섹션 상태 관리
  const [expandedSections, setExpandedSections] = useState<{
    wangse: boolean;
    yongsin: boolean;
    gyeokguk: boolean;
  }>({
    wangse: false,
    yongsin: false,
    gyeokguk: false,
  });
  const [sewoonSinsalResult, setSewoonSinsalResult] = useState<Record<
    string,
    Array<{
      name: string;
      elements?: Array<{ pillar?: string }>;
      category?: string;
    }>
  > | null>(null);

  // 필터 상태: 표기 대상 기둥(년/월/일/시)
  const [pillarFilters, setPillarFilters] = useState({
    year: true,
    month: true,
    day: true,
    hour: Boolean(userInfo.birthTime && userInfo.birthTime.trim() !== ""),
  });
  // 운 전용 토글 제거: 대운/세운 탭 자체가 운 전용 의미

  // 지장간 데이터 (백엔드와 동일하게 한자로 변환)
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

  // 세운 데이터 가져오기
  const fetchSewoonData = async (daewoonStartYear: number, dayGan: string) => {
    setLoadingSewoon(true);
    try {
      const response = await fetch(
        `/api/fortune/sewoon?daewoonStartYear=${daewoonStartYear}&dayGan=${dayGan}`
      );
      const data = await response.json();
      console.log(
        "🔍 세운 데이터 받음:",
        data,
        "타입:",
        typeof data,
        "배열인가?",
        Array.isArray(data)
      );

      // API 응답 구조 확인
      console.log("🔍 data.data:", data.data);
      console.log("🔍 data.data.sewoonData:", data.data?.sewoonData);

      // 올바른 경로로 데이터 설정
      if (data.data && data.data.sewoonData) {
        setSewoonData(data.data.sewoonData);
        console.log("🔍 sewoonData 설정 완료:", data.data.sewoonData);
      } else {
        console.error("🔍 sewoonData를 찾을 수 없음:", data);
      }
    } catch (error) {
      console.error("세운 데이터 가져오기 실패:", error);
    } finally {
      setLoadingSewoon(false);
    }
  };

  // 월운 데이터 가져오기
  const fetchWoolwoonData = async (year: number, dayGan: string) => {
    setLoadingWoolwoon(true);
    try {
      const response = await fetch(
        `/api/fortune/woolwoon?year=${year}&dayGan=${dayGan}`
      );
      const data = await response.json();
      console.log(
        "🔍 월운 데이터 받음:",
        data,
        "타입:",
        typeof data,
        "배열인가?",
        Array.isArray(data)
      );

      // API 응답 구조 확인
      console.log("🔍 data.data:", data.data);
      console.log("🔍 data.data.woolwoonData:", data.data?.woolwoonData);

      // 올바른 경로로 데이터 설정
      if (data.data && data.data.woolwoonData) {
        setWoolwoonData(data.data.woolwoonData);
        console.log("🔍 woolwoonData 설정 완료:", data.data.woolwoonData);
      } else {
        console.error("🔍 woolwoonData를 찾을 수 없음:", data);
      }
    } catch (error) {
      console.error("월운 데이터 가져오기 실패:", error);
    } finally {
      setLoadingWoolwoon(false);
    }
  };

  // 대운 관계 데이터 가져오기
  const fetchDaewoonRelationships = async (daewoonGanji: string) => {
    try {
      const pillars = {
        year: sajuData.pillars.year.gan + sajuData.pillars.year.ji,
        month: sajuData.pillars.month.gan + sajuData.pillars.month.ji,
        day: sajuData.pillars.day.gan + sajuData.pillars.day.ji,
        hour: sajuData.pillars.hour.gan + sajuData.pillars.hour.ji,
      };

      const response = await fetch(
        `/api/fortune/daewoon-relationships?daewoonGanji=${daewoonGanji}&sajuPillars=${JSON.stringify(
          pillars
        )}`
      );
      const data = await response.json();

      if (data.error === false) {
        setDaewoonRelationships(data.data.relationships);
        // 신살 요약 수신 처리 (있을 경우)
        if (data.data.sinsal) {
          setDaewoonSinsalResult(data.data.sinsal);
          const hits = extractUniqueSinsalHitsFromResult(data.data.sinsal);
          setDaewoonSinsalNames(hits.map((h) => h.name));
        } else {
          setDaewoonSinsalResult(null);
          setDaewoonSinsalNames(null);
        }
      }
    } catch (error) {
      console.error("대운 관계 데이터 가져오기 실패:", error);
    }
  };

  // 세운 관계 데이터 가져오기
  const fetchSewoonRelationships = async (
    sewoonGanji: string,
    daewoonGanji: string
  ) => {
    try {
      const pillars = {
        year: sajuData.pillars.year.gan + sajuData.pillars.year.ji,
        month: sajuData.pillars.month.gan + sajuData.pillars.month.ji,
        day: sajuData.pillars.day.gan + sajuData.pillars.day.ji,
        hour: sajuData.pillars.hour.gan + sajuData.pillars.hour.ji,
      };

      const response = await fetch(
        `/api/fortune/sewoon-relationships?sewoonGanji=${sewoonGanji}&daewoonGanji=${daewoonGanji}&sajuPillars=${JSON.stringify(
          pillars
        )}`
      );
      const data = await response.json();

      if (data.error === false) {
        setSewoonRelationships(data.data.relationships);
        // 신살 요약 수신 처리 (있을 경우)
        if (data.data.sinsal) {
          setSewoonSinsalResult(data.data.sinsal);
          const hits = extractUniqueSinsalHitsFromResult(data.data.sinsal);
          setSewoonSinsalNames(hits.map((h) => h.name));
        } else {
          setSewoonSinsalResult(null);
          setSewoonSinsalNames(null);
        }
      }
    } catch (error) {
      console.error("세운 관계 데이터 가져오기 실패:", error);
    }
  };

  // SinsalResult 형태에서 고유 신살 객체 배열로 추출 (category 정보 포함)
  const extractUniqueSinsalHitsFromResult = (
    sinsalResult: Record<
      string,
      Array<{
        name: string;
        elements?: Array<{ pillar?: string; character?: string }>;
        category?: string;
      }>
    >
  ): Array<{
    name: string;
    category: string;
    elements?: Array<{ pillar: string; character: string }>;
  }> => {
    const hits: Array<{
      name: string;
      category: string;
      elements?: Array<{ pillar: string; character: string }>;
    }> = [];
    console.log(
      "🔍 extractUniqueSinsalHitsFromResult 함수 시작 - hits 배열 초기화"
    );
    console.log("🔍 함수에 전달된 sinsalResult:", sinsalResult);
    console.log("🔍 현재 pillarFilters:", pillarFilters);
    console.log("🔍 현재 relationshipMode:", relationshipMode);
    const includeKeysBase = [
      pillarFilters.year ? "year" : null,
      pillarFilters.month ? "month" : null,
      pillarFilters.day ? "day" : null,
      pillarFilters.hour ? "hour" : null,
    ].filter(Boolean) as string[];

    // 포함 여부 판단 함수: 원국/운 모드별로 기준과 대상 조건을 명확히 분리
    const shouldIncludeHit = (h: {
      name: string;
      elements?: Array<{ pillar?: string }>;
      category?: string;
    }): boolean => {
      if (!h.elements || h.elements.length === 0) {
        // 안전장치: elements 없으면 원국 모드에서만 표시
        return relationshipMode === "original";
      }

      const basePillar = h.elements[0]?.pillar as string | undefined;
      const hasSelectedTarget = h.elements.some((el) =>
        el && el.pillar ? includeKeysBase.includes(el.pillar as string) : false
      );

      if (relationshipMode === "original") {
        // 원국: 기준이 선택된 기둥이면 포함 (대상은 자동 포함)
        return basePillar ? includeKeysBase.includes(basePillar) : false;
      }

      // 운 모드:
      // - 대운: 기준이 'daewoon'이고, 대상에 선택된 기둥이 하나라도 포함되어야 함
      // - 세운: 기준이 선택된 기둥(year/month/day/hour)이고, 대상에 'sewoon'이 포함되어야 함
      if (relationshipMode === "daewoon") {
        return basePillar === "daewoon" && hasSelectedTarget;
      }
      if (relationshipMode === "sewoon") {
        const hasSewoonTarget = h.elements.some(
          (el) => el?.pillar === "sewoon"
        );
        return (
          (basePillar ? includeKeysBase.includes(basePillar) : false) &&
          hasSewoonTarget
        );
      }
      return false;
    };

    console.log("🔍 includeKeysBase:", includeKeysBase);

    // 12신살 목록 (각 기둥 기준으로 계산되는 신살들)
    const sinsal12Names = [
      "겁살",
      "재살",
      "천살",
      "지살",
      "연살",
      "월살",
      "망신",
      "장성",
      "반안",
      "역마",
      "육해",
      "화개",
    ];

    // 12신살의 경우 특별 처리: 선택된 기둥 기준으로 다른 기둥들과의 관계를 모두 포함
    const has12Sinsal = sinsal12Names.some((name) =>
      Object.values(sinsalResult).some(
        (arr) => Array.isArray(arr) && arr.some((h) => h.name === name)
      )
    );

    console.log("🔍 12신살 체크 결과:", has12Sinsal);

    if (has12Sinsal) {
      // 디버깅: 선택된 기둥과 신살 데이터 확인
      console.log("🔍 시주 클릭 디버깅:", {
        includeKeysBase,
        pillarFilters,
        sinsalResult: Object.keys(sinsalResult).reduce((acc, key) => {
          const pillarKey = key as keyof typeof sinsalResult;
          acc[key] =
            sinsalResult[pillarKey]?.filter((h) =>
              sinsal12Names.includes(h.name)
            ) || [];
          return acc;
        }, {} as Record<string, Array<{ name: string; elements?: Array<{ pillar?: string }> }>>),
        fullSinsalResult: sinsalResult,
      });

      // 모든 배열을 순회하며 12신살만 조건에 맞게 포함
      Object.values(sinsalResult).forEach((arr) => {
        if (Array.isArray(arr)) {
          arr.forEach((h) => {
            if (sinsal12Names.includes(h.name) && shouldIncludeHit(h)) {
              hits.push({
                name: h.name,
                category: h.category || "neutral",
                elements: h.elements?.map((el) => ({
                  pillar: el.pillar || "",
                  character: el.character || "",
                })),
              });
            }
          });
        }
      });

      // 12신살 외 길신/흉신도 동일한 포함 규칙 적용
      Object.values(sinsalResult).forEach((arr) => {
        if (Array.isArray(arr)) {
          arr.forEach((h) => {
            if (!sinsal12Names.includes(h.name) && shouldIncludeHit(h)) {
              hits.push({
                name: h.name,
                category: h.category || "neutral",
                elements: h.elements?.map((el) => ({
                  pillar: el.pillar || "",
                  character: el.character || "",
                })),
              });
            }
          });
        }
      });
    } else {
      // 12신살이 감지되지 않았더라도 동일 규칙으로 전체 순회
      Object.values(sinsalResult).forEach((arr) => {
        if (Array.isArray(arr)) {
          arr.forEach((h) => {
            if (shouldIncludeHit(h)) {
              hits.push({
                name: h.name,
                category: h.category || "neutral",
                elements: h.elements?.map((el) => ({
                  pillar: el.pillar || "",
                  character: el.character || "",
                })),
              });
            }
          });
        }
      });
    }

    return Array.from(hits);
  };

  // 원국 신살 요약 (서버 sajuData.sinsal 기반)
  const getOriginalSinsalHits = (): Array<{
    name: string;
    category: string;
    elements?: Array<{ pillar: string; character: string }>;
  }> => {
    try {
      const result = sajuData?.sinsal as unknown as Record<
        string,
        Array<{
          name: string;
          category?: string;
          elements?: Array<{ pillar?: string; character?: string }>;
        }>
      >;
      console.log("🔍 서버에서 받은 원본 sinsal 데이터:", result);
      if (!result) return [];
      const hits = extractUniqueSinsalHitsFromResult(result);
      console.log("🔍 extractUniqueSinsalHitsFromResult 결과:", hits);
      return hits;
    } catch (error) {
      console.error("🔍 getOriginalSinsalHits 에러:", error);
      return [];
    }
  };

  // 사주원국표 글자 강조 여부 확인 함수
  const isCharacterHighlighted = (pillar: string, character: string) => {
    if (!selectedSinsalElements) return false;

    // pillar 매핑: 한국어 → 영어
    const pillarMapping: { [key: string]: string } = {
      년: "year",
      월: "month",
      일: "day",
      시: "hour",
    };

    const mappedPillar = pillarMapping[pillar] || pillar;

    console.log("🔍 강조 체크:", {
      pillar,
      mappedPillar,
      character,
      selectedSinsalElements,
      match: selectedSinsalElements.some(
        (element) =>
          element.pillar === mappedPillar && element.character === character
      ),
    });

    return selectedSinsalElements.some(
      (element) =>
        element.pillar === mappedPillar && element.character === character
    );
  };

  // 신살의 기준 기둥에 따른 강조 색상 클래스 반환 함수
  const getSinsalHighlightClass = () => {
    if (!selectedSinsalElements || selectedSinsalElements.length === 0) {
      return "ring-4 ring-yellow-400 bg-yellow-100";
    }

    // 신살의 기준 기둥 (첫 번째 element의 pillar)
    const basePillar = selectedSinsalElements[0]?.pillar;

    // 영어 pillar를 한국어로 변환
    const pillarMapping: { [key: string]: string } = {
      year: "년",
      month: "월",
      day: "일",
      hour: "시",
    };

    const koreanPillar = pillarMapping[basePillar] || basePillar;

    const pillarColorMapping: { [key: string]: string } = {
      년: "ring-4 ring-red-400 bg-red-100", // 년주 기준 - 빨간색
      월: "ring-4 ring-blue-400 bg-blue-100", // 월주 기준 - 파란색
      일: "ring-4 ring-green-400 bg-green-100", // 일주 기준 - 초록색
      시: "ring-4 ring-purple-400 bg-purple-100", // 시주 기준 - 보라색
    };

    console.log("🔍 신살 기준 기둥:", {
      basePillar,
      koreanPillar,
      colorClass: pillarColorMapping[koreanPillar],
    });

    return (
      pillarColorMapping[koreanPillar] || "ring-4 ring-yellow-400 bg-yellow-100"
    );
  };

  // 신살 배지 클릭 핸들러
  const handleSinsalClick = (hit: {
    name: string;
    category: string;
    elements?: Array<{ pillar: string; character: string }>;
  }) => {
    console.log("🔍 신살 배지 클릭됨:", hit);
    console.log("🔍 hit.elements:", hit.elements);
    console.log("🔍 hit.elements?.length:", hit.elements?.length);

    // 현재 선택된 신살과 같은 신살인지 확인 (토글 기능)
    const isCurrentlySelected =
      selectedSinsalElements &&
      hit.elements &&
      selectedSinsalElements.length === hit.elements.length &&
      selectedSinsalElements.every((selectedEl, index) => {
        const hitEl = hit.elements![index];
        return (
          selectedEl.pillar === hitEl.pillar &&
          selectedEl.character === hitEl.character
        );
      });

    if (isCurrentlySelected) {
      // 같은 신살을 다시 클릭하면 강조 해제
      setSelectedSinsalElements(null);
      console.log("🔍 신살 클릭 - 강조 해제 (토글):", hit.name);
    } else if (hit.elements && hit.elements.length > 0) {
      // 다른 신살을 클릭하면 새로운 강조 설정
      setSelectedSinsalElements(hit.elements);
      console.log(
        "🔍 신살 클릭 - 강조 설정:",
        hit.name,
        "관련 글자들:",
        hit.elements
      );
    } else {
      setSelectedSinsalElements(null);
      console.log("🔍 신살 클릭 - 강조 해제:", hit.name);
    }
  };

  // 신살 배지 렌더러
  const renderSinsalBadges = () => {
    let hits: Array<{
      name: string;
      category: string;
      elements?: Array<{ pillar: string; character: string }>;
    }> = [];
    if (relationshipMode === "original") {
      hits = getOriginalSinsalHits();
    } else if (relationshipMode === "daewoon") {
      const source = daewoonSinsalResult;
      if (source) hits = extractUniqueSinsalHitsFromResult(source);
    } else if (relationshipMode === "sewoon") {
      const source = sewoonSinsalResult;
      if (source) hits = extractUniqueSinsalHitsFromResult(source);
    }

    console.log("🔍 신살 배지 렌더러 디버깅:", {
      relationshipMode,
      hits,
      daewoonSinsalNames,
      sewoonSinsalNames,
      pillarFilters,
    });

    // 실제 서버에서 받아온 신살 데이터 확인
    console.log("🔍 실제 서버 신살 데이터:", hits);
    console.log(
      "🔍 hits 배열 상세 분석:",
      hits.map((hit) => ({ name: hit.name, category: hit.category }))
    );

    if (!hits || hits.length === 0) return null;

    // 서버에서 받은 category 정보를 사용하여 분류
    const gilsinHits = hits.filter((h) => h.category === "auspicious");
    const heungsinHits = hits.filter((h) => h.category === "inauspicious");
    const sinsalHits = hits.filter((h) => h.category === "neutral");

    console.log("🔍 신살/흉신/길신 분류 디버깅:", {
      totalHits: hits,
      totalHitsLength: hits.length,
      gilsinHits,
      gilsinHitsLength: gilsinHits.length,
      heungsinHits,
      heungsinHitsLength: heungsinHits.length,
      sinsalHits,
      sinsalHitsLength: sinsalHits.length,
      pillarFilters,
      relationshipMode,
    });

    // 각 신살이 어떤 카테고리에 속하는지 상세 분석
    hits.forEach((hit) => {
      console.log(`🔍 신살 분석: ${hit.name}`, {
        category: hit.category,
        displayCategory:
          hit.category === "auspicious"
            ? "길신"
            : hit.category === "inauspicious"
            ? "흉신"
            : "신살",
      });
    });

    if (
      sinsalHits.length === 0 &&
      heungsinHits.length === 0 &&
      gilsinHits.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {/* 신살 행 */}
            {sinsalHits.length > 0 && (
              <tr className="border-b border-gray-200">
                <td className="px-3 py-3 text-xs font-medium text-gray-700 bg-gray-100/50 w-16">
                  신살
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {sinsalHits.map((hit, index) => (
                      <span
                        key={`sinsal-${hit.name}-${index}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
                        title={hit.name}
                        onClick={() => handleSinsalClick(hit)}
                      >
                        {hit.name.length > 2 ? hit.name.slice(0, 2) : hit.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )}

            {/* 흉신 행 */}
            {heungsinHits.length > 0 && (
              <tr className="border-b border-gray-200">
                <td className="px-3 py-3 text-xs font-medium text-gray-700 bg-rose-100/50 w-16">
                  흉신
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {heungsinHits.map((hit, index) => (
                      <span
                        key={`heungsin-${hit.name}-${index}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border bg-rose-100 text-rose-800 border-rose-200 cursor-pointer hover:bg-rose-200 transition-colors"
                        title={hit.name}
                        onClick={() => handleSinsalClick(hit)}
                      >
                        {hit.name.length > 2 ? hit.name.slice(0, 2) : hit.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )}

            {/* 길신 행 */}
            {gilsinHits.length > 0 && (
              <tr className="border-b border-gray-200">
                <td className="px-3 py-3 text-xs font-medium text-gray-700 bg-yellow-100/50 w-16">
                  길신
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {gilsinHits.map((hit, index) => (
                      <span
                        key={`gilsin-${hit.name}-${index}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-200 cursor-pointer hover:bg-yellow-200 transition-colors"
                        title={hit.name}
                        onClick={() => handleSinsalClick(hit)}
                      >
                        {hit.name.length > 2 ? hit.name.slice(0, 2) : hit.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // 대운 선택 핸들러
  const handleDaewoonSelect = (index: number) => {
    setSelectedDaewoonIndex(index);
    setSelectedYear(null); // 세운 선택 초기화
    setSewoonRelationships(null); // 세운 관계 초기화
    setRelationshipMode("daewoon"); // 관계 모드를 대운으로 변경

    // 백엔드에서 이미 계산된 대운 시작 연도 직접 사용
    const daewoonStartYear = sajuData.daewoonFull[index].year; // 1999, 2009, 2019...
    const daewoonGanji = sajuData.daewoonFull[index].ganji;

    // 세운 데이터 가져오기
    fetchSewoonData(daewoonStartYear, sajuData.pillars.day.gan);

    // 대운 관계 데이터 가져오기
    fetchDaewoonRelationships(daewoonGanji);
  };

  // 년도 선택 핸들러 (세운표에서 년도 클릭시)
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setRelationshipMode("sewoon"); // 관계 모드를 세운으로 변경

    // 월운 데이터 가져오기
    fetchWoolwoonData(year, sajuData.pillars.day.gan);

    // 세운 관계 데이터 가져오기 (대운이 선택된 경우에만)
    if (selectedDaewoonIndex !== null && sewoonData) {
      const selectedSewoon = sewoonData.find((sewoon) => sewoon.year === year);
      if (selectedSewoon && sajuData.daewoonFull[selectedDaewoonIndex]) {
        const sewoonGanji = selectedSewoon.ganji;
        const daewoonGanji = sajuData.daewoonFull[selectedDaewoonIndex].ganji;
        fetchSewoonRelationships(sewoonGanji, daewoonGanji);
      }
    }
  };

  // 나이 계산 함수
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // 양음력 변환 함수 (대략적인 근사치)
  const convertToLunarDate = (solarDate: string, birthTime?: string) => {
    const date = new Date(solarDate);
    // 음력은 양력보다 약 20-50일 빠름 (대략적인 계산)
    // 실제로는 더 복잡한 알고리즘이 필요하지만 간단한 근사치 제공
    date.setDate(date.getDate() - 30);
    const lunarDate = date.toISOString().split("T")[0].replace(/-/g, "-");

    // 시간이 있으면 시간도 포함해서 반환
    if (birthTime && birthTime.trim() !== "") {
      return `${lunarDate} ${birthTime}`;
    }
    return lunarDate;
  };

  // 기본 정보 표시 함수 (프로필 스타일 + 미니멀)
  const displayBasicInfo = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold ${
                  userInfo.gender === "M"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-pink-500 to-pink-600"
                }`}
              >
                {userInfo.name && userInfo.name.trim() !== ""
                  ? userInfo.name.charAt(0).toUpperCase()
                  : "?"}
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {userInfo.name && userInfo.name.trim() !== ""
                  ? `${userInfo.name}(${calculateAge(userInfo.birthDate)})`
                  : "이름 미입력"}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">
                  {userInfo.gender === "M" ? "남성" : "여성"}
                </span>
                <span className="ml-2">
                  {userInfo.birthTime && userInfo.birthTime.trim() !== ""
                    ? `${userInfo.birthDate} ${userInfo.birthTime}`
                    : userInfo.birthDate}
                </span>
                <span className="ml-2">
                  {userInfo.calendarType === "solar" ? "양력" : "음력"}
                </span>
                {userInfo.calendarType === "solar" && (
                  <span className="ml-2 text-gray-500">
                    {convertToLunarDate(userInfo.birthDate, userInfo.birthTime)}{" "}
                    음력
                  </span>
                )}
                {userInfo.birthPlace && userInfo.birthPlace.trim() !== "" && (
                  <span className="ml-2">{userInfo.birthPlace} 출생</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 지장간 계산 함수 (간지 기준)
  const getJijangganForGanji = (ganji: string) => {
    const ji = ganji[1]; // 지지 추출
    const koreanJi = jiToKoreanMap[ji] || ji;
    const data = JIJANGGAN_DATA[koreanJi];

    if (!data) return { 초기: "-", 중기: "-", 정기: "-" };

    return {
      초기: data.초기?.gan || "-",
      중기: "중기" in data ? data.중기?.gan || "-" : "-",
      정기: data.정기?.gan || "-",
    };
  };

  // 한자 지지를 한국어로 변환하는 맵
  const jiToKoreanMap: { [key: string]: string } = {
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

  // 한자 to 오행 변환 맵
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

  // 오행별 색상 클래스
  const ohaengColors: { [key: string]: string } = {
    木: "text-green-600", // 목 - 초록색
    火: "text-red-600", // 화 - 빨간색
    土: "text-yellow-600", // 토 - 노란색
    金: "text-gray-300", // 금 - 백금색 (밝은 회색)
    水: "text-blue-600", // 수 - 파란색
  };

  // 글자에 따른 오행 색상 클래스 반환 함수
  const getOhaengColor = (character: string) => {
    const ohaeng = hanjaToOhaeng[character];
    return ohaengColors[ohaeng] || "text-gray-600";
  };

  // 드롭박스 섹션 토글 함수
  const toggleSection = (section: "wangse" | "yongsin" | "gyeokguk") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 왕쇠강약 분석 드롭박스 렌더러
  const renderAnalysisDropbox = () => {
    const wangseData = sajuData?.wangseStrength;

    return (
      <div className="bg-white rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            분석
          </h3>
        </div>

        {/* 왕쇠강약 섹션 */}
        <div className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection("wangse")}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      강약
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-medium text-gray-900">신강신약</h4>
                  {wangseData && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {wangseData.levelDetail}{" "}
                      {wangseData.finalScore.toFixed(1)}점
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections.wangse ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {expandedSections.wangse && (
            <div className="px-4 pb-4">
              {wangseData ? (
                <div className="space-y-4">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        본원
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {wangseData.ganType}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        상태
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {wangseData.levelDetail}
                      </div>
                    </div>
                  </div>

                  {/* 점수 정보 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        수치
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {wangseData.finalScore.toFixed(1)}점
                      </span>
                    </div>

                    {/* 새로운 35점 체계 시각화 */}
                    <div className="space-y-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            wangseData.finalScore < 7
                              ? "bg-red-400"
                              : wangseData.finalScore < 14
                              ? "bg-orange-400"
                              : wangseData.finalScore < 21
                              ? "bg-green-500"
                              : wangseData.finalScore < 28
                              ? "bg-blue-500"
                              : wangseData.finalScore <= 35
                              ? "bg-purple-500"
                              : "bg-purple-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              Math.max((wangseData.finalScore / 35) * 100, 0),
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      {/* 점수 구간 표시 */}
                      <div className="grid grid-cols-6 gap-1 text-xs text-gray-500 text-center">
                        <span className="text-red-400">
                          태약
                          <br />
                          (0-7)
                        </span>
                        <span className="text-orange-400">
                          신약
                          <br />
                          (7-14)
                        </span>
                        <span className="text-green-500">
                          중화
                          <br />
                          (14-21)
                        </span>
                        <span className="text-blue-500">
                          신강
                          <br />
                          (21-28)
                        </span>
                        <span className="text-purple-500">
                          태강
                          <br />
                          (28-35)
                        </span>
                        <span className="text-purple-600">
                          극왕
                          <br />
                          (35+)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>왕쇠강약 데이터를 불러오는 중...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 용희기구한 섹션 */}
        <div className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection("yongsin")}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      용
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">용신 분석</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {yongsinData?.primaryYongsin
                      ? `주용신 : ${
                          GAN_TO_LABEL[yongsinData.primaryYongsin] ||
                          yongsinData.primaryYongsin
                        } (${
                          OHAENG_TO_HANJA[
                            GAN_TO_OHAENG_KOR[yongsinData.primaryYongsin] || ""
                          ] || ""
                        }) · 확신도 ${yongsinData.confidence}%`
                      : "용신 데이터를 불러오는 중이거나 분석 결과가 없습니다."}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {yongsinData?.selectedTier ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {yongsinData.selectedTier.name}
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    데이터
                  </span>
                )}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections.yongsin ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {expandedSections.yongsin && (
            <div className="px-4 pb-4">
              {yongsinData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      {
                        key: "yongsin" as YongsinCardKey,
                        label: "용신",
                        value: primaryYongsinLabel,
                      },
                      ...CATEGORY_LABELS.map(({ key, label }) => ({
                        key,
                        label,
                        value: categoryElements[key],
                      })),
                    ].map(({ key, label, value }) => {
                      const displayValue = value === "-" ? "—" : value;
                      const elementKor =
                        key === "yongsin"
                          ? primaryOhaengKor || null
                          : (() => {
                              if (!value || value === "-" || value === "—") {
                                return null;
                              }
                              const normalized =
                                value
                                  .replace(/\s+/g, "")
                                  .replace(/.*\(/, "")
                                  .replace(/\)/g, "") || value;
                              return HANJA_TO_OHAENG_KOR[normalized] || null;
                            })();

                      const cardStyle = getCardStyle(key, elementKor);
                      const valueClass =
                        displayValue === "—"
                          ? "text-gray-400"
                          : cardStyle.valueClass;

                      return (
                        <div
                          key={label}
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${cardStyle.border} ${cardStyle.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${cardStyle.pillClass}`}
                            >
                              <span>{label}</span>
                            </span>
                            <p className={`text-xl font-bold ${valueClass}`}>
                              {displayValue}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                            이름
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                            용신
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                            확신도
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                            적용 여부
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                            판단 근거
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {yongsinData.allAnalyses.map((analysis) => (
                          <tr
                            key={analysis.tier}
                            className="border-b last:border-b-0"
                          >
                            <td className="px-3 py-2 text-sm text-gray-800 font-medium">
                              {analysis.name}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-800">
                              {analysis.yongsin
                                ? (() => {
                                    const hanja =
                                      OHAENG_TO_HANJA[
                                        GAN_TO_OHAENG_KOR[analysis.yongsin] ||
                                          ""
                                      ] || "";
                                    return hanja
                                      ? `${analysis.yongsin} (${hanja})`
                                      : analysis.yongsin;
                                  })()
                                : "—"}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700">
                              {analysis.confidence}%
                            </td>
                            <td className="px-3 py-2 text-sm">
                              {analysis.isDominant ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                  적용
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                                  참고
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {analysis.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg p-4">
                  용신 분석 데이터를 불러오는 중이거나 분석을 수행할 수
                  없습니다. 만세력 데이터를 다시 확인해 주세요.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 격국 분석 섹션 */}
        <div className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection("gyeokguk")}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      격
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">격국 분석</h4>
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections.gyeokguk ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {expandedSections.gyeokguk && (
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* 격국 분석 카드 - 버전3 (깔끔한 6개 카드) */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* 1. 격이름 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.name;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>격이름</span>
                            </span>
                            <p
                              className={`text-xl font-bold ${meta.valueClass}`}
                            >
                              {(sajuData as SajuData)?.gyeokguk?.gyeokguk
                                ?.name || "—"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(() => {
                                const name = (sajuData as SajuData)?.gyeokguk
                                  ?.gyeokguk?.name;
                                const hanjaMap: Record<string, string> = {
                                  정관격: "正官格",
                                  편관격: "偏官格",
                                  정재격: "正財格",
                                  편재격: "偏財格",
                                  식신격: "食神格",
                                  상관격: "傷官格",
                                  정인격: "正印格",
                                  편인격: "偏印格",
                                  건록격: "建祿格",
                                  양인격: "羊刃格",
                                };
                                return hanjaMap[name || ""] || "—";
                              })()}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 2. 월령 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.wollyeong;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>월령</span>
                            </span>
                            <p
                              className={`text-xl font-bold ${meta.valueClass}`}
                            >
                              {(() => {
                                const monthJi = (sajuData as SajuData)?.pillars
                                  ?.month?.ji;
                                if (!monthJi) return "—";

                                const monthJiToJeongi: Record<string, string> =
                                  {
                                    子: "癸",
                                    丑: "己",
                                    寅: "甲",
                                    卯: "乙",
                                    辰: "戊",
                                    巳: "丙",
                                    午: "丁",
                                    未: "己",
                                    申: "庚",
                                    酉: "辛",
                                    戌: "戊",
                                    亥: "壬",
                                  };

                                const wollyeongGan = monthJiToJeongi[monthJi];
                                if (!wollyeongGan) return "—";

                                const ganToOhaeng: Record<string, string> = {
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
                                };

                                const ohaeng = ganToOhaeng[wollyeongGan];
                                const colorMap: Record<string, string> = {
                                  木: "text-green-600",
                                  火: "text-red-600",
                                  土: "text-yellow-600",
                                  金: "text-gray-600",
                                  水: "text-blue-600",
                                };

                                return (
                                  <span
                                    className={
                                      colorMap[ohaeng] || meta.valueClass
                                    }
                                  >
                                    {wollyeongGan}({ohaeng})
                                  </span>
                                );
                              })()}
                            </p>
                            <p className="text-xs text-gray-400">得令</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 3. 당령 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.dangnyeong;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>당령</span>
                            </span>
                            <p
                              className={`text-xl font-bold ${meta.valueClass}`}
                            >
                              {(() => {
                                const dangnyeongGan = (sajuData as SajuData)
                                  ?.dangnyeong?.dangnyeongGan;
                                if (!dangnyeongGan) return "—";

                                const hangulToHanja: Record<string, string> = {
                                  갑: "甲",
                                  을: "乙",
                                  병: "丙",
                                  정: "丁",
                                  무: "戊",
                                  기: "己",
                                  경: "庚",
                                  신: "辛",
                                  임: "壬",
                                  계: "癸",
                                };
                                const displayGan =
                                  hangulToHanja[dangnyeongGan] || dangnyeongGan;

                                const ganToOhaeng: Record<string, string> = {
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
                                  갑: "木",
                                  을: "木",
                                  병: "火",
                                  정: "火",
                                  무: "土",
                                  기: "土",
                                  경: "金",
                                  신: "金",
                                  임: "水",
                                  계: "水",
                                };
                                const ohaeng = ganToOhaeng[dangnyeongGan] || "";
                                const colorMap: Record<string, string> = {
                                  木: "text-green-600",
                                  火: "text-red-600",
                                  土: "text-yellow-600",
                                  金: "text-gray-600",
                                  水: "text-blue-600",
                                };

                                return (
                                  <span
                                    className={
                                      colorMap[ohaeng] || meta.valueClass
                                    }
                                  >
                                    {displayGan}({ohaeng})
                                  </span>
                                );
                              })()}
                            </p>
                            <p className="text-xs text-gray-400">當令</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 4. 사령 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.saryeong;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity	duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>사령</span>
                            </span>
                            <p
                              className={`text-xl font-bold ${meta.valueClass}`}
                            >
                              {(() => {
                                const saryeongGan = (sajuData as SajuData)
                                  ?.saryeong?.saryeongGan;
                                if (!saryeongGan) return "—";

                                const hangulToHanja: Record<string, string> = {
                                  갑: "甲",
                                  을: "乙",
                                  병: "丙",
                                  정: "丁",
                                  무: "戊",
                                  기: "己",
                                  경: "庚",
                                  신: "辛",
                                  임: "壬",
                                  계: "癸",
                                };
                                const displayGan =
                                  hangulToHanja[saryeongGan] || saryeongGan;

                                const ganToOhaeng: Record<string, string> = {
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
                                  갑: "木",
                                  을: "木",
                                  병: "火",
                                  정: "火",
                                  무: "土",
                                  기: "土",
                                  경: "金",
                                  신: "金",
                                  임: "水",
                                  계: "水",
                                };
                                const ohaeng = ganToOhaeng[saryeongGan] || "";
                                const colorMap: Record<string, string> = {
                                  木: "text-green-600",
                                  火: "text-red-600",
                                  土: "text-yellow-600",
                                  金: "text-gray-600",
                                  水: "text-blue-600",
                                };

                                return (
                                  <span
                                    className={
                                      colorMap[ohaeng] || meta.valueClass
                                    }
                                  >
                                    {displayGan}({ohaeng})
                                  </span>
                                );
                              })()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(() => {
                                const role = (sajuData as SajuData)?.saryeong
                                  ?.role;
                                if (!role) return "司令";
                                const roleMap: Record<string, string> = {
                                  초기: "初氣",
                                  중기: "中氣",
                                  정기: "正氣",
                                };
                                return roleMap[role] || "司令";
                              })()}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 5. 진신 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.jinsin;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>진신</span>
                            </span>
                            <div className="flex flex-wrap justify-center gap-1">
                              {renderGanChips(jinsinResult?.jinsinList)}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 6. 가신 */}
                    {(() => {
                      const meta = GYEOKGUK_CARD_META.gasin;
                      return (
                        <div
                          className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${meta.border} ${meta.gradient}`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <div className="relative flex h-full flex-col items-center justify-center space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${meta.pillClass}`}
                            >
                              <span>가신</span>
                            </span>
                            <div className="flex flex-wrap justify-center gap-1">
                              {renderGanChips(jinsinResult?.gasinList)}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 버전 정보 */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                      <span className="text-xs font-medium">
                        버전3 · 깔끔한 디자인
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(sajuData as SajuData)?.gyeokguk ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs font-medium">
                            백엔드 연동됨
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          * 백엔드 연동 중...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 사주팔자 원국표 표시 함수
  const displaySajuTable = () => {
    if (!sajuData?.pillars) return null;

    const { pillars } = sajuData;

    // 동적 컬럼 구성
    const columns = [];

    // 세운 컬럼 (세운이 선택된 경우)
    if (selectedYear !== null && sewoonData) {
      const selectedSewoon = sewoonData.find(
        (sewoon) => sewoon.year === selectedYear
      );
      if (selectedSewoon) {
        columns.push({
          type: "sewoon",
          title: "세운",
          data: {
            gan: selectedSewoon.ganji[0],
            ji: selectedSewoon.ganji[1],
            ganSipsin: selectedSewoon.ganSipsin,
            jiSipsin: selectedSewoon.jiSipsin,
            sibiwunseong: selectedSewoon.sibiwunseong,
          },
        });
      }
    }

    // 대운 컬럼 (대운이 선택된 경우)
    if (selectedDaewoonIndex !== null && sajuData.daewoonFull) {
      const selectedDaewoon = sajuData.daewoonFull[selectedDaewoonIndex];
      columns.push({
        type: "daewoon",
        title: "대운",
        data: {
          gan: selectedDaewoon.ganji[0],
          ji: selectedDaewoon.ganji[1],
          ganSipsin: selectedDaewoon.sipsin.gan,
          jiSipsin: selectedDaewoon.sipsin.ji,
          sibiwunseong: selectedDaewoon.sibiwunseong,
        },
      });
    }

    // 기본 사주 컬럼들 (시간 미입력 시 시주 제외)
    type Column =
      | {
          type: "pillar";
          title: string;
          data: {
            gan: string;
            ji: string;
            ganSipsin?: string;
            jiSipsin?: string;
            sibiwunseong?: string;
          };
        }
      | {
          type: "daewoon" | "sewoon";
          title: string;
          data: {
            gan: string;
            ji: string;
            ganSipsin?: string;
            jiSipsin?: string;
            sibiwunseong?: string;
          };
        };

    const baseColumns: Column[] = [];
    // 항상 시주 컬럼 추가 (시간 미입력 시 빈칸으로 표시)
    baseColumns.push({
      type: "pillar",
      title: "시주",
      data: {
        gan: hasHour ? pillars.hour.gan : "",
        ji: hasHour ? pillars.hour.ji : "",
        ganSipsin: hasHour ? (pillars.hour.ganSipsin || undefined) : undefined,
        jiSipsin: hasHour ? (pillars.hour.jiSipsin || undefined) : undefined,
        sibiwunseong: hasHour ? (pillars.hour.sibiwunseong || undefined) : undefined,
      },
    });
    baseColumns.push(
      {
        type: "pillar",
        title: "일주",
        data: {
          gan: pillars.day.gan,
          ji: pillars.day.ji,
          ganSipsin: pillars.day.ganSipsin || undefined,
          jiSipsin: pillars.day.jiSipsin || undefined,
          sibiwunseong: pillars.day.sibiwunseong || undefined,
        },
      },
      {
        type: "pillar",
        title: "월주",
        data: {
          gan: pillars.month.gan,
          ji: pillars.month.ji,
          ganSipsin: pillars.month.ganSipsin || undefined,
          jiSipsin: pillars.month.jiSipsin || undefined,
          sibiwunseong: pillars.month.sibiwunseong || undefined,
        },
      },
      {
        type: "pillar",
        title: "년주",
        data: {
          gan: pillars.year.gan,
          ji: pillars.year.ji,
          ganSipsin: pillars.year.ganSipsin || undefined,
          jiSipsin: pillars.year.jiSipsin || undefined,
          sibiwunseong: pillars.year.sibiwunseong || undefined,
        },
      }
    );
    columns.push(...baseColumns);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">사주팔자 원국표</h2>

        <div className="overflow-x-auto">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
          >
            {/* 헤더 행 - 기둥 이름 */}
            {columns.map((col, index) => (
              <div
                key={`header-${index}`}
                className={`p-2 text-center font-semibold text-sm border border-gray-300 transition-colors ${
                  col.type === "pillar" &&
                  pillarFilters[
                    col.title
                      .toLowerCase()
                      .replace("주", "") as keyof typeof pillarFilters
                  ]
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {col.title}
              </div>
            ))}

            {/* 천간 십신 행 */}
            {columns.map((col, index) => (
              <div
                key={`ganSipsin-${index}`}
                className="p-2 text-center text-xs text-gray-700 font-medium border border-gray-300"
              >
                {col.type === "pillar"
                  ? col.data.ganSipsin || "-"
                  : col.data.ganSipsin || "-"}
              </div>
            ))}

            {/* 천간 글자 행 */}
            {columns.map((col, index) => (
              <div
                key={`gan-${index}`}
                className={`p-2 text-center text-lg font-bold border border-gray-300 transition-all duration-300 ${getOhaengColor(
                  col.type === "pillar" ? col.data.gan : col.data.gan
                )} ${
                  col.type === "pillar" &&
                  pillarFilters[
                    col.title
                      .toLowerCase()
                      .replace("주", "") as keyof typeof pillarFilters
                  ]
                    ? "ring-2 ring-blue-300"
                    : ""
                } ${
                  col.type === "pillar" &&
                  isCharacterHighlighted(
                    col.title.toLowerCase().replace("주", ""),
                    col.data.gan
                  )
                    ? `${getSinsalHighlightClass()} scale-110 shadow-lg`
                    : ""
                }`}
              >
                {col.type === "pillar" ? col.data.gan : col.data.gan}
              </div>
            ))}

            {/* 지지 글자 행 */}
            {columns.map((col, index) => (
              <div
                key={`ji-${index}`}
                className={`p-2 text-center text-lg font-bold border border-gray-300 transition-all duration-300 ${getOhaengColor(
                  col.type === "pillar" ? col.data.ji : col.data.ji
                )} ${
                  col.type === "pillar" &&
                  pillarFilters[
                    col.title
                      .toLowerCase()
                      .replace("주", "") as keyof typeof pillarFilters
                  ]
                    ? "ring-2 ring-blue-300"
                    : ""
                } ${
                  col.type === "pillar" &&
                  isCharacterHighlighted(
                    col.title.toLowerCase().replace("주", ""),
                    col.data.ji
                  )
                    ? `${getSinsalHighlightClass()} scale-110 shadow-lg`
                    : ""
                }`}
              >
                {col.type === "pillar" ? col.data.ji : col.data.ji}
              </div>
            ))}

            {/* 지지 십신 행 */}
            {columns.map((col, index) => (
              <div
                key={`jiSipsin-${index}`}
                className="p-2 text-center text-xs text-gray-700 font-medium border border-gray-300"
              >
                {col.type === "pillar"
                  ? col.data.jiSipsin || "-"
                  : col.data.jiSipsin || "-"}
              </div>
            ))}

            {/* 십이 운성 행 */}
            {columns.map((col, index) => (
              <div
                key={`sibiwunseong-${index}`}
                className="p-2 text-center text-xs text-gray-700 font-medium border border-gray-300"
              >
                {col.type === "pillar"
                  ? col.data.sibiwunseong || "-"
                  : col.data.sibiwunseong || "-"}
              </div>
            ))}

            {/* 지장간 행 */}
            {columns.map((col, index) => {
              const ganji =
                col.type === "pillar"
                  ? `${col.data.gan}${col.data.ji}`
                  : `${col.data.gan}${col.data.ji}`;
              const jijanggan = getJijangganForGanji(ganji);

              return (
                <div
                  key={`jijanggan-${index}`}
                  className="p-2 text-center text-xs border border-gray-300"
                >
                  <div
                    className={`font-medium ${getOhaengColor(jijanggan.초기)}`}
                  >
                    {jijanggan.초기}
                  </div>
                  <div
                    className={`font-medium ${getOhaengColor(jijanggan.중기)}`}
                  >
                    {jijanggan.중기}
                  </div>
                  <div
                    className={`font-medium ${getOhaengColor(jijanggan.정기)}`}
                  >
                    {jijanggan.정기}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 형충파해합 요약 배지 */}
        <div className="mt-6">
          {displayRelationshipModeSelector()}
          {displayRelationshipBadges()}
        </div>
      </div>
    );
  };

  // 대운표 표시 함수
  const displayDaewoonTable = () => {
    if (!sajuData?.daewoonFull) return null;

    const currentAge =
      new Date().getFullYear() - new Date(userInfo.birthDate).getFullYear();
    const currentDaewoonIndex = Math.floor((currentAge - 9) / 10);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">대운표</h2>

        <div className="grid grid-cols-10 gap-1">
          {sajuData.daewoonFull
            .slice()
            .reverse()
            .map((daewoon, index) => {
              const originalIndex = sajuData.daewoonFull.length - 1 - index;
              const isCurrent = originalIndex === currentDaewoonIndex;
              const isSelected = originalIndex === selectedDaewoonIndex;

              return (
                <div
                  key={originalIndex}
                  onClick={() => handleDaewoonSelect(originalIndex)}
                  className={`p-2 text-center border rounded cursor-pointer hover:bg-gray-50 ${
                    isCurrent
                      ? "bg-blue-100 border-blue-500"
                      : isSelected
                      ? "bg-green-100 border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {daewoon.year -
                      new Date(userInfo.birthDate).getFullYear() +
                      1}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {daewoon.sipsin.gan || "-"}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      daewoon.ganji[0]
                    )}`}
                  >
                    {daewoon.ganji[0]}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      daewoon.ganji[1]
                    )}`}
                  >
                    {daewoon.ganji[1]}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {daewoon.sipsin.ji || "-"}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {daewoon.sibiwunseong || "-"}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  // 관계 모드 선택 버튼 표시 함수
  const displayRelationshipModeSelector = () => {
    return (
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => {
              setRelationshipMode("original");
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              relationshipMode === "original"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            원국
          </button>
          <button
            onClick={() => {
              setRelationshipMode("daewoon");
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              relationshipMode === "daewoon"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : selectedDaewoonIndex === null
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            disabled={selectedDaewoonIndex === null}
          >
            대운
          </button>
          <button
            onClick={() => {
              setRelationshipMode("sewoon");
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              relationshipMode === "sewoon"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : selectedYear === null
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            disabled={selectedYear === null}
          >
            세운
          </button>
        </div>
      </div>
    );
  };

  // 형충파해합 요약 배지 표시 함수
  const displayRelationshipBadges = () => {
    // 현재 선택된 관계 데이터 결정
    let relationships = null;

    switch (relationshipMode) {
      case "original":
        relationships = sajuData?.relationships;
        break;
      case "daewoon":
        relationships = daewoonRelationships;
        break;
      case "sewoon":
        relationships = sewoonRelationships;
        break;
    }

    if (!relationships) {
      return null;
    }

    // 타입 캐스팅으로 오류 해결
    const relData = relationships as Record<string, string[]>;
    const ganBadges: React.ReactElement[] = []; // 천간 배지
    const jiBadges: React.ReactElement[] = []; // 지지 배지

    // 한자 → 한글 변환 맵
    const hanjaToHangul: Record<string, string> = {
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

    // 한자 문자열을 한글로 변환하는 함수
    const convertToHangul = (hanjaStr: string): string => {
      return hanjaStr
        .split("")
        .map((char) => hanjaToHangul[char] || char)
        .join("");
    };

    // 천간합 (천간)
    if (relData.cheonganhap && relData.cheonganhap.length > 0) {
      relData.cheonganhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0]; // "甲己(year-month)" 에서 "甲己" 추출
        const hangul = convertToHangul(ganji);
        ganBadges.push(
          <span
            key={`cheonganhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔒{hangul}합
          </span>
        );
      });
    }

    // 천간충 (천간)
    if (relData.cheonganchung && relData.cheonganchung.length > 0) {
      relData.cheonganchung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        ganBadges.push(
          <span
            key={`cheonganchung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔓{hangul}충
          </span>
        );
      });
    }

    // 육합 (지지)
    if (relData.yukhap && relData.yukhap.length > 0) {
      relData.yukhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`yukhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚙️{hangul}합
          </span>
        );
      });
    }

    // 삼합 (지지)
    if (relData.samhap && relData.samhap.length > 0) {
      relData.samhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`samhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔗{hangul}합
          </span>
        );
      });
    }

    // 암합 (지지)
    if (relData.amhap && relData.amhap.length > 0) {
      relData.amhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`amhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🌑{hangul}합
          </span>
        );
      });
    }

    // 방합 (지지)
    if (relData.banghap && relData.banghap.length > 0) {
      relData.banghap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`banghap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🧭{hangul}합
          </span>
        );
      });
    }

    // 육충 (지지)
    if (relData.yukchung && relData.yukchung.length > 0) {
      relData.yukchung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`yukchung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚡{hangul}충
          </span>
        );
      });
    }

    // 육형 (지지)
    if (relData.yukhyung && relData.yukhyung.length > 0) {
      relData.yukhyung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`yukhyung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚔️{hangul}형
          </span>
        );
      });
    }

    // 육파 (지지)
    if (relData.yukpa && relData.yukpa.length > 0) {
      relData.yukpa.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`yukpa-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            💥{hangul}파
          </span>
        );
      });
    }

    // 육해 (지지)
    if (relData.yukae && relData.yukae.length > 0) {
      relData.yukae.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        const hangul = convertToHangul(ganji);
        jiBadges.push(
          <span
            key={`yukae-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ☠️{hangul}해
          </span>
        );
      });
    }

    if (ganBadges.length === 0 && jiBadges.length === 0) {
      return (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            특별한 관계가 없습니다
          </p>
        </div>
      );
    }

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        {/* 필터 UI */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2 text-xs">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.year}
                onChange={(e) =>
                  setPillarFilters((prev) => ({
                    ...prev,
                    year: e.target.checked,
                  }))
                }
              />
              <span>년주</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.month}
                onChange={(e) =>
                  setPillarFilters((prev) => ({
                    ...prev,
                    month: e.target.checked,
                  }))
                }
              />
              <span>월주</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.day}
                onChange={(e) =>
                  setPillarFilters((prev) => ({
                    ...prev,
                    day: e.target.checked,
                  }))
                }
              />
              <span>일주</span>
            </label>
            <label
              className={`flex items-center gap-1 ${
                hasHour ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
              title={
                hasHour ? "" : "시간 미입력 시 시주 토글은 사용할 수 없습니다"
              }
            >
              <input
                type="checkbox"
                checked={pillarFilters.hour}
                disabled={!hasHour}
                onChange={(e) =>
                  setPillarFilters((prev) => ({
                    ...prev,
                    hour: hasHour ? e.target.checked : false,
                  }))
                }
              />
              <span>시주</span>
            </label>
          </div>
          {/* 운 전용 토글 제거: 탭 자체가 운 전용 의미 */}
        </div>
        {/* 형충파해합 테이블 */}
        {(ganBadges.length > 0 || jiBadges.length > 0) && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {/* 천간 행 */}
                {ganBadges.length > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-xs font-medium text-gray-700 bg-blue-50/50 w-16">
                      천간
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">{ganBadges}</div>
                    </td>
                  </tr>
                )}

                {/* 지지 행 */}
                {jiBadges.length > 0 && (
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-3 text-xs font-medium text-gray-700 bg-green-50/50 w-16">
                      지지
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">{jiBadges}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {renderSinsalBadges()}
      </div>
    );
  };

  // 세운표 표시 함수
  const displaySewoonTable = () => {
    console.log(
      "🔍 displaySewoonTable - sewoonData:",
      sewoonData,
      "타입:",
      typeof sewoonData,
      "배열인가?",
      Array.isArray(sewoonData)
    );

    if (!sewoonData) {
      console.log("🔍 sewoonData가 falsy - 빈 화면 표시");
      return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">세운표</h2>
          <div className="text-center text-gray-500 py-8">
            대운을 선택하면 해당 기간의 세운표가 표시됩니다.
          </div>
        </div>
      );
    }

    console.log("🔍 sewoonData가 truthy - 세운표 렌더링");

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">세운표</h2>

        {loadingSewoon ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">세운 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-10 gap-1">
            {Array.isArray(sewoonData) &&
              sewoonData.map((sewoon, index) => (
                <div
                  key={index}
                  onClick={() => handleYearSelect(sewoon.year)}
                  className="p-2 text-center border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {sewoon.year}년
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {sewoon.ganSipsin || "-"}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      sewoon.ganji[0]
                    )}`}
                  >
                    {sewoon.ganji[0]}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      sewoon.ganji[1]
                    )}`}
                  >
                    {sewoon.ganji[1]}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {sewoon.jiSipsin || "-"}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {sewoon.sibiwunseong || "-"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  // 월운표 표시 함수
  const displayWoolwoonTable = () => {
    console.log(
      "🔍 displayWoolwoonTable - woolwoonData:",
      woolwoonData,
      "타입:",
      typeof woolwoonData,
      "배열인가?",
      Array.isArray(woolwoonData)
    );

    if (!woolwoonData) {
      console.log("🔍 woolwoonData가 falsy - 빈 화면 표시");
      return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">월운표</h2>
          <div className="text-center text-gray-500 py-8">
            세운표에서 년도를 클릭하면 해당 년도의 월운표가 표시됩니다.
          </div>
        </div>
      );
    }

    console.log("🔍 woolwoonData가 truthy - 월운표 렌더링");

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          월운표 - {selectedYear}년
        </h2>

        {loadingWoolwoon ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">월운 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-1">
            {Array.isArray(woolwoonData) &&
              woolwoonData.map((woolwoon, index) => (
                <div
                  key={index}
                  className="p-2 text-center border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {woolwoon.month}월
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {woolwoon.sipsin?.gan || "-"}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      woolwoon.ganji[0]
                    )}`}
                  >
                    {woolwoon.ganji[0]}
                  </div>
                  <div
                    className={`text-sm font-bold mb-1 ${getOhaengColor(
                      woolwoon.ganji[1]
                    )}`}
                  >
                    {woolwoon.ganji[1]}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {woolwoon.sipsin?.ji || "-"}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {woolwoon.sibiwunseong || "-"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">만세력 결과</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              console.log("저장하기 클릭");
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            저장하기
          </button>
          <button
            onClick={onReset}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            다시 입력
          </button>
        </div>
      </div>

      {displayBasicInfo()}
      {displaySajuTable()}
      {renderAnalysisDropbox()}
      {displayDaewoonTable()}
      {displaySewoonTable()}
      {displayWoolwoonTable()}
    </div>
  );
};

export default ManseServiceBox;
