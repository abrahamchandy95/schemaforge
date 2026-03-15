import type {
  ColumnAssignedRole,
  ColumnContextColumn,
} from '@/features/wizard/model/types';
import { Badge } from '@/features/wizard/ui';

type Props = {
  column: ColumnContextColumn;
  onOpen: () => void;
  onRoleChange: (value: ColumnAssignedRole) => void;
};

export function Row({ column, onOpen, onRoleChange }: Props) {
  return (
    <tr>
      <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
        <p className="text-xl font-semibold text-slate-900">{column.name}</p>
        <p className="font-medium text-slate-700">{column.dataType}</p>
        <p className="text-slate-600">Sample: {column.sampleValue}</p>
      </td>

      <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
        <select
          value={column.assignedRole}
          onChange={(event) =>
            onRoleChange(event.target.value as ColumnAssignedRole)
          }
          className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
        >
          <option value="vertex">Vertex</option>
          <option value="edge">Edge</option>
          <option value="attribute">Attribute</option>
          <option value="edge-attribute">Edge Attribute</option>
          <option value="ignore">Ignore</option>
        </select>
      </td>

      <td className="border-b border-r border-slate-300 px-3 py-3 align-top">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-md border border-slate-500 bg-slate-100 px-3 py-2 font-semibold text-slate-900 hover:bg-slate-200"
        >
          {hasDetails(column)
            ? 'Edit Detailed Context'
            : 'Add Detailed Guidance'}
        </button>
      </td>

      <td className="border-b border-slate-300 px-3 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          {column.isIdentifier && <Badge tone="warning">Identifier</Badge>}
          {column.relationshipTargetColumnId && (
            <Badge tone="warning">Relationship mapped</Badge>
          )}
          {column.mayBecomeSuperNode && (
            <Badge tone="warning">Super node risk</Badge>
          )}
          {column.requiresSecondaryIndex && (
            <Badge tone="warning">Secondary index</Badge>
          )}
          {hasDetails(column) && (
            <Badge tone="warning">{reviewLabel(column)}</Badge>
          )}
        </div>
      </td>
    </tr>
  );
}

function hasDetails(column: ColumnContextColumn) {
  return Boolean(
    column.guidance ||
      column.dependsOnColumnId ||
      column.relationshipTargetColumnId ||
      column.isSensitiveData ||
      column.requiresSecondaryIndex ||
      column.connectsToMultipleVertexTypes ||
      column.dataRangeOrConstraint ||
      column.mayBecomeSuperNode ||
      column.useGraphAlgorithms ||
      column.needsTemporalModeling ||
      column.participatesInMultipleRelationships ||
      column.usedForFilteringOrSorting,
  );
}

function reviewLabel(column: ColumnContextColumn) {
  const score = [
    column.guidance,
    column.dependsOnColumnId,
    column.relationshipTargetColumnId,
    column.isSensitiveData,
    column.requiresSecondaryIndex,
    column.connectsToMultipleVertexTypes,
    column.dataRangeOrConstraint,
    column.mayBecomeSuperNode,
    column.useGraphAlgorithms,
    column.needsTemporalModeling,
  ].filter(Boolean).length;

  return score >= 3 ? 'Reviewed' : 'Configured';
}
