import type { PromptInput } from '@/lib/tigergraph/prompt/types';

export function buildUserPrompt(input: PromptInput) {
  return [
    'You are receiving a structured TigerGraph schema-design brief from a product wizard.',
    'Use the information below as the case-specific input for this run.',
    '',
    'YOUR JOB IN THIS RUN',
    buildTask(input),
    '',
    section('Readiness', renderReadiness(input)),
    section('Business Goal and Use Case', renderUseCase(input)),
    section('Expected Queries', renderQueries(input)),
    section('Profiled Files', renderFiles(input)),
    section('Confirmed or Proposed Mapping', renderMapping(input)),
    section('Column Context and Modeling Hints', renderColumns(input)),
    section('Graph Design Priorities', renderPriorities(input)),
    section('Current Draft', renderDraft(input)),
    '',
    'FINAL INSTRUCTION',
    buildFinalInstruction(input),
  ].join('\n');
}

function buildTask(input: PromptInput) {
  const lines = [
    '- Validate and improve the TigerGraph design using the structured wizard input.',
    '- Treat the confirmed mapping, if confirmed, as the strongest case-specific constraint.',
    '- Keep the schema and loading-job plan aligned.',
    '- Preserve user intent and query support.',
  ];

  if (input.mapping.confirmed) {
    lines.push(
      '- The mapping is confirmed, so preserve it unless there is a clearly stated incompatibility.',
    );
  } else {
    lines.push(
      '- The mapping is not confirmed, so you may identify ambiguity or incompatibility, but do not present uncertain assumptions as settled facts.',
    );
  }

  if (input.mapping.schemaPreview.trim() || input.mapping.loadingJobPreview.trim()) {
    lines.push(
      '- A deterministic baseline already exists. Prefer refining it rather than replacing it wholesale.',
    );
  } else {
    lines.push(
      '- No deterministic baseline exists yet. Build the design from the structured inputs.',
    );
  }

  if (input.useCase.kit === 'other' || !input.useCase.kit) {
    lines.push(
      '- This is a custom or unspecified use case. Derive the design from the goal, files, mappings, and queries rather than forcing a known kit pattern.',
    );
  } else {
    lines.push(
      `- The selected use case is ${input.useCase.kit}. Use it as context, but do not let it override confirmed user intent.`,
    );
  }

  return lines.join('\n');
}

function section(title: string, body: string) {
  return [`${title.toUpperCase()}`, body].join('\n');
}

function renderReadiness(input: PromptInput) {
  return [
    `ready: ${String(input.ready)}`,
    input.issues.length > 0
      ? `issues:\n${input.issues.map((item) => `- ${item}`).join('\n')}`
      : 'issues:\n- none',
  ].join('\n');
}

function renderUseCase(input: PromptInput) {
  return [
    `kit: ${input.useCase.kit ?? 'none'}`,
    `mode: ${input.useCase.mode}`,
    `goal: ${input.useCase.goal || '(empty)'}`,
    `customUseCase: ${input.useCase.customUseCase || '(empty)'}`,
  ].join('\n');
}

function renderQueries(input: PromptInput) {
  if (input.queries.length === 0) {
    return '- none';
  }

  return input.queries
    .map((query, index) => `- ${index + 1}. [${query.source}] ${query.text}`)
    .join('\n');
}

function renderFiles(input: PromptInput) {
  if (input.files.length === 0) {
    return '- none';
  }

  return input.files
    .map((file) =>
      [
        `- file: ${file.name}`,
        `  delimiter: ${JSON.stringify(file.delimiter)}`,
        `  headersDetected: ${String(file.headersDetected)}`,
        `  columnCount: ${file.columns.length}`,
        '  columns:',
        ...file.columns.map((column) =>
          [
            `    - name: ${column.name}`,
            `      normalizedName: ${column.normalizedName}`,
            `      sampleValues: ${column.sampleValues.join(', ') || '(none)'}`,
          ].join('\n'),
        ),
      ].join('\n'),
    )
    .join('\n');
}

function renderMapping(input: PromptInput) {
  return [
    `confirmed: ${String(input.mapping.confirmed)}`,
    input.mapping.selected.length > 0
      ? [
          'selected:',
          ...input.mapping.selected.map(
            (item) =>
              `- ${item.fileName} :: ${item.columnName} -> ${item.targetKey}`,
          ),
        ].join('\n')
      : 'selected:\n- none',
    input.mapping.supportedVertices.length > 0
      ? `supportedVertices: ${input.mapping.supportedVertices.join(', ')}`
      : 'supportedVertices: none',
    input.mapping.supportedEdges.length > 0
      ? `supportedEdges: ${input.mapping.supportedEdges.join(', ')}`
      : 'supportedEdges: none',
    input.mapping.warnings.length > 0
      ? `warnings:\n${input.mapping.warnings.map((item) => `- ${item}`).join('\n')}`
      : 'warnings:\n- none',
    '',
    'schemaPreview:',
    input.mapping.schemaPreview || '(empty)',
    '',
    'loadingJobPreview:',
    input.mapping.loadingJobPreview || '(empty)',
  ].join('\n');
}

function renderColumns(input: PromptInput) {
  if (input.columns.length === 0) {
    return '- none';
  }

  return input.columns
    .map((column) =>
      [
        `- ${column.fileSource} :: ${column.name}`,
        `  dataType: ${column.dataType}`,
        `  sampleValue: ${column.sampleValue || '(empty)'}`,
        `  assignedRole: ${column.assignedRole}`,
        `  guidance: ${column.guidance || '(empty)'}`,
        `  dependsOnColumnId: ${column.dependsOnColumnId ?? 'null'}`,
        `  relationshipTargetColumnId: ${column.relationshipTargetColumnId ?? 'null'}`,
        `  dataRangeOrConstraint: ${column.dataRangeOrConstraint || '(empty)'}`,
        '  flags:',
        `    isRealEntity: ${String(column.flags.isRealEntity)}`,
        `    isIdentifier: ${String(column.flags.isIdentifier)}`,
        `    isTraversalStartingPoint: ${String(column.flags.isTraversalStartingPoint)}`,
        `    participatesInMultipleRelationships: ${String(column.flags.participatesInMultipleRelationships)}`,
        `    usedForFilteringOrSorting: ${String(column.flags.usedForFilteringOrSorting)}`,
        `    mayBecomeSuperNode: ${String(column.flags.mayBecomeSuperNode)}`,
        `    useGraphAlgorithms: ${String(column.flags.useGraphAlgorithms)}`,
        `    needsTemporalModeling: ${String(column.flags.needsTemporalModeling)}`,
        `    isSensitiveData: ${String(column.flags.isSensitiveData)}`,
        `    requiresSecondaryIndex: ${String(column.flags.requiresSecondaryIndex)}`,
        `    connectsToMultipleVertexTypes: ${String(column.flags.connectsToMultipleVertexTypes)}`,
      ].join('\n'),
    )
    .join('\n');
}

function renderPriorities(input: PromptInput) {
  return [
    `simplicityVsFlexibility: ${input.priorities.simplicityVsFlexibility}`,
    `temporalModeling: ${input.priorities.temporalModeling}`,
    `performanceVsExtensibility: ${input.priorities.performanceVsExtensibility}`,
  ].join('\n');
}

function renderDraft(input: PromptInput) {
  if (!input.draft) {
    return '- none';
  }

  return [
    `title: ${input.draft.title}`,
    `summary: ${input.draft.summary}`,
    '',
    'vertices:',
    input.draft.vertices.length > 0
      ? input.draft.vertices
          .map(
            (vertex) =>
              `- ${vertex.name} | sourceColumnIds: ${joinOrNone(vertex.sourceColumnIds)} | description: ${vertex.description}`,
          )
          .join('\n')
      : '- none',
    '',
    'edges:',
    input.draft.edges.length > 0
      ? input.draft.edges
          .map(
            (edge) =>
              `- ${edge.name} | fromVertexId: ${edge.fromVertexId} | toVertexId: ${edge.toVertexId} | sourceColumnIds: ${joinOrNone(edge.sourceColumnIds)} | description: ${edge.description}`,
          )
          .join('\n')
      : '- none',
    '',
    'attributes:',
    input.draft.attributes.length > 0
      ? input.draft.attributes
          .map(
            (attribute) =>
              `- ${attribute.name} | ownerType: ${attribute.ownerType} | ownerId: ${attribute.ownerId} | sourceColumnId: ${attribute.sourceColumnId} | dataType: ${attribute.dataType}`,
          )
          .join('\n')
      : '- none',
    '',
    input.draft.assumptions.length > 0
      ? `assumptions:\n${input.draft.assumptions.map((item) => `- ${item}`).join('\n')}`
      : 'assumptions:\n- none',
    '',
    input.draft.feedbackHistory.length > 0
      ? `feedbackHistory:\n${input.draft.feedbackHistory.map((item) => `- ${item}`).join('\n')}`
      : 'feedbackHistory:\n- none',
  ].join('\n');
}

function buildFinalInstruction(input: PromptInput) {
  const lines = [
    'Use all of the structured information above to produce the best TigerGraph design judgment for this run.',
    'Your response must stay aligned with the user’s goal, query expectations, and available data.',
  ];

  if (input.mapping.confirmed) {
    lines.push(
      'Because the mapping is confirmed, preserve the mapped semantics and only suggest changes that remain compatible with those mappings.',
    );
  } else {
    lines.push(
      'Because the mapping is not confirmed, explicitly distinguish between confirmed facts and proposed corrections.',
    );
  }

  if (input.mapping.schemaPreview.trim()) {
    lines.push(
      'A schema preview already exists. Treat it as the current baseline and refine it carefully instead of replacing it casually.',
    );
  }

  if (input.mapping.loadingJobPreview.trim()) {
    lines.push(
      'A loading-job preview already exists. Keep any schema refinements compatible with the loading structure, or explain the exact changes required.',
    );
  }

  lines.push(
    'If the current design is strong, say so and preserve it.',
    'If changes are needed, make them concrete, minimal where possible, and clearly justified.',
    'Always call out assumptions, missing data, and unresolved risks explicitly.',
  );

  return lines.join('\n');
}

function joinOrNone(values: string[]) {
  return values.length > 0 ? values.join(', ') : 'none';
}
