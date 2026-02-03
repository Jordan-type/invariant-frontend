"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { parseUnits } from "viem";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Spinner } from "@/components/ui/spinner";
import { TokenPicker } from "@/components/tokens/TokenPicker";
import { TxSuccessSheet } from "@/components/profile/wallet/TxSuccessSheet";

import { useTokenPriceUsd } from "@/lib/hooks/useTokenPriceUsd";
import { useTokenBalance } from "@/lib/hooks/useTokenBalance";
import { useSendToken } from "@/lib/hooks/useSendToken";
import type { ChainKey, Token } from "@/types/token-types";
import { cn } from "@/lib/utils";

function explorerTxUrl(chain: ChainKey, hash: string) {
  if (chain === "celo") return `https://celoscan.io/tx/${hash}`;
  if (chain === "base") return `https://basescan.org/tx/${hash}`;
  return `https://celoscan.io/tx/${hash}`;
}

export function WalletSendSheet({
  tokens,
  defaultToken,
  triggerClassName,
  chain, 
}: {
  tokens: Token[];
  defaultToken: Token;
  triggerClassName?: string;
  chain: ChainKey;
}) {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<Token>(defaultToken);
  const [to, setTo] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [lastHash, setLastHash] = React.useState<`0x${string}` | null>(null);


  const { formatted: balanceStr, raw: balanceRaw, isLoading: balLoading } = useTokenBalance(token, chain);
  const { send, isPending } = useSendToken(chain);

  const amountRef = React.useRef<HTMLInputElement | null>(null);
  const disabled = isPending || !to.trim() || !amount.trim();
  const canMax = !balLoading && Number(balanceStr) > 0;

  const exceedsBalance = React.useMemo(() => {
    try {
      if (!amount) return false;
      const want = parseUnits(amount, token.decimals);
      return want > balanceRaw;
    } catch {
      return false;
    }
  }, [amount, token.decimals, balanceRaw]);

  const onMax = () => {
    if (!canMax) return;
    // Keep it simple (string from formatUnits is already decimal-safe)
    setAmount(String(balanceStr));
  };

const { priceUsd } = useTokenPriceUsd(token);

const estUsd = React.useMemo(() => {
  const amt = Number(amount || 0);
  if (!priceUsd || !amt) return 0;
  return amt * priceUsd;
}, [amount, priceUsd]);


  const handleSubmit = async () => {
    if (disabled) return;
    if (exceedsBalance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      const hash = await send({ token, to, amount, chain });

      setLastHash(hash);
      setSuccessOpen(true);
      setOpen(false);

      toast.success("Transaction sent", { description: `Hash: ${hash.slice(0, 10)}…` });
    } catch (e: unknown) {
      toast.error("Send failed", { description: (e as Error)?.message ?? "Something went wrong." });
    }
  };

  return (
    <>
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className={cn("gap-2", triggerClassName)}>
          <Send className="h-4 w-4" />
          Send
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-border/60">
        <div className="mx-auto w-full max-w-xl p-4 pb-8 max-h-[85dvh] overflow-y-auto">
          <DrawerHeader className="px-0">
            <DrawerTitle>Send</DrawerTitle>
          </DrawerHeader>

          <Card className="bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Token</div>
                  
                  <div className="text-xs text-muted-foreground">
                    Balance:{" "}
                    <span className="tabular-nums text-foreground">
                      {balLoading ? "…" : balanceStr}
                    </span>{" "}
                    {token.symbol}
                  </div>
                </div>

                <TokenPicker tokens={tokens} value={token} onChange={setToken} />
              </div>

              <Separator className="bg-border/60" />

              <div className="space-y-2">
                <Label htmlFor="to">Recipient</Label>
                <Input
                  id="to"
                  placeholder="0x… or address"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border-border/70 bg-background/40"
                  enterKeyHint="next"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      amountRef.current?.focus();
                      // helps inside webviews
                      setTimeout(() => amountRef.current?.scrollIntoView({ block: "center" }), 50);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Make sure the address is on the same network.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={onMax}
                    disabled={!canMax}
                  >
                    Max
                  </Button>
                </div>
               <div className="relative">
                <Input
                  ref={amountRef}
                  id="amount"
                  placeholder={`0.00 ${token.symbol}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  enterKeyHint="done"
                  inputMode="decimal"
                    className={cn(
                      "border-border/70 bg-background/40 pr-16",
                      exceedsBalance && "border-destructive focus-visible:ring-destructive"
                    )}
                    onFocus={() => {
                      setTimeout(() => amountRef.current?.scrollIntoView({ block: "center" }), 50);
                    }}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                 {token.symbol}
                </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
  Est. USD:{" "}
  <span className="tabular-nums">
    {priceUsd ? `$${estUsd.toFixed(2)}` : "—"}
  </span>
  {!priceUsd ? <span className="ml-2 opacity-70">(no price)</span> : null}
                </div>
                
                  {exceedsBalance ? (
                    <div className="text-xs text-destructive">Amount exceeds balance</div>
                  ) : null}
                </div>

              <Button disabled={disabled || exceedsBalance} onClick={handleSubmit} className="w-full gap-2">
                {isPending && <Spinner className="size-4" />}
                Continue
              </Button>

              <p className="text-xs text-muted-foreground">
                UI-only for now. Next step: wire signing + transaction simulation.
              </p>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>

    <TxSuccessSheet
      open={successOpen}
      onClose={() => setSuccessOpen(false)}
      hash={lastHash}
      amount={amount}
      tokenSymbol={token.symbol}
      to={to}
      explorerUrl={lastHash ? explorerTxUrl(chain, lastHash): ""}
        onRepeat={() => {
          setSuccessOpen(false);
          setTo("");
          setAmount("");
          setOpen(true);
        }}
    />
  </>
  );
}
