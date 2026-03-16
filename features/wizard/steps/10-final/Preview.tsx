import type { FinalSchemaArtifact } from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';

type Props = {
  artifact: FinalSchemaArtifact;
};

export function Preview({ artifact }: Props) {
  return (
    <div className="space-y-5">
      <Section title="Final Schema Preview">
        <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
          {artifact.schemaText}
        </pre>
      </Section>

      <Section title="Loading Job Preview">
        <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
          {artifact.loadingJobText}
        </pre>
      </Section>
    </div>
  );
}
