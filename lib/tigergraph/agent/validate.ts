import { requiresStrictMappingValidation } from '@/lib/tigergraph/kits/policy';
import type { PromptInput } from '@/lib/tigergraph/prompt/types';
import type { AgentResult } from '@/lib/tigergraph/agent/types';

export function validateAgentResult(
  result: AgentResult,
  input: PromptInput,
): string[] {
  const issues: string[] = [];

  const vertexNames = new Set<string>();
  const edgeNames = new Set<string>();
  const allowedKeys = new Set(input.mapping.selected.map((item) => item.targetKey));
  const mappingConfirmed = input.mapping.confirmed;
  const strictKit = requiresStrictMappingValidation(input.useCase.kit);

  if (!result.title.trim()) {
    issues.push('Result title is empty.');
  }

  if (!result.summary.trim()) {
    issues.push('Result summary is empty.');
  }

  for (const vertex of result.vertices) {
    const name = vertex.name.trim();

    if (!name) {
      issues.push('A vertex has an empty name.');
      continue;
    }

    if (vertexNames.has(name)) {
      issues.push(`Duplicate vertex name: ${name}.`);
    }

    vertexNames.add(name);

    if (!vertex.description.trim()) {
      issues.push(`Vertex "${name}" is missing a description.`);
    }

    if (mappingConfirmed && strictKit && vertex.sourceKeys.length === 0) {
      issues.push(
        `Vertex "${name}" must reference at least one confirmed mapping key.`,
      );
    }

    for (const key of vertex.sourceKeys) {
      if (mappingConfirmed && !allowedKeys.has(key)) {
        issues.push(
          `Vertex "${name}" references unmapped source key "${key}".`,
        );
      }
    }
  }

  for (const edge of result.edges) {
    const name = edge.name.trim();

    if (!name) {
      issues.push('An edge has an empty name.');
      continue;
    }

    if (edgeNames.has(name)) {
      issues.push(`Duplicate edge name: ${name}.`);
    }

    edgeNames.add(name);

    if (!edge.description.trim()) {
      issues.push(`Edge "${name}" is missing a description.`);
    }

    if (!edge.from.trim()) {
      issues.push(`Edge "${name}" is missing a "from" vertex.`);
    }

    if (!edge.to.trim()) {
      issues.push(`Edge "${name}" is missing a "to" vertex.`);
    }

    if (edge.from.trim() && !vertexNames.has(edge.from)) {
      issues.push(
        `Edge "${name}" references unknown from-vertex "${edge.from}".`,
      );
    }

    if (edge.to.trim() && !vertexNames.has(edge.to)) {
      issues.push(`Edge "${name}" references unknown to-vertex "${edge.to}".`);
    }

    if (mappingConfirmed && strictKit && edge.sourceKeys.length === 0) {
      issues.push(
        `Edge "${name}" must reference at least one confirmed mapping key.`,
      );
    }

    for (const key of edge.sourceKeys) {
      if (mappingConfirmed && !allowedKeys.has(key)) {
        issues.push(`Edge "${name}" references unmapped source key "${key}".`);
      }
    }
  }

  for (const attribute of result.attributes) {
    const name = attribute.name.trim();

    if (!name) {
      issues.push('An attribute has an empty name.');
      continue;
    }

    if (!attribute.ownerName.trim()) {
      issues.push(`Attribute "${name}" is missing an ownerName.`);
    }

    if (!attribute.dataType.trim()) {
      issues.push(`Attribute "${name}" is missing a dataType.`);
    }

    if (!attribute.sourceKey.trim()) {
      issues.push(`Attribute "${name}" is missing a sourceKey.`);
    }

    if (attribute.ownerType === 'vertex') {
      if (!vertexNames.has(attribute.ownerName)) {
        issues.push(
          `Attribute "${name}" references unknown vertex owner "${attribute.ownerName}".`,
        );
      }
    } else if (attribute.ownerType === 'edge') {
      if (!edgeNames.has(attribute.ownerName)) {
        issues.push(
          `Attribute "${name}" references unknown edge owner "${attribute.ownerName}".`,
        );
      }
    } else {
      issues.push(
        `Attribute "${name}" has invalid ownerType "${String(attribute.ownerType)}".`,
      );
    }

    if (mappingConfirmed && !allowedKeys.has(attribute.sourceKey)) {
      issues.push(
        `Attribute "${name}" references unmapped source key "${attribute.sourceKey}".`,
      );
    }
  }

  if (mappingConfirmed && strictKit) {
    const usedKeys = new Set<string>();

    for (const vertex of result.vertices) {
      for (const key of vertex.sourceKeys) {
        usedKeys.add(key);
      }
    }

    for (const edge of result.edges) {
      for (const key of edge.sourceKeys) {
        usedKeys.add(key);
      }
    }

    for (const attribute of result.attributes) {
      if (attribute.sourceKey) {
        usedKeys.add(attribute.sourceKey);
      }
    }

    if (usedKeys.size === 0) {
      issues.push(
        'The result does not use any confirmed mapping keys for the current strict-mapping kit.',
      );
    }
  }

  return issues;
}
