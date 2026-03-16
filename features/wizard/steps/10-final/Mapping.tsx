import type { FinalSchemaMappingRow } from '@/features/wizard/model/types';
import { Section, Table } from '@/features/wizard/ui';

type Props = {
  rows: FinalSchemaMappingRow[];
};

export function Mapping({ rows }: Props) {
  return (
    <Section title="File-to-Graph Mapping">
      <Table>
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-3 py-2">File</th>
              <th className="border border-slate-300 px-3 py-2">Column</th>
              <th className="border border-slate-300 px-3 py-2">
                Graph Target
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.fileName}-${row.columnName}-${index}`}>
                <td className="border border-slate-300 px-3 py-2">
                  {row.fileName}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {row.columnName}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {row.graphTarget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>
    </Section>
  );
}
