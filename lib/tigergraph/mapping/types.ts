export type MappingTarget = {
  key: string;
  label: string;
  group: string;
  required: boolean;
  description?: string;
};

export type MappingSuggestion = {
  targetKey: string;
  score: number;
  reasons: string[];
};

export type MappingColumnState =
  | 'auto-selected'
  | 'needs-review'
  | 'unmapped';

export type SuggestedColumnMapping = {
  fileName: string;
  columnName: string;
  normalizedName: string;
  sampleValues: string[];
  suggestions: MappingSuggestion[];
  state: MappingColumnState;
};

export type SelectedMapping = {
  fileName: string;
  columnName: string;
  targetKey: string;
};

export type MappingBundle = {
  kitKey: string;
  targets: MappingTarget[];
  columns: SuggestedColumnMapping[];
  autoSelected: SelectedMapping[];
  requiredUnmappedTargets: string[];
  warnings: string[];
  autoPreviewLoadingJob: string;
  supportedElements: {
    vertices: string[];
    edges: string[];
  };
};

export type RenderedLoadingJob = {
  text: string;
  warnings: string[];
  supportedVertices: string[];
  supportedEdges: string[];
};
