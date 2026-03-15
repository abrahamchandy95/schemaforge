'use client';

import { useCase, useQueries } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Custom } from '@/features/wizard/steps/03-queries/Custom';
import { Suggestions } from '@/features/wizard/steps/03-queries/Suggestions';

export function Queries() {
  const { kit } = useCase();
  const { selectedIds, custom, draft, isAdding, toggle, start, cancel, setDraft, add, remove } =
    useQueries();

  return (
    <Frame
      stepLabel="STEP 3"
      title="Suggested Queries"
      description="Select, review, or add the queries you expect to run so the system can understand traversal starting points, expected outputs, and the types of relationships the schema must support."
    >
      <div className="space-y-5">
        <Suggestions selectedKitId={kit} selectedIds={selectedIds} onToggle={toggle} />

        <Custom
          customQueries={custom}
          draftText={draft}
          isAdding={isAdding}
          onStart={start}
          onCancel={cancel}
          onDraftChange={setDraft}
          onAdd={add}
          onRemove={remove}
        />
      </div>
    </Frame>
  );
}
