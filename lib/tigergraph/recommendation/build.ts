import type { WizardState } from '@/features/wizard/model/types';
import { normalizeKitId } from '@/features/wizard/model/kits';
import { requiresConfirmedMapping } from '@/lib/tigergraph/kits/policy';
import type {
  Draft,
  DraftAttr,
  DraftEdge,
  DraftVertex,
} from '@/lib/tigergraph/schema/types';
import {
  buildSchemaPreview,
  toDraftId,
  toSourceIds,
} from '@/lib/tigergraph/preview/schema';

export function buildDraft(state: WizardState): Draft {
  if (
    requiresConfirmedMapping(state.useCase.selectedKitId) &&
    state.mapping.selected.length > 0
  ) {
    return buildMappingBackedDraft(state);
  }

  return buildGenericDraft(state);
}

function buildMappingBackedDraft(state: WizardState): Draft {
  const plan = buildSchemaPreview({
    kit: state.useCase.selectedKitId,
    selected: state.mapping.selected,
  });

  const vertices: DraftVertex[] = plan.vertices.map((vertex) => ({
    id: `vertex-${toDraftId(vertex.name)}`,
    name: vertex.name,
    sourceColumnIds: toSourceIds(state.mapping.selected, vertex.sourceTargets),
    description: vertex.description,
  }));

  const vertexIds = new Map(vertices.map((vertex) => [vertex.name, vertex.id]));

  const edges: DraftEdge[] = plan.edges
    .filter((edge) => vertexIds.has(edge.from) && vertexIds.has(edge.to))
    .map((edge) => ({
      id: `edge-${toDraftId(`${edge.name}-${edge.from}-${edge.to}`)}`,
      name: edge.name,
      fromVertexId: vertexIds.get(edge.from) ?? '',
      toVertexId: vertexIds.get(edge.to) ?? '',
      sourceColumnIds: toSourceIds(state.mapping.selected, edge.sourceTargets),
      description: edge.description,
    }));

  const attributes: DraftAttr[] = plan.attributes
    .map((attr) => {
      if (attr.ownerType !== 'vertex') {
        return null;
      }

      const ownerId = vertexIds.get(attr.ownerName);
      if (!ownerId) {
        return null;
      }

      const sourceColumnId =
        toSourceIds(state.mapping.selected, [attr.sourceTarget])[0] ?? '';

      return {
        id: `attribute-${toDraftId(`${attr.ownerName}-${attr.name}`)}`,
        name: attr.name,
        ownerType: 'vertex' as const,
        ownerId,
        sourceColumnId,
        dataType: attr.dataType,
      };
    })
    .filter((value): value is DraftAttr => Boolean(value));

  return {
    title: buildTitle(normalizeKitId(state.useCase.selectedKitId)),
    summary: buildSummary(state, vertices, edges, attributes),
    vertices,
    edges,
    attributes,
    assumptions: buildAssumptions(state, vertices, edges, attributes),
    feedbackHistory: [],
  };
}

function buildGenericDraft(state: WizardState): Draft {
  const columns = state.columnContext.columns;
  const selectedKitId = normalizeKitId(state.useCase.selectedKitId);

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

  let edges = buildEdges(columns, vertices);
  if (edges.length === 0 && vertices.length >= 2) {
    edges = [
      {
        id: 'edge-related-to',
        name: 'RelatedTo',
        fromVertexId: vertices[0].id,
        toVertexId: vertices[1].id,
        sourceColumnIds: [],
        description:
          'Fallback relationship created because no explicit edge column was confirmed.',
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

function buildVertices(
  columns: WizardState['columnContext']['columns'],
): DraftVertex[] {
  return columns
    .filter((column) => column.assignedRole === 'vertex')
    .map((column) => ({
      id: `vertex-${column.id}`,
      name: toEntityName(column.name),
      sourceColumnIds: [column.id],
      description: column.guidance || `Vertex suggested from column ${column.name}.`,
    }));
}

function buildEdges(
  columns: WizardState['columnContext']['columns'],
  vertices: DraftVertex[],
): DraftEdge[] {
  const edgeColumns = columns.filter((column) => column.assignedRole === 'edge');

  return edgeColumns.map((column, index) => ({
    id: `edge-${column.id}`,
    name: toEdgeName(column.name),
    fromVertexId: vertices[0]?.id ?? `vertex-fallback-from-${index}`,
    toVertexId: vertices[1]?.id ?? vertices[0]?.id ?? `vertex-fallback-to-${index}`,
    sourceColumnIds: [column.id],
    description:
      column.guidance || `Relationship suggested from column ${column.name}.`,
  }));
}

function buildAttributes(
  columns: WizardState['columnContext']['columns'],
  vertices: DraftVertex[],
  edges: DraftEdge[],
): DraftAttr[] {
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

function buildTitle(selectedKitId: ReturnType<typeof normalizeKitId>) {
  switch (selectedKitId) {
    case 'transaction_fraud':
      return 'Transaction Fraud Graph Schema';
    case 'application_fraud':
      return 'Application Fraud Graph Schema';
    case 'mule_account_detection':
      return 'Mule Account Detection Graph Schema';
    case 'customer_360':
      return 'Customer 360 Graph Schema';
    case 'supply_chain_management':
      return 'Supply Chain Graph Schema';
    case 'network_infrastructure':
      return 'Network Infrastructure Graph Schema';
    case 'entity_resolution':
      return 'Entity Resolution Graph Schema';
    case 'entity_resolution_kyc':
      return 'Entity Resolution / KYC Graph Schema';
    case 'product_recommendations':
      return 'Product Recommendations Graph Schema';
    case 'custom':
      return 'Custom Use Case Graph Schema';
    default:
      return 'Recommended Graph Schema';
  }
}

function buildSummary(
  state: WizardState,
  vertices: DraftVertex[],
  edges: DraftEdge[],
  attributes: DraftAttr[],
) {
  const useCaseLabel = normalizeKitId(state.useCase.selectedKitId)
    ? normalizeKitId(state.useCase.selectedKitId)!.replaceAll('_', ' ')
    : 'custom graph';

  return [
    `Recommended schema for ${useCaseLabel}.`,
    `${vertices.length} vertex type(s), ${edges.length} edge type(s), and ${attributes.length} attribute mapping(s) were inferred from your uploaded data and modeling guidance.`,
  ].join(' ');
}

function buildAssumptions(
  state: WizardState,
  vertices: DraftVertex[],
  edges: DraftEdge[],
  attributes: DraftAttr[],
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

function toEdgeName(columnName: string) {
  const normalized = columnName
    .replace(/_/g, ' ')
    .replace(/id$/i, '')
    .trim();

  return toTitleCase(normalized || columnName) || 'RelatedTo';
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}
