"use client";

import * as React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSupportedChainIds } from "@/lib/protocol/tokens-registry";

type Props = {
  className?: string;
  variant?: "outline" | "default";
};

export function NetworkSwitcher({ className, variant = "outline" }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain, isPending, error } = useSwitchChain();

  React.useEffect(() => {
    if (error) toast.error("Network switch failed", { description: error.message });
  }, [error]);

  const supportedIds = React.useMemo(() => new Set(getSupportedChainIds()), []);
  const supportedChains = React.useMemo(
    () => chains.filter((c) => supportedIds.has(c.id)),
    [chains, supportedIds]
  );

  const current = React.useMemo(
    () => supportedChains.find((c) => c.id === chainId),
    [supportedChains, chainId]
  );

  const label = current?.name ?? `Chain ${chainId}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn("gap-2 border-border/70 bg-background/40", className)}
          disabled={isPending || !supportedChains.length}
          title={!isConnected ? "Connect wallet to switch networks" : "Switch network"}
        >
          <span className="truncate max-w-[140px]">
            {isPending ? "Switching…" : label}
          </span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[220px]">
        {supportedChains.map((c) => {
          const active = c.id === chainId;

          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => {
                if (active) return;
                switchChain?.({ chainId: c.id });
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{c.name}</span>
                <span className="text-xs text-muted-foreground">({c.id})</span>
              </div>
              {active ? <Check className="h-4 w-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
