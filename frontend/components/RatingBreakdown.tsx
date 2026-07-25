"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { RatingBreakdown as Breakdown } from "@/data/mockProducts";

export default function RatingBreakdown({
  breakdown,
  rating,
  ratingCount,
  compact = false,
}: {
  breakdown: Breakdown;
  rating: number;
  ratingCount: number;
  compact?: boolean;
}) {
  const rows: [keyof Breakdown, number][] = [5, 4, 3, 2, 1].map((n) => [
    n as keyof Breakdown,
    breakdown[n as keyof Breakdown],
  ]);

  return (
    <div>
      {!compact && (
        <div className="mb-3 flex items-center gap-2">
          <span className="font-display text-2xl font-semibold">
            {rating.toFixed(1)}
          </span>
          <Star size={18} className="fill-marigold-500 text-marigold-500" />
          <span className="text-xs text-ink-800/50 dark:text-ink-50/50">
            {ratingCount.toLocaleString("en-IN")} ratings
          </span>
        </div>
      )}
      <div className="space-y-1.5">
        {rows.map(([stars, pct]) => (
          <div key={stars} className="flex items-center gap-2 text-xs">
            <span className="w-8 shrink-0 text-ink-800/50 dark:text-ink-50/50">
              {stars}★
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-marigold-500"
              />
            </div>
            <span className="w-8 shrink-0 text-right text-ink-800/40 dark:text-ink-50/40">
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
