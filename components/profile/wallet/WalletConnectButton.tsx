"use client";

import * as React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pickConnector } from "@/lib/wallet/pickConnector";

function shortAddr(a?: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

export function WalletConnectButton({
  className,
  isMiniapp,
}: {
  className?: string;
  isMiniapp?: boolean;
}) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    if (!error) return;
    // helpful for -32603
    // eslint-disable-next-line no-console
    console.log("Wallet connect error:", error);

    toast.error("Wallet connect failed", {
      description: error.message,
    });
  }, [error]);

  const preferred = React.useMemo(
    () =>
      pickConnector({
        connectors: connectors,
        isMiniapp,
        preferredIds: isMiniapp
          ? ["farcaster", "injected", "metaMask", "walletConnect"]
          : ["injected", "metaMask", "walletConnect"],
      }),
    [connectors, isMiniapp]
  );

  if (isConnected) {
    return (
      <Button
        variant="outline"
        className={cn("gap-2 border-border/70 bg-background/40", className)}
        onClick={() => {
          disconnect();
          toast.success("Disconnected");
        }}
      >
        <Wallet className="h-4 w-4" />
        {shortAddr(address)}
        <LogOut className="h-4 w-4 opacity-70" />
      </Button>
    );
  }

  return (
    <Button
      className={cn("gap-2", className)}
      disabled={!preferred || isPending}
      onClick={() => preferred && connect({ connector: preferred })}
    >
      <Wallet className="h-4 w-4" />
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
