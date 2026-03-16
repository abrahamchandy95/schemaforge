import type { MappingSelection } from '@/lib/tigergraph/mapping/types';
import type { Draft } from '@/lib/tigergraph/schema/types';
import type { AgentResult } from '@/lib/tigergraph/agent/types';

export function toSchemaDraft(
  result: AgentResult,
  selected: MappingSelection[],
): Draft {
  const vertexIdByName = new Map<string, string>();

  const vertices = result.vertices.map((vertex) => {
    const id = `vertex-${toId(vertex.name)}`;
    vertexIdByName.set(vertex.name, id);

    return {
      id,
      name: vertex.name,
      sourceColumnIds: toSourceIds(vertex.sourceKeys, selected),
      description: vertex.description,
    };
  });

  const edges = result.edges.map((edge) => ({
    id: `edge-${toId(`${edge.name}-${edge.from}-${edge.to}`)}`,
    name: edge.name,
    fromVertexId: vertexIdByName.get(edge.from) ?? '',
    toVertexId: vertexIdByName.get(edge.to) ?? '',
    sourceColumnIds: toSourceIds(edge.sourceKeys, selected),
    description: edge.description,
  }));

  const edgeIdByName = new Map(edges.map((edge) => [edge.name, edge.id] as const));

  const attributes = result.attributes
    .map((attribute) => {
      const ownerId =
        attribute.ownerType === 'vertex'
          ? vertexIdByName.get(attribute.ownerName)
          : edgeIdByName.get(attribute.ownerName);

      if (!ownerId) {
        return null;
      }

      return {
        id: `attribute-${toId(`${attribute.ownerName}-${attribute.name}`)}`,
        name: attribute.name,
        ownerType: attribute.ownerType,
        ownerId,
        sourceColumnId: toSourceId(attribute.sourceKey, selected),
        dataType: attribute.dataType,
      };
    })
    .filter((value): value is NonNullable<typeof value> => value !== null);

  return {
    title: result.title,
    summary: result.summary,
    vertices,
    edges,
    attributes,
    assumptions: [...result.assumptions, ...result.notes],
    feedbackHistory: [],
  };
}

function toSourceIds(keys: string[], selected: MappingSelection[]) {
  return keys
    .map((key) => toSourceId(key, selected))
    .filter((value): value is string => Boolean(value));
}

function toSourceId(key: string, selected: MappingSelection[]) {
  const match = selected.find((item) => item.targetKey === key);
  return match ? `${match.fileName}:${match.columnName}` : '';
}

function toId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
