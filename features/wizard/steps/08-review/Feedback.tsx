import { Empty, Section } from '@/features/wizard/ui';

type Props = {
  draftText: string;
  history: string[];
  onDraftChange: (value: string) => void;
  onApply: () => void;
};

export function Feedback({
  draftText,
  history,
  onDraftChange,
  onApply,
}: Props) {
  return (
    <div className="space-y-5">
      <Section title="Natural Language Feedback">
        <textarea
          value={draftText}
          onChange={(event) => onDraftChange(event.target.value)}
          rows={8}
          className="w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm leading-6 text-slate-900"
          placeholder={`Examples:
- Rename Account to Customer
- Make Device a vertex
- Keep the schema simpler
- Treat city as an attribute`}
        />

        <button
          type="button"
          onClick={onApply}
          className="mt-4 rounded-xl border border-sky-700 bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
        >
          Apply Feedback
        </button>
      </Section>

      <Section title="Feedback History">
        {history.length === 0 ? (
          <Empty
            title="No review feedback applied yet."
            description="Apply natural language feedback to track your review history here."
          />
        ) : (
          <ul className="space-y-3">
            {history.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
