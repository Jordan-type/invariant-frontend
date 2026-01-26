"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Waves,
  Sparkles,
  Activity,
  Wallet,
  Settings,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  tag?: string;
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pools", href: "/pools", icon: Waves },
  { label: "Strategies", href: "/strategies", icon: Sparkles, tag: "v4" },
  { label: "Activity", href: "/activity", icon: Activity, tag: "soon" },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppSidebar() {
  const pathname = usePathname() ?? "/";
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-border/60">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl border border-border/60 bg-background/60 flex items-center justify-center">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-semibold tracking-tight">Invariant</div>
            <div className="text-xs text-muted-foreground truncate">
              Hook-native AI liquidity
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* navigation main */}
        <SidebarMenu>
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpenMobile(false)}
                    className="flex items-center gap-3"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{item.label}</span>

                    {item.tag ? (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-border/60 bg-background/60 text-muted-foreground">
                        {item.tag}
                      </span>
                    ) : null}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="text-sm font-semibold">Pro tip</div>
          <div className="text-xs text-muted-foreground mt-1">
            Start with Wallet → balances → send/receive.
          </div>

          <Button
            variant="outline"
            className={cn("mt-3 w-full border-border/70 bg-background/60")}
            asChild
          >
            <Link href="/wallet">Open Wallet</Link>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
