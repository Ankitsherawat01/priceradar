"""
Amazon India scraper (Playwright).

IMPORTANT — read before enabling SCRAPER_MODE=live:
Amazon's HTML structure and anti-bot measures change frequently, and
scraping product pages may conflict with Amazon's Terms of Service.
This module is provided as a learning/starting template so you can see
the *shape* of a real scraper. Treat the CSS selectors below as a
starting point you will need to inspect and update yourself (right-click
-> Inspect on amazon.in) before this reliably works, and add your own
rate-limiting / retry logic for production use.

For the free beta, app/services/mock_data.py is used by default so the
product always works even while you iterate on this file.
"""

from playwright.async_api import async_playwright

SEARCH_URL = "https://www.amazon.in/s?k={query}"


async def scrape_amazon(query: str, limit: int = 4) -> list[dict]:
    results: list[dict] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0 Safari/537.36"
            )
        )

        try:
            await page.goto(
                SEARCH_URL.format(query=query.replace(" ", "+")),
                wait_until="domcontentloaded",
                timeout=15000,
            )

            cards = await page.query_selector_all(
                "div[data-component-type='s-search-result']"
            )

            for card in cards[:limit]:
                title_el = await card.query_selector("h2 a span")
                price_el = await card.query_selector("span.a-price > span.a-offscreen")
                image_el = await card.query_selector("img.s-image")
                rating_el = await card.query_selector("span.a-icon-alt")
                link_el = await card.query_selector("h2 a")

                title = await title_el.inner_text() if title_el else None
                price_text = await price_el.inner_text() if price_el else None
                image = await image_el.get_attribute("src") if image_el else None
                rating_text = await rating_el.inner_text() if rating_el else None
                href = await link_el.get_attribute("href") if link_el else None

                if not title or not price_text or not href:
                    continue

                results.append(
                    {
                        "title": title.strip(),
                        "price": _parse_price(price_text),
                        "image": image,
                        "rating": _parse_rating(rating_text),
                        "url": f"https://www.amazon.in{href}",
                    }
                )
        except Exception as exc:
            # Selector drift, CAPTCHA, or a network hiccup — never let a
            # scraper crash the API. The router falls back to mock data.
            print(f"[amazon_scraper] failed for query='{query}': {exc}")
        finally:
            await browser.close()

    return results


def _parse_price(text: str) -> int | None:
    digits = "".join(ch for ch in text if ch.isdigit())
    return int(digits) if digits else None


def _parse_rating(text: str | None) -> float | None:
    if not text:
        return None
    try:
        return float(text.split(" ")[0])
    except (ValueError, IndexError):
        return None
