import { formatRate } from '@/lib/format';

type Props = {
  payToken: string;
  receiveToken: string;
  rate: number;
};

export function SwapDetails({ payToken, receiveToken, rate }: Props) {
  return (
    <div className="mt-4 rounded-xl bg-muted/30 px-4 py-3 text-center text-sm font-medium tabular-nums">
      {formatRate(payToken, receiveToken, rate)}
    </div>
  );
}
