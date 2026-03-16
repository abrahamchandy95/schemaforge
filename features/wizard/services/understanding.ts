import type {
  DataUnderstandingFileRow,
  DataUnderstandingMatchRow,
  DataUnderstandingViewModel,
  SolutionKitId,
  UploadedFileSummary,
} from '@/features/wizard/model/types';

type Params = {
  files: UploadedFileSummary[];
  selectedKitId: SolutionKitId | null;
};

export function buildDataUnderstandingViewModel({
  files,
  selectedKitId,
}: Params): DataUnderstandingViewModel {
  if (files.length === 0) {
    return {
      filesUploadedCount: 0,
      totalColumns: 0,
      totalRowsLabel: '0',
      headersDetectedLabel: 'No files yet',
      files: [],
      matches: [],
      warnings: [],
      note: 'Upload one or more files so the system can inspect structure and estimate schema readiness.',
    };
  }

  const fileRows = files.map(toDetectedFileRow);
  const totalColumns = fileRows.reduce((sum, file) => sum + file.columnCount, 0);
  const estimatedTotalRows = fileRows.reduce(
    (sum, file) => sum + parseRowCountLabel(file.rowCountLabel),
    0,
  );

  const matches = getExpectedMatches(selectedKitId, fileRows);
  const warnings = getWarnings(matches, selectedKitId);

  return {
    filesUploadedCount: fileRows.length,
    totalColumns,
    totalRowsLabel: formatRowEstimate(estimatedTotalRows),
    headersDetectedLabel:
      fileRows.every((file) => file.headersDetected) ? 'All files (X/X)' : 'Some files missing headers',
    files: fileRows,
    matches,
    warnings,
    note:
      'Missing information may limit some schema elements or queries. AI will adapt, but you can improve results by providing more complete data.',
  };
}

function toDetectedFileRow(file: UploadedFileSummary): DataUnderstandingFileRow {
  const lowerName = file.name.toLowerCase();

  if (lowerName.includes('user')) {
    return {
      fileName: file.name,
      sizeLabel: formatBytes(file.sizeBytes),
      columnCount: 5,
      rowCountLabel: '10k',
      headersDetected: true,
    };
  }

  if (lowerName.includes('transaction')) {
    return {
      fileName: file.name,
      sizeLabel: formatBytes(file.sizeBytes),
      columnCount: 8,
      rowCountLabel: '30k',
      headersDetected: true,
    };
  }

  if (lowerName.includes('device')) {
    return {
      fileName: file.name,
      sizeLabel: formatBytes(file.sizeBytes),
      columnCount: 2,
      rowCountLabel: '5k',
      headersDetected: true,
    };
  }

  return {
    fileName: file.name,
    sizeLabel: formatBytes(file.sizeBytes),
    columnCount: 4,
    rowCountLabel: '2k',
    headersDetected: true,
  };
}

function getExpectedMatches(
  selectedKitId: SolutionKitId | null,
  files: DataUnderstandingFileRow[],
): DataUnderstandingMatchRow[] {
  if (selectedKitId === 'transaction-fraud') {
    const usersFile = files.find((file) => file.fileName.toLowerCase().includes('user'));
    const transactionsFile = files.find((file) =>
      file.fileName.toLowerCase().includes('transaction'),
    );
    const devicesFile = files.find((file) => file.fileName.toLowerCase().includes('device'));

    return [
      {
        requirement: 'Required',
        expectedField: 'Account',
        expectedDetails: 'Account ID',
        matchedColumns: usersFile ? ['userid'] : [],
        fileSource: usersFile?.fileName ?? 'Not found',
        confidence: usersFile ? 'high' : 'low',
      },
      {
        requirement: 'Required',
        expectedField: 'Transaction',
        expectedDetails: 'Amount, Timestamp',
        matchedColumns: transactionsFile ? ['amount', 'time'] : [],
        fileSource: transactionsFile?.fileName ?? 'Not found',
        confidence: transactionsFile ? 'high' : 'low',
      },
      {
        requirement: 'Required',
        expectedField: 'Device Info',
        expectedDetails: 'Device ID, IP',
        matchedColumns: devicesFile ? ['ip'] : [],
        fileSource: devicesFile?.fileName ?? 'Not found',
        confidence: devicesFile ? 'low' : 'low',
        statusNote: devicesFile
          ? 'Wait, Device ID column is missing!'
          : 'Device file is missing.',
      },
    ];
  }

  return [
    {
      requirement: 'Required',
      expectedField: 'Primary Entity',
      expectedDetails: 'Unique identifier',
      matchedColumns: files[0] ? ['id'] : [],
      fileSource: files[0]?.fileName ?? 'Not found',
      confidence: files[0] ? 'medium' : 'low',
    },
    {
      requirement: 'Required',
      expectedField: 'Relationships / Events',
      expectedDetails: 'Linking records or activity',
      matchedColumns: files[1] ? ['source_id', 'target_id'] : [],
      fileSource: files[1]?.fileName ?? 'Not found',
      confidence: files[1] ? 'medium' : 'low',
    },
  ];
}

function getWarnings(
  matches: DataUnderstandingMatchRow[],
  selectedKitId: SolutionKitId | null,
) {
  const warnings = [];

  if (selectedKitId === 'transaction-fraud') {
    const deviceRow = matches.find((match) => match.expectedField === 'Device Info');

    if (deviceRow?.confidence === 'low') {
      warnings.push({
        id: 'missing-device-id',
        message:
          "Crucial fields for 'Analyze shared device usage' queries are missing. We found 'IP Address' but not 'Device ID'. This query cannot be fully generated or executed. Other queries remain valid.",
      });
    }
  }

  const missingRequired = matches.some(
    (match) => match.requirement === 'Required' && match.matchedColumns.length === 0,
  );

  if (missingRequired) {
    warnings.push({
      id: 'missing-required-fields',
      message:
        'Some required entities or fields could not be confidently matched from the uploaded files.',
    });
  }

  return warnings;
}

function parseRowCountLabel(value: string) {
  if (value.endsWith('k')) {
    return Number(value.slice(0, -1)) * 1000;
  }

  return Number(value) || 0;
}

function formatRowEstimate(value: number) {
  return value.toLocaleString();
}

function formatBytes(value: number) {
  const mb = value / (1024 * 1024);

  if (mb >= 1) {
    return `${Math.round(mb)}MB`;
  }

  const kb = value / 1024;
  return `${Math.max(1, Math.round(kb))}KB`;
}
