// server/src/services/sajuInterpret.service.ts
import { interpretDayGan } from '../logic/rule-engine';
import { SajuData } from './saju.service';

export interface InterpretationResult {
  dayMasterNature: string;
}

export const interpretSaju = (sajuData: SajuData): InterpretationResult => {
  const dayGan = sajuData.pillars.day[0];
  const dayMasterNature = interpretDayGan(dayGan);

  const result: InterpretationResult = {
    dayMasterNature: dayMasterNature,
  };

  return result;
};