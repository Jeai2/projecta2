import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
}

interface AuthActions {
  setLoggedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (value) => set({ isLoggedIn: value }),
    }),
    {
      name: "auth",
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
