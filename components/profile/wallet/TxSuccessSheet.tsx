"use client";

import * as React from "react";
import { useWaitForTransactionReceipt } from "wagmi";

import { CheckCircle2, ExternalLink } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function TxSuccessSheet({
  open,
  onClose,
  hash,
  explorerUrl,
  amount,
  tokenSymbol,
  to,
  onRepeat,
}: {
  open: boolean;
  onClose: () => void;
  hash: `0x${string}` | null;
  explorerUrl: string;
  amount: string;
  tokenSymbol: string;
  to: string;
  onRepeat: () => void;
}) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: hash ?? undefined,
    query: { enabled: !!hash && open },
  });

  const title = isSuccess ? "Success" : isError ? "Failed" : "Pending";

  return (
   <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="border-border/60">
        <div className="mx-auto w-full max-w-xl p-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 space-y-4">
            {!isSuccess ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                {isError ? "Transaction failed." : "Waiting for confirmations…"}
              </div>
            ) : null}

            <div className="text-sm">
              <div className="text-muted-foreground">Sent</div>
              <div className="font-semibold">
                {amount} {tokenSymbol}
              </div>
            </div>

            <div className="text-sm">
              <div className="text-muted-foreground">To</div>
              <div className="font-mono break-all">{to}</div>
            </div>

            {explorerUrl && hash ? (
              <Button asChild variant="outline" className="w-full">
                <a href={explorerUrl} target="_blank" rel="noreferrer">
                  View on explorer
                </a>
              </Button>
            ) : null}

            <div className="flex gap-2">
              <Button className="w-full" onClick={onClose}>
                Done
              </Button>
              {onRepeat ? (
                <Button variant="outline" className="w-full" onClick={onRepeat}>
                  Repeat send
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
