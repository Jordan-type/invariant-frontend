"use client";

import * as React from "react";
import { Copy, QrCode, Share } from "lucide-react";
import { toast } from "sonner";

import type { Token } from "@/types/token-types";
import { cn } from "@/lib/utils";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TokenPicker } from "@/components/tokens/TokenPicker";
import { Spinner } from "@/components/ui/spinner";
import WalletQrCode from "./WalletQrCode";


export function WalletReceiveSheet({
  address,
  tokens,
  defaultToken,
  triggerClassName,
}: {
  address: string;
  tokens: Token[];
  defaultToken: Token;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<Token>(defaultToken);
  const [copying, setCopying] = React.useState(false);

  // your QR payload (can be deep link later)
  const payload = React.useMemo(() => {
    const safe = address?.trim();
    const sym = token?.symbol ?? "TOKEN";
    return `${safe}?token=${encodeURIComponent(sym)}`;
  }, [address, token?.symbol]);

  const copy = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(address);
      toast.success("Copied", { description: "Wallet address copied to clipboard." });
    } catch {
      toast.error("Copy failed", { description: "Clipboard permission denied." });
    } finally {
      setCopying(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2 border-border/70 bg-background/40", triggerClassName)}
        >
          <QrCode className="h-4 w-4" />
          Receive
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-border/60">
        <div className="mx-auto w-full max-w-xl p-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>Receive</DrawerTitle>
          </DrawerHeader>

          <Card className="bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Select token (optional)</div>
                <TokenPicker tokens={tokens} value={token} onChange={setToken} />
              </div>

              <Separator className="bg-border/60" />

              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Your address</div>
                  <div className="rounded-xl border border-border/60 bg-background/40 p-3 font-mono text-sm break-all">
                    {address}
                  </div>

                  <Button onClick={copy} className="w-full gap-2" disabled={copying}>
                    {copying ? <Spinner /> : <Copy className="h-4 w-4" />}
                    Copy address
                  </Button>
                </div>

                <div className="flex justify-center">
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    {/* QR renders instantly */}
                    <WalletQrCode value={payload} />
                    <div className="mt-2 text-xs text-muted-foreground break-all">
                      {payload}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Tip: only send {token.symbol} to this address on the selected network.
              </p>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
