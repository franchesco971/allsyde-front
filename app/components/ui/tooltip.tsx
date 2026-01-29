"use client";

import * as React from "react";
import { cn } from "@/app/lib/util";

const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
  return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block group">{children}</div>;
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left" }
>(({ className, side = "top", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 hidden group-hover:block px-3 py-1.5 text-sm text-white bg-slate-800 rounded-md shadow-lg whitespace-nowrap",
        side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2",
        side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
        side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
        side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
