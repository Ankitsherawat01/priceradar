# PriceRadar — Amazon India vs Flipkart Price Comparison (Free Beta)

A Smartprix/Google-Shopping-style app: search an electronics product once,
see Amazon India and Flipkart listings **side by side, in their own
sections** (never merged), with prices, offers, ratings, and a short
AI-style review summary.

This README is written for a **first-time full-stack builder**. Follow it
top to bottom — every command is copy-pasteable.

---

## 1. How the pieces fit together

```
┌─────────────────┐        HTTPS         ┌──────────────────┐        ┌───────────────────┐
│   Next.js App    │  GET /api/search?q=  │   FastAPI API     │        │   MongoDB Atlas    │
│  (Vercel, free)  │ ───────────────────► │  (Render, free)   │ ─────► │  (free M0 cluster)  │
│                  │ ◄─────────────────── │                   │        │  caches results     │
└─────────────────┘   JSON: products,     └──────────────────┘        └───────────────────┘
                       ratings, AI summary          │
                                                     │ (SCRAPER_MODE=live only)
                                                     ▼
                                         ┌─────────────────────┐
                                         │ Playwright scrapers  │
                                         │ (amazon / flipkart)  │
                                         └─────────────────────┘
```

**Key beta decision:** the backend defaults to `SCRAPER_MODE=mock`. It
generates realistic, consistent product data for *any* search term
instead of scraping live. This is what makes the free beta reliable —
Amazon/Flipkart scraping is fragile (they change HTML, block bots, show
CAPTCHAs), and a broken scraper would mean a broken app. Real scraper
code is included and ready to harden and switch on later
(`SCRAPER_MODE=live`) once you've tested it against the live sites.

---

## 2. Folder structure

```
ecomcompare/
├── frontend/                      # Next.js app — deploys to Vercel
│   ├── app/
│   │   ├── layout.tsx             # Root HTML shell, fonts, dark-mode init script
│   │   ├── globals.css            # Tailwind + glass/skeleton utility classes
│   │   ├── page.tsx                # Homepage: hero, search bar, trending grid
│   │   └── search/
│   │       ├── page.tsx            # Wraps SearchResults in <Suspense>
│   │       └── SearchResults.tsx   # Client component: fetches + renders results
│   ├── components/
│   │   ├── Navbar.tsx              # Sticky top bar with logo + theme toggle
│   │   ├── ThemeToggle.tsx         # Dark/light switch (saved to localStorage)
│   │   ├── SearchBar.tsx           # Big search input, animated placeholder, suggestions
│   │   ├── PriceScoreboard.tsx     # Hero's animated Amazon-vs-Flipkart price ticker
│   │   ├── TrendingGrid.tsx        # Homepage grid of trending products
│   │   ├── PlatformSection.tsx     # One horizontally-scrollable rail per platform
│   │   ├── ProductCard.tsx         # Single product card (image, price, buy button…)
│   │   ├── RatingBreakdown.tsx     # 5★→1★ animated bar chart
│   │   ├── AISummary.tsx           # Positive/negative review summary panel
│   │   └── Skeletons.tsx           # Loading-state placeholders
│   ├── data/
│   │   ├── trending.ts             # Mock "trending searches" for the homepage
│   │   └── mockProducts.ts         # TypeScript types + offline fallback data
│   ├── lib/api.ts                  # Talks to the FastAPI backend; falls back to mock data
│   ├── .env.local.example          # Copy to .env.local
│   ├── tailwind.config.ts          # Color palette, fonts, animations
│   └── package.json
│
├── backend/                        # FastAPI app — deploys to Render
│   ├── main.py                     # App entrypoint, CORS, health check routes
│   ├── app/
│   │   ├── config.py               # Reads environment variables (Settings class)
│   │   ├── models.py                # Pydantic schemas (must match frontend types!)
│   │   ├── db.py                    # MongoDB (Motor) connection + cache collection
│   │   ├── routers/search.py        # GET /api/search — the core endpoint
│   │   ├── services/
│   │   │   ├── mock_data.py         # Default data source for the free beta
│   │   │   └── ai_summary.py        # Free, rule-based review summarizer
│   │   └── scrapers/
│   │       ├── amazon_scraper.py    # Playwright template for Amazon India
│   │       └── flipkart_scraper.py  # Playwright template for Flipkart
│   ├── .env.example                 # Copy to .env
│   ├── render.yaml                  # One-click Render deployment blueprint
│   └── requirements.txt
│
└── README.md                        # You are here
```

---

## 3. Prerequisites (install once)

| Tool | Check version | Install |
|---|---|---|
| Node.js 18+ | `node -v` | https://nodejs.org (LTS version) |
| Python 3.11+ | `python3 --version` | https://python.org/downloads |
| Git | `git --version` | https://git-scm.com |
| A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account | — | sign up, no credit card needed |
| A free [Vercel](https://vercel.com/signup) account | — | sign up with GitHub |
| A free [Render](https://render.com) account | — | sign up with GitHub |

---

## 4. Run the backend locally

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Open .env in any text editor. For now, you only NEED to set MONGODB_URI
# once you've done step 6 (MongoDB Atlas setup) — the app also runs fine
# with caching disabled if you leave it as the localhost default.

uvicorn main:app --reload
```

Visit **http://localhost:8000/docs** — you should see an interactive
Swagger page. Try `GET /api/search?q=iPhone 15` there; you'll get back
JSON with Amazon + Flipkart products, ratings, and an AI summary — all
from mock data, no scraping needed yet.

---

## 5. Run the frontend locally

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install

cp .env.local.example .env.local
# Default value (http://localhost:8000) is correct for local dev — leave as is.

npm run dev
```

Visit **http://localhost:3000** — you should see the homepage. Search for
"iPhone 15" and you'll land on `/search?q=iPhone%2015` with Amazon and
Flipkart sections, an AI summary, and a rating chart.

> If the backend isn't running, the search page automatically falls back
> to bundled mock data (`lib/api.ts` handles this) and shows a small
> banner — the UI never breaks.

---

## 6. MongoDB Atlas setup (free tier)

1. Go to https://cloud.mongodb.com and create a free account.
2. Click **Build a Database** → choose the **M0 Free** tier → pick any
   region close to India (e.g. Mumbai) → **Create**.
3. **Database Access** (left sidebar) → **Add New Database User** → create
   a username/password (save these!) → give it **Read and write to any
   database**.
4. **Network Access** (left sidebar) → **Add IP Address** → click **Allow
   Access from Anywhere** (`0.0.0.0/0`) — fine for a beta; Render's
   servers use dynamic IPs so this keeps things simple.
5. Go back to **Database** → click **Connect** on your cluster → **Drivers**
   → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the values from step 3, and
   paste the whole string into `backend/.env` as `MONGODB_URI`.

That's it — the backend automatically creates the `ecomcompare` database
and `search_cache` collection the first time it caches a search result.

---

## 7. Deploying the backend to Render (free tier)

1. Push this whole project to a **GitHub repository** (see step 9 if
   you're new to Git).
2. Go to https://dashboard.render.com → **New +** → **Blueprint**.
3. Connect your GitHub repo. Render will detect `backend/render.yaml`
   automatically.
   - If it doesn't auto-detect, choose **New +** → **Web Service** instead,
     point it at your repo, set:
     - **Root Directory**: `backend`
     - **Build Command**: `pip install -r requirements.txt && playwright install --with-deps chromium`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free
4. Under **Environment**, add these variables (values from your `.env`):
   - `MONGODB_URI`
   - `MONGODB_DB_NAME` = `ecomcompare`
   - `CORS_ORIGINS` = your Vercel URL (you'll get this in step 8 — you can
     come back and update it after)
   - `SCRAPER_MODE` = `mock`
   - `CACHE_TTL_SECONDS` = `1800`
5. Click **Create Web Service** / **Apply**. First deploy takes a few
   minutes (installing Playwright's Chromium binary adds time even
   though `mock` mode doesn't use it yet — this keeps `live` mode ready
   to go later).
6. Once deployed, copy your Render URL, e.g.
   `https://priceradar-backend.onrender.com`. Test it by visiting
   `https://priceradar-backend.onrender.com/health`.

> **Free tier note:** Render's free web services "spin down" after 15
> minutes of no traffic and take ~30-50 seconds to wake up on the next
> request. The frontend's loading skeletons handle this gracefully, but
> your first search after a while idle will feel slow — this is normal
> and expected on the free tier.

---

## 8. Deploying the frontend to Vercel (free tier)

1. Go to https://vercel.com/new and import the same GitHub repo.
2. When configuring the project:
   - **Root Directory**: `frontend`
   - Framework Preset: Next.js (auto-detected)
3. Add an **Environment Variable**:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL from step 7
     (e.g. `https://priceradar-backend.onrender.com`)
4. Click **Deploy**. You'll get a URL like `https://priceradar.vercel.app`.
5. **Go back to Render** and update `CORS_ORIGINS` to include this exact
   Vercel URL (comma-separated if you keep `http://localhost:3000` too),
   then let Render redeploy. Without this step the browser will block
   requests from your live site to your API.

You now have a live, free, full-stack app.

---

## 9. New to Git/GitHub? Quick primer

```bash
cd ecomcompare
git init
git add .
git commit -m "Initial PriceRadar beta"
# Create an empty repo on github.com first, then:
git remote add origin https://github.com/<you>/priceradar.git
git branch -M main
git push -u origin main
```

---

## 10. Turning on real scraping later (optional, advanced)

The Playwright scrapers in `backend/app/scrapers/` are **templates** —
Amazon and Flipkart change their page structure often and may block
automated browsers, so treat these as a learning starting point:

1. Locally, run `playwright install chromium` once.
2. Set `SCRAPER_MODE=live` in your `.env` (or Render environment).
3. Open `amazon_scraper.py` / `flipkart_scraper.py`, visit the live sites,
   right-click → **Inspect** on a search results page, and update the CSS
   selectors (`div[data-component-type='s-search-result']`, etc.) to match
   what you see today.
4. Test locally first (`uvicorn main:app --reload`) before deploying —
   if a scraper returns nothing, the router automatically falls back to
   mock data for that platform so the page still renders.
5. Add real affiliate IDs once approved: `AMAZON_AFFILIATE_TAG` (from
   [Amazon Associates India](https://affiliate-program.amazon.in)) and
   `FLIPKART_AFFILIATE_ID` (from the [Flipkart Affiliate program](https://affiliate.flipkart.com)).
   These get appended to every `buyUrl` automatically
   (see `_apply_affiliate_tag` in `search.py`).

---

## 11. What's mock vs. real right now

| Feature | Beta status |
|---|---|
| Amazon + Flipkart sections, cards, prices, offers | ✅ Real UI, mock data by default |
| Rating breakdown chart | ✅ Real chart, mock percentages |
| AI review summary | ✅ Real (free, keyword-based) logic, mock review text |
| Affiliate-ready buy links | ✅ URL structure ready, needs your real affiliate IDs |
| Live scraping | 🔧 Template provided, needs selector maintenance + testing |
| Search caching (MongoDB) | ✅ Real, degrades gracefully if DB isn't configured |

---

## 12. Common issues

- **"Backend unreachable" banner on the search page** → your FastAPI
  server isn't running (local) or `NEXT_PUBLIC_API_URL` is wrong/CORS
  isn't set (production).
- **CORS error in browser console** → add your exact frontend URL to
  `CORS_ORIGINS` on the backend and redeploy.
- **First request after idle is slow on Render** → expected free-tier
  cold start, see step 7.
- **`pip install` fails on `playwright`** → make sure you're using Python
  3.11+; run `pip install --upgrade pip` first.
