# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173 (HMR active)
npm run build     # Production build → dist/
npm run preview   # Serve dist/ at http://localhost:4173
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

Two-tab React SPA: **Portfolio** (`/`) and **Blog** (`/blog`, `/blog/:slug`).

**Core principle: all content lives in data files, never in components.**

### Layers

- `src/data/portfolio.js` — single source of truth for all CV content (bio, skills, experience, projects, contact). Edit this file only to update portfolio content; no component changes needed.
- `src/data/posts/` — blog posts as JSON. `posts-index.json` is a manifest (ordered newest-first); each `{slug}.json` holds the full post with an HTML string in the `content` field.
- `src/components/` — presentational only, receive data via direct import from the data layer. No routing logic.
- `src/pages/` — one component per route; orchestrate which components render. `BlogPostPage` uses `import.meta.glob('../data/posts/*.json')` for lazy-loaded post chunks.
- `App.jsx` + `main.jsx` — layout shell (Navbar + `<Outlet>` + Footer) and router definition.

### Styling

CSS Modules per component (scoped). Design tokens as CSS custom properties in `src/App.css` — accent color, typography scale, shadows, spacing. Exception: `.blog-content` styles in `App.css` are intentionally global because they style HTML rendered via `dangerouslySetInnerHTML`.

### Publishing a blog post

Touch exactly two files:
1. Create `src/data/posts/{slug}.json` — `content` must be a valid HTML fragment (no `<html>`/`<body>`), `excerpt` plain text, `date` in `YYYY-MM-DD`.
2. **Prepend** (not append) the summary object to `src/data/posts/posts-index.json` to keep newest-first order.

No React code changes. No rebuild needed in dev (HMR picks up new JSON files automatically).
