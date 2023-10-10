import { AmortizationMethod, LenderFeeType, LoanPart, LoanPartSummary } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { faker } from '@faker-js/faker';

export type Loan = {
  id: number;
  loanPartSummary: LoanPartSummary[];
  loanParts: LoanPart[];
};

export const productCode = 'FIXED60LTV15YEARS';
export const productName = 'April Mortgages Standard';
export const mortgageTerm = 360;
export const productInterestRate = 3.4;
export const purchaseValue = parseInt(faker.finance.amount(100_000, 1_000_000, 0));
export const loanAmount = Math.floor(purchaseValue * 0.75);
export const defaultLTV = 75.0;
export const productFee = 995.0;
export const productFees = [
  { feeAmount: 195.0, feeType: LenderFeeType.APPLICATION_FEE },
  { feeAmount: productFee, feeType: LenderFeeType.PRODUCT_FEE },
];

export const loan1: Loan = {
  id: 1,
  loanPartSummary: [
    {
      loanAmount,
      productCode,
      productName,
      term: mortgageTerm.toString(),
      type: AmortizationMethod.ANNUITY,
    },
  ],
  loanParts: [
    {
      loanPartAmount: loanAmount,
      loanPartId: 1,
      loanPartType: AmortizationMethod.ANNUITY,
      mortgageTerm: mortgageTerm,
      product: {
        baseInterestRate: productInterestRate,
        code: productCode,
        durationInMonths: mortgageTerm,
        interestRate: productInterestRate,
        name: productName,
        productCommercialCode: productCode,
        productCommercialName: productName,
        productFee: null,
        providerCode: null,
        variabilityType: 'Fixed',
      },
      productFees,
      repaymentType: AmortizationMethod.ANNUITY,
    },
  ],
};
