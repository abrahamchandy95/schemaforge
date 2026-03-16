'use client';

import { useCtx } from '@/features/wizard/provider/root';
import { Frame } from '@/features/wizard/ui';
import { Mapping } from './Mapping';
import { Preview } from './Preview';

export function Final() {
  const { state, generateFinalSchemaArtifact } = useCtx();
  const draft = state.schemaDraft;
  const finalOut = state.finalSchemaArtifact;

  return (
    <Frame
      stepLabel="STEP 10"
      title="Final Schema Creation"
      description="Generate the final package using the confirmed transaction-fraud mapping backbone together with your reviewed schema metadata."
    >
      {!draft ? (
        <section className="rounded-xl border border-slate-300 bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">
            No reviewed schema is available yet.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Complete recommendation and review first, then generate the final
            schema package.
          </p>
        </section>
      ) : !finalOut ? (
        <section className="rounded-xl border border-slate-300 bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">
            Final output has not been generated yet.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Generate the final schema text, loading-job preview, and mapping
            summary from the reviewed draft and confirmed mapping.
          </p>

          <button
            type="button"
            onClick={generateFinalSchemaArtifact}
            className="mt-5 rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600"
          >
            Generate Final Schema
          </button>
        </section>
      ) : (
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-300 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {finalOut.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {finalOut.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={generateFinalSchemaArtifact}
                className="shrink-0 rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Regenerate Output
              </button>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-4">
            {finalOut.summaryLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                className="rounded-xl border border-slate-300 bg-white p-4 text-sm font-semibold text-slate-900"
              >
                {line}
              </div>
            ))}
          </div>

          <section className="rounded-xl border border-slate-300 bg-white p-5">
            <p className="mb-3 text-lg font-bold uppercase tracking-tight text-slate-900">
              Final Assumptions and Notes
            </p>

            {finalOut.assumptions.length === 0 ? (
              <p className="text-sm text-slate-600">
                No explicit assumptions were recorded.
              </p>
            ) : (
              <ul className="space-y-3">
                {finalOut.assumptions.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Preview artifact={finalOut} />
          <Mapping rows={finalOut.mappingRows} />
        </div>
      )}
    </Frame>
  );
}
