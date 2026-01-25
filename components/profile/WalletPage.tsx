"use client";

import { useMemo, useState } from "react";
import { Copy, QrCode, Send, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import TVLGauge from "../charts/TVLGauge";
import TokensTable from "../tables/TokensTable";
import { cn } from "@/lib/utils";

type ChainKey = "celo" | "base";

export default function ProfileWalletPage() {
  const [chain, setChain] = useState<ChainKey>("celo");
  const wallet = {
    address: "0xbabe...0C2f",
    connected: true,
  };

  // Mock balances (replace later with viem/wagmi)
  const tokens = useMemo(
    () => [
      { symbol: "cUSD", amount: 7.5, price: 0.9997, usd: 7.4979 },
      { symbol: "cEUR", amount: 0, price: 1.18, usd: 0 },
      { symbol: "cREAL", amount: 0, price: 0, usd: 0 },
      { symbol: "CELO", amount: 1662.213, price: 0.11525, usd: 191.5618 },
      { symbol: "cKES", amount: 0, price: 0.00771, usd: 0 },
    ],
    []
  );

  const totalUsd = useMemo(
    () => tokens.reduce((sum, t) => sum + t.usd, 0),
    [tokens]
  );

  const breakdown = useMemo(() => {
    const nonZero = tokens.filter((t) => t.usd > 0);
    const total = nonZero.reduce((s, t) => s + t.usd, 0) || 1;
    return nonZero.map((t) => ({ label: t.symbol, value: t.usd / total }));
  }, [tokens]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header (Purity-like) */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,191,0.25),transparent_45%),radial-gradient(circle_at_70%_10%,rgba(245,196,81,0.20),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Settings / Profile</div>
              <h1 className="text-3xl font-semibold tracking-tight">Wallet</h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Basic wallet utilities for interacting with Invariant (signing, balances, and network context).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={cn("border-border/70 bg-card/50", chain === "celo" && "ring-1 ring-[hsl(var(--secondary))]")}
                onClick={() => setChain("celo")}
              >
                Celo
              </Button>
              <Button
                variant="outline"
                className={cn("border-border/70 bg-card/50", chain === "base" && "ring-1 ring-[hsl(var(--secondary))]")}
                onClick={() => setChain("base")}
              >
                Base
              </Button>

              <Badge variant="secondary" className="ml-2">
                {wallet.address}
              </Badge>
            </div>
          </div>

          {/* Profile strip */}
          <div className="mt-8">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Connected Wallet</div>
                    <div className="text-sm text-muted-foreground">{wallet.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-border/70 bg-background/40 gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" className="border-border/70 bg-background/40 gap-2">
                    <QrCode className="h-4 w-4" />
                    Receive
                  </Button>
                  <Button className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Gauge */}
          <Card className="lg:col-span-7 bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total Wallet Value</div>
                  <div className="text-3xl font-semibold">${totalUsd.toFixed(2)}</div>
                </div>
                <Badge variant="outline" className="border-border/70 bg-background/40">
                  {chain.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <TVLGauge
                  value={1}
                  segments={breakdown}
                  label={`$${totalUsd.toFixed(2)}`}
                />
              </div>

              <Separator className="my-6 bg-border/60" />

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Assets</div>
                  <div className="text-xl font-semibold">{tokens.filter(t => t.amount > 0).length}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Largest</div>
                  <div className="text-xl font-semibold">{tokens.sort((a,b)=>b.usd-a.usd)[0]?.symbol}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-xl font-semibold">Connected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity placeholder */}
          <Card className="lg:col-span-5 bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Activity</div>
                <div className="text-sm text-muted-foreground">Coming soon</div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                This will show Invariant-related actions: strategy deploys, hook executions,
                signatures, and rebalances (not generic wallet spam).
              </p>

              <div className="mt-6 space-y-3">
                {["Strategy simulation created", "Signed intent payload", "Pool watched: CELO/cUSD"].map((x) => (
                  <div key={x} className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm">
                    {x}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tokens table */}
        <Card className="bg-card/60 backdrop-blur border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Tokens</div>
              <div className="text-sm text-muted-foreground">Balances (mock)</div>
            </div>
            <div className="mt-4">
              <TokensTable tokens={tokens} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
