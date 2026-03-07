# 육임정단(六壬精斷) 계산 엔진 문서

> **추후 만세력 프로그램처럼 육임정단도 웹 시각화 예정.**

> 환경 변경 시 참조용. 2026년 2월 기준 작업 내용 정리.

---

## 목차

1. [A. 월장 (月將)](#a-월장-月將)
2. [B. 천지반도 (天地盤圖)](#b-천지반도-天地盤圖)
3. [C. 사과 (四課)](#c-사과-四課)
4. [D. 삼전 (三傳)](#d-삼전-三傳)
5. [E. 본명·행년 (本命·行年)](#e-본명행년-本命行年)
6. [F. 선봉법 (先鋒法)](#f-선봉법-先鋒法)
6. [F. 선봉법 (先鋒法)](#f-선봉법-先鋒法)
6. [F. 선봉법 (先鋒法)](#f-선봉법-先鋒法)

---

## A. 월장 (月將)

### 규칙
절기(節氣) 기준으로 월장 지지 결정. 각 절기 **시작 시각**을 기준으로 구간 판정.

### 월장 매핑

| 월장(지지) | 절기 범위 | 조건 |
|-----------|----------|------|
| 子 | 대한 ~ 입춘 | `대한.date ≤ t < 우수.date` |
| 亥 | 우수 ~ 경칩 | `우수.date ≤ t < 경칩.date` |
| 戌 | 춘분 ~ 청명 | `춘분.date ≤ t < 청명.date` |
| 酉 | 곡우 ~ 입하 | `곡우.date ≤ t < 입하.date` |
| 申 | 소만 ~ 망종 | `소만.date ≤ t < 망종.date` |
| 未 | 하지 ~ 소서 | `하지.date ≤ t < 소서.date` |
| 午 | 대서 ~ 입추 | `대서.date ≤ t < 입추.date` |
| 巳 | 처서 ~ 백로 | `처서.date ≤ t < 백로.date` |
| 辰 | 추분 ~ 한로 | `추분.date ≤ t < 한로.date` |
| 卯 | 상강 ~ 입동 | `상강.date ≤ t < 입동.date` |
| 寅 | 소설 ~ 대설 | `소설.date ≤ t < 대설.date` |
| 丑 | 동지 ~ 소한 | `동지.date ≤ t < (다음해)소한.date` |

### 데이터 출처
- `server/src/data/seasonal/*.ts` (1900~2030년대 절기 데이터)
- `getSeasonalData(year)` 사용

### 함수
- `getWoljang(targetDate: Date): WoljangJi | null`

---

## B. 천지반도 (天地盤圖)

### B-1. 점시 (占時)

현실 시간 → 지지 변환. **한국 기준**: 동경(일본) 시간대 +30분 적용.

#### 시진 구간 (한국 기준)

| 지지 | 시간대 |
|------|--------|
| 子 | 23:30 ~ 01:29 |
| 丑 | 01:30 ~ 03:29 |
| 寅 | 03:30 ~ 05:29 |
| 卯 | 05:30 ~ 07:29 |
| 辰 | 07:30 ~ 09:29 |
| 巳 | 09:30 ~ 11:29 |
| 午 | 11:30 ~ 13:29 |
| 未 | 13:30 ~ 15:29 |
| 申 | 15:30 ~ 17:29 |
| 酉 | 17:30 ~ 19:29 |
| 戌 | 19:30 ~ 21:29 |
| 亥 | 21:30 ~ 23:29 |

- 경계: 각 지지 끝 **29분**, 다음 지지 시작 **30분**
- 전자/후자 구분 없음

### B-2. 짝꿍1 (지반↔천반)

**월장가시(月將加時)**: 점시 위치에 월장을 두고, 시계방향으로 매칭.

- **시계방향 지지**: 午 → 未 → 申 → 酉 → 戌 → 亥 → 子 → 丑 → 寅 → 卯 → 辰 → 巳
- **천반 순서**: 월장을 맨 앞에 두고 시계방향(子→丑→寅→…→亥)으로 이어 붙임

### B-3. 짝꿍2 (천장)

**12천장**: 貴, 蛇, 朱, 合, 句, 靑, 空, 白, 常, 玄, 陰, 后

#### 귀인(貴人) 배치 - 일간별

| 일간 | 낮 귀인 | 밤 귀인 |
|------|---------|---------|
| 甲/戊/庚 | 丑 | 未 |
| 乙/己 | 子 | 申 |
| 丙/丁 | 亥 | 酉 |
| 辛 | 午 | 寅 |
| 壬/癸 | 巳 | 卯 |

- **낮**: 묘진사오미신 時 (05:30~17:29)
- **밤**: 유술해자축인 時 (17:30~05:29)

#### 나머지 천장 배치
- 귀인 지반이 **해자축인묘진**(亥子丑寅卯辰) → **시계방향**
- 귀인 지반이 **사오미신유술**(巳午未申酉戌) → **시계반대방향**

**일간** = 일운의 일간 (점치 날짜의 일주 천간)

### B-4. 짝꿍3 (둔간 + 공망)

- **일운의 일지**를 천반에서 찾음
- 그 위치에 **甲** 배치
- **시계방향**으로 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸 배치
- 남은 2자리 → **공망**

### 함수
- `getJeomsi(targetDate: Date): WoljangJi`
- `getCheonjibando(targetDate: Date): CheonjibandoPair[] | null`

### CheonjibandoPair 구조
```ts
{
  jiban: WoljangJi;    // 지반
  cheonban: WoljangJi; // 천반
  cheonjang?: Cheonjang; // 천장
  dunggan?: Dunggan;   // 둔간 또는 "공망"
}
```

---

## C. 사과 (四課)

### 기궁(基宮) 도표

| 일간 | 기궁 |
|------|------|
| 甲 | 寅 |
| 乙 | 辰 |
| 丙 | 巳 |
| 丁 | 未 |
| 戊 | 巳 |
| 己 | 未 |
| 庚 | 申 |
| 辛 | 戌 |
| 壬 | 亥 |
| 癸 | 丑 |

### 1과
- **일간(기궁)** = 일운 천간 + 기궁 (표기: 辛(戌))
- **일간 상신** = 천지반도에서 지반=기궁인 행의 **천반**
- **1과 천장, 둔간** = 같은 행에서 조회

### 2과
- **2과 지반** = 1과 상신
- **2과 상신, 천장, 둔간** = 천지반도에서 지반=2과 지반인 행에서 조회

### 3과
- **3과 지반** = 일운의 **일지**
- **일지 상신, 천장, 둔간** = 천지반도에서 지반=일지인 행에서 조회

### 4과
- **4과 지반** = 3과 상신
- **4과 상신, 천장, 둔간** = 천지반도에서 지반=4과 지반인 행에서 조회

### 패턴
| 과 | 지반(기준) |
|----|------------|
| 1과 | 기궁 (일간의 體) |
| 2과 | 1과 상신 |
| 3과 | 일지 |
| 4과 | 3과 상신 |

### 함수
- `getSagwa(targetDate: Date): Sagwa | null`

### Sagwa 구조
```ts
{
  gw1: { gan, gigung, sangsin, cheonjang, dunggan },
  gw2: { jiban, sangsin, cheonjang, dunggan },
  gw3: { jiban, sangsin, cheonjang, dunggan },
  gw4: { jiban, sangsin, cheonjang, dunggan }
}
```

---

## D. 삼전 (三傳)

10과 판별 + 초·중·말전 계산 구현 완료.

→ 상세 정리: [LUKIM_SAMJEON.md](./LUKIM_SAMJEON.md)

### 함수
- `getSamjeon(targetDate: Date): Samjeon | null`

### Samjeon 구조
```ts
{
  gwaName: SamjeonGwaName;  // 원수과 | 중심과 | 지일과 | ...
  cho: SamjeonJeon;         // 초전
  jung: SamjeonJeon;        // 중전
  mal: SamjeonJeon;         // 말전
}
```

### SamjeonJeon 구조
```ts
{
  jiban: WoljangJi;
  cheonban: WoljangJi;
  cheonjang?: Cheonjang;
  dunggan?: Dunggan;
}
```

---

## E. 본명·행년 (本命·行年)

### 본명(本命)
- 태어난 띠의 지지를 천지반도 지반에서 찾은 자리
- 예: 1991년생 辛未년 → 未가 본명 → 천지반도에서 지반=未인 행

### 행년(行年)
- 한 해의 운을 보는 자리
- **계산**: 나이 ÷ 12의 나머지 값
- **男**: 寅 포함, 나머지 값만큼 **시계방향** 이동 (예: 나머지 7 → 寅 포함 7번째 = 申)
- **女**: 申 포함, 나머지 값만큼 **시계 반대방향** 이동 (예: 나머지 7 → 申 포함 7번째 = 寅)

### 함수
- `getBonmyeong(ddi: WoljangJi, cheonjibando: CheonjibandoPair[]): CheonjibandoPair | null`
- `getHaengnyeon(age: number, gender: 'M' | 'F', cheonjibando: CheonjibandoPair[]): CheonjibandoPair | null`

---

## F. 선봉법 (先鋒法)

질문자(이용자·내담자)의 고민을 **먼저 알아내는** 육임술법. 일진과 정단 시간으로 판단한다.

### 입력
- **일진**: 점치 날짜의 일주 (예: 2026-03-07 → 庚辰日)
- **정단 시지**: 점치 시간을 시진으로 변환 (예: 16:30 → 申시, 15:30~17:29)

### 계산
- **기준**: 일진의 천간(일간), 일진의 지지(일지)
- 일간 기준 **일지**의 십성 → `SIPSIN_TABLE.e[일간][일지]`
- 일간 기준 **시지(정단 시지)**의 십성 → `SIPSIN_TABLE.e[일간][시지]`
- **지지 간 형충파해합**: 일지-시지 간 육합·육충·육형·육파·육해 (`relationship.data.ts`)
- **12신살**: 일지의 삼합 그룹 기준, 시지가 어떤 신살인지 → `SINSAL_12_MAP[getSamhapGroup(일지)][시지]` (지살, 년살, 월살, 망신, 장성, 반안, 역마, 육해, 화개, 겁살, 재살, 천살)

### 해석
- `server/src/data/seonbong-interpretations.ts`에서 사용자가 작성
- `sipsinOfIlji`, `sipsinOfJeomsi`, `jijiRelations`, `sinsalOfJeomsi` 조합으로 판단 가능

### 함수
- `getSeonbong(targetDate: Date): SeonbongResult`

### SeonbongResult 구조
```ts
{
  iljinGanji: string;      // 일진 간지 (예: "庚辰")
  ilgan: string;           // 일간 (예: "庚")
  ilji: string;            // 일지 (예: "辰")
  jeomsiJi: WoljangJi;     // 정단 시지 (예: "申")
  sipsinOfIlji: string;    // 일간 기준 일지의 십성 (예: "편인")
  sipsinOfJeomsi: string;  // 일간 기준 시지의 십성 (예: "비견")
  jijiRelations: ("육합"|"육충"|"육형"|"육파"|"육해")[];  // 일지-시지 형충파해합
  sinsalOfJeomsi: string;  // 일지 기준 시지의 12신살 (지살, 년살, 월살, 망신, 장성, 반안, 역마, 육해, 화개, 겁살, 재살, 천살)
  interpretation: { sipsin, concernCategory, summary, keywords } | null;  // 사용자 작성
}
```

### 사용 예시
```ts
getSeonbong(new Date('2026-03-07T16:30:00'));
// { iljinGanji: "庚辰", ilgan: "庚", ilji: "辰", jeomsiJi: "申",
//   sipsinOfIlji: "편인", sipsinOfJeomsi: "비견", jijiRelations: ["육해"], sinsalOfJeomsi: "지살",
//   interpretation: null }  // seonbong-interpretations.ts에서 작성
```

---

## 파일 위치

| 구분 | 경로 |
|------|------|
| 메인 로직 | `server/src/services/lukim.service.ts` |
| 선봉법 해석 | `server/src/data/seonbong-interpretations.ts` |
| 지지 관계(형충파해합) | `server/src/data/relationship.data.ts` |
| 12신살 | `server/src/data/sinsal/12sinsal.map.ts` |
| 절기 데이터 | `server/src/data/seasonal/*.ts` |
| 천간/지지 | `server/src/data/saju.data.ts` |
| 일주 계산 | `server/src/services/saju.service.ts` (`getDayGanji`) |

---

## 사용 예시

```ts
import { getWoljang, getJeomsi, getCheonjibando, getSagwa, getSamjeon } from './lukim.service';

const targetDate = new Date('2026-02-26T12:35:00');

getWoljang(targetDate);      // "亥" (우수~경칩)
getJeomsi(targetDate);       // "午"
getCheonjibando(targetDate); // 12개 pair
getSagwa(targetDate);        // { gw1, gw2, gw3, gw4 }
getSamjeon(targetDate);      // { gwaName, cho, jung, mal }
```
