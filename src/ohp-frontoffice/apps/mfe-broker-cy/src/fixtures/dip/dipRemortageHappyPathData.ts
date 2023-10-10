import { loanAmount } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { FormData } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const propertyAndLoanDetails: FormData[] = [
  {
    type: 'RADIO',
    details: { matcher: /main residence/i, value: /yes/i },
  },
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

export const existingMortgages: FormData[] = [
  { type: 'RADIO', details: { matcher: /property mortgaged/i, value: /yes/i } },
  { type: 'CHECKBOX', details: { matcher: /owners of the property/i, value: null } },
  { type: 'INPUT', details: { matcher: /current outstanding balance/i, value: loanAmount - 1000 } },
  { type: 'DROPDOWN', details: { matcher: /existing lender/i, value: 'Barclays' } },
  { type: 'RADIO', details: { matcher: /to be fully repaid/i, value: /yes/i } },
];

export const existingMortgagesDepositDetail: FormData[] = [
  { type: 'RADIO', details: { matcher: /property mortgaged/i, value: /yes/i } },
  { type: 'CHECKBOX', details: { matcher: /owners of the property/i, value: null } },
  { type: 'INPUT', details: { matcher: /current outstanding balance/i, value: loanAmount + 1000 } },
  { type: 'DROPDOWN', details: { matcher: /existing lender/i, value: 'Barclays' } },
  { type: 'RADIO', details: { matcher: /to be fully repaid/i, value: /yes/i } },
];

export const additionalBorrowing: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /reason/i, value: 'Home improvements' } },
  { type: 'INPUT', details: { matcher: /amount/i, value: loanAmount } },
];

export const depositDetails: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /source of deposit/i, value: 'Savings' } },
  { type: 'INPUT', details: { matcher: /amount to deposit/i, value: 20000 } },
];

export const existingMortgagesAmountToBeRepaidEqualTotalLoanAmount: FormData[] = [
  { type: 'RADIO', details: { matcher: /property mortgaged/i, value: /yes/i } },
  { type: 'CHECKBOX', details: { matcher: /owners of the property/i, value: null } },
  { type: 'INPUT', details: { matcher: /current outstanding balance/i, value: loanAmount } },
  { type: 'DROPDOWN', details: { matcher: /existing lender/i, value: 'Barclays' } },
  { type: 'RADIO', details: { matcher: /to be fully repaid/i, value: /yes/i } },
];
