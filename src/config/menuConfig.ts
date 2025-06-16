// src/config/menuConfig.ts
import { Home, Zap, Users, Clock, Library, HelpCircle } from "lucide-react";

// 메뉴 아이템의 타입 정의
export interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

// 메인 메뉴 데이터
export const mainMenuItems: MenuItem[] = [
  { id: "home", name: "홈", icon: Home },
  { id: "jonghap", name: "종합사주", icon: Zap },
  { id: "sinnyeon", name: "신년운세", icon: Zap },
  { id: "couple", name: "서로궁합", icon: Users },
  { id: "today", name: "오늘의 운세", icon: Clock },
];

// 보조 메뉴 데이터
export const secondaryMenuItems: MenuItem[] = [
  { id: "storage", name: "운세 보관함", icon: Library },
  { id: "inquiry", name: "문의사항", icon: HelpCircle },
];
