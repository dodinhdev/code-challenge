import { z } from 'zod';
import type { Token } from './types';
import { PRICES_URL } from './constants';

const PriceEntrySchema = z.object({
  currency: z.string(),
  date: z.string(),
  price: z.number(),
});

const PriceFeedSchema = z.array(PriceEntrySchema);

export type PriceEntry = z.infer<typeof PriceEntrySchema>;

export async function fetchPrices(signal?: AbortSignal): Promise<PriceEntry[]> {
  const res = await fetch(PRICES_URL, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load prices (HTTP ${res.status})`);
  }
  const data = (await res.json()) as unknown;
  const result = PriceFeedSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Price feed shape changed unexpectedly');
  }
  return result.data;
}

export function dedupePrices(entries: PriceEntry[]): PriceEntry[] {
  const latestByCurrency = new Map<string, PriceEntry>();
  for (const entry of entries) {
    const existing = latestByCurrency.get(entry.currency);
    if (!existing || entry.date > existing.date) {
      latestByCurrency.set(entry.currency, entry);
    }
  }
  return [...latestByCurrency.values()];
}

export function toTokens(entries: PriceEntry[]): Token[] {
  return dedupePrices(entries)
    .filter((e) => typeof e.price === 'number' && Number.isFinite(e.price) && e.price > 0)
    .map((e) => ({
      symbol: e.currency,
      price: e.price,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}
