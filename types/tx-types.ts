export type TxStatus = "pending" | "confirmed" | "failed";
export type TxDirection = "sent" | "received";
export type TxKind = "transfer" | "approval" | "swap" | "contract";

export type TxToken = {
  address?: `0x${string}`;      // undefined for native
  symbol: string;
  decimals: number;
  iconUrl?: string;
};

export type WalletTx = {
  id: string;                   // `${chain}:${hash}:${logIndex?}`
  chain: "celo" | "base" | "optimism" | "celoAlfajores" | "baseSepolia";
  hash: `0x${string}`;
  status: TxStatus;

  kind: TxKind;                 // v1: mostly "transfer"
  direction: TxDirection;       // sent/received (relative to wallet)
  from: `0x${string}`;
  to: `0x${string}`;

  token: TxToken;               // token metadata for display
  valueRaw: string;             // bigint as string (atomic units)
  valueFormatted: string;       // already formatted for UI (e.g. "1.25")
  valueUsd?: number;            // optional if you have priceUsd snapshots

  feeRaw?: string;              // gasUsed*effectiveGasPrice as string
  feeUsd?: number;

  blockNumber?: number;         // pending can be undefined
  timestamp?: number;           // unix seconds (pending can be undefined)

  // helpful extras
  nonce?: number;
  explorerUrl?: string;
  createdAt: number;            // local record time (ms)
  updatedAt: number;            // local record time (ms)
};

export type WalletTxTableFilters = {
  tab?: "all" | "pending" | "sent" | "received" | "failed";
  search?: string;          // hash or address
  token?: string;           // symbol
  kind?: TxKind | "all";
};

export function WalletTxTable(props: {
  walletAddress?: `0x${string}`;
  rows: WalletTx[];
  isLoading?: boolean;
  filters: WalletTxTableFilters;
  onFiltersChange: (next: WalletTxTableFilters) => void;
  explorerTxUrl: (chain: WalletTx["chain"], hash: `0x${string}`) => string;
}) {}
