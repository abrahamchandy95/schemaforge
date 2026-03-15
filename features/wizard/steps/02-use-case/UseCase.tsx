'use client';

import { useCase } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Grid } from '@/features/wizard/steps/02-use-case/Grid';

export function UseCase() {
  const { kit, inferredKit, customUseCase, selectKit, setCustomUseCase } =
    useCase();

  return (
    <Frame
      stepLabel="STEP 2"
      title="Use Case / Solution Kit Selection"
      description="Select a pre-defined solution kit that matches your expected graph pattern and query needs, or describe a custom one. This helps tailor the graph design and suggested queries."
    >
      <Grid
        selectedKitId={kit}
        inferredKitId={inferredKit}
        customUseCaseText={customUseCase}
        onSelectKit={selectKit}
        onCustomUseCaseChange={setCustomUseCase}
      />
    </Frame>
  );
}
