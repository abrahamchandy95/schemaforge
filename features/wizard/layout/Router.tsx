'use client';

import { useNav } from '@/features/wizard/provider';
import { Goal } from '@/features/wizard/steps/01-goal';
import { UseCase } from '@/features/wizard/steps/02-use-case';
import { Queries } from '@/features/wizard/steps/03-queries';
import { Upload } from '@/features/wizard/steps/04-upload';
import { Understanding } from '@/features/wizard/steps/05-understanding';
import { Columns } from '@/features/wizard/steps/06-columns';
import { Recommendation } from '@/features/wizard/steps/07-recommendation';
import { Review } from '@/features/wizard/steps/08-review';
import { Final } from '@/features/wizard/steps/09-final';

export function Router() {
  const { item } = useNav();

  switch (item.id) {
    case 'goal':
      return <Goal />;

    case 'use-case':
      return <UseCase />;

    case 'queries':
      return <Queries />;

    case 'upload':
      return <Upload />;

    case 'understanding':
      return <Understanding />;

    case 'columns':
      return <Columns />;

    case 'recommendation':
      return <Recommendation />;

    case 'review':
      return <Review />;

    case 'final':
      return <Final />;

    default:
      return (
        <div className="rounded-xl border border-slate-300 bg-white p-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {item.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            This step is not built yet.
          </p>
        </div>
      );
  }
}
