'use client';

import { useGoal } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Form } from '@/features/wizard/steps/01-goal/Form';

export function Goal() {
  const { goal, mode, setGoal, setMode } = useGoal();

  return (
    <Frame
      stepLabel="STEP 1"
      title="Goal / Prompt / Use"
      description="Describe your business objective. The AI will use your input to suggest the best use cases and schema choices."
    >
      <Form
        goal={goal}
        mode={mode}
        onGoalChange={setGoal}
        onModeChange={setMode}
      />
    </Frame>
  );
}
