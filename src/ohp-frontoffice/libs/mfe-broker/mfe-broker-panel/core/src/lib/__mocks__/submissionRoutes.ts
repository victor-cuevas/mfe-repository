import { SubmissionRouteModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { procurationFeesMock } from './procurationFees';

export const submissionRoutesMock: SubmissionRouteModel[] = [
  {
    submissionRouteId: '1',
    reference: 'AAA',
    submissionRouteType: 'MortgageClub',
    firmName: 'Barcelona Mortgages',
    firmFcaReference: 123456,
    fcaStatus: 'active',
    isActivated: true,
    submissionRouteAddress: {
      numberOrBuilding: '12',
      lineOne: 'Passeo de Gracia 110',
      lineTwo: '3o 2a',
      postcode: '08005',
      city: 'Barna',
      country: 'España',
    },
    procurationFees: [procurationFeesMock[1]],
    bankDetails: {
      accountName: 'default',
      accountNumber: 'XXXX',
      sortCode: 'XXX',
    },
  },
  {
    submissionRouteId: '2',
    reference: 'BBB',
    submissionRouteType: 'Network',
    firmName: 'Bratislava Mortgages',
    firmFcaReference: 123457,
    fcaStatus: 'active',
    isActivated: true,
    submissionRouteAddress: {
      numberOrBuilding: '12',
      postcode: '08005',
    },
    procurationFees: [procurationFeesMock[0]],
    bankDetails: {
      accountName: 'default',
      accountNumber: 'XXXX',
      sortCode: 'XXX',
    },
  },
  {
    submissionRouteId: '3',
    reference: 'CCC',
    submissionRouteType: 'Network',
    firmName: 'Amsterdam Mortgages',
    firmFcaReference: 123458,
    fcaStatus: 'active',
    isActivated: true,
    submissionRouteAddress: {
      numberOrBuilding: '12',
      postcode: '08005',
    },
    procurationFees: [procurationFeesMock[1]],
    bankDetails: {
      accountName: 'default',
      accountNumber: 'XXXX',
      sortCode: 'XXX',
    },
  },
];
