'use client';

import { useRoot } from '@/features/wizard/provider/root';

export function useFinal() {
  const { state, dispatch } = useRoot();

  return {
    finalOut: state.finalSchemaArtifact,
    generateFinal: () => dispatch({ type: 'final-schema/generate' }),
  };
}
