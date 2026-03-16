import type { ProfileState } from '@/features/wizard/model/types';
import { Section, SummaryCard } from '@/features/wizard/ui';

type Props = {
  profile: ProfileState;
};

export function Summary({ profile }: Props) {
  if (!profile) {
    return null;
  }

  const totalColumns = profile.files.reduce(
    (sum, file) => sum + file.columns.length,
    0,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
      <div className="grid gap-4">
        <SummaryCard
          title="Files"
          value={String(profile.files.length)}
          note="Uploaded files profiled in memory"
        />
        <SummaryCard
          title="Columns"
          value={String(totalColumns)}
          note="Detected from file headers only"
        />
      </div>

      <Section title="Profiled Files">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">File</th>
                <th className="border border-slate-300 px-3 py-2">Delimiter</th>
                <th className="border border-slate-300 px-3 py-2">Headers</th>
                <th className="border border-slate-300 px-3 py-2">Columns</th>
              </tr>
            </thead>

            <tbody>
              {profile.files.map((file) => (
                <tr key={file.name}>
                  <td className="border border-slate-300 px-3 py-2">
                    {file.name}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {file.delimiter === '\t' ? 'tab' : file.delimiter}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {file.headersDetected ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {file.columns.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
