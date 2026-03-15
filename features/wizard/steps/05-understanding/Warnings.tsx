import type { DataUnderstandingWarning } from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Props = {
  items: DataUnderstandingWarning[];
};

export function Warnings({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section title="Warnings">
      <div className="space-y-3">
        {items.map((warning) => (
          <div
            key={warning.id}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-900"
          >
            <span className="font-semibold">Warning:</span> {warning.message}
          </div>
        ))}
      </div>
    </Section>
  );
}
