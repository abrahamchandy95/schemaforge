'use client';

import { useState } from 'react';
import { runAgent } from '@/lib/tigergraph/agent/run';
import { useCtx } from '@/features/wizard/provider/root';
import { Frame } from '@/features/wizard/ui';
import { Assumptions } from '@/features/wizard/steps/08-recommendation/Assumptions';
import { Preview } from '@/features/wizard/steps/08-recommendation/Preview';
import { Summary } from '@/features/wizard/steps/08-recommendation/Summary';

export function Recommendation() {
  const { state, setSchemaDraft } = useCtx();
  const draft = state.schemaDraft;

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setErr(null);

    try {
      const output = await runAgent(state);
      setSchemaDraft(output.draft);
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : 'Failed to generate recommendation.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame
      stepLabel="STEP 8"
      title="AI Schema Recommendation"
      description="Generate a schema recommendation using your goal, profiled files, confirmed mapping, column context, and graph design priorities."
    >
      {err && (
        <section className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Recommendation failed
          </p>
          <p className="mt-1 text-sm text-red-700">{err}</p>
        </section>
      )}

      {!draft ? (
        <section className="rounded-xl border border-slate-300 bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">
            No schema draft has been generated yet.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Generate a recommendation from the confirmed mapping, file profile,
            query needs, and column context collected in earlier steps.
          </p>

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="mt-5 rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Generating Recommendation...' : 'Generate Recommendation'}
          </button>
        </section>
      ) : (
        <div className="space-y-5">
          <Summary draft={draft} onRegenerate={generate} />
          <Preview draft={draft} />
          <Assumptions items={draft.assumptions} />

          {busy && (
            <section className="rounded-xl border border-slate-300 bg-white p-4">
              <p className="text-sm text-slate-700">
                Regenerating recommendation...
              </p>
            </section>
          )}
        </div>
      )}
    </Frame>
  );
}
