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
    bongbeop:
      "새로운 것을 스펀지처럼 흡수하고 싶어 하며, 주변의 가이드를 기꺼이 받아들여 성장하려는 마음가짐",
    geopbeop:
      "이제 막 시작되는 프로젝트가 많고, 나를 이끌어줄 선배나 지원 인프라가 잘 갖춰진 환경의 상태",
    bongbeopRgb: "20, 184, 166",
    geopbeopRgb: "56, 189, 248",
  },
  목욕: {
    hanja: "沐浴",
    keyword: "Bathing",
    bongbeop:
      "새로운 것에 대한 호기심이 넘치고, 나의 개성과 감각을 타인에게 보여주고 인정받고 싶어 하는 마음가짐",
    geopbeop:
      "트렌드 변화가 빠르고 유동적이며, 나의 활동이 대중의 시선과 주목을 받기 쉬운 환경의 상태.",
    bongbeopRgb: "255, 192, 203",
    geopbeopRgb: "255, 0, 255",
  },
  관대: {
    hanja: "冠帶",
    keyword: "Capping",
    bongbeop:
      "실패를 두려워하지 않는 자신감을 바탕으로, 어떤 장애물도 정면으로 돌파해내겠다는 당당한 마음가짐",
    geopbeop:
      "실력과 위계를 중시하는 경쟁적인 분위기이며, 나의 주관을 뚜렷하게 증명해야 하는 주도적인 환경의 상태",
    bongbeopRgb: "255, 120, 0",
    geopbeopRgb: "255, 36, 246",
  },
  건록: {
    hanja: "建祿",
    keyword: "Prosperity",
    bongbeop:
      "타인에게 의지하기보다 내 실력으로 성과를 증명하겠다는 강한 책임감과 자립적인 마음가짐",
    geopbeop:
      "실무 능력이 핵심 가치로 존중받으며, 노력한 만큼 확실한 보상과 지위가 보장되는 안정적인 환경의 상태",
    bongbeopRgb: "244, 160, 0",
    geopbeopRgb: "198, 148, 35",
  },
  제왕: {
    hanja: "帝旺",
    keyword: "Peak",
    bongbeop:
      "모든 상황을 직접 통제하고 주도하고 싶어 하며, 타협 없이 최고의 결과물을 만들어내려는 확고한 마음가짐",
    geopbeop:
      "강력한 의사결정권과 책임이 요구되며, 성과에 따라 정점에 오를 수 있는 권위 있고 규모감 있는 환경의 상태",
    bongbeopRgb: "102, 0, 153",
    geopbeopRgb: "212, 175, 55",
  },
  쇠: {
    hanja: "衰",
    keyword: "Decline",
    bongbeop:
      "조용히 내실을 기하며 상황을 관조하고, 경험에서 우러나온 숙련된 기술로 문제를 해결하려는 차분한 마음가짐",
    geopbeop:
      "노련한 경험과 전문 지식이 존중받으며, 급격한 변화보다는 안정과 깊이를 추구하는 연구 중심의 환경의 상태",
    bongbeopRgb: "188, 200, 168",
    geopbeopRgb: "54, 69, 79",
  },
  병: {
    hanja: "病",
    keyword: "Illness",
    bongbeop:
      "타인에 대한 높은 공감력을 바탕으로 공격적인 경쟁보다는 자신의 섬세한 감각과 창의적인 색깔을 부드럽게 보여주고 싶은 마음가짐",
    geopbeop:
      "예술적 감수성과 창의적인 아이디어가 중요하게 쓰이며, 구성원들의 세밀한 컨디션 관리와 상호 배려가 필요한 환경",
    bongbeopRgb: "215, 190, 245",
    geopbeopRgb: "204, 180, 230",
  },
  사: {
    hanja: "死",
    keyword: "Death",
    bongbeop:
      "하나의 과업에 무섭게 몰입하여 끝장을 보려 하며, 타협 없는 정밀함으로 본질적인 완성도를 높이고 싶은 마음가짐",
    geopbeop:
      "높은 전문성과 정밀한 기술력이 요구되며, 불필요한 소음 없이 오직 결과물의 완결성에만 집중해야 하는 환경",
    bongbeopRgb: "11, 15, 26",
    geopbeopRgb: "10, 10, 10",
  },
  묘: {
    hanja: "墓",
    keyword: "Tomb",
    bongbeop:
      "겉으로 드러내기보다 소중한 자산과 정보를 차곡차곡 쌓으며, 장기적인 실리를 위해 감정과 에너지를 안으로 응집하려는 마음가짐",
    geopbeop:
      "유무형의 자산이 체계적으로 축적되어 관리되는 환경이며, 보존된 데이터를 바탕으로 실무를 진두지휘하는 리더십이 요구되는 상태",
    bongbeopRgb: "101, 67, 33",
    geopbeopRgb: "245, 222, 179",
  },
  절: {
    hanja: "絶",
    keyword: "Extinction",
    bongbeop:
      "과거의 방식이나 미련을 과감히 끊어내고, 완전히 새로운 판을 짜거나 제로 베이스에서 다시 시작하려는 결단력 있는 마음가짐",
    geopbeop:
      "기존의 질서가 완전히 사라지고 새로운 패러다임이 태동하는 극적인 전환기이며, 리스크와 기회가 공존하는 역동적인 환경",
    bongbeopRgb: "230, 230, 0",
    geopbeopRgb: "58, 25, 88",
  },
  태: {
    hanja: "胎",
    keyword: "Embryo",
    bongbeop:
      "당장 몸을 움직여 실행하기보다는 머릿속으로 보이지 않는 가능성을 상상하며, 자유롭고 창의적인 아이디어를 떠올리고 싶은 마음가짐",
    geopbeop:
      "당장의 결과나 실행력보다는 창의적인 기획과 개념 설계가 중요하게 다뤄지며, 새로운 영감과 지적 탐구가 존중받는 환경의 상태",
    bongbeopRgb: "244, 196, 170",
    geopbeopRgb: "245, 245, 245",
  },
  양: {
    hanja: "養",
    keyword: "Nurture",
    bongbeop:
      "이미 구축된 지원 체계나 혜택을 적극적으로 활용하여, 큰 갈등 없이 편안하고 안정적인 상태를 유지하며 자신의 실속을 챙기려는 마음가짐",
    geopbeop:
      "기초 자본이나 지원 인프라가 풍부하게 제공되어 있으며, 급격한 변화보다는 기존의 성과를 안정적으로 계승하고 보존하기에 유리한 환경의 상태",
    bongbeopRgb: "250, 244, 214",
    geopbeopRgb: "245, 232, 170",
  },
};
