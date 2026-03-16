'use client';

import {
  getCurrentStep,
  isFirstStep,
  isLastStep,
} from '@/features/wizard/flow/selectors';
import {
  useWizardActions,
  useWizardState,
} from '@/features/wizard/provider/root';

export function useNav() {
  const { state, canContinue } = useWizardState();
  const { next, previous, goTo } = useWizardActions();

  return {
    index: state.currentStepIndex,
    item: getCurrentStep(state),
    isFirst: isFirstStep(state),
    isLast: isLastStep(state),
    canContinue,
    next,
    previous,
    goTo,
  };
}
