// server/src/services/relationship.service.ts
// 지지 간 관계 계산 서비스

import { JIJI_RELATIONSHIPS } from "../data/relationship.data";

export interface RelationshipResult {
  cheonganhap: string[]; // 천간합 관계
  cheonganchung: string[]; // 천간충 관계
  yukhap: string[]; // 육합 관계
  samhap: string[]; // 삼합 관계
  amhap: string[]; // 암합 관계
  banghap: string[]; // 방합 관계
  yukchung: string[]; // 육충 관계
  yukhyung: string[]; // 육형 관계
  yukpa: string[]; // 육파 관계
  yukae: string[]; // 육해 관계
}

export interface RelationshipDetail {
  type: string; // 관계 유형 (yukhap, samhap, etc.)
  ji1: string; // 첫 번째 지지
  ji2: string; // 두 번째 지지
  pillar1: string; // 첫 번째 기둥 (year, month, day, hour)
  pillar2: string; // 두 번째 기둥
}

/**
 * 사주팔자의 지지 간 관계를 계산한다.
 * @param pillars 사주팔자 객체
 * @returns 지지 간 관계 결과
 */
export const getJijiRelationships = (pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): RelationshipResult => {
  const result: RelationshipResult = {
    cheonganhap: [],
    cheonganchung: [],
    yukhap: [],
    samhap: [],
    amhap: [],
    banghap: [],
    yukchung: [],
    yukhyung: [],
    yukpa: [],
    yukae: [],
  };

  // 천간 배열 생성
  const gans = [
    { gan: pillars.year[0], pillar: "year" },
    { gan: pillars.month[0], pillar: "month" },
    { gan: pillars.day[0], pillar: "day" },
    { gan: pillars.hour[0], pillar: "hour" },
  ];

  // 지지 배열 생성
  const jis = [
    { ji: pillars.year[1], pillar: "year" },
    { ji: pillars.month[1], pillar: "month" },
    { ji: pillars.day[1], pillar: "day" },
    { ji: pillars.hour[1], pillar: "hour" },
  ];

  // 천간 관계 계산
  for (let i = 0; i < gans.length; i++) {
    for (let j = i + 1; j < gans.length; j++) {
      const gan1 = gans[i].gan;
      const gan2 = gans[j].gan;
      const pillar1 = gans[i].pillar;
      const pillar2 = gans[j].pillar;

      // 천간합 관계 확인
      if (JIJI_RELATIONSHIPS.cheonganhap[gan1] === gan2) {
        result.cheonganhap.push(`${gan1}${gan2}(${pillar1}-${pillar2})`);
      }

      // 천간충 관계 확인
      if (JIJI_RELATIONSHIPS.cheonganchung[gan1] === gan2) {
        result.cheonganchung.push(`${gan1}${gan2}(${pillar1}-${pillar2})`);
      }
    }
  }

  // 모든 지지 쌍을 비교
  for (let i = 0; i < jis.length; i++) {
    for (let j = i + 1; j < jis.length; j++) {
      const ji1 = jis[i].ji;
      const ji2 = jis[j].ji;
      const pillar1 = jis[i].pillar;
      const pillar2 = jis[j].pillar;

      // 육합 관계 확인
      if (JIJI_RELATIONSHIPS.yukhap[ji1] === ji2) {
        result.yukhap.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 삼합 관계 확인
      if (JIJI_RELATIONSHIPS.samhap[ji1]?.includes(ji2)) {
        result.samhap.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 암합 관계 확인
      if (JIJI_RELATIONSHIPS.amhap[ji1]?.includes(ji2)) {
        result.amhap.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 방합 관계 확인
      if (JIJI_RELATIONSHIPS.banghap[ji1]?.includes(ji2)) {
        result.banghap.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 육충 관계 확인
      if (JIJI_RELATIONSHIPS.yukchung[ji1] === ji2) {
        result.yukchung.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 육형 관계 확인
      if (JIJI_RELATIONSHIPS.yukhyung[ji1]?.includes(ji2)) {
        result.yukhyung.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 육파 관계 확인
      if (JIJI_RELATIONSHIPS.yukpa[ji1] === ji2) {
        result.yukpa.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }

      // 육해 관계 확인
      if (JIJI_RELATIONSHIPS.yukae[ji1] === ji2) {
        result.yukae.push(`${ji1}${ji2}(${pillar1}-${pillar2})`);
      }
    }
  }

  return result;
};

/**
 * 상세한 관계 정보를 반환한다.
 * @param pillars 사주팔자 객체
 * @returns 상세 관계 정보 배열
 */
export const getDetailedRelationships = (pillars: {
  year: string;
  month: string;
  day: string;
  hour: string;
}): RelationshipDetail[] => {
  const relationships: RelationshipDetail[] = [];

  // 지지 배열 생성
  const jis = [
    { ji: pillars.year[1], pillar: "year" },
    { ji: pillars.month[1], pillar: "month" },
    { ji: pillars.day[1], pillar: "day" },
    { ji: pillars.hour[1], pillar: "hour" },
  ];

  // 모든 지지 쌍을 비교
  for (let i = 0; i < jis.length; i++) {
    for (let j = i + 1; j < jis.length; j++) {
      const ji1 = jis[i].ji;
      const ji2 = jis[j].ji;
      const pillar1 = jis[i].pillar;
      const pillar2 = jis[j].pillar;

      // 각 관계 유형별로 확인
      const relationshipTypes = [
        { type: "yukhap", data: JIJI_RELATIONSHIPS.yukhap },
        { type: "yukchung", data: JIJI_RELATIONSHIPS.yukchung },
        { type: "yukpa", data: JIJI_RELATIONSHIPS.yukpa },
        { type: "yukae", data: JIJI_RELATIONSHIPS.yukae },
      ];

      // 1:1 관계 확인
      relationshipTypes.forEach(({ type, data }) => {
        if (data[ji1] === ji2) {
          relationships.push({
            type,
            ji1,
            ji2,
            pillar1,
            pillar2,
          });
        }
      });

      // 삼합 관계 확인
      if (JIJI_RELATIONSHIPS.samhap[ji1]?.includes(ji2)) {
        relationships.push({
          type: "samhap",
          ji1,
          ji2,
          pillar1,
          pillar2,
        });
      }

      // 육형 관계 확인
      if (JIJI_RELATIONSHIPS.yukhyung[ji1]?.includes(ji2)) {
        relationships.push({
          type: "yukhyung",
          ji1,
          ji2,
          pillar1,
          pillar2,
        });
      }
    }
  }

  return relationships;
};
