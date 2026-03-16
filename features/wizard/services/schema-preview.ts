import { normalizeKitId } from '@/features/wizard/model/kits';
import type {
  CurrentKitId,
  MappingSelection,
  SchemaAttributeDraft,
  SolutionKitId,
} from '@/features/wizard/model/types';

type VertexPlan = {
  name: string;
  sourceTargets: string[];
  description: string;
};

type EdgePlan = {
  name: string;
  from: string;
  to: string;
  sourceTargets: string[];
  description: string;
};

type AttrPlan = {
  name: string;
  ownerType: 'vertex' | 'edge';
  ownerName: string;
  sourceTarget: string;
  dataType: string;
};

export type SchemaPlan = {
  vertices: VertexPlan[];
  edges: EdgePlan[];
  attributes: AttrPlan[];
  text: string;
  warnings: string[];
  supportedVertices: string[];
  supportedEdges: string[];
};

type PreviewBuilder = (selected: MappingSelection[]) => SchemaPlan;

const previewBuilders: Partial<Record<CurrentKitId, PreviewBuilder>> = {
  transaction_fraud: buildTransactionFraudPreview,
};

export function buildSchemaPreview({
  kit,
  selected,
}: {
  kit: SolutionKitId | null;
  selected: MappingSelection[];
}): SchemaPlan {
  const currentKit = normalizeKitId(kit);

  if (!currentKit) {
    return emptyPlan('No solution kit selected for schema preview.');
  }

  const build = previewBuilders[currentKit];

  if (!build) {
    return emptyPlan(`Schema preview is not implemented for ${currentKit}.`);
  }

  return build(selected);
}

function emptyPlan(message: string): SchemaPlan {
  return {
    vertices: [],
    edges: [],
    attributes: [],
    text: '',
    warnings: [message],
    supportedVertices: [],
    supportedEdges: [],
  };
}

function buildTransactionFraudPreview(
  selected: MappingSelection[],
): SchemaPlan {
  const has = (target: string) =>
    selected.some((item) => item.targetKey === target);

  const hasName =
    has('party.full_name') ||
    (has('party.first_name') && has('party.last_name'));

  const hasCity = has('party.city');
  const hasState = has('party.state');
  const hasZip = has('party.zipcode');
  const hasAddress = has('party.address');
  const hasParty = has('party.id');
  const hasCard = has('card.id');
  const hasMerchant = has('merchant.id');
  const hasCategory = has('merchant.category');
  const hasPayment = has('payment.id');
  const hasIp = has('network.ip');
  const hasDevice = has('network.device');
  const hasEmail = has('party.email');
  const hasPhone = has('party.phone');
  const hasDob = has('party.dob');

  const vertices: VertexPlan[] = [];
  const edges: EdgePlan[] = [];
  const attributes: AttrPlan[] = [];
  const warnings: string[] = [];

  if (hasParty) {
    vertices.push({
      name: 'Party',
      sourceTargets: ['party.id'],
      description: 'Core party or customer entity.',
    });
  }

  if (hasCard) {
    vertices.push({
      name: 'Card',
      sourceTargets: ['card.id'],
      description: 'Payment card entity.',
    });
  }

  if (hasMerchant) {
    vertices.push({
      name: 'Merchant',
      sourceTargets: ['merchant.id'],
      description: 'Merchant entity.',
    });
  }

  if (hasCategory) {
    vertices.push({
      name: 'Merchant_Category',
      sourceTargets: ['merchant.category'],
      description: 'Merchant category entity.',
    });
  }

  if (hasPayment) {
    vertices.push({
      name: 'Payment_Transaction',
      sourceTargets: ['payment.id'],
      description: 'Payment transaction entity.',
    });
  }

  if (hasIp) {
    vertices.push({
      name: 'IP',
      sourceTargets: ['network.ip'],
      description: 'Observed IP address.',
    });
  }

  if (hasDevice) {
    vertices.push({
      name: 'Device',
      sourceTargets: ['network.device'],
      description: 'Observed device.',
    });
  }

  if (hasEmail) {
    vertices.push({
      name: 'Email',
      sourceTargets: ['party.email'],
      description: 'Email identity.',
    });
  }

  if (hasPhone) {
    vertices.push({
      name: 'Phone',
      sourceTargets: ['party.phone'],
      description: 'Phone identity.',
    });
  }

  if (hasDob) {
    vertices.push({
      name: 'DOB',
      sourceTargets: ['party.dob'],
      description: 'Date of birth.',
    });
  }

  if (hasName) {
    vertices.push({
      name: 'Full_Name',
      sourceTargets: has('party.full_name')
        ? ['party.full_name']
        : ['party.first_name', 'party.last_name'],
      description: 'Full name identity.',
    });
  }

  if (hasAddress) {
    vertices.push({
      name: 'Address',
      sourceTargets: ['party.address'],
      description: 'Address entity.',
    });
  }

  if (hasCity) {
    vertices.push({
      name: 'City',
      sourceTargets: compact([
        'party.city',
        hasState ? 'party.state' : null,
        hasZip ? 'party.zipcode' : null,
      ]),
      description: 'City entity.',
    });
  }

  if (hasState) {
    vertices.push({
      name: 'State',
      sourceTargets: ['party.state'],
      description: 'State entity.',
    });
  }

  if (hasZip) {
    vertices.push({
      name: 'Zipcode',
      sourceTargets: ['party.zipcode'],
      description: 'Zipcode entity.',
    });
  }

  if (hasParty && hasCard) {
    edges.push({
      name: 'Party_Has_Card',
      from: 'Party',
      to: 'Card',
      sourceTargets: ['party.id', 'card.id'],
      description: 'Links a party to a card.',
    });
  }

  if (hasParty && hasIp) {
    edges.push({
      name: 'Has_IP',
      from: 'Party',
      to: 'IP',
      sourceTargets: ['party.id', 'network.ip'],
      description: 'Links a party to an IP.',
    });
  }

  if (hasParty && hasDevice) {
    edges.push({
      name: 'Has_Device',
      from: 'Party',
      to: 'Device',
      sourceTargets: ['party.id', 'network.device'],
      description: 'Links a party to a device.',
    });
  }

  if (hasParty && hasEmail) {
    edges.push({
      name: 'Has_Email',
      from: 'Party',
      to: 'Email',
      sourceTargets: ['party.id', 'party.email'],
      description: 'Links a party to an email.',
    });
  }

  if (hasParty && hasPhone) {
    edges.push({
      name: 'Has_Phone',
      from: 'Party',
      to: 'Phone',
      sourceTargets: ['party.id', 'party.phone'],
      description: 'Links a party to a phone.',
    });
  }

  if (hasParty && hasDob) {
    edges.push({
      name: 'Has_DOB',
      from: 'Party',
      to: 'DOB',
      sourceTargets: ['party.id', 'party.dob'],
      description: 'Links a party to a DOB.',
    });
  }

  if (hasParty && hasName) {
    edges.push({
      name: 'Has_Full_Name',
      from: 'Party',
      to: 'Full_Name',
      sourceTargets: has('party.full_name')
        ? ['party.id', 'party.full_name']
        : ['party.id', 'party.first_name', 'party.last_name'],
      description: 'Links a party to a full name.',
    });
  }

  if (hasAddress && hasParty) {
    edges.push({
      name: 'Has_Address',
      from: 'Address',
      to: 'Party',
      sourceTargets: ['party.address', 'party.id'],
      description: 'Links an address to a party.',
    });
  }

  if (hasAddress && hasZip) {
    edges.push({
      name: 'Assigned_To',
      from: 'Address',
      to: 'Zipcode',
      sourceTargets: ['party.address', 'party.zipcode'],
      description: 'Links an address to a zipcode.',
    });
  }

  if (hasAddress && hasCity) {
    edges.push({
      name: 'Located_In',
      from: 'Address',
      to: 'City',
      sourceTargets: compact([
        'party.address',
        'party.city',
        hasState ? 'party.state' : null,
      ]),
      description: 'Links an address to a city.',
    });
  }

  if (hasCity && hasState) {
    edges.push({
      name: 'Located_In',
      from: 'City',
      to: 'State',
      sourceTargets: ['party.city', 'party.state'],
      description: 'Links a city to a state.',
    });
  }

  if (hasZip && hasCity) {
    edges.push({
      name: 'Assigned_To',
      from: 'Zipcode',
      to: 'City',
      sourceTargets: compact([
        'party.zipcode',
        'party.city',
        hasState ? 'party.state' : null,
      ]),
      description: 'Links a zipcode to a city.',
    });
  }

  if (hasMerchant && hasCategory) {
    edges.push({
      name: 'Merchant_Assigned',
      from: 'Merchant',
      to: 'Merchant_Category',
      sourceTargets: ['merchant.id', 'merchant.category'],
      description: 'Links a merchant to a category.',
    });
  }

  if (hasPayment && hasMerchant) {
    edges.push({
      name: 'Merchant_Receive_Transaction',
      from: 'Payment_Transaction',
      to: 'Merchant',
      sourceTargets: ['payment.id', 'merchant.id'],
      description: 'Links a payment transaction to a merchant.',
    });
  }

  if (hasPayment && hasCard) {
    edges.push({
      name: 'Card_Send_Transaction',
      from: 'Payment_Transaction',
      to: 'Card',
      sourceTargets: ['payment.id', 'card.id'],
      description: 'Links a payment transaction to a card.',
    });
  }

  if (hasParty && hasMerchant) {
    edges.push({
      name: 'Has_Interaction_With_Merchant',
      from: 'Party',
      to: 'Merchant',
      sourceTargets: ['party.id', 'merchant.id'],
      description: 'Links a party to a merchant.',
    });
  }

  if (hasPayment && has('payment.amount')) {
    attributes.push({
      name: 'amount',
      ownerType: 'vertex',
      ownerName: 'Payment_Transaction',
      sourceTarget: 'payment.amount',
      dataType: 'DECIMAL',
    });
  }

  if (hasPayment && has('payment.time')) {
    attributes.push({
      name: 'event_time',
      ownerType: 'vertex',
      ownerName: 'Payment_Transaction',
      sourceTarget: 'payment.time',
      dataType: 'DATETIME',
    });
  }

  if (!hasParty) {
    warnings.push('Missing party.id, so the Party vertex cannot be built.');
  }

  if (!hasPayment) {
    warnings.push(
      'Missing payment.id, so the Payment_Transaction vertex cannot be built.',
    );
  }

  if (!hasMerchant) {
    warnings.push('Missing merchant.id, so merchant-related edges are limited.');
  }

  const text = renderSchemaText(vertices, edges, attributes);

  return {
    vertices,
    edges,
    attributes,
    text,
    warnings,
    supportedVertices: vertices.map((item) => item.name),
    supportedEdges: edges.map((item) => item.name),
  };
}

function renderSchemaText(
  vertices: VertexPlan[],
  edges: EdgePlan[],
  attributes: AttrPlan[],
) {
  if (vertices.length === 0 && edges.length === 0) {
    return '';
  }

  const blocks: string[] = [];

  for (const vertex of vertices) {
    const ownerAttrs = attributes.filter(
      (attr) => attr.ownerType === 'vertex' && attr.ownerName === vertex.name,
    );

    const primary = toFieldName(vertex.sourceTargets[0] ?? 'id');
    const lines = [
      `VERTEX ${vertex.name} {`,
      `  PRIMARY_ID: ${primary} STRING`,
      ...ownerAttrs.map((attr) => `  ${attr.name}: ${attr.dataType}`),
      `}`,
    ];

    blocks.push(lines.join('\n'));
  }

  for (const edge of edges) {
    const ownerAttrs = attributes.filter(
      (attr) => attr.ownerType === 'edge' && attr.ownerName === edge.name,
    );

    const lines = [
      `EDGE ${edge.name} {`,
      `  FROM: ${edge.from}`,
      `  TO: ${edge.to}`,
      ...ownerAttrs.map((attr) => `  ${attr.name}: ${attr.dataType}`),
      `}`,
    ];

    blocks.push(lines.join('\n'));
  }

  return blocks.join('\n\n');
}

function compact(values: Array<string | null>) {
  return values.filter((value): value is string => Boolean(value));
}

function toFieldName(value: string) {
  return value.replace(/\./g, '_');
}

export function toDraftId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function toSourceIds(
  selected: MappingSelection[],
  targets: string[],
) {
  return targets
    .map((target) => {
      const match = selected.find((item) => item.targetKey === target);
      return match ? `${match.fileName}:${match.columnName}` : null;
    })
    .filter((value): value is string => Boolean(value));
}

export function toSchemaDraftAttrs(
  attrs: AttrPlan[],
  vertices: SchemaAttributeDraft['ownerId'][],
) {
  return { attrs, vertices };
}
