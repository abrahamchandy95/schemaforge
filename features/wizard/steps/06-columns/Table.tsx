import type {
  ColumnAssignedRole,
  ColumnContextColumn,
} from '@/features/wizard/model/types';
import { Empty, Table as DataTable } from '@/features/wizard/ui';
import { Row } from '@/features/wizard/steps/06-columns/Row';

type Props = {
  columns: ColumnContextColumn[];
  onOpen: (columnId: string) => void;
  onRoleChange: (columnId: string, assignedRole: ColumnAssignedRole) => void;
};

export function Table({ columns, onOpen, onRoleChange }: Props) {
  return (
    <DataTable title="Detailed Context">
      {columns.length === 0 ? (
        <div className="p-4">
          <Empty
            title="No detected columns yet."
            description="Upload files first so column context can be generated from the data."
          />
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
              <th className="border-b border-slate-400 px-3 py-2">
                Special
              </th>
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
    </DataTable>
  );
}
