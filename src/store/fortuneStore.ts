// src/store/fortuneStore.ts (최종 업그레이드 버전)

import { create } from "zustand";
import type { FortuneResponseData } from "@/types/fortune";

// 1. 보관할 데이터(State)의 타입을 정의합니다.
interface FortuneState {
  fortuneResult: FortuneResponseData | null;
  isResultMode: boolean;
  resultCurrentPage: number; // ✅ 추가: 결과 페이지의 현재 페이지 번호
}

// 2. 데이터를 변경할 수 있는 행동(Actions)의 타입을 정의합니다.
interface FortuneActions {
  setFortuneResult: (result: FortuneResponseData | null) => void;
  resetFortuneResult: () => void;
  setResultCurrentPage: (page: number) => void; // ✅ 추가: 페이지 번호를 변경하는 함수
}

// 3. Zustand를 사용하여 '보관소(store)'를 만듭니다.
export const useFortuneStore = create<FortuneState & FortuneActions>((set) => ({
  // --- 초기 데이터 값 ---
  fortuneResult: null,
  isResultMode: false,
  resultCurrentPage: 1, // ✅ 추가: 초기값 1

  // --- 데이터를 변경하는 함수 구현 ---
  setFortuneResult: (result) =>
    set({
      fortuneResult: result,
      isResultMode: !!result, // 결과가 있으면 true, 없으면 false
      resultCurrentPage: 1, // ✅ 수정: 새로운 결과가 나오면 항상 1페이지로 리셋
    }),

  resetFortuneResult: () =>
    set({
      fortuneResult: null,
      isResultMode: false,
      resultCurrentPage: 1, // ✅ 수정: 모든 것을 초기 상태로 리셋
    }),

  setResultCurrentPage: (page) => set({ resultCurrentPage: page }), // ✅ 추가: 페이지 번호 변경 함수 구현
}));
