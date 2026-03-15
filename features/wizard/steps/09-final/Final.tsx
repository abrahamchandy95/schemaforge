'use client';

import { useDraft, useFinal } from '@/features/wizard/provider';
import { Empty, Frame, Section, SummaryCard } from '@/features/wizard/ui';
import { Mapping } from '@/features/wizard/steps/09-final/Mapping';
import { Preview } from '@/features/wizard/steps/09-final/Preview';

export function Final() {
  const { draft } = useDraft();
  const { finalOut, generateFinal } = useFinal();

  return (
    <Frame
      stepLabel="STEP 9"
      title="Final Schema Creation"
      description="Generate the final schema, loading job, and file-to-graph mapping needed to create the graph."
    >
      {!draft ? (
        <Empty
          title="No reviewed schema is available yet."
          description="Complete the recommendation and review steps first, then generate the final schema package."
        />
      ) : !finalOut ? (
        <Empty
          title="Final output has not been generated yet."
          description="Generate the final schema text, loading job preview, and mapping summary from the reviewed draft."
          action={
            <button
              type="button"
              onClick={generateFinal}
              className="rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600"
            >
              Generate Final Schema
            </button>
          }
        />
      ) : (
        <div className="space-y-5">
          <Section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-slate-900">
                  Final Output Package
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  This package includes the final schema preview, loading job
                  preview, and source-to-graph mappings.
                </p>
              </div>

              <button
                type="button"
                onClick={generateFinal}
                className="shrink-0 rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Regenerate Output
              </button>
            </div>
          </Section>

          <div className="grid gap-4 xl:grid-cols-4">
            {finalOut.summaryLines.map((line, index) => (
              <SummaryCard
                key={`${line}-${index}`}
                title={`Summary ${index + 1}`}
                value={line}
              />
            ))}
          </div>

          <Preview artifact={finalOut} />
          <Mapping rows={finalOut.mappingRows} />
        </div>
      )}
    </Frame>
  );
}
