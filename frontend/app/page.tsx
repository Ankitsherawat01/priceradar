import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TrendingGrid from "@/components/TrendingGrid";
import PriceScoreboard from "@/components/PriceScoreboard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-grid-light dark:bg-grid-dark bg-[length:32px_32px]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-2 lg:pt-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 font-mono text-xs font-medium text-indigo-500 dark:text-indigo-300">
            Amazon India × Flipkart · Electronics beta
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            One search.
            <br />
            <span className="text-marigold-500">Every best price.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-800/60 dark:text-ink-50/60 sm:text-lg">
            Search any phone, laptop, console, or earbud once — PriceRadar
            shows you Amazon and Flipkart listings side by side, so you never
            overpay again.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar size="lg" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["iPhone 15", "PS5", "Samsung S24", "laptops", "earbuds"].map(
              (tag) => (
                <a
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-full glass px-3 py-1.5 text-xs font-medium text-ink-800/60 dark:text-ink-50/60 ring-1 ring-black/5 dark:ring-white/10 hover:text-marigold-500 hover:ring-marigold-500/40 transition-colors"
                >
                  {tag}
                </a>
              )
            )}
          </div>
        </div>

        <PriceScoreboard />
      </section>

      <TrendingGrid />

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-ink-800/40 dark:text-ink-50/40 sm:px-6">
        PriceRadar beta · Prices shown are indicative and refresh periodically
        · Not affiliated with Amazon or Flipkart.
      </footer>
    </main>
  );
}
