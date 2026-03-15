import type { SolutionKitOption } from '@/features/wizard/model/kits';
import { Badge } from '@/features/wizard/ui';

type Props = {
  kit: SolutionKitOption;
  selected: boolean;
  inferred: boolean;
  onSelect: () => void;
};

export function Card({ kit, selected, inferred, onSelect }: Props) {
  const Icon = kit.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        'rounded-xl border-2 bg-white p-4 text-left transition',
        selected
          ? 'border-sky-600 shadow-[inset_0_0_0_1px_rgba(2,132,199,0.2)]'
          : 'border-slate-400 hover:border-slate-500',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-600">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg font-semibold leading-6 text-slate-900">
              {kit.title}
            </p>

            {selected && <Badge tone="info">Selected</Badge>}
          </div>

          {inferred && (
            <p className="mt-1 text-xs font-medium text-sky-700">
              Suggested from step 1
            </p>
          )}

          <p className="mt-2 text-sm leading-5 text-slate-600">
            {kit.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}
