from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import search

app = FastAPI(
    title="PriceRadar API",
    description="Compares Amazon India and Flipkart electronics listings.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)


@app.get("/")
def root():
    """Simple health check — Render pings this to confirm the service is up."""
    return {"status": "ok", "service": "priceradar-api"}


@app.get("/health")
def health():
    return {"status": "healthy"}
