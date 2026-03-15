import type { WizardState } from '@/features/wizard/model/types';

export const DEFAULT_WIZARD_STATE: WizardState = {
  currentStepIndex: 0,
  goalPrompt: {
    goalText: '',
    mode: 'basic',
  },
  useCase: {
    selectedKitId: null,
    customUseCaseText: '',
    inferredKitId: null,
  },
  queries: {
    selectedSuggestedQueryIds: [],
    customQueries: [],
    draftCustomQueryText: '',
    isAddingCustomQuery: false,
  },
  upload: {
    files: [],
  },
  columnContext: {
    columns: [],
    globalPriorities: {
      simplicityVsFlexibility: 'balance',
      temporalModeling: 'no',
      performanceVsExtensibility: 'balance',
    },
  },
  schemaDraft: null,
  schemaReview: {
    draftFeedbackText: '',
  },
  finalSchemaArtifact: null,
};
