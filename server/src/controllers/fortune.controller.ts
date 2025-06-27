// server/src/controllers/fortune.controller.ts (최종 완성본)

import { Request, Response } from "express";
import { getSajuDetails } from "../services/saju.service";
import { ParamsDictionary } from "express-serve-static-core";
// ✅ 1. 주석을 해제하고 AI 관련 모듈을 정식으로 import 합니다.
import { getAiGeneratedResponse, AiGeneratedOutput } from "../ai/ai.service";

// 요청(Request)으로 들어올 데이터의 형태
interface FortuneRequestBody {
  birthDate: string;
  gender: "M" | "W";
  calendarType: "solar" | "lunar";
  birthTime?: string;
}

// 성공 시 응답(Response)으로 나갈 데이터의 형태
type SajuResult = Awaited<ReturnType<typeof getSajuDetails>>;

interface SuccessResponseBody {
  userInfo: { birthDate: string; gender: "M" | "W" };
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
  try {
    const { birthDate, gender, calendarType, birthTime } = req.body;

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
      userInfo: { birthDate, gender },
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
