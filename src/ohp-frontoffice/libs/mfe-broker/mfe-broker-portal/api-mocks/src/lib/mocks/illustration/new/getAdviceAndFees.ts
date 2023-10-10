import { AdviceAndFeesResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getIllustrationAdviceAndFees: AdviceAndFeesResponse = {
  adviceAccepted: null,
  adviceGiven: null,
  intermediaryFees: [],
  lenderFees: [
    {
      feeType: 'VALUATION_FEE',
      name: 'FREE_VALUATION',
      paymentMethod: 'DIRECT',
      valuationType: 'FREE_VALUATION',
      feeAmount: 0.0,
    },
  ],
  loanId: 1,
  versionNumber: 0,
};
