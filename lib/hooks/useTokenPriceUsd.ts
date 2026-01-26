"use client";

import * as React from "react";
import type { Token } from "@/types/token-types";

function getPriceId(token: Token) {
  // Prefer a real coingecko id if you have it in your Token type
  return (token).coingeckoId ?? token.symbol.toLowerCase();
}

export function useTokenPriceUsd(token: Token) {
  const [priceUsd, setPriceUsd] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const id = React.useMemo(() => getPriceId(token), [token]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const r = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [id] }),
        });

        const json = (await r.json()) as { prices?: Record<string, number> };
        const p = json?.prices?.[id] ?? 0;

        if (!cancelled) setPriceUsd(p);
      } catch {
        if (!cancelled) setPriceUsd(0);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { priceUsd, isLoading };
}
