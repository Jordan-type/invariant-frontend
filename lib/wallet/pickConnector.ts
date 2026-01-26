import type { Connector } from "wagmi";

type PickArgs = {
  connectors: readonly Connector[];
  isMiniapp?: boolean;
  preferredIds?: string[];   // e.g. ["farcaster", "injected", "metaMask", "walletConnect"]
};

/**
 * Never index connectors[0]. Some wagmi builds type this as a readonly object/tuple.
 * Instead: normalize + pick by id/name.
 */
export function pickConnector({ connectors, isMiniapp, preferredIds }: PickArgs) {
  const list = Array.from(connectors ?? []);

  // If caller passes a priority list, respect it
  if (preferredIds?.length) {
    for (const id of preferredIds) {
      const found =
        list.find((c) => c.id === id) ??
        list.find((c) => c.name?.toLowerCase().includes(id.toLowerCase()));
      if (found) return found;
    }
  }

  // Miniapp-first logic (customize to your Farcaster connector id if you use one)
  if (isMiniapp) {
    const farcaster =
      list.find((c) => c.id === "farcaster") ||
      list.find((c) => c.name?.toLowerCase().includes("farcaster"));
    if (farcaster) return farcaster;
  }

  // Mobile-first: injected/metamask first, then WC
  const injected = list.find((c) => c.id === "injected");
  if (injected) return injected;

  const metaMask =
    list.find((c) => c.id === "metaMask") ||
    list.find((c) => c.name?.toLowerCase().includes("metamask"));
  if (metaMask) return metaMask;

  const walletConnect =
    list.find((c) => c.id === "walletConnect") ||
    list.find((c) => c.name?.toLowerCase().includes("walletconnect"));
  if (walletConnect) return walletConnect;

  return list[0];
}
