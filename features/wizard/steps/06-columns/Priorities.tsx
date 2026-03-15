import type {
  ColumnContextGlobalPriorities,
  ColumnContextGlobalPrioritiesPatch,
} from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Props = {
  value: ColumnContextGlobalPriorities;
  onChange: (value: ColumnContextGlobalPrioritiesPatch) => void;
};

export function Priorities({ value, onChange }: Props) {
  return (
    <Section title="Global Graph Design Priorities">
      <Group title="Simplicity vs Flexibility">
        <Radio
          name="simplicity"
          label="Prefer Simplicity"
          checked={value.simplicityVsFlexibility === 'simplicity'}
          onChange={() => onChange({ simplicityVsFlexibility: 'simplicity' })}
        />
        <Radio
          name="simplicity"
          label="Guided Balance"
          checked={value.simplicityVsFlexibility === 'balance'}
          onChange={() => onChange({ simplicityVsFlexibility: 'balance' })}
        />
        <Radio
          name="simplicity"
          label="Future Flexibility"
          checked={value.simplicityVsFlexibility === 'flexibility'}
          onChange={() => onChange({ simplicityVsFlexibility: 'flexibility' })}
        />
      </Group>

      <Group title="Temporal Modeling required overall?">
        <Radio
          name="temporal"
          label="Yes"
          checked={value.temporalModeling === 'yes'}
          onChange={() => onChange({ temporalModeling: 'yes' })}
        />
        <Radio
          name="temporal"
          label="No"
          checked={value.temporalModeling === 'no'}
          onChange={() => onChange({ temporalModeling: 'no' })}
        />
        <Radio
          name="temporal"
          label="Partial"
          checked={value.temporalModeling === 'partial'}
          onChange={() => onChange({ temporalModeling: 'partial' })}
        />
      </Group>

      <Group title="Performance vs Extensibility">
        <Radio
          name="performance"
          label="Max Performance"
          checked={value.performanceVsExtensibility === 'performance'}
          onChange={() =>
            onChange({ performanceVsExtensibility: 'performance' })
          }
        />
        <Radio
          name="performance"
          label="Optimization Trade-off"
          checked={value.performanceVsExtensibility === 'balance'}
          onChange={() => onChange({ performanceVsExtensibility: 'balance' })}
        />
        <Radio
          name="performance"
          label="Future Extensibility"
          checked={value.performanceVsExtensibility === 'extensibility'}
          onChange={() =>
            onChange({ performanceVsExtensibility: 'extensibility' })
          }
        />
      </Group>
    </Section>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-2 font-semibold text-slate-900">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-900">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
