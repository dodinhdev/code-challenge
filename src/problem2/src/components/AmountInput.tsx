import { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { formatAmount, parseAmount } from '@/lib/format';

const MIN_FONT_PX = 12;
const SAFETY_FACTOR = 0.94;
const MAX_LENGTH = 24;

function sanitizeNumericInput(raw: string): string {
  const stripped = raw.replace(/[^\d.,\s]/g, '');
  const firstDot = stripped.indexOf('.');
  if (firstDot === -1) return stripped;
  return stripped.slice(0, firstDot + 1) + stripped.slice(firstDot + 1).replace(/\./g, '');
}

type Props = {
  value: string;
  onChange: (raw: string) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function AmountInput({ value, onChange, ariaLabel, disabled, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const fitText = () => {
    const input = inputRef.current;
    const measure = measureRef.current;
    if (!input || !measure) return;
    const inputWidth = input.clientWidth;
    if (inputWidth <= 0) return;
    const baseSize = parseFloat(getComputedStyle(measure).fontSize);
    const textWidth = measure.offsetWidth;
    if (textWidth > inputWidth) {
      const scaled = Math.max(MIN_FONT_PX, baseSize * (inputWidth / textWidth) * SAFETY_FACTOR);
      input.style.fontSize = `${scaled}px`;
    } else {
      input.style.fontSize = '';
    }
  };

  useLayoutEffect(() => {
    fitText();
  });

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const ro = new ResizeObserver(() => fitText());
    ro.observe(input);
    return () => ro.disconnect();
  }, []);

  const handleBlur = () => {
    if (!value.trim()) return;
    const parsed = parseAmount(value);
    if (!Number.isFinite(parsed)) return;
    const formatted = formatAmount(parsed);
    if (formatted !== value) onChange(formatted);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={MAX_LENGTH}
        aria-label={ariaLabel}
        value={value}
        placeholder="0"
        disabled={disabled}
        onChange={(e) => onChange(sanitizeNumericInput(e.target.value))}
        onBlur={handleBlur}
        className={cn(
          'w-full bg-transparent text-3xl font-semibold tabular-nums tracking-tight text-foreground outline-none transition-[font-size] duration-150 ease-out placeholder:text-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-60 sm:text-4xl',
          className,
        )}
      />
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl"
      >
        {value || '0'}
      </span>
    </div>
  );
}
