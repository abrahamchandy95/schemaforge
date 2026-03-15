import type { WizardStep } from '@/features/wizard/model/types';

type Props = {
  items: readonly WizardStep[];
  activeIndex: number;
  onSelect?: (index: number) => void;
};

export function Sidebar({ items, activeIndex, onSelect }: Props) {
  return (
    <aside className="border-r border-slate-300 bg-slate-100 px-5 py-6">
      <ol className="space-y-1">
        {items.map((item, index) => {
          const active = index === activeIndex;
          const complete = index < activeIndex;
          const last = index === items.length - 1;

          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => onSelect?.(index)}
                className="flex w-full items-start gap-3 rounded-md px-1 py-2 text-left"
              >
                <div className="relative flex w-6 shrink-0 justify-center">
                  {!last && (
                    <span className="absolute top-6 h-12 w-px bg-slate-400" />
                  )}

                  <span
                    className={[
                      'mt-0.5 block h-5 w-5 rounded-full border-2',
                      active
                        ? 'border-sky-600 bg-sky-400'
                        : complete
                          ? 'border-slate-700 bg-slate-700'
                          : 'border-slate-500 bg-white',
                    ].join(' ')}
                  />
                </div>

                <span
                  className={[
                    'text-sm leading-5',
                    active ? 'font-semibold text-slate-900' : 'text-slate-700',
                  ].join(' ')}
                >
                  {index + 1}. {item.title.toUpperCase()}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
