// Mock "trending searches" shown on the homepage before real analytics exist.
// Once the backend tracks real search volume, swap this for a fetch to
// `${API_URL}/trending`.

export type TrendingItem = {
  id: string;
  query: string;
  category: string;
  image: string;
  lowestPrice: number;
};

export const trendingItems: TrendingItem[] = [
  {
    id: "iphone-15",
    query: "iPhone 15",
    category: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1697284960661-72d3c6f0f1a0?w=400&q=80",
    lowestPrice: 65999,
  },
  {
    id: "galaxy-s24",
    query: "Samsung Galaxy S24",
    category: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    lowestPrice: 59999,
  },
  {
    id: "ps5",
    query: "PlayStation 5",
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    lowestPrice: 49990,
  },
  {
    id: "macbook-air-m2",
    query: "MacBook Air M2",
    category: "Laptop",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80",
    lowestPrice: 89990,
  },
  {
    id: "buds-pro-2",
    query: "Galaxy Buds Pro 2",
    category: "Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    lowestPrice: 14999,
  },
  {
    id: "boat-airdopes",
    query: "boAt Airdopes 141",
    category: "Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658006821-e40056a63d8f?w=400&q=80",
    lowestPrice: 999,
  },
];
