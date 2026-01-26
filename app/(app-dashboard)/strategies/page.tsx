import Link from "next/link";

const mockStrategies = [
  { id: "mean-revert-001", name: "Mean Revert" },
  { id: "grid-002", name: "Grid Strategy" },
];

export default function StrategiesPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Strategies</h1>
        <p className="text-muted-foreground mt-1">Mock list for deployment.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mockStrategies.map((s) => (
          <Link
            key={s.id}
            href={`/strategies/${s.id}`}
            className="rounded-xl border border-border/60 bg-background/40 p-4 hover:bg-background/60 transition"
          >
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">{s.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
