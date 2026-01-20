// src/config/menuConfig.ts
import {
  Home,
  Zap,
  Users,
  Clock,
  Library,
  HelpCircle,
  Phone,
  BookOpen,
  Star,
} from "lucide-react";

// 메뉴 아이템의 타입 정의
export interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

// 메인 메뉴 (무료 및 주요 기능)
export const mainMenuItems: MenuItem[] = [
  { id: "manse", name: "만세력", icon: BookOpen },
  { id: "today", name: "오늘의 운세", icon: Clock },
  { id: "service", name: "운세서비스", icon: Star },
];

// 프리미엄 콘텐츠 (유료)
export const premiumMenuItems: MenuItem[] = [
  { id: "jonghap", name: "종합사주", icon: Zap },
  { id: "couple", name: "서로궁합", icon: Users },
];

// 오프라인 서비스
export const offlineMenuItems: MenuItem[] = [
  { id: "phone", name: "전화사주", icon: Phone },
];

// 보조 메뉴
export const secondaryMenuItems: MenuItem[] = [
  { id: "storage", name: "운세 보관함", icon: Library },
  { id: "inquiry", name: "문의사항", icon: HelpCircle },
];
