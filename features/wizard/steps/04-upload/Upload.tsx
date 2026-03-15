'use client';

import { useUpload } from '@/features/wizard/provider';
import { Frame } from '@/features/wizard/ui';
import { Dropzone } from '@/features/wizard/steps/04-upload/Dropzone';
import { Files } from '@/features/wizard/steps/04-upload/Files';

export function Upload() {
  const { files, addFiles, removeFile } = useUpload();

  return (
    <Frame
      stepLabel="STEP 4"
      title="Uploading Data"
      description="Upload one or more files so the system can inspect dataset structure, detect columns, and estimate whether the available data is sufficient for the schema you want to build."
    >
      <div className="space-y-5">
        <Dropzone onAddFiles={addFiles} />
        <Files files={files} onRemoveFile={removeFile} />
      </div>
    </Frame>
  );
}
