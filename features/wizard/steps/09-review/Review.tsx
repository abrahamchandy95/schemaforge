'use client';

import { useDraft } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Editor } from '@/features/wizard/steps/09-review/Editor';
import { Feedback } from '@/features/wizard/steps/09-review/Feedback';

export function Review() {
  const {
    draft,
    feedbackDraft,
    setDraft,
    setFeedbackDraft,
    applyFeedback,
  } = useDraft();

  return (
    <Frame
      stepLabel="STEP 9"
      title="Schema Review, Editing, and Feedback"
      description="Review and refine the recommended schema through structured editing and natural language feedback."
    >
      {!draft ? (
        <section className="rounded-xl border border-slate-300 bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">
            No schema draft is available to review yet.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Generate a schema recommendation first, then come back to refine it.
          </p>
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Editor draft={draft} onChange={setDraft} />

          <Feedback
            draftText={feedbackDraft}
            history={draft.feedbackHistory}
            onDraftChange={setFeedbackDraft}
            onApply={() => applyFeedback(feedbackDraft)}
          />
        </div>
      )}
    </Frame>
  );
}
