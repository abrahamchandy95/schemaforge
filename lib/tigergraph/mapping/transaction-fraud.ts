import type { MappingTarget } from '@/lib/tigergraph/mapping/types';

type ValueHint = 'email' | 'ip' | 'date' | 'number' | 'phone' | 'name';

export type TransactionFraudTarget = MappingTarget & {
  aliases: string[];
  fileHints?: string[];
  valueHints?: ValueHint[];
};

export const transactionFraudTargets: TransactionFraudTarget[] = [
  {
    key: 'party.id',
    label: 'Party ID',
    group: 'Party',
    required: true,
    description: 'Primary identifier for a customer or party',
    aliases: ['id', 'party_id', 'customer_id', 'person_id', 'user_id', 'userid'],
    fileHints: ['party', 'customer', 'user', 'person'],
  },
  {
    key: 'party.first_name',
    label: 'First Name',
    group: 'Party',
    required: false,
    aliases: ['first_name', 'firstname', 'given_name'],
    valueHints: ['name'],
  },
  {
    key: 'party.last_name',
    label: 'Last Name',
    group: 'Party',
    required: false,
    aliases: ['last_name', 'lastname', 'surname', 'family_name'],
    valueHints: ['name'],
  },
  {
    key: 'party.full_name',
    label: 'Full Name',
    group: 'Party',
    required: false,
    aliases: ['full_name', 'fullname', 'name', 'customer_name'],
    valueHints: ['name'],
  },
  {
    key: 'party.dob',
    label: 'Date of Birth',
    group: 'Party',
    required: false,
    aliases: ['dob', 'birth_date', 'date_of_birth'],
    valueHints: ['date'],
  },
  {
    key: 'party.phone',
    label: 'Phone',
    group: 'Party',
    required: false,
    aliases: ['phone', 'phone_number', 'mobile', 'telephone'],
    valueHints: ['phone'],
  },
  {
    key: 'party.email',
    label: 'Email',
    group: 'Party',
    required: false,
    aliases: ['email', 'email_address', 'mail'],
    valueHints: ['email'],
  },
  {
    key: 'party.address',
    label: 'Address',
    group: 'Location',
    required: false,
    aliases: ['address', 'street_address', 'addr'],
  },
  {
    key: 'party.city',
    label: 'City',
    group: 'Location',
    required: false,
    aliases: ['city', 'town'],
  },
  {
    key: 'party.state',
    label: 'State',
    group: 'Location',
    required: false,
    aliases: ['state', 'province', 'region'],
  },
  {
    key: 'party.zipcode',
    label: 'Zipcode',
    group: 'Location',
    required: false,
    aliases: ['zip', 'zipcode', 'postal_code', 'postcode'],
  },
  {
    key: 'card.id',
    label: 'Card ID',
    group: 'Card',
    required: false,
    aliases: ['card', 'card_id', 'card_number', 'pan'],
    fileHints: ['card'],
  },
  {
    key: 'payment.id',
    label: 'Payment Transaction ID',
    group: 'Payment Transaction',
    required: true,
    aliases: ['transaction', 'transaction_id', 'payment_transaction', 'tx_id', 'payment_id'],
    fileHints: ['transaction', 'payment', 'transfer'],
  },
  {
    key: 'payment.amount',
    label: 'Amount',
    group: 'Payment Transaction',
    required: true,
    aliases: ['amount', 'amt', 'payment_amount', 'transaction_amount'],
    valueHints: ['number'],
  },
  {
    key: 'payment.time',
    label: 'Transaction Time',
    group: 'Payment Transaction',
    required: false,
    aliases: ['timestamp', 'time', 'event_time', 'created_at', 'transaction_time'],
    valueHints: ['date'],
  },
  {
    key: 'merchant.id',
    label: 'Merchant',
    group: 'Merchant',
    required: true,
    aliases: ['merchant', 'merchant_id', 'merchant_name'],
    fileHints: ['merchant'],
  },
  {
    key: 'merchant.category',
    label: 'Merchant Category',
    group: 'Merchant',
    required: false,
    aliases: ['merchant_category', 'mcc', 'category'],
    fileHints: ['merchant'],
  },
  {
    key: 'network.ip',
    label: 'IP Address',
    group: 'Network',
    required: false,
    aliases: ['ip', 'ip_address', 'ipaddr', 'client_ip', 'source_ip'],
    valueHints: ['ip'],
  },
  {
    key: 'network.device',
    label: 'Device ID',
    group: 'Network',
    required: false,
    aliases: ['device', 'device_id', 'deviceid', 'browser_id', 'phone_id'],
    valueHints: ['name'],
  },
];

export function getTransactionFraudTargets(): MappingTarget[] {
  return transactionFraudTargets.map(
    ({ key, label, group, required, description }) => ({
      key,
      label,
      group,
      required,
      description,
    }),
  );
}
