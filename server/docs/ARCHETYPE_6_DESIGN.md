# Archetype 6 (커리어 아키타입) 설계 구조서

## 1. 개요

사주 명리학의 5대 성분(당령, 사령, 십신, 전승, 오행)을 홀랜드 6유형(R, I, A, S, E, C)과 매칭하여 **1,000점 만점**의 커리어 아키타입 점수를 산출한다.

---

## 2. 아키타입 정의 (6유형)

| 코드 | 영문명 | 한글 | 특성 |
|------|--------|------|------|
| R | The Solid | 현실형 | 현장, 기술, 숙련 |
| I | The Insight | 탐구형 | 논리, 분석, 연구 |
| A | The Spark | 예술형 | 창의, 영감, 발산 |
| S | The Harmony | 사회형 | 상생, 양육, 교육 |
| E | The Drive | 진취형 | 전략, 리더십, 성취 |
| C | The System | 관습형 | 운영, 안정, 시스템 |

---

## 3. 가중치 위계 (Total 1,000 pts)

| 순서 | 성분 | 배점 | 데이터 소스 |
|------|------|------|-------------|
| 1 | 십신(주력) | 350 | `sipsin.service.ts`, 삼합/방합 반방합 |
| 2 | 사령 | 200 | `saryeong.service.ts`, `career-energy.data.ts` |
| 3 | 당령 | 150 | `dangnyeong.service.ts`, `dangnyeong.data.ts` |
| 4 | 보조십신 | 150 | 미존재/부족 오행 시 해당 아키타입 보조십신 |
| 5 | 전승 | 100 | `job-legacy.service.ts`, `job-map.data.ts` |
| 6 | 오행 | 50 | `ohaeng-chart.service.ts` |

---

## 4. 매핑 매트릭스

### 4.1 당령 → 아키타입 (Potential / 잠재력)

당령과 사령은 **서로 다른 재료 피스**로, 동일한 천간이라도 당령 조각과 사령 조각을 구분한다.

| 아키타입 | 당령 조각 (Key) | 기반 잠재력 |
|----------|-----------------|-------------|
| R | 庚, 辛 | |
| I | 癸, 甲 | |
| A | 丁, 癸 | |
| S | 甲, 乙, 丙 | |
| E | 壬, 丙, 乙 | |
| C | 辛, 庚, 丁 | |

- `analyzeDangnyeong(birthDate)` → `dangnyeongGan` 조회
- 해당 천간이 속한 아키타입에 400점 부여 (한 천간은 하나의 아키타입에만 매칭)

### 4.2 사령 → 아키타입 (Mission / 실무 미션)

| 아키타입 | 사령 조각 (Key) | 실무 미션 |
|----------|-----------------|-----------|
| R | 庚, 丁, 戊 | |
| I | 癸, 甲, 己 | |
| A | 丁, 乙, 癸 | |
| S | 丙, 乙, 甲 | |
| E | 壬, 丙, 庚 | |
| C | 辛, 己, 丁 | |

- `analyzeSaryeong(birthDate, monthJi)` → `saryeongGan` 조회
- 해당 천간이 속한 아키타입에 250점 부여 (한 천간은 하나의 아키타입에만 매칭)

### 4.3 십신 → 아키타입

| 아키타입 | 십신 |
|----------|------|
| R | 비견, 정재, 편관 |
| I | 식신, 정인, 편인 |
| A | 상관, 편인, 식신 |
| S | 정인, 겁재, 비견 |
| E | 편재, 편관, 상관 |
| C | 정관, 정재, 정인 |

**규칙**: 십신 하나가 복수 아키타입에 매칭될 경우, 200점을 **균등 분할**하여 배분.

### 4.4 전승(직군 Key) → 아키타입

| 아키타입 | JobMapCategoryKey |
|----------|-------------------|
| R | dojae_eoup, tacheol_uigi, sujak_bojo |
| I | sujae_jori, seungdo_seonsaeng |
| A | eumyak_gyeongong, sujak_bojo |
| S | sasul_doin, jebong_gyosa |
| E | guanin_nongup, jugwan_uieop, uibok_posu, misang_sangin |
| C | guanin_nongup, jebong_gyosa, misang_sangin |

**규칙**: 한 직군 키가 복수 아키타입에 매칭될 경우(예: guanin_nongup → E, C), 100점을 **균등 분할**.

### 4.5 오행 → 아키타입 (주력 오행)

| 아키타입 | 주력 오행 |
|----------|-----------|
| R | 金, 土 |
| I | 水, 木 |
| A | 火, 木 |
| S | 木, 土 |
| E | 火, 金 |
| C | 土, 金 |

**계산식**: `(해당 아키타입 오행 개수 / 전체 오행 조각 총합) * 50`  
- **분모**: 해당 시점에서 판정된 전체 오행 조각의 총합 (천간 + 지지, 삼합/방합 합화 오행 포함)
- 8 고정 사용하지 않음

---

## 5. 핵심 로직 (계산 순서: 십신 → 사령 → 당령 → 전승 → 오행)

### 5.1 십신 (400 pts) — 합화 우선

- `getSipsinCountExcludingDayGan` + `getSipsinBonusFromSamhapBanghapForArchetype`
- 삼합 반합(2개 이상) + 방합 반방합(2개 이상) — 아키타입 전용
- effectiveCount = base + 2*bonus, 400점 비율 배분
- 십신 → 아키타입 매핑 (복수 시 균등 분할)

### 5.2 사령 (250 pts)

- `analyzeSaryeong(birthDate, monthJi)` → `saryeongGan` (한글)
- 한글 → 한자 변환 후 매핑 테이블에서 아키타입 조회
- 해당 아키타입에 250점 부여

### 5.3 당령 (200 pts)

- `analyzeDangnyeong(birthDate)` → `dangnyeongGan` (한글)
- 한글 → 한자 변환 후 매핑 테이블에서 아키타입 조회
- 해당 아키타입에 200점 부여

### 5.4 전승 (100 pts)

- `getJobLegacyByGender(yearGan, yearJi, lunarMonth)` → `male` / `female` 결과
- 성별에 따라 선택된 결과의 `cat.key` (JobMapCategoryKey) 사용
- `findCategory` 로직과 동일하게 `ganToJi[gan] === targetJi` 인 category의 `key` 획득
- key → 아키타입 매핑 테이블로 100점 배분 (복수 시 균등 분할)

### 5.5 오행 (50 pts)

- `calculateOhaengChart(sajuData)` 의 `breakdown.gan`, `breakdown.ji` 사용
- 천간+지지 오행 개수 합산 (삼합/방합 합화 오행 포함)
- **분모**: 해당 시점의 전체 오행 조각 총합 (`jiOhaengCount.total` 또는 `gan.total + ji.total` 등)
- 각 아키타입별: `(해당 아키타입 주력 오행 개수 / 전체 오행 총합) * 50`

---

## 6. 출력 형식

```typescript
export interface Archetype6Result {
  scores: Record<"R" | "I" | "A" | "S" | "E" | "C", number>;
}
```

- 당령 + 사령 + 십신(원국+합) + 전승 + 오행(원국) 합산
- 프론트: 레이더 차트 베이스

### 6.1 대운(daewoonScores) — 보류

- 대운 레이어 및 daewoonScores 산출은 **현재 보류**
- 추후 요청 시 daewoon 기반 점수 추가

---

## 7. 파일 구조

| 구분 | 경로 |
|------|------|
| 서비스 | `server/src/services/archetype.service.ts` (신규) |
| 매핑 데이터 | `server/src/data/archetype-map.data.ts` (신규) |
| 진로 API | `fortune.controller.ts` — career 결과에 `archetype` 필드 추가 |

---

## 8. 의존성

- `dangnyeong.service` : `analyzeDangnyeong`
- `saryeong.service` : `analyzeSaryeong`
- `sipsin.service` : `getSipsinCountExcludingDayGan`, `getSipsinBonusFromSamhapBanghap`
- `job-legacy.service` : `getJobLegacyByGender` + category key 추출
- `ohaeng-chart.service` : `calculateOhaengChart`
- `job-map.data` : `JOB_MAP_BY_CATEGORY`, `moveJiByMonth`

---

## 9. 반영된 사항

1. **당령·사령 분리**: 당령(잠재력)과 사령(실무 미션) 각각 별도 매핑 테이블 사용
2. **대운**: daewoonScores 보류
3. **오행 분모**: 8 고정 사용하지 않고, 해당 시점의 **전체 오행 조각 총합**을 분모로 사용

---

위 설계에 따라 `archetype.service.ts` 및 `archetype-map.data.ts` 구현을 진행합니다.
