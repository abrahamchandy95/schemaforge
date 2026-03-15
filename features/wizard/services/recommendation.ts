import type {
  ColumnContextColumn,
  SchemaAttributeDraft,
  SchemaDraft,
  SchemaEdgeDraft,
  SchemaVertexDraft,
  WizardState,
} from '@/features/wizard/model/types';

export function generateSchemaDraft(state: WizardState): SchemaDraft {
  const columns = state.columnContext.columns;
  const selectedKitId = state.useCase.selectedKitId;

  let vertices = buildVertices(columns);
  if (vertices.length === 0 && columns.length > 0) {
    vertices = [
      {
        id: 'vertex-generic-entity',
        name: 'Entity',
        sourceColumnIds: [columns[0].id],
        description: `Fallback entity derived from ${columns[0].name}.`,
      },
    ];
  }

  let edges = buildEdges(columns, vertices, selectedKitId);
  if (edges.length === 0 && vertices.length >= 2) {
    edges = [
      {
        id: 'edge-related-to',
        name: 'RelatedTo',
        fromVertexId: vertices[0].id,
        toVertexId: vertices[1].id,
        sourceColumnIds: [],
        description: 'Fallback relationship created because no explicit edge column was confirmed.',
      },
    ];
  }

  const attributes = buildAttributes(columns, vertices, edges);

  return {
    title: buildTitle(selectedKitId),
    summary: buildSummary(state, vertices, edges, attributes),
    vertices,
    edges,
    attributes,
    assumptions: buildAssumptions(state, vertices, edges, attributes),
    feedbackHistory: [],
  };
}

function buildVertices(columns: ColumnContextColumn[]): SchemaVertexDraft[] {
  return columns
    .filter((column) => column.assignedRole === 'vertex')
    .map((column) => ({
      id: `vertex-${column.id}`,
      name: toEntityName(column.name),
      sourceColumnIds: [column.id],
      description:
        column.guidance ||
        `Vertex suggested from column ${column.name}.`,
    }));
}

function buildEdges(
  columns: ColumnContextColumn[],
  vertices: SchemaVertexDraft[],
  selectedKitId: WizardState['useCase']['selectedKitId'],
): SchemaEdgeDraft[] {
  const edgeColumns = columns.filter((column) => column.assignedRole === 'edge');

  return edgeColumns.map((column, index) => ({
    id: `edge-${column.id}`,
    name: toEdgeName(column.name, selectedKitId),
    fromVertexId: vertices[0]?.id ?? `vertex-fallback-from-${index}`,
    toVertexId: vertices[1]?.id ?? vertices[0]?.id ?? `vertex-fallback-to-${index}`,
    sourceColumnIds: [column.id],
    description:
      column.guidance ||
      `Relationship suggested from column ${column.name}.`,
  }));
}

function buildAttributes(
  columns: ColumnContextColumn[],
  vertices: SchemaVertexDraft[],
  edges: SchemaEdgeDraft[],
): SchemaAttributeDraft[] {
  const vertexOwnerId = vertices[0]?.id ?? '';
  const edgeOwnerId = edges[0]?.id ?? '';

  const attributeColumns = columns.filter(
    (column) =>
      column.assignedRole === 'attribute' ||
      column.assignedRole === 'edge-attribute',
  );

  return attributeColumns.map((column) => {
    const ownerType =
      column.assignedRole === 'edge-attribute' && edgeOwnerId
        ? 'edge'
        : 'vertex';

    return {
      id: `attribute-${column.id}`,
      name: column.name,
      ownerType,
      ownerId: ownerType === 'edge' ? edgeOwnerId : vertexOwnerId,
      sourceColumnId: column.id,
      dataType: column.dataType,
    };
  });
}

function buildTitle(
  selectedKitId: WizardState['useCase']['selectedKitId'],
) {
  switch (selectedKitId) {
    case 'fraud-detection':
      return 'Fraud Detection Graph Schema';
    case 'customer-360':
      return 'Customer 360 Graph Schema';
    case 'supply-chain-management':
      return 'Supply Chain Graph Schema';
    case 'cybersecurity-threat-analysis':
      return 'Cybersecurity Threat Analysis Graph Schema';
    case 'it-ops-asset-management':
      return 'IT Ops & Asset Management Graph Schema';
    case 'entity-resolution':
      return 'Entity Resolution Graph Schema';
    case 'financial-services-compliance':
      return 'Financial Services Compliance Graph Schema';
    case 'product-recommendation':
      return 'Product Recommendation Graph Schema';
    case 'other':
      return 'Custom Use Case Graph Schema';
    default:
      return 'Recommended Graph Schema';
  }
}

function buildSummary(
  state: WizardState,
  vertices: SchemaVertexDraft[],
  edges: SchemaEdgeDraft[],
  attributes: SchemaAttributeDraft[],
) {
  const useCaseLabel = state.useCase.selectedKitId
    ? state.useCase.selectedKitId.replaceAll('-', ' ')
    : 'custom graph';

  return [
    `Recommended schema for ${useCaseLabel}.`,
    `${vertices.length} vertex type(s), ${edges.length} edge type(s), and ${attributes.length} attribute mapping(s) were inferred from your uploaded data and modeling guidance.`,
  ].join(' ');
}

function buildAssumptions(
  state: WizardState,
  vertices: SchemaVertexDraft[],
  edges: SchemaEdgeDraft[],
  attributes: SchemaAttributeDraft[],
) {
  const assumptions: string[] = [];

  if (vertices.length === 0) {
    assumptions.push(
      'No explicit vertex columns were confirmed, so a fallback entity was created.',
    );
  }

  if (edges.length === 0) {
    assumptions.push(
      'No explicit edge columns were confirmed, so a generic relationship structure may be needed.',
    );
  }

  if (attributes.length === 0) {
    assumptions.push(
      'No explicit attributes were mapped yet, so the draft focuses on core entities and relationships.',
    );
  }

  if (state.columnContext.globalPriorities.temporalModeling === 'yes') {
    assumptions.push(
      'Temporal modeling was requested overall, so time-aware schema design should be preserved in the final graph.',
    );
  }

  if (state.queries.customQueries.length > 0) {
    assumptions.push(
      'Custom query descriptions were considered while shaping traversal-friendly entities and relationships.',
    );
  }

  return assumptions;
}

function toEntityName(columnName: string) {
  const normalized = columnName
    .replace(/_/g, ' ')
    .replace(/id$/i, '')
    .trim();

  return toTitleCase(normalized || columnName);
}

function toEdgeName(
  columnName: string,
  selectedKitId: WizardState['useCase']['selectedKitId'],
) {
  if (selectedKitId === 'fraud-detection') {
    return 'Transaction';
  }

  return toTitleCase(columnName) || 'RelatedTo';
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}
