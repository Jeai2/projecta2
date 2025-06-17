// [수석 설계자 노트]
// jjhome 만세력 엔진 (ver 0.2)
// 현재 연주(年柱)와 월주(月柱) 계산 기능이 탑재됨.
// 사주팔자 중 네 글자를 완성한 상태.

// =================================================================
// 1. 원재료 (Constants)
// '고대 천문학자의 유산'에서 확인한 핵심 데이터들을 우리 방식(TypeScript)으로 정의.
// =================================================================

const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const GANJI = [
  '갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유',
  '갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미',
  '갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사',
  '갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘',
  '갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축',
  '갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해'
];

// [핵심 데이터] 24절기 데이터 (천문 현상표)
// 실제 서비스에서는 이 데이터 전체를 별도의 파일이나 DB에서 관리해야 한다.
// 우선 2024년, 2025년 데이터만 예시로 추가했다.
const SEASONAL_DATA: { [year: number]: { name: string; date: Date }[] } = {
  2024: [
    { name: '소한', date: new Date('2024-01-06T05:49:00') }, { name: '대한', date: new Date('2024-01-20T22:07:00') },
    { name: '입춘', date: new Date('2024-02-04T17:27:00') }, { name: '우수', date: new Date('2024-02-19T13:13:00') },
    { name: '경칩', date: new Date('2024-03-05T11:23:00') }, { name: '춘분', date: new Date('2024-03-20T12:07:00') },
    { name: '청명', date: new Date('2024-04-04T16:03:00') }, { name: '곡우', date: new Date('2024-04-19T22:00:00') },
    { name: '입하', date: new Date('2024-05-05T09:10:00') }, { name: '소만', date: new Date('2024-05-21T09:00:00') },
    { name: '망종', date: new Date('2024-06-05T13:10:00') }, { name: '하지', date: new Date('2024-06-21T05:51:00') },
    { name: '소서', date: new Date('2024-07-07T00:07:00') }, { name: '대서', date: new Date('2024-07-22T16:45:00') },
    { name: '입추', date: new Date('2024-08-07T09:09:00') }, { name: '처서', date: new Date('2024-08-22T23:55:00') },
    { name: '백로', date: new Date('2024-09-07T12:11:00') }, { name: '추분', date: new Date('2024-09-22T21:44:00') },
    { name: '한로', date: new Date('2024-10-08T04:00:00') }, { name: '상강', date: new Date('2024-10-23T07:15:00') },
    { name: '입동', date: new Date('2024-11-07T07:20:00') }, { name: '소설', date: new Date('2024-11-22T05:57:00') },
    { name: '대설', date: new Date('2024-12-07T00:16:00') }, { name: '동지', date: new Date('2024-12-21T18:21:00') }
  ],
  2025: [
    { name: '소한', date: new Date('2025-01-05T11:33:00') }, { name: '대한', date: new Date('2025-01-20T04:00:00') },
    { name: '입춘', date: new Date('2025-02-04T23:11:00') }, { name: '우수', date: new Date('2025-02-19T19:00:00') },
    // ... (이후 절기 데이터)
  ],
};


// =================================================================
// 2. 핵심 계산 함수 (Core Functions)
// '고대 천문학자의 유산'에서 학습한 원리를 우리만의 함수로 재창조.
// =================================================================

/**
 * 특정 년도의 연주(年柱) 간지를 계산한다. (첫 번째 렌즈)
 * @param year 계산할 년도
 * @returns 해당 년도의 간지 (예: "을사")
 */
const getYearGanji = (year: number): string => {
  const ganIndex = (year - 4) % 10;
  const jiIndex = (year - 4) % 12;
  const correctedGanIndex = (ganIndex + 10) % 10;
  const correctedJiIndex = (jiIndex + 12) % 12;
  return GAN[correctedGanIndex] + JI[correctedJiIndex];
};

/**
 * 특정 날짜의 월주(月柱) 간지를 계산한다. (두 번째 렌즈)
 * @param date 계산할 날짜 객체
 * @param yearGan 연주의 천간 (월주 천간 계산에 필요)
 * @returns 해당 월의 간지 (예: "병인")
 */
const getMonthGanji = (date: Date, yearGan: string): string => {
  const year = date.getFullYear();
  const seasonsForYear = SEASONAL_DATA[year];

  if (!seasonsForYear) {
    return "해당 년도의 절기 데이터가 없습니다.";
  }

  // 1. 월 지지(地支) 찾기: 사용자의 생일이 어떤 '절기' 앞에 있는지 역순으로 찾는다.
  let monthJiIndex = -1;
  let foundingSeasonIndex = -1;

  for (let i = seasonsForYear.length - 1; i >= 0; i--) {
    // [핵심 수정] 짝수 인덱스인 '절기'만 기준으로 삼는다. (0:소한, 2:입춘, 4:경칩...)
    // 24절기는 '소한'부터 시작하지만, 월은 '입춘'부터 시작하므로 인덱스 처리에 주의.
    if (i % 2 === 0 && date >= seasonsForYear[i].date) {
      foundingSeasonIndex = i;
      break;
    }
  }

  // 만약 1월 1일 ~ 입춘 사이라면, 작년의 마지막달(축월)로 계산
  if (foundingSeasonIndex === -1 || foundingSeasonIndex < 2) {
    // 1월 소한, 대한은 전년도의 자, 축월에 해당
    if (foundingSeasonIndex === 0) { // 소한
      monthJiIndex = 0; // 자(子)월
    } else { // 입춘 전
      monthJiIndex = 1; // 축(丑)월
    }
  } else {
    // 사주명리학의 1월(인월)은 '입춘'부터 시작. '입춘'의 지지는 '인(寅)'이고 JI 배열의 2번 인덱스.
    // 절기 인덱스와 월 지지 인덱스를 맞춰주기 위한 보정. (입춘(index 2) -> 인월(index 2))
    monthJiIndex = (foundingSeasonIndex / 2 + 1) % 12;
  }
  
  const monthJi = JI[monthJiIndex];

  // 2. 월 천간(天干) 찾기 (월두법 月頭法 적용)
  let monthGanIndex = -1;
  const yearGanIndex = GAN.indexOf(yearGan);

  if (yearGanIndex === 0 || yearGanIndex === 5) monthGanIndex = 2; // 갑/기 -> 병
  else if (yearGanIndex === 1 || yearGanIndex === 6) monthGanIndex = 4; // 을/경 -> 무
  else if (yearGanIndex === 2 || yearGanIndex === 7) monthGanIndex = 6; // 병/신 -> 경
  else if (yearGanIndex === 3 || yearGanIndex === 8) monthGanIndex = 8; // 정/임 -> 임
  else if (yearGanIndex === 4 || yearGanIndex === 9) monthGanIndex = 0; // 무/계 -> 갑

  // 월 지지에 맞춰 천간 순환 (인월이 시작)
  const monthOffset = (monthJiIndex - 2 < 0) ? monthJiIndex + 10 : monthJiIndex - 2;
  const finalMonthGanIndex = (monthGanIndex + monthOffset) % 10;
  const monthGan = GAN[finalMonthGanIndex];

  return monthGan + monthJi;
};

/**
 * 특정 날짜의 율리우스일(Julian Day)을 계산한다.
 * 모든 날짜 계산의 기준점이 되는 절대적인 일수.
 */
const getJulianDay = (year: number, month: number, day: number): number => {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const julianDay = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  return julianDay;
};

const BASE_JULIAN_DAY = 2445191.5
const BASE_GANJI_INDEX = 0; 

/**
 * 특정 날짜의 일주(日柱) 간지를 계산한다. (세 번째 렌즈)
 */
const getDayGanji = (date: Date): string => {
  const julianDay = getJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const dayDifference = julianDay - BASE_JULIAN_DAY;
  const ganjiIndex = (BASE_GANJI_INDEX + dayDifference) % 60;
  const correctedGanjiIndex = Math.floor((ganjiIndex + 60) % 60);

  return GANJI[correctedGanjiIndex];
};

const getHourGanji = (date: Date, dayGan: string): string => {
  // 1. 시지(時支) 찾기: 태어난 시간으로 12지지 중 하나를 결정.
  const hour = date.getHours();
  // 23:30 ~ 01:29는 자시(子時)
  const hourJiIndex = Math.floor((hour + 1) / 2) % 12;
  const hourJi = JI[hourJiIndex];

  // 2. 시간(時干) 찾기: 일간(日干)에 따라 시작하는 천간이 다름 (시두법)
  const dayGanIndex = GAN.indexOf(dayGan);
  let startGanIndex = -1;

  if (dayGanIndex === 0 || dayGanIndex === 5) startGanIndex = 0; // 갑기 -> 갑자시 
  else if (dayGanIndex === 1 || dayGanIndex === 6) startGanIndex = 2; // 을/경 -> 병자시
  else if (dayGanIndex === 2 || dayGanIndex === 7) startGanIndex = 4; // 병/신 -> 무자시
  else if (dayGanIndex === 3 || dayGanIndex === 8) startGanIndex = 6; // 정/임 -> 경자시
  else if (dayGanIndex === 4 || dayGanIndex === 9) startGanIndex = 8; // 무/계 -> 임자시
  
  const hourGanIndex = (startGanIndex + hourJiIndex) % 10;
  const hourGan = GAN[hourGanIndex];

  return hourGan + hourJi;
};








// =================================================================
// 3. 메인 서비스 함수 (Main Service)
// 모든 부품을 조립하여 최종 결과를 내보내는 메인 작업대.
// =================================================================

/**
 * 사용자의 생년월일시 정보를 받아 사주팔자를 완성한다.
 * @param birthDate 사용자의 생년월일시가 포함된 Date 객체
 * @param gender 사용자의 성별
 */
export const getSajuInfo = (birthDate: Date, gender: string) => {
  const yearPillar = getYearGanji(birthDate.getFullYear());
  const monthPillar = getMonthGanji(birthDate, yearPillar[0]);
  const dayPillar = getDayGanji(birthDate);
  const hourPillar = getHourGanji(birthDate, dayPillar[0]); // 시주 계산 함수 호출

  return {
    message: "사주팔자 변환이 완료되었습니다.",
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
  };
};

