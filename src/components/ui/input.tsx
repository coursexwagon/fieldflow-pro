import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full bg-[#1C1C1F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder:text-[#71717A] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors",
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
