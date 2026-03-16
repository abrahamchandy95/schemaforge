import type { WizardState } from '@/features/wizard/model/types';
import type {
  FinalArtifact,
  FinalMapRow,
} from '@/lib/tigergraph/schema/types';
import { requiresConfirmedMapping } from '@/lib/tigergraph/kits/policy';

export function buildFinalArtifact(
  state: WizardState,
): FinalArtifact | null {
  if (!state.schemaDraft) {
    return null;
  }

  const columnLookup = new Map(
    state.columnContext.columns.map((column) => [column.id, column] as const),
  );

  const useConfirmedMapping =
    requiresConfirmedMapping(state.useCase.selectedKitId) &&
    state.mapping.confirmed &&
    state.mapping.schema.trim().length > 0 &&
    state.mapping.preview.trim().length > 0;

  const title = state.schemaDraft.title;
  const summary = state.schemaDraft.summary;
  const assumptions = mergeAssumptions(
    state.schemaDraft.assumptions,
    state.mapping.warnings,
  );

  const schemaText = useConfirmedMapping
    ? state.mapping.schema
    : buildSchemaText(state.schemaDraft, columnLookup);

  const loadingJobText = useConfirmedMapping
    ? state.mapping.preview
    : buildLoadingJobText(state.schemaDraft, columnLookup);

  const mappingRows = useConfirmedMapping
    ? buildMappingRowsFromSelection(state.mapping.selected)
    : buildMappingRows(state.schemaDraft, columnLookup);

  const summaryLines = buildSummaryLines({
    state,
    useConfirmedMapping,
    mappingRows,
  });

  return {
    title,
    summary,
    assumptions,
    schemaText,
    loadingJobText,
    mappingRows,
    summaryLines,
  };
}

function buildSummaryLines({
  state,
  useConfirmedMapping,
  mappingRows,
}: {
  state: WizardState;
  useConfirmedMapping: boolean;
  mappingRows: FinalMapRow[];
}) {
  return [
    `${state.schemaDraft?.vertices.length ?? 0} vertex type(s)`,
    `${state.schemaDraft?.edges.length ?? 0} edge type(s)`,
    `${state.schemaDraft?.attributes.length ?? 0} attribute mapping(s)`,
    `${state.upload.files.length} uploaded file(s) referenced`,
    useConfirmedMapping
      ? 'Final output uses confirmed mapping previews'
      : 'Final output uses generated draft fallback',
    `${mappingRows.length} source-to-graph mapping row(s)`,
  ];
}

function mergeAssumptions(primary: string[], extra: string[]) {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const item of [...primary, ...extra]) {
    const value = item.trim();
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    merged.push(value);
  }

  return merged;
}

function buildSchemaText(
  schemaDraft: WizardState['schemaDraft'] & NonNullable<WizardState['schemaDraft']>,
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
  vertex: NonNullable<WizardState['schemaDraft']>['vertices'][number],
  attributes: NonNullable<WizardState['schemaDraft']>['attributes'],
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
    `  PRIMARY_ID: ${primarySource?.name ?? 'id'} ${primarySource?.dataType ?? 'STRING'}`,
    ...attributeLines,
    `}`,
  ].join('\n');
}

function buildEdgeBlock(
  edge: NonNullable<WizardState['schemaDraft']>['edges'][number],
  schemaDraft: NonNullable<WizardState['schemaDraft']>,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const fromVertex = schemaDraft.vertices.find(
    (vertex) => vertex.id === edge.fromVertexId,
  );
  const toVertex = schemaDraft.vertices.find(
    (vertex) => vertex.id === edge.toVertexId,
  );

  const ownedAttributes = schemaDraft.attributes.filter(
    (attribute) =>
      attribute.ownerType === 'edge' && attribute.ownerId === edge.id,
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
  schemaDraft: NonNullable<WizardState['schemaDraft']>,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
) {
  const rows: string[] = [];

  for (const vertex of schemaDraft.vertices) {
    for (const sourceColumnId of vertex.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) {
        continue;
      }

      rows.push(
        `LOAD ${sourceColumn.fileSource} -> VERTEX ${vertex.name} USING ${sourceColumn.name}`,
      );
    }
  }

  for (const edge of schemaDraft.edges) {
    for (const sourceColumnId of edge.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) {
        continue;
      }

      rows.push(
        `LOAD ${sourceColumn.fileSource} -> EDGE ${edge.name} USING ${sourceColumn.name}`,
      );
    }
  }

  for (const attribute of schemaDraft.attributes) {
    const sourceColumn = columnLookup.get(attribute.sourceColumnId);
    if (!sourceColumn) {
      continue;
    }

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
  schemaDraft: NonNullable<WizardState['schemaDraft']>,
  columnLookup: Map<string, WizardState['columnContext']['columns'][number]>,
): FinalMapRow[] {
  const rows: FinalMapRow[] = [];

  for (const vertex of schemaDraft.vertices) {
    for (const sourceColumnId of vertex.sourceColumnIds) {
      const sourceColumn = columnLookup.get(sourceColumnId);
      if (!sourceColumn) {
        continue;
      }

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
      if (!sourceColumn) {
        continue;
      }

      rows.push({
        fileName: sourceColumn.fileSource,
        columnName: sourceColumn.name,
        graphTarget: `Edge: ${edge.name}`,
      });
    }
  }

  for (const attribute of schemaDraft.attributes) {
    const sourceColumn = columnLookup.get(attribute.sourceColumnId);
    if (!sourceColumn) {
      continue;
    }

    rows.push({
      fileName: sourceColumn.fileSource,
      columnName: sourceColumn.name,
      graphTarget: `${attribute.ownerType === 'vertex' ? 'Vertex' : 'Edge'} Attribute: ${attribute.name}`,
    });
  }

  return rows;
}

function buildMappingRowsFromSelection(
  selected: WizardState['mapping']['selected'],
): FinalMapRow[] {
  return selected.map((item) => ({
    fileName: item.fileName,
    columnName: item.columnName,
    graphTarget: targetLabel(item.targetKey),
  }));
}

function targetLabel(targetKey: string) {
  switch (targetKey) {
    case 'party.id':
      return 'Vertex: Party';
    case 'card.id':
      return 'Vertex: Card';
    case 'merchant.id':
      return 'Vertex: Merchant';
    case 'merchant.category':
      return 'Vertex: Merchant_Category';
    case 'payment.id':
      return 'Vertex: Payment_Transaction';
    case 'network.ip':
      return 'Vertex: IP';
    case 'network.device':
      return 'Vertex: Device';
    case 'party.email':
      return 'Vertex: Email';
    case 'party.phone':
      return 'Vertex: Phone';
    case 'party.dob':
      return 'Vertex: DOB';
    case 'party.full_name':
      return 'Vertex: Full_Name';
    case 'party.address':
      return 'Vertex: Address';
    case 'party.city':
      return 'Derived Vertex Input: City';
    case 'party.state':
      return 'Vertex: State';
    case 'party.zipcode':
      return 'Vertex: Zipcode';
    case 'party.first_name':
      return 'Derived Vertex Input: Full_Name';
    case 'party.last_name':
      return 'Derived Vertex Input: Full_Name';
    case 'payment.amount':
      return 'Vertex Attribute: Payment_Transaction.amount';
    case 'payment.time':
      return 'Vertex Attribute: Payment_Transaction.event_time';
    default:
      return `Mapped Field: ${targetKey}`;
  }
}
