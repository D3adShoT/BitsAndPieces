# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plans

Implementation plans are stored in `Plans/` at the project root.

- `Plans/Plan_Mar30.md` — Google Sheets backend for blog (posts, comments, likes, shares); proxy setup; agent publishing workflow

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173 (HMR active; may use 5174+ if port taken)
npm run build     # Production build → dist/
npm run preview   # Serve dist/ at http://localhost:4173
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

Two-tab React SPA: **About me** (`/`) and **Blog** (`/blog`, `/blog/:slug`). Site brand is **BitCraft**.

**Core principle: all content lives in Google Sheets, never in static files.**

### Layers

- `src/data/portfolio.js` — single source of truth for all CV content (bio, skills, experience, projects, contact). Edit this file only to update portfolio content; no component changes needed.
- `src/services/sheetsApi.js` — all Google Sheets API calls. Every component that needs remote data imports from here. Never call `fetch` directly in components.
- `src/components/` — presentational only. No routing logic.
- `src/pages/` — one component per route; orchestrate which components render.
- `App.jsx` + `main.jsx` — layout shell (Navbar + `<Outlet>` + Footer) and router definition.

### Google Sheets Backend

All blog data lives in the **"BitCraft Blog DB"** Google Spreadsheet, accessed via a Google Apps Script Web App (`Code.gs` in the repo root).

**Sheets:**
- `Posts` — slug, title, date (YYYY-MM-DD), excerpt, tags (comma-separated), content (HTML fragment), published (TRUE/FALSE)
- `Comments` — id, postSlug, name, text, createdAt
- `Likes` — postSlug, count
- `Shares` — postSlug, count

**Apps Script endpoint:** proxied via `/api/sheets` (see Proxy section below).

**doGet actions:** `listPosts`, `getPost&slug=X`, `getComments&slug=X`

**doPost actions:** `addComment`, `incrementLikes`, `incrementShares`, `publishPost`

### Proxy Setup

CORS is handled by a proxy in both environments:

- **Dev:** Vite proxy in `vite.config.js` reads `SHEETS_API_URL` from `.env.local` and rewrites `/api/sheets` → Apps Script URL. Never use a `VITE_` prefix — this var is build-time only and must not be exposed to the browser bundle.
- **Production (Netlify):** `public/_redirects` routes `/api/sheets` → `/.netlify/functions/sheets`. The function (`netlify/functions/sheets.js`) reads `SHEETS_API_URL` from Netlify environment variables and proxies the request. The Apps Script URL is never in the repo.

**To update the Apps Script URL:**
1. Update `SHEETS_API_URL` in `.env.local` (dev)
2. Update `SHEETS_API_URL` in Netlify environment variables (production)

### Styling

CSS Modules per component (scoped). Design tokens as CSS custom properties in `src/App.css` — accent color, typography scale, shadows, spacing. Exception: `.blog-content` styles in `App.css` are intentionally global because they style HTML rendered via `dangerouslySetInnerHTML`.

### Publishing a blog post (agent workflow)

Send one POST to the Apps Script endpoint — no code deploy needed:

```json
POST /api/sheets
{
  "action": "publishPost",
  "slug": "my-post-slug",
  "title": "Post Title",
  "date": "YYYY-MM-DD",
  "excerpt": "Plain text summary",
  "tags": ["tag1", "tag2"],
  "content": "<h2>Heading</h2><p>HTML content...</p>",
  "published": true
}
```

If the slug already exists the row is updated in-place; otherwise a new row is inserted at position 2 (newest-first). The post is live immediately — no rebuild required.
