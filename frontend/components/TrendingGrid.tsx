"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { trendingItems } from "@/data/trending";

export default function TrendingGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-marigold-500">
            Trending right now
          </p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Popular electronics in India
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {trendingItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/search?q=${encodeURIComponent(item.query)}`}
              className="group block overflow-hidden rounded-2xl glass shadow-glass ring-1 ring-black/5 dark:ring-white/10 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-white dark:bg-ink-900">
                <Image
                  src={item.image}
                  alt={item.query}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{item.query}</p>
                <p className="mt-0.5 text-xs text-ink-800/50 dark:text-ink-50/50">
                  {item.category}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-marigold-600 dark:text-marigold-400">
                  from ₹{item.lowestPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
