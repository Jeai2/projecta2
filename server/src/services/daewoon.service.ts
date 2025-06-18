// daewoon.service.ts
// jjhome 만세력 엔진 - 대운 계산 서비스
// 10년 주기의 인생 흐름인 대운(大運)을 계산한다.

// [수정] SEASONAL_DATA import 제거
import { GANJI } from '../data/saju.data';
import { getSipsin } from './sipsin.service';
import { getSibiwunseong } from './sibiwunseong.service';

type SeasonalData = {
    [year: number]: {
        name: string;
        date: Date;
    }[];
};

// 대운의 구조를 정의하는 타입
export interface Daewoon {
  age: number;      // 대운이 시작되는 나이
  ganji: string;    // 해당 대운의 간지
  year: number;     // 해당 대운이 시작되는 년도
  sipsin: string;   // 대운 지지의 십성
  sibiwunseong: string; // 대운 지지의 십이운성
}

// 대운 계산의 핵심 로직
class DaewoonEngine {
  private birthDate: Date;
  private gender: 'M' | 'W';
  private yearGan: string;
  private monthPillar: string;
  private dayGan: string;
  private seasonalData: SeasonalData;

  // [수정] 생성자에서 seasonalData의 타입을 명확히 함
  constructor(birthDate: Date, gender: 'M' | 'W', yearGan: string, monthPillar: string, dayGan: string, seasonalData: SeasonalData) {
    this.birthDate = birthDate;
    this.gender = gender;
    this.yearGan = yearGan;
    this.monthPillar = monthPillar;
    this.dayGan = dayGan;
    this.seasonalData = seasonalData;
  }

  /**
   * 대운의 방향(순행/역행)을 결정한다.
   * @returns 'forward' or 'reverse'
   */
  private getDirection(): 'forward' | 'reverse' {
    const isYangGan = ['갑', '병', '무', '경', '임'].includes(this.yearGan);
    if ((this.gender === 'M' && isYangGan) || (this.gender === 'W' && !isYangGan)) {
      return 'forward';
    }
    return 'reverse';
  }

  /**
   * 생일부터 가장 가까운 절기(순행시 다음 절기, 역행시 이전 절기)와의 날짜 차이를 계산한다.
   * @param direction 대운의 방향
   * @returns 날짜 차이 (일 단위)
   */
  private getDaysToNextSeason(direction: 'forward' | 'reverse'): number {
      const year = this.birthDate.getFullYear();
      const seasons = this.seasonalData[year] || [];
      const seasonsPrev = this.seasonalData[year - 1] || [];
      const allSeasons = [...seasonsPrev, ...seasons];

      let prevSeason: Date | null = null;
      let nextSeason: Date | null = null;

      for (const season of allSeasons) {
          if (season.date <= this.birthDate) {
              prevSeason = season.date;
          } else {
              nextSeason = season.date;
              break;
          }
      }
      
      // 날짜 차이를 밀리초 단위로 계산
      const MSEC_PER_DAY = 1000 * 60 * 60 * 24;
      if (direction === 'forward' && nextSeason) {
          const diff = nextSeason.getTime() - this.birthDate.getTime();
          return diff / MSEC_PER_DAY;
      } else if (direction === 'reverse' && prevSeason) {
          const diff = this.birthDate.getTime() - prevSeason.getTime();
          return diff / MSEC_PER_DAY;
      }

      return 0;
  }

  /**
   * 대운수를 계산한다 (3일을 1년으로).
   */
  private getDaewoonAge(direction: 'forward' | 'reverse'): number {
    const dayDiff = this.getDaysToNextSeason(direction);
    const age = Math.floor(dayDiff / 3);
    return age > 0 ? age : 1;
  }

  /**
   * 100년치 대운 간지를 생성한다.
   */
  private getDaewoonGanji(direction: 'forward' | 'reverse'): string[] {
    const result: string[] = [];
    const startIndex = GANJI.indexOf(this.monthPillar);
    const step = direction === 'forward' ? 1 : -1;

    for (let i = 1; i <= 10; i++) {
      const currentIndex = (startIndex + (step * i) + 60) % 60;
      result.push(GANJI[currentIndex]);
    }
    return result;
  }
  
  /**
   * 모든 대운 계산을 실행하고 결과를 반환한다.
   * @returns 100년치 대운 정보 배열
   */
  public calculate(): Daewoon[] {
    const direction = this.getDirection();
    const startAge = this.getDaewoonAge(direction);
    const daewoonGanjiList = this.getDaewoonGanji(direction);
    const birthYear = this.birthDate.getFullYear();

    const daewoons: Daewoon[] = [];

    for (let i = 0; i < 10; i++) {
      const currentAge = startAge + (i * 10);
      const ganji = daewoonGanjiList[i];
      daewoons.push({
        age: currentAge,
        ganji: ganji,
        year: birthYear + currentAge -1,
        sipsin: getSipsin(this.dayGan, { year: '', month: '', day: '', hour: ganji })['hour'].ji || '',
        sibiwunseong: getSibiwunseong(this.dayGan, { year: '', month: '', day: '', hour: ganji })['hour'] || ''
      });
    }

    return daewoons;
  }
}

/**
 * 생년월일과 성별을 받아 대운 정보를 계산하는 메인 함수
 * @param birthDate 생년월일시 Date 객체
 * @param gender 성별 'M' 또는 'W'
 * @param sajuInfo 사주 정보
 * @param seasonalData 동적으로 로드된 절기 데이터
 * @returns 100년치 대운 정보 배열
 */
 // [수정] getDaewoon 함수가 seasonalData를 파라미터로 받도록 변경
export const getDaewoon = (
    birthDate: Date, 
    gender: 'M' | 'W',
    sajuInfo: { yearPillar: string, monthPillar: string, dayPillar: string },
    seasonalData: SeasonalData 
): Daewoon[] => {
    // [수정] 생성자에 seasonalData 전달
    const engine = new DaewoonEngine(birthDate, gender, sajuInfo.yearPillar[0], sajuInfo.monthPillar, sajuInfo.dayPillar[0], seasonalData);
    return engine.calculate();
}