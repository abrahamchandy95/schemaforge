import type { DataUnderstandingViewModel } from '@/features/wizard/model/types';
import { SummaryCard, Table } from '@/features/wizard/ui';

type Props = {
  view: DataUnderstandingViewModel;
};

export function Summary({ view }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Files Uploaded" value={view.filesUploadedCount} />
        <SummaryCard title="Total Columns" value={view.totalColumns} />
        <SummaryCard title="Rows (Estimated)" value={view.totalRowsLabel} />
        <SummaryCard title="Headers Detected" value={view.headersDetectedLabel} />
      </div>

      <Table title="Detected Files & Structures">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                File
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Size
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Columns
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Rows
              </th>
              <th className="border-b border-slate-400 px-3 py-2">
                Headers
              </th>
            </tr>
          </thead>

          <tbody>
            {view.files.map((file) => (
              <tr key={file.fileName}>
                <td className="border-b border-r border-slate-300 px-3 py-2">
                  {file.fileName}
                </td>
                <td className="border-b border-r border-slate-300 px-3 py-2">
                  {file.sizeLabel}
                </td>
                <td className="border-b border-r border-slate-300 px-3 py-2">
                  {file.columnCount}
                </td>
                <td className="border-b border-r border-slate-300 px-3 py-2">
                  {file.rowCountLabel}
                </td>
                <td className="border-b border-slate-300 px-3 py-2">
                  {file.headersDetected ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>
    </div>
  );
}
