import type {
  FinalSchemaArtifact,
  FinalSchemaMappingRow,
  SchemaAttributeDraft,
  SchemaDraft,
  SchemaEdgeDraft,
  SchemaVertexDraft,
  WizardState,
} from '@/features/wizard/model/types';

export function generateFinalSchemaArtifact(
  state: WizardState,
): FinalSchemaArtifact | null {
  if (!state.schemaDraft) {
    return null;
  }

  const schemaDraft = state.schemaDraft;
  const columnLookup = new Map(
    state.columnContext.columns.map((column) => [column.id, column] as const),
  );

  const schemaText = buildSchemaText(schemaDraft, columnLookup);
  const loadingJobText = buildLoadingJobText(schemaDraft, columnLookup);
  const mappingRows = buildMappingRows(schemaDraft, columnLookup);
  const summaryLines = [
    `${schemaDraft.vertices.length} vertex type(s)`,
    `${schemaDraft.edges.length} edge type(s)`,
    `${schemaDraft.attributes.length} attribute mapping(s)`,
    `${state.upload.files.length} uploaded file(s) referenced in final mapping`,
  ];

  return {
    schemaText,
    loadingJobText,
    mappingRows,
    summaryLines,
  };
}

function buildSchemaText(
  schemaDraft: SchemaDraft,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const vertexBlocks = schemaDraft.vertices.map((vertex) =>
    buildVertexBlock(vertex, schemaDraft.attributes, columnLookup),
  );

  const edgeBlocks = schemaDraft.edges.map((edge) =>
    buildEdgeBlock(edge, schemaDraft, columnLookup),
  );

  return [...vertexBlocks, ...edgeBlocks].join('\n\n');
}

function buildVertexBlock(
  vertex: SchemaVertexDraft,
  attributes: SchemaAttributeDraft[],
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const primarySourceId = vertex.sourceColumnIds[0];
  const primarySource = columnLookup.get(primarySourceId);

  const ownedAttributes = attributes.filter(
    (attribute) =>
      attribute.ownerType === 'vertex' && attribute.ownerId === vertex.id,
  );

  const attributeLines = ownedAttributes.map(
    (attribute) => `  ${attribute.name}: ${attribute.dataType}`,
  );

  return [
    `VERTEX ${vertex.name} {`,
    `  PRIMARY_ID: ${primarySource?.name ?? 'id'} ${
      primarySource?.dataType ?? 'STRING'
    }`,
    ...attributeLines,
    `}`,
  ].join('\n');
}

function buildEdgeBlock(
  edge: SchemaEdgeDraft,
  schemaDraft: SchemaDraft,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const fromVertex = schemaDraft.vertices.find(
    (vertex) => vertex.id === edge.fromVertexId,
  );
  const toVertex = schemaDraft.vertices.find(
    (vertex) => vertex.id === edge.toVertexId,
  );

  const ownedAttributes = schemaDraft.attributes.filter(
    (attribute) => attribute.ownerType === 'edge' && attribute.ownerId === edge.id,
  );

  const attributeLines = ownedAttributes.map(
    (attribute) => `  ${attribute.name}: ${attribute.dataType}`,
  );

  const primarySource = columnLookup.get(edge.sourceColumnIds[0]);

  return [
    `EDGE ${edge.name} {`,
    `  FROM: ${fromVertex?.name ?? 'SourceVertex'}`,
    `  TO: ${toVertex?.name ?? 'TargetVertex'}`,
    `  SOURCE_HINT: ${primarySource?.name ?? 'n/a'}`,
    ...attributeLines,
    `}`,
  ].join('\n');
}

function buildLoadingJobText(
  schemaDraft: SchemaDraft,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const rows: string[] = [];

  for (const vertex of schemaDraft.vertices) {
    for (const sourceColumnId of vertex.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) continue;

      rows.push(
        `LOAD ${sourceColumn.fileSource} -> VERTEX ${vertex.name} USING ${sourceColumn.name}`,
      );
    }
  }

  for (const edge of schemaDraft.edges) {
    for (const sourceColumnId of edge.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) continue;

      rows.push(
        `LOAD ${sourceColumn.fileSource} -> EDGE ${edge.name} USING ${sourceColumn.name}`,
      );
    }
  }

  for (const attribute of schemaDraft.attributes) {
    const sourceColumn = columnLookup.get(attribute.sourceColumnId);
    if (!sourceColumn) continue;

    const ownerLabel =
      attribute.ownerType === 'vertex'
        ? `VERTEX ATTRIBUTE ${attribute.name}`
        : `EDGE ATTRIBUTE ${attribute.name}`;

    rows.push(
      `MAP ${sourceColumn.fileSource}.${sourceColumn.name} -> ${ownerLabel}`,
    );
  }

  return rows.join('\n');
}

function buildMappingRows(
  schemaDraft: SchemaDraft,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
): FinalSchemaMappingRow[] {
  const rows: FinalSchemaMappingRow[] = [];

  for (const vertex of schemaDraft.vertices) {
    for (const sourceColumnId of vertex.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) continue;

      rows.push({
        fileName: sourceColumn.fileSource,
        columnName: sourceColumn.name,
        graphTarget: `Vertex: ${vertex.name}`,
      });
    }
  }

  for (const edge of schemaDraft.edges) {
    for (const sourceColumnId of edge.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) continue;

      rows.push({
        fileName: sourceColumn.fileSource,
        columnName: sourceColumn.name,
        graphTarget: `Edge: ${edge.name}`,
      });
    }
  }

  for (const attribute of schemaDraft.attributes) {
    const sourceColumn = columnLookup.get(attribute.sourceColumnId);
    if (!sourceColumn) continue;

    rows.push({
      fileName: sourceColumn.fileSource,
      columnName: sourceColumn.name,
      graphTarget: `${attribute.ownerType === 'vertex' ? 'Vertex' : 'Edge'} Attribute: ${attribute.name}`,
    });
  }

  return rows;
}
