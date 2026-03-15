import type { WizardState } from '@/features/wizard/model/types';
import { applySchemaFeedbackToSchemaDraft } from '@/features/wizard/services/review';
import { generateFinalSchemaArtifact } from '@/features/wizard/services/final-schema';
import { generateSchemaDraft } from '@/features/wizard/services/recommendation';
import type { FlowAction } from '@/features/wizard/flow/actions';
import {
  clearGeneratedOutputs,
  getBoundedStepIndex,
  getInitializedColumnContext,
  getNextStepIndex,
  getPreviousStepIndex,
  moveToStep,
} from '@/features/wizard/flow/helpers';

export function flowReducer(
  state: WizardState,
  action: FlowAction,
): WizardState {
  switch (action.type) {
    case 'goal/set':
      return {
        ...state,
        goalPrompt: {
          ...state.goalPrompt,
          goalText: action.value,
        },
        ...clearGeneratedOutputs(),
      };

    case 'mode/set':
      return {
        ...state,
        goalPrompt: {
          ...state.goalPrompt,
          mode: action.value,
        },
        ...clearGeneratedOutputs(),
      };

    case 'use-case/select-kit':
      return {
        ...state,
        useCase: {
          ...state.useCase,
          selectedKitId: action.value,
        },
        ...clearGeneratedOutputs(),
      };

    case 'use-case/set-custom':
      return {
        ...state,
        useCase: {
          ...state.useCase,
          customUseCaseText: action.value,
        },
        ...clearGeneratedOutputs(),
      };

    case 'queries/toggle-suggested': {
      const exists = state.queries.selectedSuggestedQueryIds.includes(
        action.value,
      );

      return {
        ...state,
        queries: {
          ...state.queries,
          selectedSuggestedQueryIds: exists
            ? state.queries.selectedSuggestedQueryIds.filter(
                (id) => id !== action.value,
              )
            : [...state.queries.selectedSuggestedQueryIds, action.value],
        },
        ...clearGeneratedOutputs(),
      };
    }

    case 'queries/start-adding-custom':
      return {
        ...state,
        queries: {
          ...state.queries,
          isAddingCustomQuery: true,
        },
      };

    case 'queries/cancel-adding-custom':
      return {
        ...state,
        queries: {
          ...state.queries,
          isAddingCustomQuery: false,
          draftCustomQueryText: '',
        },
      };

    case 'queries/set-draft-custom':
      return {
        ...state,
        queries: {
          ...state.queries,
          draftCustomQueryText: action.value,
        },
      };

    case 'queries/add-custom': {
      const text = state.queries.draftCustomQueryText.trim();

      if (!text) {
        return state;
      }

      return {
        ...state,
        queries: {
          ...state.queries,
          customQueries: [
            ...state.queries.customQueries,
            {
              id: crypto.randomUUID(),
              text,
            },
          ],
          draftCustomQueryText: '',
          isAddingCustomQuery: false,
        },
        ...clearGeneratedOutputs(),
      };
    }

    case 'queries/remove-custom':
      return {
        ...state,
        queries: {
          ...state.queries,
          customQueries: state.queries.customQueries.filter(
            (query) => query.id !== action.value,
          ),
        },
        ...clearGeneratedOutputs(),
      };

    case 'upload/add-files':
      return {
        ...state,
        upload: {
          ...state.upload,
          files: [...state.upload.files, ...action.value],
        },
        columnContext: {
          ...state.columnContext,
          columns: [],
        },
        ...clearGeneratedOutputs(),
      };

    case 'upload/remove-file':
      return {
        ...state,
        upload: {
          ...state.upload,
          files: state.upload.files.filter((file) => file.id !== action.value),
        },
        columnContext: {
          ...state.columnContext,
          columns: [],
        },
        ...clearGeneratedOutputs(),
      };

    case 'column-context/initialize':
      return {
        ...state,
        columnContext: getInitializedColumnContext(state),
        ...clearGeneratedOutputs(),
      };

    case 'column-context/update-column':
      return {
        ...state,
        columnContext: {
          ...state.columnContext,
          columns: state.columnContext.columns.map((column) =>
            column.id === action.columnId
              ? { ...column, ...action.value }
              : column,
          ),
        },
        ...clearGeneratedOutputs(),
      };

    case 'column-context/update-global':
      return {
        ...state,
        columnContext: {
          ...state.columnContext,
          globalPriorities: {
            ...state.columnContext.globalPriorities,
            ...action.value,
          },
        },
        ...clearGeneratedOutputs(),
      };

    case 'schema-draft/generate':
      return {
        ...state,
        schemaDraft: generateSchemaDraft(state),
        finalSchemaArtifact: null,
      };

    case 'schema-draft/set':
      return {
        ...state,
        schemaDraft: action.value,
        finalSchemaArtifact: null,
      };

    case 'schema-review/set-feedback-draft':
      return {
        ...state,
        schemaReview: {
          ...state.schemaReview,
          draftFeedbackText: action.value,
        },
      };

    case 'schema-draft/apply-feedback': {
      if (!state.schemaDraft || !action.value.trim()) {
        return state;
      }

      return {
        ...state,
        schemaDraft: applySchemaFeedbackToSchemaDraft(
          state.schemaDraft,
          action.value,
        ),
        schemaReview: {
          ...state.schemaReview,
          draftFeedbackText: '',
        },
        finalSchemaArtifact: null,
      };
    }

    case 'final-schema/generate':
      return {
        ...state,
        finalSchemaArtifact: generateFinalSchemaArtifact(state),
      };

    case 'step/next':
      return moveToStep(state, getNextStepIndex(state.currentStepIndex));

    case 'step/previous':
      return {
        ...state,
        currentStepIndex: getPreviousStepIndex(state.currentStepIndex),
      };

    case 'step/go':
      return moveToStep(state, getBoundedStepIndex(action.value));

    default:
      return assertNever(action);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);
}
