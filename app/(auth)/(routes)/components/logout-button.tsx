"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { useTransition } from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({
  children,
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isPending}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || (isPending ? "Signing out..." : "Sign Out")}
    </Button>
  );
}