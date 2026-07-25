import os
import time

from fastapi import APIRouter, Query

from app.config import settings
from app.db import get_cache_collection
from app.models import SearchResult
from app.services import mock_data
from app.services.ai_summary import generate_summary, get_mock_reviews

router = APIRouter(prefix="/api", tags=["search"])

# "mock" (default, always-on for the free beta) or "live" (real Playwright
# scraping — see app/scrapers/*.py and its caveats before switching this).
SCRAPER_MODE = os.getenv("SCRAPER_MODE", "mock")


@router.get("/search", response_model=SearchResult)
async def search(q: str = Query(..., min_length=1, description="Product to search for")):
    query = q.strip()

    cached = await _get_cached(query)
    if cached:
        return cached

    if SCRAPER_MODE == "live":
        result = await _search_live(query)
    else:
        result = _search_mock(query)

    await _set_cached(query, result)
    return result


def _search_mock(query: str) -> dict:
    amazon_raw = mock_data.generate_mock_products(query, "amazon")
    flipkart_raw = mock_data.generate_mock_products(query, "flipkart")
    return _assemble_result(query, amazon_raw, flipkart_raw)


async def _search_live(query: str) -> dict:
    """
    Real scraping path. Imported lazily so the mock-mode beta doesn't
    require Playwright's browser binaries to be installed to boot.
    """
    from app.scrapers.amazon_scraper import scrape_amazon
    from app.scrapers.flipkart_scraper import scrape_flipkart

    amazon_scraped = await scrape_amazon(query)
    flipkart_scraped = await scrape_flipkart(query)

    # Scraping is best-effort; if a platform returns nothing (blocked,
    # selector drift, etc.) fall back to mock data for that platform only,
    # so the page still looks complete for demos.
    amazon_raw = (
        _normalize_scraped(amazon_scraped, "amazon")
        if amazon_scraped
        else mock_data.generate_mock_products(query, "amazon")
    )
    flipkart_raw = (
        _normalize_scraped(flipkart_scraped, "flipkart")
        if flipkart_scraped
        else mock_data.generate_mock_products(query, "flipkart")
    )

    return _assemble_result(query, amazon_raw, flipkart_raw)


def _normalize_scraped(items: list[dict], platform: str) -> list[dict]:
    """Fills in the fields a raw scrape doesn't provide (rating breakdown,
    delivery info, etc.) with sensible defaults so the schema is complete."""
    normalized = []
    for i, item in enumerate(items):
        price = item.get("price") or 0
        normalized.append(
            {
                "id": f"{platform}-live-{i}",
                "platform": platform,
                "title": item.get("title", "Unknown product"),
                "image": item.get("image") or "",
                "seller": platform.title(),
                "currentPrice": price,
                "offerPrice": None,
                "offerLabel": None,
                "rating": item.get("rating") or 0,
                "ratingCount": 0,
                "ratingBreakdown": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0},
                "deliveryInfo": "Delivery details on product page",
                "buyUrl": _apply_affiliate_tag(item.get("url", ""), platform),
            }
        )
    return normalized


def _apply_affiliate_tag(url: str, platform: str) -> str:
    if platform == "amazon" and settings.amazon_affiliate_tag:
        sep = "&" if "?" in url else "?"
        return f"{url}{sep}tag={settings.amazon_affiliate_tag}"
    if platform == "flipkart" and settings.flipkart_affiliate_id:
        sep = "&" if "?" in url else "?"
        return f"{url}{sep}affid={settings.flipkart_affiliate_id}"
    return url


def _assemble_result(query: str, amazon_raw: list[dict], flipkart_raw: list[dict]) -> dict:
    all_products = amazon_raw + flipkart_raw

    # Resolve affiliate placeholders left by mock_data for mock mode too,
    # so the URL structure is affiliate-ready even before scraping is live.
    for p in all_products:
        p["buyUrl"] = (
            p["buyUrl"]
            .replace("{AMAZON_AFFILIATE_TAG}", settings.amazon_affiliate_tag or "YOUR_TAG-21")
            .replace("{FLIPKART_AFFILIATE_ID}", settings.flipkart_affiliate_id or "YOUR_ID")
        )

    reviews = get_mock_reviews(query)
    summary = generate_summary(reviews)

    best = min(
        all_products,
        key=lambda p: p["offerPrice"] if p["offerPrice"] is not None else p["currentPrice"],
        default=None,
    )
    best_price = (
        {
            "platform": best["platform"],
            "price": best["offerPrice"] or best["currentPrice"],
        }
        if best
        else {"platform": "amazon", "price": 0}
    )

    return {
        "query": query,
        "aiSummary": {
            "positive": summary.positive,
            "negative": summary.negative,
            "summary": summary.summary,
        },
        "bestPrice": best_price,
        "products": all_products,
    }


async def _get_cached(query: str) -> dict | None:
    try:
        collection = get_cache_collection()
        doc = await collection.find_one({"_id": query.lower()})
        if not doc:
            return None
        if time.time() - doc.get("cachedAt", 0) > settings.cache_ttl_seconds:
            return None
        return doc.get("result")
    except Exception as exc:
        # MongoDB not configured/reachable yet (e.g. fresh local setup).
        # Caching is a performance nicety, not a requirement — degrade
        # gracefully instead of breaking search.
        print(f"[search] cache read skipped: {exc}")
        return None


async def _set_cached(query: str, result: dict) -> None:
    try:
        collection = get_cache_collection()
        await collection.update_one(
            {"_id": query.lower()},
            {"$set": {"result": result, "cachedAt": time.time()}},
            upsert=True,
        )
    except Exception as exc:
        print(f"[search] cache write skipped: {exc}")
