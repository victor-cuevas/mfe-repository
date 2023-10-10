import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { createGetCaseByIdResponse, postNewCaseResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

export const caseListStubs: IStub[] = [{ method: 'GET', endpoint: '/cases', alias: 'getCases', stub: [] }];

export const newCaseStubs: IStub[] = [
  { method: 'POST', endpoint: '/cases$', alias: 'postNewCase', stub: postNewCaseResponse },
  { method: 'GET', endpoint: `/cases/${postNewCaseResponse.caseId}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('New') },
];
