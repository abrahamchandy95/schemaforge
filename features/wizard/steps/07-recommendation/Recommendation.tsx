'use client';

import { useDraft } from '@/features/wizard/provider';
import { Empty, Frame } from '@/features/wizard/ui';
import { Assumptions } from '@/features/wizard/steps/07-recommendation/Assumptions';
import { Preview } from '@/features/wizard/steps/07-recommendation/Preview';
import { Summary } from '@/features/wizard/steps/07-recommendation/Summary';

export function Recommendation() {
  const { draft, generateDraft } = useDraft();

  return (
    <Frame
      stepLabel="STEP 7"
      title="AI Schema Recommendation"
      description="The system generates a recommended graph schema using your dataset, prompt, column context, and expected query patterns."
    >
      {!draft ? (
        <Empty
          title="No schema draft has been generated yet."
          description="Generate a recommendation from the data, use case, query needs, and column context collected in the earlier steps."
          action={
            <button
              type="button"
              onClick={generateDraft}
              className="rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600"
            >
              Generate Recommendation
            </button>
          }
        />
      ) : (
        <div className="space-y-5">
          <Summary draft={draft} onRegenerate={generateDraft} />
          <Preview draft={draft} />
          <Assumptions items={draft.assumptions} />
        </div>
      )}
    </Frame>
  );
}
