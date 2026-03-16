'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useCase() {
  const { state } = useWizardState();
  const { selectKit, setCustomUseCase } = useWizardActions();

  return {
    kit: state.useCase.selectedKitId,
    inferredKit: state.useCase.inferredKitId,
    customUseCase: state.useCase.customUseCaseText,
    selectKit,
    setCustomUseCase,
  };
}
