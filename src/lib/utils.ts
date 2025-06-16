import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 여러 개의 className 문자열을 받아서, 중복되거나 충돌하는 Tailwind 클래스를
// 지능적으로 병합해주는 유틸리티 함수.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
