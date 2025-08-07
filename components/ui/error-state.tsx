"use client";

import { AlertCircle, RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message?: string;
  /** Custom icon component */
  icon?: LucideIcon;
  /** Retry function */
  onRetry?: () => void;
  /** Retry button text */
  retryText?: string;
  /** Custom className for styling */
  className?: string;
  /** Show as card layout */
  showCard?: boolean;
  /** Minimum height for the container */
  minHeight?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the content. Please try again.",
  icon: Icon = AlertCircle,
  onRetry,
  retryText = "Try Again",
  className,
  showCard = true,
  minHeight = "400px"
}: ErrorStateProps) {
  const content = (
    <>
      <div className="flex justify-center mb-4">
        <Icon className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        {message}
      </p>
      {onRetry && (
        <div className="flex justify-center">
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {retryText}
          </Button>
        </div>
      )}
    </>
  );

  if (showCard) {
    return (
      <div 
        className={cn("flex items-center justify-center", className)}
        style={{ minHeight }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center mb-2">
              <Icon className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {retryText}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex flex-col items-center justify-center text-center", className)}
      style={{ minHeight }}
    >
      {content}
    </div>
  );
}
