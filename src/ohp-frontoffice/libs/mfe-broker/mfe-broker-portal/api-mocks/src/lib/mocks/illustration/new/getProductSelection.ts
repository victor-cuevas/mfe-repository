import { LoanProductAvailabilityResponse, ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getIllustrationProductSelection: ProductSelectionResponse = {
  loanParts: [],
  mortgageClub: null,
  network: null,
  purchaseAmount: null,
  totalLoanAmount: null,
  loanAmount: null,
  ltv: 0.0,
  useMortgageClub: null,
  valuationType: null,
  loanId: 1,
  versionNumber: 0,
};

export const getIllustrationProductsAvailability: LoanProductAvailabilityResponse = {
  applicationDraftId: 1418,
  loanId: 1692,
  ltv: 0.0,
  productAvailability: [],
  propertyPurchasePrice: 1.0,
  totalLoanAmount: 0.0,
};
