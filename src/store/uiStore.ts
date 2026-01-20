import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isExpertMode: boolean;
}

interface UiActions {
  setExpertMode: (next: boolean) => void;
  toggleExpertMode: () => void;
}

export const useUiStore = create<UiState & UiActions>()(
  persist(
    (set) => ({
      isExpertMode: false,
      setExpertMode: (next) => set({ isExpertMode: next }),
      toggleExpertMode: () =>
        set((state) => ({ isExpertMode: !state.isExpertMode })),
    }),
    {
      name: "ui-mode",
      partialize: (state) => ({ isExpertMode: state.isExpertMode }),
    }
  )
);
