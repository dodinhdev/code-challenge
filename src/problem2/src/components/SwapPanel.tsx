import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { AmountInput } from '@/components/AmountInput';
import { TokenSelector } from '@/components/TokenSelector';
import { formatUsd, isPositiveAmount, parseAmount } from '@/lib/format';
import type { SwapDirection, Token } from '@/lib/types';

type Props = {
  side: SwapDirection;
  amount: string;
  onAmountChange: (raw: string) => void;
  token: string | null;
  onTokenChange: (symbol: string) => void;
  tokens: Token[];
  disabledTokenSymbol?: string;
  disabled?: boolean;
};

export function SwapPanel({
  side,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  tokens,
  disabledTokenSymbol,
  disabled,
}: Props) {
  const isPay = side === 'pay';
  const label = isPay ? 'Pay' : 'Receive';
  const Icon = isPay ? ArrowUpRight : ArrowDownRight;

  const tokenObj = tokens.find((t) => t.symbol === token) ?? null;
  const usdValue =
    tokenObj && isPositiveAmount(amount) ? parseAmount(amount) * tokenObj.price : 0;

  return (
    <div className="rounded-2xl border border-border bg-muted/60 p-4 transition-colors focus-within:border-ring/40 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white">
            <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          {label}
        </div>
        <TokenSelector
          tokens={tokens}
          value={token}
          onChange={onTokenChange}
          disabledSymbol={disabledTokenSymbol}
          placeholder="Choose"
          disabled={disabled}
        />
      </div>
      <div className="mt-3 w-full">
        <AmountInput
          value={amount}
          onChange={onAmountChange}
          ariaLabel={`${label} amount${token ? ` in ${token}` : ''}`}
          disabled={disabled}
          className="text-right"
        />
      </div>
      <div className="mt-1 flex justify-end text-sm text-muted-foreground tabular-nums">
        {usdValue > 0 ? formatUsd(usdValue) : '$0.00'}
      </div>
    </div>
  );
}
