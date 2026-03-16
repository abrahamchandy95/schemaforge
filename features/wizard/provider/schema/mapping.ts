'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useMapping() {
  const { state } = useWizardState();
  const {
    setProfile,
    clearProfile,
    setMappingTarget,
    clearMappingTarget,
    setMappingPreview,
    setMappingConfirmed,
  } = useWizardActions();

  return {
    kit: state.useCase.selectedKitId,
    profile: state.profile,
    selected: state.mapping.selected,
    schema: state.mapping.schema,
    preview: state.mapping.preview,
    warnings: state.mapping.warnings,
    supportedVertices: state.mapping.supportedVertices,
    supportedEdges: state.mapping.supportedEdges,
    confirmed: state.mapping.confirmed,
    previewDirty: state.mapping.previewDirty,
    setProfile,
    clearProfile,
    setTarget: setMappingTarget,
    clearTarget: clearMappingTarget,
    setPreview: setMappingPreview,
    setConfirmed: setMappingConfirmed,
  };
}
