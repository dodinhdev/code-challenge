import { describe, it, expect } from 'vitest';
import { parseAmount, formatAmount, formatRate } from '@/lib/format';

describe('parseAmount', () => {
  it('parses plain numbers', () => {
    expect(parseAmount('1000')).toBe(1000);
    expect(parseAmount('1000.5')).toBe(1000.5);
  });

  it('strips thousands separators (comma)', () => {
    expect(parseAmount('1,000.50')).toBe(1000.5);
    expect(parseAmount('1,234,567')).toBe(1234567);
  });

  it('strips whitespace', () => {
    expect(parseAmount('1 000.50')).toBe(1000.5);
    expect(parseAmount('  42 ')).toBe(42);
  });

  it('returns NaN for empty or non-numeric input', () => {
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('1.2.3')).toBeNaN();
  });

  it('rejects negative numbers', () => {
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('-1,000')).toBeNaN();
  });

  it('accepts trailing-dot and leading-dot for in-progress typing', () => {
    expect(parseAmount('5.')).toBe(5);
    expect(parseAmount('.5')).toBe(0.5);
  });
});

describe('formatAmount', () => {
  it('formats with grouping separators', () => {
    expect(formatAmount(1000)).toBe('1,000');
    expect(formatAmount(1234567.89)).toBe('1,234,567.89');
  });

  it('drops trailing zeros up to the precision limit', () => {
    expect(formatAmount(1.1)).toBe('1.1');
    expect(formatAmount(1.0)).toBe('1');
  });

  it('keeps small fractional prices visible up to 6 decimals', () => {
    expect(formatAmount(0.20811525)).toBe('0.208115');
  });

  it('returns empty string for non-finite values', () => {
    expect(formatAmount(NaN)).toBe('');
    expect(formatAmount(Infinity)).toBe('');
  });
});

describe('formatRate', () => {
  it('renders a readable rate line', () => {
    expect(formatRate('ETH', 'USDC', 1800)).toBe('1 ETH ≈ 1,800 USDC');
  });

  it('shows a dash for invalid rates', () => {
    expect(formatRate('ETH', 'USDC', 0)).toBe('—');
    expect(formatRate('ETH', 'USDC', NaN)).toBe('—');
  });
});

describe('parse / format roundtrip', () => {
  it('survives parse → format for representative inputs', () => {
    expect(formatAmount(parseAmount('1,234.5'))).toBe('1,234.5');
    expect(formatAmount(parseAmount('1000.5'))).toBe('1,000.5');
  });
});
