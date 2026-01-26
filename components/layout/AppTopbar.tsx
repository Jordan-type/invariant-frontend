"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NetworkSwitcher } from "../profile/wallet/NetworkSwitcher";

type TopbarProps = {
  rightSlot?: React.ReactNode;
  showSearch?: boolean;
};

export default function AppTopbar({ rightSlot, showSearch = true }: TopbarProps) {
  const pathname = usePathname();

  const crumbs = React.useMemo(() => {
    const parts = (pathname ?? "/").split("/").filter(Boolean);
    return ["Dashboard", ...parts].map((p, i) => ({
      label: p.charAt(0).toUpperCase() + p.slice(1),
      href: "/" + parts.slice(0, i).join("/"),
    }));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/70 backdrop-blur">
      <div className="flex h-full items-center px-6 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <nav className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            {crumbs.slice(0, 3).map((c, i) => (
              <span key={i} className={cn(i === crumbs.length - 1 && "text-foreground")}>
                {c.label}{i < crumbs.length - 1 && " / "}
              </span>
            ))}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="hidden md:flex items-center gap-2 h-9 px-2 rounded-lg border bg-background/50">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search…"
                className="h-8 border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
          )}

          <NetworkSwitcher />
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
