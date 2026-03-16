'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useColumns() {
  const { state } = useWizardState();
  const {
    initializeColumnContext,
    updateColumnContextColumn,
    updateColumnContextGlobalPriorities,
  } = useWizardActions();

  return {
    cols: state.columnContext.columns,
    priorities: state.columnContext.globalPriorities,
    init: initializeColumnContext,
    updateCol: updateColumnContextColumn,
    updatePriorities: updateColumnContextGlobalPriorities,
  };
}
