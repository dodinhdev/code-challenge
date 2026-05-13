import { describe, it, expect } from 'vitest';
import { computeRate, computeReceive, computePay } from '@/lib/swap';

describe('computeRate', () => {
  it('returns the ratio of prices', () => {
    expect(computeRate(1800, 1)).toBe(1800);
  });

  it('returns 0 for non-positive inputs', () => {
    expect(computeRate(0, 1)).toBe(0);
    expect(computeRate(1, 0)).toBe(0);
    expect(computeRate(-1, 1)).toBe(0);
  });
});

describe('computeReceive', () => {
  it('converts pay amount through prices', () => {
    expect(computeReceive(1, 1800, 1)).toBe(1800);
    expect(computeReceive(2, 1800, 1)).toBe(3600);
    expect(computeReceive(100, 1, 1800)).toBeCloseTo(100 / 1800, 10);
  });

  it('returns 0 when any input is non-positive', () => {
    expect(computeReceive(0, 1, 1)).toBe(0);
    expect(computeReceive(1, 0, 1)).toBe(0);
    expect(computeReceive(1, 1, 0)).toBe(0);
  });
});

describe('computePay', () => {
  it('is the inverse of computeReceive', () => {
    const payPrice = 1800;
    const receivePrice = 1;
    const payAmount = 2.5;
    const receive = computeReceive(payAmount, payPrice, receivePrice);
    const roundtrip = computePay(receive, payPrice, receivePrice);
    expect(roundtrip).toBeCloseTo(payAmount, 8);
  });

  it('returns 0 when any input is non-positive', () => {
    expect(computePay(0, 1, 1)).toBe(0);
    expect(computePay(1, 0, 1)).toBe(0);
    expect(computePay(1, 1, 0)).toBe(0);
  });
});

