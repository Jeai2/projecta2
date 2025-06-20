// server/src/services/sajuInterpret.service.ts
import {
  interpretDayGan,
  interpretSipsinPresence,
  interpretSibiwunseong,
  interpretSinsal,
} from "../logic/rule-engine";
import { SajuData } from "./saju.service";

// 1. 최종 결과 타입에 sipsinAnalysis를 추가합니다.
export interface InterpretationResult {
  dayMasterNature: { base: string; custom: string };
  sipsinAnalysis: string;
  sibiwunseongAnalysis: string; // 십이운성 분석 결과 추가
  sinsalAnalysis: string; // 신살 분석 결과 추가
}

export const interpretSaju = (sajuData: SajuData): InterpretationResult => {
  // --- 기존 일간 해석 ---
  const dayGan = sajuData.pillars.day[0];
  const dayMasterNature = interpretDayGan(dayGan);
  const sibiwunseongAnalysis = interpretSibiwunseong(sajuData.sibiwunseong);
  const sinsalAnalysis = interpretSinsal(sajuData.sinsal);

  // ★★★★★ 2. 새로운 십성 해석 규칙을 호출합니다. ★★★★★
  const sipsinAnalysis = interpretSipsinPresence(sajuData.sipsin);

  // 3. 최종 결과 객체에 새로운 해석을 포함시킵니다.
  const result: InterpretationResult = {
    dayMasterNature: dayMasterNature,
    sipsinAnalysis: sipsinAnalysis,
    sibiwunseongAnalysis: sibiwunseongAnalysis, // 결과 객체에 추가
    sinsalAnalysis: sinsalAnalysis, // 결과 객체에 추가
  };

  return result;
};
