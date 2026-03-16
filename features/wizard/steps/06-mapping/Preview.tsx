import { Empty, Section } from '@/features/wizard/ui';

type Props = {
  schema: string;
  job: string;
  verts: string[];
  edges: string[];
};

export function Preview({ schema, job, verts, edges }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Section title="Schema Preview">
          {schema ? (
            <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
              {schema}
            </pre>
          ) : (
            <Empty
              title="No schema preview yet"
              description="Refresh the preview after selecting mappings."
            />
          )}
        </Section>

        <Section title="Loading Job Preview">
          {job ? (
            <pre className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
              {job}
            </pre>
          ) : (
            <Empty
              title="No loading job preview yet"
              description="A loading job is generated only after the schema preview is built."
            />
          )}
        </Section>
      </div>

      <div className="space-y-4">
        <Section title="Vertices">
          {verts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {verts.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-sm text-slate-900"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No vertices supported yet.</p>
          )}
        </Section>

        <Section title="Edges">
          {edges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {edges.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-sm text-slate-900"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No edges supported yet.</p>
          )}
        </Section>
      </div>
    </div>
  );
}
