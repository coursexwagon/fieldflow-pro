import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[#27272A] text-zinc-300",
        scheduled: "bg-[#27272A] text-zinc-300",
        progress: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        completed: "bg-green-500/20 text-green-400 border border-green-500/30",
        invoiced: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        paid: "bg-green-500 text-white",
        orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        blue: "bg-blue-500/20 text-blue-400",
        green: "bg-green-500/20 text-green-400 border border-green-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
