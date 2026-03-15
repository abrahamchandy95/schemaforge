import type { SchemaGenerationMode } from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Props = {
  goal: string;
  mode: SchemaGenerationMode;
  onGoalChange: (value: string) => void;
  onModeChange: (value: SchemaGenerationMode) => void;
};

export function Form({
  goal,
  mode,
  onGoalChange,
  onModeChange,
}: Props) {
  return (
    <div className="space-y-5">
      <Section title="Describe Your Goal (Text Prompt)">
        <div className="space-y-3">
          <textarea
            value={goal}
            onChange={(event) => onGoalChange(event.target.value)}
            rows={6}
            className="w-full rounded-lg border-2 border-slate-500 bg-white px-4 py-3 text-lg leading-7 text-slate-900 outline-none transition focus:border-sky-600"
            placeholder={[
              'Explain what you want to achieve with this data...',
              'What kind of schema or graph do you want to build? (e.g., fraud network, customer view)...',
              'What key queries do you expect to run? (e.g., recommend products, find connections)...',
              'What does your dataset contain? (e.g., users, transactions, logs).',
            ].join('\n')}
          />

          <p className="text-sm text-slate-600">
            This text will pre-fill suggestions and tailor choices in later
            steps.
          </p>
        </div>
      </Section>

      <Section title="Select Your Generation Type">
        <div className="grid gap-3 md:grid-cols-2">
          <ModeCard
            title="Basic Schema Generation"
            description="Automated, recommended default choices."
            active={mode === 'basic'}
            onClick={() => onModeChange('basic')}
          />

          <ModeCard
            title="Advanced Schema Generation"
            description="Full control, guide the AI step-by-step."
            active={mode === 'advanced'}
            onClick={() => onModeChange('advanced')}
          />
        </div>
      </Section>
    </div>
  );
}

function ModeCard({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl border px-5 py-5 text-left transition',
        active
          ? 'border-sky-500 bg-sky-50 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.25)]'
          : 'border-slate-400 bg-white hover:border-slate-500',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-500">
          <span className="text-lg">◫</span>
        </div>

        <div className="space-y-1">
          <p className="text-xl font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
