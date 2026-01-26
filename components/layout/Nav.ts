import {
  LayoutDashboard,
  Droplets,
  Wand2,
  Wallet,
  User,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export const NAV_PRIMARY: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pools", href: "/pools", icon: Droplets },
  { label: "Strategies", href: "/strategies", icon: Wand2 },
];

export const NAV_ACCOUNT: NavItem[] = [
  { label: "Wallet", href: "/profile/wallet", icon: Wallet },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];
