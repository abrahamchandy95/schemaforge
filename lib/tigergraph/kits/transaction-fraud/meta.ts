import type { KitMeta } from '@/lib/tigergraph/kits/types';

export const transactionFraudKit: KitMeta = {
  key: 'transaction-fraud',
  solutionKitId: 'transaction_fraud',
  title: 'Transaction Fraud',
  summary:
    'Reference transaction fraud graph with parties, cards, merchants, transactions, devices, IPs, addresses, and location hierarchy.',
  expectedFields: [
    {
      name: 'id',
      required: true,
      aliases: ['id', 'party_id', 'customer_id', 'person_id'],
      description: 'Base person or party identifier',
    },
    {
      name: 'first_name',
      required: false,
      aliases: ['first_name', 'firstname', 'given_name'],
      description: 'Party first name',
    },
    {
      name: 'last_name',
      required: false,
      aliases: ['last_name', 'lastname', 'surname', 'family_name'],
      description: 'Party last name',
    },
    {
      name: 'address',
      required: false,
      aliases: ['address', 'street_address', 'addr'],
      description: 'Street address',
    },
    {
      name: 'city',
      required: false,
      aliases: ['city', 'town'],
      description: 'City name',
    },
    {
      name: 'state',
      required: false,
      aliases: ['state', 'province', 'region'],
      description: 'State or region',
    },
    {
      name: 'zipcode',
      required: false,
      aliases: ['zip', 'zipcode', 'postal_code', 'postcode'],
      description: 'Zip or postal code',
    },
    {
      name: 'dob',
      required: false,
      aliases: ['dob', 'birth_date', 'date_of_birth'],
      description: 'Date of birth',
    },
    {
      name: 'phone',
      required: false,
      aliases: ['phone', 'phone_number', 'mobile', 'telephone'],
      description: 'Phone number',
    },
    {
      name: 'email',
      required: false,
      aliases: ['email', 'email_address', 'mail'],
      description: 'Email address',
    },
    {
      name: 'ip',
      required: false,
      aliases: ['ip', 'ip_address', 'ipaddr', 'client_ip'],
      description: 'IP address',
    },
    {
      name: 'device',
      required: false,
      aliases: ['device', 'device_id', 'deviceid', 'browser_id'],
      description: 'Device identifier',
    },
    {
      name: 'card',
      required: false,
      aliases: ['card', 'card_id', 'card_number', 'pan'],
      description: 'Card identifier',
    },
    {
      name: 'transaction',
      required: true,
      aliases: ['transaction', 'transaction_id', 'payment_transaction', 'tx_id'],
      description: 'Payment transaction identifier',
    },
    {
      name: 'merchant',
      required: true,
      aliases: ['merchant', 'merchant_id', 'merchant_name'],
      description: 'Merchant identifier',
    },
    {
      name: 'merchant_category',
      required: false,
      aliases: ['merchant_category', 'mcc', 'category'],
      description: 'Merchant category',
    },
    {
      name: 'amount',
      required: true,
      aliases: ['amount', 'amt', 'payment_amount', 'transaction_amount'],
      description: 'Transaction amount',
    },
    {
      name: 'timestamp',
      required: false,
      aliases: ['timestamp', 'time', 'event_time', 'created_at'],
      description: 'Transaction event time',
    },
  ],
};
