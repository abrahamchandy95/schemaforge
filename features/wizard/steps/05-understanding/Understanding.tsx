'use client';

import { useCase, useNav, useUpload } from '@/features/wizard/provider';
import { buildDataUnderstandingViewModel } from '@/features/wizard/services/understanding';
import { Frame, Section } from '@/features/wizard/ui';
import { Matches } from '@/features/wizard/steps/05-understanding/Matches';
import { Summary } from '@/features/wizard/steps/05-understanding/Summary';
import { Warnings } from '@/features/wizard/steps/05-understanding/Warnings';

export function Understanding() {
  const { files } = useUpload();
  const { kit } = useCase();
  const { previous } = useNav();

  const view = buildDataUnderstandingViewModel({
    files,
    selectedKitId: kit,
  });

  return (
    <Frame
      stepLabel="STEP 5"
      title="Data Understanding"
      description="The system displays detected columns and sample rows so you can confirm the dataset structure against your selected use case and queries. Check for missing essential components."
    >
      <div className="space-y-5">
        <Summary view={view} />

        <Matches selectedKitId={kit} view={view} />

        <Warnings items={view.warnings} />

        <section className="flex items-start justify-between gap-4">
          <Section className="max-w-3xl bg-slate-100">
            <p className="text-sm text-slate-700">{view.note}</p>
          </Section>

          <button
            type="button"
            onClick={previous}
            className="shrink-0 rounded-xl border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-sky-600"
          >
            Back to Upload (Step 4)
          </button>
        </section>
      </div>
    </Frame>
  );
}
