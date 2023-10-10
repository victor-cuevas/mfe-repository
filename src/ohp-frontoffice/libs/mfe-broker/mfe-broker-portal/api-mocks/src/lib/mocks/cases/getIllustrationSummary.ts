import { IllustrationSummaryResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicationDraft } from '../../constants';

export const getIllustrationSummary: IllustrationSummaryResponse = {
  applicationDraftId: applicationDraft.id,
  illustrationSummaries: [
    {
      loanId: 2,
      stage: 'ILLUSTRATION',
      status: 'IN_PROGRESS',
      totalLoanAmount: 400000.0,
      purchasePrice: 500000.0,
      date: '2022-05-25T08:27:32.1917048',
      loanParts: [
        {
          loanAmount: 400000.0,
          productCode: 'FIXED75LTV5YEARS',
          productName: 'April Mortgages Standard',
          term: '360',
          type: 'ANNUITY',
        },
      ],
    },
    {
      loanId: 1,
      stage: 'ILLUSTRATION',
      status: 'COMPLETED',
      totalLoanAmount: 400000.0,
      purchasePrice: 500000.0,
      date: '2022-06-14T10:02:30.3746809',
      loanParts: [
        {
          loanAmount: 400000.0,
          productCode: 'FIXED60LTV15YEARS',
          productName: 'April Mortgages Standard',
          term: '360',
          type: 'ANNUITY',
        },
      ],
    },
  ],
};
