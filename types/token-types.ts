export type ChainKey = "celo" | "base";

export type TokenRef = {
  chain: ChainKey;
  address: `0x${string}`; // required for onchain balance reads
};

export type Token = {
  id?: string;               // stable internal id, e.g. "celo:CELO" or "celo:cUSD"
  symbol: string;
  name: string;
  decimals: number;

  // multi-chain support
  addresses: Partial<Record<ChainKey, `0x${string}`>>;

  // metadata
  logoURI?: string;

  // pricing support (optional but scalable)
  coingeckoId?: string;     // easiest
  priceUsd?: number;        // hydrated at runtime, NOT stored permanently in list

  // explicit native marker (CELO on celo, ETH on base, etc.)
  isNative?: boolean;

  // used for gauge segments, charts, badges, etc.
  color?: string; // e.g. "#16a34a"
};
