'use client';

import type { ChangeEvent } from 'react';
import type { UploadedFileSummary } from '@/features/wizard/model/types';

type Props = {
  onAddFiles: (files: UploadedFileSummary[]) => void;
};

export function Dropzone({ onAddFiles }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;

    if (!fileList?.length) {
      return;
    }

    const files: UploadedFileSummary[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      sizeBytes: file.size,
      file,
    }));

    onAddFiles(files);
    event.currentTarget.value = '';
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-5">
      <div className="rounded-xl border-2 border-dashed border-slate-400 bg-slate-50 p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">
          Upload CSV, TSV, or similar structured files
        </p>

        <p className="mt-2 text-sm text-slate-600">
          Frontend-first version: files are staged here now, and later this will
          connect to parsing and profiling.
        </p>

        <label className="mt-5 inline-flex cursor-pointer rounded-lg border border-sky-700 bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600">
          Choose Files
          <input
            type="file"
            multiple
            className="hidden"
            accept=".csv,.tsv,.txt,.json"
            onChange={handleChange}
          />
        </label>
      </div>
    </section>
  );
}
