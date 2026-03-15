'use client';

import type { SchemaDraft } from '@/features/wizard/model/types';
import { useRoot } from '@/features/wizard/provider/root';

export function useDraft() {
  const { state, dispatch } = useRoot();

  return {
    draft: state.schemaDraft,
    feedbackDraft: state.schemaReview.draftFeedbackText,
    generateDraft: () => dispatch({ type: 'schema-draft/generate' }),
    setDraft: (value: SchemaDraft | null) =>
      dispatch({ type: 'schema-draft/set', value }),
    setFeedbackDraft: (value: string) =>
      dispatch({
        type: 'schema-review/set-feedback-draft',
        value,
      }),
    applyFeedback: () =>
      dispatch({
        type: 'schema-draft/apply-feedback',
        value: state.schemaReview.draftFeedbackText,
      }),
  };
}
