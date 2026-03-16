export interface DraftVertex {
  id: string;
  name: string;
  sourceColumnIds: string[];
  description: string;
}

export interface DraftEdge {
  id: string;
  name: string;
  fromVertexId: string;
  toVertexId: string;
  sourceColumnIds: string[];
  description: string;
}

export interface DraftAttr {
  id: string;
  name: string;
  ownerType: 'vertex' | 'edge';
  ownerId: string;
  sourceColumnId: string;
  dataType: string;
}

export interface Draft {
  title: string;
  summary: string;
  vertices: DraftVertex[];
  edges: DraftEdge[];
  attributes: DraftAttr[];
  assumptions: string[];
  feedbackHistory: string[];
}

export interface FinalMapRow {
  fileName: string;
  columnName: string;
  graphTarget: string;
}

export interface FinalArtifact {
  title: string;
  summary: string;
  assumptions: string[];
  schemaText: string;
  loadingJobText: string;
  mappingRows: FinalMapRow[];
  summaryLines: string[];
}
