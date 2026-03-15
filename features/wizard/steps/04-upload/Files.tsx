import type { UploadedFileSummary } from '@/features/wizard/model/types';
import { Empty, Section } from '@/features/wizard/ui';

type Props = {
  files: UploadedFileSummary[];
  onRemoveFile: (id: string) => void;
};

export function Files({ files, onRemoveFile }: Props) {
  return (
    <Section title="Uploaded Files">
      {files.length === 0 ? (
        <Empty
          title="No files uploaded yet."
          description="Choose one or more files to stage them for data understanding."
        />
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-slate-300 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-600">
                  {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
