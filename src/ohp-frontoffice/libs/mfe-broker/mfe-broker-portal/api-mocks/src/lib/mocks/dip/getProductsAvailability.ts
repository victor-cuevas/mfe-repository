import { AmortizationMethod, LoanProductAvailabilityResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { case1 } from '../../constants';

interface CreateProductsAvailabilityOptions {
  ltvValue: number;
}

const defaultOptions: CreateProductsAvailabilityOptions = {
  ltvValue: 0,
};

export const createProductsAvailabilityResponse = (
  status: 'success' | 'failure',
  options?: Partial<CreateProductsAvailabilityOptions>,
): LoanProductAvailabilityResponse => {
  const opts = Object.assign({}, defaultOptions, options);

  const response: LoanProductAvailabilityResponse = {
    applicationDraftId: case1.applicationDraftId,
    loanId: case1.loanId,
    ltv: opts.ltvValue,
    productAvailability:
      status === 'success'
        ? [
            {
              loanPartAmount: case1.totalLoanAmount,
              loanPartId: 1,
              productCode: 'FIXED75LTV12YEARS',
              productType: AmortizationMethod.ANNUITY,
              reasons: [],
              status: 'Ok',
              tomMonths: 0,
              tomYears: 12,
            },
          ]
        : [
            {
              loanPartAmount: case1.totalLoanAmount,
              loanPartId: 1,
              productCode: 'FIXED75LTV12YEARS',
              productType: AmortizationMethod.ANNUITY,
              reasons: [],
              status: 'Not available',
              tomMonths: 0,
              tomYears: 12,
            },
          ],
    propertyPurchasePrice: case1.propertyPurchasePrice,
    totalLoanAmount: case1.totalLoanAmount,
  };

  return response;
};
