import { useState } from 'react';
import { computePay, computeRate, computeReceive } from '@/lib/swap';
import { formatAmount, isPositiveAmount, parseAmount } from '@/lib/format';
import {
  DEFAULT_PAY_SYMBOL,
  DEFAULT_RECEIVE_SYMBOL,
  SUBMIT_DELAY_MS,
} from '@/lib/constants';
import type { SwapDirection, Token } from '@/lib/types';

type Args = {
  tokens: Token[];
};

export type SubmitState = 'idle' | 'submitting';

export type SubmitResult = {
  payAmount: string;
  payToken: string;
  receiveAmount: string;
  receiveToken: string;
};

export type UseSwapResult = {
  payToken: string | null;
  receiveToken: string | null;
  payAmount: string;
  receiveAmount: string;
  rate: number;
  submitState: SubmitState;
  setPayAmount: (raw: string) => void;
  setReceiveAmount: (raw: string) => void;
  setPayToken: (symbol: string) => void;
  setReceiveToken: (symbol: string) => void;
  flip: () => void;
  submit: () => Promise<SubmitResult | null>;
};

function deriveOther(
  source: SwapDirection,
  sourceRaw: string,
  payT: Token | null,
  recT: Token | null,
): string {
  if (!payT || !recT) return '';
  if (!isPositiveAmount(sourceRaw)) return '';
  const parsed = parseAmount(sourceRaw);
  const next =
    source === 'pay'
      ? computeReceive(parsed, payT.price, recT.price)
      : computePay(parsed, payT.price, recT.price);
  return next > 0 ? formatAmount(next) : '';
}

export function useSwap({ tokens }: Args): UseSwapResult {
  const [payToken, setPayTokenState] = useState<string | null>(
    () => tokens.find((t) => t.symbol === DEFAULT_PAY_SYMBOL)?.symbol ?? null,
  );
  const [receiveToken, setReceiveTokenState] = useState<string | null>(
    () => tokens.find((t) => t.symbol === DEFAULT_RECEIVE_SYMBOL)?.symbol ?? null,
  );
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [lastEdited, setLastEdited] = useState<SwapDirection>('pay');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const payT = tokens.find((t) => t.symbol === payToken) ?? null;
  const recT = tokens.find((t) => t.symbol === receiveToken) ?? null;
  const rate = payT && recT ? computeRate(payT.price, recT.price) : 0;

  const applyAmountChange = (side: SwapDirection, raw: string) => {
    setLastEdited(side);
    if (side === 'pay') {
      setPayAmount(raw);
      setReceiveAmount(deriveOther('pay', raw, payT, recT));
    } else {
      setReceiveAmount(raw);
      setPayAmount(deriveOther('receive', raw, payT, recT));
    }
  };

  const applyTokenChange = (side: SwapDirection, symbol: string) => {
    const lookup = tokens.find((t) => t.symbol === symbol) ?? null;
    const newPayT = side === 'pay' ? lookup : payT;
    const newRecT = side === 'pay' ? recT : lookup;
    if (side === 'pay') setPayTokenState(symbol);
    else setReceiveTokenState(symbol);
    if (lastEdited === 'pay') {
      setReceiveAmount(deriveOther('pay', payAmount, newPayT, newRecT));
    } else {
      setPayAmount(deriveOther('receive', receiveAmount, newPayT, newRecT));
    }
  };

  const flip = () => {
    setPayTokenState(receiveToken);
    setReceiveTokenState(payToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(deriveOther('pay', receiveAmount, recT, payT));
    setLastEdited('pay');
  };

  const submit = async (): Promise<SubmitResult | null> => {
    if (submitState !== 'idle') return null;
    if (!payToken || !receiveToken) return null;
    if (!isPositiveAmount(payAmount)) return null;

    const snapshot: SubmitResult = {
      payAmount,
      payToken,
      receiveAmount,
      receiveToken,
    };

    setSubmitState('submitting');
    await new Promise((r) => setTimeout(r, SUBMIT_DELAY_MS));
    setPayAmount('');
    setReceiveAmount('');
    setSubmitState('idle');
    return snapshot;
  };

  return {
    payToken,
    receiveToken,
    payAmount,
    receiveAmount,
    rate,
    submitState,
    setPayAmount: (raw) => applyAmountChange('pay', raw),
    setReceiveAmount: (raw) => applyAmountChange('receive', raw),
    setPayToken: (symbol) => applyTokenChange('pay', symbol),
    setReceiveToken: (symbol) => applyTokenChange('receive', symbol),
    flip,
    submit,
  };
}
