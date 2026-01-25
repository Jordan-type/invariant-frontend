import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TokenRow = {
  symbol: string;
  amount: number;
  price: number;
  usd: number;
};

export default function TokensTable({ tokens }: { tokens: TokenRow[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/60">
      <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs text-muted-foreground bg-background/40">
        <div>Token</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Per USD</div>
        <div className="text-right">USD Value</div>
      </div>

      <div className="divide-y divide-border/60">
        {tokens.map((t) => (
          <div
            key={t.symbol}
            className={cn(
              "grid grid-cols-4 gap-2 px-4 py-4 text-sm",
              "bg-card/30 hover:bg-card/50 transition"
            )}
          >
            <div className="font-medium">{t.symbol}</div>
            <div className="text-right tabular-nums">{t.amount.toLocaleString()}</div>
            <div className="text-right tabular-nums">{t.price.toFixed(5)}</div>
            <div className="text-right tabular-nums">${t.usd.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
