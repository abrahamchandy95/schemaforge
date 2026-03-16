import { Section, Empty } from '@/features/wizard/ui';

type Props = {
  items: string[];
};

export function Warnings({ items }: Props) {
  return (
    <Section title="Warnings">
      {items.length === 0 ? (
        <Empty
          title="No warnings"
          description="No profiling or mapping issues were detected so far."
        />
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
  );
}
