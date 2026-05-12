import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-white shadow-[0_1px_2px_rgba(28,25,23,0.10),0_8px_20px_-8px_rgba(225,106,74,0.55)] hover:bg-[var(--primary-hover)] hover:-translate-y-[1px] hover:shadow-[0_2px_4px_rgba(28,25,23,0.12),0_14px_30px_-10px_rgba(225,106,74,0.6)] active:translate-y-0",
        secondary:
          "border border-[var(--ink)]/85 bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white",
        ghost:
          "text-[var(--ink)] hover:bg-[var(--linen)]",
        outline:
          "border border-[var(--border)] bg-white text-[var(--ink)] hover:border-[var(--ink)]/30 hover:bg-white",
        inverted:
          "bg-white text-[var(--ink)] hover:bg-[var(--linen)]",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
