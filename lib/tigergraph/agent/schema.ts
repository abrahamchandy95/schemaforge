export const agentResultSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title',
    'summary',
    'vertices',
    'edges',
    'attributes',
    'assumptions',
    'notes',
  ],
  properties: {
    title: {
      type: 'string',
      description: 'Human-readable title for the proposed TigerGraph schema.',
    },
    summary: {
      type: 'string',
      description: 'Short summary of the schema design and why it fits the user goal.',
    },
    vertices: {
      type: 'array',
      description: 'Vertex types in the proposed schema.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'sourceKeys'],
        properties: {
          name: {
            type: 'string',
            description: 'Vertex type name.',
          },
          description: {
            type: 'string',
            description: 'Why this vertex exists and what it represents.',
          },
          sourceKeys: {
            type: 'array',
            description:
              'Mapping target keys that justify or define this vertex.',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    edges: {
      type: 'array',
      description: 'Edge types in the proposed schema.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'from', 'to', 'description', 'sourceKeys'],
        properties: {
          name: {
            type: 'string',
            description: 'Edge type name.',
          },
          from: {
            type: 'string',
            description: 'Source vertex type name.',
          },
          to: {
            type: 'string',
            description: 'Target vertex type name.',
          },
          description: {
            type: 'string',
            description: 'Why this edge exists and what relationship it represents.',
          },
          sourceKeys: {
            type: 'array',
            description:
              'Mapping target keys that justify or define this edge.',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    attributes: {
      type: 'array',
      description: 'Attributes attached to vertices or edges.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'ownerType', 'ownerName', 'dataType', 'sourceKey'],
        properties: {
          name: {
            type: 'string',
            description: 'Attribute name.',
          },
          ownerType: {
            type: 'string',
            enum: ['vertex', 'edge'],
            description: 'Whether the attribute belongs to a vertex or edge.',
          },
          ownerName: {
            type: 'string',
            description: 'The name of the owning vertex or edge type.',
          },
          dataType: {
            type: 'string',
            description:
              'TigerGraph-friendly data type suggestion such as STRING, INT, DOUBLE, DATETIME, BOOL.',
          },
          sourceKey: {
            type: 'string',
            description: 'The mapping target key that this attribute came from.',
          },
        },
      },
    },
    assumptions: {
      type: 'array',
      description:
        'Assumptions or unresolved ambiguities the agent had to preserve.',
      items: {
        type: 'string',
      },
    },
    notes: {
      type: 'array',
      description:
        'Extra modeling notes, cautions, or follow-up recommendations.',
      items: {
        type: 'string',
      },
    },
  },
} as const;
