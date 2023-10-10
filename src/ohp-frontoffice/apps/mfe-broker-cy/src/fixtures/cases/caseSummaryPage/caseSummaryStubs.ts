import { LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  case1,
  createDipSummary,
  createFmaSummary,
  createGetCaseByIdResponse,
  getDocumentsSummary,
  getIllustrationSummary,
  getIllustrationLoanDetails,
  getIllustrationProductSelection,
  postIllustrationCreate,
  loan1,
  applicationDraft,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const onLoadStubs: IStub[] = [
  { method: 'GET', endpoint: `/cases/${case1.id}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('New') },
];

export const createIllustrationStubs: IStub[] = [
  { method: 'POST', endpoint: '/Illustration$', alias: 'postNewIllustration', stub: postIllustrationCreate },
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}`,
    alias: 'getProductSelection',
    stub: getIllustrationProductSelection,
  },
  {
    method: 'GET',
    endpoint: `/loandetails/${loan1.id}`,
    alias: 'getLoanDetails',
    stub: getIllustrationLoanDetails,
  },
];

export const onLoadAditionalStubs: IStub[] = [
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: {}, options: { statusCode: 204 } },
  { method: 'GET', endpoint: '/stipulations$', alias: 'getStipulations', stub: {}, options: { statusCode: 204 } },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: {} },
];

export const illustrationStageStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/cases/${case1.id}`,
    alias: 'getCaseById',
    stub: createGetCaseByIdResponse('Illustration'),
  },
  { method: 'GET', endpoint: '/illustrationsummary$', alias: 'getIllustrationSummary', stub: getIllustrationSummary },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: getDocumentsSummary },
];

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const [{ loanId: inProgressId }, { loanId: completedId }] = getIllustrationSummary.illustrationSummaries!;
export const clickResumeIllustrationStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/Illustration/${applicationDraft.id}/loandetails/${inProgressId}`,
    alias: 'getLoanDetails',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: `/Illustration/${applicationDraft.id}/productselection/${inProgressId}`,
    alias: 'getProductSelection',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: `/progress$`,
    alias: 'getProgress',
    stub: {},
  },
];

export const clickViewIllustrationStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/Illustration/${applicationDraft.id}/loandetails/${completedId}`,
    alias: 'getLoanDetails',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: `/Illustration/${applicationDraft.id}/productselection/${completedId}`,
    alias: 'getProductSelection',
    stub: {},
  },
];

export const blockedPromoteIllustrationStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/Illustration/${applicationDraft.id}/submit/${completedId}/promote`,
    alias: 'promoteIllustration',
    options: {
      statusCode: 400,
    },
    stub: {
      title: 'Product(s) invalid',
      status: 400,
      detail:
        'One or more of the selected products in the illustration are not valid. This illustration cannot be promoted to “Decision in Principle”.',
      instance: 'string',
    },
  },
];

export const successPromoteIllustrationStubs: IStub[] = [
  {
    method: 'PUT',
    endpoint: `/Illustration/${applicationDraft.id}/submit`,
    alias: 'promoteIllustration',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: '/dipsummary$',
    alias: 'getDipSummary',
    stub: createDipSummary(),
  },
];

export const dipStageStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/cases/${case1.id}`,
    alias: 'getCaseById',
    stub: createGetCaseByIdResponse('DIP'),
  },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummary() },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: getDocumentsSummary },
];

export const clickResumeDipStubs: IStub[] = [
  { method: 'GET', endpoint: '/dip/*', alias: 'getDipProperties', stub: {} },
  { method: 'PUT', endpoint: '/propertyandloandetails/', alias: 'putPropertyAndLoan', stub: {} },
  { method: 'PUT', endpoint: '/progress$', alias: 'putProgress', stub: {} },
];

export const fmaStageStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/cases/${case1.id}`,
    alias: 'getCaseById',
    stub: createGetCaseByIdResponse('FMA'),
  },
  {
    method: 'GET',
    endpoint: `/cases/${case1.id}/fmasummary`,
    alias: 'getFmaSummary',
    stub: createFmaSummary(),
  },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: getDocumentsSummary },
];

export const completeDipStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/cases/${case1.id}`,
    alias: 'getCaseById',
    stub: createGetCaseByIdResponse('DIP'),
  },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummary(LoanStatus.Completed) },
  { method: 'GET', endpoint: '/documents$', alias: 'getDocuments', stub: getDocumentsSummary },
];

export const promoteToFmaStubs: IStub[] = [
  { method: 'PUT', endpoint: '/promote$', alias: 'putPromoteDip', stub: getDocumentsSummary },
  { method: 'GET', endpoint: '/fmasummary$', alias: 'getFmaSummary', stub: createFmaSummary() },
];
