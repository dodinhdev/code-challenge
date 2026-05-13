import { describe, it, expect } from 'vitest';
import { dedupePrices, toTokens } from '@/lib/prices';
import { tokenIconUrl } from '@/lib/tokens';
import type { PriceEntry } from '@/lib/prices';

describe('dedupePrices', () => {
  it('returns an empty array for empty input', () => {
    expect(dedupePrices([])).toEqual([]);
  });

  it('keeps the latest entry per currency', () => {
    const older: PriceEntry = { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.99 };
    const newer: PriceEntry = { currency: 'BUSD', date: '2023-08-30T07:10:40.000Z', price: 1.0 };
    const result = dedupePrices([older, newer]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newer);
  });

  it('keeps the latest entry regardless of input order', () => {
    const older: PriceEntry = { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.99 };
    const newer: PriceEntry = { currency: 'BUSD', date: '2023-08-30T07:10:40.000Z', price: 1.0 };
    const result = dedupePrices([newer, older]);
    expect(result[0]).toEqual(newer);
  });

  it('preserves distinct currencies', () => {
    const entries: PriceEntry[] = [
      { currency: 'ETH', date: '2023-08-29T07:10:40.000Z', price: 1800 },
      { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 1 },
    ];
    const result = dedupePrices(entries);
    expect(result).toHaveLength(2);
  });
});

describe('toTokens', () => {
  it('drops entries without a positive numeric price', () => {
    const entries = [
      { currency: 'A', date: '2023-08-29T07:10:40.000Z', price: 1 },
      { currency: 'B', date: '2023-08-29T07:10:40.000Z', price: 0 },
      { currency: 'C', date: '2023-08-29T07:10:40.000Z', price: -1 },
      { currency: 'D', date: '2023-08-29T07:10:40.000Z', price: NaN as unknown as number },
    ] as PriceEntry[];
    const result = toTokens(entries);
    expect(result.map((t) => t.symbol)).toEqual(['A']);
  });

  it('sorts tokens alphabetically by symbol', () => {
    const entries: PriceEntry[] = [
      { currency: 'ETH', date: '2023-08-29T07:10:40.000Z', price: 1800 },
      { currency: 'ATOM', date: '2023-08-29T07:10:40.000Z', price: 10 },
      { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 1 },
    ];
    expect(toTokens(entries).map((t) => t.symbol)).toEqual(['ATOM', 'ETH', 'USDC']);
  });

  it('applies icon aliases for stTokens', () => {
    expect(tokenIconUrl('STATOM')).toContain('stATOM.svg');
    expect(tokenIconUrl('RATOM')).toContain('rATOM.svg');
  });

  it('builds icon URLs for non-aliased symbols using the symbol verbatim', () => {
    expect(tokenIconUrl('ETH')).toContain('ETH.svg');
    expect(tokenIconUrl('bNEO')).toContain('bNEO.svg');
  });
});
