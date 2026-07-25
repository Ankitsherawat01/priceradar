import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

export default function AISummary({
  summary,
  positive,
  negative,
}: {
  summary: string;
  positive: string;
  negative: string;
}) {
  return (
    <div className="rounded-2xl glass ring-1 ring-black/5 dark:ring-white/10 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white">
          <Sparkles size={14} />
        </span>
        <p className="font-display text-sm font-semibold">
          AI review summary
        </p>
        <span className="ml-auto rounded-full bg-black/[0.04] dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-ink-800/40 dark:text-ink-50/40">
          based on recent reviews
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-ink-800/70 dark:text-ink-50/70">
        &ldquo;{summary}&rdquo;
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
          <div className="mb-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ThumbsUp size={14} />
            <span className="text-xs font-semibold">What people love</span>
          </div>
          <p className="text-xs text-ink-800/60 dark:text-ink-50/60">
            {positive}
          </p>
        </div>
        <div className="rounded-xl bg-rose-500/10 p-3 ring-1 ring-rose-500/20">
          <div className="mb-1 flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <ThumbsDown size={14} />
            <span className="text-xs font-semibold">Common complaints</span>
          </div>
          <p className="text-xs text-ink-800/60 dark:text-ink-50/60">
            {negative}
          </p>
        </div>
      </div>
    </div>
  );
}
