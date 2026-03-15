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
import type { SolutionKitId } from '@/features/wizard/model/types';

export type SolutionKitOption = {
  id: SolutionKitId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export const solutionKits: readonly SolutionKitOption[] = [
  {
    id: 'fraud-detection',
    title: 'Fraud Detection',
    subtitle: 'Patterns for identity, transaction, and network fraud',
    icon: ShieldAlert,
  },
  {
    id: 'customer-360',
    title: 'Customer 360',
    subtitle: 'A complete view of customer data and relationships',
    icon: Users,
  },
  {
    id: 'supply-chain-management',
    title: 'Supply Chain Management',
    subtitle: 'Optimize logistics, inventory, and supplier flows',
    icon: Truck,
  },
  {
    id: 'cybersecurity-threat-analysis',
    title: 'Cybersecurity Threat Analysis',
    subtitle: 'Trace attack vectors and analyze vulnerabilities',
    icon: Shield,
  },
  {
    id: 'it-ops-asset-management',
    title: 'IT Ops & Asset Management',
    subtitle: 'Monitor infrastructure performance and dependency mapping',
    icon: Server,
  },
  {
    id: 'entity-resolution',
    title: 'Entity Resolution',
    subtitle: 'Deduplicate data and create master entity profiles',
    icon: ScanSearch,
  },
  {
    id: 'financial-services-compliance',
    title: 'Financial Services Compliance',
    subtitle: 'Graph-based risk analysis and anti-money laundering reporting',
    icon: Landmark,
  },
  {
    id: 'product-recommendation',
    title: 'Product Recommendation',
    subtitle: 'Personalize offers based on user behavior and relationships',
    icon: Sparkles,
  },
  {
    id: 'other',
    title: 'Other (Custom Use Case)',
    subtitle: 'None of the existing kits fit my specific needs',
    icon: Settings2,
  },
];
