import Link from "next/link";

const mockHooks = [
  { id: "hook-001", name: "Dynamic Fee Hook" },
  { id: "hook-002", name: "MEV Shield Hook" },
];

export default function HooksPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Hooks</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {mockHooks.map((h) => (
          <Link
            key={h.id}
            href={`/hooks/${h.id}`}
            className="rounded-xl border border-border/60 bg-background/40 p-4 hover:bg-background/60 transition"
          >
            <div className="font-medium">{h.name}</div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">{h.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
