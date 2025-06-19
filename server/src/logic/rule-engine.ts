// server/src/logic/rule-engine.ts
import { DAY_GAN_INTERPRETATION } from '../data/interpretation/dgan';
import { SajuData } from '../services/saju.service'; // saju.service.ts에서 정의할 타입을 미리 import

export const interpretDayGan = (dayGan: string): string => {
  return DAY_GAN_INTERPRETATION[dayGan] || '해당 일간에 대한 해석을 찾을 수 없습니다.';
};