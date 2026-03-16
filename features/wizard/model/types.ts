import type {
  MappingBundle as TgMappingBundle,
  MappingColumnState as TgMappingColumnState,
  MappingSelection as TgMappingSelection,
  MappingSuggestion as TgMappingSuggestion,
  SuggestedColumnMapping as TgSuggestedColumnMapping,
} from '@/lib/tigergraph/mapping/types';
import type {
  ProfiledColumn as TgProfiledColumn,
  ProfileMatch as TgProfileMatch,
  ProfileMatchState as TgProfileMatchState,
  ProfiledFile as TgProfiledFile,
} from '@/lib/tigergraph/profiling/types';
import type {
  Draft as TgDraft,
  DraftAttr as TgDraftAttr,
  DraftEdge as TgDraftEdge,
  DraftVertex as TgDraftVertex,
  FinalArtifact as TgFinalArtifact,
  FinalMapRow as TgFinalMapRow,
} from '@/lib/tigergraph/schema/types';

export type WizardMode = 'basic' | 'advanced';

export type StepId =
  | 'goal'
  | 'use-case'
  | 'queries'
  | 'upload'
  | 'understanding'
  | 'mapping'
  | 'columns'
  | 'recommendation'
  | 'review'
  | 'final';

export type CurrentKitId =
  | 'network_infrastructure'
  | 'supply_chain_management'
  | 'customer_360'
  | 'entity_resolution'
  | 'product_recommendations'
  | 'application_fraud'
  | 'entity_resolution_kyc'
  | 'mule_account_detection'
  | 'transaction_fraud'
  | 'custom';

export type LegacyKitId =
  | 'transaction-fraud'
  | 'customer-360'
  | 'supply-chain-management'
  | 'cybersecurity-threat-analysis'
  | 'it-ops-asset-management'
  | 'entity-resolution'
  | 'financial-services-compliance'
  | 'product-recommendation'
  | 'other';

export type KitId = CurrentKitId | LegacyKitId;
export type QueryId = string;

export interface Step {
  id: StepId;
  title: string;
  description: string;
}

export interface GoalInput {
  goalText: string;
  mode: WizardMode;
}

export interface UseCaseInput {
  selectedKitId: KitId | null;
  customUseCaseText: string;
  inferredKitId: KitId | null;
}

export interface QueryItem {
  id: string;
  text: string;
}

export interface QueryInput {
  selectedSuggestedQueryIds: QueryId[];
  customQueries: QueryItem[];
  draftCustomQueryText: string;
  isAddingCustomQuery: boolean;
}

export interface UploadFile {
  id: string;
  name: string;
  sizeBytes: number;
  file: File;
}

export interface UploadInput {
  files: UploadFile[];
}

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface UnderstandingFile {
  fileName: string;
  sizeLabel: string;
  columnCount: number;
  rowCountLabel: string;
  headersDetected: boolean;
}

export interface UnderstandingMatch {
  requirement: 'Required' | 'Optional';
  expectedField: string;
  expectedDetails?: string;
  matchedColumns: string[];
  fileSource: string;
  confidence: MatchConfidence;
  statusNote?: string;
}

export interface UnderstandingWarning {
  id: string;
  message: string;
}

export interface UnderstandingView {
  filesUploadedCount: number;
  totalColumns: number;
  totalRowsLabel: string;
  headersDetectedLabel: string;
  files: UnderstandingFile[];
  matches: UnderstandingMatch[];
  warnings: UnderstandingWarning[];
  note: string;
}

export type ColRole =
  | 'vertex'
  | 'edge'
  | 'attribute'
  | 'edge-attribute'
  | 'ignore';

export type ColFlag =
  | 'isRealEntity'
  | 'isIdentifier'
  | 'isTraversalStartingPoint'
  | 'participatesInMultipleRelationships'
  | 'usedForFilteringOrSorting'
  | 'mayBecomeSuperNode'
  | 'useGraphAlgorithms'
  | 'needsTemporalModeling'
  | 'isSensitiveData'
  | 'requiresSecondaryIndex'
  | 'connectsToMultipleVertexTypes';

export type ModelPriority =
  | 'balanced'
  | 'accuracy'
  | 'performance'
  | 'extensibility';

export type SimplicityPref = 'simplicity' | 'balance' | 'flexibility';
export type TemporalPref = 'yes' | 'no' | 'partial';
export type ScalePref = 'performance' | 'balance' | 'extensibility';

export interface ColumnSpec {
  id: string;
  name: string;
  dataType: string;
  sampleValue: string;
  fileSource: string;
  assignedRole: ColRole;

  isRealEntity: boolean;
  isIdentifier: boolean;
  isTraversalStartingPoint: boolean;
  participatesInMultipleRelationships: boolean;
  usedForFilteringOrSorting: boolean;
  mayBecomeSuperNode: boolean;
  useGraphAlgorithms: boolean;
  needsTemporalModeling: boolean;

  dependsOnColumnId: string | null;
  relationshipTargetColumnId: string | null;

  isSensitiveData: boolean;
  requiresSecondaryIndex: boolean;
  connectsToMultipleVertexTypes: boolean;

  dataRangeOrConstraint: string;
  modelingPriority: ModelPriority;
  guidance: string;
}

export type ColumnPatch = Partial<
  Omit<
    ColumnSpec,
    'id' | 'name' | 'dataType' | 'sampleValue' | 'fileSource'
  >
>;

export interface DesignPrefs {
  simplicityVsFlexibility: SimplicityPref;
  temporalModeling: TemporalPref;
  performanceVsExtensibility: ScalePref;
}

export type DesignPrefsPatch = Partial<DesignPrefs>;

export interface ColumnContext {
  columns: ColumnSpec[];
  globalPriorities: DesignPrefs;
}

export type MappingSuggestion = TgMappingSuggestion;
export type MappingColumnState = TgMappingColumnState;
export type SuggestedColumnMapping = TgSuggestedColumnMapping;
export type MappingSelection = TgMappingSelection;
export type MappingBundle = TgMappingBundle;

export type ProfiledColumn = TgProfiledColumn;
export type ProfiledFile = TgProfiledFile;
export type ProfileMatchState = TgProfileMatchState;
export type ProfileMatch = TgProfileMatch;

export type DraftVertex = TgDraftVertex;
export type DraftEdge = TgDraftEdge;
export type DraftAttr = TgDraftAttr;
export type Draft = TgDraft;

export type FinalMapRow = TgFinalMapRow;
export type FinalArtifact = TgFinalArtifact;

export type ProfileData = {
  selectedKitId: KitId | null;
  profiledAgainst: string | null;
  files: ProfiledFile[];
  matches: ProfileMatch[];
  warnings: string[];
  mapping: MappingBundle | null;
} | null;

export type MapState = {
  selected: MappingSelection[];
  schema: string;
  preview: string;
  warnings: string[];
  supportedVertices: string[];
  supportedEdges: string[];
  confirmed: boolean;
  previewDirty: boolean;
};

export interface ReviewState {
  draftFeedbackText: string;
}

export interface WizardData {
  currentStepIndex: number;
  goalPrompt: GoalInput;
  useCase: UseCaseInput;
  queries: QueryInput;
  upload: UploadInput;
  profile: ProfileData;
  mapping: MapState;
  columnContext: ColumnContext;
  schemaDraft: Draft | null;
  schemaReview: ReviewState;
  finalSchemaArtifact: FinalArtifact | null;
}

/**
 * Compatibility aliases.
 * Delete these after the repo no longer imports the old names.
 */
export type SchemaGenerationMode = WizardMode;
export type WizardStepId = StepId;
export type SolutionKitId = KitId;
export type SuggestedQueryId = QueryId;

export type WizardStep = Step;
export type GoalPromptFormData = GoalInput;
export type UseCaseFormData = UseCaseInput;
export type CustomQuery = QueryItem;
export type QueriesFormData = QueryInput;
export type UploadedFileSummary = UploadFile;
export type UploadFormData = UploadInput;

export type DataUnderstandingFileRow = UnderstandingFile;
export type DataUnderstandingMatchRow = UnderstandingMatch;
export type DataUnderstandingWarning = UnderstandingWarning;
export type DataUnderstandingViewModel = UnderstandingView;

export type ColumnAssignedRole = ColRole;
export type ColumnContextBooleanFlag = ColFlag;
export type ColumnModelingPriority = ModelPriority;
export type SimplicityVsFlexibility = SimplicityPref;
export type PerformanceVsExtensibility = ScalePref;
export type ColumnContextColumn = ColumnSpec;
export type ColumnContextColumnPatch = ColumnPatch;
export type ColumnContextGlobalPriorities = DesignPrefs;
export type ColumnContextGlobalPrioritiesPatch = DesignPrefsPatch;
export type ColumnContextFormData = ColumnContext;

export type SchemaVertexDraft = DraftVertex;
export type SchemaEdgeDraft = DraftEdge;
export type SchemaAttributeDraft = DraftAttr;
export type SchemaDraft = Draft;
export type SchemaReviewFormData = ReviewState;

export type FinalSchemaMappingRow = FinalMapRow;
export type FinalSchemaArtifact = FinalArtifact;

export type ProfileState = ProfileData;
export type MappingState = MapState;
export type WizardState = WizardData;
