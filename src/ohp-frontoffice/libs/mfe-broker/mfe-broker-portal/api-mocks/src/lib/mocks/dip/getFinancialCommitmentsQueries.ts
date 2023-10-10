import { FinancialCommitmentsRequest, FinancialCommitmentsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const financialCommitments: FinancialCommitmentsResponse = {
  applicantFinancialCommitments: [
    {
      applicantInfo: { applicantId: 1, firstName: 'Test', familyName: 'McTesterson', familyNamePrefix: '' },
      hasFinancialCommitements: null,
      financialCommitments: [],
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const putFinancialCommitments: FinancialCommitmentsRequest = {
  applicantFinancialCommitments: [{ applicantId: 1, hasFinancialCommitements: false, financialCommitments: [] }],
  versionNumber: 0,
};
