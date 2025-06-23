// server/src/data/interpretation/oheng.ts
// 오행(五行)의 기본 속성과 관계를 정의하는 데이터

// 각 오행의 상세 정보를 담는 타입 정의
export interface OhaengElement {
  name: "목" | "화" | "토" | "금" | "수";
  hanja: "木" | "火" | "土" | "金" | "水";
  keywords: string[]; // AI가 특징을 파악하기 위한 핵심 키워드
  description: string; // 오행의 기본 성질에 대한 설명
  relationships: {
    generates: "목" | "화" | "토" | "금" | "수"; // 내가 생(生)하는 오행 (상생)
    isGeneratedBy: "목" | "화" | "토" | "금" | "수"; // 나를 생(生)하는 오행 (상생)
    overcomes: "목" | "화" | "토" | "금" | "수"; // 내가 극(剋)하는 오행 (상극)
    isOvercomeBy: "목" | "화" | "토" | "금" | "수"; // 나를 극(剋)하는 오행 (상극)
  };
}

// 오행 데이터를 담는 객체
export const OHENG_DATA: { [key: string]: OhaengElement } = {
  木: {
    name: "목",
    hanja: "木",
    keywords: ["성장", "시작", "의욕", "자존심", "추진력", "새로움"],
    description:
      "봄의 새싹처럼 뻗어 나가려는 성장과 시작의 기운을 상징합니다. 자존심이 강하고 목표 지향적입니다.",
    relationships: {
      generates: "화", // 목생화 (木生火)
      isGeneratedBy: "수", // 수생목 (水生木)
      overcomes: "토", // 목극토 (木剋土)
      isOvercomeBy: "금", // 금극목 (金剋木)
    },
  },
  火: {
    name: "화",
    hanja: "火",
    keywords: ["열정", "발산", "명예", "표현", "화려함", "예의"],
    description:
      "타오르는 불처럼 뜨거운 열정과 에너지를 상징합니다. 자신을 표현하고 명예를 중시하며, 예의 바릅니다.",
    relationships: {
      generates: "토", // 화생토 (火生土)
      isGeneratedBy: "목", // 목생화 (木生火)
      overcomes: "금", // 화극금 (火剋金)
      isOvercomeBy: "수", // 수극화 (水剋火)
    },
  },
  土: {
    name: "토",
    hanja: "土",
    keywords: ["안정", "신용", "포용력", "중재", "신뢰", "중심"],
    description:
      "만물을 포용하는 대지처럼 안정감과 신용을 상징합니다. 중재 역할을 잘하며, 사람들이 믿고 따르는 중심이 됩니다.",
    relationships: {
      generates: "금", // 토생금 (土生金)
      isGeneratedBy: "화", // 화생토 (火生土)
      overcomes: "수", // 토극수 (土剋水)
      isOvercomeBy: "목", // 목극토 (木剋土)
    },
  },
  金: {
    name: "금",
    hanja: "金",
    keywords: ["결단력", "의리", "마무리", "결실", "규칙", "분석"],
    description:
      "단단한 쇠처럼 결단력과 의리를 상징합니다. 원칙을 중시하고, 시작한 일의 결실을 맺는 능력이 뛰어납니다.",
    relationships: {
      generates: "수", // 금생수 (金生水)
      isGeneratedBy: "토", // 토생금 (土生金)
      overcomes: "목", // 금극목 (金剋木)
      isOvercomeBy: "화", // 화극금 (火剋金)
    },
  },
  水: {
    name: "수",
    hanja: "水",
    keywords: ["지혜", "유연성", "저장", "비밀", "생각", "밤"],
    description:
      "흐르는 물처럼 지혜롭고 유연한 사고를 상징합니다. 속을 잘 드러내지 않으며, 지식을 저장하고 응용하는 능력이 있습니다.",
    relationships: {
      generates: "목", // 수생목 (水生木)
      isGeneratedBy: "금", // 금생수 (金生水)
      overcomes: "화", // 수극화 (水剋火)
      isOvercomeBy: "토", // 토극수 (土剋水)
    },
  },
};
