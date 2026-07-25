"""
Flipkart scraper (Playwright).

Same caveats as amazon_scraper.py: selectors below are a starting point
for you to verify against the live site (flipkart.com search results use
several different card layouts depending on category). This module is
not wired in by default — SCRAPER_MODE=mock uses app/services/mock_data.py
instead, which is what keeps the free beta reliable.
"""

from playwright.async_api import async_playwright

SEARCH_URL = "https://www.flipkart.com/search?q={query}"


async def scrape_flipkart(query: str, limit: int = 4) -> list[dict]:
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
                SEARCH_URL.format(query=query.replace(" ", "%20")),
                wait_until="domcontentloaded",
                timeout=15000,
            )

            # Flipkart shows a login modal on first load — dismiss it.
            close_btn = await page.query_selector("button._2KpZ6l._2doB4z")
            if close_btn:
                await close_btn.click()

            cards = await page.query_selector_all("div._1AtVbE")

            count = 0
            for card in cards:
                if count >= limit:
                    break

                title_el = await card.query_selector("div._4rR01T, a.s1Q9rs")
                price_el = await card.query_selector("div._30jeq3")
                image_el = await card.query_selector("img._396cs4")
                rating_el = await card.query_selector("div._3LWZlK")
                link_el = await card.query_selector("a._1fQZEK, a.s1Q9rs")

                if not (title_el and price_el and link_el):
                    continue

                title = await title_el.inner_text()
                price_text = await price_el.inner_text()
                image = await image_el.get_attribute("src") if image_el else None
                rating_text = await rating_el.inner_text() if rating_el else None
                href = await link_el.get_attribute("href")

                results.append(
                    {
                        "title": title.strip(),
                        "price": _parse_price(price_text),
                        "image": image,
                        "rating": _parse_rating(rating_text),
                        "url": f"https://www.flipkart.com{href}" if href else None,
                    }
                )
                count += 1
        except Exception as exc:
            print(f"[flipkart_scraper] failed for query='{query}': {exc}")
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
        return float(text)
    except ValueError:
        return None
