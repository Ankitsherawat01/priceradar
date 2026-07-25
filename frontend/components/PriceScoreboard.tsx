"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A rotating "scoreboard" of illustrative price gaps between Amazon India
// and Flipkart for well-known products. This is the hero's signature visual:
// it makes the app's core promise (see both prices, side by side) legible
// in two seconds, before a single word of copy is read.
const ROUNDS = [
  { product: "iPhone 15", amazon: 69999, flipkart: 64999 },
  { product: "Galaxy S24", amazon: 62999, flipkart: 59999 },
  { product: "PlayStation 5", amazon: 51990, flipkart: 49990 },
  { product: "MacBook Air M2", amazon: 92990, flipkart: 89990 },
];

export default function PriceScoreboard() {
  const [round, setRound] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRound((r) => (r + 1) % ROUNDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const current = ROUNDS[round];
  const winner = current.flipkart < current.amazon ? "flipkart" : "amazon";
  const diff = Math.abs(current.amazon - current.flipkart);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl glass shadow-glass ring-1 ring-black/5 dark:ring-white/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.product}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="font-display text-sm font-semibold"
          >
            {current.product}
          </motion.p>
        </AnimatePresence>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-800/40 dark:text-ink-50/40">
          live comparison
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: "amazon", label: "Amazon", price: current.amazon },
            { key: "flipkart", label: "Flipkart", price: current.flipkart },
          ] as const
        ).map((row) => (
          <motion.div
            key={row.key}
            animate={{
              scale: winner === row.key ? 1.03 : 1,
            }}
            className={`rounded-xl px-3 py-3 ring-1 transition-colors ${
              winner === row.key
                ? "bg-marigold-500/10 ring-marigold-500/40"
                : "bg-black/[0.02] dark:bg-white/5 ring-black/5 dark:ring-white/10"
            }`}
          >
            <p className="text-xs font-medium text-ink-800/50 dark:text-ink-50/50">
              {row.label}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={row.price}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="font-mono text-lg font-semibold"
              >
                ₹{row.price.toLocaleString("en-IN")}
              </motion.p>
            </AnimatePresence>
            {winner === row.key && (
              <p className="mt-0.5 text-[11px] font-semibold text-marigold-600 dark:text-marigold-400">
                cheaper by ₹{diff.toLocaleString("en-IN")}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
