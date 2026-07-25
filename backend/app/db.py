from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """
    Returns a single shared MongoDB client for the app's lifetime.
    Motor manages its own connection pool, so one client is all
    a small FastAPI app needs.
    """
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client


def get_db():
    return get_client()[settings.mongodb_db_name]


def get_cache_collection():
    """
    Stores the last scraped result per search query, so repeat searches
    (very common — "iPhone 15" gets searched constantly) don't re-trigger
    a full Playwright scrape every time. See app/routers/search.py for how
    the TTL is enforced.
    """
    return get_db()["search_cache"]
