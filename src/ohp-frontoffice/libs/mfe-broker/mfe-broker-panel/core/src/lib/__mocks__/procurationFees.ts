import { ProcurationFee } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

export const procurationFeesMock: ProcurationFee[] = [
  {
    applicationType: 'NewLending',
    submissionRouteType: 'MortgageClub',
    completionFee: {
      value: 1000,
      unit: 'BasisPoints',
    },
    trailFee: {
      value: 1000,
      unit: 'Currency',
      basis: 'OutstandingBalance',
      startingMonth: 1,
      periodInMonths: 24,
      endingType: 'InitialTermUnlessRedeemed',
    },
  },
  {
    applicationType: 'Remortgage',
    submissionRouteType: 'MortgageClub',
    completionFee: {
      value: 700,
      unit: 'Currency',
      basis: 'LoanAmount',
    },
    trailFee: {
      value: 1000,
      unit: 'Currency',
      basis: 'OutstandingBalance',
      startingMonth: 1,
      periodInMonths: 24,
      endingType: 'InitialTermUnlessRedeemed',
    },
  },
];
