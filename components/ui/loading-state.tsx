"use client";

import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Custom loading message */
  message?: string;
  /** Custom icon component */
  icon?: LucideIcon;
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Custom className for styling */
  className?: string;
  /** Minimum height for the container */
  minHeight?: string;
  /** Show background container */
  showContainer?: boolean;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-8 h-8", 
  lg: "w-12 h-12"
};

export function LoadingState({
  message = "Loading...",
  icon: Icon = Loader2,
  size = "md",
  className,
  minHeight = "400px",
  showContainer = true
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Icon className={cn(sizeMap[size], "animate-spin")} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  if (!showContainer) {
    return content;
  }

  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      style={{ minHeight }}
    >
      {content}
    </div>
  );
}
