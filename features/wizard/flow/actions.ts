import type {
  ColumnContextColumnPatch,
  ColumnContextGlobalPrioritiesPatch,
  MappingSelection,
  ProfileState,
  SchemaDraft,
  SchemaGenerationMode,
  SolutionKitId,
  UploadedFileSummary,
} from '@/features/wizard/model/types';

export type FlowAction =
  | { type: 'goal/set'; value: string }
  | { type: 'mode/set'; value: SchemaGenerationMode }
  | { type: 'use-case/select-kit'; value: SolutionKitId }
  | { type: 'use-case/set-custom'; value: string }
  | { type: 'queries/toggle-suggested'; value: string }
  | { type: 'queries/start-adding-custom' }
  | { type: 'queries/cancel-adding-custom' }
  | { type: 'queries/set-draft-custom'; value: string }
  | { type: 'queries/add-custom' }
  | { type: 'queries/remove-custom'; value: string }
  | { type: 'upload/add-files'; value: UploadedFileSummary[] }
  | { type: 'upload/remove-file'; value: string }
  | { type: 'profile/set'; value: ProfileState }
  | { type: 'profile/clear' }
  | {
      type: 'mapping/set-target';
      value: MappingSelection;
    }
  | {
      type: 'mapping/clear-target';
      value: { fileName: string; columnName: string };
    }
  | {
      type: 'mapping/set-preview';
      value: {
        schema: string;
        preview: string;
        warnings: string[];
        supportedVertices: string[];
        supportedEdges: string[];
      };
    }
  | { type: 'mapping/set-confirmed'; value: boolean }
  | { type: 'column-context/initialize' }
  | {
      type: 'column-context/update-column';
      columnId: string;
      value: ColumnContextColumnPatch;
    }
  | {
      type: 'column-context/update-global';
      value: ColumnContextGlobalPrioritiesPatch;
    }
  | { type: 'schema-draft/generate' }
  | { type: 'schema-draft/set'; value: SchemaDraft | null }
  | { type: 'schema-review/set-feedback-draft'; value: string }
  | { type: 'schema-draft/apply-feedback'; value: string }
  | { type: 'final-schema/generate' }
  | { type: 'step/next' }
  | { type: 'step/previous' }
  | { type: 'step/go'; value: number };
