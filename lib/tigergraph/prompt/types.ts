import type { MappingSelection } from '@/lib/tigergraph/mapping/types';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';
import type { Draft } from '@/lib/tigergraph/schema/types';
import type {
  ColRole,
  CurrentKitId,
  DesignPrefs,
} from '@/features/wizard/model/types';

export type PromptQuery = {
  id: string;
  text: string;
  source: 'suggested' | 'custom';
};

export type PromptColumn = {
  id: string;
  name: string;
  fileSource: string;
  dataType: string;
  sampleValue: string;
  assignedRole: ColRole;
  guidance: string;
  flags: {
    isRealEntity: boolean;
    isIdentifier: boolean;
    isTraversalStartingPoint: boolean;
    participatesInMultipleRelationships: boolean;
    usedForFilteringOrSorting: boolean;
    mayBecomeSuperNode: boolean;
    useGraphAlgorithms: boolean;
    needsTemporalModeling: boolean;
    isSensitiveData: boolean;
    requiresSecondaryIndex: boolean;
    connectsToMultipleVertexTypes: boolean;
  };
  dependsOnColumnId: string | null;
  relationshipTargetColumnId: string | null;
  dataRangeOrConstraint: string;
};

export type PromptReference = {
  schema: string;
  loadingJob: string;
};

export type PromptInput = {
  ready: boolean;
  issues: string[];
  useCase: {
    kit: CurrentKitId | null;
    goal: string;
    mode: 'basic' | 'advanced';
    customUseCase: string;
  };
  queries: PromptQuery[];
  files: ProfiledFile[];
  mapping: {
    confirmed: boolean;
    selected: MappingSelection[];
    schemaPreview: string;
    loadingJobPreview: string;
    supportedVertices: string[];
    supportedEdges: string[];
    warnings: string[];
  };
  columns: PromptColumn[];
  priorities: DesignPrefs;
  draft: Draft | null;
  reference: PromptReference | null;
};
