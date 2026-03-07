// src/components/chat/MookAChat.tsx
// AI 상담 - 서호/윤하/야등이 선생님 선택 챗봇 UI (묵설은 메신저 전용)

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, ChevronDown, User } from "lucide-react";

export type TeacherId = "seoho" | "yunha" | "yadeung";

const TEACHERS: { id: TeacherId; name: string }[] = [
  { id: "seoho", name: "서호" },
  { id: "yunha", name: "윤하" },
  { id: "yadeung", name: "야등이" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_BY_TEACHER: Record<TeacherId, string> = {
  seoho: "서호입니다. 무엇이든 편하게 물어보세요.",
  yunha: "윤하예요. 궁금한 점 있으면 말해 주세요.",
  yadeung: "야등이입니다. 운세나 사주, 궁금한 걸 물어보세요.",
};

const getInitialMessage = (teacherId: TeacherId): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  content: WELCOME_BY_TEACHER[teacherId],
  timestamp: new Date(),
});

const QUICK_PROMPTS = [
  { label: "오늘의 운세", prompt: "오늘의 운세 알려줘" },
  { label: "사주 풀이", prompt: "사주 풀이 해줘" },
  { label: "직업 추천", prompt: "나에게 맞는 직업 추천해줘" },
  { label: "궁합 보기", prompt: "궁합에 대해 알려줘" },
  { label: "일상 고민", prompt: "요즘 고민이 있어" },
];

export function MookAChat({ className = "" }: { className?: string }) {
  const [teacher, setTeacher] = useState<TeacherId>("yadeung");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "welcome", role: "assistant", content: WELCOME_BY_TEACHER.yadeung, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTeacherDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUserMessages = messages.some((m) => m.role === "user");
  const isEmptyState = !hasUserMessages;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post<{
        error?: boolean;
        reply?: string;
        message?: string;
      }>("/api/fortune/mook-a", { message: trimmed, teacher });

      const reply =
        res.data.error || !res.data.reply
          ? res.data.message ?? "잠시 후 다시 시도해 주세요."
          : res.data.reply;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "잠시 후 다시 시도해 주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const InputBar = () => (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-gray-300/50 focus-within:border-gray-300">
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setTeacherDropdownOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition"
          >
            <User className="w-4 h-4" />
            <span>선생님 교체</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {teacherDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 py-1 rounded-lg border border-gray-200 bg-white shadow-lg z-10 min-w-[120px]">
              {TEACHERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTeacher(t.id);
                    setTeacherDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${teacher === t.id ? "bg-gray-100 font-medium" : ""}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요"
          disabled={isLoading}
          className="flex-1 min-w-0 bg-transparent text-gray-800 placeholder:text-gray-400 text-sm focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="전송"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {/* 채팅 모드: 메시지 영역 + 하단 입력 */}
      {!isEmptyState && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-[320px] max-h-[calc(100vh-320px)] overflow-y-auto py-6 space-y-6"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" ? (
                <img
                  src="/yadung.jpg"
                  alt={TEACHERS.find((t) => t.id === teacher)?.name ?? "선생님"}
                  className="flex-shrink-0 w-9 h-9 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-gray-800 text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 flex-row">
              <img
                src="/yadung.jpg"
                alt={TEACHERS.find((t) => t.id === teacher)?.name ?? "선생님"}
                className="flex-shrink-0 w-9 h-9 rounded-full object-cover shadow-sm"
              />
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-gray-200 shadow-sm">
                <span className="inline-flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 빈 상태: 중앙 입력 + 추천 프롬프트 그리드 */}
      {isEmptyState && (
        <div className="flex flex-col items-center py-8 sm:py-12">
          <div className="w-full max-w-2xl space-y-8">
            <InputBar />

            <div>
              <p className="text-sm font-medium text-gray-500 mb-3 px-1">
                추천 질문
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickPrompt(item.prompt)}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50 text-left"
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 채팅 모드: 하단 고정 입력 */}
      {!isEmptyState && (
        <div className="pt-4 pb-2">
          <InputBar />
        </div>
      )}
    </div>
  );
}
