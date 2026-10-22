# Reel · Show Finder

Search any TV show, browse top-rated series, open a show to see its seasons, episodes and cast, and keep a watchlist. Built with React and the free TVmaze API.

**Live:** https://cryoviper.github.io/show-finder/

## Features

- Debounced live search with loading skeletons, empty and error states
- Top-rated shows on the home page
- Show page with rating, genres, network, schedule, summary, a season picker with episode lists, and cast
- Watchlist saved in `localStorage` (works offline once saved)
- Shareable URLs with hash routing (`#/show/82`), which works on GitHub Pages without server rewrites
- Responsive poster grid, keyboard accessible, reduced-motion friendly

## Tech

- React 18 + Vite
- Custom hooks: `useAsync` (fetch with `AbortController` so stale requests are cancelled), `useDebounce`, `useLocalStorage`, `useHashRoute`
- In-memory response cache to avoid repeat requests
- TVmaze summaries contain HTML; they're converted to plain text with `DOMParser` instead of `dangerouslySetInnerHTML`
- [TVmaze API](https://www.tvmaze.com/api): free, **no API key**

## Run locally

```bash
git clone https://github.com/cryoviper/show-finder.git
cd show-finder
npm install
npm run dev
```

Deploys automatically to GitHub Pages on every push to `main` (see `.github/workflows/deploy.yml`).

## What I learned

- Cancelling in-flight requests to prevent race conditions when typing fast
- Splitting UI into small components and reusable hooks
- Handling loading, empty and error states properly instead of only the happy path

---

Built by [Praveen Sinwar](https://github.com/cryoviper). Show data from TVmaze, licensed CC BY-SA.
