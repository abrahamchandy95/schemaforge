import type { CurrentKitId } from '@/features/wizard/model/types';

export type QueryDef = {
  id: string;
  label: string;
  kitIds: CurrentKitId[];
};

export type QueryTemplate = QueryDef;

const allKits: CurrentKitId[] = [
  'network_infrastructure',
  'supply_chain_management',
  'customer_360',
  'entity_resolution',
  'product_recommendations',
  'application_fraud',
  'entity_resolution_kyc',
  'mule_account_detection',
  'transaction_fraud',
  'custom',
];

export const queryCatalog: readonly QueryDef[] = [
  {
    id: 'fraud-ring-flow',
    label:
      'Find circular or layered money movement patterns (start: account or transaction, output: suspicious path or ring)',
    kitIds: [
      'transaction_fraud',
      'application_fraud',
      'mule_account_detection',
    ],
  },
  {
    id: 'shared-identity-links',
    label:
      'Find shared devices, emails, phones, or addresses between entities (start: person or account, output: linked entity graph)',
    kitIds: [
      'transaction_fraud',
      'application_fraud',
      'mule_account_detection',
      'entity_resolution',
      'entity_resolution_kyc',
    ],
  },
  {
    id: 'entity-merge-candidates',
    label:
      'Find likely duplicate entities that should resolve to the same profile (start: entity record, output: merge candidates)',
    kitIds: ['entity_resolution', 'entity_resolution_kyc', 'customer_360'],
  },
  {
    id: 'customer-neighborhood',
    label:
      'Explore a customer neighborhood across accounts, products, and interactions (start: customer ID, output: connected customer view)',
    kitIds: ['customer_360', 'product_recommendations', 'custom'],
  },
  {
    id: 'supply-risk-paths',
    label:
      'Trace supply or dependency paths across sites, vendors, and shipments (start: site or supplier, output: impacted path)',
    kitIds: ['supply_chain_management', 'custom'],
  },
  {
    id: 'infra-impact-analysis',
    label:
      'Find service dependency and blast radius paths (start: asset or service, output: impacted downstream graph)',
    kitIds: ['network_infrastructure', 'custom'],
  },
  {
    id: 'generic-all-paths',
    label:
      'Detect all paths between two entities (start: entity A, end: entity B, output: paths)',
    kitIds: allKits,
  },
  {
    id: 'generic-centrality',
    label:
      'Calculate centrality scores for a node type (start: node type, output: centrality values)',
    kitIds: allKits,
  },
];
