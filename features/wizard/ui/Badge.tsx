import type { ReactNode } from 'react';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type Props = {
  children: ReactNode;
  tone?: Tone;
};

export function Badge({ children, tone = 'neutral' }: Props) {
  const toneClass =
    tone === 'info'
      ? 'border-sky-300 bg-sky-100 text-sky-900'
      : tone === 'success'
        ? 'border-green-300 bg-green-100 text-green-900'
        : tone === 'warning'
          ? 'border-amber-300 bg-amber-100 text-amber-900'
          : tone === 'danger'
            ? 'border-red-300 bg-red-100 text-red-900'
            : 'border-slate-300 bg-slate-100 text-slate-800';

  return (
    <span
      className={[
        'inline-flex rounded-md border px-2 py-1 text-xs font-medium',
        toneClass,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
