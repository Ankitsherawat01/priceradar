from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central place for every environment variable the backend needs.
    Values are read from a `.env` file locally, and from Render's
    "Environment" tab in production. Never hardcode secrets here.
    """

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "ecomcompare"

    # Comma-separated list of origins allowed to call this API.
    # In production this should be your Vercel frontend URL.
    cors_origins: str = "http://localhost:3000"

    # Affiliate tags — added to outgoing product links. Leave blank until
    # you've been approved for the Amazon Associates / Flipkart affiliate
    # programs, then fill these in as environment variables on Render.
    amazon_affiliate_tag: str = ""
    flipkart_affiliate_id: str = ""

    # Cache scraped results for this many seconds before re-scraping the
    # same query, to stay polite to Amazon/Flipkart and stay fast for users.
    cache_ttl_seconds: int = 1800

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
