// src/config/menuConfig.ts
import {
  Clock,
  Library,
  HelpCircle,
  Phone,
  BookOpen,
  Star,
  MessageCircle,
  User,
} from "lucide-react";

// 메뉴 아이템의 타입 정의
export interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

// 메인 메뉴 (무료 및 주요 기능)
export const mainMenuItems: MenuItem[] = [
  { id: "ai-consult", name: "AI상담", icon: MessageCircle },
  { id: "manse", name: "만세력", icon: BookOpen },
  { id: "today", name: "오늘의 운세", icon: Clock },
  { id: "service", name: "운세서비스", icon: Star },
  { id: "profile", name: "마이페이지", icon: User },
];

// 프리미엄 콘텐츠 (유료) — 헤더에는 미표시, 운세서비스/홈 카드 등에서 접근
export const premiumMenuItems: MenuItem[] = [];

// 오프라인 서비스
export const offlineMenuItems: MenuItem[] = [
  { id: "phone", name: "전화사주", icon: Phone },
];

// 보조 메뉴
export const secondaryMenuItems: MenuItem[] = [
  { id: "storage", name: "운세 보관함", icon: Library },
  { id: "inquiry", name: "문의사항", icon: HelpCircle },
];
