import type { ReactNode } from 'react';
import { Header } from '@/features/wizard/layout/Header';

type Props = {
  stepLabel: string;
  title: string;
  description: string;
  helpHref?: string;
  helpLabel?: string;
  children: ReactNode;
};

export function Frame({
  stepLabel,
  title,
  description,
  helpHref,
  helpLabel,
  children,
}: Props) {
  return (
    <div className="space-y-5 rounded-xl border border-slate-300 bg-slate-100 p-6">
      <Header
        stepLabel={stepLabel}
        title={title}
        description={description}
        helpHref={helpHref}
        helpLabel={helpLabel}
      />

      {children}
    </div>
  );
}
