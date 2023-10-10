import {
  CurrentIncomeResponse,
  ExistingMortgageResponse,
  PersonalDetailsResponse,
  ProductSelectionResponse,
  PropertyAndLoanDetailsRequest,
  PropertyAndLoanDetailsResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  applicant1,
  applicationDraft,
  decimal,
  england,
  loan1,
  loanAmount,
  productFee,
  purchaseValue,
  versionNumber,
} from '../../constants';

interface CreatePropertyAndLoanOptions {
  hasCustomerFoundProperty: boolean | null;
  propertyOwnershipType: string | null;
}

const defaultOptions: CreatePropertyAndLoanOptions = {
  hasCustomerFoundProperty: true,
  propertyOwnershipType: 'STANDARD',
};

export const palPropertyAndLoanDetails: PropertyAndLoanDetailsResponse = {
  applicantsLiveInTheProperty: null,
  fullMarketValue: null,
  hasCustomerFoundProperty: null,
  isPurchaseFromFamily: null,
  propertyLocation: england,
  propertyOwnershipType: null,
  purchaseAmount: purchaseValue,
  loanAmount: loanAmount,
  applicationDraftId: applicationDraft.id,
  totalLoanAmount: loanAmount,
  versionNumber,
};

export const palPersonalDetails: PersonalDetailsResponse = {
  applicantPersonalDetails: [
    {
      applicantId: 1,
      birthDate: '1994-03-01T00:00:00',
      contactType: 'FIRST_TIME_BUYER',
      customData: {},
      details: null,
      dualNationalityApplicable: null,
      expectedRetirementAge: null,
      familyName: 'McTesterson',
      familyNamePrefix: null,
      secondName: null,
      financialDependantAdults: null,
      financialDependantChildrenAges: [],
      firstName: 'Test',
      gender: null,
      hasFinancialCommitements: null,
      hasPermanentRightToResideInTheUK: null,
      hasPreviousEmployer: null,
      isApplicantAnExistingLender: null,
      isApplicantPermanentResident: null,
      isApplicantRetired: null,
      maritalStateType: null,
      natureOfVulnerability: null,
      nationality: null,
      previousNameApplicable: null,
      previousNameDetails: null,
      secondNationality: null,
      title: null,
      vulnerableCustomerApplicable: null,
    },
  ],
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const palProductSelection: ProductSelectionResponse = {
  loanParts: loan1.loanParts,
  mortgageClub: null,
  network: '123456',
  purchaseAmount: purchaseValue,
  totalLoanAmount: loanAmount,
  useMortgageClub: false,
  valuationType: 'Undefined',
  loanId: 1,
  versionNumber,
};

export const palCurrentIncome: CurrentIncomeResponse = {
  applicantIncomes: [
    {
      applicantInfo: { applicantId: 1, firstName: 'Test', familyName: 'McTesterson', familyNamePrefix: '' },
      incomeDetails: [],
    },
  ],
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const palExistingMortgage: ExistingMortgageResponse = {
  amount: null,
  amountToBeRepaid: null,
  continuingBalance: null,
  currentOutstandingBalance: null,
  debtConsolidationConfirmation: null,
  estimatedValueOfTheProperty: null,
  existingLender: '',
  expectedRentalIncome: null,
  isPropertyMortgaged: null,
  isRepaidOnCompletionOfTheApplication: null,
  monthlyPayment: null,
  monthlyRentalIncome: null,
  mortgageAccountNumber: '',
  otherLender: '',
  applicants: [{ isOwner: null, applicantId: applicant1.applicantId, fullName: applicant1.fullName }],
  propertyIsLet: null,
  propertyWillBeLetOnCompletionOfThisApplication: null,
  reason: '',
  remainingTermInMonths: null,
  saleOfPropertySupportsARepaymentStrategy: null,
  tenancyAgreementIsInPlace: null,
  applicationDraftId: applicationDraft.id,
  versionNumber,
};

export const createPalSubmitRequest = (options?: Partial<CreatePropertyAndLoanOptions>): PropertyAndLoanDetailsRequest => {
  const opts = Object.assign({}, defaultOptions, options);

  return {
    applicantsLiveInTheProperty: true,
    fullMarketValue: null,
    hasCustomerFoundProperty: opts.hasCustomerFoundProperty,
    isPurchaseFromFamily: null,
    propertyLocation: england,
    propertyOwnershipType: opts.propertyOwnershipType,
    purchasePrice: purchaseValue,
    loanAmount: loanAmount,
    versionNumber,
  };
};

export const createPalSubmitResponse = (options?: Partial<CreatePropertyAndLoanOptions>): PropertyAndLoanDetailsResponse => {
  const opts = Object.assign({}, defaultOptions, options);

  return {
    applicantsLiveInTheProperty: true,
    fullMarketValue: null,
    hasCustomerFoundProperty: opts.hasCustomerFoundProperty,
    isPurchaseFromFamily: null,
    propertyLocation: england,
    propertyOwnershipType: opts.propertyOwnershipType,
    purchaseAmount: purchaseValue,
    loanAmount: loanAmount,
    ltv: decimal,
    totalLoanAmount: loanAmount + productFee,
    versionNumber,
  };
};
