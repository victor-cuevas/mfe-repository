import { LoanStatus, UploadStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  case1,
  createContactDetails,
  createCurrentIncome,
  createDipSummary,
  createFmaStipulations,
  createFmaSummary,
  createGetCaseByIdResponse,
  getFmaAdviceAndFees,
  getFmaAssociations,
  getFmaBankAccountDetails,
  getFmaLendingPolicyCheckDocuments,
  getFmaPaymentTerms,
  getFmaPersonalDetailsResponse,
  getFmaProductsAvailability,
  getFmaProductSelection,
  getFmaProgress,
  getFmaSearchSolicitor,
  getFmaSecurityProperty,
  getFmaSolicitorDetails,
  getFmaValidateBankAccount,
  getFmaValuationDetails,
  getLendingPolicyCheck,
  getStipulations,
  loan1,
  putFmaAffordabilityCheck,
  putFmaSubmit,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const caseSummaryStubs: IStub[] = [
  { method: 'GET', endpoint: `/cases/${case1.id}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('FMA') },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummary() },
  { method: 'GET', endpoint: '/fmasummary$', alias: 'getFmaSummary', stub: createFmaSummary() },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: {}, options: { statusCode: 204 } },
  { method: 'GET', endpoint: '/stipulations$', alias: 'getStipulations', stub: getStipulations },
];

export const globalFmaStubs: IStub[] = [
  { method: 'GET', endpoint: `/productselection/${loan1.id}$`, alias: 'getProductSelection', stub: getFmaProductSelection },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: getFmaProgress([]) },
];

export const contactDetailsStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: getFmaPersonalDetailsResponse },
  { method: 'GET', endpoint: '/loan-products-availability', alias: 'getProductsAvailability', stub: getFmaProductsAvailability },
  { method: 'GET', endpoint: '/valuationdetails$', alias: 'getValuationDetails', stub: getFmaValuationDetails },
  { method: 'GET', endpoint: '/contactdetails$', alias: 'getContactDetails', stub: createContactDetails() },
];

export const currentIncomeStubs: IStub[] = [
  { method: 'GET', endpoint: '/currentincome$', alias: 'getCurrentIncome', stub: createCurrentIncome({ fullDetails: true }) },
];

export const securityPropertyStubs: IStub[] = [
  { method: 'GET', endpoint: '/securityproperty$', alias: 'getSecurityProperty', stub: getFmaSecurityProperty },
];

export const productSelectionStubs: IStub[] = [
  { method: 'GET', endpoint: `/productselection/${loan1.id}$`, alias: 'getProductSelection', stub: getFmaProductSelection },
  { method: 'GET', endpoint: `/associations$`, alias: 'getAssociations', stub: getFmaAssociations },
  { method: 'GET', endpoint: `/paymentterms`, alias: 'getPaymentTerms', stub: getFmaPaymentTerms },
];

export const adviceAndFeesStubs: IStub[] = [
  { method: 'GET', endpoint: `/adviceandfees/${loan1.id}$`, alias: 'getAdviceAndFees', stub: getFmaAdviceAndFees },
];

export const affordabilityCheckStubs: IStub[] = [
  { method: 'PUT', endpoint: '/affordability', alias: 'putAffordability', stub: putFmaAffordabilityCheck },
];

export const solicitorDetailsStubs: IStub[] = [
  { method: 'GET', endpoint: '/solicitordetails$', alias: 'getSolicitorDetails', stub: getFmaSolicitorDetails },
  { method: 'GET', endpoint: '/searchsolicitor', alias: 'getSearchSolicitor', stub: getFmaSearchSolicitor },
];

export const valuationDetailsStubs: IStub[] = [
  { method: 'GET', endpoint: '/valuationdetails$', alias: 'getValuationDetails', stub: getFmaValuationDetails },
  { method: 'GET', endpoint: '/contactdetails$', alias: 'getContactDetails', stub: createContactDetails({ fullDetails: true }) },
];

export const bankAccountStubs: IStub[] = [
  { method: 'GET', endpoint: '/bankaccountdetails$', alias: 'getBankAccountDetails', stub: getFmaBankAccountDetails },
  { method: 'GET', endpoint: '/validatebankaccount', alias: 'getValidateBankAccount', stub: getFmaValidateBankAccount },
];

export const lendingPolicyCheckStubs: IStub[] = [
  { method: 'GET', endpoint: '/lending-policy-check', alias: 'getLendingPolicyCheck', stub: getLendingPolicyCheck },
  { method: 'PUT', endpoint: '/submit', alias: 'putSubmitFma', stub: putFmaSubmit },
  { method: 'GET', endpoint: '/fmasummary$', alias: 'getFmaSummary', stub: createFmaSummary(LoanStatus.Referred) },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: getFmaLendingPolicyCheckDocuments },
  {
    method: 'GET',
    endpoint: '/progress$',
    alias: 'getProgress',
    stub: getFmaProgress([
      'contactDetails',
      'currentIncome',
      'securityProperty',
      'productSelection',
      'adviceFees',
      'affordabilityCheck',
      'solicitorDetails',
      'valuationDetails',
      'bankAccount',
    ]),
  },
];

export const uploadDocumentsStub: IStub[] = [
  { method: 'GET', endpoint: '/stipulations$', alias: 'getStipulations', stub: createFmaStipulations() },
];
export const uploadDocumentsRejectedStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: '/stipulations$',
    alias: 'getStipulations',
    stub: createFmaStipulations(
      [
        UploadStatus.ANALYZED,
        UploadStatus.APPROVED,
        UploadStatus.CANCELLED,
        UploadStatus.CLASSIFICATION_AMBIGUOUS,
        UploadStatus.CONSISTENCY_REJECTED,
        UploadStatus.DEFERRED,
        UploadStatus.ERROR,
        UploadStatus.MISCLASSIFIED,
        UploadStatus.POLICY_APPROVED,
        UploadStatus.POLICY_REJECTED,
        UploadStatus.PROVISIONALLY_APPROVED,
        UploadStatus.RECEIVED,
        UploadStatus.TO_BE_ANALYZED,
        UploadStatus.TO_BE_CORRECTED,
        UploadStatus.TO_BE_RECEIVED,
        UploadStatus.TO_BE_REPLACED,
        UploadStatus.UNKNOWN,
        UploadStatus.VALID,
      ],
      ['reason1', 'reason2', 'reason3'],
    ),
  },
];
