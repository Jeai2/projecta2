// src/components/chat/MookAChat.tsx
// AI 상담 채팅 — 모던 UI 리디자인

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ArrowUp, Plus, X, Scroll, BookOpen } from "lucide-react";
import {
  getCharacterProfile,
  type CharacterId,
} from "@/config/characterProfiles";
import { useFortuneStore } from "@/store/fortuneStore";
import type { FortuneResponseData, PillarData } from "@/types/fortune";

// ─── 타입 ────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Attachment {
  label: string;
  content: string;
}

// ─── 첨부 컨텐츠 포매터 ─────────────────────────────────────
const pillarLine = (title: string, d: PillarData) => {
  const sipsin =
    [d.ganSipsin, d.jiSipsin].filter(Boolean).join("/") || "일간";
  return `${title}: ${d.gan}(${d.ganOhaeng}) ${d.ji}(${d.jiOhaeng})  [${sipsin}]`;
};

const formatMingshik = (r: FortuneResponseData): string => {
  const { pillars } = r.saju.sajuData;
  const nameLine = r.userInfo.name ? `이름: ${r.userInfo.name}\n` : "";
  return [
    "[사주 명식 첨부]",
    nameLine +
      [
        pillarLine("시주", pillars.hour),
        pillarLine("일주", pillars.day),
        pillarLine("월주", pillars.month),
        pillarLine("년주", pillars.year),
      ].join("\n"),
  ].join("\n");
};

const formatInterpretation = (r: FortuneResponseData): string => {
  const { interpretation } = r.saju;
  const base = interpretation.dayMasterNature.base.slice(0, 180);
  const sipsin = interpretation.sipsinAnalysis.slice(0, 180);
  return [
    "[해석 결과 첨부]",
    `일간 기질: ${base}…`,
    `십신 분석: ${sipsin}…`,
  ].join("\n\n");
};

// ─── 환영 메시지 ─────────────────────────────────────────────
const WELCOME: Record<CharacterId, string> = {
  seoho: "서호입니다. 무엇이든 편하게 물어보세요.",
  yunha: "운하예요. 궁금한 점 있으면 말해 주세요.",
  yadeung: "야등입니다. 운세나 사주, 궁금한 걸 물어보세요.",
};

// ─── Props ───────────────────────────────────────────────────
interface MookAChatProps {
  className?: string;
  selectedCharacter: CharacterId;
}

// ─── 컴포넌트 ────────────────────────────────────────────────
export function MookAChat({ className = "", selectedCharacter }: MookAChatProps) {
  const { fortuneResult } = useFortuneStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME[selectedCharacter] },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [plusOpen, setPlusOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const profile = getCharacterProfile(selectedCharacter);
  const characterName = profile?.name ?? "선생님";
  const avatarSrc = profile?.chatImage ?? profile?.image ?? "/yadung.jpg";

  // 캐릭터 변경 시 리셋
  useEffect(() => {
    setMessages([
      { id: "welcome", role: "assistant", content: WELCOME[selectedCharacter] },
    ]);
    setAttachment(null);
    setInput("");
  }, [selectedCharacter]);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // textarea 자동 높이
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  // ─── 전송 ────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const fullContent = attachment
      ? `${attachment.content}\n\n${trimmed}`
      : trimmed;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed, // 화면에는 첨부 내용 없이 표시
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setIsLoading(true);

    try {
      const res = await axios.post<{ error?: boolean; reply?: string; message?: string }>(
        "/api/fortune/mook-a",
        { message: fullContent, teacher: selectedCharacter }
      );

      const reply =
        res.data.error || !res.data.reply
          ? res.data.message ?? "잠시 후 다시 시도해 주세요."
          : res.data.reply;

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "잠시 후 다시 시도해 주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── + 메뉴 옵션 ────────────────────────────────────────
  const attachMingshik = () => {
    if (!fortuneResult) return;
    setAttachment({ label: "사주 명식", content: formatMingshik(fortuneResult) });
    setPlusOpen(false);
    textareaRef.current?.focus();
  };

  const attachInterpretation = () => {
    if (!fortuneResult) return;
    setAttachment({
      label: "해석 결과",
      content: formatInterpretation(fortuneResult),
    });
    setPlusOpen(false);
    textareaRef.current?.focus();
  };

  const hasFortune = !!fortuneResult;

  // ─── 렌더 ────────────────────────────────────────────────
  return (
    <div className={`flex flex-col ${className}`}>

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-5 space-y-5 min-h-[280px] max-h-[calc(100vh-300px)]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* 아바타 */}
            {msg.role === "assistant" ? (
              <img
                src={avatarSrc}
                alt={characterName}
                className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}

            {/* 말풍선 */}
            <div
              className={`max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm px-4 py-2.5"
                  : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-2xl rounded-tl-sm px-4 py-2.5"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* 로딩 점 */}
        {isLoading && (
          <div className="flex items-end gap-2.5 flex-row">
            <img
              src={avatarSrc}
              alt={characterName}
              className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0 shadow-sm"
            />
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 첨부 칩 */}
      {attachment && (
        <div className="px-1 pb-2">
          <span className="inline-flex items-center gap-1.5 bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-medium px-3 py-1.5 rounded-full">
            <Scroll className="w-3 h-3" />
            {attachment.label} 첨부됨
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="ml-0.5 hover:text-accent-gold/60 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* 입력 바 */}
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100 transition">

          {/* + 버튼 */}
          <div className="relative flex-shrink-0 self-end mb-0.5">
            {/* 백드롭 */}
            {plusOpen && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setPlusOpen(false)}
              />
            )}

            <button
              type="button"
              onClick={() => setPlusOpen((v) => !v)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
                plusOpen
                  ? "border-gray-400 text-gray-700 bg-gray-100"
                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }`}
              aria-label="컨텍스트 첨부"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* + 팝업 메뉴 */}
            {plusOpen && (
              <div className="absolute bottom-full left-0 mb-2 z-20 w-52 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
                <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold text-text-subtle uppercase tracking-wide">
                  첨부하기
                </p>
                <button
                  type="button"
                  onClick={attachMingshik}
                  disabled={!hasFortune}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-light hover:bg-gray-50 transition disabled:opacity-35 disabled:pointer-events-none"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Scroll className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[13px]">명식 불러오기</p>
                    <p className="text-[11px] text-text-subtle">사주 4기둥 정보</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={attachInterpretation}
                  disabled={!hasFortune}
                  className="w-full flex items-center gap-3 px-3 py-2.5 mb-1 text-sm text-text-light hover:bg-gray-50 transition disabled:opacity-35 disabled:pointer-events-none"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[13px]">해석 결과 불러오기</p>
                    <p className="text-[11px] text-text-subtle">일간 · 십신 요약</p>
                  </div>
                </button>
                {!hasFortune && (
                  <p className="px-3 pb-2.5 text-[11px] text-text-subtle">
                    종합사주 결과가 있을 때 사용 가능
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 텍스트 입력 */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${characterName}에게 물어보세요…`}
            disabled={isLoading}
            className="flex-1 min-w-0 resize-none bg-transparent text-gray-800 placeholder:text-gray-400 text-sm focus:outline-none disabled:opacity-50 leading-relaxed self-center"
            style={{ maxHeight: "120px" }}
          />

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 self-end mb-0.5 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="전송"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[11px] text-text-subtle mt-2">
          Enter 전송 · Shift+Enter 줄바꿈
        </p>
      </form>
    </div>
  );
}
