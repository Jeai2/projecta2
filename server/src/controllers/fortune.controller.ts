import { Request, Response } from 'express';
import { getSajuInfo } from '../services/saju.service';
import { ParamsDictionary } from 'express-serve-static-core';

// 1. API가 받을 요청(Request)의 body 부분에 어떤 데이터가 들어오는지 명확한 '타입'을 정의한다.
interface FortuneRequestBody {
  birthDate: string;
  gender: 'male' | 'female';
  calendarType: 'solar' | 'lunar';
  birthTime?: string;
}

// 2. 오늘의 운세 API의 핵심 로직을 담당하는 '컨트롤러' 함수.
//    이제 라우터에서 분리되어, 오직 로직 처리에만 집중한다.
// [수정] Request 타입을 더 명확하게 정의하여 linter 경고를 해결한다.
export const getTodaysFortune = (req: Request<ParamsDictionary, any, FortuneRequestBody>, res: Response) => {
  try {
    const { birthDate, gender, calendarType, birthTime } = req.body;

    if (!birthDate || !gender || !calendarType) {
      return res.status(400).json({ error: true, message: '필수 정보가 누락되었습니다.' });
    }

    const birthDateObject = new Date(`${birthDate}T${birthTime || '00:00'}:00`);

    if (isNaN(birthDateObject.getTime())) {
      return res.status(400).json({ error: true, message: '잘못된 날짜/시간 형식입니다.' });
    }

    const sajuPillars = getSajuInfo(birthDateObject, gender);

    // TODO: 사주팔자를 기반으로 '오늘의 운세'를 해석하는 로직 추가
    const todaysFortune = {
      userInfo: { birthDate, gender },
      saju: sajuPillars,
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
    return res.status(500).json({ error: true, message: '서버 내부 오류' });
  }
};
