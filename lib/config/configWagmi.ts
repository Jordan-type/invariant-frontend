import { http, createConfig } from "wagmi";
import { base, baseSepolia, celo, celoAlfajores, optimism } from "wagmi/chains";
import { injected, safe, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

const connectors = [
  injected(),
  safe(),
  ...(projectId ? [walletConnect({ projectId })] : []),
] as const;

export const config = createConfig({
  chains: [base, baseSepolia, celo, celoAlfajores, optimism],
  multiInjectedProviderDiscovery: false,
  connectors,
  ssr: true,
  transports: {
    [baseSepolia.id]: http(), // optionally add custom RPC URL
    [base.id]: http(), // optionally add custom RPC URL
    [celo.id]: http(process.env.NEXT_PUBLIC_CELO_RPC ?? "https://forno.celo.org"), // optionally add custom RPC URL
    [celoAlfajores.id]: http(process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC ?? "https://alfajores-forno.celo.org"), // optionally add custom RPC URL
    [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC ?? "https://opt-mainnet.g.alchemy.com/v2/demo"), // optionally add custom RPC URL
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}