import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // 이제 이 파일이 존재해야만 한다.

// cva (class-variance-authority)를 사용해 버튼의 모든 '상태'를 미리 정의한다.
// 이게 바로 버튼의 '설계도'다.
const buttonVariants = cva(
  // 1. 기본 스타일: 모든 버튼이 공통으로 가질 기본 클래스
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // 2. Variants: 버튼의 종류 (모양, 색상 등)
    variants: {
      variant: {
        // 'default' variant: 가장 기본적인 버튼 (금색 배경)
        default:
          "bg-accent-gold text-background-main font-semibold hover:bg-accent-gold/90",
        // 'destructive' variant: 위험/삭제 버튼 (빨간색)
        destructive:
          "bg-system-danger text-text-light font-semibold hover:bg-system-danger/90",
        // 'outline' variant: 외곽선만 있는 버튼
        outline:
          "border border-accent-gold bg-transparent text-accent-gold hover:bg-accent-gold hover:text-background-main",
        // 'secondary' variant: 덜 중요한 버튼 (회색 계열)
        secondary: "bg-background-sub text-text-muted hover:bg-white/5",
        // 'ghost' variant: 배경 없이 텍스트만 있는 버튼
        ghost: "hover:bg-white/5 text-text-muted",
        // 'link' variant: 일반 링크처럼 보이는 버튼
        link: "text-text-light underline-offset-4 hover:underline",
      },
      // 3. Size: 버튼의 크기
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // 4. 기본값: 아무것도 지정하지 않았을 때의 기본 모습
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 이 버튼 컴포넌트가 받을 수 있는 모든 prop들의 타입을 정의한다.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// 최종 버튼 컴포넌트
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
