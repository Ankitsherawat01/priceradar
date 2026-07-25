export function ProductCardSkeleton() {
  return (
    <div className="w-64 shrink-0 rounded-2xl glass ring-1 ring-black/5 dark:ring-white/10 p-4">
      <div className="skeleton mb-3 h-36 w-full rounded-xl" />
      <div className="skeleton mb-2 h-4 w-full rounded" />
      <div className="skeleton mb-3 h-4 w-2/3 rounded" />
      <div className="skeleton mb-2 h-6 w-1/2 rounded" />
      <div className="skeleton h-9 w-full rounded-xl" />
    </div>
  );
}

export function PlatformSectionSkeleton({ label }: { label: string }) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <div className="skeleton h-6 w-24 rounded" />
        <span className="text-xs text-ink-800/30 dark:text-ink-50/30">
          loading {label}…
        </span>
      </div>
      <div className="rail flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="mb-10 rounded-2xl glass ring-1 ring-black/5 dark:ring-white/10 p-6">
      <div className="skeleton mb-3 h-5 w-1/3 rounded" />
      <div className="skeleton mb-2 h-4 w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
    </div>
  );
}
