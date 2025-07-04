import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-gold-foreground shadow-[0_4px_14px_0_hsl(var(--gold)/25%)] hover:shadow-[0_0_20px_3px_hsl(var(--accent)/40%)] hover:brightness-110",
        
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        ghost: "hover:bg-accent/10 hover:text-accent",
        
        link: "text-primary underline-offset-4 hover:underline",
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