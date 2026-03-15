import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function Empty({ title, description, action }: Props) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6">
      <p className="text-lg font-semibold text-slate-900">{title}</p>

      {description && (
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
