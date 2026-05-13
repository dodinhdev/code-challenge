import { TOKEN_ICON_BASE } from './constants';

export const POPULAR_SYMBOLS = ['USD', 'USDC', 'ETH', 'WBTC'] as const;

export const POPULAR_SET: ReadonlySet<string> = new Set<string>(POPULAR_SYMBOLS);

const ICON_ALIASES: Record<string, string> = {
  RATOM: 'rATOM',
  STATOM: 'stATOM',
  STEVMOS: 'stEVMOS',
  STLUNA: 'stLUNA',
  STOSMO: 'stOSMO',
};

export function tokenIconUrl(symbol: string): string {
  const fileName = ICON_ALIASES[symbol] ?? symbol;
  return `${TOKEN_ICON_BASE}/${fileName}.svg`;
}
