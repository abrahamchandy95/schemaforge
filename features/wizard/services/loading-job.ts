import type { SolutionKitId } from '@/features/wizard/model/types';
import type { MappingSelection } from '@/lib/tigergraph/mapping/types';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';

type LoadingJobResponse = {
  schema: string;
  text: string;
  warnings: string[];
  supportedVertices: string[];
  supportedEdges: string[];
};

export async function renderLoadingJob({
  kit,
  files,
  selected,
}: {
  kit: SolutionKitId | null;
  files: ProfiledFile[];
  selected: MappingSelection[];
}): Promise<LoadingJobResponse> {
  const response = await fetch('/api/wizard/loading-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kit,
      files,
      selected,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? 'Failed to generate loading job preview.');
  }

  return (await response.json()) as LoadingJobResponse;
}
