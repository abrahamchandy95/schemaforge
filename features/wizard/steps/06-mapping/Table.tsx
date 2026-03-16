import { useMemo } from 'react';
import type {
  MappingSelection,
  MappingTarget,
  ProfileState,
} from '@/features/wizard/model/types';
import { Badge, Section } from '@/features/wizard/ui';

type Props = {
  profile: Exclude<ProfileState, null>;
  selected: MappingSelection[];
  confirmed: boolean;
  previewDirty: boolean;
  busy: boolean;
  onSet: (value: MappingSelection) => void;
  onClear: (fileName: string, columnName: string) => void;
  onRefresh: () => void;
  onConfirm: (value: boolean) => void;
};

export function Table({
  profile,
  selected,
  confirmed,
  previewDirty,
  busy,
  onSet,
  onClear,
  onRefresh,
  onConfirm,
}: Props) {
  const selectedByCol = useMemo(
    () =>
      new Map(
        selected.map((item) => [`${item.fileName}::${item.columnName}`, item]),
      ),
    [selected],
  );

  const targets = profile.mapping?.targets ?? [];
  const canConfirm = !previewDirty && selected.length > 0;

  return (
    <Section title="Field Mapping">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm text-slate-600">
          Suggestions are only a starting point. Your selected mappings are the
          real source of truth for the loading job preview.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={busy || selected.length === 0}
            className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Refreshing…' : 'Refresh Preview'}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(!confirmed)}
            disabled={!canConfirm}
            className={[
              'rounded-md border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50',
              confirmed
                ? 'border-green-700 bg-green-600 text-white'
                : 'border-slate-400 bg-white text-slate-700 hover:bg-slate-50',
            ].join(' ')}
          >
            {confirmed
              ? 'Mapping Confirmed'
              : previewDirty
                ? 'Refresh Preview First'
                : 'Confirm Mapping'}
          </button>
        </div>
      </div>

      {previewDirty && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Mapping changed. Refresh the preview before confirming.
        </div>
      )}

      <div className="space-y-5">
        {profile.files.map((file) => {
          const rows =
            profile.mapping?.columns.filter(
              (column) => column.fileName === file.name,
            ) ?? [];

          if (rows.length === 0) {
            return null;
          }

          return (
            <div key={file.name} className="rounded-xl border border-slate-300">
              <div className="border-b border-slate-300 bg-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">{file.name}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border border-slate-300 px-3 py-2">
                        Column
                      </th>
                      <th className="border border-slate-300 px-3 py-2">
                        Samples
                      </th>
                      <th className="border border-slate-300 px-3 py-2">
                        State
                      </th>
                      <th className="border border-slate-300 px-3 py-2">
                        Suggestions
                      </th>
                      <th className="border border-slate-300 px-3 py-2">
                        Selected
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row) => {
                      const key = `${row.fileName}::${row.columnName}`;
                      const current = selectedByCol.get(key);

                      return (
                        <tr key={key}>
                          <td className="border border-slate-300 px-3 py-2 align-top">
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">
                                {row.columnName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {row.normalizedName}
                              </p>
                            </div>
                          </td>

                          <td className="border border-slate-300 px-3 py-2 align-top">
                            {row.sampleValues.length > 0
                              ? row.sampleValues.join(', ')
                              : '—'}
                          </td>

                          <td className="border border-slate-300 px-3 py-2 align-top">
                            <Badge>{row.state}</Badge>
                          </td>

                          <td className="border border-slate-300 px-3 py-2 align-top">
                            {row.suggestions.length > 0 ? (
                              <div className="space-y-2">
                                {row.suggestions.map((item) => {
                                  const target = findTarget(targets, item.targetKey);

                                  return (
                                    <div
                                      key={item.targetKey}
                                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-2"
                                    >
                                      <p className="font-medium text-slate-900">
                                        {target?.label ?? item.targetKey}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {target?.group ?? 'Unknown'}
                                      </p>
                                      {item.reasons.length > 0 && (
                                        <p className="mt-1 text-xs text-slate-600">
                                          {item.reasons.join(' • ')}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>

                          <td className="border border-slate-300 px-3 py-2 align-top">
                            <div className="space-y-2">
                              <select
                                value={current?.targetKey ?? ''}
                                onChange={(event) => {
                                  const targetKey = event.target.value;

                                  if (!targetKey) {
                                    onClear(row.fileName, row.columnName);
                                    return;
                                  }

                                  onSet({
                                    fileName: row.fileName,
                                    columnName: row.columnName,
                                    targetKey,
                                  });
                                }}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
                              >
                                <option value="">Unmapped</option>
                                {targets.map((target) => (
                                  <option key={target.key} value={target.key}>
                                    {target.label} ({target.group})
                                  </option>
                                ))}
                              </select>

                              {current && (
                                <button
                                  type="button"
                                  onClick={() => onClear(row.fileName, row.columnName)}
                                  className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function findTarget(targets: MappingTarget[], key: string) {
  return targets.find((target) => target.key === key);
}
