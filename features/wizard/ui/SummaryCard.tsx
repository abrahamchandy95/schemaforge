type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function SummaryCard({ title, value, subtitle }: Props) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      )}
    </div>
  );
}
