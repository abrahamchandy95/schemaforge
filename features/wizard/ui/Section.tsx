import type { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <section
      className={[
        'rounded-xl border border-slate-300 bg-white p-4',
        className ?? '',
      ].join(' ')}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <p className="text-lg font-bold uppercase tracking-tight text-slate-900">
              {title}
            </p>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}
