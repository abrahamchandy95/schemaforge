import type { CustomQuery } from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Props = {
  customQueries: CustomQuery[];
  draftText: string;
  isAdding: boolean;
  onStart: () => void;
  onCancel: () => void;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export function Custom({
  customQueries,
  draftText,
  isAdding,
  onStart,
  onCancel,
  onDraftChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-md border border-slate-500 bg-slate-100 px-4 py-2 text-base font-semibold text-slate-900 hover:bg-slate-200"
      >
        <span className="text-xl leading-none">+</span>
        Add Query
      </button>

      {isAdding && (
        <Section title="Describe Custom Query (Plain English)" className="max-w-3xl">
          <textarea
            value={draftText}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={6}
            className="w-full rounded-lg border-2 border-slate-400 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-sky-600"
            placeholder={[
              'Explain the query in plain English.',
              'Include:',
              'What data is needed?',
              'Where should the query start? (e.g., specific ID)',
              'What data should it traverse? (e.g., relationships)',
            ].join('\n')}
          />

          <p className="mt-2 text-sm text-slate-600">
            Describe the query and its output below.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onAdd}
              className="rounded-md border border-sky-700 bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Add to List
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </Section>
      )}

      {customQueries.length > 0 && (
        <Section title="Custom Queries" className="max-w-3xl">
          <ul className="space-y-3">
            {customQueries.map((query, index) => (
              <li
                key={query.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-300 p-3"
              >
                <p className="text-sm leading-6 text-slate-900">
                  <span className="font-semibold">Query {index + 1}:</span>{' '}
                  {query.text}
                </p>

                <button
                  type="button"
                  onClick={() => onRemove(query.id)}
                  className="shrink-0 rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </section>
  );
}
