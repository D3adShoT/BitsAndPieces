# Plan: Google Sheets Backend for BitCraft Blog
**Date:** March 30, 2025

## Context

The blog previously served posts from static JSON files bundled at build time. The goal was to replace this with Google Sheets as a live database so that:
- An autonomous agent can publish new posts by writing a row — no code deploy needed
- Visitors can leave comments, like, and share posts
- All engagement data persists across sessions

The API layer is a **Google Apps Script Web App** (free, serverless, deployed from within the spreadsheet). The frontend fetches from it at runtime via a single service module.

---

## Architecture Overview

```
Google Sheets "BitCraft Blog DB"
  ├── Posts (slug, title, date, excerpt, tags, content, published)
  ├── Comments (id, postSlug, name, text, createdAt)
  ├── Likes (postSlug, count)
  └── Shares (postSlug, count)
         ↑
    Code.gs (Apps Script Web App)
    GET ?action=listPosts / getPost / getComments
    POST { action: addComment / incrementLikes / incrementShares / publishPost }
         ↑
    src/services/sheetsApi.js
         ↑
    BlogListPage  BlogPostPage
                    ├── <Engagement />  (likes + shares)
                    └── <Comments />    (list + form)
```

---

## Sheet Structure

### `Posts` (columns A–G)
| A: slug | B: title | C: date (YYYY-MM-DD) | D: excerpt | E: tags (comma-separated) | F: content (HTML fragment) | G: published (TRUE/FALSE) |

Insert new posts at **row 2** (push older rows down) to maintain newest-first order.

### `Comments` (columns A–E)
| A: id (Date.now()) | B: postSlug | C: name | D: text | E: createdAt (ISO) |

### `Likes` and `Shares` (columns A–B)
| A: postSlug | B: count |

One row per post, upserted on increment.

---

## Apps Script (`Code.gs`)

### `doGet(e)` routes

| `?action=` | Returns |
|---|---|
| `listPosts` | Array of `{ slug, title, date, excerpt, tags[] }` where `published=TRUE` |
| `getPost&slug=X` | Full post `{ ...manifest, content, likes, shares }` or `{ ok: false, error: 'not_found' }` |
| `getComments&slug=X` | Array of `{ id, name, text, createdAt }` newest-first |

### `doPost(e)` actions

| `action` | Payload | Returns |
|---|---|---|
| `addComment` | `{ slug, name, text }` | `{ ok, comment }` |
| `incrementLikes` | `{ slug }` | `{ ok, count }` |
| `incrementShares` | `{ slug }` | `{ ok, count }` |
| `publishPost` | `{ slug, title, date, excerpt, tags[], content, published }` | `{ ok, action: 'created'/'updated' }` |

Every response: `{ ok: true/false, ...payload }`.

`publishPost` inserts at row 2 (new post) or updates in-place (existing slug). Tags stored as comma-separated string; split on read.

---

## Frontend Changes

### New: `src/services/sheetsApi.js`
Single module. All functions use `BASE_URL = '/api/sheets'` (proxied in both dev and prod).

Exported functions:
- `fetchPostsList()` → `Promise<Post[]>`
- `fetchPost(slug)` → `Promise<FullPost | null>`
- `fetchComments(slug)` → `Promise<Comment[]>`
- `addComment(slug, name, text)` → `Promise<Comment>`
- `incrementLikes(slug)` → `Promise<number>`
- `incrementShares(slug)` → `Promise<number>`
- `publishPost(postData)` → `Promise<{ action }>` (agent use only)

### Modified: `src/pages/BlogListPage.jsx`
- Removed static `import postsIndex from '../data/posts/posts-index.json'`
- Added `useState([])`, `useState(true)` (loading), `useState(null)` (error)
- `useEffect` → `fetchPostsList()` → set state
- Loading/error/posts states rendered

### Modified: `src/pages/BlogPostPage.jsx`
- Removed `import.meta.glob` block
- `useEffect` → `fetchPost(slug)` → set post; null → setNotFound
- Added `<Engagement>` and `<Comments>` after `.blog-content` div
- Cancellation flag pattern to prevent setState after unmount

### New: `src/components/blog/Engagement.jsx` + `Engagement.module.css`
- Props: `{ slug, initialLikes, initialShares }`
- Like button calls `incrementLikes(slug)`, share button calls `incrementShares(slug)` then `navigator.share()` / clipboard fallback
- Inline Unicode icons (♡/♥, ↗) — no icon library

### New: `src/components/blog/Comments.jsx` + `Comments.module.css`
- Props: `{ slug }`
- On mount: `fetchComments(slug)` → set list
- Form: name input + textarea, `addComment(slug, name, text)` on submit
- On success: prepend new comment, clear form

---

## Proxy Setup (CORS Solution)

The browser cannot directly call Apps Script due to cross-origin redirect restrictions.

- **Dev:** Vite proxy in `vite.config.js` reads `SHEETS_API_URL` from `.env.local` and rewrites `/api/sheets` → Apps Script URL. No `VITE_` prefix — this var is build-time only, never bundled.
- **Production (Netlify):** `public/_redirects` routes `/api/sheets` → `/.netlify/functions/sheets`. The function (`netlify/functions/sheets.js`) reads `SHEETS_API_URL` from Netlify environment variables. The Apps Script URL is never in the repo.

---

## Key Bugs Fixed During Implementation

| Bug | Fix |
|---|---|
| ESLint: unused `_` in catch | Replaced `catch (_)` with bare `catch` (ES2019) |
| ESLint: setState in useEffect | Cancellation flag pattern (`let cancelled = false`) |
| ESLint: `process` not defined in vite.config | Replaced `process.cwd()` with `new URL('.', import.meta.url).pathname` |
| Date format wrong from Sheets | Added `formatDate()` helper in Code.gs using `Utilities.formatDate()` |
| Off-by-one date (IST → UTC shift) | Used `ss.getSpreadsheetTimeZone()` instead of `'UTC'` |
| Posts not loading (CORS) | Vite proxy for dev, Netlify function for production |
| Proxy dropping query string | Changed rewrite to `path.replace('/api/sheets', sheetsPath)` |
| Apps Script URL exposed in `_redirects` | Moved to Netlify serverless function; `_redirects` points to function only |

---

## Files Created / Modified

| Action | File |
|---|---|
| Created (outside repo) | `Code.gs` — Google Apps Script Web App |
| Created | `src/services/sheetsApi.js` |
| Created | `src/components/blog/Engagement.jsx` + `.module.css` |
| Created | `src/components/blog/Comments.jsx` + `.module.css` |
| Created | `netlify/functions/sheets.js` |
| Created | `netlify.toml` |
| Modified | `src/pages/BlogListPage.jsx` |
| Modified | `src/pages/BlogPostPage.jsx` |
| Modified | `vite.config.js` |
| Modified | `public/_redirects` |
| Modified | `CLAUDE.md`, `.gitignore` |

---

## Setup Checklist

- [x] Create Google Sheet "BitCraft Blog DB" with 4 tabs: Posts, Comments, Likes, Shares
- [x] Deploy Apps Script Web App (Execute as Me, Anyone can access)
- [x] Set `SHEETS_API_URL` in `.env.local` (dev)
- [x] Migrate existing posts from JSON into Posts sheet
- [ ] Set `SHEETS_API_URL` in Netlify environment variables (production)
- [ ] Verify production blog loads on Netlify after env var + `netlify.toml` deploy

---

## Agent Publishing

Send one POST — no Google credentials required, no code deploy:

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

Post is live immediately — no rebuild required.
