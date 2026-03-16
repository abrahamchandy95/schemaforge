import { buildPromptInput } from '@/lib/tigergraph/prompt/build';
import type { WizardState } from '@/features/wizard/model/types';

export async function runPromptDebug(state: WizardState) {
  const input = buildPromptInput(state);

  const response = await fetch('/api/wizard/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to run prompt debug route.');
  }

  return response.json();
}
