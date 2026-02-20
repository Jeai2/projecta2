// server/src/controllers/fortune.controller.ts (최종 완성본)

import { Request, Response } from "express";
import { getSajuDetails, getSewoonForDaewoon } from "../services/saju.service";
import { getAllWoolwoonForYear } from "../services/woolwoon.service";
import { getJijiRelationships } from "../services/relationship.service";
import {
  getDaewoonRelationships,
  getSewoonRelationships,
} from "../services/relationship-with-un.service";
import { ParamsDictionary } from "express-serve-static-core";
// ✅ 1. 주석을 해제하고 AI 관련 모듈을 정식으로 import 합니다.
import { getAiGeneratedResponse, AiGeneratedOutput } from "../ai/ai.service";
// ✅ 오늘의 운세 서비스 import
import { getTodayFortune } from "../services/today-fortune.service";
// ✅ 일주론 서비스 import
import { getIljuAnalysis } from "../services/ilju.service";

// 요청(Request)으로 들어올 데이터의 형태
interface FortuneRequestBody {
  name?: string;
  birthDate: string;
  gender: "M" | "W";
  calendarType: "solar" | "lunar";
  birthTime?: string;
  birthPlace?: string;
}

// 성공 시 응답(Response)으로 나갈 데이터의 형태
type SajuResult = Awaited<ReturnType<typeof getSajuDetails>>;

interface SuccessResponseBody {
  userInfo: {
    name?: string;
    birthDate: string;
    gender: "M" | "W";
    birthPlace?: string;
    calendarType: "solar" | "lunar";
    birthTime?: string;
    timeUnknown?: boolean;
  };
  saju: SajuResult;
  aiResponse: AiGeneratedOutput | null; // ✅ 2. aiResponse 타입을 응답에 포함시킵니다.
}

// 실패 시 응답(Response)으로 나갈 데이터의 형태
interface ErrorResponseBody {
  error: true;
  message: string;
}

// API의 핵심 로직을 담당하는 '컨트롤러' 함수
export const getTodaysFortune = async (
  req: Request<
    ParamsDictionary,
    SuccessResponseBody | ErrorResponseBody,
    FortuneRequestBody
  >,
  res: Response<SuccessResponseBody | ErrorResponseBody>,
) => {
  console.log("🚀 getTodaysFortune Controller 호출됨!");
  try {
    const { name, birthDate, gender, calendarType, birthTime, birthPlace } =
      req.body;
    console.log("📥 getTodaysFortune에서 받은 요청 데이터:", {
      name,
      birthDate,
      gender,
      calendarType,
      birthTime,
      birthPlace,
    });

    if (!birthDate || !gender || !calendarType) {
      return res
        .status(400)
        .json({ error: true, message: "필수 정보가 누락되었습니다." });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || "12:00"}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res
        .status(400)
        .json({ error: true, message: "잘못된 날짜/시간 형식입니다." });
    }

    // 1. 사주 데이터 전체를 계산합니다.
    const sajuResult = await getSajuDetails(birthDateObject, gender);

    // ✅ 3. 계산된 사주 해석에서 '화의론 프롬프트'를 추출하여 AI 서비스를 호출합니다.
    const aiResponse = await getAiGeneratedResponse(
      sajuResult.interpretation.hwaEuiPrompt,
    );

    // ✅ 4. 최종 응답 객체에 AI 결과(`aiResponse`)를 포함시킵니다.
    const finalResponse: SuccessResponseBody = {
      userInfo: {
        birthDate,
        gender,
        name,
        birthPlace,
        calendarType,
        birthTime,
        timeUnknown: !birthTime || birthTime.trim() === "",
      },
      saju: sajuResult,
      aiResponse: aiResponse,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("[API Error] getTodaysFortune Controller:", error);
    const errorResponse: ErrorResponseBody = {
      error: true,
      message: "서버 내부 오류",
    };
    return res.status(500).json(errorResponse);
  }
};

// 만세력 전용 API 컨트롤러
export const getManseFortune = async (
  req: Request<
    ParamsDictionary,
    SuccessResponseBody | ErrorResponseBody,
    FortuneRequestBody
  >,
  res: Response<SuccessResponseBody | ErrorResponseBody>,
) => {
  console.log("🚀 getManseFortune Controller 호출됨!");
  try {
    const { name, birthDate, gender, calendarType, birthTime, birthPlace } =
      req.body;
    console.log("📥 getManseFortune에서 받은 요청 데이터:", {
      name,
      birthDate,
      gender,
      calendarType,
      birthTime,
      birthPlace,
    });

    if (!birthDate || !gender || !calendarType) {
      return res
        .status(400)
        .json({ error: true, message: "필수 정보가 누락되었습니다." });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || "12:00"}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res
        .status(400)
        .json({ error: true, message: "잘못된 날짜/시간 형식입니다." });
    }

    // 만세력은 사주 데이터만 계산 (AI 해석 제외)
    const sajuResult = await getSajuDetails(birthDateObject, gender);

    // 지지 간 관계 계산 추가
    const relationships = getJijiRelationships({
      year:
        sajuResult.sajuData.pillars.year.gan +
        sajuResult.sajuData.pillars.year.ji,
      month:
        sajuResult.sajuData.pillars.month.gan +
        sajuResult.sajuData.pillars.month.ji,
      day:
        sajuResult.sajuData.pillars.day.gan +
        sajuResult.sajuData.pillars.day.ji,
      hour:
        sajuResult.sajuData.pillars.hour.gan +
        sajuResult.sajuData.pillars.hour.ji,
    });

    // 관계 데이터를 포함한 새로운 sajuResult 객체 생성
    const sajuResultWithRelationships = {
      ...sajuResult,
      sajuData: {
        ...sajuResult.sajuData,
        relationships,
      },
    };

    // 만세력 응답 (AI 응답 없음)
    const finalResponse: SuccessResponseBody = {
      userInfo: {
        name: name ?? "미입력",
        birthDate,
        gender,
        birthPlace: birthPlace ?? "미입력",
        calendarType,
        birthTime: birthTime ?? "12:00",
        timeUnknown: !birthTime || birthTime.trim() === "",
      },
      saju: sajuResultWithRelationships,
      aiResponse: null, // 만세력은 AI 해석 없음
    };

    // 디버깅: 실제 응답 데이터 확인
    console.log(
      "🔍 백엔드 응답 데이터:",
      JSON.stringify(finalResponse, null, 2),
    );

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("[API Error] getManseFortune Controller:", error);
    const errorResponse: ErrorResponseBody = {
      error: true,
      message: "서버 내부 오류",
    };
    return res.status(500).json(errorResponse);
  }
};

// 대운별 세운 데이터 조회 API
export const getSewoonForDaewoonAPI = async (
  req: Request<
    ParamsDictionary,
    unknown,
    unknown,
    { daewoonStartYear: string; dayGan: string }
  >,
  res: Response,
) => {
  try {
    const { daewoonStartYear, dayGan } = req.query;

    if (!daewoonStartYear || !dayGan) {
      return res.status(400).json({
        error: true,
        message: "대운 시작 연도와 일간이 필요합니다.",
      });
    }

    const startYear = parseInt(daewoonStartYear);
    if (isNaN(startYear)) {
      return res.status(400).json({
        error: true,
        message: "올바른 연도를 입력해주세요.",
      });
    }

    const sewoonData = getSewoonForDaewoon(startYear, dayGan);

    return res.status(200).json({
      error: false,
      data: {
        daewoonStartYear: startYear,
        dayGan,
        sewoonData,
      },
    });
  } catch (error) {
    console.error("대운별 세운 데이터 조회 오류:", error);
    return res.status(500).json({
      error: true,
      message: "서버 내부 오류",
    });
  }
};

// 월운 데이터 조회 API
export const getWoolwoonForYearAPI = async (
  req: Request<
    ParamsDictionary,
    unknown,
    unknown,
    { year: string; dayGan: string }
  >,
  res: Response,
) => {
  try {
    const { year, dayGan } = req.query;

    if (!year || !dayGan) {
      return res.status(400).json({
        error: true,
        message: "연도와 일간이 필요합니다.",
      });
    }

    const targetYear = parseInt(year);
    if (isNaN(targetYear)) {
      return res.status(400).json({
        error: true,
        message: "올바른 연도를 입력해주세요.",
      });
    }

    const woolwoonData = getAllWoolwoonForYear(targetYear, dayGan);

    return res.status(200).json({
      error: false,
      data: {
        year: targetYear,
        dayGan,
        woolwoonData,
      },
    });
  } catch (error) {
    console.error("월운 데이터 조회 오류:", error);
    return res.status(500).json({
      error: true,
      message: "서버 내부 오류",
    });
  }
};

// 대운과 사주팔자 간의 관계 조회 API
export const getDaewoonRelationshipsAPI = async (
  req: Request<
    ParamsDictionary,
    unknown,
    unknown,
    { daewoonGanji: string; sajuPillars: string }
  >,
  res: Response,
) => {
  try {
    const { daewoonGanji, sajuPillars } = req.query;

    if (!daewoonGanji || !sajuPillars) {
      return res.status(400).json({
        error: true,
        message: "대운 간지와 사주 기둥 정보가 필요합니다.",
      });
    }

    // JSON 파싱
    const pillars = JSON.parse(sajuPillars);

    // 대운과 사주팔자 간의 관계 계산 (신살 포함)
    const result = getDaewoonRelationships(pillars, daewoonGanji, "M"); // gender는 기본값으로 M 사용

    return res.status(200).json({
      error: false,
      data: {
        relationships: result.relationships,
        sinsal: result.sinsal,
      },
    });
  } catch (error) {
    console.error("대운 관계 조회 오류:", error);
    return res.status(500).json({
      error: true,
      message: "서버 내부 오류",
    });
  }
};

// 세운과 사주팔자+대운 간의 관계 조회 API
export const getSewoonRelationshipsAPI = async (
  req: Request<
    ParamsDictionary,
    unknown,
    unknown,
    { sewoonGanji: string; daewoonGanji: string; sajuPillars: string }
  >,
  res: Response,
) => {
  try {
    const { sewoonGanji, daewoonGanji, sajuPillars } = req.query;

    if (!sewoonGanji || !daewoonGanji || !sajuPillars) {
      return res.status(400).json({
        error: true,
        message: "세운 간지, 대운 간지, 사주 기둥 정보가 필요합니다.",
      });
    }

    // JSON 파싱
    const pillars = JSON.parse(sajuPillars);

    // 세운과 사주팔자+대운 간의 관계 계산 (신살 포함)
    const result = getSewoonRelationships(
      pillars,
      daewoonGanji,
      sewoonGanji,
      "M", // gender는 기본값으로 M 사용
    );

    return res.status(200).json({
      error: false,
      data: {
        relationships: result.relationships,
        sinsal: result.sinsal,
      },
    });
  } catch (error) {
    console.error("세운 관계 조회 오류:", error);
    return res.status(500).json({
      error: true,
      message: "서버 내부 오류",
    });
  }
};

// ✅ 오늘의 운세 API 엔드포인트 (일진 기반)
export const getTodayFortuneAPI = async (
  req: Request<ParamsDictionary, any, FortuneRequestBody>,
  res: Response,
) => {
  try {
    const { name, birthDate, gender, calendarType, birthTime, birthPlace } =
      req.body;

    // 필수 필드 검증
    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({
        error: true,
        message: "필수 필드가 누락되었습니다.",
      });
    }

    console.log("📤 오늘의 운세 요청 데이터:", req.body);

    // 오늘의 운세 데이터 생성
    const result = await getTodayFortune({
      name: name || "",
      birthDate,
      gender,
      calendarType,
      birthTime: birthTime || "",
      birthPlace: birthPlace || "",
    });

    console.log("📥 오늘의 운세 응답 데이터:", result);

    return res.status(200).json({
      error: false,
      data: result,
    });
  } catch (error) {
    console.error("오늘의 운세 조회 오류:", error);
    return res.status(500).json({
      error: true,
      message: "서버 내부 오류",
    });
  }
};

// 일주론 API
export const getIljuFortune = async (
  req: Request<
    ParamsDictionary,
    | { error: false; data: Awaited<ReturnType<typeof getIljuAnalysis>> }
    | ErrorResponseBody,
    { birthDate: string; gender: "M" | "W"; calendarType: "solar" | "lunar" }
  >,
  res: Response<
    | { error: false; data: Awaited<ReturnType<typeof getIljuAnalysis>> }
    | ErrorResponseBody
  >,
) => {
  try {
    const { birthDate, gender, calendarType } = req.body;

    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({
        error: true,
        message: "필수 정보가 누락되었습니다.",
      });
    }

    const birthDateObject = new Date(`${birthDate}T12:00:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res.status(400).json({
        error: true,
        message: "잘못된 날짜 형식입니다.",
      });
    }

    const iljuResult = await getIljuAnalysis(
      birthDateObject,
      gender,
      calendarType,
    );

    return res.status(200).json({
      error: false,
      data: iljuResult,
    });
  } catch (error) {
    console.error("[API Error] getIljuFortune Controller:", error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "서버 내부 오류",
    });
  }
};

// 오행 그래프 데이터 API
export const getOhaengChart = async (
  req: Request<
    ParamsDictionary,
    { error: false; data: any } | ErrorResponseBody,
    {
      birthDate: string;
      gender: "M" | "W";
      calendarType: "solar" | "lunar";
      birthTime?: string;
      includeJijanggan?: boolean;
    }
  >,
  res: Response<{ error: false; data: any } | ErrorResponseBody>,
) => {
  try {
    const { birthDate, gender, calendarType, birthTime, includeJijanggan } =
      req.body;

    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({
        error: true,
        message: "필수 정보가 누락되었습니다.",
      });
    }

    const hasHourInput = !!(birthTime && birthTime.trim() !== "");
    const birthDateObject = new Date(`${birthDate}T${birthTime || "12:00"}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res.status(400).json({
        error: true,
        message: "잘못된 날짜/시간 형식입니다.",
      });
    }

    // 사주 계산
    const { getSajuDetails } = await import("../services/saju.service");
    const sajuResult = await getSajuDetails(birthDateObject, gender);

    // 오행 그래프 데이터 계산 (시주 없으면 6글자만)
    const { calculateOhaengChart } =
      await import("../services/ohaeng-chart.service");
    const chartData = calculateOhaengChart(sajuResult.sajuData, {
      includeJijanggan: includeJijanggan ?? false,
      excludeHour: !hasHourInput,
      normalization: "percentage",
    });

    // 일간 (선버스트 색상 + 삼합/방합 보너스용)
    const dayGan =
      sajuResult.sajuData.pillars?.day?.gan ?? null;

    // 일간 제외 십신 개수 (시주 없으면 5위치만)
    const { getSipsinCountWithSamhapBanghap, getSipsinCountExcludingDayGan } =
      await import("../services/sipsin.service");
    const pillars = sajuResult.sajuData.pillars;
    const sipsinForCount = hasHourInput
      ? sajuResult.sajuData.sipsin
      : { ...sajuResult.sajuData.sipsin, hour: { gan: null, ji: null } };
    const pillarsForBonus = hasHourInput
      ? { year: { ji: pillars.year.ji ?? null }, month: { ji: pillars.month.ji ?? null }, day: { ji: pillars.day.ji ?? null }, hour: { ji: pillars.hour.ji ?? null } }
      : { year: { ji: pillars.year.ji ?? null }, month: { ji: pillars.month.ji ?? null }, day: { ji: pillars.day.ji ?? null }, hour: { ji: null } };
    const sipsinCount =
      dayGan != null
        ? getSipsinCountWithSamhapBanghap(
            sipsinForCount,
            pillarsForBonus,
            dayGan
          )
        : getSipsinCountExcludingDayGan(sipsinForCount);

    // 유저가 보유한 신살 목록 + 직무 능력 텍스트 (커리어 페이지 배지용)
    const { SINSAL_INTERPRETATION } = await import(
      "../data/interpretation/sinsal"
    );
    // 12신살·rules 등에서 쓰는 짧은 이름 → interpretation 키(살 접미사 등) 정규화 → 동일 신살 중복 제거
    const SINSAL_NAME_TO_INTERPRETATION_KEY: Record<string, string> = {
      화개: "화개살",
      반안: "반안살",
      역마: "역마살",
      망신: "망신살",
      장성: "장성살",
      육해: "육해살",
    };
    const toInterpretationKey = (name: string) =>
      SINSAL_NAME_TO_INTERPRETATION_KEY[name] ?? name;
    const toCapabilities = (names: Set<string>) =>
      Array.from(names).map((interpretationKey) => {
        const def = SINSAL_INTERPRETATION[interpretationKey];
        return {
          name: interpretationKey,
          modalDisplayName: def?.modalDisplayName ?? undefined,
          careerTitle: def?.careerTitle ?? interpretationKey,
          careerDescription: def?.careerDescription ?? "",
          careerImageUrl: def?.careerImageUrl ?? undefined,
          potentialAbility:
            def?.potentialAbility ?? def?.careerTitle ?? interpretationKey,
          expertOpinion:
            def?.expertOpinion ?? def?.careerDescription ?? "",
          luckyAction:
            def?.luckyAction ?? "이 신살의 특성을 활용한 행동을 추천합니다.",
        };
      });

    // 12신살: 년지/월지(및 일지) 기준 — 해당 지지의 삼합으로 맵을 정하고, 년·월·일·시 네 지지를 각각 조회한 결과 (중복 1개만)
    const { SINSAL_12_MAP, getSamhapGroup } = await import("../data/sinsal");
    const yearJi = pillars.year?.ji ?? "";
    const monthJi = pillars.month?.ji ?? "";
    const dayJi = pillars.day?.ji ?? "";
    const hourJi = hasHourInput ? (pillars.hour?.ji ?? "") : "";
    const allFourJi = hasHourInput
      ? ([yearJi, monthJi, dayJi, hourJi] as const)
      : ([yearJi, monthJi, dayJi] as readonly [string, string, string]);

    const add12SinsalByBaseJi = (baseJi: string, keys: Set<string>) => {
      const group = getSamhapGroup(baseJi);
      if (!group) return;
      const ruleSet = SINSAL_12_MAP[group];
      for (const ji of allFourJi) {
        const name = ruleSet?.[ji];
        if (name) keys.add(toInterpretationKey(name));
      }
    };

    // 40세까지: 년지 기준 4개 + 월지 기준 4개 + pillar(년·월) 기타 신살, 동일 신살 1개만
    const sinsalKeysUnder40 = new Set<string>();
    add12SinsalByBaseJi(yearJi, sinsalKeysUnder40);
    add12SinsalByBaseJi(monthJi, sinsalKeysUnder40);
    for (const key of ["year", "month"] as const) {
      const hits = pillars[key]?.sinsal ?? [];
      for (const hit of hits) {
        if (hit?.name) sinsalKeysUnder40.add(toInterpretationKey(hit.name));
      }
    }

    // 40세 이후: 년지·월지·일지 기준 각 4개 + pillar(년·월·일) 기타 신살, 동일 신살 1개만
    const sinsalKeysOver40 = new Set<string>();
    add12SinsalByBaseJi(yearJi, sinsalKeysOver40);
    add12SinsalByBaseJi(monthJi, sinsalKeysOver40);
    add12SinsalByBaseJi(dayJi, sinsalKeysOver40);
    for (const key of ["year", "month", "day"] as const) {
      const hits = pillars[key]?.sinsal ?? [];
      for (const hit of hits) {
        if (hit?.name) sinsalKeysOver40.add(toInterpretationKey(hit.name));
      }
    }

    const sinsalCapabilitiesUnder40 = toCapabilities(sinsalKeysUnder40);
    const sinsalCapabilitiesOver40 = toCapabilities(sinsalKeysOver40);

    // 만 나이 계산 (오늘 기준): 40세 미만이면 년·월 기준만, 40세 이상이면 년·월·일 기준 표시
    const today = new Date();
    let currentAge = today.getFullYear() - birthDateObject.getFullYear();
    if (
      today.getMonth() < birthDateObject.getMonth() ||
      (today.getMonth() === birthDateObject.getMonth() &&
        today.getDate() < birthDateObject.getDate())
    ) {
      currentAge -= 1;
    }
    const isOver40 = currentAge >= 40;

    return res.status(200).json({
      error: false,
      data: {
        ...chartData,
        sipsinCount,
        dayGan,
        currentAge,
        isOver40,
        sinsalCapabilitiesUnder40,
        sinsalCapabilitiesOver40,
        timeUnknown: !hasHourInput,
      },
    });
  } catch (error) {
    console.error("[API Error] getOhaengChart Controller:", error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "서버 내부 오류",
    });
  }
};

// 진로 직업 찾기 API
export const getCareerAnalysis = async (
  req: Request<
    ParamsDictionary,
    { error: false; data: any } | ErrorResponseBody,
    {
      name?: string;
      birthDate: string;
      gender: "M" | "W";
      calendarType: "solar" | "lunar";
      birthTime?: string;
    }
  >,
  res: Response<{ error: false; data: any } | ErrorResponseBody>,
) => {
  try {
    const { name, birthDate, gender, calendarType, birthTime } = req.body;

    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({
        error: true,
        message: "필수 정보가 누락되었습니다.",
      });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || "12:00"}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res.status(400).json({
        error: true,
        message: "잘못된 날짜/시간 형식입니다.",
      });
    }

    // 사주 계산
    const { getSajuDetails } = await import("../services/saju.service");
    const sajuResult = await getSajuDetails(birthDateObject, gender);

    // 당사주 유산(직군): 년지 + 음력 생월(1–12) + 성별 → 남/여 각각 직군 매칭
    // 음력 생월: 음력 입력 시 생일 월 사용, 양력 입력 시 양→음 변환 후 월 사용
    let lunarMonth: number;
    if (calendarType === "lunar") {
      lunarMonth = birthDateObject.getMonth() + 1; // JS month 0–11 → 1–12
    } else {
      try {
        const KoreanLunarCalendar = (
          await import("korean-lunar-calendar")
        ).default;
        const calendar = new KoreanLunarCalendar();
        calendar.setSolarDate(
          birthDateObject.getFullYear(),
          birthDateObject.getMonth() + 1,
          birthDateObject.getDate()
        );
        const lunar = calendar.getLunarCalendar();
        lunarMonth = lunar?.month ?? birthDateObject.getMonth() + 1;
      } catch {
        const { jiToMonthNumber } = await import("../data/job-map.data");
        lunarMonth = jiToMonthNumber(
          sajuResult.sajuData.pillars.month.ji as Parameters<
            typeof jiToMonthNumber
          >[0]
        );
      }
    }

    const { getJobLegacyByGender } = await import(
      "../services/job-legacy.service"
    );
    const pillars = sajuResult.sajuData.pillars;
    const daewoonList = sajuResult.sajuData.daewoonFull;
    // 만세력(Manse) 페이지와 동일한 기준으로 현재 대운을 계산
    let currentDaewoon = null as typeof sajuResult.sajuData.currentDaewoon;
    if (daewoonList && daewoonList.length > 0) {
      const currentYear = new Date().getFullYear();
      const birthYear = birthDateObject.getFullYear();
      const currentAge = currentYear - birthYear;
      const currentDaewoonIndex = Math.floor((currentAge - 9) / 10);
      currentDaewoon =
        daewoonList[currentDaewoonIndex] ?? daewoonList[daewoonList.length - 1] ?? null;
    }
    const jobLegacy = getJobLegacyByGender(
      pillars.year.gan,
      pillars.year.ji,
      lunarMonth
    );

    // Archetype 6 (홀랜드 6유형) 점수 산출
    const hasHourInput = !!(birthTime && birthTime.trim() !== "");
    const timeUnknown = !hasHourInput;
    const { calculateArchetype6 } =
      await import("../services/archetype.service");
    const archetypeResult = calculateArchetype6(
      sajuResult.sajuData,
      birthDateObject,
      lunarMonth,
      gender,
      { hasHourInput },
    );

    // 진로 에너지 타입 결정 (시주 없으면 년월일만)
    const { determineCareerEnergy } =
      await import("../services/career-energy.service");
    const pillarsForEnergy = {
      year: pillars.year.gan + (pillars.year.ji ?? ""),
      month: pillars.month.gan + (pillars.month.ji ?? ""),
      day: pillars.day.gan + (pillars.day.ji ?? ""),
      ...(hasHourInput ? { hour: pillars.hour.gan + (pillars.hour.ji ?? "") } : { hour: null }),
    };
    const energyResult = determineCareerEnergy(
      birthDateObject,
      pillars.month.ji ?? "",
      pillarsForEnergy,
    );

    // 오행 breakdown (부족한 오행 직업 추천용)
    const { calculateOhaengChart } =
      await import("../services/ohaeng-chart.service");
    const ohaengChartForCareer = calculateOhaengChart(sajuResult.sajuData, {
      includeJijanggan: false,
      excludeHour: !hasHourInput,
    });

    // 4가지 출처별 직업 추천
    const { buildJobRecommendations } = await import(
      "../services/job-recommendations.service"
    );
    const jobRecommendationsBySource = buildJobRecommendations({
      dangnyeongGan: energyResult.dangnyeongGan,
      saryeongGan: energyResult.saryeongGan,
      archetypeScores: archetypeResult.scores,
      ohaengBreakdown: ohaengChartForCareer.breakdown,
    });

    const careerResult = {
      name: name || "1",
      gender,
      jobLegacyMale: jobLegacy.male,
      jobLegacyFemale: jobLegacy.female,
      energyType: energyResult.energyData.modifier,
      energyDescription: energyResult.energyData.description,
      keywords: energyResult.energyData.keywords,
      energyOhaeng: energyResult.energyData.ohaeng,
      imageUrl: energyResult.energyData.imageUrl, // 이미지 URL 포함
      jobRecommendationsBySource,
      successTip:
        "새로운 시작을 두려워하지 마세요. 당신의 창의적인 발상이 세상을 바꾸는 씨앗이 될 것입니다.",
      jobSatisfaction: 88,
      suitabilityData: [
        {
          category: "창의성/기획",
          characteristics: "아이디어 뱅크, 미래 지향",
          suitability: 95,
        },
        {
          category: "조율/관리",
          characteristics: "중개인, 안정적 토대",
          suitability: 40,
        },
        {
          category: "기술/전문성",
          characteristics: "논리적 판단, 결단력",
          suitability: 65,
        },
      ],
      // 만세력 네 기둥(년/월/일/시) 요약 — 시주 없으면 null
      pillarsSummary: {
        year: `${pillars.year.gan}${pillars.year.ji}`,
        month: `${pillars.month.gan}${pillars.month.ji}`,
        day: `${pillars.day.gan}${pillars.day.ji}`,
        hour: timeUnknown ? null : `${pillars.hour.gan}${pillars.hour.ji}`,
      },
      // 각 기둥의 천간 오행 (木火土金水) — 시주 없으면 null
      pillarsOhaengSummary: {
        year: pillars.year.ganOhaeng,
        month: pillars.month.ganOhaeng,
        day: pillars.day.ganOhaeng,
        hour: timeUnknown ? null : pillars.hour.ganOhaeng,
      },
      // 현재 대운 정보 (간지/나이/년)
      currentDaewoon: currentDaewoon
        ? {
            ganji: currentDaewoon.ganji,
            age: currentDaewoon.age,
            year: currentDaewoon.year,
          }
        : null,
      // 십이운성 봉법 (년/월/일/시 각 기둥, 일간 기준) — 시주 없으면 "-"
      pillarsSibiwunseong: {
        year: pillars.year.sibiwunseong ?? "",
        month: pillars.month.sibiwunseong ?? "",
        day: pillars.day.sibiwunseong ?? "",
        hour: timeUnknown ? "" : (pillars.hour.sibiwunseong ?? ""),
      },
      // 십이운성 거법 — 시주 없으면 "-"
      pillarsSibiwunseongGeopbeop:
        sajuResult.sajuData.sibiwunseongGeopbeop
          ? {
              year: sajuResult.sajuData.sibiwunseongGeopbeop.year ?? "",
              month: sajuResult.sajuData.sibiwunseongGeopbeop.month ?? "",
              day: sajuResult.sajuData.sibiwunseongGeopbeop.day ?? "",
              hour: timeUnknown ? "" : (sajuResult.sajuData.sibiwunseongGeopbeop.hour ?? ""),
            }
          : null,
      // Archetype 6 점수 (육각형 차트용)
      archetype: {
        scores: archetypeResult.scores,
        daewoonScores: archetypeResult.daewoonScores ?? undefined,
        timeUnknown: archetypeResult.timeUnknown ?? false,
      },
      timeUnknown,
      // 디버깅 정보 (선택적)
      debug: {
        source: energyResult.source,
        saryeongGan: energyResult.saryeongGan,
        dangnyeongGan: energyResult.dangnyeongGan,
        saryeongInPillars: energyResult.saryeongInPillars,
        dangnyeongInPillars: energyResult.dangnyeongInPillars,
      },
    };

    return res.status(200).json({
      error: false,
      data: careerResult,
    });
  } catch (error) {
    console.error("[API Error] getCareerAnalysis Controller:", error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "서버 내부 오류",
    });
  }
};

// 추천 직업 질의 AI 챗봇
export const postCareerChat = async (
  req: Request<
    ParamsDictionary,
    { error: false; reply: string } | ErrorResponseBody,
    { message: string; context: Record<string, unknown> }
  >,
  res: Response<{ error: false; reply: string } | ErrorResponseBody>
) => {
  try {
    const { message, context } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: true,
        message: "message가 필요합니다.",
      });
    }
    const { getCareerChatReply } = await import(
      "../services/career-chat.service"
    );
    const reply = await getCareerChatReply(message, context ?? {});
    return res.status(200).json({ error: false, reply });
  } catch (error) {
    console.error("[API Error] postCareerChat:", error);
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : "서버 내부 오류",
    });
  }
};
