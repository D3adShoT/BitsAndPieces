# Architecture & Developer Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Architectural Pattern](#architectural-pattern)
5. [Data Layer](#data-layer)
6. [Component Hierarchy](#component-hierarchy)
7. [Routing](#routing)
8. [Styling System](#styling-system)
9. [Blog Post Agent Workflow](#blog-post-agent-workflow)
10. [Running the Application](#running-the-application)
11. [Deployment](#deployment)

---

## Overview

This is a two-tab personal website:

| Tab | Route | Purpose |
|-----|-------|---------|
| Portfolio | `/` | Bio, skills, experience, projects, contact |
| Blog | `/blog` | Salesforce tech articles (manually or agent-authored) |

The core design goal is **separation of data from UI** — all content lives in plain data files (`portfolio.js`, `posts/*.json`), so content can be updated or auto-generated without touching any React component.

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| UI Framework | React 18 | Component model, ecosystem |
| Build Tool | Vite | Fast HMR, native ESM, `import.meta.glob` |
| Routing | React Router v7 | `createBrowserRouter`, nested routes |
| Styling | CSS Modules + CSS Variables | Scoped styles, zero runtime, easy theming |
| Fonts | Google Fonts (Inter, JetBrains Mono) | Professional, free |
| Blog Data | JSON files | Human and agent writable, no parser needed |
| Deployment | Any static host (Netlify, Vercel, GitHub Pages) | SPA-friendly |

---

## Folder Structure

```
my-portfolio/
│
├── index.html                        # Vite HTML entry — sets page title/meta
├── vite.config.js                    # Vite config (React plugin)
├── package.json
│
├── public/
│   └── _redirects                    # Netlify: redirect all 404s → index.html (SPA support)
│
└── src/
    ├── main.jsx                      # App entry — mounts router
    ├── App.jsx                       # Layout shell: Navbar + <Outlet> + Footer
    ├── App.css                       # Global CSS: variables, reset, blog-content styles
    ├── index.css                     # Minimal body reset (defers to App.css)
    │
    ├── data/                         # ── CONTENT LAYER (no JSX) ──────────────────
    │   ├── portfolio.js              # All CV content: bio, skills, experience, projects
    │   └── posts/
    │       ├── posts-index.json      # Blog manifest — ordered list of all post summaries
    │       ├── hello-salesforce-spring-25.json
    │       └── omni-studio-best-practices.json
    │
    ├── components/                   # ── PRESENTATIONAL COMPONENTS ───────────────
    │   ├── layout/
    │   │   ├── Navbar.jsx            # Sticky top nav with Portfolio / Blog NavLinks
    │   │   ├── Navbar.module.css
    │   │   ├── Footer.jsx            # Copyright + contact links
    │   │   └── Footer.module.css
    │   │
    │   ├── portfolio/                # One component per portfolio section
    │   │   ├── Hero.jsx              # Name, title, tagline, cert badges, CTA buttons
    │   │   ├── About.jsx             # Bio paragraph + education + languages sidebar
    │   │   ├── Skills.jsx            # Skill chips grouped by category
    │   │   ├── Experience.jsx        # Vertical timeline of work history
    │   │   ├── Projects.jsx          # 2-column card grid of project highlights
    │   │   ├── Contact.jsx           # Clickable email / phone / LinkedIn cards
    │   │   └── *.module.css          # Scoped styles for each component above
    │   │
    │   └── blog/
    │       ├── PostCard.jsx          # Summary card shown on /blog list page
    │       ├── PostCard.module.css
    │       ├── TagBadge.jsx          # Reusable pill chip for post tags
    │       └── TagBadge.module.css
    │
    └── pages/                        # ── PAGE COMPONENTS (route targets) ─────────
        ├── PortfolioPage.jsx         # Composes all portfolio/* components in order
        ├── BlogListPage.jsx          # Reads posts-index.json, renders PostCard list
        ├── BlogListPage.module.css
        ├── BlogPostPage.jsx          # Loads {slug}.json via import.meta.glob, renders HTML
        └── BlogPostPage.module.css
```

---

## Architectural Pattern

The project follows a **Content / Presentation / Page** layering:

```
┌─────────────────────────────────────────────────────────┐
│  DATA LAYER  (src/data/)                                 │
│  Plain JS/JSON files. No React. Editable by humans      │
│  or AI agents. Single source of truth for all content.  │
└────────────────────┬────────────────────────────────────┘
                     │ imported by
┌────────────────────▼────────────────────────────────────┐
│  COMPONENT LAYER  (src/components/)                      │
│  Presentational only. Receive data via props or direct   │
│  import from data layer. No routing logic. No state      │
│  except what's needed for UI interactions.               │
└────────────────────┬────────────────────────────────────┘
                     │ composed by
┌────────────────────▼────────────────────────────────────┐
│  PAGE LAYER  (src/pages/)                                │
│  One component per route. Orchestrates which components  │
│  render and in what order. Handles route params and      │
│  async data loading (BlogPostPage).                      │
└────────────────────┬────────────────────────────────────┘
                     │ mounted by
┌────────────────────▼────────────────────────────────────┐
│  SHELL  (App.jsx + main.jsx)                             │
│  Router definition. Navbar + Footer always visible.      │
│  <Outlet> swaps page content based on current route.     │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

**CSS Modules over Tailwind**
Each component has a co-located `.module.css` file. Vite scopes class names automatically, preventing collisions. One exception: `.blog-content` styles in `App.css` are intentionally global so they apply to agent-generated HTML rendered via `dangerouslySetInnerHTML`.

**Static import for blog index, dynamic glob for post files**
`BlogListPage` statically imports `posts-index.json` — zero latency, no loading state needed. `BlogPostPage` uses `import.meta.glob('../data/posts/*.json')` to lazily load individual post files only when the user navigates to them, keeping the initial JS bundle small.

**HTML string content, not Markdown**
Blog posts store their body as an HTML string. This means no Markdown parser is needed in the bundle, and an AI agent can produce structured HTML directly without ambiguity around Markdown edge cases.

---

## Data Layer

### `src/data/portfolio.js`

Exports a single default object. All portfolio components import from this file.

```
portfolio
├── meta          { name, title, tagline }
├── contact       { email, phone, linkedin }
├── bio           string
├── education     { degree, institution, year }
├── languages     [{ name, level }]
├── certifications  string[]
├── skills        { [category]: string[] }
├── experience    [{ company, role, period, tech, bullets[] }]
└── projects      [{ name, tech[], bullets[] }]
```

To update any content, edit only this file — no component changes needed.

### `src/data/posts/posts-index.json`

An array of post summary objects, ordered newest-first (agent prepends, not appends):

```json
[
  {
    "slug": "salesforce-summer-25",
    "title": "Salesforce Summer '25 Highlights",
    "date": "2025-04-01",
    "excerpt": "One or two plain-text sentences. No HTML.",
    "tags": ["Release Notes", "LWC"]
  }
]
```

### `src/data/posts/{slug}.json`

Full post content. The `content` field is an HTML fragment (no `<html>/<body>` wrapper):

```json
{
  "slug": "salesforce-summer-25",
  "title": "Salesforce Summer '25 Highlights",
  "date": "2025-04-01",
  "excerpt": "...",
  "tags": ["Release Notes", "LWC"],
  "content": "<h2>Overview</h2><p>...</p><ul><li>...</li></ul>"
}
```

---

## Component Hierarchy

```
RouterProvider
└── App                         (Navbar + Outlet + Footer)
    ├── [route: /]
    │   └── PortfolioPage
    │       ├── Hero             reads portfolio.meta, portfolio.certifications
    │       ├── About            reads portfolio.bio, portfolio.education, portfolio.languages
    │       ├── Skills           reads portfolio.skills
    │       ├── Experience       reads portfolio.experience
    │       ├── Projects         reads portfolio.projects
    │       └── Contact          reads portfolio.contact
    │
    ├── [route: /blog]
    │   └── BlogListPage
    │       └── PostCard[]       one per entry in posts-index.json
    │           └── TagBadge[]
    │
    └── [route: /blog/:slug]
        └── BlogPostPage
            └── TagBadge[]
```

---

## Routing

Defined in `src/main.jsx` using `createBrowserRouter`:

```
/              → PortfolioPage   (index route)
/blog          → BlogListPage
/blog/:slug    → BlogPostPage    (useParams() → slug → load post JSON)
```

`App.jsx` is the layout wrapper for all routes. It renders:
```jsx
<Navbar />       ← always visible, sticky top
<Outlet />       ← page content swaps here
<Footer />       ← always visible
```

`<NavLink end>` on the Portfolio link ensures it only shows as active at exactly `/`, not at `/blog`.

---

## Styling System

All design tokens are CSS custom properties in `App.css`:

```css
/* Colors */
--color-bg:           #F9FAFB   /* page background */
--color-surface:      #FFFFFF   /* cards, navbar */
--color-border:       #E5E7EB   /* dividers */
--color-text-primary: #111827   /* headings, body */
--color-text-muted:   #6B7280   /* captions, dates */
--color-accent:       #4F46E5   /* indigo — links, active state, highlights */
--color-accent-light: #EEF2FF   /* indigo tint — chip backgrounds */
--color-accent-hover: #4338CA   /* darker indigo for hover */

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace   (blog code blocks only)

/* Layout */
--max-width:     860px    /* centered content column */
--navbar-height:  64px    /* page-main padding-top matches this */
```

To change the accent color (e.g. teal), update only `--color-accent`, `--color-accent-light`, and `--color-accent-hover` in `App.css`.

---

## Blog Post Agent Workflow

A future AI agent can publish a new post by touching exactly two files:

### Step 1 — Create the post file

Write `src/data/posts/{slug}.json` following the schema above.

Slug convention: `lowercase-words-separated-by-hyphens`
Example: `"Salesforce Summer '25"` → `salesforce-summer-25`

Content rules:
- `content` must be a valid HTML fragment (no `<html>`, `<head>`, or `<body>` tags)
- `excerpt` must be plain text — no HTML tags
- `date` must be `YYYY-MM-DD` format
- File must be valid JSON (no trailing commas, no comments)

### Step 2 — Update the index

Read `src/data/posts/posts-index.json`, **prepend** (not append) the new summary object, and write the file back. Prepending keeps posts sorted newest-first without any sort logic in React.

```json
[
  { "slug": "NEW-SLUG", "title": "...", "date": "...", "excerpt": "...", "tags": [] },
  // existing entries below
]
```

### Step 3 — Done

No React code changes. No build step required in development (`npm run dev` picks up new files via HMR). For production, rebuild with `npm run build`.

---

## Running the Application

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies (first time only)

```bash
cd /Users/agrajmishra/Documents/MyPersonalSpace/my-portfolio
npm install
```

### Development

```bash
npm run dev
```

Opens at **http://localhost:5173**

Hot Module Replacement (HMR) is active — saving any file instantly updates the browser without a full reload. New blog post JSON files are also picked up automatically.

### Production build

```bash
npm run build
```

Outputs to `dist/`. Vite bundles and minifies all JS/CSS. Each blog post JSON becomes a separate lazy-loaded chunk.

### Preview production build locally

```bash
npm run preview
```

Serves the `dist/` folder at **http://localhost:4173** — behaves identically to a deployed site.

### Verify the build

| Check | URL |
|-------|-----|
| Portfolio renders | http://localhost:4173/ |
| Blog list renders | http://localhost:4173/blog |
| Blog post opens | http://localhost:4173/blog/hello-salesforce-spring-25 |
| Active nav tab | Portfolio tab highlighted at `/`, Blog tab at `/blog` |
| Direct URL refresh | Navigating directly to `/blog/...` should not 404 |

---

## Deployment

### Netlify (recommended)

1. Push the project to GitHub
2. Connect the repo in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. The `public/_redirects` file handles SPA routing automatically

### Vercel

1. Import the GitHub repo in Vercel
2. Framework preset: **Vite**
3. Vercel handles SPA routing automatically — no extra config needed

### GitHub Pages

Requires setting `base` in `vite.config.js` to your repo name:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

And adding a `404.html` that mirrors `index.html` for SPA routing support.

---

## Adding Content

### Update portfolio info
Edit `src/data/portfolio.js` — changes reflect immediately in dev, rebuild for production.

### Add a blog post manually
1. Create `src/data/posts/{slug}.json`
2. Prepend an entry to `src/data/posts/posts-index.json`

### Change accent color
Edit `--color-accent`, `--color-accent-light`, `--color-accent-hover` in `src/App.css`.

### Add a new portfolio section
1. Create `src/components/portfolio/NewSection.jsx` + `.module.css`
2. Import it in `src/pages/PortfolioPage.jsx` and add it to the JSX
3. Add the section's data to `src/data/portfolio.js`
