import React from "react";
import { MenuIcon, XIcon, type IconProps } from "./Icons";

// 천간 글자를 아이콘처럼 스타일링하는 내부 컴포넌트
const GanDisplay = ({ character }: { character: string }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700/60 border border-gray-500">
    <span className="text-xl font-bold text-white">{character}</span>
  </div>
);

// 동물 아이콘 모음 (기존 Icons.animal 객체와 동일)
const AnimalIcons = {
  mouse: ({ className }: IconProps) => <span className={className}>🐭</span>,
  cow: ({ className }: IconProps) => <span className={className}>🐮</span>,
  tiger: ({ className }: IconProps) => <span className={className}>🐯</span>,
  rabbit: ({ className }: IconProps) => <span className={className}>🐰</span>,
  dragon: ({ className }: IconProps) => <span className={className}>🐲</span>,
  snake: ({ className }: IconProps) => <span className={className}>🐍</span>,
  horse: ({ className }: IconProps) => <span className={className}>🐴</span>,
  sheep: ({ className }: IconProps) => <span className={className}>🐑</span>,
  monkey: ({ className }: IconProps) => <span className={className}>🐵</span>,
  rooster: ({ className }: IconProps) => <span className={className}>🐔</span>,
  dog: ({ className }: IconProps) => <span className={className}>🐶</span>,
  pig: ({ className }: IconProps) => <span className={className}>🐷</span>,
};

// ✅ [수정] 천간과 지지를 모두 포함하는 최종 아이콘 맵
export const CHARACTER_ICON_MAP: { [key: string]: React.ReactNode } = {
  // 12 지지
  子: <AnimalIcons.mouse className="w-10 h-10" />,
  丑: <AnimalIcons.cow className="w-10 h-10" />,
  寅: <AnimalIcons.tiger className="w-10 h-10" />,
  卯: <AnimalIcons.rabbit className="w-10 h-10" />,
  辰: <AnimalIcons.dragon className="w-10 h-10" />,
  巳: <AnimalIcons.snake className="w-10 h-10" />,
  午: <AnimalIcons.horse className="w-10 h-10" />,
  未: <AnimalIcons.sheep className="w-10 h-10" />,
  申: <AnimalIcons.monkey className="w-10 h-10" />,
  酉: <AnimalIcons.rooster className="w-10 h-10" />,
  戌: <AnimalIcons.dog className="w-10 h-10" />,
  亥: <AnimalIcons.pig className="w-10 h-10" />,
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

// 범용 아이콘 객체 (기존과 동일)
export const Icons = {
  Menu: MenuIcon,
  X: XIcon,
  animal: AnimalIcons,
};
