// Shape returned by GET /api/search on the FastAPI backend.
// Kept here so the UI has real data to render against before the
// scraper + backend are deployed, and as an offline fallback.

export type RatingBreakdown = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

export type Product = {
  id: string;
  platform: "amazon" | "flipkart";
  title: string;
  image: string;
  seller: string;
  currentPrice: number;
  offerPrice: number | null;
  offerLabel: string | null;
  rating: number;
  ratingCount: number;
  ratingBreakdown: RatingBreakdown;
  deliveryInfo: string;
  buyUrl: string;
};

export type SearchResult = {
  query: string;
  aiSummary: {
    positive: string;
    negative: string;
    summary: string;
  };
  bestPrice: {
    platform: "amazon" | "flipkart";
    price: number;
  };
  products: Product[];
};

export const mockSearchResult: SearchResult = {
  query: "iPhone 15",
  aiSummary: {
    positive:
      "Users love the camera quality, smooth performance, and premium build.",
    negative:
      "Some report the phone heats up during long gaming sessions or camera use in the sun.",
    summary:
      "Users love the battery and camera but some report heating during gaming.",
  },
  bestPrice: { platform: "flipkart", price: 64999 },
  products: [
    {
      id: "amz-iphone15-1",
      platform: "amazon",
      title: "Apple iPhone 15 (128 GB) — Blue",
      image:
        "https://images.unsplash.com/photo-1697284960661-72d3c6f0f1a0?w=500&q=80",
      seller: "Appario Retail (Amazon)",
      currentPrice: 69999,
      offerPrice: 64999,
      offerLabel: "with HDFC Bank Card",
      rating: 4.5,
      ratingCount: 12894,
      ratingBreakdown: { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 },
      deliveryInfo: "Free delivery by tomorrow",
      buyUrl: "https://www.amazon.in/dp/EXAMPLE?tag=YOUR_AFFILIATE_TAG-21",
    },
    {
      id: "amz-iphone15-2",
      platform: "amazon",
      title: "Apple iPhone 15 (256 GB) — Black",
      image:
        "https://images.unsplash.com/photo-1695048065719-ac9b8f2c0c3c?w=500&q=80",
      seller: "Cloudtail India (Amazon)",
      currentPrice: 79900,
      offerPrice: 74900,
      offerLabel: "with ICICI Bank Card",
      rating: 4.4,
      ratingCount: 8021,
      ratingBreakdown: { 5: 64, 4: 22, 3: 8, 2: 4, 1: 2 },
      deliveryInfo: "Free delivery in 2 days",
      buyUrl: "https://www.amazon.in/dp/EXAMPLE2?tag=YOUR_AFFILIATE_TAG-21",
    },
    {
      id: "fk-iphone15-1",
      platform: "flipkart",
      title: "Apple iPhone 15 (Blue, 128 GB)",
      image:
        "https://images.unsplash.com/photo-1695048065719-ac9b8f2c0c3c?w=500&q=80",
      seller: "RetailNet (Flipkart)",
      currentPrice: 69900,
      offerPrice: 64999,
      offerLabel: "with Flipkart Axis Bank Card",
      rating: 4.6,
      ratingCount: 21033,
      ratingBreakdown: { 5: 72, 4: 18, 3: 6, 2: 2, 1: 2 },
      deliveryInfo: "Free delivery, get it by tomorrow",
      buyUrl: "https://www.flipkart.com/product/p/itmexample?affid=YOUR_ID",
    },
    {
      id: "fk-iphone15-2",
      platform: "flipkart",
      title: "Apple iPhone 15 (Black, 256 GB)",
      image:
        "https://images.unsplash.com/photo-1697284960661-72d3c6f0f1a0?w=500&q=80",
      seller: "SuperComNet (Flipkart)",
      currentPrice: 79900,
      offerPrice: 76900,
      offerLabel: "with Flipkart Axis Bank Card",
      rating: 4.5,
      ratingCount: 9876,
      ratingBreakdown: { 5: 66, 4: 21, 3: 8, 2: 3, 1: 2 },
      deliveryInfo: "Free delivery by Thu",
      buyUrl: "https://www.flipkart.com/product/p/itmexample2?affid=YOUR_ID",
    },
  ],
};
