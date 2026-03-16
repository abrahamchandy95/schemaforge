import type { SolutionKitId } from '@/features/wizard/model/types';

export type ExpectedField = {
  name: string;
  required: boolean;
  aliases: string[];
  description?: string;
};

export type KitMeta = {
  key: string;
  solutionKitId: SolutionKitId;
  title: string;
  summary: string;
  expectedFields: ExpectedField[];
};
