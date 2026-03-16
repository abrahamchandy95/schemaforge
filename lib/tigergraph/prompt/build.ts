import { queryCatalog } from '@/features/wizard/model/queries';
import type { WizardState } from '@/features/wizard/model/types';
import { TRANSACTION_FRAUD_REFERENCE } from '@/lib/tigergraph/kits/transaction-fraud/reference';
import type { PromptColumn, PromptInput, PromptQuery } from '@/lib/tigergraph/prompt/types';
import { isTxKit, normalizeKitId } from '@/features/wizard/model/kits';
import type { CurrentKitId } from '@/features/wizard/model/types';

export function buildPromptInput(state: WizardState): PromptInput {
    const kit = normalizeKitId(state.useCase.selectedKitId);
  const issues = collectIssues(state, kit);

  return {
    ready: issues.length === 0,
    issues,
        useCase: {
      kit,
      goal: state.goalPrompt.goalText,
      mode: state.goalPrompt.mode,
      customUseCase: state.useCase.customUseCaseText,
    },
    queries: buildQueries(state),
    files: state.profile?.files ?? [],
    mapping: {
      confirmed: state.mapping.confirmed,
      selected: state.mapping.selected,
      schemaPreview: state.mapping.schema,
      loadingJobPreview: state.mapping.preview,
      supportedVertices: state.mapping.supportedVertices,
      supportedEdges: state.mapping.supportedEdges,
      warnings: state.mapping.warnings,
    },
    columns: buildColumns(state),
    priorities: state.columnContext.globalPriorities,
    draft: state.schemaDraft,
    reference: buildReference(kit),
  };
}

function collectIssues(state: WizardState, kit: CurrentKitId | null) {
  const issues: string[] = [];

  if (!state.goalPrompt.goalText.trim()) {
    issues.push('Goal text is missing.');
  }

  if (!kit) {
    issues.push('No solution kit is selected.');
  }

  if (!state.profile) {
    issues.push('Files have not been profiled yet.');
  }

  if (isTxKit(kit)) {
    if (!state.mapping.selected.length) {
      issues.push('No mapping selections exist for transaction fraud.');
    }

    if (!state.mapping.schema.trim()) {
      issues.push('Schema preview is missing.');
    }

    if (!state.mapping.preview.trim()) {
      issues.push('Loading-job preview is missing.');
    }

    if (!state.mapping.confirmed) {
      issues.push('Mapping has not been confirmed.');
    }
  }

  if (!state.columnContext.columns.length) {
    issues.push('Column context has not been initialized.');
  }

  return issues;
}

function buildQueries(state: WizardState): PromptQuery[] {
  const suggested = queryCatalog
    .filter((query) =>
      state.queries.selectedSuggestedQueryIds.includes(query.id),
    )
    .map<PromptQuery>((query) => ({
      id: query.id,
      text: query.label,
      source: 'suggested',
    }));

  const custom = state.queries.customQueries.map<PromptQuery>((query) => ({
    id: query.id,
    text: query.text,
    source: 'custom',
  }));

  return [...suggested, ...custom];
}

function buildColumns(state: WizardState): PromptColumn[] {
  return state.columnContext.columns.map((column) => ({
    id: column.id,
    name: column.name,
    fileSource: column.fileSource,
    dataType: column.dataType,
    sampleValue: column.sampleValue,
    assignedRole: column.assignedRole,
    guidance: column.guidance,
    flags: {
      isRealEntity: column.isRealEntity,
      isIdentifier: column.isIdentifier,
      isTraversalStartingPoint: column.isTraversalStartingPoint,
      participatesInMultipleRelationships:
        column.participatesInMultipleRelationships,
      usedForFilteringOrSorting: column.usedForFilteringOrSorting,
      mayBecomeSuperNode: column.mayBecomeSuperNode,
      useGraphAlgorithms: column.useGraphAlgorithms,
      needsTemporalModeling: column.needsTemporalModeling,
      isSensitiveData: column.isSensitiveData,
      requiresSecondaryIndex: column.requiresSecondaryIndex,
      connectsToMultipleVertexTypes: column.connectsToMultipleVertexTypes,
    },
    dependsOnColumnId: column.dependsOnColumnId,
    relationshipTargetColumnId: column.relationshipTargetColumnId,
    dataRangeOrConstraint: column.dataRangeOrConstraint,
  }));
}

function buildReference(kit: CurrentKitId | null) {
  switch (kit) {
    case 'transaction_fraud':
      return {
        schema: TRANSACTION_FRAUD_REFERENCE.schema,
        loadingJob: TRANSACTION_FRAUD_REFERENCE.loadingJob,
      };

    default:
      return null;
  }
}
