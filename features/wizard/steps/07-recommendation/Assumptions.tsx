import { Empty, Section } from '@/features/wizard/ui';

type Props = {
  items: string[];
};

export function Assumptions({ items }: Props) {
  return (
    <Section title="Assumptions and Confidence Notes">
      {items.length === 0 ? (
        <Empty
          title="No major assumptions were recorded."
          description="This draft did not include additional confidence notes."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
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
  );
}
