import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 여러 개의 className 문자열을 받아서, 중복되거나 충돌하는 Tailwind 클래스를
// 지능적으로 병합해주는 유틸리티 함수.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleToKey(title: string): "year" | "month" | "day" | "hour" {
  switch (title) {
    case "년주":
      return "year";
    case "월주":
      return "month";
    case "일주":
      return "day";
    case "시주":
      return "hour";
    default:
      throw new Error(`Invalid title: ${title}`);
  }
}

export function keyToTitle(key: "year" | "month" | "day" | "hour"): string {
  switch (key) {
    case "year":
      return "년주";
    case "month":
      return "월주";
    case "day":
      return "일주";
    case "hour":
      return "시주";
  }
}
