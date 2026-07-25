"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tag, WifiOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import PlatformSection from "@/components/PlatformSection";
import RatingBreakdown from "@/components/RatingBreakdown";
import AISummary from "@/components/AISummary";
import {
  OverviewSkeleton,
  PlatformSectionSkeleton,
} from "@/components/Skeletons";
import { fetchSearchResults } from "@/lib/api";
import type { SearchResult } from "@/data/mockProducts";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSearchResults(query)
      .then(({ data, isLive }) => {
        if (cancelled) return;
        setResult(data);
        setIsLive(isLive);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const amazonProducts =
    result?.products.filter((p) => p.platform === "amazon") ?? [];
  const flipkartProducts =
    result?.products.filter((p) => p.platform === "flipkart") ?? [];

  // Aggregate rating breakdown across all listings for the "overview" chart,
  // simple average weighted by rating count.
  const aggregateBreakdown = result
    ? averageBreakdown(result.products)
    : null;
  const aggregateRating = result
    ? weightedAverage(result.products.map((p) => [p.rating, p.ratingCount]))
    : 0;
  const aggregateCount = result
    ? result.products.reduce((sum, p) => sum + p.ratingCount, 0)
    : 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <SearchBar size="md" initialValue={query} />
        </div>

        {!query && (
          <p className="text-sm text-ink-800/50 dark:text-ink-50/50">
            Type a product above to compare Amazon India and Flipkart prices.
          </p>
        )}

        {query && !isLive && !loading && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2.5 text-xs font-medium text-indigo-500 dark:text-indigo-300">
            <WifiOff size={14} />
            Showing sample data — the live backend is unreachable right now.
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {loading && query && (
          <>
            <OverviewSkeleton />
            <PlatformSectionSkeleton label="Amazon" />
            <PlatformSectionSkeleton label="Flipkart" />
          </>
        )}

        {!loading && result && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
              <div className="rounded-2xl glass ring-1 ring-black/5 dark:ring-white/10 p-5 lg:col-span-1">
                <h1 className="mb-1 font-display text-xl font-semibold">
                  {result.query}
                </h1>
                <p className="mb-4 text-xs text-ink-800/50 dark:text-ink-50/50">
                  Comparing across Amazon India &amp; Flipkart
                </p>

                <div className="mb-4 flex items-center gap-2 rounded-xl bg-marigold-500/10 px-3 py-2.5 ring-1 ring-marigold-500/20">
                  <Tag size={16} className="text-marigold-600" />
                  <div>
                    <p className="text-[11px] text-ink-800/50 dark:text-ink-50/50">
                      Best price on{" "}
                      <span className="font-semibold capitalize">
                        {result.bestPrice.platform}
                      </span>
                    </p>
                    <p className="font-mono text-lg font-semibold text-marigold-600 dark:text-marigold-400">
                      ₹{result.bestPrice.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {aggregateBreakdown && (
                  <RatingBreakdown
                    breakdown={aggregateBreakdown}
                    rating={aggregateRating}
                    ratingCount={aggregateCount}
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                <AISummary
                  summary={result.aiSummary.summary}
                  positive={result.aiSummary.positive}
                  negative={result.aiSummary.negative}
                />
              </div>
            </motion.section>

            <PlatformSection platform="amazon" products={amazonProducts} />
            <PlatformSection platform="flipkart" products={flipkartProducts} />
          </>
        )}
      </div>
    </main>
  );
}

function weightedAverage(pairs: [number, number][]): number {
  const totalWeight = pairs.reduce((s, [, w]) => s + w, 0);
  if (totalWeight === 0) return 0;
  const sum = pairs.reduce((s, [v, w]) => s + v * w, 0);
  return Math.round((sum / totalWeight) * 10) / 10;
}

function averageBreakdown(products: SearchResult["products"]) {
  const totals = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (products.length === 0) return totals;
  products.forEach((p) => {
    (Object.keys(totals) as unknown as (keyof typeof totals)[]).forEach(
      (star) => {
        totals[star] += p.ratingBreakdown[star];
      }
    );
  });
  (Object.keys(totals) as unknown as (keyof typeof totals)[]).forEach(
    (star) => {
      totals[star] = Math.round(totals[star] / products.length);
    }
  );
  return totals;
}
