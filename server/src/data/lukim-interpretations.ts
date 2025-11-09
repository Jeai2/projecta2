export interface LukimInterpretation {
  id: number;
  name: string;
  summary: string;
  keywords?: string[];
  notes?: string;
}

export const LUKIM_INTERPRETATIONS: Record<number, LukimInterpretation> = {
  13: {
    id: 13,
    name: "뱀괘",
    summary: "답답하던 일이 풀리기 시작하니, 오늘은 마음을 가볍게 가져도 된다.",
  },
  14: {
    id: 14,
    name: "지렁이괘",
    summary: "상황이 꼬여 보여도, 잠시 멈추면 오히려 길이 보인다.",
  },
  15: {
    id: 15,
    name: "거미괘",
    summary: "바쁘게 움직이기보다, 우선순위를 정리해야 결과가 따른다.",
  },
  16: {
    id: 16,
    name: "비둘기괘",
    summary: "기쁜 소식이 머지않았다. 누군가가 당신을 반갑게 찾는다.",
  },
  17: {
    id: 17,
    name: "달팽이괘",
    summary: "속도는 느려도 방향은 맞으니, 조급해하지 말고 꾸준히 가야 한다.",
  },
  18: {
    id: 18,
    name: "산쥐괘",
    summary: "일이 꼬여도 주변의 도움을 받으면 해결될 수 있다.",
  },
  19: {
    id: 19,
    name: "묶인 원숭이괘",
    summary: "지금은 움직이지 말고 기다려라. 때가 곧 바뀐다.",
  },
  20: {
    id: 20,
    name: "파리괘",
    summary: "경쟁이 많아 피곤하겠지만, 너무 집착하지 말라. 흘러가게 둬라.",
  },
  21: {
    id: 21,
    name: "묶인 돼지괘",
    summary: "무리하면 손해다. 잠시 미루는 편이 훨씬 유리하다.",
  },
  22: {
    id: 22,
    name: "재비괘",
    summary: "노력한 만큼 결과가 따라온다. 새 기운이 트이는 날이다.",
  },
  23: {
    id: 23,
    name: "집쥐괘",
    summary: "생각보다 늦게 풀리지만, 결국 원하는 결과를 얻는다.",
  },
  24: {
    id: 24,
    name: "박쥐괘",
    summary: "예상치 못한 변수에 대비하라. 그래도 귀인의 손길이 있다.",
  },
  25: {
    id: 25,
    name: "까치괘",
    summary: "반가운 소식이 찾아온다. 웃을 일이 생긴다.",
  },
  26: {
    id: 26,
    name: "매미괘",
    summary: "주변 도움 덕에 일이 술술 풀린다. 감사함을 잊지 말라.",
  },
  27: {
    id: 27,
    name: "용괘",
    summary: "큰일을 시작하기에 좋은 날이다. 자신 있게 밀고 나가라.",
  },
};

export const getLukimInterpretation = (
  value: number
): LukimInterpretation | null => {
  return LUKIM_INTERPRETATIONS[value] ?? null;
};
