/**
 * 십이운성(十二運星) 봉법 / 거법 해석 + 색상 데이터
 *
 * - key: 운성 이름 (장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 묘, 절, 태, 양)
 * - bongbeop / geopbeop: 해석 텍스트
 * - bongbeopRgb / geopbeopRgb: "R, G, B" 문자열 → border·text·pulse glow에 opacity만 달리 적용
 *
 * 💡 색상 변경 방법:
 *    RGB 값만 바꾸면 border, 글자색, pulse glow가 전부 자동 반영됩니다.
 *    예) "20, 184, 166" → teal 계열  /  "244, 114, 182" → pink 계열
 */

export interface SibiwunseongDesc {
  /** 운성 한자 */
  hanja: string;
  /** 운성 영문 키워드 */
  keyword: string;
  /** 봉법 해석 */
  bongbeop: string;
  /** 거법 해석 */
  geopbeop: string;
  /** 봉법 RGB (예: "20, 184, 166") */
  bongbeopRgb: string;
  /** 거법 RGB (예: "56, 189, 248") */
  geopbeopRgb: string;
}

export const sibiwunseongDescriptions: Record<string, SibiwunseongDesc> = {
  장생: {
    hanja: "長生",
    keyword: "Birth",
    bongbeop: "새로운 지식과 시스템을 편견 없이 받아들이며, 검증된 사례를 빠르게 학습해 자기 것으로 만드는 응용형 인재입니다. 명확한 가이드와 피드백이 있는 환경에서 전문성을 가장 빠르게 키우는 타입.",
    geopbeop: "조직 내 협력과 지지를 자연스럽게 이끌어내며, 신뢰할 수 있는 상급자의 가이드를 바탕으로 낯선 환경에도 빠르게 적응하는 유형.",
    bongbeopRgb: "20, 184, 166",    // teal (민트)
    geopbeopRgb: "56, 189, 248",    // sky blue
  },
  목욕: {
    hanja: "沐浴",
    keyword: "Bathing",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "244, 114, 182",   // pink
    geopbeopRgb: "167, 139, 250",   // violet
  },
  관대: {
    hanja: "冠帶",
    keyword: "Capping",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "99, 102, 241",    // indigo
    geopbeopRgb: "139, 92, 246",    // purple
  },
  건록: {
    hanja: "建祿",
    keyword: "Prosperity",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "16, 185, 129",    // emerald
    geopbeopRgb: "34, 197, 94",     // green
  },
  제왕: {
    hanja: "帝旺",
    keyword: "Peak",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "245, 158, 11",    // amber (금색)
    geopbeopRgb: "249, 115, 22",    // orange
  },
  쇠: {
    hanja: "衰",
    keyword: "Decline",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "100, 116, 139",   // slate
    geopbeopRgb: "148, 163, 184",   // slate (밝은)
  },
  병: {
    hanja: "病",
    keyword: "Illness",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "244, 63, 94",     // rose
    geopbeopRgb: "251, 146, 60",    // orange (따뜻한)
  },
  사: {
    hanja: "死",
    keyword: "Death",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "168, 85, 247",    // purple
    geopbeopRgb: "192, 132, 252",   // purple (밝은)
  },
  묘: {
    hanja: "墓",
    keyword: "Tomb",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "120, 113, 108",   // stone
    geopbeopRgb: "161, 161, 170",   // gray
  },
  절: {
    hanja: "絶",
    keyword: "Extinction",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "71, 85, 105",     // slate (진한)
    geopbeopRgb: "107, 114, 128",   // gray
  },
  태: {
    hanja: "胎",
    keyword: "Embryo",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "6, 182, 212",     // cyan
    geopbeopRgb: "96, 165, 250",    // blue
  },
  양: {
    hanja: "養",
    keyword: "Nurture",
    bongbeop: "",
    geopbeop: "",
    bongbeopRgb: "132, 204, 22",    // lime
    geopbeopRgb: "163, 230, 53",    // lime (밝은)
  },
};
