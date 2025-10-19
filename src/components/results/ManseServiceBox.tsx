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

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        {/* 1행: 신살 */}
        {sinsalHits.length > 0 && (
          <div className="mb-2">
            <div className="text-center text-xs text-gray-600 mb-1">신살</div>
            <div className="flex flex-wrap gap-1 justify-center">
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
          </div>
        )}

        {/* 2행: 흉신 */}
        {heungsinHits.length > 0 && (
          <div className="mb-2">
            <div className="text-center text-xs text-gray-600 mb-1">흉신</div>
            <div className="flex flex-wrap gap-1 justify-center">
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
          </div>
        )}

        {/* 3행: 길신 */}
        {gilsinHits.length > 0 && (
          <div>
            <div className="text-center text-xs text-gray-600 mb-1">길신</div>
            <div className="flex flex-wrap gap-1 justify-center">
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
          </div>
        )}
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
                      왕
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-medium text-gray-900">신강신약 분석</h4>
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

        {/* 용희기구한 섹션 (추후 구현) */}
        <div className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection("yongsin")}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 opacity-50 cursor-not-allowed"
            disabled
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
                  <h4 className="font-medium text-gray-900">용희기구한 분석</h4>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  준비중
                </span>
              </div>
            </div>
          </button>
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
                {/* 격국 분석 카드 - 버전3 (깔끔한 7개 카드) */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {/* 1. 격이름 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                          격이름
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {(sajuData as SajuData)?.gyeokguk?.gyeokguk?.name ||
                            "—"}
                        </div>
                        <div className="text-xs text-gray-500">
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
                        </div>
                      </div>
                    </div>

                    {/* 2. 월령 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                          월령
                        </div>
                        <div className="text-lg font-bold">
                          {(() => {
                            // 월령 = 월지의 정기(본기) 천간
                            const monthJi = (sajuData as SajuData)?.pillars
                              ?.month?.ji;
                            if (!monthJi)
                              return <span className="text-gray-400">—</span>;

                            // 월지별 정기 천간 매핑
                            const monthJiToJeongi: Record<string, string> = {
                              子: "癸", // 자수 정기: 계수
                              丑: "己", // 축토 정기: 기토
                              寅: "甲", // 인목 정기: 갑목
                              卯: "乙", // 묘목 정기: 을목
                              辰: "戊", // 진토 정기: 무토
                              巳: "丙", // 사화 정기: 병화
                              午: "丁", // 오화 정기: 정화
                              未: "己", // 미토 정기: 기토
                              申: "庚", // 신금 정기: 경금
                              酉: "辛", // 유금 정기: 신금
                              戌: "戊", // 술토 정기: 무토
                              亥: "壬", // 해수 정기: 임수
                            };

                            const wollyeongGan = monthJiToJeongi[monthJi];
                            if (!wollyeongGan)
                              return <span className="text-gray-400">—</span>;

                            // 천간 → 오행 매핑
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

                            // 오행 색상
                            const colorMap: Record<string, string> = {
                              木: "text-green-600",
                              火: "text-red-600",
                              土: "text-yellow-600",
                              金: "text-gray-600",
                              水: "text-blue-600",
                            };

                            return (
                              <span
                                className={colorMap[ohaeng] || "text-gray-800"}
                              >
                                {wollyeongGan}({ohaeng})
                              </span>
                            );
                          })()}
                        </div>
                        <div className="text-xs text-gray-400">得令</div>
                      </div>
                    </div>

                    {/* 3. 당령 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                          당령
                        </div>
                        <div className="text-lg font-bold">
                          {(() => {
                            const dangnyeongGan = (sajuData as SajuData)
                              ?.dangnyeong?.dangnyeongGan;
                            if (!dangnyeongGan)
                              return <span className="text-gray-400">—</span>;

                            // 한글 -> 한자 변환
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

                            // 오행 가져오기
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

                            // 오행별 색상
                            const colorMap: Record<string, string> = {
                              木: "text-green-600",
                              火: "text-red-600",
                              土: "text-yellow-600",
                              金: "text-gray-600",
                              水: "text-blue-600",
                            };

                            return (
                              <span
                                className={colorMap[ohaeng] || "text-gray-800"}
                              >
                                {displayGan}({ohaeng})
                              </span>
                            );
                          })()}
                        </div>
                        <div className="text-xs text-gray-400">當令</div>
                      </div>
                    </div>

                    {/* 4. 사령 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                          사령
                        </div>
                        <div className="text-lg font-bold">
                          {(() => {
                            const saryeongGan = (sajuData as SajuData)?.saryeong
                              ?.saryeongGan;
                            if (!saryeongGan)
                              return <span className="text-gray-400">—</span>;

                            // 한글 -> 한자 변환
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

                            // 오행 가져오기
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

                            // 오행별 색상
                            const colorMap: Record<string, string> = {
                              木: "text-green-600",
                              火: "text-red-600",
                              土: "text-yellow-600",
                              金: "text-gray-600",
                              水: "text-blue-600",
                            };

                            return (
                              <span
                                className={colorMap[ohaeng] || "text-gray-800"}
                              >
                                {displayGan}({ohaeng})
                              </span>
                            );
                          })()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(() => {
                            const role = (sajuData as SajuData)?.saryeong?.role;
                            if (!role) return "司令";
                            const roleMap: Record<string, string> = {
                              초기: "初氣",
                              중기: "中氣",
                              정기: "正氣",
                            };
                            return roleMap[role] || "司令";
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* 5. 진신 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide">
                          진신
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {(sajuData as SajuData)?.jinsin?.jinsin || "—"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(sajuData as SajuData)?.jinsin?.strength
                            ? `${(sajuData as SajuData)?.jinsin?.strength}%`
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* 6. 가신 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                          가신
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {(
                            sajuData as SajuData
                          )?.jinsin?.conflictingFactors?.join(", ") || "—"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(sajuData as SajuData)?.jinsin?.confidence
                            ? `신뢰도 ${
                                (sajuData as SajuData)?.jinsin?.confidence
                              }%`
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* 7. 상신 */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                          상신
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          인성
                        </div>
                        <div className="text-xs text-gray-400">印星</div>
                      </div>
                    </div>
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
    if (hasHour) {
      baseColumns.push({
        type: "pillar",
        title: "시주",
        data: {
          gan: pillars.hour.gan,
          ji: pillars.hour.ji,
          ganSipsin: pillars.hour.ganSipsin || undefined,
          jiSipsin: pillars.hour.jiSipsin || undefined,
          sibiwunseong: pillars.hour.sibiwunseong || undefined,
        },
      });
    }
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
    const badges: React.ReactElement[] = [];

    // 천간합
    if (relData.cheonganhap && relData.cheonganhap.length > 0) {
      relData.cheonganhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0]; // "甲己(year-month)" 에서 "甲己" 추출
        badges.push(
          <span
            key={`cheonganhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔒 {ganji}
          </span>
        );
      });
    }

    // 천간충
    if (relData.cheonganchung && relData.cheonganchung.length > 0) {
      relData.cheonganchung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`cheonganchung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔓 {ganji}
          </span>
        );
      });
    }

    // 육합
    if (relData.yukhap && relData.yukhap.length > 0) {
      relData.yukhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`yukhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚙️ {ganji}
          </span>
        );
      });
    }

    // 삼합
    if (relData.samhap && relData.samhap.length > 0) {
      relData.samhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`samhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🔗 {ganji}
          </span>
        );
      });
    }

    // 암합
    if (relData.amhap && relData.amhap.length > 0) {
      relData.amhap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`amhap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🌑 {ganji}
          </span>
        );
      });
    }

    // 방합
    if (relData.banghap && relData.banghap.length > 0) {
      relData.banghap.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`banghap-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            🧭 {ganji}
          </span>
        );
      });
    }

    // 육충
    if (relData.yukchung && relData.yukchung.length > 0) {
      relData.yukchung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`yukchung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚡ {ganji}
          </span>
        );
      });
    }

    // 육형
    if (relData.yukhyung && relData.yukhyung.length > 0) {
      relData.yukhyung.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`yukhyung-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ⚔️ {ganji}
          </span>
        );
      });
    }

    // 육파
    if (relData.yukpa && relData.yukpa.length > 0) {
      relData.yukpa.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`yukpa-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            💥 {ganji}
          </span>
        );
      });
    }

    // 육해
    if (relData.yukae && relData.yukae.length > 0) {
      relData.yukae.forEach((rel: string, index: number) => {
        const ganji = rel.split("(")[0];
        badges.push(
          <span
            key={`yukae-${ganji}-${index}`}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
          >
            ☠️ {ganji}
          </span>
        );
      });
    }

    if (badges.length === 0) {
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
        <div className="flex flex-wrap gap-1 justify-center">{badges}</div>
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
