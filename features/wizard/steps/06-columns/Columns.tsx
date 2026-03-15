'use client';

import { useMemo, useState } from 'react';
import { useColumns } from '@/features/wizard/provider';
import { Frame, Section } from '@/features/wizard/ui';
import { Dialog } from '@/features/wizard/steps/06-columns/Dialog';
import { Priorities } from '@/features/wizard/steps/06-columns/Priorities';
import { Table } from '@/features/wizard/steps/06-columns/Table';

export function Columns() {
  const { cols, priorities, updateCol, updatePriorities } = useColumns();
  const [openId, setOpenId] = useState<string | null>(null);

  const openColumn = useMemo(
    () => cols.find((column) => column.id === openId) ?? null,
    [cols, openId],
  );

  return (
    <Frame
      stepLabel="STEP 6"
      title="Columns / Data Context"
      description="Define more graph context that columns or source data alone cannot reveal. This guidance helps the AI decide how each column should be modeled and what broader graph design priorities should shape the schema."
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

        <Section className="bg-slate-100">
          <p className="text-sm text-slate-700">
            These options are based on the schema design checklist and may
            evolve as that checklist is refined. This step captures the extra
            modeling decisions that cannot be reliably inferred from the file
            alone.
          </p>
        </Section>
      </div>

      <Dialog
        open={openColumn !== null}
        column={openColumn}
        columns={cols}
        onClose={() => setOpenId(null)}
        onSave={updateCol}
      />
    </Frame>
  );
}
