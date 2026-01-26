import type { ChainKey, Token } from "../../types/token-types";

export const SUPPORTED_CHAINS: Record<ChainKey, { id: number; name: string }> = {
  celo: { id: 42220, name: "Celo" },
  base: { id: 8453, name: "Base" },
};

export function chainKeyFromChainId(chainId?: number): ChainKey {
  if (!chainId) return "celo";
  if (chainId === SUPPORTED_CHAINS.base.id) return "base";
  if (chainId === SUPPORTED_CHAINS.celo.id) return "celo";
  return "celo";
}

// NOTE: put real addresses here.
// CELO native is not ERC20. Treat it as "native" separately (below).

export const TOKENS: Record<ChainKey, Token[]> = {
  celo: [
    {
      id: "celo:CELO",
      symbol: "CELO",
      name: "Celo",
      decimals: 18,
      addresses: {}, // native token (no ERC20 address)
      isNative: true,
      coingeckoId: "celo",
      logoURI: "https://assets.coingecko.com/coins/images/11090/standard/InjXBNx9_400x400.jpg",
      color: "#facc15", // gold
    },
    {
      id: "celo:cUSD",
      symbol: "cUSD",
      name: "Celo Dollar",
      decimals: 18,
      addresses: {
        celo: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`, // <-- replace with real cUSD address
      },
      coingeckoId: "celo-dollar",
      logoURI: "https://assets.coingecko.com/coins/images/13161/standard/icon-celo-dollar-color-1000-circle-cropped.png",
      color: "#22c55e", // green
    },
    // add cEUR, cKES, cREAL with correct addresses + coingeckoId/logoURI
    {
      id: "celo:cEUR",
      symbol: "cEUR",
      name: "Celo Euro",
      decimals: 18,
      addresses: {
        celo: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" as `0x${string}`, // <-- replace with real cEUR address
      },
      coingeckoId: "celo-euro",
      logoURI: "https://assets.coingecko.com/coins/images/16756/standard/CEUR.png",
      color: "#60a5fa", // blue
    },
    {
      id: "celo:cKES",
      symbol: "cKES",
      name: "Celo KES",
      decimals: 18,
      addresses: {
        celo: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0" as `0x${string}`, // <-- replace with real cKES address
      },
      coingeckoId: "celo-kes",
      logoURI: "https://assets.coingecko.com/coins/images/38052/standard/cKES_200x200.png",
      color: "#a78bfa", // purple
    },
    {
      id: "celo:cREAL",
      symbol: "cREAL",
      name: "Celo Real",
      decimals: 18,
      addresses: {
        celo: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787" as `0x${string}`, // <-- replace with real cREAL address
      },
      coingeckoId: "celo-real",
      logoURI: "https://assets.coingecko.com/coins/images/27205/standard/creal.png",
      color: "#fb7185", // rose
    },
    {
      id: "celo:USDT",
      symbol: "USDT",
      name: "Celo Tether",
      decimals: 6,
      addresses: {
        celo: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as `0x${string}`, // <-- replace with real USDT address
      },
      coingeckoId: "celo-tether",
      logoURI: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
      color: "#14b8a6", // teal
    },
    {
      id: "celo:USDC",
      symbol: "USDC",
      name: "Celo USD Coin",
      decimals: 6,
      addresses: {
        celo: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as `0x${string}`, // <-- replace with real USDC address
      },
      coingeckoId: "celo-usdc",
      logoURI: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
      color: "#2563eb", // indigo
    },

  ],

  base: [
    {
      id: "base:ETH",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      addresses: {}, // native
      isNative: true, 
      coingeckoId: "ethereum",
      logoURI: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
      color: "#94a3b8", // slate
    },
    {
      id: "base:USDC",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      addresses: {
        base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`, // <-- replace with real base USDC
      },
      coingeckoId: "usd-coin",
      logoURI: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
      color: "#2563eb", // indigo
    },
    {
      id: "base:USDT",
      symbol: "USDT",
      name: "Tether",
      decimals: 6,
      addresses: {
        base: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2" as `0x${string}`, // <-- replace with real base USDT
      },
      coingeckoId: "tether",
      logoURI: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
      color: "#F5B7B1", // light red
    }
  ],
};

export function getTokens(chain: ChainKey) {
  return TOKENS[chain] ?? [];
}

export function getSupportedChainIds() {
  return Object.values(SUPPORTED_CHAINS).map((c) => c.id);
}