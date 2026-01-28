"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NonDashboardNavbarProps = {
  /** Optional: override brand title */
  title?: string;
  /** Optional: override subtitle */
  subtitle?: string;
  /** Optional: CTA destination (default: /dashboard) */
  ctaHref?: string;
  /** Optional: CTA label */
  ctaLabel?: string;
  /** Optional: show/hide the v4 badge */
  showBadge?: boolean;
  /** Optional: badge text */
  badgeText?: string;
  /** Optional: extra class for the header wrapper */
  className?: string;
};

export default function NonDashboardNavbar({
  title = "Invariant",
  subtitle = "Hook-native DeFi protocol",
  ctaHref = "/dashboard",
  ctaLabel = "Open App",
  showBadge = true,
  badgeText = "Uniswap v4 hooks",
  className,
}: NonDashboardNavbarProps) {
  return (
    <header className={cn("relative z-10", className)}>
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl border border-border/70 bg-card/60 backdrop-blur flex items-center justify-center shrink-0">
            <span className="font-semibold">∿</span>
          </div>

          <div className="leading-tight min-w-0">
            <div className="font-semibold truncate">{title}</div>
            <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
          </div>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {showBadge ? (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {badgeText}
            </Badge>
          ) : null}

          <Link href={ctaHref}>
            <Button className="gap-2">
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
