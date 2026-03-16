'use client';

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { flowReducer } from '@/features/wizard/flow/reducer';
import type { FlowAction } from '@/features/wizard/flow/actions';
import { canContinueFromCurrentStep } from '@/features/wizard/flow/selectors';
import { DEFAULT_WIZARD_STATE } from '@/features/wizard/model/defaults';
import type {
  ColumnContextColumnPatch,
  ColumnContextGlobalPrioritiesPatch,
  MappingSelection,
  ProfileState,
  SchemaDraft,
  SchemaGenerationMode,
  SolutionKitId,
  UploadedFileSummary,
  WizardState,
} from '@/features/wizard/model/types';

type StateValue = {
  state: WizardState;
  canContinue: boolean;
};

function useActionValue(dispatch: Dispatch<FlowAction>) {
  return useMemo(
    () => ({
      setGoal: (value: string) => dispatch({ type: 'goal/set', value }),
      setMode: (value: SchemaGenerationMode) =>
        dispatch({ type: 'mode/set', value }),

      selectKit: (value: SolutionKitId) =>
        dispatch({ type: 'use-case/select-kit', value }),

      setCustomUseCase: (value: string) =>
        dispatch({ type: 'use-case/set-custom', value }),

      toggleSuggestedQuery: (value: string) =>
        dispatch({ type: 'queries/toggle-suggested', value }),
      startAddingCustomQuery: () =>
        dispatch({ type: 'queries/start-adding-custom' }),
      cancelAddingCustomQuery: () =>
        dispatch({ type: 'queries/cancel-adding-custom' }),
      setDraftCustomQueryText: (value: string) =>
        dispatch({ type: 'queries/set-draft-custom', value }),
      addCustomQuery: () => dispatch({ type: 'queries/add-custom' }),
      removeCustomQuery: (value: string) =>
        dispatch({ type: 'queries/remove-custom', value }),

      addUploadedFiles: (value: UploadedFileSummary[]) =>
        dispatch({ type: 'upload/add-files', value }),
      removeUploadedFile: (value: string) =>
        dispatch({ type: 'upload/remove-file', value }),

      setProfile: (value: ProfileState) =>
        dispatch({ type: 'profile/set', value }),
      clearProfile: () => dispatch({ type: 'profile/clear' }),

      setMappingTarget: (value: MappingSelection) =>
        dispatch({ type: 'mapping/set-target', value }),
      clearMappingTarget: (fileName: string, columnName: string) =>
        dispatch({
          type: 'mapping/clear-target',
          value: { fileName, columnName },
        }),
      setMappingPreview: (value: {
        schema: string;
        preview: string;
        warnings: string[];
        supportedVertices: string[];
        supportedEdges: string[];
      }) => dispatch({ type: 'mapping/set-preview', value }),
      setMappingConfirmed: (value: boolean) =>
        dispatch({ type: 'mapping/set-confirmed', value }),

      initializeColumnContext: () =>
        dispatch({ type: 'column-context/initialize' }),
      updateColumnContextColumn: (
        columnId: string,
        value: ColumnContextColumnPatch,
      ) =>
        dispatch({
          type: 'column-context/update-column',
          columnId,
          value,
        }),
      updateColumnContextGlobalPriorities: (
        value: ColumnContextGlobalPrioritiesPatch,
      ) =>
        dispatch({
          type: 'column-context/update-global',
          value,
        }),

      generateSchemaDraft: () => dispatch({ type: 'schema-draft/generate' }),
      setSchemaDraft: (value: SchemaDraft | null) =>
        dispatch({ type: 'schema-draft/set', value }),
      setSchemaReviewDraftFeedbackText: (value: string) =>
        dispatch({ type: 'schema-review/set-feedback-draft', value }),
      applySchemaDraftFeedback: (value: string) =>
        dispatch({ type: 'schema-draft/apply-feedback', value }),
      generateFinalSchemaArtifact: () =>
        dispatch({ type: 'final-schema/generate' }),

      next: () => dispatch({ type: 'step/next' }),
      previous: () => dispatch({ type: 'step/previous' }),
      goTo: (value: number) => dispatch({ type: 'step/go', value }),
    }),
    [dispatch],
  );
}

type ActionsValue = ReturnType<typeof useActionValue>;

const StateCtx = createContext<StateValue | null>(null);
const ActionsCtx = createContext<ActionsValue | null>(null);

export function Root({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flowReducer, DEFAULT_WIZARD_STATE);
  const canContinue = canContinueFromCurrentStep(state);
  const actions = useActionValue(dispatch);

  const stateValue = useMemo(
    () => ({
      state,
      canContinue,
    }),
    [state, canContinue],
  );

  return (
    <StateCtx.Provider value={stateValue}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useWizardState() {
  const value = useContext(StateCtx);

  if (!value) {
    throw new Error('useWizardState must be used inside provider Root');
  }

  return value;
}

export function useWizardActions() {
  const value = useContext(ActionsCtx);

  if (!value) {
    throw new Error('useWizardActions must be used inside provider Root');
  }

  return value;
}

/**
 * Temporary compatibility hook.
 * Delete this after the focused hooks are the only public surface.
 */
export function useCtx() {
  return {
    ...useWizardState(),
    ...useWizardActions(),
  };
}
