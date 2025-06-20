// server/src/logic/rule-engine.ts
import { DAY_GAN_INTERPRETATION } from "../data/interpretation/dgan"; //✅ 일간 기본 해석 //
import { SIPSIN_INTERPRETATION } from "../data/interpretation/sipsin"; //✅ 십성 해석 //
import { CUSTOM_DAY_GAN_INTERPRETATION } from "../data/interpretation/custom"; //✅ 일간 심화 해석 //
import { SIBIWUNSEONG_INTERPRETATION } from "../data/interpretation/sibiunseong"; //✅ 십이운성 해석 //
import { SINSAL_INTERPRETATION } from "../data/interpretation/sinsal"; //✅ 신살 //
import { SajuData } from "../services/saju.service";

/**
 * 규칙 1: 일간(Day Master) 데이터를 기반으로 '기본 해석'과 '심화 해석'을 모두 반환합니다.
 */
export const interpretDayGan = (
  dayGan: string
): { base: string; custom: string } => {
  const baseInterpretation =
    DAY_GAN_INTERPRETATION[dayGan] ||
    "해당 일간에 대한 기본 해석을 찾을 수 없습니다.";
  const customInterpretation =
    CUSTOM_DAY_GAN_INTERPRETATION[dayGan] ||
    "해당 일간에 대한 심화 해석이 없습니다.";

  return {
    base: baseInterpretation,
    custom: customInterpretation,
  };
};

/**
 * ★★★★★ 새로운 십성 해석 규칙 함수 ★★★★★
 * 규칙 2: 사주 원국에 드러난 십성들의 특징을 종합하여 설명합니다.
 * @param sipsinData 사주 원국의 십성 데이터 객체
 * @returns 십성 종합 분석 텍스트
 */
export const interpretSipsinPresence = (
  sipsinData: SajuData["sipsin"]
): string => {
  const pillarNames: { [key: string]: string } = {
    year: "연주(년주)",
    month: "월주",
    day: "일주",
    hour: "시주",
  };

  const ganjiNames: { [key: string]: string } = {
    gan: "천간",
    ji: "지지",
  };

  const foundSipsin: string[] = [];

  // 사주 원국 전체를 순회하며 십성을 찾습니다.
  for (const pillar of Object.keys(pillarNames)) {
    for (const ganji of Object.keys(ganjiNames)) {
      const sipsinName =
        sipsinData[pillar as keyof typeof sipsinData]?.[
          ganji as keyof typeof sipsinData.year
        ];

      // 십성 이름이 존재하고, 그에 대한 해석이 SIPSIN_INTERPRETATION에 있을 경우
      if (sipsinName && SIPSIN_INTERPRETATION[sipsinName]) {
        const description = `${pillarNames[pillar]} ${ganjiNames[ganji]}에서 \`${sipsinName}\`의 특징을 보입니다. 이는 ${SIPSIN_INTERPRETATION[sipsinName]}`;
        foundSipsin.push(description);
      }
    }
  }

  if (foundSipsin.length === 0) {
    return "사주 원국에서 특별히 드러나는 십성의 특징은 발견되지 않았습니다.";
  }

  // 찾은 십성 해석들을 하나의 문단으로 합칩니다.
  return foundSipsin.join("\n\n"); // 각 해석 사이에 한 줄을 띄워 가독성을 높입니다.
};

// ✅ 2. 여기에 새로운 십이운성 해석 규칙 함수를 추가합니다.
/**
 * 규칙 3: 사주 원국의 각 지지에 있는 십이운성의 기운을 설명합니다.
 * @param sibiwunseongData 사주 원국의 십이운성 데이터 객체
 * @returns 십이운성 종합 분석 텍스트
 */
export const interpretSibiwunseong = (
  sibiwunseongData: SajuData["sibiwunseong"]
): string => {
  const pillarNames: { [key: string]: string } = {
    year: "연지(초년운)",
    month: "월지(청년운)",
    day: "일지(장년운)",
    hour: "시지(말년운)",
  };

  const foundSibiwunseong: string[] = [];

  for (const pillar of Object.keys(pillarNames)) {
    const key = pillar as keyof typeof sibiwunseongData;
    const unseongName = sibiwunseongData[key];

    if (unseongName && SIBIWUNSEONG_INTERPRETATION[unseongName]) {
      const description = `${pillarNames[key]}에서 \`${unseongName}\`의 기운을 보입니다. 이는 ${SIBIWUNSEONG_INTERPRETATION[unseongName]}`;
      foundSibiwunseong.push(description);
    }
  }

  if (foundSibiwunseong.length === 0) {
    return "사주 원국에서 특별히 드러나는 십이운성의 기운은 발견되지 않았습니다.";
  }

  return foundSibiwunseong.join("\n\n");
};

// ✅ 3. 신살 해석 규칙 함수
// [최종 수정] interpretSinsal 함수의 로직을 올바르게 수정합니다.
/**
 * 규칙 4: 사주 원국에 있는 모든 신살의 의미를 종합하여 설명합니다.
 * @param sinsalData 사주 원국의 신살 데이터 객체 (e.g. { year: [], month: ["천을귀인"], ...})
 * @returns 신살 종합 분석 텍스트
 */

export const interpretSinsal = (sinsalData: SajuData["sinsal"]): string => {
  const allSinsals = new Set<string>(); // 중복된 신살을 하나로 합치기 위해 Set을 사용

  // year, month, day, hour 각 기둥의 신살 배열을 순회하며 모든 신살을 Set에 추가합니다.
  Object.values(sinsalData).forEach((sinsalArray) => {
    sinsalArray.forEach((sinsal) => {
      allSinsals.add(sinsal);
    });
  });

  if (allSinsals.size === 0) {
    return "사주에 특별히 작용하는 신살은 나타나지 않았습니다.";
  }

  const descriptions: string[] = [];
  allSinsals.forEach((sinsalName) => {
    if (SINSAL_INTERPRETATION[sinsalName]) {
      const description = `\`${sinsalName}\`의 기운을 가지고 있습니다. 이는 ${SINSAL_INTERPRETATION[sinsalName]}`;
      descriptions.push(description);
    }
  });

  return descriptions.join("\n\n");
};
