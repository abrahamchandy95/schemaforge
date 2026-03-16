'use client';

import { useWizardActions, useWizardState } from '@/features/wizard/provider/root';

export function useUpload() {
  const { state } = useWizardState();
  const { addUploadedFiles, removeUploadedFile } = useWizardActions();

  return {
    files: state.upload.files,
    addFiles: addUploadedFiles,
    removeFile: removeUploadedFile,
  };
}
