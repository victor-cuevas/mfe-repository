import { FMASummaryResponse, LoanStage, LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicant1 } from '../../constants';
import { loan1 } from '../../constants/loan';

export const createFmaSummary = (status = LoanStatus.InProgress): FMASummaryResponse => {
  return {
    applicants: [
      {
        contactMethod: 'MOBILE_PHONE',
        email: applicant1.email,
        phone: applicant1.phone,
        applicantId: applicant1.applicantId,
        fullName: applicant1.fullName,
      },
    ],
    loan: {
      loanId: loan1.id,
      loanPartSummary: loan1.loanPartSummary,
      rejectionReasons: [],
      stage: LoanStage.Fma,
      status,
    },
    feesToBePaid: {
      areFeesPaid: false,
      lenderFees: [
        {
          feeType: 'APPLICATION_FEE',
          name: null,
          paymentMethod: 'DIRECT',
          valuationType: null,
          feeAmount: 195.0,
        },
        {
          feeType: 'VALUATION_FEE',
          name: null,
          paymentMethod: 'DIRECT',
          valuationType: 'FREE_VALUATION',
          feeAmount: 0.0,
        },
      ],
      productFees: [],
    },
    loanId: loan1.id,
    securityProperty: null,
    stage: 'FMA',
    status: status,
    applicationDraftId: 1,
    versionNumber: 0,
  };
};
