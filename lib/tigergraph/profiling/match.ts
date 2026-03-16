import type { KitMeta } from '@/lib/tigergraph/kits/types';
import { normalizeColumnName } from '@/lib/tigergraph/profiling/normalize';
import type { ProfileMatch, ProfiledFile } from '@/lib/tigergraph/profiling/types';

export function matchKitFields(
  kit: KitMeta,
  files: ProfiledFile[],
): ProfileMatch[] {
  const allColumns = files.flatMap((file) =>
    file.columns.map((column) => ({
      fileName: file.name,
      originalName: column.name,
      normalizedName: column.normalizedName,
    })),
  );

  return kit.expectedFields.map((field) => {
    const normalizedAliases = field.aliases.map(normalizeColumnName);

    const exactMatches = allColumns.filter((column) =>
      normalizedAliases.includes(column.normalizedName),
    );

    if (exactMatches.length > 0) {
      return {
        expectedField: field.name,
        required: field.required,
        matchedColumns: exactMatches.map(
          (match) => `${match.originalName} (${match.fileName})`,
        ),
        state: 'matched',
      } satisfies ProfileMatch;
    }

    const fuzzyMatches = allColumns.filter((column) =>
      normalizedAliases.some(
        (alias) =>
          column.normalizedName.includes(alias) ||
          alias.includes(column.normalizedName),
      ),
    );

    if (fuzzyMatches.length > 0) {
      return {
        expectedField: field.name,
        required: field.required,
        matchedColumns: fuzzyMatches.map(
          (match) => `${match.originalName} (${match.fileName})`,
        ),
        state: 'review',
        note: 'Possible alias match',
      } satisfies ProfileMatch;
    }

    return {
      expectedField: field.name,
      required: field.required,
      matchedColumns: [],
      state: 'missing',
      note: field.required
        ? 'Required field not found'
        : 'Optional field not found',
    } satisfies ProfileMatch;
  });
}

export function buildWarnings(matches: ProfileMatch[]) {
  const warnings: string[] = [];

  const missingRequired = matches.filter(
    (match) => match.required && match.state === 'missing',
  );

  if (missingRequired.length > 0) {
    warnings.push(
      `Missing required fields: ${missingRequired
        .map((match) => match.expectedField)
        .join(', ')}`,
    );
  }

  const reviewNeeded = matches.filter((match) => match.state === 'review');

  if (reviewNeeded.length > 0) {
    warnings.push(
      `${reviewNeeded.length} expected field(s) need review before the reference kit can be trusted.`,
    );
  }

  return warnings;
}
