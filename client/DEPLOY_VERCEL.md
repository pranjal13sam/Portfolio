# Deploy portfolio to Vercel

## 1. Push your code to GitHub

If you haven’t already:

```bash
cd C:\Users\pranjal.pandey\Downloads\Portfolio
git init
git add .
git commit -m "Initial commit"
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repository (the one that contains this Portfolio folder).
4. **Root Directory:** click **Edit** and set to **`client`** (so Vercel builds the Angular app, not the whole repo).
5. **Framework Preset:** Vercel should detect **Angular**. If not, leave as “Other”.
6. **Build and Output Settings** (usually auto-filled; adjust only if needed):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/portfolio-client/browser`
7. **Environment Variables:** leave empty for now (optional: add any you need later).
8. Click **Deploy**.

Wait for the build to finish. Your site will be at `https://your-project.vercel.app`.

### If the build fails on “Output Directory”

Try changing **Output Directory** in the Vercel project settings to:

- `dist/portfolio-client`

Then redeploy.

## 3. Contact form in production

The contact form calls your **.NET API** (e.g. `http://localhost:5047` in dev). On Vercel only the **frontend** runs, so you need to host the API somewhere and point the app to it.

**Option A – Deploy the .NET API (e.g. Render / Railway)**

1. Deploy `server/Portfolio.Api` to [Render](https://render.com) or [Railway](https://railway.app) (both support .NET).
2. Set **Smtp:Password** (your Gmail App Password) in that service’s environment variables.
3. Copy your deployed API URL (e.g. `https://your-api.onrender.com`).

**Option B – Set the API URL in the frontend**

1. In the repo, open **`client/src/environments/environment.prod.ts`**.
2. Set `contactApiUrl` to your deployed API URL:
   ```ts
   contactApiUrl: 'https://your-api.onrender.com/api/contact',
   ```
3. Commit, push, and let Vercel redeploy.

**CORS:** In your deployed API, allow your Vercel domain (e.g. `https://your-project.vercel.app`) in CORS. In `Program.cs` you already have `localhost:4200`; add your Vercel URL to `WithOrigins(...)`.

## 4. Custom domain (optional)

In the Vercel project: **Settings** → **Domains** → add your domain and follow the DNS instructions.
