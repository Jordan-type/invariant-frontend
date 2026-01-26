import Link from "next/link";

const mockPools = [
  { id: "celo-cusd-celo", name: "CELO / cUSD" },
  { id: "base-usdc-eth", name: "USDC / ETH" },
];

export default function PoolsPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Pools</h1>
        <p className="text-muted-foreground mt-1">Mock list for deployment.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mockPools.map((p) => (
          <Link
            key={p.id}
            href={`/pools/${p.id}`}
            className="rounded-xl border border-border/60 bg-background/40 p-4 hover:bg-background/60 transition"
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">{p.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
