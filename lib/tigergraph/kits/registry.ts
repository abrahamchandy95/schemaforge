import 'server-only';

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { SolutionKitId } from '@/features/wizard/model/types';
import { transactionFraudKit } from '@/lib/tigergraph/kits/transaction-fraud/meta';
import type { KitMeta } from '@/lib/tigergraph/kits/types';

const kitById: Partial<Record<SolutionKitId, KitMeta>> = {
  transaction_fraud: transactionFraudKit,
  'transaction-fraud': transactionFraudKit,
};

export function getKit(solutionKitId: SolutionKitId | null) {
  if (!solutionKitId) {
    return null;
  }

  return kitById[solutionKitId] ?? null;
}

export async function getKitAssets(solutionKitId: SolutionKitId | null) {
  const kit = getKit(solutionKitId);

  if (!kit) {
    return null;
  }

  const base = join(process.cwd(), 'lib', 'tigergraph', 'kits', kit.key);

  const [schemaText, loadingJobText] = await Promise.all([
    readFile(join(base, 'schema.gsql'), 'utf8'),
    readFile(join(base, 'loading-job.gsql'), 'utf8'),
  ]);

  return {
    meta: kit,
    schemaText,
    loadingJobText,
  };
}
