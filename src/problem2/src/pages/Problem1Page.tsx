import { ExternalLink } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import { GITHUB_REPO_BASE } from '@/lib/constants';
import sumToNSource from '../../../problem1/sum_to_n.js?raw';

const GITHUB_URL = `${GITHUB_REPO_BASE}/src/problem1/sum_to_n.js`;

export function Problem1Page() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Problem 1 — Three ways to sum to n
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          The brief asks for three different implementations of <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">sum_to_n(n)</code>{' '}
          that each return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">1 + 2 + … + n</code>. I picked an iterative loop, the closed-form
          (Gauss's formula), and a functional reduce — three distinct paradigms applied to the same problem.
        </p>
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Approach
          title="Iterative loop"
          complexity="O(n) time · O(1) space"
          summary="A direct translation of the definition. Walks from 1 (or -1) to n, accumulating into a running total."
        />
        <Approach
          title="Closed-form (Gauss)"
          complexity="O(1) time · O(1) space"
          summary="The arithmetic-series identity n·(n+1)/2 computed on the absolute value, sign re-applied. The one I'd use in real code."
        />
        <Approach
          title="Functional reduce"
          complexity="O(n) time · O(n) space"
          summary="Materialize the sequence with Array.from, then fold with reduce. No mutation; allocates the intermediate array."
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Input validation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Each function calls <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">assertInteger(n)</code> at the entrance. The brief
          guarantees integer input, but a single <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Number.isInteger</code> check
          rejects non-numbers, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">NaN</code>,{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Infinity</code>, and non-integer numbers in one line — cheap defence
          against future misuse.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Source</h2>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <CodeBlock code={sumToNSource} language="javascript" />
      </section>
    </div>
  );
}

function Approach({
  title,
  complexity,
  summary,
}: {
  title: string;
  complexity: string;
  summary: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{complexity}</div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
    </div>
  );
}
