import { useState } from 'react';
import { tokenIconUrl } from '@/lib/tokens';
import { cn } from '@/lib/utils';

function hashToHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function initials(symbol: string): string {
  const stripped = symbol.replace(/[^A-Za-z0-9]/g, '');
  return stripped.slice(0, 2).toUpperCase() || '?';
}

type Props = {
  symbol: string;
  size?: number;
  className?: string;
};

export function TokenIcon({ symbol, size = 28, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          backgroundColor: `hsl(${hashToHue(symbol)} 55% 45%)`,
          fontSize: Math.max(9, Math.floor(size * 0.36)),
        }}
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
          className,
        )}
      >
        {initials(symbol)}
      </div>
    );
  }

  return (
    <img
      src={tokenIconUrl(symbol)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full', className)}
    />
  );
}
