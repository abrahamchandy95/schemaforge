import type { WizardStep } from '@/features/wizard/model/types';

export const steps = [
  {
    id: 'goal',
    title: 'Goal / Prompt / Use',
    description:
      'Describe your business objective. The AI will use your input to suggest the best use cases and schema choices.',
  },
  {
    id: 'use-case',
    title: 'Use Case / Solution Kit Selection',
    description:
      'Select a use case or solution kit so the system can guide schema design based on graph pattern, entities, and expected queries.',
  },
  {
    id: 'queries',
    title: 'Queries',
    description: 'Review suggested queries or add your own.',
  },
  {
    id: 'upload',
    title: 'Uploading Data',
    description: 'Upload files and inspect detected columns.',
  },
  {
    id: 'understanding',
    title: 'Data Understanding',
    description: 'Review samples, warnings, and data quality notes.',
  },
  {
    id: 'columns',
    title: 'Columns / Data Context',
    description: 'Define how each column should behave in the graph.',
  },
  {
    id: 'recommendation',
    title: 'AI Schema Recommendation',
    description: 'Review the AI-generated schema draft.',
  },
  {
    id: 'review',
    title: 'Schema Review & Editing',
    description: 'Refine and edit the schema.',
  },
  {
    id: 'final',
    title: 'Final Schema Creation',
    description: 'Generate the final schema and mapping.',
  },
] satisfies readonly WizardStep[];
