// src/controllers/fortune.controller.ts

import { Request, Response } from 'express';
import { getSajuDetails } from '../services/saju.service';
import { ParamsDictionary } from 'express-serve-static-core';

// [수석 설계자 노트 - 핵심 수정]
// GPT의 제안을 채택하여, API가 주고받는 데이터의 '설계도(타입)'를 완벽하게 정의한다.

// 1. 요청(Request)으로 들어올 데이터의 형태
interface FortuneRequestBody {
  birthDate: string;
  gender: 'M' | 'W'; // 대운 계산을 위해 'M', 'W'로 타입 통일
  calendarType: 'solar' | 'lunar';
  birthTime?: string;
}

// 2. 성공 시 응답(Response)으로 나갈 데이터의 형태
// Promise<T>에서 T 타입을 추출하기 위해 내장 유틸리티 타입인 Awaited를 사용합니다.
type SajuResult = Awaited<ReturnType<typeof getSajuDetails>>;

interface SuccessResponseBody {
  userInfo: { birthDate: string; gender: 'M' | 'W'; };
  saju: SajuResult;
  fortune: {
    today: {
      summary: string;
      total: { title: string; content: string; };
    }
  };
}

// 3. 실패 시 응답(Response)으로 나갈 데이터의 형태
interface ErrorResponseBody {
  error: true;
  message: string;
}

// 4. 오늘의 운세 API의 핵심 로직을 담당하는 '컨트롤러' 함수.
// [수정] getTodaysFortune을 async 함수로 변경하여 비동기 처리를 지원합니다.
export const getTodaysFortune = async (
  req: Request<ParamsDictionary, SuccessResponseBody | ErrorResponseBody, FortuneRequestBody>, 
  res: Response<SuccessResponseBody | ErrorResponseBody>
) => {
  try {
    const { birthDate, gender, calendarType, birthTime } = req.body;

    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({ error: true, message: '필수 정보가 누락되었습니다.' });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || '00:00'}:00`);
    if (isNaN(birthDateObject.getTime())) {
      return res.status(400).json({ error: true, message: '잘못된 날짜/시간 형식입니다.' });
    }

    // [수정] await을 사용하여 비동기 함수인 getSajuDetails를 호출하고, gender 파라미터를 전달합니다.
    const sajuResult = await getSajuDetails(birthDateObject, gender);

    const todaysFortune: SuccessResponseBody = {
      userInfo: { birthDate, gender },
      saju: sajuResult,
      fortune: {
        today: {
          summary: "새로운 기회가 문을 두드리는 하루입니다.",
          total: { title: "오늘의 총운", content: "..." },
        }
      }
    };

    return res.status(200).json(todaysFortune);

  } catch (error) {
    console.error('[API Error] getTodaysFortune Controller:', error);
    const errorResponse: ErrorResponseBody = { error: true, message: '서버 내부 오류' };
    return res.status(500).json(errorResponse);
  }
};