import { AffordabilityCheckResponse, DipSummaryResponse, LoanStateResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const affordability: AffordabilityCheckResponse = {
  affordabilityRatio: 0.75724,
  maximumLoanAmount: 105646.21,
  totalLoanAmount: 80000.0,
  duration: 216,
};

export const submitDip: LoanStateResponse = {
  changeDate: '2022-08-24T17:10:57.9667782+00:00',
  createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  dossierNumber: '1',
  loanId: 1,
  stage: 'DIP',
  status: 'Assessment',
  traceId: 'c4359266bdedb75dd914981b88a58c1c',
  externalReference: '9f75a6db-e018-4e2b-bfb3-a50ab809d145/2',
};

export const confirmDipSummary: DipSummaryResponse = {
  applicants: [{ employmentStatus: 'EMPLOYED', netMonthlyIncome: null, applicantId: 1, fullName: 'Test McTesterson' }],
  expirationDateTime: '2022-09-17T09:52:36.2407222',
  loan: {
    loanId: 1,
    loanPartSummary: [
      {
        loanAmount: 80000.0,
        productCode: 'FIXED75LTV12YEARS',
        productName: 'April Mortgages Standard',
        term: '180',
        type: 'ANNUITY',
      },
    ],
    rejectionReasons: [],
    stage: 'DIP',
    status: 'Completed',
  },
  stage: 'DIP',
  status: 'InProgress',
  applicationDraftId: 1,
  versionNumber: 0,
};
