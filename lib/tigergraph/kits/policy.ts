import { normalizeKitId } from '@/features/wizard/model/kits';
import type { CurrentKitId, KitId } from '@/features/wizard/model/types';

export type KitPolicy = {
  hasMappingStep: boolean;
  hasSchemaPreview: boolean;
  hasLoadingJobPreview: boolean;
  strictValidation: boolean;
  requiresConfirmedMapping: boolean;
};

const defaultPolicy: KitPolicy = {
  hasMappingStep: false,
  hasSchemaPreview: false,
  hasLoadingJobPreview: false,
  strictValidation: false,
  requiresConfirmedMapping: false,
};

const byKit: Partial<Record<CurrentKitId, Partial<KitPolicy>>> = {
  transaction_fraud: {
    hasMappingStep: true,
    hasSchemaPreview: true,
    hasLoadingJobPreview: true,
    strictValidation: true,
    requiresConfirmedMapping: true,
  },
};

export function getKitPolicy(id: KitId | CurrentKitId | null): KitPolicy {
  const kit = normalizeKitId(id as KitId | null);

  if (!kit) {
    return defaultPolicy;
  }

  return {
    ...defaultPolicy,
    ...byKit[kit],
  };
}

export function hasExplicitMappingStep(id: KitId | CurrentKitId | null) {
  return getKitPolicy(id).hasMappingStep;
}

export function supportsSchemaPreview(id: KitId | CurrentKitId | null) {
  return getKitPolicy(id).hasSchemaPreview;
}

export function supportsLoadingJobPreview(id: KitId | CurrentKitId | null) {
  return getKitPolicy(id).hasLoadingJobPreview;
}

export function requiresStrictMappingValidation(
  id: KitId | CurrentKitId | null,
) {
  return getKitPolicy(id).strictValidation;
}

export function requiresConfirmedMapping(id: KitId | CurrentKitId | null) {
  return getKitPolicy(id).requiresConfirmedMapping;
}
