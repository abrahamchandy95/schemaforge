import type { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Table({ title, description, children }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border-2 border-slate-500 bg-white">
      {(title || description) && (
        <div className="border-b border-slate-500 bg-slate-200 px-4 py-2">
          {title && (
            <p className="text-lg font-bold text-slate-900">{title}</p>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-700">{description}</p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}
