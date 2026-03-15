// src/pages/ProfilePage.tsx
// 프로필 페이지 — 사주 명함 스타일

import { useState } from "react";
import { LogOut, MessageCircle, BookOpen, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

type TabId = "info" | "security" | "account";

// 임시 사용자 데이터 (API 연동 전)
const MOCK_USER = {
  name: "홍길동",
  email: "hgd@example.com",
  initial: "홍",
  joinedAt: "2025.01",
  consultCount: 12,
  savedCount: 5,
};

const TABS: { id: TabId; label: string }[] = [
  { id: "info", label: "기본 정보" },
  { id: "security", label: "보안" },
  { id: "account", label: "계정" },
];

export const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
  const { setLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>("info");

  const handleLogout = () => {
    setLoggedIn(false);
    onNavigate("home");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">

      {/* ── 사주 명함 Hero ── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        {/* 상단 골드 장식 라인 */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

        <div className="px-6 py-8 sm:px-10">
          {/* 아바타 + 이름 + 이메일 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* 원형 아바타 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-accent-gold/10 border-2 border-accent-gold/40 flex items-center justify-center">
                <span className="font-myeongjo text-2xl font-bold text-accent-gold">
                  {MOCK_USER.initial}
                </span>
              </div>
              {/* 온라인 도트 */}
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            {/* 이름 + 이메일 */}
            <div className="text-center sm:text-left">
              <h1 className="font-myeongjo text-2xl font-bold text-text-light">
                {MOCK_USER.name}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">{MOCK_USER.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-accent-gold/10 text-xs font-medium text-accent-gold">
                일반 회원
              </span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="my-6 border-t border-gray-100" />

          {/* 통계 3종 */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-lg font-bold text-text-light">{MOCK_USER.consultCount}</span>
              <span className="text-xs text-text-muted">AI 상담</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-lg font-bold text-text-light">{MOCK_USER.savedCount}</span>
              <span className="text-xs text-text-muted">저장된 운세</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm font-bold text-text-light">{MOCK_USER.joinedAt}</span>
              <span className="text-xs text-text-muted">가입일</span>
            </div>
          </div>
        </div>

        {/* 하단 골드 장식 라인 */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      </div>

      {/* ── 탭 ── */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-text-light"
                : "text-text-muted hover:text-text-light"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── 탭 콘텐츠 ── */}
      {activeTab === "info" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-myeongjo text-base font-bold text-text-light mb-0.5">기본 정보</h2>
            <p className="text-xs text-text-muted">이름과 이메일을 변경할 수 있습니다.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-text-light">
              이름
            </label>
            <input
              id="name"
              type="text"
              defaultValue={MOCK_USER.name}
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-text-light">
              이메일
            </label>
            <input
              id="email"
              type="email"
              defaultValue={MOCK_USER.email}
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition"
            />
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition active:scale-[0.98]"
          >
            저장하기
          </button>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-myeongjo text-base font-bold text-text-light mb-0.5">비밀번호 변경</h2>
            <p className="text-xs text-text-muted">주기적인 비밀번호 변경으로 계정을 보호하세요.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="current-password" className="block text-sm font-medium text-text-light">
              현재 비밀번호
            </label>
            <input
              id="current-password"
              type="password"
              placeholder="현재 비밀번호 입력"
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="block text-sm font-medium text-text-light">
              새 비밀번호
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="새 비밀번호 입력"
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-text-light">
              새 비밀번호 확인
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="새 비밀번호 재입력"
              className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition"
            />
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition active:scale-[0.98]"
          >
            비밀번호 변경
          </button>
        </div>
      )}

      {activeTab === "account" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-myeongjo text-base font-bold text-text-light mb-0.5">계정 관리</h2>
            <p className="text-xs text-text-muted">로그아웃 및 계정 관련 설정입니다.</p>
          </div>

          {/* 로그아웃 */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100">
            <div>
              <p className="text-sm font-medium text-text-light">로그아웃</p>
              <p className="text-xs text-text-muted mt-0.5">로그아웃 후 홈 화면으로 이동합니다.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm text-text-muted hover:border-red-200 hover:text-red-500 transition"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>

          {/* 회원 탈퇴 (비활성 - 추후 구현) */}
          <div className="flex items-center justify-between py-2 opacity-40 cursor-not-allowed">
            <div>
              <p className="text-sm font-medium text-text-light">회원 탈퇴</p>
              <p className="text-xs text-text-muted mt-0.5">계정 및 모든 데이터가 삭제됩니다.</p>
            </div>
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-text-muted"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
