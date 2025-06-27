// server/src/services/sajuInterpret.service.ts (최종 완성본)

import {
  interpretDayGan,
  interpretDayMasterCharacter, // ✅ 1. '일간 상세 성품' 해석 함수 import
  interpretSipsinPresence,
  interpretSibiwunseong,
  interpretSinsal,
  interpretCombinations,
  createLandscapePrompt,
} from "../logic/rule-engine";
import type { SajuData, InterpretationResult } from "../types/saju.d";

export const interpretSaju = (sajuData: SajuData): InterpretationResult => {
  // ✅ 3. 모든 로직은 최종 수정본과 동일하게 유지합니다.
  const dayGan = sajuData.pillars.day.gan;
  const dayMasterNature = interpretDayGan(dayGan);
  const dayMasterCharacter = interpretDayMasterCharacter(dayGan);
  const sibiwunseongAnalysis = interpretSibiwunseong(sajuData.sibiwunseong);
  const sinsalAnalysis = interpretSinsal(sajuData.sinsal);
  const sipsinAnalysis = interpretSipsinPresence(sajuData.sipsin);
  const combinationAnalysis = interpretCombinations(sajuData);
  const hwaEuiPrompt = createLandscapePrompt(sajuData.napeum);

  const result: InterpretationResult = {
    dayMasterNature: dayMasterNature,
    dayMasterCharacter: dayMasterCharacter, // ✅ 최종 결과에 포함
    sipsinAnalysis: sipsinAnalysis,
    sibiwunseongAnalysis: sibiwunseongAnalysis,
    sinsalAnalysis: sinsalAnalysis,
    combinationAnalysis: combinationAnalysis,
    hwaEuiPrompt: hwaEuiPrompt,
  };

  return result;
};
