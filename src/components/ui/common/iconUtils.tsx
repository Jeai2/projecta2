import React from "react";
import { GanDisplay } from "./GanDisplay"; // ✅ 분리된 GanDisplay 컴포넌트를 import
import type { IconProps } from "./Icons"; // ✅ 타입만 import

// 동물 아이콘 컴포넌트 모음 (여기서 직접 정의)
const AnimalIcons = {
  Mouse: ({ className }: IconProps) => <span className={className}>🐭</span>,
  Cow: ({ className }: IconProps) => <span className={className}>🐮</span>,
  Tiger: ({ className }: IconProps) => <span className={className}>🐯</span>,
  Rabbit: ({ className }: IconProps) => <span className={className}>🐰</span>,
  Dragon: ({ className }: IconProps) => <span className={className}>🐲</span>,
  Snake: ({ className }: IconProps) => <span className={className}>🐍</span>,
  Horse: ({ className }: IconProps) => <span className={className}>🐴</span>,
  Sheep: ({ className }: IconProps) => <span className={className}>🐑</span>,
  Monkey: ({ className }: IconProps) => <span className={className}>🐵</span>,
  Rooster: ({ className }: IconProps) => <span className={className}>🐔</span>,
  Dog: ({ className }: IconProps) => <span className={className}>🐶</span>,
  Pig: ({ className }: IconProps) => <span className={className}>🐷</span>,
};

// 천간과 지지를 모두 포함하는 최종 아이콘 맵
export const CHARACTER_ICON_MAP: { [key: string]: React.ReactNode } = {
  // 12 지지
  子: <AnimalIcons.Mouse className="w-10 h-10" />,
  丑: <AnimalIcons.Cow className="w-10 h-10" />,
  寅: <AnimalIcons.Tiger className="w-10 h-10" />,
  卯: <AnimalIcons.Rabbit className="w-10 h-10" />,
  辰: <AnimalIcons.Dragon className="w-10 h-10" />,
  巳: <AnimalIcons.Snake className="w-10 h-10" />,
  午: <AnimalIcons.Horse className="w-10 h-10" />,
  未: <AnimalIcons.Sheep className="w-10 h-10" />,
  申: <AnimalIcons.Monkey className="w-10 h-10" />,
  酉: <AnimalIcons.Rooster className="w-10 h-10" />,
  戌: <AnimalIcons.Dog className="w-10 h-10" />,
  亥: <AnimalIcons.Pig className="w-10 h-10" />,
  // 10 천간
  甲: <GanDisplay character="甲" />,
  乙: <GanDisplay character="乙" />,
  丙: <GanDisplay character="丙" />,
  丁: <GanDisplay character="丁" />,
  戊: <GanDisplay character="戊" />,
  己: <GanDisplay character="己" />,
  庚: <GanDisplay character="庚" />,
  辛: <GanDisplay character="辛" />,
  壬: <GanDisplay character="壬" />,
  癸: <GanDisplay character="癸" />,
};

// ✅ 한자 to 한글 변환 맵
export const HANJA_TO_HANGUL: { [key: string]: string } = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

// ✅ 한자 to 오행 변환 맵 (음양 포함)
export const HANJA_TO_OHENG: { [key: string]: string } = {
  甲: "陽木",
  乙: "陰木",
  丙: "陽火",
  丁: "陰火",
  戊: "陽土",
  己: "陰土",
  庚: "陽金",
  辛: "陰金",
  壬: "陽水",
  癸: "陰水",
  子: "陽水",
  丑: "陰土",
  寅: "陽木",
  卯: "陰木",
  辰: "陽土",
  巳: "陽火",
  午: "陰火",
  未: "陰土",
  申: "陽金",
  酉: "陰金",
  戌: "陽土",
  亥: "陰水",
};
