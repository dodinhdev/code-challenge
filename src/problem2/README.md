# Problem 2 — Fancy Form (Currency Swap)

A polished Vite + React + TypeScript currency-swap calculator. Picks a pair of tokens from a live price feed and shows the conversion in real time, with a flip button, slippage controls, and live "updated X ago" timestamps.

The brief grades this on **intuitiveness and visual attractiveness**, with a bonus for using Vite.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:
- `npm test` — Vitest (30 unit tests, all pure logic in `src/__tests__/`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — production build → `dist/`
- `npm run preview` — serve the production build locally

## What it does

- **Default pair** loads as `ETH → USD` so the calculator works the moment the page lands.
- **32 tokens** from `https://interview.switcheo.com/prices.json` (deduped — keep the entry with the latest `date` per currency, drop entries with no price).
- **Popover token selector** with searchable list. `USD / USDC / ETH / WBTC` pinned at the top; the rest sorted alphabetically.
- **Cross-disable** — the symbol on the other side is shown as `In use` and disabled.
- **Bidirectional input** — type on either side and the other auto-derives via `priceA / priceB`.
- **Shrink-to-fit amounts** — large numbers scale down smoothly so they never clip.
- **Flip button** rotates 180° on hover (respects `prefers-reduced-motion`) and swaps the pair without losing the conversion.
- **Slippage popover** with three presets (0.1%, 0.5%, 1.0%) plus a custom input. Amber warning above 1%, red danger above 5%.
- **Exchange rate row** that flips between `1 ETH ≈ X USD` and `1 USD ≈ Y ETH` on click.
- **Auto-refresh** every 30s with a visible "Updated 12s ago" timestamp.
- **Stale-feed indicator** — small amber pill appears in the swap-details card if a background refresh fails (the initial-load error has its own banner).
- **Submit flow** — multi-state button (`Select tokens` → `Enter an amount` → `Swap …` → spinner during 1.5s mocked latency → toast notification in the top-right → form resets keeping the token pair).
- **Theme toggle** — light + dark, persists to `localStorage`, respects system preference on first visit.
- **Responsive** from 360px up; tap targets ≥ 44px; popover anchors and resizes correctly on every viewport.
- **a11y** — every input labelled, focus rings on every interactive control, `aria-busy` on submit, `role="status"` / `role="alert"` on dynamic banners.

## Architecture

The codebase splits into three layers with strict one-way dependencies:

```
components/ (React, presentational, props-in/events-out)
     ↓
hooks/      (React-aware glue — state, effects, derivations)
     ↓
lib/        (pure TS — no React imports, 100% unit-testable)
```

### `lib/` — pure logic

| File | What it owns |
|---|---|
| `types.ts` | `Token`, `SwapDirection` |
| `constants.ts` | URLs, submit timing, default pair (`ETH`/`USD`) |
| `tokens.ts` | `tokenIconUrl(symbol)` with a small alias map for 5 stToken icons whose case differs from the price-feed symbols, plus `POPULAR_SYMBOLS` and `POPULAR_SET` |
| `prices.ts` | `PriceEntry` (inferred from the zod schema — single source of truth), `fetchPrices(signal)` with wire-format validation, `dedupePrices` (latest date wins), `toTokens` (filter + sort) |
| `swap.ts` | `computeRate`, `computeReceive`, `computePay` — defensive against non-positive inputs |
| `format.ts` | `parseAmount` (locale-forgiving + rejects negatives + accepts trailing/leading dot for in-progress typing), `isPositiveAmount`, `formatAmount`, `formatRate`, `formatUsd` |
| `utils.ts` | `cn()` Tailwind class merger |

### `hooks/` — React-aware

| Hook | What it owns |
|---|---|
| `useTheme` | Reads `localStorage` with `try/catch` so Safari Private Mode doesn't crash mount; toggles class on `<html>` and persists. |
| `usePrices` | Fetches on mount, polls every 30s, exposes `{ tokens, isLoading, error, lastUpdated }`. Uses `AbortController` to cancel previous fetch on each poll tick and on unmount. |
| `useSwap` | Owns swap state. Two private helpers (`applyAmountChange`, `applyTokenChange`) collapse the four pay/receive mirror-twin handlers. Public surface is `setPayAmount`, `setReceiveAmount`, `setPayToken`, `setReceiveToken`, `flip`, `submit`. |
| `useTimeAgo` | 1Hz tick → relative-time string. Clamps negative deltas (clock skew) to 0. |

### `components/` — presentational

| Component | Role |
|---|---|
| `SwapForm` | Composition root (inline in `App.tsx`) — wires `useSwap` to the panels and details. |
| `SwapPanel` | One side of the swap. Composes `AmountInput` + `TokenSelector`. |
| `AmountInput` | Numeric input with input sanitization (only digits/dot/comma/space), shrink-to-fit (measured via a hidden span + `useLayoutEffect` + `ResizeObserver`), `maxLength={24}`, blur-time reformat. |
| `TokenSelector` | Popover anchored to a fixed-width pill. Inside: cmdk `Command` with substring filter, popular tokens pinned. |
| `TokenIcon` | `<img>` with `onError` fallback to a deterministic hashed-hue circle with the symbol's first two letters. |
| `FlipButton` | 44×44 circular button, rotates on hover (motion-reduce safe). |
| `SwapDetails` | Rate row (click to flip direction), minimum received, slippage popover, "Updated X ago" timestamp with optional stale-feed indicator. |
| `SlippagePopover` | Presets + custom input + warning/danger alerts. |
| `SubmitButton` | State-aware label, spinner during loading, `aria-busy`. |
| `ThemeToggle` | 44×44 sun/moon button with `aria-label`. |
| `TokenSkeleton` | Shimmer placeholder for first-load. |
| `ui/popover.tsx`, `ui/command.tsx` | shadcn primitives. |

## Notable design decisions

- **Dropped `react-hook-form`.** Bidirectional binding fights RHF's unidirectional model. Plain `useState` with explicit derivation in change handlers is cleaner and reads better. zod is used directly for wire-format validation in `prices.ts` — it still earns its place.
- **Calculator framing, not DEX.** Earlier iterations tried to ship balance, max button, and a real "swap" semantic. The user clarified this is a converter; removing those reduced confusion and shrunk the form. Slippage and minimum received stay for educational realism even though they don't mean anything without an actual order book.
- **Shrink-to-fit instead of `text-overflow: ellipsis`** for amounts. A calculator that shows `1.234…` for a real balance feels broken. The font scales from `text-3xl` (30px) down to a 12px floor, sized by measuring a hidden span on every value change.
- **`maxLength={24}` on the amount input** combined with the shrink floor means even the worst-case input fits without horizontal clipping.
- **Strict regex parser** for amounts (`/^(\d+\.?\d*|\.\d+)$/` after stripping commas/spaces) catches `1.2.3` and `abc` while accepting `5.` and `.5` for in-progress typing.
- **Default `ETH → USD` pair** on mount with defensive `find` — if either symbol disappears from the feed, the initializer falls back to `null` rather than rendering a token that has no price.
- **`AbortController` per fetch** in `usePrices` — previously the `cancelled` flag only gated state writes; the network request kept running and concurrent fetches could clobber each other.
- **`try/finally` around `submit`** so `submitState` always returns to `idle`, even when the body throws.
- **localStorage guarded** — Safari Private Mode used to crash mount; now it gracefully falls back to system preference and runs in session-only mode.
- **No non-null assertions** anywhere. The `payToken && receiveToken && (…)` inline narrowing replaces the previous `hasPair = !!…` pattern that didn't narrow types.

## Tests

```
src/__tests__/
├── prices.test.ts   ← 8 cases (dedupe, drop-no-price, sort, alias URLs)
├── swap.test.ts     ← 9 cases (rate math both directions, slippage, edge cases)
└── format.test.ts   ← 13 cases (parse variants, format, roundtrip, rate display)
```

Total: **30 tests passing**. All cover pure logic — the UI is verified manually via the dev server and a Playwright smoke pass during development.

## Build

`npm run build` produces a single SPA in `dist/`:
- `index.html` — 0.32 KB gzipped
- `assets/index-*.css` — 4.64 KB gzipped (Tailwind, tree-shaken)
- `assets/index-*.js` — **109 KB gzipped** (React, Radix Popover, cmdk, zod, sonner, lucide icons, app code)

Under the 300 KB initial-JS budget the brief implicitly sets for a fast page. No code-splitting needed at this scale.

## Deployment

The repo's root `vercel.json` points Vercel at this subdirectory:

```json
{
  "framework": "vite",
  "installCommand": "cd src/problem2 && npm install",
  "buildCommand": "cd src/problem2 && npm run build",
  "outputDirectory": "src/problem2/dist"
}
```

Import the GitHub repo in the Vercel dashboard — no UI configuration needed.
