import type { SchemaDraft } from '@/features/wizard/model/types';
import { Section, SummaryCard } from '@/features/wizard/ui';

type Props = {
  draft: SchemaDraft;
  onRegenerate: () => void;
};

export function Summary({ draft, onRegenerate }: Props) {
  return (
    <div className="space-y-5">
      <Section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-slate-900">{draft.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {draft.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onRegenerate}
            className="shrink-0 rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Regenerate Draft
          </button>
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryCard title="Vertices" value={draft.vertices.length} />
        <SummaryCard title="Edges" value={draft.edges.length} />
        <SummaryCard title="Attributes" value={draft.attributes.length} />
      </div>
    </div>
  );
}
