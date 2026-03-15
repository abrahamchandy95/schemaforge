import { steps } from '@/features/wizard/model/steps';
import type { WizardState } from '@/features/wizard/model/types';
import { buildInitialColumnContext } from '@/features/wizard/services/column-context';
import { generateFinalSchemaArtifact } from '@/features/wizard/services/final-schema';
import { inferSolutionKitFromGoal } from '@/features/wizard/services/goal-inference';
import { generateSchemaDraft } from '@/features/wizard/services/recommendation';

export function moveToStep(
  state: WizardState,
  nextStepIndex: number,
): WizardState {
  const nextStep = steps[nextStepIndex];
  let nextState = state;

  if (shouldInferKit(nextState)) {
    const inferredKitId = inferSolutionKitFromGoal(
      nextState.goalPrompt.goalText,
    );

    nextState = {
      ...nextState,
      useCase: {
        ...nextState.useCase,
        inferredKitId,
        selectedKitId: inferredKitId,
      },
    };
  }

  if (shouldInitializeColumns(nextState, nextStep.id)) {
    nextState = {
      ...nextState,
      columnContext: getInitializedColumnContext(nextState),
    };
  }

  if (shouldGenerateDraft(nextState, nextStep.id)) {
    nextState = {
      ...nextState,
      schemaDraft: generateSchemaDraft(nextState),
      finalSchemaArtifact: null,
    };
  }

  if (shouldGenerateFinal(nextState, nextStep.id)) {
    nextState = {
      ...nextState,
      finalSchemaArtifact: generateFinalSchemaArtifact(nextState),
    };
  }

  return {
    ...nextState,
    currentStepIndex: nextStepIndex,
  };
}

export function getInitializedColumnContext(state: WizardState) {
  const initialized = buildInitialColumnContext(state.upload.files);

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
  nextStepId: WizardStateStepId,
) {
  return (
    nextStepId === 'columns' &&
    state.columnContext.columns.length === 0 &&
    state.upload.files.length > 0
  );
}

function shouldGenerateDraft(
  state: WizardState,
  nextStepId: WizardStateStepId,
) {
  return nextStepId === 'recommendation' && !state.schemaDraft;
}

function shouldGenerateFinal(
  state: WizardState,
  nextStepId: WizardStateStepId,
) {
  return nextStepId === 'final' && !state.finalSchemaArtifact;
}

type WizardStateStepId = WizardState['currentStepIndex'] extends number
  ? (typeof steps)[number]['id']
  : never;
