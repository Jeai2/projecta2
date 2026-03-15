// src/pages/LoginPage.tsx
// 로그인 페이지 (임시 계정으로 테스트, 인증 API 연동은 추후)

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

// 개발/테스트용 임시 계정 (실서비스 전 제거)
const TEMP_CREDENTIALS = { id: "test", password: "1234" };

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { setLoggedIn } = useAuthStore();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (id === TEMP_CREDENTIALS.id && password === TEMP_CREDENTIALS.password) {
      setLoggedIn(true);
      onNavigate("home");
    } else {
      setError("아이디 또는 비밀번호가 맞지 않습니다.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-light">로그인</h1>
        <p className="text-sm text-text-muted mt-2">
          사주로그에 오신 것을 환영합니다
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light mb-1.5">
            이메일 또는 아이디
          </label>
          <input
            id="email"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="이메일 또는 아이디 입력"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-light mb-1.5">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-accent-gold px-4 py-3 text-sm font-semibold text-white hover:bg-accent-gold/90 transition disabled:opacity-50"
        >
          로그인
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        테스트 계정: {TEMP_CREDENTIALS.id} / {TEMP_CREDENTIALS.password}
      </p>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-sm text-text-muted hover:text-accent-gold transition"
        >
          ← 메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
