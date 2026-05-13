import { AMOUNT_MAX_FRACTION_DIGITS } from './constants';

export function parseAmount(raw: string): number {
  if (!raw) return NaN;
  const cleaned = raw.replace(/[\s,]/g, '');
  if (!/^(\d+\.?\d*|\.\d+)$/.test(cleaned)) return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export function isPositiveAmount(raw: string): boolean {
  const parsed = parseAmount(raw);
  return Number.isFinite(parsed) && parsed > 0;
}

export function formatAmount(value: number, maxFractionDigits = AMOUNT_MAX_FRACTION_DIGITS): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatRate(fromSymbol: string, toSymbol: string, rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return '—';
  return `1 ${fromSymbol} ≈ ${formatAmount(rate)} ${toSymbol}`;
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '';
  return usdFormatter.format(value);
}
