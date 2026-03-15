'use client';

import { useState } from 'react';
import type {
  ColumnAssignedRole,
  ColumnContextBooleanFlag,
  ColumnContextColumn,
  ColumnContextColumnPatch,
  ColumnModelingPriority,
} from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Draft = Omit<
  ColumnContextColumn,
  'id' | 'name' | 'dataType' | 'sampleValue' | 'fileSource'
>;

type Props = {
  open: boolean;
  column: ColumnContextColumn | null;
  columns: ColumnContextColumn[];
  onClose: () => void;
  onSave: (columnId: string, value: ColumnContextColumnPatch) => void;
};

export function Dialog({
  open,
  column,
  columns,
  onClose,
  onSave,
}: Props) {
  if (!open || !column) {
    return null;
  }

  return (
    <Content
      key={column.id}
      column={column}
      columns={columns}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function Content({
  column,
  columns,
  onClose,
  onSave,
}: {
  column: ColumnContextColumn;
  columns: ColumnContextColumn[];
  onClose: () => void;
  onSave: (columnId: string, value: ColumnContextColumnPatch) => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => ({
    assignedRole: column.assignedRole,
    isRealEntity: column.isRealEntity,
    isIdentifier: column.isIdentifier,
    isTraversalStartingPoint: column.isTraversalStartingPoint,
    participatesInMultipleRelationships:
      column.participatesInMultipleRelationships,
    usedForFilteringOrSorting: column.usedForFilteringOrSorting,
    mayBecomeSuperNode: column.mayBecomeSuperNode,
    useGraphAlgorithms: column.useGraphAlgorithms,
    needsTemporalModeling: column.needsTemporalModeling,
    dependsOnColumnId: column.dependsOnColumnId,
    relationshipTargetColumnId: column.relationshipTargetColumnId,
    isSensitiveData: column.isSensitiveData,
    requiresSecondaryIndex: column.requiresSecondaryIndex,
    connectsToMultipleVertexTypes: column.connectsToMultipleVertexTypes,
    dataRangeOrConstraint: column.dataRangeOrConstraint,
    modelingPriority: column.modelingPriority,
    guidance: column.guidance,
  }));

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggle(key: ColumnContextBooleanFlag) {
    setDraft((current) => ({ ...current, [key]: !current[key] }));
  }

  function save() {
    onSave(column.id, draft);
    onClose();
  }

  const relatedColumns = columns.filter((candidate) => candidate.id !== column.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-3xl rounded-xl border-2 border-slate-500 bg-white shadow-xl">
        <div className="border-b border-slate-400 px-5 py-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Edit Column Details: {column.name}
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_220px]">
            <p className="text-sm text-slate-600">
              Column: {column.name} ({column.dataType}) from {column.fileSource}
            </p>

            <select
              value={draft.assignedRole}
              onChange={(event) =>
                setField(
                  'assignedRole',
                  event.target.value as ColumnAssignedRole,
                )
              }
              className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
            >
              <option value="vertex">Vertex</option>
              <option value="edge">Edge</option>
              <option value="attribute">Attribute</option>
              <option value="edge-attribute">Edge Attribute</option>
              <option value="ignore">Ignore</option>
            </select>
          </div>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
          <Section
            title="Identification"
            description="Use these when the column represents a primary identity or a distinct real-world thing."
          >
            <Check
              label="Represents a real entity"
              checked={draft.isRealEntity}
              onChange={() => toggle('isRealEntity')}
            />
            <Check
              label="Is Unique Identifier (ID)"
              checked={draft.isIdentifier}
              onChange={() => toggle('isIdentifier')}
            />
          </Section>

          <Section
            title="Graph Usage"
            description="These help the system understand how queries will start, filter, and traverse around this field."
          >
            <Check
              label="Traversal Starting Point"
              checked={draft.isTraversalStartingPoint}
              onChange={() => toggle('isTraversalStartingPoint')}
            />
            <Check
              label="Common Filter / Sort Field"
              checked={draft.usedForFilteringOrSorting}
              onChange={() => toggle('usedForFilteringOrSorting')}
            />
            <Check
              label="Participates in Multi-Relationships"
              checked={draft.participatesInMultipleRelationships}
              onChange={() => toggle('participatesInMultipleRelationships')}
            />
          </Section>

          <Section
            title="Advanced Modeling"
            description="Use these when graph design trade-offs, scale, or analytical behavior matter."
          >
            <Check
              label="Potential Super Node"
              checked={draft.mayBecomeSuperNode}
              onChange={() => toggle('mayBecomeSuperNode')}
            />
            <Check
              label="Used in Graph Algorithms"
              checked={draft.useGraphAlgorithms}
              onChange={() => toggle('useGraphAlgorithms')}
            />
            <Check
              label="Temporal Modeling"
              checked={draft.needsTemporalModeling}
              onChange={() => toggle('needsTemporalModeling')}
            />
          </Section>

          <Section
            title="Relationships and Dependency"
            description="Use these when the meaning of this column depends on another column or when it should map to a related entity."
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">
                Depends on another column
              </label>
              <select
                value={draft.dependsOnColumnId ?? ''}
                onChange={(event) =>
                  setField('dependsOnColumnId', event.target.value || null)
                }
                className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
              >
                <option value="">None</option>
                {relatedColumns.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">
                Relationship-mapping target
              </label>
              <select
                value={draft.relationshipTargetColumnId ?? ''}
                onChange={(event) =>
                  setField(
                    'relationshipTargetColumnId',
                    event.target.value || null,
                  )
                }
                className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
              >
                <option value="">None</option>
                {relatedColumns.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          <Section
            title="Additional Guidance"
            description="Use these when indexing, privacy, or multi-entity connectivity may affect the final schema."
          >
            <Check
              label="Is sensitive data?"
              checked={draft.isSensitiveData}
              onChange={() => toggle('isSensitiveData')}
            />
            <Check
              label="Requires secondary index?"
              checked={draft.requiresSecondaryIndex}
              onChange={() => toggle('requiresSecondaryIndex')}
            />
            <Check
              label="Connects to multiple vertex types?"
              checked={draft.connectsToMultipleVertexTypes}
              onChange={() => toggle('connectsToMultipleVertexTypes')}
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">
                Data Range Constraint
              </label>
              <input
                value={draft.dataRangeOrConstraint}
                onChange={(event) =>
                  setField('dataRangeOrConstraint', event.target.value)
                }
                className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
                placeholder="e.g. positive decimal, IPv4, YYYY-MM-DD"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">
                Modeling Priority
              </label>
              <select
                value={draft.modelingPriority}
                onChange={(event) =>
                  setField(
                    'modelingPriority',
                    event.target.value as ColumnModelingPriority,
                  )
                }
                className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
              >
                <option value="balanced">Balanced</option>
                <option value="accuracy">Accuracy</option>
                <option value="performance">Performance</option>
                <option value="extensibility">Extensibility</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-900">
                Extra Notes
              </label>
              <textarea
                value={draft.guidance}
                onChange={(event) => setField('guidance', event.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-400 bg-white px-3 py-2"
                placeholder="Describe what this column means, how it should be modeled, or any ambiguity to keep in mind."
              />
            </div>
          </Section>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-300 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-400 bg-white px-4 py-2 font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            className="rounded-md border border-sky-700 bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-600"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-900">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
