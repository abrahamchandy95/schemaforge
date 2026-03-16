'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useQueries() {
  const { state } = useWizardState();
  const {
    toggleSuggestedQuery,
    startAddingCustomQuery,
    cancelAddingCustomQuery,
    setDraftCustomQueryText,
    addCustomQuery,
    removeCustomQuery,
  } = useWizardActions();

  return {
    selectedIds: state.queries.selectedSuggestedQueryIds,
    custom: state.queries.customQueries,
    draft: state.queries.draftCustomQueryText,
    isAdding: state.queries.isAddingCustomQuery,
    toggle: toggleSuggestedQuery,
    start: startAddingCustomQuery,
    cancel: cancelAddingCustomQuery,
    setDraft: setDraftCustomQueryText,
    add: addCustomQuery,
    remove: removeCustomQuery,
  };
}
