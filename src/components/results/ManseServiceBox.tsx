import React, { useState } from "react";
import type {
  FortuneResponseData,
  WoolwoonData,
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
  };
  onReset: () => void;
}

const ManseServiceBox: React.FC<ManseServiceBoxProps> = ({
  sajuData,
  userInfo,
  onReset,
}) => {
  console.log("🔍 ManseServiceBox에서 받은 userInfo:", userInfo);

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

  // 필터 상태: 표기 대상 기둥(년/월/일/시)
  const [pillarFilters, setPillarFilters] = useState({
    year: true,
    month: true,
    day: true,
    hour: true,
  });
  // 운 전용 표기 토글 (대운/세운 모드에서 해당 운 기둥만)
  const [unOnly, setUnOnly] = useState(false);

  // 지장간 데이터 (백엔드와 동일하게 한자로 변환)
  const JIJANGGAN_DATA: {
    [key: string]: {
      초기?: { gan: string; days: number };
      중기?: { gan: string; days: number };
      정기?: { gan: string; days: number };
    };
  } = {
    자: {
      초기: { gan: "癸", days: 10 },
      중기: { gan: "壬", days: 10 },
      정기: { gan: "辛", days: 10 },
    },
    축: {
      초기: { gan: "辛", days: 9 },
      중기: { gan: "癸", days: 3 },
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
          const names = extractUniqueSinsalNamesFromResult(data.data.sinsal);
          setDaewoonSinsalNames(names);
        } else {
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
          const names = extractUniqueSinsalNamesFromResult(data.data.sinsal);
          setSewoonSinsalNames(names);
        } else {
          setSewoonSinsalNames(null);
        }
      }
    } catch (error) {
      console.error("세운 관계 데이터 가져오기 실패:", error);
    }
  };

  // SinsalResult 형태에서 고유 신살 이름 배열로 추출
  const extractUniqueSinsalNamesFromResult = (
    sinsalResult: Record<string, Array<{ name: string; elements?: Array<{ pillar?: string }> }>>
  ): string[] => {
    const names: string[] = [];
    console.log("🔍 extractUniqueSinsalNamesFromResult 함수 시작 - names 배열 초기화");
    const includeKeysBase = [
      pillarFilters.year ? "year" : null,
      pillarFilters.month ? "month" : null,
      pillarFilters.day ? "day" : null,
      pillarFilters.hour ? "hour" : null,
    ].filter(Boolean) as string[];

    const includeKeys = (() => {
      if (relationshipMode === "daewoon") {
        if (unOnly) return ["daewoon"]; // 운 전용
        return [...includeKeysBase, "daewoon"]; // 원국+운
      }
      if (relationshipMode === "sewoon") {
        if (unOnly) return ["sewoon"]; // 운 전용
        return [...includeKeysBase, "daewoon", "sewoon"]; // 원국+운
      }
      return includeKeysBase; // original
    })();

    // 12신살 목록 (각 기둥 기준으로 계산되는 신살들)
    const sinsal12Names = ["겁살", "재살", "천살", "지살", "연살", "월살", "망신", "장성", "반안", "역마", "육해", "화개"];

    // 12신살의 경우 특별 처리: 선택된 기둥 기준으로 다른 기둥들과의 관계를 모두 포함
    if (sinsal12Names.some(name => 
      Object.values(sinsalResult).some(arr => 
        Array.isArray(arr) && arr.some(h => h.name === name)
      )
    )) {
      // 디버깅: 선택된 기둥과 신살 데이터 확인
      console.log("🔍 시주 클릭 디버깅:", {
        includeKeysBase,
        pillarFilters,
        sinsalResult: Object.keys(sinsalResult).reduce((acc, key) => {
          const pillarKey = key as keyof typeof sinsalResult;
          acc[key] = sinsalResult[pillarKey]?.filter((h) => 
            sinsal12Names.includes(h.name)
          ) || [];
          return acc;
        }, {} as Record<string, Array<{ name: string; elements?: Array<{ pillar?: string }> }>>),
        fullSinsalResult: sinsalResult
      });
      
      // 모든 기둥에서 12신살을 찾아서, 기준 기둥이 선택된 기둥 중 하나인 것만 포함
      Object.entries(sinsalResult).forEach(([, arr]) => {
        if (Array.isArray(arr)) {
          arr.forEach((h) => {
            if (sinsal12Names.includes(h.name) && h.elements && h.elements.length > 0) {
              const basePillar = h.elements[0]?.pillar;
              console.log(`🔍 신살 ${h.name}: 기준기둥=${basePillar}, 선택된기둥=${includeKeysBase}, elements=${JSON.stringify(h.elements)}`);
              
              // 12신살 필터링 로직: 선택된 기둥 기준으로 다른 기둥들과의 관계를 표시
              let shouldInclude = false;
              
              // 선택된 기둥 중 하나가 기준기둥인 경우 해당 기둥 기준으로 다른 기둥들과의 관계를 표시
              if (basePillar && includeKeysBase.includes(basePillar)) {
                shouldInclude = true;
              }
              
              if (shouldInclude) {
                names.push(h.name);
                console.log(`✅ 신살 ${h.name} 추가됨 (기준: ${basePillar})`);
              } else {
                console.log(`❌ 신살 ${h.name} 제외됨 (기준: ${basePillar}, 선택된: ${includeKeysBase})`);
              }
            }
          });
        }
      });
    } else {
      // 12신살이 아닌 경우 기존 로직 사용
      includeKeys.forEach((key) => {
        const pillarKey = key as keyof typeof sinsalResult;
        const arr = sinsalResult[pillarKey] as Array<
          { name: string; elements?: Array<{ pillar?: string }> }
        > | undefined;
        if (Array.isArray(arr)) {
          arr.forEach((h) => {
            if (!h.elements || h.elements.length === 0) {
              names.push(h.name);
              return;
            }
            
            // elements에 선택된 기둥이 포함되는지 추가 확인 (안전장치)
            const ok = h.elements.some((el) =>
              el && el.pillar ? includeKeys.includes(el.pillar as string) : true
            );
            if (ok) names.push(h.name);
          });
        }
      });
    }

    return Array.from(names);
  };

  // 원국 신살 요약 (서버 sajuData.sinsal 기반)
  const getOriginalSinsalNames = (): string[] => {
    try {
      const result = sajuData?.sinsal as unknown as Record<
        string,
        Array<{ name: string }>
      >;
      if (!result) return [];
      return extractUniqueSinsalNamesFromResult(result);
    } catch {
      return [];
    }
  };

  // 신살 배지 렌더러
  const renderSinsalBadges = () => {
    let names: string[] = [];
    if (relationshipMode === "original") names = getOriginalSinsalNames();
    if (relationshipMode === "daewoon" && daewoonSinsalNames)
      names = daewoonSinsalNames;
    if (relationshipMode === "sewoon" && sewoonSinsalNames)
      names = sewoonSinsalNames;

    if (!names || names.length === 0) return null;

    // 길신/흉신 분류용 간단 세트 (필요 시 서버에서 타입 제공 시 대체)
    const GILSIN_SET = new Set<string>([
      "천을귀인",
      "태극귀인",
      "천덕귀인",
      "월덕귀인",
      "문창귀인",
      "금여",
      "암록",
      "학당귀인",
      "천관귀인",
      "천주귀인",
      "문곡귀인",
      "천문성",
      "천의성",
    ]);
    const HEUNGSIN_SET = new Set<string>([
      "양인",
      "백호",
      "괴강",
      "효신",
      "원진",
      "귀문관",
      "급각",
      "부벽",
      "비인",
      "천공",
      "현침",
      "탕화",
      "고란",
      "음착",
      "양차",
      "과인",
      "상충",
      "혈인",
      "욕망",
      "유하",
      "옥여",
      "구인",
      "광음",
      "공망",
    ]);

    const gilsinNames = names.filter((n) => GILSIN_SET.has(n));
    const otherNames = names.filter((n) => !GILSIN_SET.has(n));

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        {/* 1행: 신살/흉신 - 동일 라인, 색상만 구분 */}
        {otherNames.length > 0 && (
          <div className="mb-2">
            <div className="text-center text-xs text-gray-600 mb-1">신살/흉신</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {otherNames.map((n, index) => {
                const isHeungsin = HEUNGSIN_SET.has(n);
                const cls = isHeungsin
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-gray-100 text-gray-700 border-gray-200";
                return (
                  <span
                    key={`sinsal-${n}-${index}`}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border ${cls}`}
                    title={n}
                  >
                    {n.length > 2 ? n.slice(0, 2) : n}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 2행: 길신 - 황금색 */}
        {gilsinNames.length > 0 && (
          <div>
            <div className="text-center text-xs text-gray-600 mb-1">길신</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {gilsinNames.map((n, index) => (
                <span
                  key={`gilsin-${n}-${index}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-200"
                  title={n}
                >
                  {n.length > 2 ? n.slice(0, 2) : n}
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

    // 기본 사주 컬럼들
    columns.push(
      { type: "pillar", title: "시주", data: pillars.hour },
      { type: "pillar", title: "일주", data: pillars.day },
      { type: "pillar", title: "월주", data: pillars.month },
      { type: "pillar", title: "년주", data: pillars.year }
    );

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
                className={`p-2 text-center font-semibold text-sm border border-gray-300 cursor-pointer transition-colors ${
                  col.type === "pillar" && pillarFilters[col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters]
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  if (col.type === "pillar") {
                    const pillarKey = col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters;
                    setPillarFilters((prev) => ({ ...prev, [pillarKey]: !prev[pillarKey] }));
                  }
                }}
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
                className={`p-2 text-center text-lg font-bold border border-gray-300 cursor-pointer transition-colors hover:bg-gray-50 ${getOhaengColor(
                  col.type === "pillar" ? col.data.gan : col.data.gan
                )} ${
                  col.type === "pillar" && pillarFilters[col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters]
                    ? "ring-2 ring-blue-300"
                    : ""
                }`}
                onClick={() => {
                  if (col.type === "pillar") {
                    const pillarKey = col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters;
                    setPillarFilters((prev) => ({ ...prev, [pillarKey]: !prev[pillarKey] }));
                  }
                }}
              >
                {col.type === "pillar" ? col.data.gan : col.data.gan}
              </div>
            ))}

            {/* 지지 글자 행 */}
            {columns.map((col, index) => (
              <div
                key={`ji-${index}`}
                className={`p-2 text-center text-lg font-bold border border-gray-300 cursor-pointer transition-colors hover:bg-gray-50 ${getOhaengColor(
                  col.type === "pillar" ? col.data.ji : col.data.ji
                )} ${
                  col.type === "pillar" && pillarFilters[col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters]
                    ? "ring-2 ring-blue-300"
                    : ""
                }`}
                onClick={() => {
                  if (col.type === "pillar") {
                    const pillarKey = col.title.toLowerCase().replace("주", "") as keyof typeof pillarFilters;
                    setPillarFilters((prev) => ({ ...prev, [pillarKey]: !prev[pillarKey] }));
                  }
                }}
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
            onClick={() => setRelationshipMode("original")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              relationshipMode === "original"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            원국
          </button>
          <button
            onClick={() => setRelationshipMode("daewoon")}
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
            onClick={() => setRelationshipMode("sewoon")}
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
                  setPillarFilters((prev) => ({ ...prev, year: e.target.checked }))
                }
              />
              <span>년주</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.month}
                onChange={(e) =>
                  setPillarFilters((prev) => ({ ...prev, month: e.target.checked }))
                }
              />
              <span>월주</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.day}
                onChange={(e) =>
                  setPillarFilters((prev) => ({ ...prev, day: e.target.checked }))
                }
              />
              <span>일주</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={pillarFilters.hour}
                onChange={(e) =>
                  setPillarFilters((prev) => ({ ...prev, hour: e.target.checked }))
                }
              />
              <span>시주</span>
            </label>
          </div>
          {(relationshipMode === "daewoon" || relationshipMode === "sewoon") && (
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={unOnly}
                onChange={(e) => setUnOnly(e.target.checked)}
              />
              <span>{relationshipMode === "daewoon" ? "대운만" : "세운만"}</span>
            </label>
          )}
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
        <button
          onClick={onReset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          다시 입력
        </button>
      </div>

      {displayBasicInfo()}
      {displaySajuTable()}
      {displayDaewoonTable()}
      {displaySewoonTable()}
      {displayWoolwoonTable()}
    </div>
  );
};

export default ManseServiceBox;
