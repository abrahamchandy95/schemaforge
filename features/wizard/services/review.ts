import type { SchemaDraft } from '@/features/wizard/model/types';

export function applySchemaFeedbackToSchemaDraft(
  schemaDraft: SchemaDraft,
  feedback: string,
): SchemaDraft {
  const trimmedFeedback = feedback.trim();

  if (!trimmedFeedback) {
    return schemaDraft;
  }

  let nextDraft: SchemaDraft = {
    ...schemaDraft,
    vertices: [...schemaDraft.vertices],
    edges: [...schemaDraft.edges],
    attributes: [...schemaDraft.attributes],
    assumptions: [...schemaDraft.assumptions],
    feedbackHistory: [...schemaDraft.feedbackHistory, trimmedFeedback],
  };

  const normalizedFeedback = trimmedFeedback.toLowerCase();

  const renameMatch = normalizedFeedback.match(/rename\s+(\w+)\s+to\s+(\w+)/i);
  if (renameMatch) {
    const [, fromName, toName] = renameMatch;

    nextDraft = {
      ...nextDraft,
      vertices: nextDraft.vertices.map((vertex) =>
        vertex.name.toLowerCase() === fromName.toLowerCase()
          ? { ...vertex, name: toName }
          : vertex,
      ),
      edges: nextDraft.edges.map((edge) =>
        edge.name.toLowerCase() === fromName.toLowerCase()
          ? { ...edge, name: toName }
          : edge,
      ),
      attributes: nextDraft.attributes.map((attribute) =>
        attribute.name.toLowerCase() === fromName.toLowerCase()
          ? { ...attribute, name: toName }
          : attribute,
      ),
    };
  }

  if (
    normalizedFeedback.includes('simple') ||
    normalizedFeedback.includes('simplicity')
  ) {
    nextDraft.assumptions.push(
      'User feedback requested a simpler schema direction.',
    );
  }

  if (
    normalizedFeedback.includes('city') &&
    normalizedFeedback.includes('attribute')
  ) {
    const hasCityAttribute = nextDraft.attributes.some(
      (attribute) => attribute.name.toLowerCase() === 'city',
    );

    if (!hasCityAttribute && nextDraft.vertices[0]) {
      nextDraft.attributes.push({
        id: 'attribute-city-feedback',
        name: 'city',
        ownerType: 'vertex',
        ownerId: nextDraft.vertices[0].id,
        sourceColumnId: 'city',
        dataType: 'STRING',
      });
    }
  }

  if (
    normalizedFeedback.includes('device') &&
    normalizedFeedback.includes('vertex')
  ) {
    const hasDeviceVertex = nextDraft.vertices.some(
      (vertex) => vertex.name.toLowerCase() === 'device',
    );

    if (!hasDeviceVertex) {
      nextDraft.vertices.push({
        id: 'vertex-device-feedback',
        name: 'Device',
        sourceColumnIds: ['ip'],
        description: 'Added from user feedback during schema review.',
      });
    }
  }

  if (
    normalizedFeedback.includes('transaction') &&
    normalizedFeedback.includes('edge') &&
    nextDraft.edges[0]
  ) {
    nextDraft.edges[0] = {
      ...nextDraft.edges[0],
      name: 'Transaction',
    };
  }

  nextDraft.assumptions.push(`Applied user feedback: ${trimmedFeedback}`);

  return nextDraft;
}
