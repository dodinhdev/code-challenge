import { toast } from 'sonner';
import { TokenSkeleton } from '@/components/TokenSkeleton';
import { SwapPanel } from '@/components/SwapPanel';
import { FlipButton } from '@/components/FlipButton';
import { SwapDetails } from '@/components/SwapDetails';
import { SubmitButton } from '@/components/SubmitButton';
import { usePrices } from '@/hooks/usePrices';
import { useSwap } from '@/hooks/useSwap';
import { isPositiveAmount } from '@/lib/format';
import type { Token } from '@/lib/types';

export function Problem2Page() {
  const { tokens, isLoading, error } = usePrices();

  const showSkeleton = isLoading && tokens.length === 0;
  const showError = !isLoading && error && tokens.length === 0;
  const showForm = tokens.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Currency Swap</h1>
      </div>
      {showSkeleton && <TokenSkeleton />}
      {showError && <ErrorBanner message={error.message} />}
      {showForm && <SwapForm tokens={tokens} />}
    </main>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive bg-destructive/10 p-4 text-sm">
      <p className="font-medium text-destructive">Couldn't load tokens</p>
      <p className="mt-1 text-muted-foreground">{message}. Refresh the page to try again.</p>
    </div>
  );
}

type SubmitView = { label: string; disabled: boolean };

function computeSubmitView(
  payToken: string | null,
  receiveToken: string | null,
  payAmount: string,
  isSubmitting: boolean,
): SubmitView {
  if (isSubmitting) return { label: 'Swapping…', disabled: true };
  if (!payToken || !receiveToken) return { label: 'Select tokens', disabled: true };
  if (payToken === receiveToken) return { label: 'Pick two different tokens', disabled: true };
  if (!isPositiveAmount(payAmount)) return { label: 'Enter an amount', disabled: true };
  return { label: `Swap ${payToken} for ${receiveToken}`, disabled: false };
}

function SwapForm({ tokens }: { tokens: Token[] }) {
  const swap = useSwap({ tokens });
  const { payToken, receiveToken } = swap;
  const isSubmitting = swap.submitState === 'submitting';
  const submitView = computeSubmitView(payToken, receiveToken, swap.payAmount, isSubmitting);

  const handleSubmit = async () => {
    const result = await swap.submit();
    if (result) {
      toast.success('Swap submitted', {
        description: `${result.payAmount} ${result.payToken} → ${result.receiveAmount} ${result.receiveToken}`,
      });
    }
  };

  return (
    <div>
      <div className="relative flex flex-col gap-2">
        <SwapPanel
          side="pay"
          amount={swap.payAmount}
          onAmountChange={swap.setPayAmount}
          token={payToken}
          onTokenChange={swap.setPayToken}
          tokens={tokens}
          disabledTokenSymbol={receiveToken ?? undefined}
          disabled={isSubmitting}
        />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center">
          <div className="pointer-events-auto">
            <FlipButton onClick={swap.flip} disabled={isSubmitting} />
          </div>
        </div>
        <SwapPanel
          side="receive"
          amount={swap.receiveAmount}
          onAmountChange={swap.setReceiveAmount}
          token={receiveToken}
          onTokenChange={swap.setReceiveToken}
          tokens={tokens}
          disabledTokenSymbol={payToken ?? undefined}
          disabled={isSubmitting}
        />
      </div>
      {payToken && receiveToken && (
        <SwapDetails payToken={payToken} receiveToken={receiveToken} rate={swap.rate} />
      )}
      <SubmitButton
        label={submitView.label}
        loading={isSubmitting}
        disabled={submitView.disabled}
        onClick={handleSubmit}
      />
    </div>
  );
}
