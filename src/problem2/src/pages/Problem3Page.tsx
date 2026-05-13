import { useState } from 'react';
import { ExternalLink, FileText, FileCode } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import { CodeBlock } from '@/components/CodeBlock';
import { GITHUB_REPO_BASE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import issuesMarkdown from '../../../problem3/ISSUES.md?raw';
import refactoredSource from '../../../problem3/WalletPage.refactored.tsx?raw';

const GITHUB_ISSUES = `${GITHUB_REPO_BASE}/src/problem3/ISSUES.md`;
const GITHUB_REFACTOR = `${GITHUB_REPO_BASE}/src/problem3/WalletPage.refactored.tsx`;

type View = 'report' | 'refactor';

export function Problem3Page() {
  const [view, setView] = useState<View>('report');

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Problem 3 — Messy React
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          A code review of the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">WalletPage</code> component from the brief — 18 findings ranked
          by impact, plus a refactored version that applies every fix. The brief says <em>"more points are awarded for accurately stating the issues and
          explaining correctly how to improve them"</em>, so the report is the primary deliverable.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2 overflow-x-auto border-b border-border">
        <ViewTab active={view === 'report'} onClick={() => setView('report')} icon={<FileText className="h-4 w-4" />}>
          Report (ISSUES.md)
        </ViewTab>
        <ViewTab active={view === 'refactor'} onClick={() => setView('refactor')} icon={<FileCode className="h-4 w-4" />}>
          Refactored component
        </ViewTab>
        <div className="ml-auto py-2">
          <a
            href={view === 'report' ? GITHUB_ISSUES : GITHUB_REFACTOR}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {view === 'report' && (
        <article className="prose-fix">
          <Markdown content={issuesMarkdown} />
        </article>
      )}

      {view === 'refactor' && (
        <section>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            The refactored component below applies every fix listed in the report. About a third the size of the original, type-correct without any casts, and behaviourally what the original was trying to do.
          </p>
          <CodeBlock code={refactoredSource} language="tsx" />
        </section>
      )}
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
