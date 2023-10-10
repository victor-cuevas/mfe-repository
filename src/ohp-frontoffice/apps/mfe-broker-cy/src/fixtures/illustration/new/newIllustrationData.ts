import { loanAmount, purchaseValue, defaultLTV } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { faker } from '@faker-js/faker';

export const newIllustration = {
  loanDetails: {
    purchasePrice: {
      matcher: /purchase price/i,
      value: purchaseValue,
    },
    propertyLocation: {
      matcher: /property location/i,
      value: 'England',
    },
    totalLoanAmount: {
      matcher: /total loan amount/i,
      value: loanAmount,
    },
  },
  productSelection: {
    termOfMortgage: {
      matcher: /years/i,
      value: 10,
    },
    ltv: {
      matcher: /ltv/i,
      value: defaultLTV,
    },
    loanAmount: {
      matcher: /loan amount/i,
      value: loanAmount,
    },
    totalLoanAmount: {
      matcher: /total loan amount/i,
      value: loanAmount,
    },
  },
  adviceAndFees: {
    feeAmount: {
      matcher: /fee amount/i,
      value: 10_000,
    },
    whenPayable: {
      matcher: /when payable/i,
      value: 'On completion',
    },
    payableTo: {
      matcher: /payable to/i,
      value: faker.name.firstName(),
    },
  },
};
