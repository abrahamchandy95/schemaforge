import { renderTransactionFraudLoadingJob } from '@/lib/tigergraph/loading-job/transaction-fraud';
import {
  getTransactionFraudTargets,
  transactionFraudTargets,
  type TransactionFraudTarget,
} from '@/lib/tigergraph/mapping/transaction-fraud';
import type {
  MappingBundle,
  MappingSuggestion,
  SelectedMapping,
  SuggestedColumnMapping,
} from '@/lib/tigergraph/mapping/types';
import { normalizeColumnName } from '@/lib/tigergraph/profiling/normalize';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';

export function buildTransactionFraudMapping(
  files: ProfiledFile[],
): MappingBundle {
  const columns = files.flatMap((file) =>
    file.columns.map((column) =>
      buildSuggestedColumn(
        file.name,
        column.name,
        column.normalizedName,
        column.sampleValues,
      ),
    ),
  );

  const autoSelected = chooseAutoSelections(columns);
  const requiredUnmappedTargets = getRequiredUnmappedTargets(autoSelected);
  const preview = renderTransactionFraudLoadingJob(files, autoSelected);

  return {
    kitKey: 'transaction-fraud',
    targets: getTransactionFraudTargets(),
    columns,
    autoSelected,
    requiredUnmappedTargets,
    warnings: [
      ...buildMappingWarnings(columns, requiredUnmappedTargets),
      ...preview.warnings,
    ],
    autoPreviewLoadingJob: preview.text,
    supportedElements: {
      vertices: preview.supportedVertices,
      edges: preview.supportedEdges,
    },
  };
}

function buildSuggestedColumn(
  fileName: string,
  columnName: string,
  normalizedName: string,
  sampleValues: string[],
): SuggestedColumnMapping {
  const suggestions = suggestTargetsForColumn(
    fileName,
    columnName,
    normalizedName,
    sampleValues,
  );

  return {
    fileName,
    columnName,
    normalizedName,
    sampleValues,
    suggestions,
    state: getColumnState(suggestions),
  };
}

function suggestTargetsForColumn(
  fileName: string,
  columnName: string,
  normalizedName: string,
  sampleValues: string[],
): MappingSuggestion[] {
  return transactionFraudTargets
    .map((target) =>
      scoreTarget(fileName, columnName, normalizedName, sampleValues, target),
    )
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ targetKey, score, reasons }) => ({
      targetKey,
      score,
      reasons,
    }));
}

function scoreTarget(
  fileName: string,
  columnName: string,
  normalizedName: string,
  sampleValues: string[],
  target: TransactionFraudTarget,
) {
  let score = 0;
  const reasons: string[] = [];
  const normalizedAliases = target.aliases.map(normalizeColumnName);
  const normalizedFileName = normalizeColumnName(fileName);
  const normalizedColumnName = normalizeColumnName(columnName);

  if (normalizedAliases.includes(normalizedName)) {
    score += 100;
    reasons.push('Exact alias match');
  } else if (
    normalizedAliases.some((alias) => alias.includes(normalizedName))
  ) {
    score += 70;
    reasons.push('Alias contains uploaded column name');
  } else if (
    normalizedAliases.some((alias) => normalizedName.includes(alias))
  ) {
    score += 65;
    reasons.push('Uploaded column name contains alias');
  }

  if (
    target.fileHints?.some((hint) =>
      normalizedFileName.includes(normalizeColumnName(hint)),
    )
  ) {
    score += 15;
    reasons.push('File name supports this target');
  }

  const sampleBonus = getSampleBonus(sampleValues, target.valueHints ?? []);
  if (sampleBonus.score > 0) {
    score += sampleBonus.score;
    reasons.push(...sampleBonus.reasons);
  }

  if (normalizedColumnName === target.key.replaceAll('.', '')) {
    score += 20;
    reasons.push('Semantic key resemblance');
  }

  return {
    targetKey: target.key,
    score,
    reasons,
  };
}

function getSampleBonus(
  sampleValues: string[],
  hints: string[],
): { score: number; reasons: string[] } {
  if (sampleValues.length === 0 || hints.length === 0) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  if (hints.includes('email') && sampleValues.some(isEmail)) {
    score += 18;
    reasons.push('Sample values look like emails');
  }

  if (hints.includes('ip') && sampleValues.some(isIp)) {
    score += 18;
    reasons.push('Sample values look like IP addresses');
  }

  if (hints.includes('date') && sampleValues.some(isDateLike)) {
    score += 16;
    reasons.push('Sample values look like dates/timestamps');
  }

  if (hints.includes('number') && sampleValues.some(isNumberLike)) {
    score += 14;
    reasons.push('Sample values look numeric');
  }

  if (hints.includes('phone') && sampleValues.some(isPhoneLike)) {
    score += 18;
    reasons.push('Sample values look like phone numbers');
  }

  if (hints.includes('name') && sampleValues.some(isNameLike)) {
    score += 8;
    reasons.push('Sample values look like names/labels');
  }

  return { score, reasons };
}

function getColumnState(
  suggestions: MappingSuggestion[],
): SuggestedColumnMapping['state'] {
  const best = suggestions[0];
  const second = suggestions[1];

  if (!best) {
    return 'unmapped';
  }

  const isStrong =
    best.score >= 95 && (!second || best.score - second.score >= 15);

  return isStrong ? 'auto-selected' : 'needs-review';
}

function chooseAutoSelections(
  columns: SuggestedColumnMapping[],
): SelectedMapping[] {
  const takenTargets = new Set<string>();
  const sorted = [...columns].sort((left, right) => {
    const leftScore = left.suggestions[0]?.score ?? 0;
    const rightScore = right.suggestions[0]?.score ?? 0;
    return rightScore - leftScore;
  });

  const selections: SelectedMapping[] = [];

  for (const column of sorted) {
    if (column.state !== 'auto-selected') {
      continue;
    }

    const best = column.suggestions[0];
    if (!best || takenTargets.has(best.targetKey)) {
      continue;
    }

    selections.push({
      fileName: column.fileName,
      columnName: column.columnName,
      targetKey: best.targetKey,
    });

    takenTargets.add(best.targetKey);
  }

  return selections;
}

function getRequiredUnmappedTargets(selected: SelectedMapping[]) {
  const selectedKeys = new Set(selected.map((item) => item.targetKey));

  return transactionFraudTargets
    .filter((target) => target.required && !selectedKeys.has(target.key))
    .map((target) => target.key);
}

function buildMappingWarnings(
  columns: SuggestedColumnMapping[],
  requiredUnmappedTargets: string[],
) {
  const warnings: string[] = [];

  const reviewCount = columns.filter(
    (column) => column.state === 'needs-review',
  ).length;

  const unmappedCount = columns.filter(
    (column) => column.state === 'unmapped',
  ).length;

  if (requiredUnmappedTargets.length > 0) {
    warnings.push(
      `Required targets still need mapping: ${requiredUnmappedTargets.join(', ')}`,
    );
  }

  if (reviewCount > 0) {
    warnings.push(
      `${reviewCount} column(s) need user review before the mapping is trustworthy.`,
    );
  }

  if (unmappedCount > 0) {
    warnings.push(
      `${unmappedCount} column(s) could not be mapped automatically.`,
    );
  }

  return warnings;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isIp(value: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value.trim());
}

function isDateLike(value: string) {
  return (
    /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value) ||
    !Number.isNaN(Date.parse(value))
  );
}

function isNumberLike(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

function isPhoneLike(value: string) {
  return /^[+\d][\d\s().-]{6,}$/.test(value.trim());
}

function isNameLike(value: string) {
  return /^[a-zA-Z][a-zA-Z\s.'-]{1,}$/.test(value.trim());
}
