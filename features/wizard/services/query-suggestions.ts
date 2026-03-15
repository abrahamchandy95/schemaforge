import { queryCatalog } from '@/features/wizard/model/queries';
import type { SolutionKitId } from '@/features/wizard/model/types';

export function getSuggestedQueriesForSolutionKit(
  solutionKitId: SolutionKitId | null,
) {
  if (!solutionKitId) {
    return [];
  }

  return queryCatalog.filter((query) =>
    query.solutionKitIds.includes(solutionKitId),
  );
}
