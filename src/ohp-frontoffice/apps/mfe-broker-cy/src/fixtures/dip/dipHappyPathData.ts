import { FormData } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const propertyAndLoanDetails: FormData[] = [
  { type: 'RADIO', details: { matcher: /found a property/i, value: /yes/i } },
  { type: 'RADIO', details: { matcher: /main residence/i, value: /yes/i } },
  { type: 'DROPDOWN', details: { matcher: /ownership type/i, value: 'Standard' } },
];

export const spAddress = {
  matcher: /address/i,
  value: 'Oxford Street Eatery, 46-50 New Oxford Street, London, WC1A 1ES',
};

export const securityProperty: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /property style/i, value: 'Semi-detached' } },
  { type: 'DROPDOWN', details: { matcher: /property type/i, value: 'House' } },
  { type: 'DROPDOWN', details: { matcher: /tenure/i, value: 'Leasehold' } },
  { type: 'INPUT', details: { matcher: /remaining term of lease/i, value: 85 } },
  { type: 'INPUT', details: { matcher: /year built/i, value: 1960 } },
  { type: 'INPUT', details: { matcher: /number of bedrooms/i, value: 3 } },
  { type: 'DROPDOWN', details: { matcher: /standard construction/i, value: 'Brick/Stone' } },
  { type: 'DROPDOWN', details: { matcher: /standard roof/i, value: 'Tile/slate' } },
  { type: 'DROPDOWN', details: { matcher: /listed building/i, value: 'No' } },
  { type: 'DROPDOWN', details: { matcher: /new build/i, value: 'Existing building' } },
];

export const depositDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /source of deposit/i, value: 'Savings' } },
  { type: 'INPUT', details: { matcher: /amount to deposit/i, value: 20000 } },
];

export const adviceAndFees: FormData[] = [
  { type: 'INPUT', details: { matcher: /fee amount/i, value: 8000 } },
  { type: 'DROPDOWN', details: { matcher: /when payable/i, value: 'On completion' } },
  { type: 'INPUT', details: { matcher: /payable to/i, value: 'Brock McBroker' } },
];

export const personalDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /title/i, value: 'Lord' } },
  { type: 'RADIO', details: { matcher: /different name/i, value: 'No' } },
  { type: 'DROPDOWN', details: { matcher: /marital status/i, value: 'Single' } },
  { type: 'RADIO', details: { matcher: /is retired/i, value: 'No' } },
  { type: 'INPUT', details: { matcher: /expected retirement/i, value: 60 } },
  { type: 'DROPDOWN', details: { matcher: /country of nationality/i, value: 'United Kingdom' } },
  { type: 'RADIO', details: { matcher: /dual nationality/i, value: 'No' } },
  // TODO restore when fields is visible again
  // { type: 'RADIO', details: { matcher: /permanent .* resident/i, value: 'Yes' } },
  { type: 'RADIO', details: { matcher: /vulnerable customer/i, value: 'No' } },
];

export const ahAddressTypeUK = {
  matcher: /address type/i,
  value: 'UK',
};

export const ahAddressTypeBFPO = {
  matcher: /address type/i,
  value: 'BFPO',
};

export const ahAddressTypeOverseas = {
  matcher: /address type/i,
  value: 'Overseas',
};

export const ahAddressAutocomplete = {
  matcher: /address \*/i,
  value: 'Buckingham Palace, London, SW1A 1AA',
};

export const ahAddressAutocompleteDifferentAddress = {
  matcher: /address \*/i,
  value: 'Museum and art gallery, Bristol, SW1A 1AA',
};

export const addressHistory: FormData[] = [
  { type: 'DATE', details: { matcher: /move-in date/i, value: '01/08/2010' } },
  { type: 'DROPDOWN', details: { matcher: /occupancy/i, value: 'Tenant (private)' } },
];

export const financialCommitments = {
  matcher: /financial commitments/i,
  value: 'No',
};

export const householdExpenditure: FormData[] = [
  { type: 'INPUT', details: { matcher: /service charge/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /ground rent/i, value: 500 } },
  { type: 'INPUT', details: { matcher: /childcare and/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /school/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /maintenance/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /tenancy/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /other monthly/i, value: 100 } },
  { type: 'INPUT', details: { matcher: /details of other expenses/i, value: 'fake details' } },
];

export const currentIncome: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Employed' } },
  { type: 'DROPDOWN', details: { matcher: /contract type/i, value: 'Permanent' } },
  { type: 'DATE', details: { matcher: /contract start date/i, value: '01/01/2010' } },
  { type: 'INPUT', details: { matcher: /job title/i, value: 'fake job title' } },
  { type: 'INPUT', details: { matcher: /company name/i, value: 'fake company' } },
  { type: 'RADIO', details: { matcher: /income .* verified/i, value: 'Yes' } },
  { type: 'DROPDOWN', details: { matcher: /salary or daily/i, value: 'Salary' } },
  { type: 'INPUT', details: { matcher: /basic salary/i, value: 2000 } },
  { type: 'DROPDOWN', details: { matcher: /frequency/i, value: 'Monthly' } },
];

export const futureChanges = {
  matcher: /future changes/i,
  value: 'No',
};

export const confirmDip: FormData[] = [{ type: 'CHECKBOX', details: { matcher: /customer consents/i, value: null } }];
