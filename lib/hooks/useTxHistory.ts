// /lib/hooks/useTxHistory.ts
"use client";

import * as React from "react";
import { formatUnits, isAddress } from "viem";

import type { ChainKey } from "@/types/token-types";
import type { WalletTx, TxToken } from "@/types/tx-types";
import { getTokens } from "@/lib/protocol/tokens-registry";

/**
 * MAINNET ONLY:
 * - base (8453)
 * - celo (42220)
 *
 * Etherscan API v2 base URL + chainid param.
 * Your BaseScan/CeloScan keys work here (same key style).
 *
 * ENV:
 * NEXT_PUBLIC_BASESCAN_KEY="..."
 * NEXT_PUBLIC_CELOSCAN_KEY="..."
 */
const EXPLORER_KEYS: Partial<Record<ChainKey, string | undefined>> = {
  base: process.env.NEXT_PUBLIC_BASESCAN_KEY,
  celo: process.env.NEXT_PUBLIC_CELOSCAN_KEY,
};

function etherscanV2Base(): string {
  return "https://api.etherscan.io/v2/api";
}

function chainIdFromChainKey(chain: ChainKey): number {
  if (chain === "base") return 8453;
  if (chain === "celo") return 42220;
  // fallback to celo mainnet
  return 42220;
}

function explorerTxUrl(chain: ChainKey, hash: `0x${string}`): string {
  if (chain === "base") return `https://basescan.org/tx/${hash}`;
  return `https://celoscan.io/tx/${hash}`;
}

/** ---------- Explorer types (Etherscan v2 compatible) ---------- **/

type ExplorerResponse<T> = {
  status: "0" | "1";
  message: string;
  result: T[] | string; // can be "No transactions found"
};

type ExplorerTxlistItem = {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  isError: "0" | "1";
  txreceipt_status?: "0" | "1";
  nonce?: string;
  gasUsed?: string;
  gasPrice?: string;
};

type ExplorerTokenTxItem = {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;

  contractAddress: string;

  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;

  gasUsed?: string;
  gasPrice?: string;
  nonce?: string;

  // multiple ERC20 transfers can happen in same tx
  logIndex?: string;
};

/** ---------- Hook API ---------- **/

type UseTxHistoryArgs = {
  chain: ChainKey; // expects "base" | "celo" (mainnet only)
  address?: `0x${string}`;
  enabled?: boolean;
  pageSize?: number; // default 25
  refreshMs?: number; // optional polling

  // pagination behavior
  initialPage?: number; // default 1
};

type UseTxHistoryResult = {
  rows: WalletTx[];
  isLoading: boolean;
  error: string | null;

  page: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
};

/** ---------- Helpers ---------- **/

function safeAddr(a?: string): `0x${string}` | null {
  if (!a) return null;
  const lower = a.toLowerCase();
  return isAddress(lower) ? (lower as `0x${string}`) : null;
}

function nativeToken(chain: ChainKey): TxToken {
  const t = getTokens(chain).find((x) => x.isNative);
  return {
    symbol: t?.symbol ?? (chain === "celo" ? "CELO" : "ETH"),
    decimals: t?.decimals ?? 18,
  };
}

function isNoTxMessage(v: unknown): boolean {
  const s = String(v ?? "").toLowerCase();
  return s.includes("no transactions") || s.includes("no tx") || s.includes("not found");
}

function normalizeTxlistItem(
  item: ExplorerTxlistItem,
  ctx: { chain: ChainKey; wallet: `0x${string}` }
): WalletTx | null {
  const from = safeAddr(item.from);
  const to = safeAddr(item.to);

  const hashOk =
    typeof item.hash === "string" &&
    item.hash.startsWith("0x") &&
    item.hash.length >= 10;

  if (!hashOk || !from || !to) return null;

  const wallet = ctx.wallet.toLowerCase() as `0x${string}`;
  const direction: WalletTx["direction"] = from === wallet ? "sent" : "received";

  const token = nativeToken(ctx.chain);
  const status: WalletTx["status"] =
    item.isError === "1" || item.txreceipt_status === "0" ? "failed" : "confirmed";

  const valueRaw = item.value ?? "0";
  const valueFormatted = (() => {
    try {
      return formatUnits(BigInt(valueRaw), token.decimals);
    } catch {
      return "0";
    }
  })();

  const gasUsed = item.gasUsed ? BigInt(item.gasUsed) : null;
  const gasPrice = item.gasPrice ? BigInt(item.gasPrice) : null;
  const feeRaw = gasUsed && gasPrice ? (gasUsed * gasPrice).toString() : undefined;

  const timestamp = Number(item.timeStamp || "0");

  const createdAt = Date.now();
  const updatedAt = createdAt;

  return {
    id: `${ctx.chain}:${item.hash}`, // 1 row per tx
    chain: ctx.chain as WalletTx["chain"],
    hash: item.hash as `0x${string}`,
    status,

    kind: "transfer", // native transfer / generic
    direction,
    from,
    to,

    token,
    valueRaw,
    valueFormatted,

    feeRaw,
    blockNumber: item.blockNumber ? Number(item.blockNumber) : undefined,
    timestamp: timestamp || undefined,
    nonce: item.nonce ? Number(item.nonce) : undefined,

    explorerUrl: explorerTxUrl(ctx.chain, item.hash as `0x${string}`),

    createdAt,
    updatedAt,
  };
}

function normalizeTokentxItem(
  item: ExplorerTokenTxItem,
  ctx: { chain: ChainKey; wallet: `0x${string}` }
): WalletTx | null {
  const from = safeAddr(item.from);
  const to = safeAddr(item.to);

  const hashOk =
    typeof item.hash === "string" &&
    item.hash.startsWith("0x") &&
    item.hash.length >= 10;

  if (!hashOk || !from || !to) return null;

  const wallet = ctx.wallet.toLowerCase() as `0x${string}`;
  const direction: WalletTx["direction"] = from === wallet ? "sent" : "received";

  const decimals = (() => {
    const n = Number(item.tokenDecimal ?? "18");
    return Number.isFinite(n) ? n : 18;
  })();

  const token: TxToken = {
    symbol: item.tokenSymbol || "ERC20",
    decimals,
  };

  const valueRaw = item.value ?? "0";
  const valueFormatted = (() => {
    try {
      return formatUnits(BigInt(valueRaw), decimals);
    } catch {
      return "0";
    }
  })();

  const gasUsed = item.gasUsed ? BigInt(item.gasUsed) : null;
  const gasPrice = item.gasPrice ? BigInt(item.gasPrice) : null;
  const feeRaw = gasUsed && gasPrice ? (gasUsed * gasPrice).toString() : undefined;

  const timestamp = Number(item.timeStamp || "0");

  const createdAt = Date.now();
  const updatedAt = createdAt;

  // multiple transfers per hash => keep unique using logIndex when present
  const logSuffix = item.logIndex ? `:${item.logIndex}` : "";

  return {
    id: `${ctx.chain}:${item.hash}${logSuffix}`,
    chain: ctx.chain as WalletTx["chain"],
    hash: item.hash as `0x${string}`,

    status: "confirmed", // tokentx doesn't return error flags reliably

    kind: "transfer",
    direction,
    from,
    to,

    token,
    valueRaw,
    valueFormatted,

    feeRaw,
    blockNumber: item.blockNumber ? Number(item.blockNumber) : undefined,
    timestamp: timestamp || undefined,
    nonce: item.nonce ? Number(item.nonce) : undefined,

    explorerUrl: explorerTxUrl(ctx.chain, item.hash as `0x${string}`),

    createdAt,
    updatedAt,
  };
}

/** ---------- The Hook ---------- **/

export function useTxHistory({
  chain,
  address,
  enabled = true,
  pageSize = 25,
  refreshMs,
  initialPage = 1,
}: UseTxHistoryArgs): UseTxHistoryResult {
  const [rows, setRows] = React.useState<WalletTx[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [page, setPage] = React.useState<number>(initialPage);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const canRun = enabled && !!address;

  const fetchPage = React.useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      if (!canRun || !address) {
        setRows([]);
        setError(null);
        setHasMore(true);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const apiKey = EXPLORER_KEYS[chain]; // mainnet keys only
        const chainid = chainIdFromChainKey(chain);

        const mkUrl = (action: "txlist" | "tokentx") => {
          const url = new URL(etherscanV2Base());
          url.searchParams.set("chainid", String(chainid));
          url.searchParams.set("module", "account");
          url.searchParams.set("action", action);
          url.searchParams.set("address", address);
          url.searchParams.set("startblock", "0");
          url.searchParams.set("endblock", "99999999");
          url.searchParams.set("page", String(targetPage));
          url.searchParams.set("offset", String(pageSize));
          url.searchParams.set("sort", "desc");
          if (apiKey) url.searchParams.set("apikey", apiKey);
          return url.toString();
        };

        // Pull BOTH:
        // - txlist: normal transactions (native transfers + contract calls)
        // - tokentx: ERC20 transfers (what you mostly care about)
        const [txRes, erc20Res] = await Promise.all([
          fetch(mkUrl("txlist"), {
            method: "GET",
            headers: { "content-type": "application/json" },
            cache: "no-store",
          }),
          fetch(mkUrl("tokentx"), {
            method: "GET",
            headers: { "content-type": "application/json" },
            cache: "no-store",
          }),
        ]);

        if (!txRes.ok) throw new Error(`Explorer txlist failed: ${txRes.status}`);
        if (!erc20Res.ok) throw new Error(`Explorer tokentx failed: ${erc20Res.status}`);

        const txJson = (await txRes.json()) as ExplorerResponse<ExplorerTxlistItem>;
        const erc20Json = (await erc20Res.json()) as ExplorerResponse<ExplorerTokenTxItem>;

        // handle errors vs "no tx"
        if (txJson.status === "0" && !isNoTxMessage(txJson.result) && !isNoTxMessage(txJson.message)) {
          throw new Error(String(typeof txJson.result === "string" ? txJson.result : txJson.message));
        }
        if (
          erc20Json.status === "0" &&
          !isNoTxMessage(erc20Json.result) &&
          !isNoTxMessage(erc20Json.message)
        ) {
          throw new Error(String(typeof erc20Json.result === "string" ? erc20Json.result : erc20Json.message));
        }

        const nativeList =
          txJson.status === "1" && Array.isArray(txJson.result) ? txJson.result : [];
        const erc20List =
          erc20Json.status === "1" && Array.isArray(erc20Json.result) ? erc20Json.result : [];

        const normalizedNative = nativeList
          .map((it) => normalizeTxlistItem(it, { chain, wallet: address }))
          .filter((x): x is WalletTx => !!x);

        const normalizedErc20 = erc20List
          .map((it) => normalizeTokentxItem(it, { chain, wallet: address }))
          .filter((x): x is WalletTx => !!x);

        // merge + sort newest first by timestamp
        const merged = [...normalizedErc20, ...normalizedNative].sort((a, b) => {
          const at = a.timestamp ?? Math.floor(a.createdAt / 1000);
          const bt = b.timestamp ?? Math.floor(b.createdAt / 1000);
          return bt - at;
        });

        // dedupe by id
        const seen = new Set<string>();
        const deduped = merged.filter((r) => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });

        // If either endpoint returns a full page, assume there are more pages.
        setHasMore(nativeList.length >= pageSize || erc20List.length >= pageSize);

        setRows((prev) => (mode === "append" ? [...prev, ...deduped] : deduped));
      } catch (e) {
        setError((e as Error)?.message ?? "Failed to load tx history");
        if (mode === "replace") setRows([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [address, canRun, chain, pageSize]
  );

  const refetch = React.useCallback(async () => {
    setPage(1);
    setHasMore(true);
    await fetchPage(1, "replace");
  }, [fetchPage]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore || isLoading) return;
    const next = page + 1;
    setPage(next);
    await fetchPage(next, "append");
  }, [fetchPage, hasMore, isLoading, page]);

  React.useEffect(() => {
    // reset on chain/address/enabled changes
    setPage(1);
    setHasMore(true);
    void fetchPage(1, "replace");
  }, [fetchPage, chain, address, enabled]);

  React.useEffect(() => {
    if (!refreshMs || !canRun) return;
    const t = window.setInterval(() => void fetchPage(1, "replace"), refreshMs);
    return () => window.clearInterval(t);
  }, [refreshMs, canRun, fetchPage]);

  return { rows, isLoading, error, page, hasMore, loadMore, refetch };
}
