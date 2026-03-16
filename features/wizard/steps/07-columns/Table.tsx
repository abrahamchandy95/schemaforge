import type {
  ColumnAssignedRole,
  ColumnContextColumn,
} from '@/features/wizard/model/types';
import { Row } from '@/features/wizard/steps/07-columns/Row';

type Props = {
  columns: ColumnContextColumn[];
  onOpen: (columnId: string) => void;
  onRoleChange: (columnId: string, assignedRole: ColumnAssignedRole) => void;
};

export function Table({ columns, onOpen, onRoleChange }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border-2 border-slate-500 bg-white">
      <div className="border-b border-slate-500 bg-slate-200 px-4 py-2 text-lg font-bold text-slate-900">
        Detailed Context
      </div>

      {columns.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-600">
          No detected columns yet. Run the earlier steps first so column context
          can be built from the profiled files.
        </div>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Column Name &amp; Type
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Assigned Role
              </th>
              <th className="border-b border-r border-slate-400 px-3 py-2">
                Detailed Context
              </th>
              <th className="border-b border-slate-400 px-3 py-2">Special</th>
            </tr>
          </thead>

          <tbody>
            {columns.map((column) => (
              <Row
                key={column.id}
                column={column}
                onOpen={() => onOpen(column.id)}
                onRoleChange={(assignedRole) =>
                  onRoleChange(column.id, assignedRole)
                }
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
