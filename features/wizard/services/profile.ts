import type {
  ProfileState,
  SolutionKitId,
  UploadedFileSummary,
} from '@/features/wizard/model/types';

type Params = {
  kit: SolutionKitId | null;
  files: UploadedFileSummary[];
};

export async function profileFiles({
  kit,
  files,
}: Params): Promise<ProfileState> {
  const formData = new FormData();

  if (kit) {
    formData.append('kit', kit);
  }

  for (const file of files) {
    formData.append('files', file.file, file.name);
  }

  const response = await fetch('/api/wizard/profile', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? 'Failed to profile files.');
  }

  return (await response.json()) as ProfileState;
}
