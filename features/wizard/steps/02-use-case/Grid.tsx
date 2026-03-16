import { isCustomKit, solutionKits } from '@/features/wizard/model/kits';
import type { SolutionKitId } from '@/features/wizard/model/types';
import { Section } from '@/features/wizard/ui';
import { Card } from '@/features/wizard/steps/02-use-case/Card';

type Props = {
  selectedKitId: SolutionKitId | null;
  inferredKitId: SolutionKitId | null;
  customUseCaseText: string;
  onSelectKit: (value: SolutionKitId) => void;
  onCustomUseCaseChange: (value: string) => void;
};

export function Grid({
  selectedKitId,
  inferredKitId,
  customUseCaseText,
  onSelectKit,
  onCustomUseCaseChange,
}: Props) {
  return (
    <div className="space-y-5">
      <Section>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Choose the solution kit that best matches the graph you want to
            build. If none fit, select{' '}
            <span className="font-semibold">Custom Use Case</span> and describe
            your goal manually.
          </p>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {solutionKits.map((kit) => (
              <Card
                key={kit.id}
                kit={kit}
                selected={selectedKitId === kit.id}
                inferred={inferredKitId === kit.id}
                onSelect={() => onSelectKit(kit.id)}
              />
            ))}
          </div>
        </div>
      </Section>

      {isCustomKit(selectedKitId) && (
        <Section title="Describe Your Custom Use Case">
          <textarea
            value={customUseCaseText}
            onChange={(event) => onCustomUseCaseChange(event.target.value)}
            rows={4}
            className="w-full rounded-lg border-2 border-slate-500 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-sky-600"
            placeholder="Specify the entities, relationships, and query goals you expect to support..."
          />

          <p className="mt-2 text-sm text-slate-600">
            This will drive later schema and query suggestions when no packaged
            TigerGraph kit is the right fit.
          </p>
        </Section>
      )}
    </div>
  );
}
