import { NextResponse } from 'next/server';
import type { SolutionKitId } from '@/features/wizard/model/types';
import { normalizeKitId } from '@/features/wizard/model/kits';
import { getKit } from '@/lib/tigergraph/kits/registry';
import { buildTransactionFraudMapping } from '@/lib/tigergraph/mapping/suggest';
import { profileFileHeaders } from '@/lib/tigergraph/profiling/csv';
import { buildWarnings, matchKitFields } from '@/lib/tigergraph/profiling/match';
import type { ProfileResponse } from '@/lib/tigergraph/profiling/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const selectedKitId = normalizeKitId(toSolutionKitId(formData.get('kit')));
    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files were uploaded.' },
        { status: 400 },
      );
    }

    const profiledFiles = await Promise.all(files.map(profileFileHeaders));
    const kit = getKit(selectedKitId);

    const matches = kit ? matchKitFields(kit, profiledFiles) : [];
    const warnings = kit ? buildWarnings(matches) : [];
    const mapping =
      selectedKitId === 'transaction_fraud'
        ? buildTransactionFraudMapping(profiledFiles)
        : null;

    const response: ProfileResponse = {
      selectedKitId,
      profiledAgainst: kit?.key ?? null,
      files: profiledFiles,
      matches,
      warnings: [...warnings, ...(mapping?.warnings ?? [])],
      mapping,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('wizard/profile failed', error);

    return NextResponse.json(
      { error: 'Failed to profile uploaded files.' },
      { status: 500 },
    );
  }
}

function toSolutionKitId(value: FormDataEntryValue | null): SolutionKitId | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  return value as SolutionKitId;
}
