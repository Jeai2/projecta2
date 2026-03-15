// src/pages/AIConsultPage.tsx
// AI 상담 - 캐릭터 선택 페이지 → 채팅 페이지 (슬라이드 전환)

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  CHARACTER_PROFILES,
  getCharacterProfile,
  type CharacterId,
} from "@/config/characterProfiles";
import { MookAChat } from "@/components/chat/MookAChat";

interface AIConsultPageProps {
  initialCharacter?: CharacterId;
}

const AIConsultPage = ({ initialCharacter }: AIConsultPageProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(initialCharacter ?? null);
  const [view, setView] = useState<"select" | "chat">(initialCharacter ? "chat" : "select");

  const profile = selectedCharacter ? getCharacterProfile(selectedCharacter) : null;

  const handleStartChat = () => {
    if (!selectedCharacter) return;
    setView("chat");
  };

  const handleBack = () => {
    setView("select");
  };

  return (
    <div className="w-full overflow-hidden">
      {/* 슬라이드 컨테이너 — 200% 너비, 좌우 패널 각 50% */}
      <div
        className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
          view === "chat" ? "-translate-x-1/2" : "translate-x-0"
        }`}
      >
        {/* ── 패널 1: 캐릭터 선택 ── */}
        <div className="w-1/2 min-h-screen">
          <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <h1 className="text-xl font-bold text-gray-900 mb-1">AI 상담</h1>
            <p className="text-sm text-gray-500 mb-8">대화할 상담사를 선택해 주세요</p>

            {/* 캐릭터 카드 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
              {CHARACTER_PROFILES.map((char) => {
                const isSelected = selectedCharacter === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharacter(char.id)}
                    className={`flex flex-col rounded-2xl border-2 transition-all duration-200 overflow-hidden group ${
                      isSelected
                        ? "border-accent-gold shadow-lg scale-[1.02]"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    {/* 전신 이미지 */}
                    <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden">
                      <img
                        src={char.image ?? "/yadung.jpg"}
                        alt={char.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {/* 이름 + 태그라인 */}
                    <div
                      className={`px-3 py-2.5 text-center transition-colors duration-200 ${
                        isSelected ? "bg-accent-gold/8" : "bg-white"
                      }`}
                    >
                      <span className="block font-semibold text-gray-900 text-sm">
                        {char.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2 leading-tight">
                        {char.tagline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 선택된 캐릭터 프로필 */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                profile ? "max-h-48 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"
              }`}
            >
              {profile && (
                <div className="p-4 rounded-2xl border border-gray-200 bg-white/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-gray-900">{profile.name}</h3>
                    <span className="text-xs text-accent-gold/90 font-medium">{profile.tagline}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {profile.personality}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-accent-gold/10 px-2.5 py-0.5 text-xs font-medium text-accent-gold">
                      {profile.specialty}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 상담 시작 버튼 */}
            <button
              type="button"
              onClick={handleStartChat}
              disabled={!selectedCharacter}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]"
            >
              {selectedCharacter
                ? `${profile?.name}과 상담 시작하기`
                : "상담사를 선택해 주세요"}
            </button>
          </div>
        </div>

        {/* ── 패널 2: 채팅 ── */}
        <div className="w-1/2 min-h-screen flex flex-col">
          {selectedCharacter && (
            <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col flex-1">
              {/* 채팅 헤더 */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
                  aria-label="뒤로가기"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={profile?.chatImage ?? profile?.image ?? "/yadung.jpg"}
                    alt={profile?.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{profile?.name}</p>
                  <p className="text-xs text-gray-500">{profile?.tagline}</p>
                </div>
              </div>

              {/* 채팅 */}
              <div className="flex-1">
                <MookAChat className="w-full" selectedCharacter={selectedCharacter} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConsultPage;
