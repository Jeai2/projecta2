// src/data/interpretation/sipsin.ts
// 각 십성에 대한 키워드 및 기본 해석 데이터

export const SIPSIN_KEYWORDS: { [key: string]: { positive: string; negative: string } } = {
    '비견': { positive: '자립심, 주체성, 동료애', negative: '고집, 경쟁심, 분리' },
    '겁재': { positive: '추진력, 대담함, 경쟁에서의 승리', negative: '재물 손실, 배신, 질투' },
    '식신': { positive: '안정적인 의식주, 표현력, 창의력', negative: '게으름, 유흥, 건강 문제' },
    '상관': { positive: '총명함, 비판적 사고, 혁신', negative: '구설수, 오만함, 조직과의 마찰' },
    '정재': { positive: '안정적인 재물, 성실함, 신용', negative: '답답함, 인색함, 안주' },
    '편재': { positive: '큰 재물, 활동성, 비즈니스 감각', negative: '낭비, 불안정성, 투기' },
    '정관': { positive: '명예, 책임감, 안정적인 직장', negative: '보수적, 원칙주의, 스트레스' },
    '편관': { positive: '카리스마, 권력, 위기 돌파', negative: '사고, 질병, 극단적인 성향' },
    '정인': { positive: '학문, 지혜, 자비심, 안정', negative: '게으름, 의존성, 마마보이' },
    '편인': { positive: '순발력, 예능, 전문 기술', negative: '변덕, 외로움, 사기' },
};