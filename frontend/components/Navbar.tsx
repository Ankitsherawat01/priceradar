import Link from "next/link";
import { Radar } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-marigold-500 text-white shadow-glow group-hover:rotate-12 transition-transform">
            <Radar size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Price<span className="text-marigold-500">Radar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-800/70 dark:text-ink-50/70 sm:flex">
          <Link href="/" className="hover:text-marigold-500 transition-colors">
            Home
          </Link>
          <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-500 dark:text-indigo-300">
            Electronics · India Beta
          </span>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
