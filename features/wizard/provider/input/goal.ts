'use client';

import type { SchemaGenerationMode } from '@/features/wizard/model/types';
import { useRoot } from '@/features/wizard/provider/root';

export function useGoal() {
  const { state, dispatch } = useRoot();

  return {
    goal: state.goalPrompt.goalText,
    mode: state.goalPrompt.mode,
    setGoal: (value: string) => dispatch({ type: 'goal/set', value }),
    setMode: (value: SchemaGenerationMode) =>
      dispatch({ type: 'mode/set', value }),
  };
}
