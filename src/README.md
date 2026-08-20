# GitHub Insights Dashboard

A React + TypeScript dashboard for exploring GitHub user profiles, repositories, language breakdowns, and commit activity — all pulled live from the GitHub REST API.

**[Live demo →](your-vercel-url-here)**

![screenshot placeholder](./screenshot.png)

## Features

- 🔑 Personal Access Token auth (stored locally, never sent anywhere but GitHub)
- 🔍 Search any public GitHub user
- 👤 Profile overview — bio, followers, repo count
- 📁 Sortable repository list (recently updated / most stars / name)
- 📊 Language breakdown chart across all repos
- 📈 Commit activity chart per repo, with correct handling of GitHub's asynchronous stats endpoint

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Recharts (data visualization)
- Native `fetch` + `async/await` — no HTTP client library
- GitHub REST API

## Running locally

```bash
git clone https://github.com/mdinh18/github-insights-dashboard.git
cd github-insights-dashboard
npm install
npm run dev
```

You'll need a GitHub Personal Access Token to use the app:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token, check only the `public_repo` scope
3. Paste it into the app when prompted

The token is stored only in your browser's `localStorage` — it's never sent anywhere except directly to GitHub's API.

## What I learned building this

- **Normalized, generic data fetching** — built a reusable `useGitHubApi` hook that handles loading/error/cancellation for any endpoint, instead of writing one-off fetch logic per component.
- **Handling a real async API quirk** — GitHub's commit stats endpoint returns `202 Accepted` while it computes stats in the background for the first request. Had to implement polling with a cancellation guard so switching repos mid-poll doesn't leak stale state into the wrong component.
- **Unit mismatches are a real bug class** — GitHub returns Unix timestamps in seconds; JavaScript's `Date` expects milliseconds. Multiplying by 1000 is a one-character fix, but only once you know to look for it.
- **Referential stability matters for memoization** — reused the lesson from an earlier project (a Kanban board) where `useMemo`/`useCallback` are only useful if what you're feeding them has a stable reference across renders, not just "add the hook and hope."

## Known limitations

- Read-only: no write actions (no starring, following, etc.)
- Commit activity is limited to what GitHub's stats endpoint provides (last 52 weeks)
- No pagination on repo list beyond GitHub's `per_page=100` cap