"use client";

import * as React from "react";
import type { ChainKey, Token } from "@/types/token-types";
import { getTokens } from "@/lib/protocol/tokens-registry";

// You’ll wire these later:
// - wagmi: useAccount, usePublicClient
// - or viem public client
// For now: structure is correct; drop your actual client in.

export type WalletTokenRow = {
  token: Token;
  amount: string;   // human readable
  priceUsd: number;
  usdValue: number;
};

async function fetchPrices(ids: string[]): Promise<Record<string, number>> {
  const res = await fetch("/api/prices", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const json = (await res.json()) as { prices: Record<string, number> };
  return json.prices ?? {};
}

export function useWalletTokens(args: {
  chain: ChainKey;
  address?: `0x${string}`;
}) {
  const { chain, address } = args;

  const [rows, setRows] = React.useState<WalletTokenRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!address) {
        setRows([]);
        return;
      }

      setLoading(true);
      try {
        const tokens = getTokens(chain);

        // 1) prices
        const ids = tokens.map((t) => t.coingeckoId).filter(Boolean) as string[];
        const priceMap = await fetchPrices(ids);

        // 2) balances (TODO: replace with viem/wagmi reads)
        // For now, keep 0 but the structure is ready.
        // Later you’ll:
        // - native: publicClient.getBalance({ address })
        // - erc20: publicClient.readContract({ abi, address: tokenAddr, functionName: "balanceOf", args: [address] })

        const next: WalletTokenRow[] = tokens.map((t) => {
          const price = t.coingeckoId ? priceMap[t.coingeckoId] ?? 0 : 0;

          const amount = "0"; // TODO: from chain
          const usdValue = Number(amount) * price;

          return { token: t, amount, priceUsd: price, usdValue };
        });

        if (!cancelled) setRows(next);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [chain, address]);

  const totalUsd = React.useMemo(
    () => rows.reduce((s, r) => s + r.usdValue, 0),
    [rows]
  );

  return { rows, totalUsd, loading };
}
