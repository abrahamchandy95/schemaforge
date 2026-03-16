import type { ProfileMatch, SolutionKitId } from '@/features/wizard/model/types';
import { Section, Badge, Empty } from '@/features/wizard/ui';

type Props = {
  kit: SolutionKitId | null;
  matches: ProfileMatch[];
};

export function Matches({ kit, matches }: Props) {
  if (!kit) {
    return null;
  }

  return (
    <Section title="Reference Kit Match Check">
      {matches.length === 0 ? (
        <Empty
          title="No kit match data yet"
          description="Once profiling runs, the app compares your uploaded headers to the selected solution kit."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">
                  Expected Field
                </th>
                <th className="border border-slate-300 px-3 py-2">
                  Required
                </th>
                <th className="border border-slate-300 px-3 py-2">State</th>
                <th className="border border-slate-300 px-3 py-2">Matches</th>
                <th className="border border-slate-300 px-3 py-2">Note</th>
              </tr>
            </thead>

            <tbody>
              {matches.map((match) => (
                <tr key={match.expectedField}>
                  <td className="border border-slate-300 px-3 py-2">
                    {match.expectedField}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {match.required ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    <Badge>{match.state}</Badge>
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {match.matchedColumns.length > 0
                      ? match.matchedColumns.join(', ')
                      : '—'}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {match.note ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
