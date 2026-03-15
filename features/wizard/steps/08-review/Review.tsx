'use client';

import { useDraft } from '@/features/wizard/provider';
import { Empty, Frame } from '@/features/wizard/ui';
import { Editor } from '@/features/wizard/steps/08-review/Editor';
import { Feedback } from '@/features/wizard/steps/08-review/Feedback';

export function Review() {
  const { draft, setDraft, feedbackDraft, setFeedbackDraft, applyFeedback } =
    useDraft();

  return (
    <Frame
      stepLabel="STEP 8"
      title="Schema Review, Editing, and Feedback"
      description="Review and refine the recommended schema through structured editing and natural language feedback."
    >
      {!draft ? (
        <Empty
          title="No schema draft is available to review yet."
          description="Generate a schema recommendation first, then come back to refine it."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Editor draft={draft} onChange={setDraft} />

          <Feedback
            draftText={feedbackDraft}
            history={draft.feedbackHistory}
            onDraftChange={setFeedbackDraft}
            onApply={applyFeedback}
          />
        </div>
      )}
    </Frame>
  );
}
