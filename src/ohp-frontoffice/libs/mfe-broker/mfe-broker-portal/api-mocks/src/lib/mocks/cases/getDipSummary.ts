import { DipSummaryResponse, LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicant1, loan1 } from '../../constants';

export const createDipSummary = (status: LoanStatus = LoanStatus.InProgress): DipSummaryResponse => {
  return {
    applicants: [
      {
        employmentStatus: applicant1.employmentStatus,
        netMonthlyIncome: null,
        applicantId: applicant1.applicantId,
        fullName: applicant1.fullName,
      },
    ],
    expirationDateTime: '2022-08-25T07:16:43.7058226',
    loan: {
      loanId: loan1.id,
      loanPartSummary: loan1.loanPartSummary,
      rejectionReasons: [],
      stage: 'DIP',
      status: status,
    },
    stage: 'DIP',
    status: 'IN_PROGRESS',
    applicationDraftId: 1,
    versionNumber: 0,
  };
};
