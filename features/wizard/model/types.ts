export type SchemaGenerationMode = 'basic' | 'advanced';

export type WizardStepId =
  | 'goal'
  | 'use-case'
  | 'queries'
  | 'upload'
  | 'understanding'
  | 'columns'
  | 'recommendation'
  | 'review'
  | 'final';

export type SolutionKitId =
  | 'fraud-detection'
  | 'customer-360'
  | 'supply-chain-management'
  | 'cybersecurity-threat-analysis'
  | 'it-ops-asset-management'
  | 'entity-resolution'
  | 'financial-services-compliance'
  | 'product-recommendation'
  | 'other';

export type SuggestedQueryId = string;

export interface WizardStep {
  id: WizardStepId;
  title: string;
  description: string;
}

export interface GoalPromptFormData {
  goalText: string;
  mode: SchemaGenerationMode;
}

export interface UseCaseFormData {
  selectedKitId: SolutionKitId | null;
  customUseCaseText: string;
  inferredKitId: SolutionKitId | null;
}

export interface CustomQuery {
  id: string;
  text: string;
}

export interface QueriesFormData {
  selectedSuggestedQueryIds: SuggestedQueryId[];
  customQueries: CustomQuery[];
  draftCustomQueryText: string;
  isAddingCustomQuery: boolean;
}

export interface UploadedFileSummary {
  id: string;
  name: string;
  sizeBytes: number;
}

export interface UploadFormData {
  files: UploadedFileSummary[];
}

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface DataUnderstandingFileRow {
  fileName: string;
  sizeLabel: string;
  columnCount: number;
  rowCountLabel: string;
  headersDetected: boolean;
}

export interface DataUnderstandingMatchRow {
  requirement: 'Required' | 'Optional';
  expectedField: string;
  expectedDetails?: string;
  matchedColumns: string[];
  fileSource: string;
  confidence: MatchConfidence;
  statusNote?: string;
}

export interface DataUnderstandingWarning {
  id: string;
  message: string;
}

export interface DataUnderstandingViewModel {
  filesUploadedCount: number;
  totalColumns: number;
  totalRowsLabel: string;
  headersDetectedLabel: string;
  files: DataUnderstandingFileRow[];
  matches: DataUnderstandingMatchRow[];
  warnings: DataUnderstandingWarning[];
  note: string;
}

export type ColumnAssignedRole =
  | 'vertex'
  | 'edge'
  | 'attribute'
  | 'edge-attribute'
  | 'ignore';

export type ColumnContextBooleanFlag =
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

export type ColumnModelingPriority =
  | 'balanced'
  | 'accuracy'
  | 'performance'
  | 'extensibility';

export type SimplicityVsFlexibility =
  | 'simplicity'
  | 'balance'
  | 'flexibility';

export type TemporalPreference = 'yes' | 'no' | 'partial';

export type PerformanceVsExtensibility =
  | 'performance'
  | 'balance'
  | 'extensibility';

export interface ColumnContextColumn {
  id: string;
  name: string;
  dataType: string;
  sampleValue: string;
  fileSource: string;
  assignedRole: ColumnAssignedRole;

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
  modelingPriority: ColumnModelingPriority;
  guidance: string;
}

export type ColumnContextColumnPatch = Partial<
  Omit<
    ColumnContextColumn,
    'id' | 'name' | 'dataType' | 'sampleValue' | 'fileSource'
  >
>;

export interface ColumnContextGlobalPriorities {
  simplicityVsFlexibility: SimplicityVsFlexibility;
  temporalModeling: TemporalPreference;
  performanceVsExtensibility: PerformanceVsExtensibility;
}

export type ColumnContextGlobalPrioritiesPatch =
  Partial<ColumnContextGlobalPriorities>;

export interface ColumnContextFormData {
  columns: ColumnContextColumn[];
  globalPriorities: ColumnContextGlobalPriorities;
}

export interface SchemaVertexDraft {
  id: string;
  name: string;
  sourceColumnIds: string[];
  description: string;
}

export interface SchemaEdgeDraft {
  id: string;
  name: string;
  fromVertexId: string;
  toVertexId: string;
  sourceColumnIds: string[];
  description: string;
}

export interface SchemaAttributeDraft {
  id: string;
  name: string;
  ownerType: 'vertex' | 'edge';
  ownerId: string;
  sourceColumnId: string;
  dataType: string;
}

export interface SchemaDraft {
  title: string;
  summary: string;
  vertices: SchemaVertexDraft[];
  edges: SchemaEdgeDraft[];
  attributes: SchemaAttributeDraft[];
  assumptions: string[];
  feedbackHistory: string[];
}

export interface SchemaReviewFormData {
  draftFeedbackText: string;
}

export interface FinalSchemaMappingRow {
  fileName: string;
  columnName: string;
  graphTarget: string;
}

export interface FinalSchemaArtifact {
  schemaText: string;
  loadingJobText: string;
  mappingRows: FinalSchemaMappingRow[];
  summaryLines: string[];
}

export interface WizardState {
  currentStepIndex: number;
  goalPrompt: GoalPromptFormData;
  useCase: UseCaseFormData;
  queries: QueriesFormData;
  upload: UploadFormData;
  columnContext: ColumnContextFormData;
  schemaDraft: SchemaDraft | null;
  schemaReview: SchemaReviewFormData;
  finalSchemaArtifact: FinalSchemaArtifact | null;
}
