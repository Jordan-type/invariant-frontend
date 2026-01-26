export default function PoolDetailsPage({
  params,
}: {
  params: { poolId: string };
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Pool</h1>
      <p className="text-muted-foreground mt-2">
        Pool ID: <span className="font-mono">{params.poolId}</span>
      </p>
    </div>
  );
}
