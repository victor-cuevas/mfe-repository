import { FirmType, SubmissionRoute } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const firm1 = {
  id: 'MockFirm',
  firmType: FirmType.DirectlyAuthorized,
  firmName: 'Mock Firm',
  fcaReference: 1,
};

export const mortgageClub1: SubmissionRoute = {
  id: '0ea55e1f',
  submissionRouteType: 'MortgageClub',
  firmName: 'Cool Mortgage Club',
  firmFcaReference: 2,
  isActivated: true,
  isInReview: false,
  submissionRouteAddress: {
    numberOrBuilding: '1',
    postcode: '123 NE2',
  },
  procurationFees: [],
  bankDetails: {
    accountName: 'ABC',
    accountNumber: '12345678',
    sortCode: '303030',
  },
};

export const network1: SubmissionRoute = {
  id: '1',
  reference: '123456',
  submissionRouteType: 'Network',
  firmName: 'General Bank',
  firmFcaReference: 892210,
  fcaStatus: 'Wrong firm FCA reference number',
  isActivated: true,
  isInReview: true,
  submissionRouteAddress: {
    numberOrBuilding: '7-9',
    postcode: 'W2 6LG',
    city: 'London',
    country: 'UK',
    lineOne: 'Bank Street',
    lineTwo: 'Bankley',
    lineThree: 'Banking Falls',
  },
  procurationFees: [
    {
      applicationType: 'NewLending',
      submissionRouteType: 'Network',
      completionFee: { value: 0.0, unit: 'BasisPoints', basis: 'LoanAmount' },
      trailFee: {
        value: 0.0,
        unit: 'BasisPoints',
        basis: 'LoanAmount',
        startingMonth: 60,
        periodInMonths: 12,
        endingType: 'Redemption',
      },
      isDefault: false,
    },
    {
      applicationType: 'Remortgage',
      submissionRouteType: 'Network',
      completionFee: { value: 700.0, unit: 'Currency' },
      trailFee: { value: 1000.0, unit: 'Currency', startingMonth: 1, periodInMonths: 24, endingType: 'Redemption' },
      isDefault: false,
    },
  ],
  bankDetails: { accountName: 'string', accountNumber: '88837491', sortCode: '08-90-12' },
};
