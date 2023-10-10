import { FormData, IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  ahAddressRegisterPayload,
  ahAddressRegisterResponse,
  ahAddressSearchPayload,
  ahAddressSearchResponse,
  applicant1,
  createCurrentIncome,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

//Stubs
export const currentIncomeStubEmpty: IStub[] = [
  { method: 'GET', endpoint: '/currentincome$', alias: 'getCurrentIncome', stub: createCurrentIncome() },
];

export const currentIncomeStubs: IStub[] = [
  { method: 'GET', endpoint: '/currentincome$', alias: 'getCurrentIncome', stub: createCurrentIncome({ fullDetails: true }) },
];

export const ciAddressSearchComponentStubs: IStub[] = [
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

//Data
export const employmentStatusEmployed = {
  matcher: /employment status/i,
  value: 'Employed',
};

export const employmentStatusSelfEmployedPartnership = {
  matcher: /employment status/i,
  value: 'Self Employed - Partnership',
};

export const employmentStatusSelfEmployedSoleTrader = {
  matcher: /employment status/i,
  value: 'Self Employed - Sole trader',
};

export const employmentStatusDirectorGreaterThan25 = {
  matcher: /employment status/i,
  value: 'Director >= 25% or with dividends',
};

export const employmentStatusDirectorLessThan25 = {
  matcher: /employment status/i,
  value: 'Director < 25% with no dividends',
};

export const ciAddressType = {
  matcher: /address type/i,
  value: 'UK',
};

export const ciAddressAutocomplete = {
  matcher: /address \*/i,
  value: 'Buckingham Palace, London, SW1A 1AA',
};

export const currentIncomeFma: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Employed' } },
  { type: 'DROPDOWN', details: { matcher: /contract type/i, value: 'Permanent' } },
  { type: 'DATE', details: { matcher: /contract start date/i, value: '01/01/2010' } },
  { type: 'INPUT', details: { matcher: /job title/i, value: 'fake job title' } },
  { type: 'INPUT', details: { matcher: /company name/i, value: 'fake company' } },
  { type: 'RADIO', details: { matcher: /income .* verified/i, value: 'Yes' } },
  { type: 'DROPDOWN', details: { matcher: /salary or daily/i, value: 'Salary' } },
  { type: 'INPUT', details: { matcher: /basic salary/i, value: 2000 } },
  { type: 'DROPDOWN', details: { matcher: /frequency/i, value: 'Monthly' } },
];

export const cuAddressTypeUk = {
  matcher: /address type/i,
  value: 'UK',
};

export const isThereProbationPeriodYes = {
  matcher: /Is there a probationary period/i,
  value: 'Yes',
};

export const contractTypeTemporary = {
  matcher: /contract type/i,
  value: 'Temporary',
};

export const contractTypeZeroHoursContract = {
  matcher: /contract type/i,
  value: 'Zero Hours Contract',
};

export const haveThereBeenGapsBetweenContractInLast12MonthsYes = {
  matcher: /have there been gaps between contracts in last 12 months/i,
  value: 'Yes',
};
export const AreYouContractorConsultantProfessionalProvidingServiceYes = {
  matcher: /Are you a contractor \/ consultant \/ professional providing services to a client/i,
  value: 'Yes',
};

export const currentIncomeEmployed: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Employed' } },
  { type: 'DROPDOWN', details: { matcher: /contract type/i, value: 'Permanent' } },
  { type: 'INPUT', details: { matcher: /job title/i, value: 'fake job title' } },
  { type: 'INPUT', details: { matcher: /company name/i, value: 'fake company' } },
  { type: 'RADIO', details: { matcher: /income .* verified/i, value: 'Yes' } },
  { type: 'DROPDOWN', details: { matcher: /address type/i, value: 'UK' } },
  { type: 'DROPDOWN', details: { matcher: /salary or daily/i, value: 'Salary' } },
  { type: 'INPUT', details: { matcher: /basic salary/i, value: 2000 } },
  { type: 'DROPDOWN', details: { matcher: /frequency/i, value: 'Monthly' } },
];

export const currentIncomeSelfEmployedPartnership: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Self Employed - Partnership' } },
  { type: 'INPUT', details: { matcher: /job title/i, value: 'fake job title' } },
  { type: 'INPUT', details: { matcher: /business name/i, value: 'fake company' } },
  { type: 'DROPDOWN', details: { matcher: /Partnership type/i, value: 'General partnership' } },
  { type: 'RADIO', details: { matcher: /income .* verified/i, value: 'Yes' } },
  { type: 'INPUT', details: { matcher: /share of business owned/i, value: 22 } },
  { type: 'DATE', details: { matcher: /date business started/i, value: '01/01/2010' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor company name/i, value: 'fake company name' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor address /i, value: 'fake account address' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor Tel No/i, value: applicant1.phone } },
  {
    type: 'INPUT',
    details: { matcher: /accountant\/auditor last name of individual acting/i, value: 'fake account last name' },
  },
  { type: 'INPUT', details: { matcher: /accountant\/auditor qualification/i, value: 'fake account qualification' } },
];

export const currentIncomeSelfEmployedSoleTrader: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Self Employed - Sole trader' } },
  { type: 'DATE', details: { matcher: /date business started/i, value: '01/01/2010' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor company name/i, value: 'fake company name' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor address /i, value: 'fake account address' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor Tel No/i, value: applicant1.phone } },
  {
    type: 'INPUT',
    details: { matcher: /accountant\/auditor last name of individual acting/i, value: 'fake account last name' },
  },
  { type: 'INPUT', details: { matcher: /accountant\/auditor qualification/i, value: 'fake account qualification' } },
];

export const currentIncomeDirectorGreaterThan25: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Director >= 25% or with dividends' } },
  { type: 'DROPDOWN', details: { matcher: /company type/i, value: 'Private limited company (LTD)' } },
  { type: 'INPUT', details: { matcher: /share of business owned/i, value: 22 } },
  { type: 'DATE', details: { matcher: /date business started/i, value: '01/01/2010' } },
  {
    type: 'RADIO',
    details: { matcher: /Are you a contractor \/ consultant \/ professional providing services to a client/i, value: 'No' },
  },
  { type: 'INPUT', details: { matcher: /company number/i, value: 'fake company number 1234' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor company name/i, value: 'fake company name' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor address /i, value: 'fake account address' } },
  { type: 'INPUT', details: { matcher: /accountant\/auditor Tel No/i, value: applicant1.phone } },
  {
    type: 'INPUT',
    details: { matcher: /accountant\/auditor last name of individual acting/i, value: 'fake account last name' },
  },
  { type: 'INPUT', details: { matcher: /accountant\/auditor qualification/i, value: 'fake account qualification' } },
];

export const currentIncomeDirectorLessThan25: FormData[] = [
  { type: 'DROPDOWN', details: { matcher: /employment status/i, value: 'Director < 25% with no dividends' } },
  { type: 'INPUT', details: { matcher: /share of business owned/i, value: 22 } },
  { type: 'DATE', details: { matcher: /date business started/i, value: '01/01/2010' } },
  { type: 'DROPDOWN', details: { matcher: /salary or daily/i, value: 'Salary' } },
  { type: 'INPUT', details: { matcher: /basic salary/i, value: 2000 } },
  { type: 'DROPDOWN', details: { matcher: /frequency/i, value: 'Monthly' } },
];
