'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useDraft() {
  const { state } = useWizardState();
  const {
    generateSchemaDraft,
    setSchemaDraft,
    setSchemaReviewDraftFeedbackText,
    applySchemaDraftFeedback,
  } = useWizardActions();

  return {
    draft: state.schemaDraft,
    feedbackDraft: state.schemaReview.draftFeedbackText,
    generateDraft: generateSchemaDraft,
    setDraft: setSchemaDraft,
    setFeedbackDraft: setSchemaReviewDraftFeedbackText,
    applyFeedback: applySchemaDraftFeedback,
  };
}
