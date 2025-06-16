import * as React from "react";

import { cn } from "@/lib/utils";

// 'interface' 대신 'type' 별칭을 사용한다.
// "InputProps는 앞으로 React.InputHTMLAttributes<HTMLInputElement>와 완전히 동일한 타입이다"
// 라고 명확하게 선언하는 것이다. 불필요한 상속 없이.
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-text-light placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
