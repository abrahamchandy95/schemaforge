'use client';

import type { UploadedFileSummary } from '@/features/wizard/model/types';
import { useRoot } from '@/features/wizard/provider/root';

export function useUpload() {
  const { state, dispatch } = useRoot();

  return {
    files: state.upload.files,
    addFiles: (value: UploadedFileSummary[]) =>
      dispatch({ type: 'upload/add-files', value }),
    removeFile: (value: string) =>
      dispatch({ type: 'upload/remove-file', value }),
  };
}
