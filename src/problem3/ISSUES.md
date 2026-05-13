# Problem 3 — Messy React: review notes

Below is all findings in the `WalletPage` component. The refactored version is in [`WalletPage.refactored.tsx`](./WalletPage.refactored.tsx).

---

## Logic and code issues

### 1. `lhsPriority` is a reference to a variable that was never declared in scope

The filter reads `if (lhsPriority > -99)` but the line above declares `balancePriority` — different name. `lhsPriority` doesn't exist anywhere in this scope (looks like a leftover from the sort comparator below). Throws `ReferenceError` the first time the filter runs, page crashes on mount.

### 2. `WalletBalance` is missing the `blockchain` field that the filter reads

The interface declares only `currency` and `amount`. But `getPriority(balance.blockchain)` reads `.blockchain`. TypeScript would normally catch this — except `getPriority` accepts `blockchain: any`, which trivially accepts `undefined`. At runtime every balance gets priority `-99`, the filter returns `false` for everything. Silent zero-rows even after fixing #1.

The fix is to actually put `blockchain` on `WalletBalance` and type it as a string-literal union — which makes the `any` in `getPriority` unnecessary too.

### 3. `formattedBalances` is declared but unused

Computed from `sortedBalances` but nothing downstream reads it — the row render iterates `sortedBalances` instead. Dead code.

### 4. The row map reads a property that doesn't exist on its input

Iterates `sortedBalances` and reads `.formatted` on each item — but `sortedBalances` items don't have `.formatted`. The correct input is `formattedBalances` (the array that actually has the field). Renders blank at runtime. The `: FormattedWalletBalance` annotation on the callback only hides the mismatch from the compiler.

### 5. Sort comparator missing `return 0` for equal priorities

```js
if (leftPriority > rightPriority) return -1;
else if (rightPriority > leftPriority) return 1;
```

When priorities are equal — Zilliqa and Neo are both 20 — neither branch runs and the function returns `undefined`. `Array.prototype.sort` requires a number; `undefined` is implementation-defined. Works by accident today. Use `getPriority(b.blockchain) - getPriority(a.blockchain)`.

### 6. `key={index}` on a list that gets sorted

Index keys are only safe when the list never reorders. This one does. When it reorders, React reuses each DOM slot under the wrong logical row — focus jumps, animations replay on the wrong item, any internal row state sticks to position rather than data. Use `balance.currency`.

### 7. Redundant dependency in `useMemo`

`prices` is listed in the dep array but never read inside the memo body.

### 8. `getPriority` is declared inside the component

Recreated on every render. Move it to module scope, and replace the switch with a `Record<Blockchain, number>` lookup for better lookup performance.

### 9. `usdValue` is computed inside the row map

Redundant per-render calculation. Fold it into the `useMemo` as an extra field on the result, next to `formatted`.

### 10. Missing prices produce `NaN`

`prices[balance.currency]` is `undefined` for tokens the dictionary doesn't have. `undefined * amount` is `NaN`, which reaches the DOM as `$NaN`.

### 11. `blockchain: any`

Not recommended. `any` disables type-checking at the call site — that's why #2 slipped past the compiler. Cast to an explicit type. An `enum` is a good fit for a fixed, named set of chains like this; a string-literal union works too.

### 12. `interface Props extends BoxProps {}` is empty

Adds nothing. Use `type Props = BoxProps` or just `BoxProps` directly. Lint rules flag this.

### 13. `children` is destructured but never rendered

`const { children, ...rest } = props` pulls children out, then nothing in the JSX uses them. Consumers passing children get nothing back.

### 14. Multiple chained array passes

`filter → sort → map(format) → map(rows)` walks the list four times. Can be optimized into one `useMemo` producing the final shape; render then has a single `.map`.

### 15. Redundant type annotation

`React.FC<Props>` already implies the parameter type; the `: Props` on `(props: Props)` is duplicate. Drop the parameter annotation and keep `React.FC<Props>`.

---

## Possible business issue

### 16. `.toFixed()` with no argument means zero decimals

`(0.5).toFixed()` returns `"1"`. The code runs and the value is well-defined — but rounding crypto amounts to whole units is unreal from a business standpoint. A user holding 0.5 ETH would see "1 ETH". Real crypto needs explicit precision.

### 17. The filter keeps the wrong items

```js
if (balancePriority > -99) {
  if (balance.amount <= 0) {
    return true;
  }
}
return false
```

Keeps only zero or negative balances. Not a critical bug — the code is ok, it doesn't crash — but it reads as unreal from a business standpoint. A wallet should show positive holdings, not empty or debt rows. Should be `balance.amount > 0`.
