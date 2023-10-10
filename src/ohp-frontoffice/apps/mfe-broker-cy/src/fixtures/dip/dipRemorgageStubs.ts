import getCodetablesByNames from '../codetables/getCodeTables.json';
import {
  additionalBorrowing,
  caseById,
  createPalExistingMortgage,
  createPalSubmitRequest,
  createPalSubmitResponse,
  createProductsAvailabilityResponse,
  decimal,
  depositDetails,
  existingMortgage,
  getFirmResponse,
  getRemortgageCaseById,
  loan1,
  loanAmount,
  palCurrentIncome,
  palExistingMortgage,
  palPersonalDetails,
  palProductSelection,
  palPropertyAndLoanDetails,
  putAdditionalBorrowing,
  putAddressHistorySecurity,
  remortgageDipSummary,
  spAddressRegisterPayload,
  spAddressRegisterResponse,
  spAddressSearchPayload,
  spAddressSearchResponse,
  spSecurityProperty,
  spSubmitSecurityPropertyPayload,
  spSubmitSecurityPropertyResponse,
  submitDepositPayload,
  submitDepositResponse,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

const loanId = remortgageDipSummary.loan?.loanId ?? '';

export const caseSummaryStubs: IStub[] = [
  { method: 'POST', endpoint: '/codetablesbynames$', alias: 'getCodetables', stub: getCodetablesByNames },
  { method: 'GET', endpoint: '/Firm/.*', alias: 'getFirm', stub: getFirmResponse },
  {
    method: 'GET',
    endpoint: `/cases/${getRemortgageCaseById.caseId}`,
    alias: 'getCaseById',
    stub: getRemortgageCaseById,
  },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: remortgageDipSummary },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: {}, options: { statusCode: 204 } },
  {
    method: 'GET',
    endpoint: '/illustrationsummary$',
    alias: 'getIllustrationSummary',
    stub: {},
    options: { statusCode: 204 },
  },
];

export const globalRemortgageDipStubs: IStub[] = [
  { method: 'PUT', endpoint: '/progress$', alias: 'putProgress', stub: {} },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: {} },
  {
    method: 'PUT',
    endpoint: `/dip/${remortgageDipSummary.applicationDraftId}/.*/${loanId}`,
    alias: 'putDipDetails',
    stub: {},
  },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: palPersonalDetails },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: palCurrentIncome },
  {
    method: 'GET',
    endpoint: `/productselection/${loanId}`,
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

export const propertyAndLoanDetailsStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loanId}`,
    alias: 'getPropertyAndLoanDetails',
    stub: palPropertyAndLoanDetails,
  },
];

export const submitPropertyAndLoanStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'putPropertyAndLoanDetails',
    options: { expectedReqPayload: createPalSubmitRequest({ hasCustomerFoundProperty: null, propertyOwnershipType: null }) },
    stub: createPalSubmitResponse({ hasCustomerFoundProperty: null, propertyOwnershipType: null }),
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
    endpoint: `/${loanId}/securityproperty$`,
    alias: 'putSecurityProperty',
    stub: {},
    options: {
      expectedReqPayload: spSubmitSecurityPropertyPayload,
    },
  },
  {
    method: 'GET',
    endpoint: `/${loanId}/securityproperty$`,
    alias: 'getSecurityProperty',
    stub: spSubmitSecurityPropertyPayload,
  },
];

export const existingMortgageStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: '/existingmortgage$',
    alias: 'getExistingMortgages',
    stub: existingMortgage,
  },
];

export const submitExistingMortgages: IStub[] = [
  {
    method: 'PUT',
    endpoint: '/existingmortgage$',
    alias: 'putExistingMortgages',
    stub: {},
    options: {
      expectedReqPayload: createPalExistingMortgage({ currentOutstandingBalance: loanAmount - 1000, amountToBeRepaid: loanAmount - 1000 }),
    },
  },
  {
    method: 'GET',
    endpoint: '/existingmortgage$',
    alias: 'getExistingMortgages',
    stub: createPalExistingMortgage({ currentOutstandingBalance: loanAmount - 1000, amountToBeRepaid: loanAmount - 1000 }),
  },
];

export const additionalBorrowingStub: IStub[] = [
  {
    method: 'GET',
    endpoint: `/${loanId}/additionalborrowing`,
    alias: 'getAdditionalBorrowing',
    stub: additionalBorrowing,
  },
];

export const submitAdditionalBorrowing: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/${loanId}/additionalborrowing`,
    alias: 'putAdditionalBorrowing',
    stub: {},
    options: {
      expectedReqPayload: putAdditionalBorrowing,
    },
  },
  {
    method: 'GET',
    endpoint: `/${loanId}/additionalborrowing`,
    alias: 'getAdditionalBorrowing',
    stub: additionalBorrowing,
  },
];

export const depositDetailsStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/${loanId}/depositdetails/${loanId}$`,
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
    endpoint: `/${loanId}/depositdetails$`,
    alias: 'putDepositDetails',
    stub: {},
    options: {
      expectedReqPayload: submitDepositPayload,
    },
  },
  {
    method: 'GET',
    endpoint: `/${loanId}/depositdetails/${loanId}$`,
    alias: 'getDepositDetails',
    stub: submitDepositResponse,
  },
];

export const copyAddressFromSecurityProperty: IStub[] = [
  {
    method: 'GET',
    endpoint: '/securityproperty$',
    alias: 'getSecurityPropertyCopy',
    stub: spSubmitSecurityPropertyResponse,
  },
  {
    method: 'PUT',
    endpoint: '/applicants/addresshistoryitems$',
    alias: 'putAddressHistoryCopy',
    stub: {},
    options: {
      expectedReqPayload: putAddressHistorySecurity,
    },
  },
  {
    method: 'GET',
    endpoint: '/applicants/addresshistoryitems$',
    alias: 'getAddressHistoryCopy',
    stub: putAddressHistorySecurity,
  },
];
