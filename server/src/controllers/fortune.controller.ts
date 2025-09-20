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
  res: Response<SuccessResponseBody | ErrorResponseBody>
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
      sajuResult.interpretation.hwaEuiPrompt
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
  res: Response<SuccessResponseBody | ErrorResponseBody>
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
      },
      saju: sajuResultWithRelationships,
      aiResponse: null, // 만세력은 AI 해석 없음
    };

    // 디버깅: 실제 응답 데이터 확인
    console.log(
      "🔍 백엔드 응답 데이터:",
      JSON.stringify(finalResponse, null, 2)
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
  res: Response
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
  res: Response
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
  res: Response
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
  res: Response
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
      "M" // gender는 기본값으로 M 사용
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
