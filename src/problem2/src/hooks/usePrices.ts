import { useEffect, useState } from 'react';
import { fetchPrices, toTokens } from '@/lib/prices';
import type { Token } from '@/lib/types';

export type UsePricesResult = {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
};

export function usePrices(): UsePricesResult {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const entries = await fetchPrices(controller.signal);
        if (controller.signal.aborted) return;
        setTokens(toTokens(entries));
        setError(null);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { tokens, isLoading, error };
}
