import type { SolutionKitId } from '@/features/wizard/model/types';

export function inferSolutionKitFromGoal(
  goalText: string,
): SolutionKitId | null {
  const normalizedGoal = goalText.trim().toLowerCase();

  if (!normalizedGoal) {
    return null;
  }

  if (
    includesAny(normalizedGoal, [
      'fraud',
      'scam',
      'money laundering',
      'aml',
      'suspicious transaction',
      'transaction fraud',
      'identity fraud',
      'account takeover',
      'ring detection',
    ])
  ) {
    return 'fraud-detection';
  }

  if (
    includesAny(normalizedGoal, [
      'customer 360',
      'customer 360 view',
      'single customer view',
      'customer profile',
      'customer journey',
      'crm',
      'customer relationship',
    ])
  ) {
    return 'customer-360';
  }

  if (
    includesAny(normalizedGoal, [
      'supply chain',
      'supplier',
      'inventory',
      'shipment',
      'logistics',
      'warehouse',
      'procurement',
      'distribution',
    ])
  ) {
    return 'supply-chain-management';
  }

  if (
    includesAny(normalizedGoal, [
      'cybersecurity',
      'cyber',
      'threat',
      'attack path',
      'vulnerability',
      'incident',
      'malware',
      'breach',
      'security event',
    ])
  ) {
    return 'cybersecurity-threat-analysis';
  }

  if (
    includesAny(normalizedGoal, [
      'it ops',
      'asset management',
      'infrastructure',
      'server dependency',
      'service dependency',
      'configuration item',
      'observability',
      'operations',
    ])
  ) {
    return 'it-ops-asset-management';
  }

  if (
    includesAny(normalizedGoal, [
      'entity resolution',
      'deduplicate',
      'deduplication',
      'master data',
      'golden record',
      'merge duplicate',
      'identity resolution',
    ])
  ) {
    return 'entity-resolution';
  }

  if (
    includesAny(normalizedGoal, [
      'compliance',
      'regulatory',
      'kyc',
      'risk monitoring',
      'financial crime',
      'sanctions',
      'audit',
    ])
  ) {
    return 'financial-services-compliance';
  }

  if (
    includesAny(normalizedGoal, [
      'recommendation',
      'recommend',
      'personalization',
      'personalize',
      'product suggestion',
      'next best product',
      'cross-sell',
      'upsell',
    ])
  ) {
    return 'product-recommendation';
  }

  return null;
}

function includesAny(text: string, keywords: readonly string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
