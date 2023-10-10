import { applicant1 } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { FormData } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const contactDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /preferred contact phone/i, value: /mobile phone/i } },
  { type: 'INPUT', details: { matcher: /mobile phone \*/i, value: applicant1.phone } },
  { type: 'INPUT', details: { matcher: /email/i, value: applicant1.email } },
];

export const securityProperty: FormData[] = [
  { type: 'INPUT', details: { matcher: /floors/i, value: 1 } },
  { type: 'INPUT', details: { matcher: /bathrooms/i, value: 2 } },
  { type: 'INPUT', details: { matcher: /kitchens/i, value: 3 } },
  { type: 'INPUT', details: { matcher: /reception/i, value: 4 } },
  { type: 'DROPDOWN', details: { matcher: /parking/i, value: /dedicated/i } },
  { type: 'RADIO', details: { matcher: /plot size/i, value: /no/i } },
  { type: 'RADIO', details: { matcher: /subsidence/i, value: /no/i } },
  { type: 'RADIO', details: { matcher: /habitable/i, value: /yes/i } },
  { type: 'RADIO', details: { matcher: /local authority/i, value: /no/i } },
  { type: 'RADIO', details: { matcher: /over .* 17/i, value: /no/i } },
  { type: 'RADIO', details: { matcher: /business/i, value: /no/i } },
];

export const valuationDetails: FormData[] = [{ type: 'DROPDOWN', details: { matcher: /contact/i, value: applicant1.fullName } }];

export const bankAccount: FormData[] = [
  { type: 'CHECKBOX', details: { matcher: new RegExp(applicant1.fullName, 'i'), value: null } },
  { type: 'INPUT', details: { matcher: /sort code/i, value: 123456 } },
  { type: 'INPUT', details: { matcher: /account number/i, value: 12345678 } },
  { type: 'DROPDOWN', details: { matcher: /day of the month/i, value: /23/i } },
];

export const lendingPolicyCheck: FormData[] = [
  { type: 'CHECKBOX', details: { matcher: /terms and conditions/i, value: null } },
  { type: 'CHECKBOX', details: { matcher: /credit reference agency/i, value: null } },
  { type: 'CHECKBOX', details: { matcher: /verification documents/i, value: null } },
];
