import { LoanProgressResponse, PropertyAndLoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicationDraft, case1, england, loanAmount, purchaseValue, versionNumber } from '../../constants';

const tuple = <T extends string[]>(...args: T) => args;
const Steps = tuple(
  'addressHistory',
  'adviceFees',
  'currentIncome',
  'depositDetails',
  'financialCommitments',
  'futureChanges',
  'householdExpenditure',
  'personalDetails',
  'productSelection',
  'propertyAndLoan',
  'securityProperty',
);
type Steps = typeof Steps[number];

export const dipProgress: LoanProgressResponse = {
  progress: {
    addressHistory: 'VALID',
    adviceFees: 'VALID',
    currentIncome: 'VALID',
    depositDetails: 'VALID',
    financialCommitments: 'VALID',
    futureChanges: 'VALID',
    householdExpenditure: 'VALID',
    personalDetails: 'VALID',
    productSelection: 'VALID',
    propertyAndLoan: 'VALID',
    securityProperty: 'VALID',
  },
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const progressPropertyAndLoan: PropertyAndLoanDetailsResponse = {
  applicantsLiveInTheProperty: true,
  fullMarketValue: null,
  hasCustomerFoundProperty: true,
  isPurchaseFromFamily: null,
  propertyLocation: england,
  propertyOwnershipType: 'STANDARD',
  purchaseAmount: purchaseValue,
  totalLoanAmount: loanAmount,
  applicationDraftId: applicationDraft.id,
  loanAmount: loanAmount,
  versionNumber,
};

export const markDipProgressSteps = (steps: Steps[] | 'all'): LoanProgressResponse => {
  const progress = Steps.reduce((acc, step) => {
    if (steps === 'all' || steps.includes(step)) {
      return {
        ...acc,
        [step]: 'VALID',
      };
    } else {
      return acc;
    }
  }, {});

  return {
    progress,
    applicationDraftId: case1.applicationDraftId,
    versionNumber: 1,
  };
};
