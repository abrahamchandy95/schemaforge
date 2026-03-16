import type { CurrentKitId } from '@/features/wizard/model/types';

export function inferSolutionKitFromGoal(
  goalText: string,
): CurrentKitId | null {
  const goal = goalText.trim().toLowerCase();

  if (!goal) {
    return null;
  }

  if (
    includesAny(goal, [
      'mule account',
      'money mule',
      'mule detection',
      'layered transfers through accounts',
    ])
  ) {
    return 'mule_account_detection';
  }

  if (
    includesAny(goal, [
      'application fraud',
      'synthetic identity',
      'loan fraud',
      'account opening fraud',
      'onboarding fraud',
      'new account fraud',
    ])
  ) {
    return 'application_fraud';
  }

  if (
    includesAny(goal, [
      'transaction fraud',
      'payment fraud',
      'fraud ring',
      'money laundering',
      'aml',
      'suspicious transaction',
      'chargeback fraud',
      'account takeover',
      'shared device fraud',
    ])
  ) {
    return 'transaction_fraud';
  }

  if (
    includesAny(goal, [
      'kyc',
      'know your customer',
      'customer due diligence',
      'identity verification',
      'compliance onboarding',
      'sanctions screening',
    ])
  ) {
    return 'entity_resolution_kyc';
  }

  if (
    includesAny(goal, [
      'entity resolution',
      'identity resolution',
      'deduplicate',
      'deduplication',
      'golden record',
      'master data',
      'merge duplicate',
    ])
  ) {
    return 'entity_resolution';
  }

  if (
    includesAny(goal, [
      'customer 360',
      'single customer view',
      'customer profile',
      'customer journey',
      'crm',
      'householding',
    ])
  ) {
    return 'customer_360';
  }

  if (
    includesAny(goal, [
      'recommendation',
      'recommend',
      'personalization',
      'next best action',
      'next best product',
      'cross-sell',
      'upsell',
    ])
  ) {
    return 'product_recommendations';
  }

  if (
    includesAny(goal, [
      'supply chain',
      'supplier',
      'inventory',
      'shipment',
      'warehouse',
      'logistics',
      'procurement',
      'distribution',
    ])
  ) {
    return 'supply_chain_management';
  }

  if (
    includesAny(goal, [
      'network infrastructure',
      'service dependency',
      'application dependency',
      'asset dependency',
      'cmdb',
      'blast radius',
      'infrastructure topology',
      'service map',
      'observability dependency',
    ])
  ) {
    return 'network_infrastructure';
  }

  return null;
}

function includesAny(text: string, keywords: readonly string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
