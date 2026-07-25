"""
Lightweight, free "AI" review summarizer for the beta.

This intentionally avoids paid LLM APIs. It works by:
1. Keeping a small dictionary of feature keywords per product category
   (battery, camera, heating, display, sound, build quality, etc.)
2. Scanning raw review text (or, in the beta, a handful of scraped
   review snippets) for those keywords alongside simple positive/negative
   sentiment words nearby.
3. Turning the most frequent positive and negative mentions into a
   short, human-readable summary sentence.

Swapping this for a real LLM later is a drop-in replacement: keep the
same `generate_summary(reviews: list[str]) -> AISummarySummary` signature
and call an API inside it instead.
"""

from dataclasses import dataclass
import re

POSITIVE_WORDS = {
    "love",
    "great",
    "excellent",
    "amazing",
    "good",
    "smooth",
    "fast",
    "best",
    "perfect",
    "sharp",
    "crisp",
    "worth",
    "premium",
    "solid",
}

NEGATIVE_WORDS = {
    "heat",
    "heating",
    "hot",
    "slow",
    "lag",
    "issue",
    "problem",
    "poor",
    "bad",
    "disappointing",
    "crack",
    "broke",
    "broken",
    "drain",
    "draining",
}

FEATURE_KEYWORDS = {
    "battery": ["battery", "charge", "charging", "backup"],
    "camera": ["camera", "photo", "photos", "picture", "selfie"],
    "display": ["display", "screen", "brightness"],
    "performance": ["performance", "processor", "speed", "gaming", "lag"],
    "build": ["build", "design", "quality", "premium"],
    "sound": ["sound", "audio", "speaker", "bass"],
    "heating": ["heat", "heating", "hot", "warm"],
}


@dataclass
class AISummaryResult:
    positive: str
    negative: str
    summary: str


def _find_features(text: str, keywords: list[str]) -> bool:
    return any(re.search(rf"\b{k}\b", text) for k in keywords)


def generate_summary(reviews: list[str]) -> AISummaryResult:
    """
    Given a list of raw review text snippets, returns a short structured
    summary. Falls back to a generic, honest message if there isn't
    enough review text to analyze (e.g. a brand-new listing).
    """
    if not reviews:
        return AISummaryResult(
            positive="Not enough reviews yet to summarize what people like.",
            negative="Not enough reviews yet to summarize common complaints.",
            summary="This listing doesn't have enough reviews yet for an AI summary.",
        )

    sentences = [s.lower() for s in reviews]

    positive_features: list[str] = []
    negative_features: list[str] = []

    for feature, keywords in FEATURE_KEYWORDS.items():
        for sentence in sentences:
            if not _find_features(sentence, keywords):
                continue
            has_positive = any(w in sentence for w in POSITIVE_WORDS)
            has_negative = any(w in sentence for w in NEGATIVE_WORDS)
            if has_negative and feature not in negative_features:
                negative_features.append(feature)
            elif (
                has_positive
                and feature != "heating"
                and feature not in positive_features
            ):
                positive_features.append(feature)

    positive_text = (
        f"Users like the {', '.join(positive_features[:2])}."
        if positive_features
        else "Reviewers are generally satisfied with this product."
    )
    negative_text = (
        f"A few reviewers mention {', '.join(negative_features[:2])} concerns."
        if negative_features
        else "No major recurring complaints were found in recent reviews."
    )

    if positive_features and negative_features:
        summary = (
            f"Users love the {positive_features[0]} but some report "
            f"{negative_features[0]} issues."
        )
    elif positive_features:
        summary = f"Users mostly praise the {positive_features[0]}."
    else:
        summary = "Reviews are mixed with no single standout strength or issue."

    return AISummaryResult(
        positive=positive_text, negative=negative_text, summary=summary
    )


# Beta-only: mock review snippets used until the scraper pulls real
# reviews from product pages. Swap this out in scrapers/*.py once ready.
MOCK_REVIEWS_BY_QUERY = {
    "iphone 15": [
        "The camera on this phone is amazing, best I've used.",
        "Battery backup is good, lasts a full day easily.",
        "Phone gets a bit hot while gaming for long sessions.",
        "Build quality feels premium and solid.",
    ],
}


def get_mock_reviews(query: str) -> list[str]:
    return MOCK_REVIEWS_BY_QUERY.get(
        query.lower().strip(),
        [
            "Good value for money and smooth performance.",
            "Display quality is crisp and battery life is decent.",
            "A few users mention minor heating during heavy use.",
        ],
    )
