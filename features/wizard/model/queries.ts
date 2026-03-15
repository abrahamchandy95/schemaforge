import type { SolutionKitId } from '@/features/wizard/model/types';

export type QueryTemplate = {
  id: string;
  label: string;
  solutionKitIds: SolutionKitId[];
};

export const queryCatalog: readonly QueryTemplate[] = [
  {
    id: 'fraud-circular-money-transfer',
    label:
      'Find circular money transfer patterns (Start: Account, Output: Transfer Loop)',
    solutionKitIds: ['fraud-detection', 'financial-services-compliance'],
  },
  {
    id: 'fraud-high-risk-clusters',
    label:
      'Identify high-risk transaction clusters (Start: Transaction, Output: Cluster IDs)',
    solutionKitIds: ['fraud-detection', 'financial-services-compliance'],
  },
  {
    id: 'fraud-shared-device-usage',
    label:
      'Analyze shared device usage between entities (Start: Entity ID, Output: Device Usage Graph)',
    solutionKitIds: ['fraud-detection', 'entity-resolution'],
  },
  {
    id: 'generic-all-paths',
    label:
      'Detect all paths between two specific entities (Start: Entity A, End: Entity B, Output: Paths)',
    solutionKitIds: [
      'fraud-detection',
      'customer-360',
      'cybersecurity-threat-analysis',
      'entity-resolution',
      'other',
    ],
  },
  {
    id: 'generic-centrality',
    label:
      'Calculate centrality scores for a specific node type (Start: Node Type, Output: Centrality Values)',
    solutionKitIds: [
      'fraud-detection',
      'customer-360',
      'supply-chain-management',
      'cybersecurity-threat-analysis',
      'it-ops-asset-management',
      'entity-resolution',
      'financial-services-compliance',
      'product-recommendation',
      'other',
    ],
  },
];
