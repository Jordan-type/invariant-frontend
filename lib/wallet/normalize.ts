import type { WalletTx } from "@/types/tx-types";

export type ExplorerChain = WalletTx["chain"];

export type NormalizeCtx = {
  chain: ExplorerChain;
  wallet: `0x${string}`;
  // token lookup (optional but recommended)
  resolveToken?: (args: { chain: ExplorerChain; tokenAddress?: string; symbol?: string }) => {
    symbol: string;
    decimals: number;
    iconUrl?: string;
  } | null;

  // optional USD snapshot
  priceUsd?: (args: { chain: ExplorerChain; tokenSymbol: string; timestamp?: number }) => number | null;
};

// This is the ONLY thing your adapters must implement:
export function normalizeExplorerTx(raw: unknown, ctx: NormalizeCtx): WalletTx | null {
  // adapter chooses how to interpret raw, but must return WalletTx
  return null;
}
