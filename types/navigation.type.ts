import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  disabled?: boolean;
  icon?: LucideIcon;
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};
