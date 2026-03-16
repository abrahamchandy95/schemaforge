type Props = {
  title: string;
  value: string | number;
  note?: string;
  subtitle?: string;
};

export function SummaryCard({ title, value, note, subtitle }: Props) {
  const text = note ?? subtitle;

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

      {text && <p className="mt-2 text-sm text-slate-600">{text}</p>}
    </div>
  );
}
