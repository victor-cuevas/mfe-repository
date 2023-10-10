import { Address as PartialAddress } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

type Address = Omit<Required<PartialAddress>, 'region' | 'state'>;

export type Case = {
  id: string;
  propertyAddress: Address;
  applicationDraftId: number;
  loanId: number;
  propertyPurchasePrice: number;
  totalLoanAmount: number;
};

export const case1: Case = {
  id: 'APR00000001',
  propertyAddress: {
    addressLine1: 'Oxford Street Eatery',
    addressLine2: '46-50 New Oxford Street',
    addressLine3: null,
    addressLine4: null,
    addressLine5: null,
    addressType: 'UK',
    city: 'LONDON',
    country: 'GB',
    zipCode: 'WC1A 1ES',
  },
  applicationDraftId: 1,
  loanId: 1,
  propertyPurchasePrice: 100_000,
  totalLoanAmount: 80000.0,
};
