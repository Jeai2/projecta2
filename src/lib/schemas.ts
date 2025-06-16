// src/lib/schemas.ts

import * as z from "zod";

// 여러 폼에서 재사용될 기본 사용자 정보 규칙
export const userInfoSchema = z.object({
  gender: z.string(),
  calendarType: z.string(),
  birthYear: z.string({
    required_error: "생년을 선택해주세요.",
  }),
  birthMonth: z.string({
    required_error: "생월을 선택해주세요.",
  }),
  birthDay: z.string({
    required_error: "생일을 선택해주세요.",
  }),
  birthTime: z.string().optional(),
});

// Zod 스키마로부터 TypeScript 타입을 자동으로 생성
export type UserInfoSchema = z.infer<typeof userInfoSchema>;