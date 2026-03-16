'use client';

import { useMemo, useState } from 'react';
import { useColumns } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Dialog } from '@/features/wizard/steps/07-columns/Dialog';
import { Priorities } from '@/features/wizard/steps/07-columns/Priorities';
import { Table } from '@/features/wizard/steps/07-columns/Table';

export function Columns() {
  const { cols, priorities, updateCol, updatePriorities } = useColumns();
  const [openId, setOpenId] = useState<string | null>(null);

  const openCol = useMemo(
    () => cols.find((col) => col.id === openId) ?? null,
    [cols, openId],
  );

  return (
    <Frame
      stepLabel="STEP 7"
      title="Columns / Data Context"
      description="Review the column defaults derived from your confirmed mapping, then add any extra graph design guidance that the kit and file structure alone cannot express."
    >
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <Table
            columns={cols}
            onOpen={setOpenId}
            onRoleChange={(columnId, assignedRole) =>
              updateCol(columnId, { assignedRole })
            }
          />

          <Priorities value={priorities} onChange={updatePriorities} />
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
          These defaults are now seeded from the confirmed transaction-fraud
          mapping when available. Use this step to correct edge cases and add
          modeling details that still require human judgment.
        </div>
      </div>

      <Dialog
        open={openCol !== null}
        column={openCol}
        columns={cols}
        onClose={() => setOpenId(null)}
        onSave={updateCol}
      />
    </Frame>
  );
}
