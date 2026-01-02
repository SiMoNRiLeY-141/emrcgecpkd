# EMRC Website AI Agent Instructions

## Project Overview
Next.js-based website for Electrical Maintenance and Research Club (EMRC) at GEC Palakkad. Single-page scrollable site with dynamic content fetched from Supabase. Deployed on Vercel with SEO optimization and automated indexing.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with Turbopack
- **Backend**: Supabase (PostgreSQL + Storage)
- **Hosting**: Vercel with serverless functions
- **Styling**: CSS (custom, no framework)
- **Database Tables**: `news`, `committee`, `newsletter_subscribers`

### Component Structure
- **Header**: Static branding with logos from Supabase storage
- **News**: Auto-rotating carousel (7s interval) fetching from `/api/news`
- **Committee**: Grid of member cards fetching from `/api/committee`
- **Newsletter**: Email subscription to `newsletter_subscribers` table
- **ContactSection**: Static contact info with social links
- **SocialMediaOverlay**: Lazy-loaded social media links

All components use **React Suspense with lazy loading** for performance (see `src/pages/index.js`).

### Data Flow
1. Client-side `useEffect` → fetch `/api/*` endpoints
2. API routes (`src/pages/api/`) → Supabase client connection
3. Supabase (Anon key via `NEXT_PUBLIC_SUPABASE_*` env vars) returns data
4. Components render with error handling (empty fallback)

## Critical Files & Patterns

| File | Purpose | Pattern |
|------|---------|---------|
| `src/pages/index.js` | Home page with lazy components & schema markup | Suspense + LD+JSON SEO |
| `src/pages/api/[endpoint].js` | Data fetching (committee, news, subscribe) | Simple try-catch, 200/500 responses |
| `src/pages/api/supabase.js` | Reusable Supabase client | No auth (anon key only) |
| `src/components/[Component].js` | UI with built-in fetch logic | Fetch in useEffect, useState for data |
| `next.config.mjs` | Image optimization & caching | Supabase domain whitelisting |

## Developer Workflows

### Local Development
```bash
npm install
npm run dev                    # Starts on :3000 with Turbopack
npm run lint                   # Next.js eslint
npm run build && npm start     # Production build
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tptqglihfsppnrrtukvw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

### Deployment
- Vercel auto-deploys from `master` branch
- Daily cron job at midnight: `/api/keep-alive` pings Supabase (prevents cold starts)
- Sitemap auto-generated after build via `next-sitemap` config

## Key Conventions & Edge Cases

### Images & External Assets
- **Supabase signed URLs** with expiry tokens embedded in code (not env vars)
- Images preloaded in `<Head>` for LCP optimization (`Header.js`)
- Always use Next.js `<Image>` component with explicit width/height

### Responsive Design
- CSS media queries break at `768px` (see `globals.css`)
- Member cards: flex-wrap, 25% width on desktop, stack on mobile
- Aspect ratio maintained (512/512 for circular member photos)

### Error Handling
- **Silent failures**: If API fails, components render empty (no errors thrown)
- Newsletter: Checks for duplicates (error code PGRST116 ignored)
- All endpoints return 405 Method Not Allowed if wrong HTTP method used

### SEO & Indexing
- **Schema Markup** in `index.js` defines College/University + Member info
- **IndexNow API** via `/api/submit-url` for search engine notifications
- **Robots.txt** generated automatically (excludes `/api/*` from crawling)
- **Meta tags** for OG, verification, viewport set in Head component

## Code Style & Patterns

- **No TypeScript** (jsconfig.json only, strict mode enabled)
- **Path alias** `@/` maps to `src/` (e.g., `import '@/styles/globals.css'`)
- **Stateful components** use `useState`; data fetching in `useEffect` with cleanup
- **No external UI lib**: Custom CSS only, FontAwesome v3.1.1+ for icons
- **Prettier** configured; run `npm run lint` to check

### Dependency Notes
- **FontAwesome**: Updated to v3.1.1+ (v0.2.x deprecated). If using older versions, upgrade with `npm install @fortawesome/react-fontawesome@latest`

## Adding New Features

### New API Endpoint
1. Create `src/pages/api/[name].js`
2. Import `supabase` from `./supabase`
3. Export async `handler(req, res)` with GET/POST/error handling
4. Example: `select()` for read, `.insert()` for write

### New Component
1. Create `src/components/[Name].js`
2. Use React hooks; fetch via `/api/` if data needed
3. Add CSS classes to `globals.css` (scope by `.component-name-*`)
4. Import lazy in `index.js`: `const [Name] = lazy(() => import(...))`

### Database Schema Changes
- Supabase admin panel only (anon key has limited RLS)
- Ensure RLS policies allow public read/write as needed
- Update API routes if new columns added to queries

## Testing & Validation
- No test framework configured
- Manual testing: `npm run dev` + browser
- Check console for fetch errors in Network tab
- Verify Supabase connectivity via `/api/keep-alive` endpoint

## Common Issues & Solutions

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| 404 on `/api/*` | Route not exported as `handler` | Ensure `export default async function handler(...)` |
| Images broken | Supabase domain not whitelisted | Add to `next.config.mjs` image remotePatterns |
| Empty components | API fails silently | Check browser console; verify env vars set |
| Cold start delays | Supabase cold boot | Daily cron keeps warm |
