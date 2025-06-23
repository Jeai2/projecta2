// server/src/data/jijanggan.ts
// 12 지지(地支)에 포함된 지장간(支藏干)과 월률(사령일수) 데이터를 정의합니다.

// 지장간 하나하나의 내용 (천간 + 담당 일수)
interface JijangganContent {
  gan: string; // 해당 천간
  days: number; // 담당하는 일수 (월률)
}

// 각 지지가 가지는 지장간 전체의 구조
interface JijangganElement {
  초기: JijangganContent;
  중기?: JijangganContent;
  정기: JijangganContent;
}

// 지장간 데이터를 담는 객체
export const JIJANGGAN_DATA: { [key: string]: JijangganElement } = {
  // 봄 (Spring)
  인: {
    초기: { gan: "무", days: 7 },
    중기: { gan: "병", days: 7 },
    정기: { gan: "갑", days: 16 },
  },
  묘: {
    초기: { gan: "갑", days: 10 },
    정기: { gan: "을", days: 20 },
  },
  진: {
    초기: { gan: "을", days: 9 },
    중기: { gan: "계", days: 3 },
    정기: { gan: "무", days: 18 },
  },

  // 여름 (Summer)
  사: {
    초기: { gan: "무", days: 7 },
    중기: { gan: "경", days: 7 },
    정기: { gan: "병", days: 16 },
  },
  오: {
    초기: { gan: "병", days: 10 },
    중기: { gan: "기", days: 9 },
    정기: { gan: "정", days: 11 },
  },
  미: {
    초기: { gan: "정", days: 9 },
    중기: { gan: "을", days: 3 },
    정기: { gan: "기", days: 18 },
  },

  // 가을 (Autumn)
  신: {
    초기: { gan: "무", days: 7 },
    중기: { gan: "임", days: 7 },
    정기: { gan: "경", days: 16 },
  },
  유: {
    초기: { gan: "경", days: 10 },
    정기: { gan: "신", days: 20 },
  },
  술: {
    초기: { gan: "신", days: 9 },
    중기: { gan: "정", days: 3 },
    정기: { gan: "무", days: 18 },
  },

  // 겨울 (Winter)
  해: {
    초기: { gan: "무", days: 7 },
    중기: { gan: "갑", days: 7 },
    정기: { gan: "임", days: 16 },
  },
  자: {
    초기: { gan: "임", days: 10 },
    정기: { gan: "계", days: 20 },
  },
  축: {
    초기: { gan: "계", days: 9 },
    중기: { gan: "신", days: 3 },
    정기: { gan: "기", days: 18 },
  },
};
