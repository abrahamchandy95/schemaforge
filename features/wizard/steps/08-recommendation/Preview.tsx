import type { SchemaDraft } from '@/features/wizard/model/types';
import { Section, Table } from '@/features/wizard/ui';

type Props = {
  draft: SchemaDraft;
};

type TableRow = {
  name: string;
  type: string;
  source: string;
  notes: string;
};

export function Preview({ draft }: Props) {
  const vertexRows: TableRow[] = draft.vertices.map((vertex) => ({
    name: vertex.name,
    type: 'Vertex',
    source: vertex.sourceColumnIds.join(', ') || 'n/a',
    notes: vertex.description,
  }));

  const edgeRows: TableRow[] = draft.edges.map((edge) => ({
    name: edge.name,
    type: 'Edge',
    source: edge.sourceColumnIds.join(', ') || 'n/a',
    notes: edge.description,
  }));

  const attributeRows: TableRow[] = draft.attributes.map((attribute) => ({
    name: attribute.name,
    type:
      attribute.ownerType === 'vertex'
        ? 'Vertex Attribute'
        : 'Edge Attribute',
    source: attribute.sourceColumnId,
    notes: `${attribute.dataType} on ${attribute.ownerType}`,
  }));

  return (
    <div className="space-y-5">
      <Section title="Graph Preview">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {draft.vertices.map((vertex) => (
              <Item
                key={vertex.id}
                label="Vertex"
                name={vertex.name}
                description={vertex.description}
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {draft.edges.map((edge) => (
              <Item
                key={edge.id}
                label="Edge"
                name={edge.name}
                description={edge.description}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Schema Elements">
        <div className="space-y-6">
          <Grid title="Vertices" rows={vertexRows} />
          <Grid title="Edges" rows={edgeRows} />
          <Grid title="Attributes" rows={attributeRows} />
        </div>
      </Section>
    </div>
  );
}

function Item({
  label,
  name,
  description,
}: {
  label: string;
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{name}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
    </div>
  );
}

function Grid({
  title,
  rows,
}: {
  title: string;
  rows: TableRow[];
}) {
  return (
    <div>
      <p className="mb-3 text-base font-bold text-slate-900">{title}</p>

      <Table>
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-3 py-2">Name</th>
              <th className="border border-slate-300 px-3 py-2">Type</th>
              <th className="border border-slate-300 px-3 py-2">Source</th>
              <th className="border border-slate-300 px-3 py-2">Notes</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.name}-${index}`}>
                <td className="border border-slate-300 px-3 py-2">
                  {row.name}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {row.type}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {row.source}
                </td>
                <td className="border border-slate-300 px-3 py-2">
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>
    </div>
  );
}
