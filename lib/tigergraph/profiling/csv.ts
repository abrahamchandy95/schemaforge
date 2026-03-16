import { normalizeColumnName } from '@/lib/tigergraph/profiling/normalize';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';

const READ_LIMIT_BYTES = 256 * 1024;

export async function profileFileHeaders(file: File): Promise<ProfiledFile> {
  const head = await file.slice(0, READ_LIMIT_BYTES).text();
  const lines = splitLines(head);

  if (lines.length === 0) {
    return {
      name: file.name,
      sizeBytes: file.size,
      delimiter: ',',
      headersDetected: false,
      columns: [],
    };
  }

  const firstLine = lines[0].replace(/^\ufeff/, '');
  const delimiter = detectDelimiter(file.name, firstLine);
  const headerCells = splitDelimitedLine(firstLine, delimiter);
  const sampleRows = lines.slice(1, 4).map((line) => splitDelimitedLine(line, delimiter));

  return {
    name: file.name,
    sizeBytes: file.size,
    delimiter,
    headersDetected: headerCells.length > 0,
    columns: headerCells
      .map((name, index) => ({
        name: name.trim(),
        normalizedName: normalizeColumnName(name),
        sampleValues: sampleRows
          .map((row) => row[index]?.trim() ?? '')
          .filter(Boolean)
          .slice(0, 3),
      }))
      .filter((column) => column.name.length > 0),
  };
}

function splitLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}

function detectDelimiter(
  fileName: string,
  firstLine: string,
): ',' | '\t' | ';' | '|' {
  if (fileName.toLowerCase().endsWith('.tsv')) {
    return '\t';
  }

  const commaCount = countChar(firstLine, ',');
  const tabCount = countChar(firstLine, '\t');
  const semicolonCount = countChar(firstLine, ';');
  const pipeCount = countChar(firstLine, '|');

  const ranked = [
    { value: ',', count: commaCount },
    { value: '\t', count: tabCount },
    { value: ';', count: semicolonCount },
    { value: '|', count: pipeCount },
  ].sort((a, b) => b.count - a.count);

  return ranked[0].value as ',' | '\t' | ';' | '|';
}

function countChar(text: string, char: string) {
  return [...text].filter((value) => value === char).length;
}

function splitDelimitedLine(line: string, delimiter: ',' | '\t' | ';' | '|') {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}
