import type { Draft } from '@/lib/tigergraph/schema/types';
import type { AgentResult } from '@/lib/tigergraph/agent/types';
import { buildPromptInput } from '@/lib/tigergraph/prompt/build';
import type { WizardState } from '@/features/wizard/model/types';

type GenerateOk = {
  ok: true;
  model: string;
  result: AgentResult;
  draft: Draft;
  prompts: {
    system: string;
    user: string;
  };
};

type GenerateErr = {
  ok?: false;
  error?: string;
  issues?: string[];
  detail?: string;
  raw?: string;
};

export async function runAgent(state: WizardState) {
  const input = buildPromptInput(state);

  const response = await fetch('/api/wizard/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | GenerateOk
    | GenerateErr
    | null;

  if (!response.ok || !payload?.ok) {
    const parts = [
      payload?.error ?? 'Failed to generate schema draft.',
      payload?.issues?.length
        ? `Issues: ${payload.issues.join(' | ')}`
        : '',
      payload?.detail ?? '',
    ].filter(Boolean);

    throw new Error(parts.join(' '));
  }

  return payload;
}
