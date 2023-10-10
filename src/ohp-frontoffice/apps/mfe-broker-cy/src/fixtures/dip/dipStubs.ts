import { CaseStatusEnum, DraftStage, LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  adviceAndFees,
  affordability,
  ahAddressHistory,
  ahAddressHistoryTwoApplicants,
  ahAddressRegisterOtherAddressResponse,
  ahAddressRegisterPayload,
  ahAddressRegisterResponse,
  ahAddressSearchOtherAddressPayload,
  ahAddressSearchOtherAddressResponse,
  ahAddressSearchPayload,
  ahAddressSearchResponse,
  applicationDraft,
  calculationPaymentTerms,
  caseById,
  ciCurrentIncome,
  confirmDipSummary,
  createCaseResponse,
  createDipSummaryResponse,
  createPalSubmitRequest,
  createPalSubmitResponse,
  createProductsAvailabilityResponse,
  createProductSelectionResponse,
  decimal,
  depositDetails,
  dipSummary,
  financialCommitments,
  firmAssociations,
  futureChanges,
  getCaseById,
  heHouseholdExpenditure,
  heSecurityProperty,
  loan1,
  markDipProgressSteps,
  palCurrentIncome,
  palExistingMortgage,
  palPersonalDetails,
  palProductSelection,
  palPropertyAndLoanDetails,
  pdPersonalDetails,
  progressPropertyAndLoan,
  putAddressHistory,
  putAddressHistoryTwoApplicants,
  putAdviceAndFees,
  putCurrentIncome,
  putFinancialCommitments,
  putFutureChanges,
  putHouseholdExpenditures,
  putPersonalDetails,
  spAddressRegisterPayload,
  spAddressRegisterResponse,
  spAddressSearchPayload,
  spAddressSearchResponse,
  spSecurityProperty,
  spSubmitSecurityPropertyPayload,
  spSubmitSecurityPropertyResponse,
  submitDepositPayload,
  submitDepositResponse,
  submitDip,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const caseSummaryStubs: IStub[] = [
  { method: 'GET', endpoint: `/cases/${getCaseById.caseId}`, alias: 'getCaseById', stub: getCaseById },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: dipSummary },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: {}, options: { statusCode: 204 } },
  {
    method: 'GET',
    endpoint: '/illustrationsummary$',
    alias: 'getIllustrationSummary',
    stub: {},
    options: { statusCode: 204 },
  },
];

export const globalDipStubs: IStub[] = [
  { method: 'PUT', endpoint: '/progress$', alias: 'putProgress', stub: {} },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: {} },
  {
    method: 'PUT',
    endpoint: `/dip/${applicationDraft.id}/.*/${loan1.id}`,
    alias: 'putDipDetails',
    stub: {},
  },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: palPersonalDetails },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: palCurrentIncome },
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: palProductSelection,
  },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage', stub: palExistingMortgage },
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailabiliy',
    stub: createProductsAvailabilityResponse('success', { ltvValue: decimal }),
  },
];

export const dipProgressStubs: IStub[] = [
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: markDipProgressSteps('all') },
  {
    method: 'PUT',
    endpoint: `/dip/${applicationDraft.id}/.*/${loan1.id}`,
    alias: 'putDipDetails',
    stub: {},
  },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: {} },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: {} },
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: progressPropertyAndLoan,
  },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage', stub: {} },
];

export const propertyAndLoanDetailsStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: palPropertyAndLoanDetails,
  },
];

export const submitPropertyAndLoanStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'putPropertyAndLoanDetails',
    options: { expectedReqPayload: createPalSubmitRequest() },
    stub: createPalSubmitResponse(),
  },
];

export const securityPropertyStubs: IStub[] = [
  { method: 'GET', endpoint: '/securityproperty$', alias: 'getSecurityProperty', stub: spSecurityProperty },
  {
    method: 'POST',
    endpoint: '/Address/search',
    alias: 'postAddressSearch',
    stub: spAddressSearchResponse,
    options: { expectedReqPayload: spAddressSearchPayload },
  },
  {
    method: 'POST',
    endpoint: '/Address/register',
    alias: 'postAddressRegister',
    stub: spAddressRegisterResponse,
    options: { expectedReqPayload: spAddressRegisterPayload },
  },
];

export const submitSecurityPropertyStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/${loan1.id}/securityproperty$`,
    alias: 'putSecurityProperty',
    stub: {},
    options: {
      expectedReqPayload: spSubmitSecurityPropertyPayload,
    },
  },
  {
    method: 'GET',
    endpoint: `/${loan1.id}/securityproperty$`,
    alias: 'getSecurityProperty',
    stub: spSubmitSecurityPropertyResponse,
  },
];

export const depositDetailsStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/${loan1.id}/depositdetails/${loan1.id}$`,
    alias: 'getDepositDetails',
    stub: depositDetails,
  },
  {
    method: 'GET',
    endpoint: `/cases/${caseById.caseId}$`,
    alias: 'getCaseById',
    stub: caseById,
  },
];

export const submitDepositDetailsStub: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/${loan1.id}/depositdetails$`,
    alias: 'putDepositDetails',
    stub: {},
    options: {
      expectedReqPayload: submitDepositPayload,
    },
  },
  {
    method: 'GET',
    endpoint: `/${loan1.id}/depositdetails/${loan1.id}$`,
    alias: 'getDepositDetails',
    stub: submitDepositResponse,
  },
];

export const productSelectionStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: createProductSelectionResponse(),
  },
  { method: 'GET', endpoint: `/associations$`, alias: 'getFirmAssociations', stub: firmAssociations },
  { method: 'GET', endpoint: `/Calculation/paymentterms/*`, alias: 'getPaymentTerms', stub: calculationPaymentTerms },
];

export const adviceAndFeesStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/adviceandfees/${loan1.id}`,
    alias: 'getAdviceAndFees',
    stub: adviceAndFees,
  },
];

export const submitAdviceAndFeesStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/adviceandfees/${loan1.id}`,
    alias: 'putAdviceAndFees',
    stub: putAdviceAndFees,
    options: { expectedReqPayload: putAdviceAndFees },
  },
];

export const adviceAndFeesFailCheckStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/adviceandfees/${loan1.id}`,
    alias: 'getAdviceAndFees',
    stub: adviceAndFees,
  },
  {
    method: 'PUT',
    endpoint: `/adviceandfees/${loan1.id}`,
    alias: 'putAdviceAndFees',
    stub: {},
    options: { expectedReqPayload: putAdviceAndFees },
  },
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailability',
    stub: createProductsAvailabilityResponse('success'),
  },
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: progressPropertyAndLoan,
  },
  {
    method: 'GET',
    endpoint: '/progress$',
    alias: 'getProgress',
    stub: markDipProgressSteps(['propertyAndLoan', 'securityProperty', 'depositDetails', 'productSelection']),
  },
];

export const productsAvailabilityFailCheck: IStub[] = [
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailability',
    stub: createProductsAvailabilityResponse('failure'),
  },
];

export const personalDetailsStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: pdPersonalDetails },
  {
    method: 'PUT',
    endpoint: '/applicants/personaldetails$',
    alias: 'putPersonalDetails',
    stub: {},
    options: { expectedReqPayload: putPersonalDetails },
  },
];

export const addressHistoryStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/addresshistoryitems$', alias: 'getAddressHistory', stub: ahAddressHistory },
  {
    method: 'PUT',
    endpoint: '/applicants/addresshistoryitems$',
    alias: 'putAddressHistory',
    stub: {},
    options: {
      expectedReqPayload: putAddressHistory,
    },
  },
  {
    method: 'POST',
    endpoint: '/Address/search',
    alias: 'postAddressSearch',
    stub: ahAddressSearchResponse,
    options: { expectedReqPayload: ahAddressSearchPayload },
  },
  {
    method: 'POST',
    endpoint: '/Address/register',
    alias: 'postAddressRegister',
    stub: ahAddressRegisterResponse,
    options: { expectedReqPayload: ahAddressRegisterPayload },
  },
];

export const addressHistoryGetStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/addresshistoryitems$', alias: 'getAddressHistory', stub: ahAddressHistory },
];

export const addressHistoryGetStubsTwoApplicants: IStub[] = [
  { method: 'GET', endpoint: '/applicants/addresshistoryitems$', alias: 'getAddressHistory', stub: ahAddressHistoryTwoApplicants },
];

export const addressHistoryPutStubTwoApplicants: IStub[] = [
  {
    method: 'PUT',
    endpoint: '/applicants/addresshistoryitems$',
    alias: 'putAddressHistoryTwoApplicant',
    stub: {},
    options: {
      expectedReqPayload: putAddressHistoryTwoApplicants,
    },
  },
];

export const addressSearchComponentStubs: IStub[] = [
  {
    method: 'POST',
    endpoint: '/Address/search',
    alias: 'postAddressSearch',
    stub: ahAddressSearchResponse,
    options: { expectedReqPayload: ahAddressSearchPayload },
  },
  {
    method: 'POST',
    endpoint: '/Address/register',
    alias: 'postAddressRegister',
    stub: ahAddressRegisterResponse,
    options: { expectedReqPayload: ahAddressRegisterPayload },
  },
];

export const addressSearchDifferentAddressComponentStubs: IStub[] = [
  {
    method: 'POST',
    endpoint: '/Address/search',
    alias: 'postAddressSearchDifferentAddress',
    stub: ahAddressSearchOtherAddressResponse,
    options: { expectedReqPayload: ahAddressSearchOtherAddressPayload },
  },
  {
    method: 'POST',
    endpoint: '/Address/register',
    alias: 'postAddressRegisterDifferentAddress',
    stub: ahAddressRegisterOtherAddressResponse,
    options: { expectedReqPayload: ahAddressRegisterPayload },
  },
];

export const financialCommitmentsStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: '/applicants/financialcommitments$',
    alias: 'getFinancialCommitments',
    stub: financialCommitments,
  },
  {
    method: 'PUT',
    endpoint: '/applicants/financialcommitments$',
    alias: 'putFinancialCommitments',
    stub: {},
    options: { expectedReqPayload: putFinancialCommitments },
  },
];

export const householdExpendituresStubs: IStub[] = [
  { method: 'GET', endpoint: '/expendituredetails$', alias: 'getHouseholdExpenditure', stub: heHouseholdExpenditure },
  {
    method: 'PUT',
    endpoint: '/expendituredetails$',
    alias: 'putHouseholdExpenditure',
    stub: {},
    options: { expectedReqPayload: putHouseholdExpenditures },
  },
  { method: 'GET', endpoint: '/securityProperty$', alias: 'getSecurityProperty', stub: heSecurityProperty },
];

export const currentIncomeStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: ciCurrentIncome },
  {
    method: 'PUT',
    endpoint: '/applicants/currentincome$',
    alias: 'putCurrentIncome',
    stub: {},
    options: { expectedReqPayload: putCurrentIncome },
  },
];

export const futureChangesStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/futurechangesinincome$', alias: 'getFutureChanges', stub: futureChanges },
  {
    method: 'PUT',
    endpoint: '/applicants/futurechangesinincome$',
    alias: 'putFutureChanges',
    stub: {},
    options: { expectedReqPayload: putFutureChanges },
  },
];

export const confirmDipStubs: IStub[] = [
  { method: 'PUT', endpoint: '/Calculation/affordability*', alias: 'getAffordability', stub: affordability },
  { method: 'PUT', endpoint: `/submit/${loan1.id}`, alias: 'putSubmitDip', stub: submitDip },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: confirmDipSummary },
  { method: 'GET', endpoint: '/fmasummary$', alias: 'getDipSummary', stub: {}, options: { statusCode: 204 } },
  { method: 'GET', endpoint: '/stipulations$', alias: 'getDipSummary', stub: {}, options: { statusCode: 204 } },
];

type StageStatusCombinations = [
  id: number,
  readOnly: boolean,
  draftStage: DraftStage,
  caseStatus: CaseStatusEnum,
  loanStatus: LoanStatus,
][];

export const stageStatusCombinations: StageStatusCombinations = [
  [1, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Active],
  [2, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.AdditionalDocumentation],
  [3, true, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Assessment],
  [4, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Cancelled],
  [5, true, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Completed],
  [6, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Documentation],
  [7, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.InProgress],
  [8, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.InProgress],
  [9, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Promoting],
  [10, true, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Referred],
  [11, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Rejected],
  [12, true, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Submitted],
  [13, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.Undefined],
  [14, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.UnderwritingAccepted],
  [15, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.UnderwritingApproved],
  [16, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.UnderwritingInProgress],
  [17, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.ValuationPerformed],
  [19, false, DraftStage.Dip, CaseStatusEnum.Active, LoanStatus.ValuationPerformed],
  [18, true, DraftStage.Dip, CaseStatusEnum.Cancelled, LoanStatus.Active],
  [20, true, DraftStage.Fma, CaseStatusEnum.Active, LoanStatus.Active],
  [21, true, DraftStage.Fma, CaseStatusEnum.Cancelled, LoanStatus.Active],
];

export const getReadOnlyStubs = (caseStatus: CaseStatusEnum, draftStage: DraftStage, loanStatus: LoanStatus): IStub[] => [
  { method: 'GET', endpoint: `/cases/${getCaseById.caseId}`, alias: 'getCaseById', stub: createCaseResponse({ caseStatus }) },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummaryResponse({ draftStage, loanStatus }) },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: {} },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: palPersonalDetails },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: palCurrentIncome },
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: palProductSelection,
  },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage', stub: palExistingMortgage },
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: palPropertyAndLoanDetails,
  },
];
