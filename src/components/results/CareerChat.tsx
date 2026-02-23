// src/components/results/CareerChat.tsx
// 추천 직업 질의용 채팅 UI

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CareerChatContext {
  name?: string;
  energyType?: string;
  energyDescription?: string;
  keywords?: string[];
  pillarsSummary?: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
  };
  archetype?: { scores: Record<string, number>; timeUnknown?: boolean };
  jobItems?: { title: string; professions: string }[];
  jobLegacyMale?: {
    label: string;
    careerTitle: string;
    careerDescription: string;
  } | null;
  jobLegacyFemale?: {
    label: string;
    careerTitle: string;
    careerDescription: string;
  } | null;
  successTip?: string;
}

interface CareerChatProps {
  className?: string;
  /** 진로 분석 결과 컨텍스트 (AI 답변용) */
  context?: CareerChatContext;
  /** 커스텀 onSend 사용 시 (context 무시) */
  onSend?: (message: string) => void | Promise<string | void>;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "궁금한 점을 물어봐. (예: '나에게 왜 이 직업들이 추천되었나요?')",
  timestamp: new Date(),
};

export function CareerChat({
  className = "",
  context,
  onSend,
}: CareerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let reply: string | void;
      if (onSend) {
        reply = await onSend(text);
      } else if (context) {
        const res = await axios.post<{
          error?: boolean;
          reply?: string;
          message?: string;
        }>("/api/fortune/career-chat", { message: text, context });
        if (res.data.error || !res.data.reply) {
          reply = res.data.message ?? "잠시 후 다시 시도해 주세요.";
        } else {
          reply = res.data.reply;
        }
      } else {
        reply = "AI 연동 준비 중입니다. 곧 더 정확한 답변을 드리겠습니다.";
      }
      if (typeof reply === "string") {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
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

  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 ${className}`}
    >
      <div
        ref={scrollRef}
        className="flex-1 min-h-[200px] max-h-[360px] overflow-y-auto p-4 space-y-5"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* 프로필 아바타 */}
            {msg.role === "assistant" ? (
              <img
                src="/yadung.jpg"
                alt="야등이"
                className="flex-shrink-0 w-8 h-8 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            {/* 말풍선 */}
            <div
              className={`flex flex-col gap-1 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-gray-400 px-1">
                {msg.role === "assistant" ? "야등이" : "나"}
              </span>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-slate-700 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2.5 flex-row">
            <img
              src="/yadung.jpg"
              alt="진로 AI"
              className="flex-shrink-0 w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <div className="flex flex-col gap-1 items-start">
              <span className="text-xs text-gray-400 px-1">진로 AI</span>
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white border border-gray-200 shadow-sm">
                <span className="inline-flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
