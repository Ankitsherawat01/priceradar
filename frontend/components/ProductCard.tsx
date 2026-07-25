"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Truck, ExternalLink } from "lucide-react";
import type { Product } from "@/data/mockProducts";

const PLATFORM_STYLES = {
  amazon: {
    badge: "bg-[#FF9900]/15 text-[#B86200] dark:text-[#FFB84D]",
    accent: "bg-[#FF9900]",
  },
  flipkart: {
    badge: "bg-[#2874F0]/15 text-[#2874F0] dark:text-[#7AA7F5]",
    accent: "bg-[#2874F0]",
  },
} as const;

export default function ProductCard({ product }: { product: Product }) {
  const style = PLATFORM_STYLES[product.platform];
  const discountPct =
    product.offerPrice != null
      ? Math.round(
          ((product.currentPrice - product.offerPrice) /
            product.currentPrice) *
            100
        )
      : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="w-64 shrink-0 overflow-hidden rounded-2xl glass shadow-glass ring-1 ring-black/5 dark:ring-white/10"
    >
      <div className="relative aspect-square w-full bg-white dark:bg-ink-900/40">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="256px"
          className="object-contain p-4"
        />
        {discountPct !== null && discountPct > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            {discountPct}% off
          </span>
        )}
      </div>

      <div className="p-4">
        <span
          className={`mb-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}
        >
          {product.platform}
        </span>

        <p
          className="mb-1 line-clamp-2 h-10 text-sm font-medium leading-tight"
          title={product.title}
        >
          {product.title}
        </p>
        <p className="mb-2 truncate text-[11px] text-ink-800/40 dark:text-ink-50/40">
          Sold by {product.seller}
        </p>

        <div className="mb-2 flex items-center gap-1.5">
          <Star size={13} className="fill-marigold-500 text-marigold-500" />
          <span className="text-xs font-semibold">{product.rating}</span>
          <span className="text-[11px] text-ink-800/40 dark:text-ink-50/40">
            ({product.ratingCount.toLocaleString("en-IN")})
          </span>
        </div>

        <div className="mb-1 flex items-baseline gap-2">
          {product.offerPrice != null ? (
            <>
              <span className="text-xs text-ink-800/40 dark:text-ink-50/40 line-through">
                ₹{product.currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="font-mono text-lg font-semibold">
                ₹{product.offerPrice.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="font-mono text-lg font-semibold">
              ₹{product.currentPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {product.offerLabel && (
          <p className="mb-3 text-[11px] font-medium text-marigold-600 dark:text-marigold-400">
            {product.offerLabel}
          </p>
        )}

        <div className="mb-3 flex items-center gap-1 text-[11px] text-ink-800/50 dark:text-ink-50/50">
          <Truck size={12} />
          {product.deliveryInfo}
        </div>

        <a
          href={product.buyUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`flex items-center justify-center gap-1.5 rounded-xl ${style.accent} py-2.5 text-sm font-semibold text-white transition-transform active:scale-95`}
        >
          Buy on {product.platform === "amazon" ? "Amazon" : "Flipkart"}
          <ExternalLink size={13} />
        </a>
      </div>
    </motion.div>
  );
}
