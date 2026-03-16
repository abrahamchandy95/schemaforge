'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useFinal() {
  const { state } = useWizardState();
  const { generateFinalSchemaArtifact } = useWizardActions();

  return {
    finalOut: state.finalSchemaArtifact,
    generateFinal: generateFinalSchemaArtifact,
  };
}
