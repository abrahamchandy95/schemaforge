export type AgentVertex = {
  name: string;
  description: string;
  sourceKeys: string[];
};

export type AgentEdge = {
  name: string;
  from: string;
  to: string;
  description: string;
  sourceKeys: string[];
};

export type AgentAttribute = {
  name: string;
  ownerType: 'vertex' | 'edge';
  ownerName: string;
  dataType: string;
  sourceKey: string;
};

export type AgentResult = {
  title: string;
  summary: string;
  vertices: AgentVertex[];
  edges: AgentEdge[];
  attributes: AgentAttribute[];
  assumptions: string[];
  notes: string[];
};
