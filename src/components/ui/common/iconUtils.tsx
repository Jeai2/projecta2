// src/components/ui/common/iconsObject.ts

import { MenuIcon, XIcon, type IconProps } from "./Icons";

// 아이콘 모음 객체
export const Icons = {
  Menu: MenuIcon,
  X: XIcon,
  animal: {
    mouse: ({ className }: IconProps) => <span className={className}>🐭</span>,
    cow: ({ className }: IconProps) => <span className={className}>🐮</span>,
    tiger: ({ className }: IconProps) => <span className={className}>🐯</span>,
    rabbit: ({ className }: IconProps) => <span className={className}>🐰</span>,
    dragon: ({ className }: IconProps) => <span className={className}>🐲</span>,
    snake: ({ className }: IconProps) => <span className={className}>🐍</span>,
    horse: ({ className }: IconProps) => <span className={className}>🐴</span>,
    sheep: ({ className }: IconProps) => <span className={className}>🐑</span>,
    monkey: ({ className }: IconProps) => <span className={className}>🐵</span>,
    rooster: ({ className }: IconProps) => (
      <span className={className}>🐔</span>
    ),
    dog: ({ className }: IconProps) => <span className={className}>🐶</span>,
    pig: ({ className }: IconProps) => <span className={className}>🐷</span>,
  },
};

// 지지별 아이콘 매핑
export const jijinIcons: { [key: string]: React.ReactNode } = {
  子: Icons.animal.mouse({ className: "w-10 h-10" }),
  丑: Icons.animal.cow({ className: "w-10 h-10" }),
  寅: Icons.animal.tiger({ className: "w-10 h-10" }),
  卯: Icons.animal.rabbit({ className: "w-10 h-10" }),
  辰: Icons.animal.dragon({ className: "w-10 h-10" }),
  巳: Icons.animal.snake({ className: "w-10 h-10" }),
  午: Icons.animal.horse({ className: "w-10 h-10" }),
  未: Icons.animal.sheep({ className: "w-10 h-10" }),
  申: Icons.animal.monkey({ className: "w-10 h-10" }),
  酉: Icons.animal.rooster({ className: "w-10 h-10" }),
  戌: Icons.animal.dog({ className: "w-10 h-10" }),
  亥: Icons.animal.pig({ className: "w-10 h-10" }),
};
