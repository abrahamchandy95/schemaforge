'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useGoal() {
  const { state } = useWizardState();
  const { setGoal, setMode } = useWizardActions();

  return {
    goal: state.goalPrompt.goalText,
    mode: state.goalPrompt.mode,
    setGoal,
    setMode,
  };
}
