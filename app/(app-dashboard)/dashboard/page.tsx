"use client";

import Link from "next/link";
import { ArrowUpRight, Droplets, Wand2, Wallet, Settings } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiles = [
  {
    title: "Pools",
    desc: "View pools, liquidity context, and metrics.",
    href: "/pools",
    icon: Droplets,
    tag: "Explore",
  },
  {
    title: "Strategies",
    desc: "Create, test, and manage AI-driven strategies.",
    href: "/strategies",
    icon: Wand2,
    tag: "Build",
  },
  {
    title: "Wallet",
    desc: "Balances, send/receive, and network context.",
    href: "/wallet",
    icon: Wallet,
    tag: "Live",
  },
  {
    title: "Settings",
    desc: "Profile, preferences, and protocol config.",
    href: "/settings",
    icon: Settings,
    tag: "Manage",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/60">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Dashboard</div>
            <div className="text-2xl font-semibold tracking-tight">
              Invariant Overview
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Quick access to pools, strategies, and wallet utilities.
            </p>
          </div>

          <Badge variant="outline" className="border-border/70 bg-background/40 w-fit">
            Hook-native
          </Badge>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="group">
              <Card
                className={cn(
                  "bg-card/60 backdrop-blur border-border/60",
                  "transition hover:bg-card/70 hover:shadow-sm"
                )}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-80 transition" />
                  </div>

                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/40 px-2 py-0.5">
                      {t.tag}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Optional: placeholder section */}
      <Card className="bg-card/60 backdrop-blur border-border/60">
        <CardContent className="p-6">
          <div className="font-semibold">Activity</div>
          <p className="text-sm text-muted-foreground mt-2">
            Coming soon: strategy deploys, hook executions, and rebalances.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
