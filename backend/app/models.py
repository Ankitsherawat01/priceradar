from typing import Literal, Optional
from pydantic import BaseModel, Field


class RatingBreakdown(BaseModel):
    """Percentage of reviews at each star level. Should sum to ~100."""

    five: int = Field(alias="5")
    four: int = Field(alias="4")
    three: int = Field(alias="3")
    two: int = Field(alias="2")
    one: int = Field(alias="1")

    model_config = {"populate_by_name": True}


class Product(BaseModel):
    id: str
    platform: Literal["amazon", "flipkart"]
    title: str
    image: str
    seller: str
    currentPrice: int
    offerPrice: Optional[int] = None
    offerLabel: Optional[str] = None
    rating: float
    ratingCount: int
    ratingBreakdown: RatingBreakdown
    deliveryInfo: str
    buyUrl: str


class AISummary(BaseModel):
    positive: str
    negative: str
    summary: str


class BestPrice(BaseModel):
    platform: Literal["amazon", "flipkart"]
    price: int


class SearchResult(BaseModel):
    """The exact shape the Next.js frontend expects from GET /api/search."""

    query: str
    aiSummary: AISummary
    bestPrice: BestPrice
    products: list[Product]
