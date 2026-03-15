import { getSuggestedQueriesForSolutionKit } from '@/features/wizard/services/query-suggestions';
import type { SolutionKitId } from '@/features/wizard/model/types';
import { Empty, Section } from '@/features/wizard/ui';

type Props = {
  selectedKitId: SolutionKitId | null;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function Suggestions({
  selectedKitId,
  selectedIds,
  onToggle,
}: Props) {
  const suggestedQueries = getSuggestedQueriesForSolutionKit(selectedKitId);

  return (
    <Section>
      <p className="mb-4 text-sm text-slate-600">
        Suggested queries are based on the selected solution kit. You can keep
        the relevant ones, remove ones that do not apply, and add your own
        custom queries in plain English.
      </p>

      <div className="overflow-hidden rounded-lg border-2 border-slate-500">
        <div className="border-b border-slate-500 bg-slate-200 px-4 py-2 text-lg font-bold uppercase text-slate-900">
          Suggested Queries
          {selectedKitId ? ' (based on selected solution kit)' : ''}
        </div>

        <div className="max-h-[280px] overflow-y-auto">
          {suggestedQueries.length === 0 ? (
            <div className="p-4">
              <Empty
                title="No suggested queries yet."
                description="Select a solution kit first or add a custom query."
              />
            </div>
          ) : (
            <ul>
              {suggestedQueries.map((query) => {
                const checked = selectedIds.includes(query.id);

                return (
                  <li
                    key={query.id}
                    className="border-b border-slate-300 last:border-b-0"
                  >
                    <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(query.id)}
                        className="mt-1 h-5 w-5 rounded border-slate-400"
                      />
                      <span className="text-base leading-6 text-slate-900">
                        {query.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
