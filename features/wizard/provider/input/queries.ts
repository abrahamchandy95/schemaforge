'use client';

import { useRoot } from '@/features/wizard/provider/root';

export function useQueries() {
  const { state, dispatch } = useRoot();

  return {
    selectedIds: state.queries.selectedSuggestedQueryIds,
    custom: state.queries.customQueries,
    draft: state.queries.draftCustomQueryText,
    isAdding: state.queries.isAddingCustomQuery,
    toggle: (value: string) =>
      dispatch({ type: 'queries/toggle-suggested', value }),
    start: () => dispatch({ type: 'queries/start-adding-custom' }),
    cancel: () => dispatch({ type: 'queries/cancel-adding-custom' }),
    setDraft: (value: string) =>
      dispatch({ type: 'queries/set-draft-custom', value }),
    add: () => dispatch({ type: 'queries/add-custom' }),
    remove: (value: string) =>
      dispatch({ type: 'queries/remove-custom', value }),
  };
}
