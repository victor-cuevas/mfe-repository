import { AffordabilityCheckResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loanAmount, mortgageTerm, versionNumber } from '../../constants';

export const putFmaAffordabilityCheck: AffordabilityCheckResponse = {
  affordabilityRatio: 0.3,
  maximumLoanAmount: loanAmount * 10,
  totalLoanAmount: loanAmount,
  duration: mortgageTerm,
  loanVersionNumber: versionNumber,
};
