import {
  AmortizationMethod,
  LoanProductAvailabilityResponse,
  PaymentTermResponse,
  ProductSelectionResponse,
  SubmissionRouteAssociationModelEx,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  applicationDraft,
  defaultLTV,
  firm1,
  loan1,
  loanAmount,
  mortgageClub1,
  network1,
  mortgageTerm,
  productCode,
  purchaseValue,
  versionNumber,
} from '../../constants';

export const getFmaAssociations: SubmissionRouteAssociationModelEx = {
  firmType: firm1.firmType,
  firmName: firm1.firmName,
  fcaReference: firm1.fcaReference,
  firmId: firm1.id,
  networks: [network1],
  clubs: [mortgageClub1],
  directlyAuthorized: [],
};

export const getFmaProductSelection: ProductSelectionResponse = {
  loanParts: loan1.loanParts,
  mortgageClub: '0ea55e1f',
  network: '123456',
  propertyValuationAmount: null,
  purchaseAmount: purchaseValue,
  totalLoanAmount: loanAmount,
  loanAmount: loanAmount,
  ltv: defaultLTV,
  useMortgageClub: true,
  valuationType: null,
  loanId: loan1.id,
  versionNumber,
};

export const getFmaPaymentTerms: PaymentTermResponse = {
  monthlyPayment: 3444.63,
  monthlyPaymentFeesIncluded: 3454.43,
  totalAmountPayable: 413356.12,
  totalAmountPayableFeesIncluded: 414531.1,
};

export const getFmaProductsAvailability: LoanProductAvailabilityResponse = {
  applicationDraftId: applicationDraft.id,
  loanId: loan1.id,
  ltv: defaultLTV,
  productAvailability: [
    {
      loanPartAmount: loanAmount,
      loanPartId: 1,
      productCode: productCode,
      productType: AmortizationMethod.ANNUITY,
      reasons: [],
      status: 'Ok',
      tomMonths: mortgageTerm % 12,
      tomYears: mortgageTerm / 12,
    },
  ],
  propertyPurchasePrice: purchaseValue,
  totalLoanAmount: loanAmount,
};
