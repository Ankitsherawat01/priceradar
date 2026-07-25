# PriceRadar — Full Launch Guide (Zero to Live Website)

This is a straight, linear checklist to take the project from the zip file
you have on your computer to a real, live website anyone can visit. Follow
it in order — don't skip steps.

Total time: roughly 45-60 minutes the first time.

---

## PART A — Get the code onto your computer

**Step 1. Unzip the project**
Unzip `priceradar-beta.zip` somewhere easy to find, e.g. `Desktop/priceradar`.
You should see two folders inside: `frontend/` and `backend/`.

**Step 2. Install the tools you need (skip any already installed)**
- Node.js 18+ → https://nodejs.org (download the LTS version, click through installer)
- Python 3.11+ → https://python.org/downloads
- Git → https://git-scm.com/downloads
- Check installs worked by opening a terminal and running:
  ```bash
  node -v
  python3 --version
  git --version
  ```

---

## PART B — Test it on your own computer first

Never skip local testing — it's much faster to fix problems here than on a
live server.

**Step 3. Start the backend**
```bash
cd priceradar/backend
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```
Leave this terminal running. Open http://localhost:8000/docs in a browser
— you should see the API's interactive docs page.

**Step 4. Start the frontend**
Open a **second** terminal window (don't close the first):
```bash
cd priceradar/frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Open http://localhost:3000 — you should see the homepage. Search for
"iPhone 15" and confirm you see Amazon and Flipkart sections with cards,
prices, ratings, and an AI summary.

**If this works, you're ready to put it online. If not, stop here and fix
it before continuing** — deploying a broken app just moves the same
problem to a slower feedback loop.

---

## PART C — Create your accounts (all free, no credit card needed)

**Step 5. Create a GitHub account** (skip if you have one)
https://github.com/signup

**Step 6. Create a MongoDB Atlas account**
https://www.mongodb.com/cloud/atlas/register

**Step 7. Create a Render account**
https://render.com — sign up with your GitHub account (easiest)

**Step 8. Create a Vercel account**
https://vercel.com/signup — sign up with your GitHub account (easiest)

---

## PART D — Put your code on GitHub

**Step 9. Push the project to a new GitHub repo**
```bash
cd priceradar
git init
git add .
git commit -m "Initial PriceRadar beta"
```
Now go to https://github.com/new, name the repo `priceradar`, leave it
**Public** or **Private** (your choice), don't add a README (you already
have one), click **Create repository**. GitHub will show you commands —
run the ones under "…or push an existing repository from the command line":
```bash
git remote add origin https://github.com/<your-username>/priceradar.git
git branch -M main
git push -u origin main
```
Refresh the GitHub page — you should see your files there.

---

## PART E — Set up the database

**Step 10. Create your free MongoDB cluster**
1. Log into https://cloud.mongodb.com
2. **Build a Database** → **M0 Free** tier → pick a region near India
   (e.g. Mumbai) → **Create**

**Step 11. Create a database user**
1. Left sidebar → **Database Access** → **Add New Database User**
2. Choose a username and password — **write these down somewhere safe**
3. Under permissions, choose **Read and write to any database**

**Step 12. Allow network access**
1. Left sidebar → **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`) — this is fine for a
   beta since Render's servers use changing IP addresses

**Step 13. Copy your connection string**
1. Go to **Database** → click **Connect** on your cluster → **Drivers**
2. Copy the string that looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
3. Replace `<username>` and `<password>` with the values from Step 11
4. **Save this final string** — you'll paste it into Render in Step 16

---

## PART F — Deploy the backend (Render)

**Step 14. Create the Render service**
1. Go to https://dashboard.render.com → **New +** → **Blueprint**
2. Connect your GitHub account if prompted, then select your `priceradar`
   repo. Render should detect `backend/render.yaml` automatically.
   - If Blueprint doesn't detect it, instead choose **New +** → **Web
     Service**, select your repo, and set:
     - **Root Directory**: `backend`
     - **Build Command**: `pip install -r requirements.txt && playwright install --with-deps chromium`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Instance Type**: Free

**Step 15. Set environment variables**
Under the service's **Environment** tab, add:
| Key | Value |
|---|---|
| `MONGODB_URI` | the connection string from Step 13 |
| `MONGODB_DB_NAME` | `ecomcompare` |
| `CORS_ORIGINS` | `http://localhost:3000` (you'll add your real site URL in Step 19) |
| `SCRAPER_MODE` | `mock` |
| `CACHE_TTL_SECONDS` | `1800` |

**Step 16. Deploy**
Click **Create Web Service** (or **Apply** if using Blueprint). Wait for
the build to finish (a few minutes — installing Playwright's browser
takes a little time even in mock mode, so it's ready for later).

**Step 17. Test your live backend**
Copy your Render URL (looks like `https://priceradar-backend.onrender.com`)
and visit `https://priceradar-backend.onrender.com/health` in a browser.
You should see `{"status":"healthy"}`. If you see an error, check the
**Logs** tab on Render for details.

---

## PART G — Deploy the frontend (Vercel)

**Step 18. Import your project**
1. Go to https://vercel.com/new
2. Import your `priceradar` GitHub repo
3. Set **Root Directory** to `frontend`
4. Framework should auto-detect as **Next.js**

**Step 19. Set the environment variable**
Before clicking Deploy, add:
| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | your Render URL from Step 17, e.g. `https://priceradar-backend.onrender.com` |

**Step 20. Deploy**
Click **Deploy**. Wait ~1-2 minutes. Vercel gives you a live URL like
`https://priceradar.vercel.app`.

**Step 21. Connect the two — update CORS**
Go back to Render → your backend service → **Environment** → edit
`CORS_ORIGINS` to:
```
http://localhost:3000,https://priceradar.vercel.app
```
(use your actual Vercel URL). Save — Render will redeploy automatically.

---

## PART H — Final checks

**Step 22. Test the live site**
1. Visit your Vercel URL
2. Search "iPhone 15" — confirm Amazon and Flipkart sections load with
   cards, prices, ratings, and an AI summary
3. Open your browser's dev tools (F12) → **Console** tab → confirm there
   are no red CORS errors

**Step 23. Know the free-tier quirks**
- Render's free service **sleeps after 15 minutes of no traffic**. The
  next visitor's first search will take ~30-50 seconds while it wakes up
  — the loading skeletons make this feel intentional rather than broken.
- Every time you `git push` new changes, both Vercel and Render
  auto-redeploy within a couple of minutes — you don't need to repeat
  these steps for future updates.

**You're live.** Share your Vercel URL with people.

---

## Optional next steps (not required to launch)

- **Custom domain**: buy a `.com`/`.in` domain (e.g. via Namecheap or
  GoDaddy) and connect it under Vercel → your project → **Settings** →
  **Domains**. Point your domain's DNS as instructed there.
- **Real affiliate links**: apply to
  [Amazon Associates India](https://affiliate-program.amazon.in) and the
  [Flipkart Affiliate program](https://affiliate.flipkart.com), then add
  `AMAZON_AFFILIATE_TAG` and `FLIPKART_AFFILIATE_ID` as environment
  variables on Render.
- **Real scraping**: see the "Turning on real scraping later" section in
  the main `README.md` before switching `SCRAPER_MODE` to `live`.
