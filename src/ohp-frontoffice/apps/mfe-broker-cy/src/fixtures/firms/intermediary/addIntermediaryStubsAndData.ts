import { FormData, IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  applicant1,
  getFirmAddresses,
  getIntermediaryByAdvisorUniqueId,
  postNewIntermediary,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

// Stubs
export const addressesStubs: IStub[] = [{ method: 'GET', endpoint: '/addresses', alias: 'getAddresses', stub: getFirmAddresses }];

export const newIntermediaryStub: IStub[] = [
  {
    method: 'POST',
    endpoint: '/Intermediary',
    alias: 'postNewIntermediary',
    stub: {},
    options: { expectedReqPayload: postNewIntermediary },
  },
];

export const getIntermediaryByAdvisorUniqueIdStub: IStub[] = [
  { method: 'GET', endpoint: '/intermediary/.*', alias: 'getIntermediaryByAdvisorUniqueId', stub: getIntermediaryByAdvisorUniqueId },
];

export const getIntermediaryByAdvisorUniqueId204Stub: IStub[] = [
  { method: 'GET', endpoint: '/intermediary/.*', alias: 'getIntermediaryByAdvisorUniqueId204', stub: {}, options: { statusCode: 204 } },
];

// Data
export const newIntermediary: FormData[] = [
  { type: 'RADIO', details: { matcher: /user's role/i, value: /viewer/i } },
  { type: 'INPUT', details: { matcher: /first name/i, value: applicant1.firstName ?? '' } },
  { type: 'INPUT', details: { matcher: /surname/i, value: applicant1.familyName ?? '' } },
  { type: 'INPUT', details: { matcher: /mobile/i, value: '1234567890' } },
  { type: 'INPUT', details: { matcher: /email/i, value: applicant1.email } },
];
