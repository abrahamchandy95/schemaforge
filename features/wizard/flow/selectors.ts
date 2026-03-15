import { steps } from '@/features/wizard/model/steps';
import type { WizardState } from '@/features/wizard/model/types';

export function getCurrentStep(state: WizardState) {
  return steps[state.currentStepIndex];
}

export function isFirstStep(state: WizardState) {
  return state.currentStepIndex === 0;
}

export function isLastStep(state: WizardState) {
  return state.currentStepIndex === steps.length - 1;
}

export function canContinueFromCurrentStep(state: WizardState) {
  const currentStep = getCurrentStep(state);

  switch (currentStep.id) {
    case 'goal':
      return state.goalPrompt.goalText.trim().length > 0;

    case 'use-case':
      if (!state.useCase.selectedKitId) {
        return false;
      }

      if (state.useCase.selectedKitId === 'other') {
        return state.useCase.customUseCaseText.trim().length > 0;
      }

      return true;

    case 'queries':
      return (
        state.queries.selectedSuggestedQueryIds.length > 0 ||
        state.queries.customQueries.length > 0
      );

    case 'upload':
      return state.upload.files.length > 0;

    case 'columns':
      return state.columnContext.columns.length > 0;

    case 'recommendation':
      return state.schemaDraft !== null;

    case 'review':
      return state.schemaDraft !== null;

    case 'final':
      return state.finalSchemaArtifact !== null;

    default:
      return true;
  }
}
