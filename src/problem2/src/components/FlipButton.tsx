import { ArrowDownUp } from 'lucide-react';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function FlipButton({ onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Flip pay and receive tokens"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm transition-transform duration-200 hover:rotate-180 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:hover:rotate-0 motion-reduce:transition-none"
    >
      <ArrowDownUp className="h-5 w-5" />
    </button>
  );
}
