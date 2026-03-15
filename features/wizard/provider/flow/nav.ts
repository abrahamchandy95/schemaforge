'use client';

import {
  canContinueFromCurrentStep,
  getCurrentStep,
  isFirstStep,
  isLastStep,
} from '@/features/wizard/flow/selectors';
import { useRoot } from '@/features/wizard/provider/root';

export function useNav() {
  const { state, dispatch } = useRoot();

  return {
    index: state.currentStepIndex,
    item: getCurrentStep(state),
    isFirst: isFirstStep(state),
    isLast: isLastStep(state),
    canContinue: canContinueFromCurrentStep(state),
    next: () => dispatch({ type: 'step/next' }),
    previous: () => dispatch({ type: 'step/previous' }),
    goTo: (value: number) => dispatch({ type: 'step/go', value }),
  };
}
