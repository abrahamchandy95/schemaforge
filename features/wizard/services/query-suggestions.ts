import { normalizeKitId } from '@/features/wizard/model/kits';
import { queryCatalog } from '@/features/wizard/model/queries';
import type { KitId } from '@/features/wizard/model/types';

export function getSuggestedQueriesForSolutionKit(solutionKitId: KitId | null) {
  const kitId = normalizeKitId(solutionKitId);

  if (!kitId) {
    return [];
  }

  return queryCatalog.filter((query) => query.kitIds.includes(kitId));
}
