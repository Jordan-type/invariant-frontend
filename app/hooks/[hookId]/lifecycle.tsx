export default function HookLifecyclePage({
  params,
}: {
  params: { hookId: string };
}) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Lifecycle</h1>
        <p className="text-sm text-muted-foreground">
          Hook <span className="font-mono">{params.hookId}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Coming soon.
        </p>
      </div>
    </div>
  );
}
