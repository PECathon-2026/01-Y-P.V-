# Small Web Reader — Team V² Overdrive (PECathon 2026, PS-003)

A privacy-conscious, distraction-free feed reader frontend. React + Vite + Tailwind CSS v4 + React Router + Lucide.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```
Requires Node 18+.

## Implemented (frontend, demo data)
Dashboard, sidebar nav (collapsible + mobile drawer), global search, filters and sorting (unread/saved/date, newest/oldest/reading time), bookmark, read/unread, subscribe/unsubscribe, Discover with categories and feed preview, add-feed modal (loading/success/invalid/duplicate; blocks private/local hosts), reader (progress bar, font size, dark/light/sepia, prev/next), recommendations with dismiss and privacy note, offline library UI, dark/light theme. State persists in localStorage (`swr-v2-overdrive`).

## Still required (not implemented — mock only)
- Server `/api/fetch` raw proxy (no parsing, no storage)
- Client RSS/Atom parsing, autodiscovery, Readability extraction, DOMPurify sanitization
- Real offline cache in IndexedDB (current offline library only records flags)
- Discovery API + database (anonymous batch submit, popularity + co-subscription ranking, abuse protection, normalization, threat model)
- Deployment, 10–15 seed blogs with real feeds, README threat model

All publications and articles in `src/data/mock.js` are fictional sample data. API calls live in `src/api/api.js` so they can be swapped for real endpoints.
