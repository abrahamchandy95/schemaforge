import type {
  ColumnAssignedRole,
  ColumnContextColumn,
  ColumnContextFormData,
  MappingSelection,
  ProfiledFile,
  SolutionKitId,
  UploadedFileSummary,
} from '@/features/wizard/model/types';
import { requiresConfirmedMapping } from '@/lib/tigergraph/kits/policy';

type Params = {
  uploadedFiles: UploadedFileSummary[];
  profiledFiles?: ProfiledFile[];
  kit?: SolutionKitId | null;
  mappingSelected?: MappingSelection[];
  mappingConfirmed?: boolean;
};

type BuiltColumn = {
  column: ColumnContextColumn;
  targetKey: string | null;
};

export function buildColumnContext({
  uploadedFiles,
  profiledFiles = [],
  kit = null,
  mappingSelected = [],
  mappingConfirmed = false,
}: Params): ColumnContextFormData {
  if (profiledFiles.length > 0) {
    const columns =
      requiresConfirmedMapping(kit) &&
      mappingConfirmed &&
      mappingSelected.length > 0
        ? buildMappedProfileColumns(profiledFiles, mappingSelected)
        : buildProfileColumns(profiledFiles);

    return {
      columns,
      globalPriorities: {
        simplicityVsFlexibility: 'balance',
        temporalModeling: 'no',
        performanceVsExtensibility: 'balance',
      },
    };
  }

  return {
    columns: buildFallbackColumns(uploadedFiles),
    globalPriorities: {
      simplicityVsFlexibility: 'balance',
      temporalModeling: 'no',
      performanceVsExtensibility: 'balance',
    },
  };
}

function buildMappedProfileColumns(
  files: ProfiledFile[],
  selected: MappingSelection[],
) {
  const targetByColumn = new Map(
    selected.map((item) => [`${item.fileName}::${item.columnName}`, item.targetKey] as const),
  );

  const built: BuiltColumn[] = files.flatMap((file, fileIndex) =>
    file.columns.map((source, columnIndex) => {
      const targetKey = targetByColumn.get(`${file.name}::${source.name}`) ?? null;

      return {
        column: createMappedColumn({
          file,
          fileIndex,
          source,
          columnIndex,
          targetKey,
        }),
        targetKey,
      };
    }),
  );

  return attachDependencies(built);
}

function buildProfileColumns(files: ProfiledFile[]) {
  return files.flatMap((file, fileIndex) =>
    file.columns.map((source, columnIndex) =>
      createColumn({
        id: makeColumnId(file.name, source.name, fileIndex, columnIndex),
        name: source.name,
        dataType: inferDataType(source.sampleValues),
        sampleValue: source.sampleValues[0] ?? '',
        fileSource: file.name,
        assignedRole: inferRole(source.name, source.sampleValues),
        isIdentifier: looksLikeIdentifier(source.name),
        isRealEntity: looksLikeEntity(source.name),
        isTraversalStartingPoint: looksLikeIdentifier(source.name),
        usedForFilteringOrSorting: looksLikeFilterField(source.name),
        mayBecomeSuperNode: looksLikeSuperNodeRisk(source.name),
        dataRangeOrConstraint: inferConstraint(source.sampleValues),
      }),
    ),
  );
}

function buildFallbackColumns(files: UploadedFileSummary[]) {
  const columns: ColumnContextColumn[] = [];

  const usersFile = files.find((file) => file.name.toLowerCase().includes('user'));
  const transactionsFile = files.find((file) =>
    file.name.toLowerCase().includes('transaction'),
  );
  const devicesFile = files.find((file) =>
    file.name.toLowerCase().includes('device'),
  );

  if (usersFile) {
    columns.push(
      createColumn({
        id: 'userid',
        name: 'userid',
        dataType: 'STRING',
        sampleValue: 'U101',
        fileSource: usersFile.name,
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        isTraversalStartingPoint: true,
      }),
      createColumn({
        id: 'city',
        name: 'city',
        dataType: 'STRING',
        sampleValue: 'NYC',
        fileSource: usersFile.name,
        assignedRole: 'attribute',
        usedForFilteringOrSorting: true,
      }),
    );
  }

  if (transactionsFile) {
    columns.push(
      createColumn({
        id: 'amount',
        name: 'amount',
        dataType: 'DECIMAL',
        sampleValue: '59.99',
        fileSource: transactionsFile.name,
        assignedRole: 'attribute',
        usedForFilteringOrSorting: true,
        dataRangeOrConstraint: 'positive decimal',
        modelingPriority: 'accuracy',
      }),
      createColumn({
        id: 'productid',
        name: 'productid',
        dataType: 'STRING',
        sampleValue: 'P345',
        fileSource: transactionsFile.name,
        assignedRole: 'edge',
        participatesInMultipleRelationships: true,
        useGraphAlgorithms: true,
        modelingPriority: 'performance',
      }),
    );
  }

  if (devicesFile) {
    columns.push(
      createColumn({
        id: 'ip',
        name: 'ip',
        dataType: 'STRING',
        sampleValue: '192.168.1.1',
        fileSource: devicesFile.name,
        assignedRole: 'vertex',
        isRealEntity: true,
        mayBecomeSuperNode: true,
        usedForFilteringOrSorting: true,
        dataRangeOrConstraint: 'IPv4 / IPv6',
      }),
    );
  }

  if (columns.length === 0 && files[0]) {
    columns.push(
      createColumn({
        id: 'id',
        name: 'id',
        dataType: 'STRING',
        sampleValue: 'A001',
        fileSource: files[0].name,
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        isTraversalStartingPoint: true,
      }),
    );
  }

  return columns;
}

function createMappedColumn({
  file,
  fileIndex,
  source,
  columnIndex,
  targetKey,
}: {
  file: ProfiledFile;
  fileIndex: number;
  source: ProfiledFile['columns'][number];
  columnIndex: number;
  targetKey: string | null;
}) {
  const base = createColumn({
    id: makeColumnId(file.name, source.name, fileIndex, columnIndex),
    name: source.name,
    dataType: inferDataType(source.sampleValues),
    sampleValue: source.sampleValues[0] ?? '',
    fileSource: file.name,
    assignedRole: inferRole(source.name, source.sampleValues),
    isIdentifier: looksLikeIdentifier(source.name),
    isRealEntity: looksLikeEntity(source.name),
    isTraversalStartingPoint: looksLikeIdentifier(source.name),
    usedForFilteringOrSorting: looksLikeFilterField(source.name),
    mayBecomeSuperNode: looksLikeSuperNodeRisk(source.name),
    dataRangeOrConstraint: inferConstraint(source.sampleValues),
  });

  if (!targetKey) {
    return base;
  }

  return {
    ...base,
    ...mappedPatch(targetKey),
  };
}

function attachDependencies(built: BuiltColumn[]) {
  const idByTarget = new Map<string, string>();

  for (const item of built) {
    if (item.targetKey) {
      idByTarget.set(item.targetKey, item.column.id);
    }
  }

  return built.map(({ column, targetKey }) => {
    if (!targetKey) {
      return column;
    }

    if (targetKey === 'party.city') {
      return {
        ...column,
        dependsOnColumnId: idByTarget.get('party.state') ?? null,
      };
    }

    if (targetKey === 'party.first_name') {
      return {
        ...column,
        dependsOnColumnId:
          idByTarget.get('party.last_name') ??
          idByTarget.get('party.full_name') ??
          null,
      };
    }

    if (targetKey === 'party.last_name') {
      return {
        ...column,
        dependsOnColumnId:
          idByTarget.get('party.first_name') ??
          idByTarget.get('party.full_name') ??
          null,
      };
    }

    return column;
  });
}

function mappedPatch(targetKey: string): Partial<ColumnContextColumn> {
  switch (targetKey) {
    case 'party.id':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        isTraversalStartingPoint: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Party vertex key from the confirmed mapping.',
      };

    case 'card.id':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Card vertex key from the confirmed mapping.',
      };

    case 'merchant.id':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Merchant vertex key from the confirmed mapping.',
      };

    case 'payment.id':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Payment_Transaction vertex key from the confirmed mapping.',
      };

    case 'network.ip':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        mayBecomeSuperNode: true,
        dataRangeOrConstraint: 'IPv4 / IPv6',
        guidance: 'Primary IP vertex key from the confirmed mapping.',
      };

    case 'network.device':
      return {
        assignedRole: 'vertex',
        isRealEntity: true,
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        participatesInMultipleRelationships: true,
        guidance: 'Primary Device vertex key from the confirmed mapping.',
      };

    case 'merchant.category':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Merchant_Category vertex key from the confirmed mapping.',
      };

    case 'party.email':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Email vertex key from the confirmed mapping.',
      };

    case 'party.phone':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Phone vertex key from the confirmed mapping.',
      };

    case 'party.address':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        participatesInMultipleRelationships: true,
        guidance: 'Primary Address vertex key from the confirmed mapping.',
      };

    case 'party.dob':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        needsTemporalModeling: true,
        dataRangeOrConstraint: 'date/time',
        guidance: 'Primary DOB vertex key from the confirmed mapping.',
      };

    case 'party.full_name':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        guidance: 'Primary Full_Name vertex key from the confirmed mapping.',
      };

    case 'party.state':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary State vertex key from the confirmed mapping.',
      };

    case 'party.zipcode':
      return {
        assignedRole: 'vertex',
        isIdentifier: true,
        usedForFilteringOrSorting: true,
        guidance: 'Primary Zipcode vertex key from the confirmed mapping.',
      };

    case 'party.city':
      return {
        assignedRole: 'attribute',
        usedForFilteringOrSorting: true,
        participatesInMultipleRelationships: true,
        guidance:
          'Used together with state to derive the City vertex key in the confirmed mapping.',
      };

    case 'party.first_name':
      return {
        assignedRole: 'attribute',
        guidance:
          'Used together with last_name to derive the Full_Name vertex key in the confirmed mapping.',
      };

    case 'party.last_name':
      return {
        assignedRole: 'attribute',
        guidance:
          'Used together with first_name to derive the Full_Name vertex key in the confirmed mapping.',
      };

    case 'payment.amount':
      return {
        assignedRole: 'attribute',
        usedForFilteringOrSorting: true,
        dataRangeOrConstraint: 'positive decimal',
        modelingPriority: 'accuracy',
        guidance: 'Payment amount attribute from the confirmed mapping.',
      };

    case 'payment.time':
      return {
        assignedRole: 'attribute',
        usedForFilteringOrSorting: true,
        needsTemporalModeling: true,
        dataRangeOrConstraint: 'date/time',
        guidance: 'Payment event time attribute from the confirmed mapping.',
      };

    default:
      return {};
  }
}

function createColumn(
  partial: Partial<ColumnContextColumn> &
    Pick<
      ColumnContextColumn,
      'id' | 'name' | 'dataType' | 'sampleValue' | 'fileSource' | 'assignedRole'
    >,
): ColumnContextColumn {
  return {
    id: partial.id,
    name: partial.name,
    dataType: partial.dataType,
    sampleValue: partial.sampleValue,
    fileSource: partial.fileSource,
    assignedRole: partial.assignedRole,

    isRealEntity: partial.isRealEntity ?? false,
    isIdentifier: partial.isIdentifier ?? false,
    isTraversalStartingPoint: partial.isTraversalStartingPoint ?? false,
    participatesInMultipleRelationships:
      partial.participatesInMultipleRelationships ?? false,
    usedForFilteringOrSorting: partial.usedForFilteringOrSorting ?? false,
    mayBecomeSuperNode: partial.mayBecomeSuperNode ?? false,
    useGraphAlgorithms: partial.useGraphAlgorithms ?? false,
    needsTemporalModeling: partial.needsTemporalModeling ?? false,

    dependsOnColumnId: partial.dependsOnColumnId ?? null,
    relationshipTargetColumnId: partial.relationshipTargetColumnId ?? null,

    isSensitiveData: partial.isSensitiveData ?? false,
    requiresSecondaryIndex: partial.requiresSecondaryIndex ?? false,
    connectsToMultipleVertexTypes:
      partial.connectsToMultipleVertexTypes ?? false,

    dataRangeOrConstraint: partial.dataRangeOrConstraint ?? '',
    modelingPriority: partial.modelingPriority ?? 'balanced',
    guidance: partial.guidance ?? '',
  };
}

function makeColumnId(
  fileName: string,
  columnName: string,
  fileIndex: number,
  columnIndex: number,
) {
  const file = normalizeIdPart(fileName.replace(/\.[^.]+$/, ''));
  const column = normalizeIdPart(columnName);

  return `${file}-${column}-${fileIndex}-${columnIndex}`;
}

function normalizeIdPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function inferDataType(sampleValues: string[]) {
  const value = sampleValues.find(Boolean)?.trim();

  if (!value) {
    return 'STRING';
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return value.includes('.') ? 'DECIMAL' : 'INT';
  }

  if (
    /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value) ||
    !Number.isNaN(Date.parse(value))
  ) {
    return 'DATETIME';
  }

  return 'STRING';
}

function inferRole(
  columnName: string,
  sampleValues: string[],
): ColumnAssignedRole {
  const name = columnName.toLowerCase();

  if (
    name.includes('transaction_id') ||
    name === 'transaction' ||
    name === 'payment_transaction'
  ) {
    return 'vertex';
  }

  if (
    name === 'id' ||
    name.endsWith('_id') ||
    name === 'userid' ||
    name === 'card' ||
    name === 'merchant' ||
    name === 'device' ||
    name === 'ip'
  ) {
    return 'vertex';
  }

  if (
    name.includes('amount') ||
    name.includes('time') ||
    name.includes('date') ||
    name.includes('email') ||
    name.includes('phone') ||
    name.includes('address') ||
    name.includes('city') ||
    name.includes('state') ||
    name.includes('zip') ||
    name.includes('category')
  ) {
    return 'attribute';
  }

  const sample = sampleValues.find(Boolean)?.trim() ?? '';
  if (/^-?\d+(\.\d+)?$/.test(sample)) {
    return 'attribute';
  }

  return 'attribute';
}

function looksLikeIdentifier(columnName: string) {
  const name = columnName.toLowerCase();
  return (
    name === 'id' ||
    name.endsWith('_id') ||
    name.endsWith('id') ||
    name === 'userid' ||
    name === 'tx_id'
  );
}

function looksLikeEntity(columnName: string) {
  const name = columnName.toLowerCase();
  return (
    looksLikeIdentifier(columnName) ||
    name === 'merchant' ||
    name === 'card' ||
    name === 'device' ||
    name === 'ip'
  );
}

function looksLikeFilterField(columnName: string) {
  const name = columnName.toLowerCase();
  return (
    name.includes('amount') ||
    name.includes('time') ||
    name.includes('date') ||
    name.includes('city') ||
    name.includes('state') ||
    name.includes('zip') ||
    name.includes('category')
  );
}

function looksLikeSuperNodeRisk(columnName: string) {
  const name = columnName.toLowerCase();
  return name === 'ip' || name.includes('merchant') || name.includes('device');
}

function inferConstraint(sampleValues: string[]) {
  const value = sampleValues.find(Boolean)?.trim();

  if (!value) {
    return '';
  }

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
    return 'IPv4';
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return 'numeric';
  }

  if (
    /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value) ||
    !Number.isNaN(Date.parse(value))
  ) {
    return 'date/time';
  }

  return '';
}
