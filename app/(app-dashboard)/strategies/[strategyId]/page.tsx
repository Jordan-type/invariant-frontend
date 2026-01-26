import Link from "next/link";

export default function StrategyDetailsPage({
  params,
}: {
  params: { strategyId: string };
}) {
  const id = params.strategyId;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Strategy</h1>
        <p className="text-muted-foreground mt-1">
          Strategy ID: <span className="font-mono">{id}</span>
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link className="rounded-lg border px-3 py-2 text-sm" href={`/strategies/${id}/config`}>
          Config
        </Link>
        <Link className="rounded-lg border px-3 py-2 text-sm" href={`/strategies/${id}/simulation`}>
          Simulation
        </Link>
        <Link className="rounded-lg border px-3 py-2 text-sm" href={`/strategies/${id}/activity`}>
          Activity
        </Link>
      </div>
    </div>
  );
}
