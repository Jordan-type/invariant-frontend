import { cn } from "@/lib/utils";
import type { WalletTokenRow } from "@/types/wallet-types";



export default function TokensTable({ tokens }: { tokens: WalletTokenRow[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/60">
      <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs text-muted-foreground bg-background/40">
        <div>Token</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Per USD</div>
        <div className="text-right">USD Value</div>
      </div>

      <div className="divide-y divide-border/60">
        {tokens.map((t) => {
          const symbol = t.symbol;
          const name = t.name;
          const logo = t.logoURI;

          const amount = Number(t.amount || 0);
          const price = Number(t.priceUsd ?? 0);
          const usd = Number(t.usdValue ?? 0);

          return (
            <div
              key={t.id}
              className={cn(
                "grid grid-cols-4 gap-2 px-4 py-4 text-sm",
                "bg-card/30 hover:bg-card/50 transition"
              )}
            >
              <div className="font-medium flex items-center gap-2">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt={symbol} className="h-5 w-5 rounded-full" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-border/60 bg-background/40" />
                )}
                <div className="leading-tight">
                  <div>{symbol}</div>
                  {name ? <div className="text-xs text-muted-foreground">{name}</div> : null}
                </div>
              </div>

              <div className="text-right tabular-nums">{amount.toLocaleString()}</div>
              <div className="text-right tabular-nums">{price ? price.toFixed(5) : "—"}</div>
              <div className="text-right tabular-nums">${usd.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
