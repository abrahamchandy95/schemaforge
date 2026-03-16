'use client';

import { Goal } from '@/features/wizard/steps/01-goal';
import { UseCase } from '@/features/wizard/steps/02-use-case';
import { Queries } from '@/features/wizard/steps/03-queries';
import { Upload } from '@/features/wizard/steps/04-upload';
import { Understanding } from '@/features/wizard/steps/05-understanding';
import { Mapping } from '@/features/wizard/steps/06-mapping';
import { Columns } from '@/features/wizard/steps/07-columns';
import { Recommendation } from '@/features/wizard/steps/08-recommendation';
import { Review } from '@/features/wizard/steps/09-review';
import { Final } from '@/features/wizard/steps/10-final';
import { useNav } from '@/features/wizard/provider';

const stepView = {
  goal: Goal,
  'use-case': UseCase,
  queries: Queries,
  upload: Upload,
  understanding: Understanding,
  mapping: Mapping,
  columns: Columns,
  recommendation: Recommendation,
  review: Review,
  final: Final,
} as const;

export function Router() {
  const { item } = useNav();
  const View = stepView[item.id];

  if (!View) {
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

  return <View />;
}
