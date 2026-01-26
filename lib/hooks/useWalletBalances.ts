"use client";

import * as React from "react";
import { useAccount, useBalance, useReadContracts, useChainId } from "wagmi";
import { formatUnits } from "viem";

import { erc20Abi } from "@/lib/abis/erc20Abi";
import type { ChainKey, Token } from "@/types/token-types";
import type { WalletBalancesResult, WalletTokenRow } from "@/types/wallet-types";

function chainKeyFromChainId(chainId?: number): ChainKey {
  // wagmi/chains: celo.id = 42220, base.id = 8453
  if (chainId === 42220) return "celo";
  if (chainId === 8453) return "base";
  // fallback (keeps UI alive)
  return "celo";
}

const priceCache = new Map<string, { ts: number; prices: Record<string, number> }>();
async function fetchCoingeckoUsdPrices(coingeckoIds: string[]) {
  const ids = Array.from(new Set(coingeckoIds.filter(Boolean)));
  if (!ids.length) return {};

  const key = ids.sort().join(",");
  const cached = priceCache.get(key);
  const now = Date.now();

  // 60s cache
  if (cached && now - cached.ts < 60_000) return cached.prices;

  const url =
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=" +
    encodeURIComponent(ids.join(","));

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Price fetch failed (${res.status})`);

  const json = (await res.json()) as Record<string, { usd?: number }>;
  const prices: Record<string, number> = {};
  for (const id of ids) prices[id] = Number(json?.[id]?.usd ?? 0);

  priceCache.set(key, { ts: now, prices });
  return prices;
}

function isErc20OnChain(token: Token, chain: ChainKey) {
  const addr = token.addresses?.[chain];
  return !!addr && addr !== ("0x0000000000000000000000000000000000000000" as `0x${string}`);
}

export function useWalletBalances(args: { tokens: Token[]; chain?: ChainKey }) {
  const { tokens, chain } = args;

  const chainId = useChainId();
  const derivedChain = chain ?? chainKeyFromChainId(chainId);

  const { address, isConnected } = useAccount();

  // Native balance (CELO/ETH)
  const native = React.useMemo(() => tokens.find((t) => t.isNative), [tokens]);
  const nativeBal = useBalance({
    address,
    query: { enabled: !!address && !!native },
  });

  // ERC20 multicall
  const erc20Tokens = React.useMemo(
    () => tokens.filter((t) => !t.isNative && isErc20OnChain(t, derivedChain)),
    [tokens, derivedChain]
  );

  const contracts = React.useMemo(() => {
    if (!address) return [];
    return erc20Tokens.map((t) => ({
      abi: erc20Abi,
      address: t.addresses?.[derivedChain] as `0x${string}`,
      functionName: "balanceOf" as const,
      args: [address],
    }));
  }, [address, erc20Tokens, derivedChain]);

  const erc20Reads = useReadContracts({
    contracts,
    query: { enabled: !!address && contracts.length > 0 },
  });

  // Prices (CoinGecko)
  const [prices, setPrices] = React.useState<Record<string, number>>({});
  const [priceError, setPriceError] = React.useState<string | undefined>(undefined);

  const coingeckoIds = React.useMemo(
    () => tokens.map((t) => t.coingeckoId).filter(Boolean) as string[],
    [tokens]
  );

  React.useEffect(() => {
    let mounted = true;

    fetchCoingeckoUsdPrices(coingeckoIds)
      .then((p) => {
        if (!mounted) return;
        setPrices(p);
        setPriceError(undefined);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : "Price fetch failed";
        setPriceError(msg);
      });

    return () => {
      mounted = false;
    };
  }, [coingeckoIds.join("|")]);

  const isLoading =
    (!!native && nativeBal.isLoading) || (contracts.length > 0 && erc20Reads.isLoading);

  const error =
    nativeBal.error?.message ??
    erc20Reads.error?.message ??
    priceError;

  const rows: WalletTokenRow[] = React.useMemo(() => {
    const out: WalletTokenRow[] = [];

    // Native token row
    if (native) {
      const raw = (nativeBal.data?.value ?? 0n) as bigint;
      const amount = formatUnits(raw, native.decimals);
      const priceUsd = native.coingeckoId ? prices[native.coingeckoId] : undefined;
      const usdValue = priceUsd ? Number(amount || 0) * priceUsd : undefined;

      out.push({
        id: native.id ?? `${derivedChain}:${native.symbol}`,
        chain: derivedChain,
        symbol: native.symbol,
        name: native.name,
        decimals: native.decimals,
        logoURI: native.logoURI,
        isNative: true,
        raw,
        amount,
        priceUsd,
        usdValue,
        token: native,
      });
    }

    // ERC20 rows (aligned by index)
    const readResults = erc20Reads.data ?? [];
    erc20Tokens.forEach((t, i) => {
      const r = readResults[i];
      const raw = (r?.result ?? 0n) as bigint;
      const amount = formatUnits(raw, t.decimals);
      const priceUsd = t.coingeckoId ? prices[t.coingeckoId] : undefined;
      const usdValue = priceUsd ? Number(amount || 0) * priceUsd : undefined;

      out.push({
        id: t.id ?? `${derivedChain}:${t.symbol}`,
        chain: derivedChain,
        symbol: t.symbol,
        name: t.name,
        decimals: t.decimals,
        logoURI: t.logoURI,
        address: t.addresses?.[derivedChain],
        isNative: false,
        raw,
        amount,
        priceUsd,
        usdValue,
        token: t,
      });
    });

    // Sort by USD desc (stable, good UX at scale)
    out.sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));
    return out;
  }, [native, nativeBal.data?.value, erc20Tokens, erc20Reads.data, prices, derivedChain]);

  const totalUsd = React.useMemo(
    () => rows.reduce((s, r) => s + (r.usdValue ?? 0), 0),
    [rows]
  );

  const result: WalletBalancesResult = {
    address,
    chain: derivedChain,
    isConnected,
    isLoading,
    error,
    rows,
    totalUsd,
  };

  return result;
}
