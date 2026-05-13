import { cn } from '@/lib/utils';

function Bar({ className }: { className?: string }) {
  return <div className={cn('rounded bg-muted', className)} />;
}

function PanelSkeleton() {
  return (
    <div className="space-y-3 rounded-xl bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <Bar className="h-3 w-12" />
        <Bar className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Bar className="h-8 w-32" />
        <Bar className="h-10 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function TokenSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading swap form"
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="animate-pulse space-y-3">
        <PanelSkeleton />
        <div className="flex justify-center">
          <Bar className="h-11 w-11 rounded-full" />
        </div>
        <PanelSkeleton />
        <Bar className="h-12 w-full" />
      </div>
    </div>
  );
}
