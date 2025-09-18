import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // ✅ 배경색을 새로운 골드색으로, 텍스트는 어두운 색으로 변경
        default: "bg-accent-gold text-text-light hover:bg-accent-gold/90",

        destructive:
          "bg-system-danger text-text-light hover:bg-system-danger/90",

        // ✅ 아웃라인 버튼의 색상을 새로운 테마에 맞게 조정
        outline:
          "border border-accent-gold/50 bg-transparent text-text-muted hover:bg-accent-gold/10 hover:text-accent-gold",

        secondary:
          "bg-background-sub text-text-muted hover:bg-background-sub/80",

        ghost: "hover:bg-background-sub/50 text-text-muted",

        link: "text-text-muted underline-offset-4 hover:text-text-light hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
