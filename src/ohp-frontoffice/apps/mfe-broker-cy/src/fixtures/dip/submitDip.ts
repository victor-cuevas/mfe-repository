import { FormData } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const submitPropertyAndLoanDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /property location/i, value: 'England' } },
  { type: 'RADIO', details: { matcher: /found a property/i, value: /yes/i } },
  { type: 'RADIO', details: { matcher: /main residence/i, value: /yes/i } },
  { type: 'DROPDOWN', details: { matcher: /ownership type/i, value: 'Standard' } },
  { type: 'INPUT', details: { matcher: /purchase price/i, value: 200000 } },
  { type: 'INPUT', details: { matcher: /total loan amount/i, value: 150000 } },
];

export const submitSpAddress = {
  matcher: /address/i,
  value: '22 London Road, London, E13 0DN',
};

export const submitSecurityProperty: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /property style/i, value: 'Semi-detached' } },
  { type: 'DROPDOWN', details: { matcher: /property type/i, value: 'House' } },
  { type: 'DROPDOWN', details: { matcher: /tenure/i, value: 'Freehold' } },
  { type: 'INPUT', details: { matcher: /year built/i, value: 1960 } },
  { type: 'INPUT', details: { matcher: /number of bedrooms/i, value: 3 } },
  { type: 'DROPDOWN', details: { matcher: /standard construction/i, value: 'Brick/Stone' } },
  { type: 'DROPDOWN', details: { matcher: /standard roof/i, value: 'Tile/slate' } },
  { type: 'DROPDOWN', details: { matcher: /listed building/i, value: 'Grade II' } },
  { type: 'DROPDOWN', details: { matcher: /new build/i, value: 'Existing building' } },
];

export const submitDepositDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /source of deposit/i, value: 'Savings' } },
  { type: 'INPUT', details: { matcher: /amount to deposit/i, value: 50000 } },
];

export const submitAdviceAndFees: FormData[] = [
  { type: 'INPUT', details: { matcher: /fee amount/i, value: 500 } },
  { type: 'DROPDOWN', details: { matcher: /when payable/i, value: 'On completion' } },
  { type: 'INPUT', details: { matcher: /payable to/i, value: 'Brock McBroker' } },
];

export const submitProductSelection: FormData[] = [
  {
    type: 'INPUT',
    details: { matcher: /Years/i, value: 20 },
  },
];

export const submitPersonalDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /title/i, value: 'Mr' } },
  { type: 'RADIO', details: { matcher: /different name/i, value: 'No' } },
  { type: 'DROPDOWN', details: { matcher: /marital status/i, value: 'Single' } },
  { type: 'RADIO', details: { matcher: /is retired/i, value: 'No' } },
  { type: 'INPUT', details: { matcher: /expected retirement/i, value: 70 } },
  { type: 'DROPDOWN', details: { matcher: /country of nationality/i, value: 'United Kingdom' } },
  { type: 'RADIO', details: { matcher: /dual nationality/i, value: 'No' } },
  // TODO restore when fields is visible again
  // { type: 'RADIO', details: { matcher: /permanent .* resident/i, value: 'Yes' } },
  { type: 'RADIO', details: { matcher: /vulnerable customer/i, value: 'No' } },
];

export const submitAhAddressType = {
  matcher: /address type/i,
  value: 'UK',
};

export const submitAhAddress = {
  matcher: /address \*/i,
  value: '22 London Road, London, SE23 3HF',
};

export const submitAddressHistory: FormData[] = [
  { type: 'DATE', details: { matcher: /move-in date/i, value: '01/08/2010' } },
  { type: 'DROPDOWN', details: { matcher: /occupancy/i, value: 'Owner occupier' } },
];

export const submitFinancialCommitments = {
  matcher: /financial commitments/i,
  value: 'No',
};

export const submitHouseholdExpenditure: FormData[] = [
  {
    type: 'INPUT',
    details: { matcher: /service charge/i, value: 22 },
  },
];

export const submitCurrentIncome: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Employed' } },
  { type: 'DROPDOWN', details: { matcher: /contract type/i, value: 'Permanent' } },
  { type: 'DATE', details: { matcher: /contract start date/i, value: '01/01/2010' } },
  { type: 'INPUT', details: { matcher: /job title/i, value: 'fake job title' } },
  { type: 'INPUT', details: { matcher: /company name/i, value: 'fake company' } },
  { type: 'RADIO', details: { matcher: /income .* verified/i, value: 'Yes' } },
  { type: 'DROPDOWN', details: { matcher: /salary or daily/i, value: 'Salary' } },
  { type: 'INPUT', details: { matcher: /basic salary/i, value: 200000 } },
  { type: 'DROPDOWN', details: { matcher: /frequency/i, value: 'Annually' } },
];

export const submitFutureChanges = {
  matcher: /future changes/i,
  value: 'No',
};

export const submitConfirmDip: FormData[] = [
  {
    type: 'CHECKBOX',
    details: { matcher: /customer consents/i, value: null },
  },
];
