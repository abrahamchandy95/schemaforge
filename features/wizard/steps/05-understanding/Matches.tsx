import type {
  DataUnderstandingViewModel,
  MatchConfidence,
  SolutionKitId,
} from '@/features/wizard/model/types';
import { Badge, Empty, Table } from '@/features/wizard/ui';

type Props = {
  selectedKitId: SolutionKitId | null;
  view: DataUnderstandingViewModel;
};

export function Matches({ selectedKitId, view }: Props) {
  return (
    <Table
      title={`AI Contextual Analysis: Use Case ${
        selectedKitId ? `"${selectedKitId}"` : '(not selected yet)'
      }`}
    >
      {view.matches.length === 0 ? (
        <div className="p-4">
          <Empty
            title="No contextual matches yet."
            description="Upload files and select a use case to see expected entities and likely column matches."
          />
        </div>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Expected Entity / Field
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Matching Uploaded Column(s)
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                File Source
              </th>
              <th className="border-b border-slate-400 px-3 py-2">
                Confidence
              </th>
            </tr>
          </thead>

          <tbody>
            {view.matches.map((match, index) => (
              <tr key={`${match.expectedField}-${index}`}>
                <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
                  <p className="font-semibold">{match.requirement}</p>
                  <p>
                    {match.expectedField}
                    {match.expectedDetails
                      ? ` (${match.expectedDetails})`
                      : ''}
                  </p>
                  {match.statusNote && (
                    <p className="mt-1 text-amber-700">{match.statusNote}</p>
                  )}
                </td>

                <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
                  {match.matchedColumns.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {match.matchedColumns.map((column) => (
                        <Badge key={column}>{column}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500">No confident match</span>
                  )}
                </td>

                <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
                  {match.fileSource}
                </td>

                <td className="border-b border-slate-300 px-3 py-3 align-top">
                  <Confidence value={match.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Table>
  );
}

function Confidence({ value }: { value: MatchConfidence }) {
  const width =
    value === 'high' ? 'w-4/5' : value === 'medium' ? 'w-1/2' : 'w-1/4';

  const color =
    value === 'high'
      ? 'bg-green-500'
      : value === 'medium'
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div className="space-y-1">
      <p className="capitalize">{value}</p>
      <div className="h-5 w-full rounded-sm border border-slate-400 bg-white p-0.5">
        <div className={`h-full rounded-sm ${width} ${color}`} />
      </div>
    </div>
  );
}
