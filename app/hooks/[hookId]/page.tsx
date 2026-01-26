export default function HookDetailsPage({
  params,
}: {
  params: { hookId: string };
}) {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Hook</h1>
      <p className="text-muted-foreground">
        Hook ID: <span className="font-mono">{params.hookId}</span>
      </p>
    </div>
  );
}
