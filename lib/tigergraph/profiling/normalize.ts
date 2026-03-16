export function normalizeColumnName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\ufeff/, '')
    .replace(/[\s_-]+/g, '')
    .replace(/[^a-z0-9]/g, '');
}
