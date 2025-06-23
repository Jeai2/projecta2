// src/controllers/fortune.controller.ts

import { Request, Response } from "express";
import { getSajuDetails } from "../services/saju.service";
import { ParamsDictionary } from "express-serve-static-core";
// ✅ AI 관련 import는 추후 AI 연동 단계에서 추가될 예정입니다.
// import { getAiGeneratedResponse, AiGeneratedOutput } from '../ai/ai.service';

// 1. 요청(Request)으로 들어올 데이터의 형태 (기존과 동일)
interface FortuneRequestBody {
  birthDate: string;
  gender: "M" | "W";
  calendarType: "solar" | "lunar";
  birthTime?: string;
}

// 2. 성공 시 응답(Response)으로 나갈 데이터의 형태
type SajuResult = Awaited<ReturnType<typeof getSajuDetails>>;

// ✅ [수정] SuccessResponseBody에서 fortune 속성을 제거합니다.
interface SuccessResponseBody {
  userInfo: { birthDate: string; gender: "M" | "W" };
  saju: SajuResult;
  // aiResponse: AiGeneratedOutput | null; // AI 연동 시 이 부분을 추가하게 됩니다.
}

// 3. 실패 시 응답(Response)으로 나갈 데이터의 형태 (기존과 동일)
interface ErrorResponseBody {
  error: true;
  message: string;
}

// 4. 오늘의 운세 API의 핵심 로직을 담당하는 '컨트롤러' 함수.
export const getTodaysFortune = async (
  req: Request<
    ParamsDictionary,
    SuccessResponseBody | ErrorResponseBody,
    FortuneRequestBody
  >,
  res: Response<SuccessResponseBody | ErrorResponseBody>
) => {
  try {
    const { birthDate, gender, calendarType, birthTime } = req.body;

    if (!birthDate || !gender || !calendarType) {
      return res
        .status(400)
        .json({ error: true, message: "필수 정보가 누락되었습니다." });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || "00:00"}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res
        .status(400)
        .json({ error: true, message: "잘못된 날짜/시간 형식입니다." });
    }

    const sajuResult = await getSajuDetails(birthDateObject, gender);

    // ✅ [수정] 최종 응답 객체에서 fortune 속성을 제거합니다.
    const finalResponse: SuccessResponseBody = {
      userInfo: { birthDate, gender },
      saju: sajuResult,
      // aiResponse: await getAiGeneratedResponse(sajuResult.interpretation.hwaEuiPrompt), // AI 연동 시 이 로직 추가
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
