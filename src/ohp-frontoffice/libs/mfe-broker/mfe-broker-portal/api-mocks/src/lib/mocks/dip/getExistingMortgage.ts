import { ExistingMortgageRequest, ExistingMortgageResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loanAmount } from '../../constants';

export const existingMortgage: ExistingMortgageResponse = {
  amount: null,
  amountToBeRepaid: null,
  continuingBalance: 0,
  currentOutstandingBalance: null,
  debtConsolidationConfirmation: null,
  estimatedValueOfTheProperty: 100000.0,
  existingLender: null,
  expectedRentalIncome: null,
  isPropertyMortgaged: true,
  isRepaidOnCompletionOfTheApplication: null,
  monthlyPayment: null,
  monthlyRentalIncome: null,
  mortgageAccountNumber: '',
  otherLender: '',
  applicants: [
    {
      isOwner: true,
      applicantId: 1,
      fullName: 'Test Mctesterson',
    },
  ],
  propertyIsLet: null,
  propertyWillBeLetOnCompletionOfThisApplication: null,
  reason: '',
  remainingTermInMonths: null,
  saleOfPropertySupportsARepaymentStrategy: null,
  tenancyAgreementIsInPlace: null,
  applicationDraftId: 1,
  versionNumber: 0,
};

export const putExistingMortgage: ExistingMortgageRequest = {
  isPropertyMortgaged: true,
  ownersOfTheProperty: [1],
  estimatedValueOfTheProperty: 100000.0,
  currentOutstandingBalance: loanAmount - 1000,
  existingLender: 'BARCLAYS',
  otherLender: null,
  isRepaidOnCompletionOfTheApplication: true,
  amountToBeRepaid: loanAmount - 1000,
  continuingBalance: 0,
  versionNumber: 0,
};

interface CreateExistingMortgageOptions {
  amountToBeRepaid: number;
  currentOutstandingBalance: number;
}

const defaultOptions: CreateExistingMortgageOptions = {
  amountToBeRepaid: loanAmount,
  currentOutstandingBalance: loanAmount,
};

export const createPalExistingMortgage = (options?: Partial<CreateExistingMortgageOptions>): ExistingMortgageRequest => {
  const opts = Object.assign({}, defaultOptions, options);

  return {
    isPropertyMortgaged: true,
    ownersOfTheProperty: [1],
    estimatedValueOfTheProperty: 100000.0,
    currentOutstandingBalance: opts.currentOutstandingBalance,
    existingLender: 'BARCLAYS',
    otherLender: null,
    isRepaidOnCompletionOfTheApplication: true,
    amountToBeRepaid: opts.currentOutstandingBalance,
    continuingBalance: 0,
    versionNumber: 0,
  };
};
