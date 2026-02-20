// server/src/services/career-chat.service.ts
// 추천 직업 관련 AI 챗봇 — Gemini 연동

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CareerChatContext {
  name?: string;
  energyType?: string;
  energyDescription?: string;
  keywords?: string[];
  pillarsSummary?: { year: string; month: string; day: string; hour: string | null };
  archetype?: { scores: Record<string, number>; timeUnknown?: boolean };
  jobItems?: { title: string; professions: string }[];
  jobLegacyMale?: { label: string; careerTitle: string; careerDescription: string } | null;
  jobLegacyFemale?: { label: string; careerTitle: string; careerDescription: string } | null;
  successTip?: string;
}

/**
 * 사용자 메시지 + 진로 컨텍스트로 Gemini에 질의
 */
export async function getCareerChatReply(
  message: string,
  context: CareerChatContext
): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("[CareerChat] GEMINI_API_KEY is not configured.");
    return "AI 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.";
  }

  const contextText = buildContextText(context);

  const systemPrompt = `당신은 사주 명리학과 진로·직업 분석에 조예가 깊은 상담사입니다.
사용자의 진로 분석 결과(사주 기반)를 바탕으로 질문에 친절하고 구체적으로 답변합니다.
한국어로 답변하며, 2~4문단 정도로 간결하고 이해하기 쉽게 작성합니다.
사주 용어를 쓸 때는 초보자도 이해할 수 있도록 풀어서 설명합니다.`;

  const userPrompt = `[진로 분석 결과]
${contextText}

[사용자 질문]
${message}

위 분석 결과를 바탕으로 사용자 질문에 답변해 주세요.`;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    return text?.trim() || "답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("[CareerChat] Gemini API error:", error);
    return "잠시 후 다시 시도해 주세요.";
  }
}

function buildContextText(ctx: CareerChatContext): string {
  const parts: string[] = [];

  if (ctx.name) parts.push(`이름: ${ctx.name}`);
  if (ctx.energyType) parts.push(`에너지 타입: ${ctx.energyType}`);
  if (ctx.energyDescription) parts.push(`에너지 설명: ${ctx.energyDescription}`);
  if (ctx.keywords?.length) parts.push(`키워드: ${ctx.keywords.join(", ")}`);
  if (ctx.pillarsSummary) {
    const { year, month, day, hour } = ctx.pillarsSummary;
    parts.push(`사주: 년 ${year} 월 ${month} 일 ${day} 시 ${hour ?? "미입력"}`);
  }
  if (ctx.archetype?.scores) {
    const scores = ctx.archetype.scores;
    const labels: Record<string, string> = {
      R: "실천", I: "탐구", A: "감성", S: "조화", E: "추진", C: "조직",
    };
    const sorted = Object.entries(scores)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .map(([k, v]) => `${labels[k] ?? k} ${Math.round(v ?? 0)}점`)
      .join(", ");
    parts.push(`아키타입6: ${sorted}${ctx.archetype.timeUnknown ? " (시주 미입력 참고)" : ""}`);
  }
  if (ctx.jobItems?.length) {
    const list = ctx.jobItems
      .map((j) => `- ${j.title}: ${j.professions}`)
      .join("\n");
    parts.push(`추천 직업:\n${list}`);
  }
  if (ctx.jobLegacyMale?.careerTitle)
    parts.push(`전승(남): ${ctx.jobLegacyMale.careerTitle} - ${ctx.jobLegacyMale.careerDescription}`);
  if (ctx.jobLegacyFemale?.careerTitle)
    parts.push(`전승(여): ${ctx.jobLegacyFemale.careerTitle} - ${ctx.jobLegacyFemale.careerDescription}`);
  if (ctx.successTip) parts.push(`성공 팁: ${ctx.successTip}`);

  return parts.join("\n");
}
