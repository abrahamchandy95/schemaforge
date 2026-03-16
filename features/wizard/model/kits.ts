import type { LucideIcon } from 'lucide-react';
import {
  Landmark,
  ScanSearch,
  Server,
  Settings2,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';
import type {
  CurrentKitId,
  KitId,
  LegacyKitId,
} from '@/features/wizard/model/types';

export type KitOption = {
  id: CurrentKitId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export type SolutionKitOption = KitOption;

export const kitOptions: readonly KitOption[] = [
  {
    id: 'transaction_fraud',
    title: 'Transaction Fraud',
    subtitle: 'Payments, parties, merchants, cards, devices, and fraud rings',
    icon: ShieldAlert,
  },
  {
    id: 'application_fraud',
    title: 'Application Fraud',
    subtitle: 'Application journeys, synthetic identities, and risky link analysis',
    icon: Shield,
  },
  {
    id: 'mule_account_detection',
    title: 'Mule Account Detection',
    subtitle: 'Identify accounts used to move or layer suspicious funds',
    icon: Landmark,
  },
  {
    id: 'entity_resolution',
    title: 'Entity Resolution',
    subtitle: 'Resolve duplicates and unify records into shared entities',
    icon: ScanSearch,
  },
  {
    id: 'entity_resolution_kyc',
    title: 'Entity Resolution / KYC',
    subtitle: 'Resolve identities for onboarding, compliance, and due diligence',
    icon: Users,
  },
  {
    id: 'customer_360',
    title: 'Customer 360',
    subtitle: 'Build a connected customer view across products and touchpoints',
    icon: Users,
  },
  {
    id: 'product_recommendations',
    title: 'Product Recommendations',
    subtitle: 'Model people, products, and behavior for personalization',
    icon: Sparkles,
  },
  {
    id: 'supply_chain_management',
    title: 'Supply Chain Management',
    subtitle: 'Track suppliers, shipments, sites, and operational dependencies',
    icon: Truck,
  },
  {
    id: 'network_infrastructure',
    title: 'Network Infrastructure',
    subtitle: 'Model assets, services, dependencies, and impact paths',
    icon: Server,
  },
  {
    id: 'custom',
    title: 'Custom Use Case',
    subtitle: 'Use your own entities, relationships, and query goals',
    icon: Settings2,
  },
] satisfies readonly KitOption[];

export const solutionKits = kitOptions;

const legacyToCurrent: Record<LegacyKitId, CurrentKitId> = {
  'transaction-fraud': 'transaction_fraud',
  'customer-360': 'customer_360',
  'supply-chain-management': 'supply_chain_management',
  'cybersecurity-threat-analysis': 'network_infrastructure',
  'it-ops-asset-management': 'network_infrastructure',
  'entity-resolution': 'entity_resolution',
  'financial-services-compliance': 'entity_resolution_kyc',
  'product-recommendation': 'product_recommendations',
  other: 'custom',
};

export function normalizeKitId(id: KitId | null): CurrentKitId | null {
  if (!id) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(legacyToCurrent, id)) {
    return legacyToCurrent[id as LegacyKitId];
  }

  return id as CurrentKitId;
}

export function isTxKit(id: KitId | null) {
  return normalizeKitId(id) === 'transaction_fraud';
}

export function isCustomKit(id: KitId | null) {
  return normalizeKitId(id) === 'custom';
}
