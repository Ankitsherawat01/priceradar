"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/mockProducts";

const PLATFORM_META = {
  amazon: { label: "Amazon India", dot: "bg-[#FF9900]" },
  flipkart: { label: "Flipkart", dot: "bg-[#2874F0]" },
} as const;

export default function PlatformSection({
  platform,
  products,
}: {
  platform: "amazon" | "flipkart";
  products: Product[];
}) {
  const meta = PLATFORM_META[platform];

  if (products.length === 0) {
    return (
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h3 className="font-display text-lg font-semibold">
            {meta.label}
          </h3>
        </div>
        <div className="rounded-2xl glass ring-1 ring-black/5 dark:ring-white/10 p-6 text-sm text-ink-800/50 dark:text-ink-50/50">
          No {meta.label} listings found for this search yet.
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
        <h3 className="font-display text-lg font-semibold">{meta.label}</h3>
        <span className="text-xs text-ink-800/40 dark:text-ink-50/40">
          {products.length} listing{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rail flex gap-4 overflow-x-auto pb-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </motion.section>
  );
}
