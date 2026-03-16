import { steps } from '@/features/wizard/model/steps';
import type { StepId, WizardState } from '@/features/wizard/model/types';
import { buildInitialColumnContext } from '@/features/wizard/services/column-context';
import { generateFinalSchemaArtifact } from '@/features/wizard/services/final-schema';
import { inferSolutionKitFromGoal } from '@/features/wizard/services/goal-inference';

export function moveToStep(
  state: WizardState,
  nextStepIndex: number,
): WizardState {
  const nextStep = steps[nextStepIndex];
  let next = state;

  if (shouldInferKit(next)) {
    const inferredKitId = inferSolutionKitFromGoal(next.goalPrompt.goalText);

    next = {
      ...next,
      useCase: {
        ...next.useCase,
        inferredKitId,
        selectedKitId: inferredKitId,
      },
    };
  }

  if (shouldInitializeColumns(next, nextStep.id)) {
    next = {
      ...next,
      columnContext: getInitializedColumnContext(next),
    };
  }

  if (shouldGenerateFinal(next, nextStep.id)) {
    next = {
      ...next,
      finalSchemaArtifact: generateFinalSchemaArtifact(next),
    };
  }

  return {
    ...next,
    currentStepIndex: nextStepIndex,
  };
}

export function getInitializedColumnContext(state: WizardState) {
  const initialized = buildInitialColumnContext({
    uploadedFiles: state.upload.files,
    profiledFiles: state.profile?.files,
    kit: state.useCase.selectedKitId,
    mappingSelected: state.mapping.selected,
    mappingConfirmed: state.mapping.confirmed,
  });

  return {
    ...initialized,
    globalPriorities: state.columnContext.globalPriorities,
  };
}

export function clearGeneratedOutputs() {
  return {
    schemaDraft: null,
    schemaReview: {
      draftFeedbackText: '',
    },
    finalSchemaArtifact: null,
  };
}

export function getNextStepIndex(currentStepIndex: number) {
  return Math.min(currentStepIndex + 1, steps.length - 1);
}

export function getPreviousStepIndex(currentStepIndex: number) {
  return Math.max(currentStepIndex - 1, 0);
}

export function getBoundedStepIndex(value: number) {
  return Math.max(0, Math.min(value, steps.length - 1));
}

function shouldInferKit(state: WizardState) {
  return state.currentStepIndex === 0 && !state.useCase.selectedKitId;
}

function shouldInitializeColumns(
  state: WizardState,
  nextStepId: StepId,
) {
  return (
    nextStepId === 'columns' &&
    state.columnContext.columns.length === 0 &&
    (state.profile?.files.length ?? 0) > 0
  );
}

function shouldGenerateFinal(
  state: WizardState,
  nextStepId: StepId,
) {
  return nextStepId === 'final' && !state.finalSchemaArtifact;
}
