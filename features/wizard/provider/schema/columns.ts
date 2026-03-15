'use client';

import type {
  ColumnContextColumnPatch,
  ColumnContextGlobalPrioritiesPatch,
} from '@/features/wizard/model/types';
import { useRoot } from '@/features/wizard/provider/root';

export function useColumns() {
  const { state, dispatch } = useRoot();

  return {
    cols: state.columnContext.columns,
    priorities: state.columnContext.globalPriorities,
    updateCol: (columnId: string, value: ColumnContextColumnPatch) =>
      dispatch({
        type: 'column-context/update-column',
        columnId,
        value,
      }),
    updatePriorities: (value: ColumnContextGlobalPrioritiesPatch) =>
      dispatch({
        type: 'column-context/update-global',
        value,
      }),
  };
}
