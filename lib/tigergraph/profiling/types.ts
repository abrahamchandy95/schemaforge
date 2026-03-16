import type { MappingBundle } from '@/lib/tigergraph/mapping/types';

export type ProfiledColumn = {
  name: string;
  normalizedName: string;
  sampleValues: string[];
};

export type ProfiledFile = {
  name: string;
  sizeBytes: number;
  delimiter: ',' | '\t' | ';' | '|';
  headersDetected: boolean;
  columns: ProfiledColumn[];
};

export type ProfileMatchState = 'matched' | 'review' | 'missing';

export type ProfileMatch = {
  expectedField: string;
  required: boolean;
  matchedColumns: string[];
  state: ProfileMatchState;
  note?: string;
};

export type ProfileResponse = {
  selectedKitId: string | null;
  profiledAgainst: string | null;
  files: ProfiledFile[];
  matches: ProfileMatch[];
  warnings: string[];
  mapping: MappingBundle | null;
};
