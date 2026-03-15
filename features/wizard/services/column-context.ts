import type {
  ColumnContextColumn,
  ColumnContextFormData,
  UploadedFileSummary,
} from '@/features/wizard/model/types';

export function buildInitialColumnContext(
  files: UploadedFileSummary[],
): ColumnContextFormData {
  const columns: ColumnContextColumn[] = [];

  const usersFile = files.find((file) =>
    file.name.toLowerCase().includes('user'),
  );
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

  return {
    columns,
    globalPriorities: {
      simplicityVsFlexibility: 'balance',
      temporalModeling: 'no',
      performanceVsExtensibility: 'balance',
    },
  };
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
