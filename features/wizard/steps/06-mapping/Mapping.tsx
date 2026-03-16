'use client';

import { useState } from 'react';
import { isTxKit } from '@/features/wizard/model/kits';
import { useCase, useMapping } from '@/features/wizard/provider';
import { Frame, Empty, Section } from '@/features/wizard/ui';
import { renderLoadingJob } from '@/features/wizard/services/loading-job';
import { Table } from '@/features/wizard/steps/06-mapping/Table';
import { Preview } from '@/features/wizard/steps/06-mapping/Preview';

export function Mapping() {
  const { kit } = useCase();
  const {
    profile,
    selected,
    schema,
    preview,
    warnings,
    supportedVertices,
    supportedEdges,
    confirmed,
    previewDirty,
    setTarget,
    clearTarget,
    setPreview,
    setConfirmed,
  } = useMapping();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    if (!profile || !isTxKit(kit)) {
      return;
    }

    setBusy(true);
    setErr(null);

    try {
      const next = await renderLoadingJob({
        kit,
        files: profile.files,
        selected,
      });

      setPreview({
        schema: next.schema,
        preview: next.text,
        warnings: next.warnings,
        supportedVertices: next.supportedVertices,
        supportedEdges: next.supportedEdges,
      });
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : 'Failed to generate loading job preview.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!profile) {
    return (
      <Frame
        stepLabel="STEP 6"
        title="Column Mapping"
        description="Map uploaded columns to kit fields and confirm the generated loading job preview."
      >
        <Empty
          title="No profile yet"
          description="Go back and run profiling first."
        />
      </Frame>
    );
  }

  if (!isTxKit(kit) || !profile.mapping) {
    return (
      <Frame
        stepLabel="STEP 6"
        title="Column Mapping"
        description="Map uploaded columns to kit fields and confirm the generated loading job preview."
      >
        <Empty
          title="No dedicated mapping for this kit yet"
          description="This step is currently specialized for transaction fraud. Other kits can continue without explicit field mapping for now."
        />
      </Frame>
    );
  }

  const items = Array.from(new Set([...profile.mapping.warnings, ...warnings]));

  return (
    <Frame
      stepLabel="STEP 6"
      title="Column Mapping"
      description="Review suggested field mappings, edit them as needed, refresh the loading job preview, and confirm the result."
    >
      <div className="space-y-5">
        {err && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <Table
          profile={profile}
          selected={selected}
          confirmed={confirmed}
          previewDirty={previewDirty}
          busy={busy}
          onSet={(value) => {
            setConfirmed(false);
            setTarget(value);
          }}
          onClear={(fileName, columnName) => {
            setConfirmed(false);
            clearTarget(fileName, columnName);
          }}
          onRefresh={refresh}
          onConfirm={setConfirmed}
        />

        <Preview
          schema={schema}
          job={preview}
          verts={supportedVertices}
          edges={supportedEdges}
        />

        <Section title="Warnings">
          {items.length === 0 ? (
            <p className="text-sm text-slate-600">
              No mapping warnings right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-900"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </Frame>
  );
}
