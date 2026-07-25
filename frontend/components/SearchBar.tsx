"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";

const PLACEHOLDER_QUERIES = [
  "iPhone 15",
  "Samsung Galaxy S24",
  "PlayStation 5",
  "MacBook Air M2",
  "boAt Airdopes 141",
];

const SUGGESTION_POOL = [
  "iPhone 15",
  "iPhone 15 Pro",
  "Samsung Galaxy S24",
  "Samsung Galaxy S24 Ultra",
  "PlayStation 5",
  "PlayStation 5 Slim",
  "MacBook Air M2",
  "MacBook Pro M3",
  "boAt Airdopes 141",
  "Sony WH-1000XM5",
  "Galaxy Buds Pro 2",
  "Dell XPS 13",
];

type Props = {
  size?: "lg" | "md";
  autoFocus?: boolean;
  initialValue?: string;
};

export default function SearchBar({
  size = "lg",
  autoFocus = false,
  initialValue = "",
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate the placeholder text every few seconds when the input is empty,
  // giving the homepage a bit of life without needing user interaction.
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_QUERIES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    return SUGGESTION_POOL.filter((s) =>
      s.toLowerCase().includes(value.trim().toLowerCase())
    ).slice(0, 5);
  }, [value]);

  function goToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const heights = size === "lg" ? "h-16 text-lg" : "h-12 text-base";

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch(value);
        }}
        className={`group flex ${heights} items-center gap-3 rounded-2xl glass shadow-glass px-5 ring-1 ring-black/5 dark:ring-white/10 transition-all focus-within:ring-2 focus-within:ring-marigold-500/60`}
      >
        <Search
          size={size === "lg" ? 22 : 18}
          className="shrink-0 text-ink-800/40 dark:text-ink-50/40 group-focus-within:text-marigold-500 transition-colors"
        />
        <div className="relative flex-1">
          <input
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            className="w-full bg-transparent outline-none placeholder:text-ink-800/35 dark:placeholder:text-ink-50/30"
            placeholder=" "
            aria-label="Search for an electronics product"
          />
          {!value && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-ink-800/35 dark:text-ink-50/30"
                >
                  Search &ldquo;{PLACEHOLDER_QUERIES[placeholderIndex]}&rdquo;
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="rounded-xl bg-marigold-500 px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-marigold-600 active:scale-95 transition-all sm:px-6"
        >
          Compare
        </button>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl glass shadow-glass ring-1 ring-black/5 dark:ring-white/10"
          >
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  onMouseDown={() => goToSearch(s)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm hover:bg-marigold-50 dark:hover:bg-white/5 transition-colors"
                >
                  <TrendingUp
                    size={14}
                    className="text-ink-800/30 dark:text-ink-50/30"
                  />
                  {s}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
