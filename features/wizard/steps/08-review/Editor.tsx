import type { SchemaDraft } from '@/features/wizard/model/types';
import { Section, Table } from '@/features/wizard/ui';

type Props = {
  draft: SchemaDraft;
  onChange: (value: SchemaDraft | null) => void;
};

export function Editor({ draft, onChange }: Props) {
  function updateVertex(
    vertexId: string,
    patch: Partial<(typeof draft.vertices)[number]>,
  ) {
    onChange({
      ...draft,
      vertices: draft.vertices.map((item) =>
        item.id === vertexId ? { ...item, ...patch } : item,
      ),
    });
  }

  function updateEdge(
    edgeId: string,
    patch: Partial<(typeof draft.edges)[number]>,
  ) {
    onChange({
      ...draft,
      edges: draft.edges.map((item) =>
        item.id === edgeId ? { ...item, ...patch } : item,
      ),
    });
  }

  function updateAttribute(
    attributeId: string,
    patch: Partial<(typeof draft.attributes)[number]>,
  ) {
    onChange({
      ...draft,
      attributes: draft.attributes.map((item) =>
        item.id === attributeId ? { ...item, ...patch } : item,
      ),
    });
  }

  return (
    <div className="space-y-5">
      <Section title="Vertices">
        <Table>
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">Name</th>
                <th className="border border-slate-300 px-3 py-2">
                  Source Columns
                </th>
                <th className="border border-slate-300 px-3 py-2">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {draft.vertices.map((vertex) => (
                <tr key={vertex.id}>
                  <td className="border border-slate-300 px-3 py-2">
                    <input
                      value={vertex.name}
                      onChange={(event) =>
                        updateVertex(vertex.id, { name: event.target.value })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    />
                  </td>

                  <td className="border border-slate-300 px-3 py-2">
                    {vertex.sourceColumnIds.join(', ') || 'n/a'}
                  </td>

                  <td className="border border-slate-300 px-3 py-2">
                    <input
                      value={vertex.description}
                      onChange={(event) =>
                        updateVertex(vertex.id, {
                          description: event.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </Section>

      <Section title="Edges">
        <Table>
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">Name</th>
                <th className="border border-slate-300 px-3 py-2">From</th>
                <th className="border border-slate-300 px-3 py-2">To</th>
                <th className="border border-slate-300 px-3 py-2">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {draft.edges.map((edge) => (
                <tr key={edge.id}>
                  <td className="border border-slate-300 px-3 py-2">
                    <input
                      value={edge.name}
                      onChange={(event) =>
                        updateEdge(edge.id, { name: event.target.value })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    />
                  </td>

                  <td className="border border-slate-300 px-3 py-2">
                    <select
                      value={edge.fromVertexId}
                      onChange={(event) =>
                        updateEdge(edge.id, {
                          fromVertexId: event.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    >
                      {draft.vertices.map((vertex) => (
                        <option key={vertex.id} value={vertex.id}>
                          {vertex.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border border-slate-300 px-3 py-2">
                    <select
                      value={edge.toVertexId}
                      onChange={(event) =>
                        updateEdge(edge.id, {
                          toVertexId: event.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    >
                      {draft.vertices.map((vertex) => (
                        <option key={vertex.id} value={vertex.id}>
                          {vertex.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border border-slate-300 px-3 py-2">
                    <input
                      value={edge.description}
                      onChange={(event) =>
                        updateEdge(edge.id, {
                          description: event.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </Section>

      <Section title="Attributes">
        <Table>
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">Name</th>
                <th className="border border-slate-300 px-3 py-2">Owner Type</th>
                <th className="border border-slate-300 px-3 py-2">Owner</th>
                <th className="border border-slate-300 px-3 py-2">Data Type</th>
              </tr>
            </thead>

            <tbody>
              {draft.attributes.map((attribute) => {
                const ownerOptions =
                  attribute.ownerType === 'vertex'
                    ? draft.vertices
                    : draft.edges;

                return (
                  <tr key={attribute.id}>
                    <td className="border border-slate-300 px-3 py-2">
                      <input
                        value={attribute.name}
                        onChange={(event) =>
                          updateAttribute(attribute.id, {
                            name: event.target.value,
                          })
                        }
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                    </td>

                    <td className="border border-slate-300 px-3 py-2">
                      <select
                        value={attribute.ownerType}
                        onChange={(event) => {
                          const ownerType = event.target.value as
                            | 'vertex'
                            | 'edge';

                          const fallbackOwnerId =
                            ownerType === 'vertex'
                              ? draft.vertices[0]?.id ?? ''
                              : draft.edges[0]?.id ?? '';

                          updateAttribute(attribute.id, {
                            ownerType,
                            ownerId: fallbackOwnerId,
                          });
                        }}
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      >
                        <option value="vertex">Vertex</option>
                        <option value="edge">Edge</option>
                      </select>
                    </td>

                    <td className="border border-slate-300 px-3 py-2">
                      <select
                        value={attribute.ownerId}
                        onChange={(event) =>
                          updateAttribute(attribute.id, {
                            ownerId: event.target.value,
                          })
                        }
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      >
                        {ownerOptions.map((owner) => (
                          <option key={owner.id} value={owner.id}>
                            {owner.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border border-slate-300 px-3 py-2">
                      <input
                        value={attribute.dataType}
                        onChange={(event) =>
                          updateAttribute(attribute.id, {
                            dataType: event.target.value,
                          })
                        }
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Table>
      </Section>
    </div>
  );
}
