'use client';

import type { SolutionKitId } from '@/features/wizard/model/types';
import { useRoot } from '@/features/wizard/provider/root';

export function useCase() {
  const { state, dispatch } = useRoot();

  return {
    kit: state.useCase.selectedKitId,
    inferredKit: state.useCase.inferredKitId,
    customUseCase: state.useCase.customUseCaseText,
    selectKit: (value: SolutionKitId) =>
      dispatch({ type: 'use-case/select-kit', value }),
    setCustomUseCase: (value: string) =>
      dispatch({ type: 'use-case/set-custom', value }),
  };
}
