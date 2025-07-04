// server/src/data/interpretation/sipsin.ts

/**
 * 십성(십신)의 상세 정보를 정의하는 인터페이스
 */
export interface SipsinDefinition {
  name: string; // 십성의 이름
  keywords: string[]; // 십성의 키워드
  summary: string; // 십성의 요약
  description: string; // 십성의 설명
  strengths: string; // 십성의 장점
  weaknesses: string; // 십성의 약점
  represents: {
    person: string; // 십성이 대표하는 사람(육친)
    concept: string; // 십성이 대표하는 개념(자아)
    object?: string; // 십성이 대표하는 물건(사물)
  };
  byLocation?: {
    year?: string; // 년주에 십성이 위치할 때 해석
    month?: string; // 월주에 십성이 위치할 때 해석
    day?: string; // 일주에 십성이 위치할 때 해석
    hour?: string; // 시주에 십성이 위치할 때 해석
  };
  byQuantity?: {
    excessive?: string; // 십성이 너무 많을 때 해석
    lacking?: string; // 십성이 없을 때 해석
  };
  genderBased?: {
    male?: {
      summary?: string; // 남성에게 특화된 한 줄 요약 (필요시)
      description?: string; // 남성에게 특히 강조되는 설명
      represents?: string; // 남성에게 상징하는 추가/다른 인물
      advice?: string; // 남성을 위한 특화 조언
    };
    female?: {
      summary?: string; // 여성에게 특화된 한 줄 요약 (필요시)
      description?: string; // 여성에게 특히 강조되는 설명
      represents?: string; // 여성에게 상징하는 추가/다른 인물
      advice?: string; // 여성을 위한 특화 조언
    };
  };
}

export const SIPSIN_INTERPRETATION: Record<string, SipsinDefinition> = {
  비견: {
    name: "비견(比肩)",
    keywords: [
      "고집",
      "자립심",
      "자주성",
      "자존감",
      "독립성",
      "수평적 관계",
      "동등한 관계",
      "자기중심",
    ],
    summary:
      "나와 어깨를 나란히 하는 든든한 형제나 친구처럼, 강력한 자아와 독립성을 상징하는 기운입니다.",
    description:
      "비견은 '어깨를 나란히 하는 존재'라는 의미로, 자아의 확장된 형태이자 내면의 복제된 힘을 상징합니다. 주체성이 강하고 독립심과 자기주장이 강하며, 어떤 일이든 스스로 해결하려는 의지가 있으며, 주변 사람들과 동등한 관계를 맺으려는 성향이 강합니다.",
    strengths:
      "자기 확신이 뚜렷하고 흔들리지 않으며, 외부에 의존하지 않고 독자적으로 생존이 가능합니다. 삶의 주체로서 주도권을 가지려고 하며, 목표 지향적이고 추진력이 있습니다.",
    weaknesses:
      "고집이 세고 융통성이 부족하며 타인과 협력이 어려워 고립이 될 수가 있습니다. 타인과 경쟁하려는 성향이 발생하거나 자존심으로 인한 갈등 유발 등 집단보다는 개인주의적입니다.",
    represents: {
      person: "형제, 자매, 친구, 동료",
      concept:
        "자립심, 자기정체성, 자기확장, 자기애, 자율성, 자기 효능감, 자기 인식",
    },
    byLocation: {
      year: "개인의 자립과, 정체성, 자기확장으로 인한 가치관이 성립됩니다. 성장 배경에서 독립적인 성향이 형성되고 비교적 일찍 자신의 진로나 가치관을 확립하는 경향이 있습니다.",
      month:
        "사회생활의 중심에 경쟁과 협력의 구도가 강하게 나타납니다. 친구나 동료들과 함께 성장하거나, 때로는 치열하게 경쟁하며 발전하는 모습입니다. 리더십이 강하고 주도적인 성향이 있습니다.",
      day: "배우자를 친구처럼 편안하게 대하거나, 반대로 강한 자존심으로 인해 관계의 주도권 다툼이 있을 수 있습니다. 동등하고 수평적인 관계를 지향합니다.",
      hour: "말년까지 사회적 활동을 계속하거나, 자녀를 독립된 인격체로 존중하고 친구 같은 관계를 맺으려 합니다. 개인적인 시간과 독립성을 중요시합니다.",
    },
    byQuantity: {
      excessive:
        "비견이 너무 많으면 고집이 강하고 자기중심적인 성향이 극대화될 수 있습니다. 주변의 도움을 거절하고 독단적으로 행동하여 고립되거나, 재물(가치)에 문제가 생길 수 있습니다.",
      lacking:
        "비견이 없거나 약하면 추진력이나 독립심이 부족하여 중요한 결정을 망설일 수 있습니다. 타인에게 의존하려는 마음이 강해지거나 수동적이며, 자신의 몫을 제대로 챙기지 못하는 상황이 발생하기 쉽습니다. 위기극복에 어려움을 겪을 수 있습니다.",
    },
    genderBased: {
      male: {
        summary: "남성에게 특화된 한 줄 요약",
        description: "남성에게 특히 강조되는 설명",
        represents: "남성에게 상징하는 추가/다른 인물",
        advice: "남성을 위한 특화 조언",
      },
      female: {
        summary: "여성에게 특화된 한 줄 요약",
        description: "여성에게 특히 강조되는 설명",
        represents: "여성에게 상징하는 추가/다른 인물",
        advice: "여성을 위한 특화 조언",
      },
    },
  },
  겁재: {
    name: "겁재(劫財)",
    keywords: [
      "경쟁",
      "경쟁심",
      "경쟁욕",
      "경쟁심",
      "경쟁욕",
      "경쟁심",
      "경쟁욕",
    ],
    summary:
      "나와 어깨를 나란히 하는 든든한 형제나 친구처럼, 강력한 자아와 독립성을 상징하는 기운입니다.",
    description:
      "비견은 '어깨를 나란히 하는 존재'라는 의미로, 자아의 확장된 형태이자 내면의 복제된 힘을 상징합니다. 주체성이 강하고 독립심과 자기주장이 강하며, 어떤 일이든 스스로 해결하려는 의지가 있으며, 주변 사람들과 동등한 관계를 맺으려는 성향이 강합니다.",
    strengths:
      "자기 확신이 뚜렷하고 흔들리지 않으며, 외부에 의존하지 않고 독자적으로 생존이 가능합니다. 삶의 주체로서 주도권을 가지려고 하며, 목표 지향적이고 추진력이 있습니다.",
    weaknesses:
      "고집이 세고 융통성이 부족하며 타인과 협력이 어려워 고립이 될 수가 있습니다. 타인과 경쟁하려는 성향이 발생하거나 자존심으로 인한 갈등 유발 등 집단보다는 개인주의적입니다.",
    represents: {
      person: "형제, 자매, 친구, 동료",
      concept:
        "자립심, 자기정체성, 자기확장, 자기애, 자율성, 자기 효능감, 자기 인식",
    },
    byLocation: {
      year: "개인의 자립과, 정체성, 자기확장으로 인한 가치관이 성립됩니다. 성장 배경에서 독립적인 성향이 형성되고 비교적 일찍 자신의 진로나 가치관을 확립하는 경향이 있습니다.",
      month:
        "사회생활의 중심에 경쟁과 협력의 구도가 강하게 나타납니다. 친구나 동료들과 함께 성장하거나, 때로는 치열하게 경쟁하며 발전하는 모습입니다. 리더십이 강하고 주도적인 성향이 있습니다.",
      day: "배우자를 친구처럼 편안하게 대하거나, 반대로 강한 자존심으로 인해 관계의 주도권 다툼이 있을 수 있습니다. 동등하고 수평적인 관계를 지향합니다.",
      hour: "말년까지 사회적 활동을 계속하거나, 자녀를 독립된 인격체로 존중하고 친구 같은 관계를 맺으려 합니다. 개인적인 시간과 독립성을 중요시합니다.",
    },
    byQuantity: {
      excessive:
        "비견이 너무 많으면 고집이 강하고 자기중심적인 성향이 극대화될 수 있습니다. 주변의 도움을 거절하고 독단적으로 행동하여 고립되거나, 재물(가치)에 문제가 생길 수 있습니다.",
      lacking:
        "비견이 없거나 약하면 추진력이나 독립심이 부족하여 중요한 결정을 망설일 수 있습니다. 타인에게 의존하려는 마음이 강해지거나 수동적이며, 자신의 몫을 제대로 챙기지 못하는 상황이 발생하기 쉽습니다. 위기극복에 어려움을 겪을 수 있습니다.",
    },
  },
  식신: {
    name: "식신(食神)",
    keywords: ["식신", "표현", "창조", "생산", "여유", "풍요", "재능"],
    summary:
      "식신은 자신의 재능과 생각을 자유롭게 표현하고, 창조적이며 생산적인 에너지를 상징하는 기운입니다.",
    description:
      "식신은 '먹는 신'이라는 뜻으로, 자신의 내면에서 우러나오는 창의력과 생산성을 바탕으로 결과물을 만들어내는 힘을 의미합니다. 말과 행동, 예술, 창작, 요리 등 다양한 방식으로 자신을 표현하며, 여유롭고 풍요로운 삶을 추구합니다. 타인에게 즐거움과 혜택을 나누는 역할도 합니다.",
    strengths:
      "표현력이 뛰어나고, 창의적이며 생산적인 결과물을 만들어냅니다. 여유롭고 낙천적인 성향으로 주변에 긍정적인 영향을 주며, 타인에게 베푸는 마음이 큽니다. 예술, 요리, 창작 등 다양한 분야에서 재능을 발휘할 수 있습니다.",
    weaknesses:
      "지나치게 여유를 부리거나 게을러질 수 있으며, 현실에 안주하려는 경향이 생길 수 있습니다. 자기표현이 과해져 경솔하게 보일 수 있고, 때로는 책임감이 부족해질 수 있습니다.",
    represents: {
      person: "예술가, 요리사, 창작자, 발표자, 엔터테이너",
      concept: "표현, 창조, 생산, 여유, 풍요, 재능, 즐거움, 나눔",
    },
    byLocation: {
      year: "연지에 식신이 있으면 성장 과정에서 예술적 재능이나 표현력이 일찍 드러나고, 집안 분위기가 여유롭고 풍요로울 수 있습니다.",
      month:
        "월지에 식신이 있으면 사회생활에서 창의력과 생산성이 돋보이며, 자신의 재능을 통해 인정받을 수 있습니다. 직업적으로 예술, 창작, 요리 등과 인연이 깊을 수 있습니다.",
      day: "일지에 식신이 있으면 배우자와의 관계에서 즐거움과 여유, 따뜻한 분위기가 강조됩니다. 가정에 풍요와 행복이 깃들 수 있습니다.",
      hour: "시지에 식신이 있으면 말년에 취미나 창작, 예술 활동에 몰두하거나, 자녀가 재능 있고 표현력이 뛰어난 경우가 많습니다. 노후에 여유롭고 풍요로운 삶을 추구합니다.",
    },
    byQuantity: {
      excessive:
        "식신이 너무 많으면 게으르거나 현실에 안주하려는 경향이 강해질 수 있습니다. 자기표현이 과해져 경솔하게 행동하거나, 책임감이 부족해질 수 있습니다.",
      lacking:
        "식신이 없거나 약하면 표현력이나 창의성이 부족하고, 자신의 재능을 드러내기 어렵습니다. 삶에 여유가 부족하고, 즐거움이나 풍요로움을 느끼기 힘들 수 있습니다.",
    },
  },

  상관: {
    name: "상관(傷官)",
    keywords: [
      "표현력",
      "창의성",
      "비판",
      "자유분방",
      "개성",
      "도전",
      "예술성",
    ],
    summary:
      "상관은 자신의 생각과 감정을 자유롭게 표현하고, 창의적이며 독특한 개성을 드러내는 기운입니다.",
    description:
      "상관은 '상처를 주는 말'이라는 뜻에서 유래했으나, 실제로는 기존의 틀을 깨고 자신의 생각을 솔직하게 드러내는 힘을 의미합니다. 언변이 뛰어나고, 예술적 감각과 창의성이 풍부하며, 기존의 권위나 규범에 얽매이지 않고 자유롭게 사고하고 행동합니다. 비판적 시각과 도전정신이 강해 새로운 길을 개척하는 데 능합니다.",
    strengths:
      "표현력이 뛰어나고, 창의적이며 독창적인 아이디어가 많습니다. 예술, 문학, 연설 등에서 두각을 나타내며, 기존의 한계를 뛰어넘는 도전정신이 있습니다. 솔직하고 개방적인 태도로 주변에 신선한 자극을 줍니다.",
    weaknesses:
      "지나친 솔직함이나 비판적 태도로 인해 타인과 갈등이 생길 수 있습니다. 규칙이나 권위를 무시하는 경향이 강해 사회적 마찰이 잦을 수 있으며, 감정 기복이 심하거나 충동적으로 행동할 수 있습니다.",
    represents: {
      person: "예술가, 연설가, 비평가, 창작자, 자유인",
      concept: "표현, 창의성, 비판, 자유, 개성, 도전, 예술성, 솔직함, 혁신",
    },
    byLocation: {
      year: "상관이 연지에 있으면 집안 분위기가 자유롭고 개방적일 수 있습니다. 성장 과정에서 예술적 재능이나 창의성이 일찍 드러날 수 있습니다.",
      month:
        "월지에 상관이 있으면 사회생활에서 표현력과 창의성이 돋보입니다. 예술, 창작, 기획 등에서 두각을 나타내며, 자신의 개성을 적극적으로 드러냅니다.",
      day: "일지에 상관이 있으면 배우자와의 관계에서 솔직한 의사소통이 중요하며, 때로는 감정의 기복이나 갈등이 있을 수 있습니다. 개성 강한 배우자를 만날 가능성이 높습니다.",
      hour: "시지에 상관이 있으면 말년에 예술, 창작, 취미 활동에 몰두하거나, 자녀가 개성 있고 자유로운 성향을 보일 수 있습니다.",
    },
    byQuantity: {
      excessive:
        "상관이 너무 많으면 지나치게 자유분방하고 충동적이 되어 사회적 규범을 무시하거나, 타인과의 갈등이 잦아질 수 있습니다. 감정 기복이 심해지고, 비판적 태도가 극단적으로 나타날 수 있습니다.",
      lacking:
        "상관이 없거나 약하면 표현력이 부족하고, 창의성이나 개성이 드러나지 않을 수 있습니다. 자신의 생각을 드러내는 데 소극적이거나, 새로운 시도에 두려움을 느낄 수 있습니다.",
    },
  },
  정재: {
    name: "정재(正財)",
    keywords: ["재물", "성실", "근면", "안정", "책임", "현실감각", "신뢰"],
    summary:
      "정재는 성실함과 근면함, 안정적인 재물운과 현실적인 감각을 상징하는 기운입니다.",
    description:
      "정재는 올바른 방법과 노력으로 얻는 재물, 그리고 성실함과 책임감을 의미합니다. 자신의 힘으로 재산을 모으고, 꾸준한 노력과 절제된 생활을 통해 안정적인 기반을 다집니다. 현실을 중시하며, 신뢰와 도리를 지키는 태도가 강합니다. 재물뿐 아니라 인간관계에서도 신의와 책임을 중시합니다.",
    strengths:
      "성실하고 근면하며, 재정적으로 안정감을 추구합니다. 신뢰를 얻고, 책임감 있게 행동하며, 꾸준한 노력으로 목표를 달성합니다. 현실적인 판단력과 절제된 태도로 주변의 신임을 받습니다.",
    weaknesses:
      "지나치게 현실적이거나 보수적으로 변할 수 있으며, 변화에 둔감해질 수 있습니다. 융통성이 부족하거나, 지나친 절약으로 인해 기회를 놓칠 수 있습니다. 때로는 물질적 집착이 강해질 수 있습니다.",
    represents: {
      person: "성실한 직장인, 사업가, 신뢰받는 친구, 책임감 있는 가족",
      concept: "재물, 성실, 근면, 안정, 책임, 신뢰, 현실감각, 절제, 도리",
    },
    byLocation: {
      year: "정재가 연지에 있으면 집안의 재물운이 안정적이고, 부모와의 인연에서 신뢰와 책임감이 강조됩니다. 성장 과정에서 근면함과 성실함을 배우는 환경일 수 있습니다.",
      month:
        "월지에 정재가 있으면 사회생활에서 신뢰와 성실함으로 인정받고, 직업적으로 안정적인 기반을 다질 수 있습니다. 꾸준한 노력으로 재물과 명예를 얻는 경향이 있습니다.",
      day: "일지에 정재가 있으면 배우자와의 관계에서 신뢰와 책임감이 중요하게 작용합니다. 가정의 경제적 안정과 조화로운 분위기를 중시합니다.",
      hour: "시지에 정재가 있으면 말년에 재정적으로 안정되고, 자녀에게 성실함과 책임감을 강조하는 경향이 있습니다. 노후에 평온함과 안정감을 추구합니다.",
    },
    byQuantity: {
      excessive:
        "정재가 너무 많으면 지나치게 현실적이고 보수적으로 변할 수 있습니다. 융통성이 부족해지고, 새로운 기회를 놓치거나 물질에 집착할 수 있습니다.",
      lacking:
        "정재가 없거나 약하면 재정적 안정이 부족하고, 성실함이나 책임감이 약해질 수 있습니다. 재물 관리에 어려움을 겪거나, 신뢰를 얻기 힘들 수 있습니다.",
    },
  },
  편재: {
    name: "편재(偏財)",
    keywords: ["재물", "기회", "유연함", "사교성", "사업", "확장", "모험"],
    summary:
      "편재는 다양한 기회와 유연한 사고, 넓은 인간관계와 모험심을 상징하는 재물의 기운입니다.",
    description:
      "편재는 정해진 틀에 얽매이지 않고, 다양한 곳에서 재물을 얻는 능력과 기회를 의미합니다. 사교성이 뛰어나고, 사업적 감각이 발달했으며, 변화에 민감하게 반응합니다. 새로운 인연과 기회를 잘 포착하고, 유연한 사고로 재산을 확장하려는 경향이 있습니다. 때로는 모험심이 강해 위험을 감수하기도 합니다.",
    strengths:
      "사교적이고 유연하며, 다양한 기회를 포착하는 능력이 뛰어납니다. 사업, 투자, 영업 등에서 두각을 나타내며, 넓은 인간관계와 적응력으로 재물을 확장할 수 있습니다.",
    weaknesses:
      "재물이나 기회에 대한 집착이 강해질 수 있고, 한 곳에 집중하지 못해 산만해질 수 있습니다. 변덕스럽거나, 무리한 모험으로 인해 손실을 볼 수 있습니다. 인간관계가 넓지만 깊이가 부족할 수 있습니다.",
    represents: {
      person: "사업가, 투자자, 영업가, 사교가, 기회주의자",
      concept: "재물, 기회, 유연함, 사교성, 사업, 확장, 모험, 변화, 적응력",
    },
    byLocation: {
      year: "편재가 연지에 있으면 집안의 재물운이 변화무쌍하고, 부모와의 인연에서 자유로운 분위기가 형성됩니다. 어린 시절부터 다양한 경험과 기회를 접할 수 있습니다.",
      month:
        "월지에 편재가 있으면 사회생활에서 사업적 감각과 사교성이 돋보입니다. 다양한 기회를 포착하고, 유연하게 대처하는 능력이 뛰어납니다.",
      day: "일지에 편재가 있으면 배우자와의 관계에서 자유분방함과 다양한 인연이 있을 수 있습니다. 결혼생활에서 변화와 모험을 추구하는 경향이 있습니다.",
      hour: "시지에 편재가 있으면 말년에 재물운이 활발하고, 자녀와의 관계에서 자유로운 분위기가 형성됩니다. 투자나 새로운 도전을 즐기는 경향이 있습니다.",
    },
    byQuantity: {
      excessive:
        "편재가 너무 많으면 재물이나 기회에 대한 집착이 심해지고, 여러 곳에 관심을 분산시켜 집중력이 떨어질 수 있습니다. 인간관계가 넓지만 깊이가 부족해질 수 있으며, 재정적으로 불안정해질 수 있습니다.",
      lacking:
        "편재가 없거나 약하면 새로운 기회를 잡는 능력이 부족하고, 재물운이 제한적일 수 있습니다. 대인관계에서 소극적이거나, 변화에 둔감해질 수 있습니다.",
    },
  },
  정관: {
    name: "정관(正官)",
    keywords: ["정관", "공직", "법", "규범", "책임", "명예", "도리"],
    summary: "정관은 사회적 규범과 질서, 책임감과 명예를 상징하는 기운입니다.",
    description:
      "정관은 '바른 관리'라는 뜻으로, 사회적 규범과 질서, 도덕적 책임, 공정함을 중시하는 기운입니다. 원칙과 법도를 지키며, 신뢰와 명예를 중요하게 생각합니다. 조직 내에서 리더십을 발휘하거나, 공직·법률·행정 등 공적인 영역에서 두각을 나타냅니다.",
    strengths:
      "책임감이 강하고, 신뢰를 받으며, 공정하고 원칙적인 태도를 유지합니다. 사회적 지위와 명예를 중시하며, 조직 내에서 리더십을 발휘할 수 있습니다.",
    weaknesses:
      "융통성이 부족하고, 지나치게 원칙에 집착하여 유연한 대처가 어려울 수 있습니다. 권위적이거나 보수적인 성향이 나타날 수 있으며, 규범에 얽매여 답답함을 느낄 수 있습니다.",
    represents: {
      person: "상사, 윗사람, 남편(여성 명조에서), 공직자",
      concept: "법, 규범, 질서, 책임, 명예, 도리, 사회적 지위, 공정성",
    },
    byLocation: {
      year: "정관이 연지에 있으면 집안의 명예와 가풍, 부모와의 인연에서 바른 기운이 강하게 나타납니다. 가정교육이 엄격하거나, 집안의 전통을 중시하는 경향이 있습니다.",
      month:
        "월지에 정관이 있으면 사회생활에서의 신뢰와 명예, 직업적 성공이 두드러집니다. 조직 내에서 인정받거나, 공직·행정 분야에서 두각을 나타낼 수 있습니다.",
      day: "일지에 정관이 있으면 배우자와의 관계에서 신뢰와 책임감이 강조됩니다. 결혼생활에서 도리와 의무를 중시하며, 배우자가 신뢰할 만한 인물일 수 있습니다.",
      hour: "시지에 정관이 있으면 말년의 명예와 사회적 지위가 안정적입니다. 자녀에게 바른 가치관을 심어주거나, 노후에 존경을 받을 수 있습니다.",
    },
    byQuantity: {
      excessive:
        "정관이 너무 많으면 융통성이 부족하고, 지나치게 원칙에 집착하여 인간관계가 경직될 수 있습니다. 권위적이거나 답답한 인상을 줄 수 있습니다.",
      lacking:
        "정관이 없거나 약하면 책임감이 부족하고, 사회적 규범이나 질서를 지키는 데 어려움을 겪을 수 있습니다. 신뢰를 얻기 어렵거나, 조직 내에서 불안정할 수 있습니다.",
    },
  },
  편관: {
    name: "편관(偏官)",
    keywords: ["편관", "도전", "경쟁", "권위", "통제", "위기", "결단"],
    summary: "편관은 도전과 경쟁, 강한 통제력과 결단력을 상징하는 기운입니다.",
    description:
      "편관은 '바르지 않은 관리'라는 뜻으로, 기존 질서에 도전하거나 경쟁을 통해 자신의 위치를 확보하려는 기운입니다. 강한 추진력과 결단력, 위기 대처 능력이 뛰어나며, 때로는 권위적이고 통제적인 성향이 나타납니다.",
    strengths:
      "도전정신이 강하고, 위기 상황에서 결단력과 추진력을 발휘합니다. 경쟁에서 우위를 점하거나, 강한 리더십으로 조직을 이끌 수 있습니다.",
    weaknesses:
      "과도한 통제욕과 공격성, 권위적인 태도로 인해 갈등이 발생할 수 있습니다. 무리한 도전이나 충동적인 결정으로 인해 위험에 처할 수 있습니다.",
    represents: {
      person: "상사, 경쟁자, 남편(여성 명조에서), 권위자",
      concept: "도전, 경쟁, 통제, 결단, 위기관리, 권위, 변화, 극복",
    },
    byLocation: {
      year: "편관이 연지에 있으면 집안의 변화나 경쟁, 부모와의 관계에서 긴장감이 있을 수 있습니다. 가정 내에서 권위적인 분위기가 형성될 수 있습니다.",
      month:
        "월지에 편관이 있으면 사회생활에서 경쟁과 도전이 두드러집니다. 직장이나 사업에서 강한 추진력과 결단력을 발휘할 수 있습니다.",
      day: "일지에 편관이 있으면 배우자와의 관계에서 긴장감이나 갈등이 있을 수 있습니다. 결혼생활에서 주도권 다툼이나 변화가 잦을 수 있습니다.",
      hour: "시지에 편관이 있으면 말년에 변화가 많고, 자녀와의 관계에서 통제나 간섭이 강해질 수 있습니다. 위기 상황에서 강한 대처 능력을 보일 수 있습니다.",
    },
    byQuantity: {
      excessive:
        "편관이 너무 많으면 공격적이고 권위적인 성향이 강해져 갈등이 잦아질 수 있습니다. 무리한 도전이나 충동적 행동으로 인해 위험에 처할 수 있습니다.",
      lacking:
        "편관이 없거나 약하면 도전정신이나 결단력이 부족하여, 위기 상황에서 소극적이거나 우유부단할 수 있습니다. 경쟁에서 밀리거나, 리더십이 약해질 수 있습니다.",
    },
  },
  정인: {
    name: "정인(正印)",
    keywords: ["정인", "모성", "보호", "지식", "지원", "이해", "배움"],
    summary: "정인은 보호와 지원, 지식과 배움을 상징하는 기운입니다.",
    description:
      "정인은 '바른 인(印)'이라는 뜻으로, 모성적 보호와 배려, 지식과 학문, 정신적 성장과 지원을 의미합니다. 타인을 이해하고 도우며, 학문적 성취와 정신적 풍요로움을 추구합니다. 어머니, 스승, 후원자와 같은 역할을 상징합니다.",
    strengths:
      "타인을 배려하고 보호하는 능력이 뛰어나며, 지식과 지혜가 풍부합니다. 학문적 성취와 정신적 성장에 유리하며, 후원자나 조력자의 도움을 받을 수 있습니다.",
    weaknesses:
      "지나친 보호욕이나 의존성, 현실 도피적 성향이 나타날 수 있습니다. 소극적이거나, 실질적 행동보다는 이론에 치우칠 수 있습니다.",
    represents: {
      person: "어머니, 스승, 후원자, 조력자",
      concept: "보호, 지원, 지식, 배움, 이해, 정신적 성장, 모성, 후원",
    },
    byLocation: {
      year: "정인이 연지에 있으면 집안의 보호와 지원, 부모(특히 어머니)와의 인연이 깊습니다. 성장 과정에서 정신적 풍요로움을 경험할 수 있습니다.",
      month:
        "월지에 정인이 있으면 사회생활에서 조력자나 후원자의 도움을 받을 수 있습니다. 학문적 성취나 교육 분야에서 두각을 나타낼 수 있습니다.",
      day: "일지에 정인이 있으면 배우자와의 관계에서 배려와 이해, 보호가 강조됩니다. 결혼생활에서 정신적 유대가 깊을 수 있습니다.",
      hour: "시지에 정인이 있으면 말년에 자녀나 후손의 도움을 받거나, 정신적 풍요로움을 누릴 수 있습니다. 노후에 학문이나 교육에 힘쓸 수 있습니다.",
    },
    byQuantity: {
      excessive:
        "정인이 너무 많으면 의존적이고 소극적인 성향이 강해질 수 있습니다. 현실 도피나 과도한 보호욕으로 인해 성장에 제약이 생길 수 있습니다.",
      lacking:
        "정인이 없거나 약하면 보호나 지원이 부족하고, 정신적·학문적 성장이 더딜 수 있습니다. 조력자의 도움을 받기 어렵거나, 외로움을 느낄 수 있습니다.",
    },
  },
  편인: {
    name: "편인(偏印)",
    keywords: ["편인", "창의성", "직관", "변화", "적응", "독창성", "영감"],
    summary: "편인은 창의성과 직관, 변화와 적응을 상징하는 기운입니다.",
    description:
      "편인은 '바르지 않은 인(印)'이라는 뜻으로, 기존의 틀을 벗어난 창의적 사고와 직관, 변화에 대한 적응력, 독창성을 의미합니다. 전통적 지식보다는 새로운 아이디어와 영감, 독특한 관점이 강조됩니다. 예술가, 발명가, 혁신가와 같은 역할을 상징합니다.",
    strengths:
      "창의적이고 독창적인 아이디어가 풍부하며, 변화에 유연하게 적응합니다. 직관이 뛰어나고, 기존의 틀을 깨는 혁신적인 성향이 있습니다.",
    weaknesses:
      "현실과 동떨어진 사고나, 변덕스러운 성향이 나타날 수 있습니다. 고독하거나, 주변과의 소통이 원활하지 않을 수 있습니다.",
    represents: {
      person: "예술가, 발명가, 혁신가, 멘토",
      concept: "창의성, 직관, 변화, 적응, 독창성, 영감, 비주류, 혁신",
    },
    byLocation: {
      year: "편인이 연지에 있으면 집안의 변화나 독특한 분위기, 부모와의 관계에서 자유로운 기운이 나타납니다. 성장 과정에서 다양한 경험을 할 수 있습니다.",
      month:
        "월지에 편인이 있으면 사회생활에서 창의적이거나 독특한 능력이 돋보입니다. 예술, 연구, 혁신 분야에서 두각을 나타낼 수 있습니다.",
      day: "일지에 편인이 있으면 배우자와의 관계에서 독특한 유대나 변화가 있을 수 있습니다. 결혼생활에서 자유로운 분위기나 색다른 경험이 많을 수 있습니다.",
      hour: "시지에 편인이 있으면 말년에 변화가 많고, 자녀와의 관계에서 창의적이거나 독특한 분위기가 형성될 수 있습니다. 노후에 예술이나 연구에 몰두할 수 있습니다.",
    },
    byQuantity: {
      excessive:
        "편인이 너무 많으면 현실과 동떨어진 사고나, 변덕스러운 성향이 강해질 수 있습니다. 고독하거나, 주변과의 소통이 어려울 수 있습니다.",
      lacking:
        "편인이 없거나 약하면 창의성이나 직관이 부족하고, 변화에 둔감해질 수 있습니다. 새로운 아이디어를 내기 어렵거나, 혁신이 더딜 수 있습니다.",
    },
  },
};
