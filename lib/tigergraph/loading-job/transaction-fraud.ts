import type {
  RenderedLoadingJob,
  SelectedMapping,
} from '@/lib/tigergraph/mapping/types';
import type { ProfiledFile } from '@/lib/tigergraph/profiling/types';

type FileBinding = {
  file: ProfiledFile;
  byTarget: Map<string, string>;
};

type LoadSeparator = ',' | ';' | '|' | '\\t';

export function renderTransactionFraudLoadingJob(
  files: ProfiledFile[],
  selected: SelectedMapping[],
): RenderedLoadingJob {
  const bindings = bindSelections(files, selected);
  const lines: string[] = [];
  const supportedVertices = new Set<string>();
  const supportedEdges = new Set<string>();
  const warnings: string[] = [];

  lines.push('USE GRAPH Transaction_Fraud');
  lines.push('');
  lines.push(
    'CREATE LOADING JOB load_transaction_fraud_custom FOR GRAPH Transaction_Fraud {',
  );

  for (const binding of bindings) {
    lines.push(`  DEFINE FILENAME ${fileVar(binding.file.name)};`);
  }

  if (bindings.length > 0) {
    lines.push('');
  }

  for (const binding of bindings) {
    const fileVarName = fileVar(binding.file.name);
    const separator = toLoadSeparator(binding.file.delimiter);

    maybePush(
      lines,
      renderVertexParty(fileVarName, separator, binding),
      supportedVertices,
      'Party',
    );
    maybePush(
      lines,
      renderVertexCard(fileVarName, separator, binding),
      supportedVertices,
      'Card',
    );
    maybePush(
      lines,
      renderVertexMerchant(fileVarName, separator, binding),
      supportedVertices,
      'Merchant',
    );
    maybePush(
      lines,
      renderVertexMerchantCategory(fileVarName, separator, binding),
      supportedVertices,
      'Merchant_Category',
    );
    maybePush(
      lines,
      renderVertexPayment(fileVarName, separator, binding),
      supportedVertices,
      'Payment_Transaction',
    );
    maybePush(
      lines,
      renderVertexIp(fileVarName, separator, binding),
      supportedVertices,
      'IP',
    );
    maybePush(
      lines,
      renderVertexDevice(fileVarName, separator, binding),
      supportedVertices,
      'Device',
    );
    maybePush(
      lines,
      renderVertexEmail(fileVarName, separator, binding),
      supportedVertices,
      'Email',
    );
    maybePush(
      lines,
      renderVertexPhone(fileVarName, separator, binding),
      supportedVertices,
      'Phone',
    );
    maybePush(
      lines,
      renderVertexDob(fileVarName, separator, binding),
      supportedVertices,
      'DOB',
    );
    maybePush(
      lines,
      renderVertexFullName(fileVarName, separator, binding),
      supportedVertices,
      'Full_Name',
    );
    maybePush(
      lines,
      renderVertexAddress(fileVarName, separator, binding),
      supportedVertices,
      'Address',
    );
    maybePush(
      lines,
      renderVertexCity(fileVarName, separator, binding),
      supportedVertices,
      'City',
    );
    maybePush(
      lines,
      renderVertexState(fileVarName, separator, binding),
      supportedVertices,
      'State',
    );
    maybePush(
      lines,
      renderVertexZipcode(fileVarName, separator, binding),
      supportedVertices,
      'Zipcode',
    );

    maybePush(
      lines,
      renderEdgePartyHasCard(fileVarName, separator, binding),
      supportedEdges,
      'Party_Has_Card',
    );
    maybePush(
      lines,
      renderEdgeHasIp(fileVarName, separator, binding),
      supportedEdges,
      'Has_IP',
    );
    maybePush(
      lines,
      renderEdgeHasDevice(fileVarName, separator, binding),
      supportedEdges,
      'Has_Device',
    );
    maybePush(
      lines,
      renderEdgeHasEmail(fileVarName, separator, binding),
      supportedEdges,
      'Has_Email',
    );
    maybePush(
      lines,
      renderEdgeHasPhone(fileVarName, separator, binding),
      supportedEdges,
      'Has_Phone',
    );
    maybePush(
      lines,
      renderEdgeHasDob(fileVarName, separator, binding),
      supportedEdges,
      'Has_DOB',
    );
    maybePush(
      lines,
      renderEdgeHasFullName(fileVarName, separator, binding),
      supportedEdges,
      'Has_Full_Name',
    );
    maybePush(
      lines,
      renderEdgeHasAddress(fileVarName, separator, binding),
      supportedEdges,
      'Has_Address',
    );
    maybePush(
      lines,
      renderEdgeAssignedToZip(fileVarName, separator, binding),
      supportedEdges,
      'Assigned_To(Address,Zipcode)',
    );
    maybePush(
      lines,
      renderEdgeLocatedAddressCity(fileVarName, separator, binding),
      supportedEdges,
      'Located_In(Address,City)',
    );
    maybePush(
      lines,
      renderEdgeLocatedCityState(fileVarName, separator, binding),
      supportedEdges,
      'Located_In(City,State)',
    );
    maybePush(
      lines,
      renderEdgeAssignedZipCity(fileVarName, separator, binding),
      supportedEdges,
      'Assigned_To(Zipcode,City)',
    );
    maybePush(
      lines,
      renderEdgeMerchantAssigned(fileVarName, separator, binding),
      supportedEdges,
      'Merchant_Assigned',
    );
    maybePush(
      lines,
      renderEdgeMerchantReceiveTransaction(fileVarName, separator, binding),
      supportedEdges,
      'Merchant_Receive_Transaction',
    );
    maybePush(
      lines,
      renderEdgeCardSendTransaction(fileVarName, separator, binding),
      supportedEdges,
      'Card_Send_Transaction',
    );
    maybePush(
      lines,
      renderEdgeInteractionWithMerchant(fileVarName, separator, binding),
      supportedEdges,
      'Has_Interaction_With_Merchant',
    );
  }

  if (supportedVertices.size === 0) {
    warnings.push(
      'No vertex loads could be generated from the current mapping.',
    );
  }

  if (supportedEdges.size === 0) {
    warnings.push('No edge loads could be generated from the current mapping.');
  }

  lines.push('}');

  return {
    text: lines.join('\n'),
    warnings,
    supportedVertices: [...supportedVertices],
    supportedEdges: [...supportedEdges],
  };
}

function bindSelections(
  files: ProfiledFile[],
  selected: SelectedMapping[],
): FileBinding[] {
  return files.map((file) => ({
    file,
    byTarget: new Map(
      selected
        .filter((item) => item.fileName === file.name)
        .map((item) => [item.targetKey, item.columnName] as const),
    ),
  }));
}

function maybePush(
  lines: string[],
  line: string | null,
  set: Set<string>,
  label: string,
) {
  if (!line) {
    return;
  }

  lines.push(line);
  set.add(label);
}

function fileVar(fileName: string) {
  const cleaned = fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `file_${cleaned || 'data'}`;
}

function toLoadSeparator(delimiter: ProfiledFile['delimiter']): LoadSeparator {
  return delimiter === '\t' ? '\\t' : delimiter;
}

function loadOptions(separator: LoadSeparator) {
  return ` USING SEPARATOR="${separator}", HEADER="true", EOL="\\n", QUOTE="double";`;
}

function col(binding: FileBinding, targetKey: string) {
  const column = binding.byTarget.get(targetKey);
  return column ? `$"${column}"` : null;
}

function exprFullName(binding: FileBinding) {
  const fullName = col(binding, 'party.full_name');
  if (fullName) {
    return fullName;
  }

  const first = col(binding, 'party.first_name');
  const last = col(binding, 'party.last_name');

  if (first && last) {
    return `gsql_concat(${first},${last})`;
  }

  return null;
}

function exprCityId(binding: FileBinding) {
  const city = col(binding, 'party.city');
  const state = col(binding, 'party.state');

  if (city && state) {
    return `gsql_concat(${city}, ${state})`;
  }

  return city;
}

function renderVertexParty(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  if (!partyId) {
    return null;
  }

  const address = col(binding, 'party.address') ?? '_';
  const dob = col(binding, 'party.dob') ?? '_';
  const fullName = exprFullName(binding) ?? '_';

  return `  LOAD ${fileVarName} TO VERTEX Party VALUES(${partyId}, _, ${address}, ${dob}, _, ${fullName}, gsql_current_time_epoch(_))${loadOptions(separator)}`;
}

function renderVertexCard(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const cardId = col(binding, 'card.id');
  if (!cardId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Card VALUES(${cardId}, _, _, _, _, _)${loadOptions(separator)}`;
}

function renderVertexMerchant(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const merchantId = col(binding, 'merchant.id');
  if (!merchantId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Merchant VALUES(${merchantId}, _, _, _)${loadOptions(separator)}`;
}

function renderVertexMerchantCategory(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const category = col(binding, 'merchant.category');
  if (!category) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Merchant_Category VALUES(${category})${loadOptions(separator)}`;
}

function renderVertexPayment(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const paymentId = col(binding, 'payment.id');
  if (!paymentId) {
    return null;
  }

  const amount = col(binding, 'payment.amount') ?? '_';
  const category = col(binding, 'merchant.category') ?? '_';
  const merchant = col(binding, 'merchant.id') ?? '_';
  const time = col(binding, 'payment.time') ?? '_';

  return `  LOAD ${fileVarName} TO VERTEX Payment_Transaction VALUES(${paymentId}, _, ${category}, ${merchant}, ${time}, _, _, _, ${amount}, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _)${loadOptions(separator)}`;
}

function renderVertexIp(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const ip = col(binding, 'network.ip');
  if (!ip) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX IP VALUES(${ip})${loadOptions(separator)}`;
}

function renderVertexDevice(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const device = col(binding, 'network.device');
  if (!device) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Device VALUES(${device})${loadOptions(separator)}`;
}

function renderVertexEmail(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const email = col(binding, 'party.email');
  if (!email) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Email VALUES(${email})${loadOptions(separator)}`;
}

function renderVertexPhone(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const phone = col(binding, 'party.phone');
  if (!phone) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Phone VALUES(${phone})${loadOptions(separator)}`;
}

function renderVertexDob(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const dob = col(binding, 'party.dob');
  if (!dob) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX DOB VALUES(${dob})${loadOptions(separator)}`;
}

function renderVertexFullName(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const fullName = exprFullName(binding);
  if (!fullName) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Full_Name VALUES(${fullName})${loadOptions(separator)}`;
}

function renderVertexAddress(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const address = col(binding, 'party.address');
  if (!address) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Address VALUES(${address})${loadOptions(separator)}`;
}

function renderVertexCity(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const cityId = exprCityId(binding);
  if (!cityId) {
    return null;
  }

  const city = col(binding, 'party.city') ?? '_';
  const zipcode = col(binding, 'party.zipcode') ?? '_';

  return `  LOAD ${fileVarName} TO VERTEX City VALUES(${cityId}, ${city}, ${zipcode})${loadOptions(separator)}`;
}

function renderVertexState(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const state = col(binding, 'party.state');
  if (!state) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX State VALUES(${state})${loadOptions(separator)}`;
}

function renderVertexZipcode(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const zipcode = col(binding, 'party.zipcode');
  if (!zipcode) {
    return null;
  }

  return `  LOAD ${fileVarName} TO VERTEX Zipcode VALUES(${zipcode})${loadOptions(separator)}`;
}

function renderEdgePartyHasCard(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const cardId = col(binding, 'card.id');
  if (!partyId || !cardId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Party_Has_Card VALUES(${partyId}, ${cardId})${loadOptions(separator)}`;
}

function renderEdgeHasIp(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const ip = col(binding, 'network.ip');
  if (!partyId || !ip) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_IP VALUES(${partyId}, ${ip})${loadOptions(separator)}`;
}

function renderEdgeHasDevice(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const device = col(binding, 'network.device');
  if (!partyId || !device) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Device VALUES(${partyId}, ${device})${loadOptions(separator)}`;
}

function renderEdgeHasEmail(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const email = col(binding, 'party.email');
  if (!partyId || !email) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Email VALUES(${partyId}, ${email})${loadOptions(separator)}`;
}

function renderEdgeHasPhone(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const phone = col(binding, 'party.phone');
  if (!partyId || !phone) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Phone VALUES(${partyId}, ${phone})${loadOptions(separator)}`;
}

function renderEdgeHasDob(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const dob = col(binding, 'party.dob');
  if (!partyId || !dob) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_DOB VALUES(${partyId}, ${dob})${loadOptions(separator)}`;
}

function renderEdgeHasFullName(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const partyId = col(binding, 'party.id');
  const fullName = exprFullName(binding);
  if (!partyId || !fullName) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Full_Name VALUES(${partyId}, ${fullName})${loadOptions(separator)}`;
}

function renderEdgeHasAddress(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const address = col(binding, 'party.address');
  const partyId = col(binding, 'party.id');
  if (!address || !partyId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Address VALUES(${address}, ${partyId})${loadOptions(separator)}`;
}

function renderEdgeAssignedToZip(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const address = col(binding, 'party.address');
  const zipcode = col(binding, 'party.zipcode');
  if (!address || !zipcode) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Assigned_To VALUES(${address} Address, ${zipcode} Zipcode)${loadOptions(separator)}`;
}

function renderEdgeLocatedAddressCity(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const address = col(binding, 'party.address');
  const cityId = exprCityId(binding);
  if (!address || !cityId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Located_In VALUES(${address} Address, ${cityId} City)${loadOptions(separator)}`;
}

function renderEdgeLocatedCityState(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const cityId = exprCityId(binding);
  const state = col(binding, 'party.state');
  if (!cityId || !state) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Located_In VALUES(${cityId} City, ${state} State)${loadOptions(separator)}`;
}

function renderEdgeAssignedZipCity(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const zipcode = col(binding, 'party.zipcode');
  const cityId = exprCityId(binding);
  if (!zipcode || !cityId) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Assigned_To VALUES(${zipcode} Zipcode, ${cityId} City)${loadOptions(separator)}`;
}

function renderEdgeMerchantAssigned(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const merchant = col(binding, 'merchant.id');
  const category = col(binding, 'merchant.category');
  if (!merchant || !category) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Merchant_Assigned VALUES(${merchant}, ${category})${loadOptions(separator)}`;
}

function renderEdgeMerchantReceiveTransaction(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const payment = col(binding, 'payment.id');
  const merchant = col(binding, 'merchant.id');
  if (!payment || !merchant) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Merchant_Receive_Transaction VALUES(${payment}, ${merchant})${loadOptions(separator)}`;
}

function renderEdgeCardSendTransaction(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const payment = col(binding, 'payment.id');
  const card = col(binding, 'card.id');
  if (!payment || !card) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Card_Send_Transaction VALUES(${payment}, ${card})${loadOptions(separator)}`;
}

function renderEdgeInteractionWithMerchant(
  fileVarName: string,
  separator: LoadSeparator,
  binding: FileBinding,
) {
  const party = col(binding, 'party.id');
  const merchant = col(binding, 'merchant.id');
  if (!party || !merchant) {
    return null;
  }

  return `  LOAD ${fileVarName} TO EDGE Has_Interaction_With_Merchant VALUES(${party}, ${merchant})${loadOptions(separator)}`;
}
