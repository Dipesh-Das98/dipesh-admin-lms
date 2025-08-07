"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Home, Settings, Users, Baby, Shield, UserCog } from "lucide-react";
import UserAvatar from "../ui/user-avatar";
import { LogoutButton } from "@/app/(auth)/(routes)/components/logout-button";
import { cn } from "@/lib/utils";

interface NavUserSettingsProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const NavUserSettings = ({ user }: NavUserSettingsProps) => {
  
  const userRole = user?.role || "";

  // Function to check if user has access to a menu item
  const hasAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true; // If no roles specified, everyone can access
    return roles.includes(userRole);
  };

  // Function to get role badge styles
  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  if (!user) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* user image */}
        <div className="text-primary-foreground relative bg-accent p-1 border border-accent rounded-full z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-300 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]">
          <UserAvatar
            alt="User Avatar"
            imageUrl={
              "https://api.dicebear.com/5.x/initials/svg?seed=" + user?.name
            }
            fallback={user?.name?.slice(0, 1) || "T"}
            className="w-10 h-10 cursor-pointer "
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          {/* user name and role badge */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {user?.name}
            </div>
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
              getRoleBadgeStyles(userRole)
            )}>
              <UserCog size={12} className="mr-1" />
              {userRole.toLowerCase().replace('_', ' ')}
            </span>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {user?.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={"/dashboard"} className="flex gap-x-2">
            <Home size={16} />
            Home
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/dashboard/settings"} className="flex gap-x-2">
            <Settings size={16} />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {hasAccess(["ADMIN", "SUPER_ADMIN"]) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={"/dashboard/users"} className="flex gap-x-2">
                <Users size={16} />
                User Management
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={"/dashboard/children"} className="flex gap-x-2">
                <Baby size={16} />
                Children Management
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {hasAccess(["SUPER_ADMIN"]) && (
          <DropdownMenuItem asChild>
            <Link href={"/dashboard/admin"} className="flex gap-x-2">
              <Shield size={16} />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}

        {/* logout */}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <LogoutButton
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-start"
          >
            <span>Logout</span>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserSettings;
