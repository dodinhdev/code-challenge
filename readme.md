# 99Tech Code Challenge — Frontend Engineer Submission

Solutions to the three problems from https://s5tech.notion.site/Code-Challenge-05cdb9e0d1ce432a843f763b5d5f7497, applying as a Frontend Engineer.

## What's in here

| Folder | Problem | What it is | How to view |
|---|---|---|---|
| `src/problem1/` | **Three ways to sum to n** | Single file with three implementations of `sum_to_n(n)` — iterative, closed-form (Gauss), and functional reduce — plus input validation via `Number.isInteger`. | Open [`src/problem1/sum_to_n.js`](./src/problem1/sum_to_n.js) — comments above each function explain the approach and complexity. |
| `src/problem2/` | **Fancy Form (Currency Swap)** | Full Vite + React + TypeScript app. A calculator that converts between any pair of 32 tokens using a live Switcheo price feed (polls every 30s). Built with shadcn/ui, Tailwind, and zod. | Run locally — see [`src/problem2/README.md`](./src/problem2/README.md). |
| `src/problem3/` | **Messy React** | Code review and refactor of a buggy `WalletPage` component. The brief weights the written analysis higher than the refactor itself, so the bulk of the work is the report. | Read [`src/problem3/ISSUES.md`](./src/problem3/ISSUES.md) for the 18-finding analysis, then [`src/problem3/WalletPage.refactored.tsx`](./src/problem3/WalletPage.refactored.tsx) for the corrected component. |

## Quick start (Problem 2)

```bash
cd src/problem2
npm install
npm run dev
# open http://localhost:5173
```

The default load pre-selects an `ETH → USD` pair so you see the calculator working immediately.

Other commands inside `src/problem2/`:
- `npm test` — Vitest (30 unit tests across price-dedupe, swap math, format roundtrip)
- `npm run typecheck` — TypeScript strict-mode check
- `npm run build` — production build (~109 KB gzipped)

## Deployment

The repo is configured for one-click Vercel deploy via [`vercel.json`](./vercel.json) at the root — it points Vercel at the `src/problem2/` subdirectory and lets Vite handle the rest. Import the GitHub repo in the Vercel dashboard; no extra configuration needed.

## Tech notes (Problem 2)

- **Vite 5** bundler (per the brief's bonus criterion)
- **React 18** + **TypeScript** (strict)
- **Tailwind CSS** + **shadcn/ui** primitives (Popover, Command) for the UI
- **react-hook-form** was considered but dropped — bidirectional binding in a calculator is cleaner without it; the architecture splits `lib/` (pure TS) / `hooks/` (React-aware) / `components/` (presentational) instead
- **zod** for wire-format validation of the price feed
- **sonner** for submit toasts
- **lucide-react** for icons
- ~30 unit tests in `src/problem2/src/__tests__/` covering all pure logic

Architecture details, design rationale, and a full feature list are in [`src/problem2/README.md`](./src/problem2/README.md).
