import React, { useMemo } from 'react';
import { useWalletBalances, usePrices } from './hooks';
import { WalletRow } from './WalletRow';
import { classes } from './styles';
import type { BoxProps } from './types';

enum Blockchain {
  Osmosis = 'Osmosis',
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Zilliqa = 'Zilliqa',
  Neo = 'Neo',
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

const UNKNOWN_PRIORITY = -99;

const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

function getPriority(blockchain: Blockchain): number {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? UNKNOWN_PRIORITY;
}

const AMOUNT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

type Props = BoxProps;

export const WalletPage: React.FC<Props> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter((b) => b.amount > 0 && getPriority(b.blockchain) > UNKNOWN_PRIORITY)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
      .map((b) => {
        const price = prices[b.currency] ?? 0;
        return {
          ...b,
          formatted: AMOUNT_FORMATTER.format(b.amount),
          usdValue: price * b.amount,
        };
      });
  }, [balances, prices]);

  return (
    <div {...props}>
      {formattedBalances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
