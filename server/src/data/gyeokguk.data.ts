// server/src/data/gyeokguk.data.ts
// 격국(格局) 정의 및 성패 조건

/**
 * 격국 유형 정의
 */
export interface GyeokgukType {
  name: string; // 격국명 (예: "정관격")
  code: string; // 격국 코드 (예: "JEONGGWAN")
  category: "정격" | "외잡격" | "응용격국"; // 격국 분류
  baseSipsin: string; // 기준 십성 (월지 십성)
  description: string; // 격국 설명

  // 성격 조건
  success: {
    required: string[]; // 필수 조건
    beneficial: string[]; // 유리한 조건
    avoid: string[]; // 피해야 할 조건
  };

  // 파격 요인
  破格: {
    factors: string[]; // 파격 요인들
    severity: "경미" | "중간" | "심각"; // 파격 정도
  };

  // 용신 선정
  yongsin: {
    success: string[]; // 성격 시 용신 (오행)
    failure: string[]; // 파격 시 구제용신 (오행)
    priority: number; // 우선순위 (1이 가장 높음)
  };
}

/**
 * 격국 데이터 정의
 */
export const GYEOKGUK_DATA: Record<string, GyeokgukType> = {
  // ========== 정격 (正格) ==========

  // 관성격 (官星格)
  JEONGGWAN: {
    name: "정관격",
    code: "JEONGGWAN",
    category: "정격",
    baseSipsin: "정관",
    description: "월지에 정관이 있어 관성을 위주로 하는 격국",
    success: {
      required: ["정관 투간", "일간 적당한 강도"],
      beneficial: ["정인 보조", "정재 생관"],
      avoid: ["상관 견관", "비겁 탈재", "편관 혼잡"],
    },
    破格: {
      factors: ["상관 견관", "비겁 과다", "편관 혼잡"],
      severity: "심각",
    },
    yongsin: {
      success: ["印", "財"], // 성격: 인성으로 생신, 재성으로 생관
      failure: ["印"], // 파격: 인성으로 제상관
      priority: 1,
    },
  },

  PYEONGWAN: {
    name: "편관격",
    code: "PYEONGWAN",
    category: "정격",
    baseSipsin: "편관",
    description: "월지에 편관이 있어 편관을 제어하여 쓰는 격국",
    success: {
      required: ["편관 투간", "식신/정인 제살"],
      beneficial: ["식신 제살", "정인 화살"],
      avoid: ["편관 과다", "재성 생살"],
    },
    破格: {
      factors: ["편관 과다", "제살신 부족", "재성 생살"],
      severity: "중간",
    },
    yongsin: {
      success: ["食", "印"], // 성격: 식신 제살, 인성 화살
      failure: ["食", "印"], // 파격: 제살 강화
      priority: 2,
    },
  },

  // 재성격 (財星格)
  JEONGJAE: {
    name: "정재격",
    code: "JEONGJAE",
    category: "정격",
    baseSipsin: "정재",
    description: "월지에 정재가 있어 재성을 위주로 하는 격국",
    success: {
      required: ["정재 투간", "일간 건왕"],
      beneficial: ["관성 위재", "식상 생재"],
      avoid: ["비겁 탈재", "인성 파재"],
    },
    破格: {
      factors: ["비겁 탈재", "인성 파재"],
      severity: "중간",
    },
    yongsin: {
      success: ["官", "食"], // 성격: 관성 위재, 식상 생재
      failure: ["官"], // 파격: 관성으로 제비겁
      priority: 3,
    },
  },

  PYEONGJAE: {
    name: "편재격",
    code: "PYEONGJAE",
    category: "정격",
    baseSipsin: "편재",
    description: "월지에 편재가 있어 편재를 위주로 하는 격국",
    success: {
      required: ["편재 투간", "일간 건왕"],
      beneficial: ["관성 위재", "식상 생재"],
      avoid: ["비겁 탈재", "인성 파재"],
    },
    破格: {
      factors: ["비겁 탈재", "인성 파재"],
      severity: "중간",
    },
    yongsin: {
      success: ["官", "食"], // 성격: 관성 위재, 식상 생재
      failure: ["官"], // 파격: 관성으로 제비겁
      priority: 4,
    },
  },

  // 식상격 (食傷格)
  SIKSIN: {
    name: "식신격",
    code: "SIKSIN",
    category: "정격",
    baseSipsin: "식신",
    description: "월지에 식신이 있어 식신을 위주로 하는 격국",
    success: {
      required: ["식신 투간", "재성 통관"],
      beneficial: ["재성 설기", "일간 건왕"],
      avoid: ["인성 탈식", "관성 제식"],
    },
    破格: {
      factors: ["인성 탈식", "관성 제식"],
      severity: "중간",
    },
    yongsin: {
      success: ["財"], // 성격: 재성으로 설기
      failure: ["比"], // 파격: 비겁으로 생식
      priority: 5,
    },
  },

  SANGGWAN: {
    name: "상관격",
    code: "SANGGWAN",
    category: "정격",
    baseSipsin: "상관",
    description: "월지에 상관이 있어 상관을 위주로 하는 격국",
    success: {
      required: ["상관 투간", "재성 통관"],
      beneficial: ["재성 설기", "일간 건왕"],
      avoid: ["관성 견관", "인성 탈상관"],
    },
    破格: {
      factors: ["관성 견관", "인성 탈상관"],
      severity: "심각",
    },
    yongsin: {
      success: ["財"], // 성격: 재성으로 설기
      failure: ["財"], // 파격: 재성으로 통관
      priority: 6,
    },
  },

  // 인성격 (印星格)
  JEONGIN: {
    name: "정인격",
    code: "JEONGIN",
    category: "정격",
    baseSipsin: "정인",
    description: "월지에 정인이 있어 인성을 위주로 하는 격국",
    success: {
      required: ["정인 투간", "관성 생인"],
      beneficial: ["관성 생인", "일간 약함"],
      avoid: ["재성 파인", "식상 설기"],
    },
    破格: {
      factors: ["재성 파인", "식상 과다"],
      severity: "중간",
    },
    yongsin: {
      success: ["官"], // 성격: 관성으로 생인
      failure: ["比"], // 파격: 비겁으로 생식상
      priority: 7,
    },
  },

  PYEONGIN: {
    name: "편인격",
    code: "PYEONGIN",
    category: "정격",
    baseSipsin: "편인",
    description: "월지에 편인이 있어 편인을 위주로 하는 격국",
    success: {
      required: ["편인 투간", "관성 생인"],
      beneficial: ["관성 생인", "일간 약함"],
      avoid: ["재성 파인", "식상 설기"],
    },
    破格: {
      factors: ["재성 파인", "정인 혼잡"],
      severity: "경미",
    },
    yongsin: {
      success: ["官"], // 성격: 관성으로 생인
      failure: ["比"], // 파격: 비겁으로 생식상
      priority: 8,
    },
  },

  // ========== 외잡격 (外雜格) ==========

  GEONROK: {
    name: "건록격",
    code: "GEONROK",
    category: "외잡격",
    baseSipsin: "비견",
    description: "월지에 일간의 록이 있어 일간이 건왕한 격국",
    success: {
      required: ["일간 건왕", "식상/재성/관성 활용"],
      beneficial: ["식상 설기", "재성 활용", "관성 활용"],
      avoid: ["인성 과다", "비겁 과다"],
    },
    破格: {
      factors: ["인성 과다", "비겁 중첩"],
      severity: "경미",
    },
    yongsin: {
      success: ["食", "財", "官"], // 성격: 식상, 재성, 관성 활용
      failure: ["食"], // 파격: 식상으로 설기
      priority: 9,
    },
  },

  YANGIN: {
    name: "양인격",
    code: "YANGIN",
    category: "외잡격",
    baseSipsin: "겁재",
    description: "월지에 양인이 있어 양인을 제어하여 쓰는 격국",
    success: {
      required: ["양인 제어", "관성/식상 제인"],
      beneficial: ["관성 제인", "식상 제인"],
      avoid: ["양인 과다", "인성 생인"],
    },
    破格: {
      factors: ["양인 과다", "제인신 부족"],
      severity: "심각",
    },
    yongsin: {
      success: ["官", "食"], // 성격: 관성, 식상으로 제인
      failure: ["官"], // 파격: 관성으로 제인
      priority: 10,
    },
  },

  // ========== 응용격국 (應用格局) ==========
  // 응용격국은 여기에 추가됩니다.
};

/**
 * 월지 십성에 따른 격국 매핑
 */
export const SIPSIN_TO_GYEOKGUK: Record<string, string[]> = {
  정관: ["JEONGGWAN"],
  편관: ["PYEONGWAN"],
  정재: ["JEONGJAE"],
  편재: ["PYEONGJAE"],
  식신: ["SIKSIN"],
  상관: ["SANGGWAN"],
  정인: ["JEONGIN"],
  편인: ["PYEONGIN"],
  비견: ["GEONROK"],
  겁재: ["YANGIN"],
};

/**
 * 오행별 용신 매핑 (격국용신 → 실제 천간)
 */
export const GYEOKGUK_YONGSIN_MAP: Record<string, string[]> = {
  印: ["水", "木", "火", "土", "金"], // 인성: 일간을 생하는 오행
  財: ["水", "木", "火", "土", "金"], // 재성: 일간이 극하는 오행
  官: ["水", "木", "火", "土", "金"], // 관성: 일간을 극하는 오행
  食: ["水", "木", "火", "土", "金"], // 식상: 일간이 생하는 오행
  比: ["水", "木", "火", "土", "金"], // 비겁: 일간과 같은 오행
};
