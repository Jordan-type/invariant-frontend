import type { ChainKey, Token } from "./token-types";

export type WalletTokenRow = {
  // identity
  id: string;
  chain: ChainKey;

  // token meta
  symbol: string;
  name: string;
  decimals: number;

  logoURI?: string;
  address?: `0x${string}`;  // addresses (ERC20 only)
  isNative?: boolean;

  // balances
  raw: bigint; // raw onchain amount
  amount: string; // human readable string (already formatted)

  // pricing
  priceUsd?: number;
  usdValue?: number;

  // back-reference
  token: Token;

  color?: string;
};

export type WalletBalancesResult = {
  address?: `0x${string}`;
  chain: ChainKey;

  isConnected: boolean;
  isLoading: boolean;
  error?: string;

  rows: WalletTokenRow[];
  totalUsd: number;
};
