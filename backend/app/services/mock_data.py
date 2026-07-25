"""
Deterministic mock product generator.

Live scraping (see app/scrapers/*.py) is fragile by nature: Amazon and
Flipkart change their HTML structure often, rate-limit scrapers, and can
show CAPTCHAs. For a free, always-up beta, this module is the DEFAULT
data source (SCRAPER_MODE=mock). It generates believable-looking results
for *any* search query so the product experience always works, while
the real scrapers can be developed and tested separately and switched on
later with SCRAPER_MODE=live once you've hardened them.
"""

import hashlib
import random

PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&q=80"

AMAZON_SELLERS = ["Appario Retail", "Cloudtail India", "RP Tech Vision"]
FLIPKART_SELLERS = ["RetailNet", "SuperComNet", "OmniTechRetail"]


def _seeded_random(query: str, salt: str) -> random.Random:
    # Same query always generates the same mock numbers, so search
    # results don't jump around between page reloads within a session.
    seed = int(hashlib.sha256(f"{query}-{salt}".encode()).hexdigest(), 16)
    return random.Random(seed)


def _base_price(query: str) -> int:
    rng = _seeded_random(query, "price")
    return rng.randrange(999, 150000, 500)


def _rating_breakdown(rng: random.Random) -> dict:
    five = rng.randint(55, 75)
    four = rng.randint(12, 25)
    three = rng.randint(4, 10)
    two = rng.randint(1, 5)
    one = max(0, 100 - five - four - three - two)
    return {"5": five, "4": four, "3": three, "2": two, "1": one}


def generate_mock_products(query: str, platform: str, count: int = 4) -> list[dict]:
    sellers = AMAZON_SELLERS if platform == "amazon" else FLIPKART_SELLERS
    base = _base_price(query)
    products = []

    for i in range(count):
        rng = _seeded_random(query, f"{platform}-{i}")
        price = base + rng.randrange(-2000, 6000, 100)
        price = max(price, 499)
        has_offer = rng.random() > 0.25
        offer_price = price - rng.randrange(500, 5000, 100) if has_offer else None
        offer_bank = rng.choice(["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI"])

        products.append(
            {
                "id": f"{platform}-{query.lower().replace(' ', '-')}-{i}",
                "platform": platform,
                "title": f"{query.title()}",
                "image": PLACEHOLDER_IMAGE,
                "seller": f"{rng.choice(sellers)} ({platform.title()})",
                "currentPrice": price,
                "offerPrice": offer_price,
                "offerLabel": f"with {offer_bank} Card" if has_offer else None,
                "rating": round(rng.uniform(3.9, 4.8), 1),
                "ratingCount": rng.randint(200, 25000),
                "ratingBreakdown": _rating_breakdown(rng),
                "deliveryInfo": rng.choice(
                    [
                        "Free delivery by tomorrow",
                        "Free delivery in 2 days",
                        "Get it in 3-5 days",
                    ]
                ),
                "buyUrl": _mock_buy_url(platform, query, i),
            }
        )

    return products


def _mock_buy_url(platform: str, query: str, index: int) -> str:
    slug = query.lower().replace(" ", "-")
    if platform == "amazon":
        # Replace {AMAZON_AFFILIATE_TAG} at request time using settings.
        return f"https://www.amazon.in/s?k={slug}&tag={{AMAZON_AFFILIATE_TAG}}"
    return f"https://www.flipkart.com/search?q={slug}&affid={{FLIPKART_AFFILIATE_ID}}"
