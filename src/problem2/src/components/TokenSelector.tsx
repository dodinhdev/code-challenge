import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { TokenIcon } from '@/components/TokenIcon';
import { useIsTouch } from '@/hooks/useIsTouch';
import { POPULAR_SET, POPULAR_SYMBOLS } from '@/lib/tokens';
import type { Token } from '@/lib/types';

type Props = {
  tokens: Token[];
  value: string | null;
  onChange: (symbol: string) => void;
  placeholder?: string;
  disabledSymbol?: string;
  disabled?: boolean;
};

export function TokenSelector({
  tokens,
  value,
  onChange,
  placeholder = 'Select a token',
  disabledSymbol,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const isTouch = useIsTouch();
  const selected = useMemo(
    () => tokens.find((t) => t.symbol === value) ?? null,
    [tokens, value],
  );

  const { popular, others } = useMemo(() => {
    const popularList: Token[] = [];
    const othersList: Token[] = [];
    for (const t of tokens) {
      (POPULAR_SET.has(t.symbol) ? popularList : othersList).push(t);
    }
    popularList.sort(
      (a, b) =>
        POPULAR_SYMBOLS.indexOf(a.symbol as (typeof POPULAR_SYMBOLS)[number]) -
        POPULAR_SYMBOLS.indexOf(b.symbol as (typeof POPULAR_SYMBOLS)[number]),
    );
    return { popular: popularList, others: othersList };
  }, [tokens]);

  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={selected ? `Token: ${selected.symbol}. Tap to change.` : placeholder}
          className="inline-flex h-11 w-36 items-center justify-between gap-2 rounded-full border border-border bg-background px-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex min-w-0 items-center gap-2">
            {selected ? (
              <>
                <TokenIcon symbol={selected.symbol} size={22} />
                <span className="truncate">{selected.symbol}</span>
              </>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
        onOpenAutoFocus={(e) => {
          if (isTouch) e.preventDefault();
        }}
      >
        <Command
          filter={(itemValue, search) =>
            itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput placeholder="Search symbol..." autoFocus={!isTouch} />
          <CommandList>
            <CommandEmpty>No tokens match.</CommandEmpty>
            {popular.length > 0 && (
              <>
                <CommandGroup heading="Popular">
                  {popular.map((t) => (
                    <TokenRow
                      key={t.symbol}
                      token={t}
                      disabled={t.symbol === disabledSymbol}
                      isSelected={t.symbol === value}
                      onSelect={handleSelect}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup heading="All tokens">
              {others.map((t) => (
                <TokenRow
                  key={t.symbol}
                  token={t}
                  disabled={t.symbol === disabledSymbol}
                  isSelected={t.symbol === value}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TokenRow({
  token,
  disabled,
  isSelected,
  onSelect,
}: {
  token: Token;
  disabled: boolean;
  isSelected: boolean;
  onSelect: (symbol: string) => void;
}) {
  return (
    <CommandItem
      value={token.symbol}
      disabled={disabled}
      onSelect={() => onSelect(token.symbol)}
      aria-selected={isSelected}
    >
      <TokenIcon symbol={token.symbol} size={28} />
      <span className="font-medium">{token.symbol}</span>
      {disabled ? (
        <span className="ml-auto text-xs text-muted-foreground">In use</span>
      ) : isSelected ? (
        <span className="ml-auto text-xs font-medium text-primary">Selected</span>
      ) : null}
    </CommandItem>
  );
}
