"use client";

import { useMemo, useState } from "react";
import { Copy, Wallet } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import TVLGauge from "@/components/charts/TVLGauge";
import TokensTable from "@/components/tables/TokensTable";

import { WalletSendSheet } from "@/components/profile/wallet/WalletSendSheet";
import { WalletReceiveSheet } from "@/components/profile/wallet/WalletReceiveSheet";

import type { ChainKey, Token } from "@/types/token-types";
import { chainKeyFromChainId, getTokens } from "@/lib/protocol/tokens-registry";
import { cn } from "@/lib/utils";
import { useWalletBalances } from "@/lib/hooks/useWalletBalances";

export default function WalletOverview() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

    const chain = useMemo(() => chainKeyFromChainId(chainId), [chainId]);

  // Real tokens per chain from registry
  const chainTokens = useMemo(() => getTokens(chain), [chain]);

  // Default token per chain (prefer native / first entry)
  const defaultToken: Token = useMemo(() => {
    const preferred =
      chainTokens.find((t) => t.isNative) ??
      chainTokens[0];

          // fallback to safe object (should not happen if registry always has tokens)
    return (
      preferred ?? {
        id: `${chain}:UNKNOWN`,
        symbol: "UNKNOWN",
        name: "Unknown",
        decimals: 18,
        addresses: {},
      }
    );
  }, [chain, chainTokens]);


  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Copied", { description: "Wallet address copied to clipboard." });
    } catch {
      toast.error("Copy failed", { description: "Could not copy address." });
    }
  };


  /**
   * TEMP (until we wire viem/wagmi):
   * TokensTable expects rows like: { symbol, amount, price, usd }
   * Next step: replace this with real balances from a hook.
   */
  const balances = useWalletBalances({ tokens: chainTokens, chain });

  const totalUsd = balances.totalUsd;

  const breakdown = useMemo(() => {
    const nonZero = balances.rows.filter((t) => (t.usdValue ?? 0) > 0);
    const total = nonZero.reduce((s, t) => s + (t.usdValue ?? 0), 0) || 1;
    return nonZero.map((t) => ({ 
      label: t.symbol, 
      value: (t.usdValue ?? 0) / total,
      color: t.token?.color, // use token color if available
    }));
  }, [balances.rows]);

  // assets count/ largest asset
  const assetsCount = useMemo(
    () => balances.rows.filter((t) => Number(t.amount || 0) > 0).length,
    [balances.rows]
  );
  
  const largestSymbol = useMemo(() => {
  const best = balances.rows.reduce<{ symbol?: string; usd?: number }>(
    (acc, r) => {
      const usd = r.usdValue ?? 0;
      if (usd > (acc.usd ?? 0)) return { symbol: r.symbol, usd };
      return acc;
    },
    {}
  );
  return best.symbol ?? "—";
}, [balances.rows]);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero header (Purity-like) */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,191,0.25),transparent_45%),radial-gradient(circle_at_70%_10%,rgba(245,196,81,0.20),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Wallet</h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Basic wallet utilities for interacting with Invariant (signing, balances, send/receive actions, and network context).
              </p>
            </div>
          </div>

          {/* Wallet Profile strip */}
          <div className="mt-8">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl border border-border/60 bg-background/40 flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{isConnected ? "Connected Wallet" : "Not connected"}</div>
                    <div className="text-sm text-muted-foreground">{address ?? "Connect a wallet to view balances"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                     variant="outline"
                     className="border-border/70 bg-background/40 gap-2"
                     onClick={copyAddress}
                   >
                     <Copy className="h-4 w-4" />
                     Copy
                   </Button>
                   
                   <WalletReceiveSheet
                     address={(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`}
                     tokens={chainTokens}
                     defaultToken={defaultToken}
                     triggerClassName="border-border/70 bg-background/40"
                    />
                    
                    <WalletSendSheet
                      tokens={chainTokens}
                      defaultToken={defaultToken}
                      triggerClassName="gap-2"
                      chain={chain}
                      />
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
  segments={breakdown}
  label={`$${totalUsd.toFixed(2)}`}
  subtitle="Total Wallet Value"
                />
              </div>

              <Separator className="my-6 bg-border/60" />

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Assets</div>
                  <div className="text-xl font-semibold">{assetsCount}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Largest</div>
                  <div className="text-xl font-semibold">{largestSymbol}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-xl font-semibold">{isConnected ? "Connected" : "Not connected"}</div>
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
              <div className="text-sm text-muted-foreground">
                {balances.isLoading ? "Loading…" : "Live balances"}
              </div>
            </div>

            <div className="mt-4">
              <TokensTable tokens={balances.rows} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
