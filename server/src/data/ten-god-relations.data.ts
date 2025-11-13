import type { TenGodType } from "../../../src/types/today-fortune";

/**
 * ============================================================
 * 십성 관계 해석 데이터 구조 (TODAY FORTUNE / 범용)
 * ------------------------------------------------------------
 * - 목적: 일간(甲~癸)을 기준으로 오늘의 운(일진 등)과의
 *   천간/지지 관계를 십성(비견, 편재, …) 조합으로 해석
 * - 특징:
 *   1) partners 배열로 여러 십성 조합(2개·3개…) 정의
 *   2) scope 으로 천간(gan) / 지지(ji) 구분
 *   3) relation 에 합/충/극/삼합/육합 등 관계명 지정
 *   4) origin 으로 ‘년/월/일/시’ 기둥 구분 가능
 *   5) context 으로 ‘일진/세운/대운…’ 출처 구분 가능
 * ============================================================
 */

type RelationTone = "positive" | "neutral" | "caution";

export interface TenGodRelationInterpretation {
  summary: string;
  detail: string;
  advice: string;
  tone: RelationTone;
}

/**
 * 십성 기본 성향 + 컨디션 (오전/오후)
 *  - 커스텀 해석 작성 시 참고용으로 export
 */
export interface TenGodProfile {
  keyword: string;
  strength: string;
  shadow: string;
  focus: string;
  support: string;
  condition: {
    morning: string;
    afternoon: string;
  };
}

export const TEN_GOD_PROFILES: Record<TenGodType, TenGodProfile> = {
  비견: {
    keyword: "균형",
    strength: "협력과 자존감",
    shadow: "고집과 비교심",
    focus: "동반자 관계",
    support: "동료와 목표를 다시 합의하세요",
    condition: {
      morning: "하루 시작이 생각보다 개운하고 다 해낼 것만 같다.",
      afternoon: "현재의 상태가 유지되며 추가적인 이벤트가 없었으면 한다.",
    },
  },
  겁재: {
    keyword: "돌파",
    strength: "신속한 실행력과 경쟁심",
    shadow: "충동과 위험 감수",
    focus: "위기 대응",
    support: "승부를 보기 전에 리스크를 정리하세요",
    condition: {
      morning: "사소하게 신경쓰여지는 것들이 눈에 띈다.",
      afternoon: "사소하게 신경쓰여지는 것들을 모두 해치워 버리고 싶다.",
    },
  },
  식신: {
    keyword: "성실",
    strength: "실행력과 생산성",
    shadow: "느려지는 판단",
    focus: "프로세스 관리",
    support: "작은 작업이라도 꾸준히 마무리하세요",
    condition: {
      morning: "평화롭지만 해야될 일들이 잔잔하게 많다.",
      afternoon: "나른하지만 해야될 일들이 잔잔하게 많다.",
    },
  },
  상관: {
    keyword: "표현",
    strength: "창의력과 해결력",
    shadow: "과감한 발언",
    focus: "커뮤니케이션",
    support: "말하기 전에 전달 방식을 정돈하세요",
    condition: {
      morning: "뭐하고 놀지, 뭐 먹을지 벌써부터 궁리하고 있다.",
      afternoon: "감정선은 예민하지만 마냥 놀고 먹고 하면 풀린다는 걸 안다.",
    },
  },
  편재: {
    keyword: "확장",
    strength: "외부 네트워크와 기회 포착",
    shadow: "분산되는 집중력",
    focus: "사업·세일즈",
    support: "자원을 나눠 투자하기 전에 분류하세요",
    condition: {
      morning: "활기가 넘친다. 새로운 사람이나 정보가 자극이 된다.",
      afternoon: "머릿속이 복잡해지고, 계획과 정리를 하고 싶은 마음이 든다.",
    },
  },
  정재: {
    keyword: "안정",
    strength: "자원 관리와 생활 기반",
    shadow: "욕심과 보수성",
    focus: "재정 운영",
    support: "지출과 수입을 명확히 구분하세요",
    condition: {
      morning: "해야하는 것들에 대해서 해야만 하고 내 루틴도 지키고 싶어진다.",
      afternoon: "힘들지만 바쁘게 일정을 소화해야 한다. 얼른 쉬고 싶다.",
    },
  },
  편관: {
    keyword: "도전",
    strength: "위기 대응과 추진력",
    shadow: "감정의 거친 표현",
    focus: "경쟁 구도",
    support: "행동 전에 경계선을 먼저 설정하세요",
    condition: {
      morning: "정신이 팽팽히 긴장되어 있다.",
      afternoon: "부담스럽고 압박감이 있어 피로하다.",
    },
  },
  정관: {
    keyword: "질서",
    strength: "책임감과 규범 의식",
    shadow: "경직된 원칙주의",
    focus: "제도 운영",
    support: "규칙을 재정비하고 핵심만 남기세요",
    condition: {
      morning: "오늘 하루는 해야 할 일에 집중하고 싶다.",
      afternoon: "책임감이 무겁지만 그래도 집중해야만 한다.",
    },
  },
  편인: {
    keyword: "통찰",
    strength: "직관과 변화 감지",
    shadow: "불안과 의심",
    focus: "전략·연구",
    support: "개요를 정리해 의심을 줄이세요",
    condition: {
      morning: "생각이 많아지고 정신이 사나워진다.",
      afternoon: "스트레스 받는 일이 생겨 몹시 피로하다.",
    },
  },
  정인: {
    keyword: "보호",
    strength: "학습력과 배려심",
    shadow: "과잉 보호",
    focus: "지식 공유",
    support: "경계를 지키며 도움을 건네세요",
    condition: {
      morning: "마음이 잔잔하고 감성에 젖어들어 무언가를 통해 정진하고 싶다.",
      afternoon: "나른하고 평화롭고 세상 모든 것들이 덧없어 보인다.",
    },
  },
};

export type GanRelationType = "합" | "충" | "극";

export type JiRelationType =
  | "육합"
  | "삼합"
  | "반합"
  | "방합"
  | "충"
  | "형"
  | "삼형"
  | "파"
  | "해";

type RelationScope = "gan" | "ji";

export type ColumnOrigin = "year" | "month" | "day" | "hour";

type DayGan =
  | "甲"
  | "乙"
  | "丙"
  | "丁"
  | "戊"
  | "己"
  | "庚"
  | "辛"
  | "壬"
  | "癸";

/**
 * 다중 십성 조합(2개 이상) 해석 단위
 */
export interface TenGodRelationOverrideEntry
  extends TenGodRelationInterpretation {
  scope: RelationScope;
  relation: GanRelationType | JiRelationType;
  partners: TenGodType[]; // 예: ["비견", "편재"] 또는 ["식신", "정관", "정재"]
  context?: string; // 예: "일진", "세운"
  origin?: ColumnOrigin | ColumnOrigin[]; // 단일 기둥 또는 배열로 지정 가능
  originOverrides?: Partial<
    Record<ColumnOrigin, Partial<TenGodRelationInterpretation>>
  >; // 기둥별로 다른 문구가 필요할 때 사용
}

type TenGodRelationOverrideMap = Partial<
  Record<DayGan, TenGodRelationOverrideEntry[]>
>;

/**
 * 천간/지지 기본 해석(대체 텍스트)
 *  - override 가 없을 때 fallback 용으로 사용
 *  - {PARTNERS} 플레이스홀더가 자동으로 치환됨
 */
const DEFAULT_GAN_RELATIONS: Record<
  GanRelationType,
  TenGodRelationInterpretation
> = {
  합: {
    summary: "{PARTNERS} 천간 합으로 긴장이 낮아집니다.",
    detail:
      "서로의 역할을 인정하면 계획에 숨이 붙습니다. 단, 타협이 느슨해지지 않도록 초반에 기준을 나눠두세요.",
    advice: "공동 목표를 다시 확인하고 역할과 일정표를 맞춰보세요.",
    tone: "positive",
  },
  충: {
    summary: "{PARTNERS} 천간 충으로 재조정이 필요합니다.",
    detail:
      "마찰이 쌓이면 감정이 먼저 반응할 수 있습니다. 문제를 세분화하고 우선순위를 조정하면 균형을 되찾을 수 있습니다.",
    advice: "즉흥적인 결정은 피하고, 자료를 재정비한 뒤 답을 내놓으세요.",
    tone: "caution",
  },
  극: {
    summary: "{PARTNERS} 천간 극으로 압박이 찾아옵니다.",
    detail:
      "당장 대응해야 할 과제가 생기며 책임감이 커집니다. 장점은 분명하지만 피로도도 높으니 기준선을 정하고 움직이세요.",
    advice: "안 해야 할 일을 먼저 지우고, 꼭 필요한 한 가지에 집중하세요.",
    tone: "neutral",
  },
};

const DEFAULT_JI_RELATIONS: Record<
  JiRelationType,
  TenGodRelationInterpretation
> = {
  육합: {
    summary: "{PARTNERS} 지지 육합으로 안정감이 생깁니다.",
    detail:
      "서로의 빈틈을 메우고, 일상이 정돈되는 흐름입니다. 작은 약속이라도 지키면 신뢰가 탄탄해집니다.",
    advice: "협업이 필요한 영역에서 역할과 시간표를 명확히 하세요.",
    tone: "positive",
  },
  삼합: {
    summary: "{PARTNERS} 지지 삼합으로 기운이 크게 확장됩니다.",
    detail:
      "외부 환경이 돕고 있어 과감한 시도를 해보기 좋습니다. 다만 폭주하지 않도록 체크리스트를 두세요.",
    advice: "장기 플랜을 그리고, 필요한 자원을 한꺼번에 확보하세요.",
    tone: "positive",
  },
  반합: {
    summary: "{PARTNERS} 지지 반합으로 절반의 연결이 만들어집니다.",
    detail:
      "완전한 합은 아니지만 안정감을 되찾기에 충분합니다. 상황 변화에 맞춰 방향을 미세 조정하세요.",
    advice: "파일럿 테스트처럼 가볍게 진행하고, 피드백을 빠르게 반영하세요.",
    tone: "neutral",
  },
  방합: {
    summary: "{PARTNERS} 지지 방합으로 같은 영역을 바라봅니다.",
    detail:
      "같은 방향으로 힘이 모입니다. 다만 역할이 겹칠 경우 조정이 필요할 수 있습니다.",
    advice: "필요한 자원을 한 공간에 모으고, 책임 구역을 나누세요.",
    tone: "positive",
  },
  충: {
    summary: "{PARTNERS} 지지 충으로 구조가 흔들립니다.",
    detail:
      "사건이 예상보다 빠르게 전개될 수 있습니다. 핵심만 남기고 나머지는 과감하게 덜어내세요.",
    advice: "불필요한 약속은 줄이고, 반드시 필요한 일부터 처리하세요.",
    tone: "caution",
  },
  형: {
    summary: "{PARTNERS} 지지 형으로 마찰이 생깁니다.",
    detail:
      "불안 요소가 갑자기 올라올 수 있습니다. 조건을 세밀하게 확인하면 충돌을 줄일 수 있습니다.",
    advice: "작은 완충 장치를 마련하고, 대화를 통해 조율하세요.",
    tone: "caution",
  },
  삼형: {
    summary: "{PARTNERS} 삼형으로 압박이 한꺼번에 몰립니다.",
    detail:
      "세 방향의 압박이 동시에 들어오는 날입니다. 가장 지켜야 할 기준 하나를 정하고 나머지는 과감히 줄이세요.",
    advice: "핵심 한 가지를 선택하고 그 외는 보류하거나 위임하세요.",
    tone: "caution",
  },
  파: {
    summary: "{PARTNERS} 지지 파로 구조가 분해됩니다.",
    detail:
      "기존 방식이 한계에 다다른 신호입니다. 불필요한 결속을 정리하면 새로운 길이 열립니다.",
    advice: "다시 시작할 요소와 내려놓을 요소를 구분하세요.",
    tone: "neutral",
  },
  해: {
    summary: "{PARTNERS} 지지 해로 미묘한 충돌이 이어집니다.",
    detail:
      "겉보기엔 조용해도 안쪽에서 스트레스가 누적됩니다. 상황을 투명하게 드러내면 부담이 줄어듭니다.",
    advice: "정면 승부보다 전략적 대화를 시도해 보세요.",
    tone: "neutral",
  },
};

/**
 * 사용자 정의 해석
 *  - 예시로 辛 일간 일부 조합만 서술
 *  - 실제 서비스에서는 甲~癸 전부를 추가 확장
 */
export const TEN_GOD_RELATION_OVERRIDES: TenGodRelationOverrideMap = {
  甲: [
    {
      scope: "gan",
      relation: "합",
      partners: ["비견", "정재"],
      summary: "나만의 계획으로 목표를 달성할 수 있습니다.",
      detail:
        "마음은 정돈되고 눈빛이 좋아진다. 본인이 하고자 하는 대로 실행으로 옮기기 좋다.",
      advice:
        "다른 사람들의 감정과 말이 잘 들리지 않을 수 있으니, 살짝 뒤로 물러나 시야를 넓히는 것도 좋다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "합",
      partners: ["겁재", "편관"],
      summary: "무거운 책임 속에서도 중심을 되찾는 날이다.",
      detail:
        "의무감이 나를 움직인다. 감정은 차분히 가라앉고 판단은 또렸해지며, 나만의 리듬이 돌아온다.",
      advice:
        "과정보다, 완정보다, 흐름을 정리하자. 말보다는 온기로 관계를 다독이는 것이 좋다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "합",
      partners: ["식신", "정관"],
      summary: "불안감을 잠재우기 위해 바로 서지만, 행동이 굼뜬다.",
      detail:
        "마음의 여유가 부족하지만 억눌린 감정 속에서도 질서를 바로 세우려 한다. 다만 생각이 많아 몸이 쉽게 움직이지 않는다.",
      advice:
        "정리가 필요한 시기이므로 머릿속을 비우는 것이 좋으며, 작은 실천 하나로 리듬을 돌려보자. 유연함이 숨통을 트게 해줄 수 있다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "합",
      partners: ["상관", "편인"],
      summary: "감이 잘 맞지만, 말이나 행동이 앞서서 흐름이 꼬일 수 있다.",
      detail:
        "직감이 예리해서 아이디어가 잘 떠오르며, 조금만 속도를 늦추면 일도 사람도 훨씬 매끄럽게 풀린다. 하지만 생각보다 표현이 많아 피곤하거나 오해를 살 수 있다.",
      advice:
        "오늘은 말보다 행동을, 행동보다 분위기를 살피는 것이 좋다. 하고 싶은 말이 많아도 한 박자 쉬고, 욕심만 줄이자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "합",
      partners: ["편재", "정인"],
      summary: "참신한 아이디어 혹은 나의 논리가 인정을 받는다.",
      detail:
        "마음은 정돈되고 눈빛이 좋아진다. 본인이 하고자 하는 대로 실행으로 옮기기 좋다.",
      advice:
        "다른 사람들의 감정과 말이 잘 들리지 않을 수 있으니, 살짝 뒤로 물러나 시야를 넓히는 것도 좋다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    // 천간 충극 관계
    {
      scope: "gan",
      relation: "극",
      partners: ["비견", "편재"],
      summary: "촉과 감에 의지하여 움직이게 되어 조심스럽다.",
      detail:
        "감각보다는 직감이 잘 맞으나, 사람이나 상황이 생각만큼 따라주지 않는다.",
      advice:
        "흐름을 살피고 욕심을 내려놓으면 일이 자연스럽게 풀린다. 판단이 흐려지니 속도를 늦추자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "극",
      partners: ["편재", "편인"],
      summary: "아이디어가 현실로, 감정은 차분히 가라앉는다.",
      detail:
        "실속있는 결과를 바랄 수 있지만 내면의 여유가 다소 부족하다.",
      advice:
        "결과 중심으로 흘러가나 효율이 떨어지니 지친다. 숨을 비워 호흡을 천천히 하자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "충",
      partners: ["편인", "식신"],
      summary: "생각이 너무 많아 속도가 느려지는 날이다.",
      detail:
        "해야 할 일에 대한 책임감이 생기고 집중력도 좋지만 머리가 복잡하여 행동이 굼뜬다. 생각이 깊어질수록 답답하다.",
      advice:
        "완벽하게 하려고 하지 말고 가볍게 시작하며 머릿속 계산보다는 손발을 먼저 움직여보자. 단순함이 숨통을 트게 해줄 수 있다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "극",
      partners: ["식신", "편관"],
      summary: "의욕은 있지만 외부 압박에 기가 조금 꺾인다.",
      detail:
        "해야하는 것들이 많으나 추직련이 약해진다. 잘해보려는 마음은 크지만, 책임감과 부담이 따른다.",
      advice:
        "결과보다는 컨디션 조절이 더 중요하다. 무리하지 말고 자신을 다독이며 한 걸음씩 나가자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "충",
      partners: ["편관", "비견"],
      summary: "내 고집이 속도를 늦춘다.",
      detail:
        "추진력이 강하지만 내 고집이 강하여 협업이나 관계가 어색해질 수 있다.",
      advice:
        "조율과 대화를 통해 고집을 조금만 내려놓아보자. 양보가 더 큰 결과를 이끌어낼 수 있다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "극",
      partners: ["겁재", "정재"],
      summary: "생각은 활발하지만 관계 속 미묘하게 흐름이 꼬인다.",
      detail:
        "직관이 예민하게 깨어나 뭐든 할 수 있을 것 같지만 현실 감각이 약해진다.",
      advice:
        "계산보다는 느낌을, 완벽함보다는 흐름을 따라가자. 모든 걸 통제하려는 건 욕심이다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "극",
      partners: ["정재", "정인"],
      summary: "감정은 차분하고 생각은 깊지만, 표현이 조심스럽다.",
      detail:
        "말보다 생각이 앞서고, 표현이 한 반자 느리다. 겉으로는 조용하지만 속으로는 여러 계획과 판단이 넘친다.",
      advice:
        "굳이 나서지 않아도 신뢰가 생기는 날이고 꾸준함이 중요하다. 단단한 태도를 일관되게 유지하자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "충",
      partners: ["정인", "상관"],
      summary: "감정이 앞서지만 이성이 균형을 잡아준다.",
      detail:
        "순간적인 감정이나 말이 앞설 수 있지만 이성이 균형을 잡아줄 것이다. 감정과 책임이 충돌하나 중심은 유지한다.",
      advice:
        "말보다 마음의 온도를 먼저 살펴 즉흥적인 판단을 한 템포 늦추는 것이 현명하다. 결국 이성이 균형을 잡아줄 것이다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "극",
      partners: ["상관", "정관"],
      summary: "기세는 강하나 벽에 부딪혀 흐름이 꼬인다.",
      detail:
        "기세는 강하지만 규율이나 책임 속에서 무시할 수 없어 균형을 찾으려 애쓰는 흐름이다.",
      advice:
        "밀어붙이기보다 타이밍을 읽는 것이 중요하며 내 방식을 고집하지 말고 부드럽게 우회하자.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    {
      scope: "gan",
      relation: "충",
      partners: ["정관", "겁재"],
      summary: "욕심이 끼어들면 균형이 흔들린다.",
      detail:
        "책임감도 있고 안정된 환경이지만 욕심이 많이 생기며 내 몫에 대한 시선이 많아진다.",
      advice:
        "욕심보다는 신뢰를 선택하고 조용히 꾸준히 가는 것이 제일 빠른 길이다.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    // 지지 : 반합 관계
    {
      scope: "ji",
      relation: "반합", //인오반합
      partners: ["비견", "상관"],
      summary: "의욕이 넘치며 결과로 인정받을 수 있다.",
      detail:
        "해야되는 일이 완벽하게 이뤄지며 확신과 실행력도 좋다. 결과가 말끔하게 드러난다.",
      advice: "",
      tone: "positive",
      context: "일진",
      origin: ["day", "month"],
      originOverrides: {
        day: {
          detail:
            "머리가 맑고 뭐든 해볼 만하다. 자신감이 생기고 집중력도 좋아진다. 애쓰지 않아도 일이 자연스럽게 흘러간다.",
          advice:
            "",
        },
        month: {
          detail:
            "내가 움직이면 주변도 따라 움직이고 분위기가 정돈되며, 사람들과의 소통도 좋아진다. 센스와 능력이 동시에 돋보인다.",
          advice:
            "",
        },
      },
    },
    {
      scope: "ji",
      relation: "반합", //오술반합
      partners: ["상관", "편재"],
      summary: "긴장된 상태에서 결과와 책임감이 높아지고 성과가 있다.",
      detail:
        "내 결과가 전반적인 상황에 책임으로 연결되고 보상이 따라온다.",
      advice: "",
      tone: "positive",
      context: "일진",
      origin: ["day", "month"],
      originOverrides: {
        day: {
          detail:
            "아이디어도 많고 손이 잘 움직인다. 압박감이 있지만 결과가 눈에 보이니 뿌듯함도 다가온다.",
          advice:
            "",
        },
        month: {
          detail:
            "높은 기준 속 주변에서 평가나 기대가 많아지고 잘 해내면 인정을 크게 받을 수 있다. 실직적 이익이나 결과, 성과로 이어진다.",
          advice:
            "",
        },
      },
    },
    {
      scope: "ji",
      relation: "삼합", //인오술삼합
      partners: ["비견", "상관","편재"],
      summary: "흐름이 매끄럽고 일도 인간관계도 술술 풀린다.",
      detail:
        "능력과 주변의 도움이 만나 꾸준히 성과를 내고, 그 성과가 신뢰를 쌓아 결국 현실적인 큰 이익으로 돌아온다.",
      advice: "",
      tone: "positive",
      context: "일진",
      origin: ["day", "month"],
      originOverrides: {
        day: {
          detail:
            "모든 것을 스스로 통제하고 있다는 자신감과 함께 일의 능률이 최고조에 달하여 뿌듯함을 느낀다.",
          advice:
            "",
        },
        month: {
          detail:
            "뛰어난 실력과 책임감으로 주변의 신뢰를 얻어 리더십이 돋보이며, 노력한 만큼 금전적, 명예적 보상까지 확실하게 따른다.",
          advice:
            "",
        },
      },
    },
    { 
      scope: "ji",
      relation: "반합", //신자반합
      partners: ["상관", "편재"],
      summary: "의욕이 넘치며 결과로 인정받을 수 있다.",
      detail:
        "해야되는 일이 완벽하게 이뤄지며 확신과 실행력도 좋다. 결과가 말끔하게 드러난다.",
      advice: "",
      tone: "positive",
      context: "일진",
      origin: ["day", "month"],
      originOverrides: {
        day: {
          detail:
            "머리가 맑고 뭐든 해볼 만하다. 자신감이 생기고 집중력도 좋아진다. 애쓰지 않아도 일이 자연스럽게 흘러간다.",
          advice:
            "",
        },
        month: {
          detail:
            "내가 움직이면 주변도 따라 움직이고 분위기가 정돈되며, 사람들과의 소통도 좋아진다. 센스와 능력이 동시에 돋보인다.",
          advice:
            "",
        },
      },
    },
  ],
  辛: [
    // 천간: 정재 ↔ 정관 극
    {
      scope: "gan",
      relation: "극",
      partners: ["정재", "정관"],
      summary: "辛금 일간에게 정재·정관 극은 계획을 다시 조율하라는 신호입니다.",
      detail:
        "재정 의사결정이 느리게 흘러가고, 책임 소재가 겹치면서 피로도가 올라갑니다. 대신 꼼꼼함 덕분에 균형을 회복할 힘도 충분합니다.",
      advice: "지출과 투자를 다시 분류하고, 꼭 필요한 한 가지부터 처리하세요.",
      tone: "neutral",
      context: "일진",
      origin: "day",
    },
    
    // 지지: 겁재 ↔ 정관 육합
    {
      scope: "ji",
      relation: "육합",
      partners: ["겁재", "정관"],
      summary: "辛금 일간이 겁재·정관 육합을 만나면 경쟁보다 협력이 빛납니다.",
      detail:
        "오늘의 일진이나 원국에서 겁재와 정관이 서로 기대어 숨통이 트입니다. 추진력과 안정감이 균형을 이루니, 교섭이나 협업에 강점이 생깁니다.",
      advice: "중요한 만남이 있다면 겁내지 말고, 분위기를 부드럽게 이끄세요.",
      tone: "positive",
      context: "일진",
      origin: "day",
    },
    // 지지: 정재 ↔ 겁재 형
    {
      scope: "ji",
      relation: "형",
      partners: ["정재", "겁재"],
      summary: "정재·겁재 형살이 들어오면 현실 과제가 미묘하게 흔들립니다.",
      detail:
        "사소한 갈등이 겹쳐 마음이 급해질 수 있습니다. 대신 수납, 정리, 결제 체크부터 하나씩 정돈하면 흐름이 안정됩니다.",
      advice: "장부나 비용을 오전에 정리하고, 오후에는 호흡을 비워두세요.",
      tone: "caution",
      context: "일진",
      origin: "month",
    },
    // 지지: 정재 ↔ 정관 육합 (월/일 기둥 구분 예시)
    {
      scope: "ji",
      relation: "육합",
      partners: ["정재", "정관"],
      summary: "정재·정관 육합은 일과 생활의 균형을 다시 세웁니다.",
      detail:
        "책임과 재정이 한데 묶이며 안정감을 찾습니다. 완벽주의로 피로해지지 않도록 여유 공간을 확보하세요.",
      advice: "정리와 점검 후 짧은 휴식 계획을 함께 세워 두면 좋습니다.",
      tone: "neutral",
      context: "일진",
      origin: ["day", "month"],
      originOverrides: {
        month: {
          detail:
            "월운에서 정재와 정관이 육합을 이루면 이번 달 계획 전체를 재정비하기 좋습니다. 장기 예산과 업무 루틴을 손보고, 월말에 다시 확인해 보세요.",
          advice: "월 단위 일정표를 새로 짜고, 쉬는 날과 집중해야 할 날을 함께 표시해 두면 도움이 됩니다.",
        },
      },
    },
    // 지지: 정관 ↔ 겁재 형
    {
      scope: "ji",
      relation: "형",
      partners: ["정관", "겁재"],
      summary: "정관·겁재 형살은 권한과 책임의 균형을 다시 점검하라는 신호입니다.",
      detail:
        "위에서 요구가 잦아져 압박이 느껴질 수 있습니다. 조급해지면 실수가 나올 수 있으니 기본 규칙을 재정비하세요.",
      advice: "중요한 결정은 서두르지 말고, 근거 자료를 먼저 정리해 두세요.",
      tone: "neutral",
      context: "일진",
      origin: "hour",
    },
  ],
  // TODO: 甲~癸 일간 전용 커스텀 해석을 여기에 추가 확장
};

/**
 * partners 배열 정렬 (["정재","정관"] -> "정관|정재")
 *  - 조합 순서에 상관없이 동일 키로 비교하기 위함
 */
const normalizePartners = (partners: TenGodType[]): string =>
  [...partners].sort().join("|");

/**
 * {PARTNERS} 플레이스홀더 치환
 */
const fillTemplate = (
  template: string,
  partnersLabel: string
): string => template.replace(/\{PARTNERS\}/g, partnersLabel);

/**
 * override > origin > context 순으로 가장 적합한 해석 찾기
 */
const isOriginMatch = (
  entryOrigin: ColumnOrigin | ColumnOrigin[] | undefined,
  targetOrigin: ColumnOrigin | undefined
): boolean => {
  if (targetOrigin == null) return true;
  if (entryOrigin == null) return true;
  if (Array.isArray(entryOrigin)) {
    return entryOrigin.includes(targetOrigin);
  }
  return entryOrigin === targetOrigin;
};

const findOverride = (
  entries: TenGodRelationOverrideEntry[] | undefined,
  scope: RelationScope,
  relation: GanRelationType | JiRelationType,
  partners: TenGodType[],
  context?: string,
  origin?: ColumnOrigin
): TenGodRelationOverrideEntry | undefined => {
  if (!entries || entries.length === 0) return undefined;

  const key = normalizePartners(partners);

  const scoped = entries.filter(
    (entry) =>
      entry.scope === scope &&
      entry.relation === relation &&
      normalizePartners(entry.partners) === key
  );
  if (scoped.length === 0) return undefined;

  const originFiltered = scoped.filter((entry) =>
    isOriginMatch(entry.origin, origin)
  );
  if (originFiltered.length === 0) return scoped[0];

  if (!context) return originFiltered[0];

  return (
    originFiltered.find((entry) => entry.context === context) ?? originFiltered[0]
  );
};

const composeInterpretation = (
  entry: TenGodRelationOverrideEntry,
  origin?: ColumnOrigin
): TenGodRelationInterpretation => {
  const base: TenGodRelationInterpretation = {
    summary: entry.summary,
    detail: entry.detail,
    advice: entry.advice,
    tone: entry.tone,
  };

  if (!origin || !entry.originOverrides) {
    return base;
  }

  const override = entry.originOverrides[origin];
  if (!override) {
    return base;
  }

  return {
    summary: override.summary ?? base.summary,
    detail: override.detail ?? base.detail,
    advice: override.advice ?? base.advice,
    tone: override.tone ?? base.tone,
  };
};

/**
 * 기본 텍스트 생성 (override 없을 때 사용)
 */
const buildFallbackInterpretation = (
  scope: RelationScope,
  relation: GanRelationType | JiRelationType,
  partners: TenGodType[]
): TenGodRelationInterpretation => {
  const partnersLabel = partners.join(" · ");
  const base =
    scope === "gan"
      ? DEFAULT_GAN_RELATIONS[relation as GanRelationType]
      : DEFAULT_JI_RELATIONS[relation as JiRelationType];

  return {
    summary: fillTemplate(base.summary, partnersLabel),
    detail: fillTemplate(base.detail, partnersLabel),
    advice: fillTemplate(base.advice, partnersLabel),
    tone: base.tone,
  };
};

export interface TenGodRelationLookupArgs {
  scope: RelationScope;
  dayGan: DayGan;
  partners: TenGodType[];
  relation: GanRelationType | JiRelationType;
  context?: string;
  origin?: ColumnOrigin;
}

/**
 * 십성 관계 해석 조회
 * 사용 예)
 *  resolveTenGodRelationInterpretation({
 *    scope: "gan",
 *    dayGan: "甲",
 *    partners: ["비견", "편재"],
 *    relation: "극",
 *    origin: "year",
 *    context: "일진",
 *  });
 */
export const resolveTenGodRelationInterpretation = ({
  scope,
  dayGan,
  partners,
  relation,
  context,
  origin,
}: TenGodRelationLookupArgs): TenGodRelationInterpretation => {
  const overrides = TEN_GOD_RELATION_OVERRIDES[dayGan];
  const matched = findOverride(
    overrides,
    scope,
    relation,
    partners,
    context,
    origin
  );
  if (matched) {
    return composeInterpretation(matched, origin);
  }

  return buildFallbackInterpretation(scope, relation, partners);
};
