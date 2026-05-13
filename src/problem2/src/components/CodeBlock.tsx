import { Highlight, themes, type Language } from 'prism-react-renderer';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

type Props = {
  code: string;
  language: Language;
  className?: string;
};

export function CodeBlock({ code, language, className }: Props) {
  const { theme } = useTheme();
  const prismTheme = theme === 'dark' ? themes.vsDark : themes.vsLight;

  return (
    <Highlight code={code.trim()} language={language} theme={prismTheme}>
      {({ className: hlClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            'my-4 overflow-x-auto rounded-xl border border-border p-4 text-sm leading-relaxed font-mono',
            hlClass,
            className,
          )}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="flex">
              <span className="mr-4 inline-block w-8 shrink-0 select-none text-right tabular-nums opacity-40">
                {i + 1}
              </span>
              <span className="flex-1">
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
