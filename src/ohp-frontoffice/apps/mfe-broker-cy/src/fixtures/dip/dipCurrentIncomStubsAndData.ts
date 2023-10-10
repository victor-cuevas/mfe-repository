import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { ciCurrentIncome } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

//Stubs
export const currentIncomeStubs: IStub[] = [
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: ciCurrentIncome },
];

//Data

//Employment status
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

export const employmentStatusSelfDirectorGreater25 = {
  matcher: /employment status/i,
  value: 'Director >= 25% or with dividends',
};

export const employmentStatusSelfDirectorLess25 = {
  matcher: /employment status/i,
  value: 'Director < 25% with no dividends',
};

export const employmentStatusHomeMaker = {
  matcher: /employment status/i,
  value: 'Home maker',
};

export const employmentStatusStudent = {
  matcher: /employment status/i,
  value: 'Student',
};

export const employmentStatusNotEmployed = {
  matcher: /employment status/i,
  value: 'Not employed',
};

export const employmentStatusSelfRetired = {
  matcher: /employment status/i,
  value: 'Retired',
};

//Contract type
export const contractTypePermanent = {
  matcher: /contract type/i,
  value: 'Permanent',
};

export const contractTypeTemporary = {
  matcher: /contract type/i,
  value: 'Temporary',
};

export const contractTypeZeroHoursContract = {
  matcher: /contract type/i,
  value: 'Zero Hours Contract',
};

//Contract start date
export const contractStartDateLessThanOneYear = {
  matcher: /contract start date/i,
  value: '05/01/2023',
};

//CAN THE INCOME BE VERIFIED
export const canTheIncomeBeVerifiedYes = {
  matcher: /can the income be verified/i,
  value: 'Yes',
};

//IS THE INCOME DESCRIBED AS SALARY
export const incomeDescribedAsSalary = {
  matcher: /is the income described as salary or daily rate/i,
  value: 'Salary',
};

export const incomeDescribedAsDailyRate = {
  matcher: /is the income described as salary or daily rate/i,
  value: 'Daily rate',
};

// BASIC SALARY - DAILY RATE
export const basicSalary = {
  matcher: /basic salary/i,
  value: 10000,
};

export const jobTitle = {
  matcher: /job title/i,
  value: 'fake job',
};

export const locationGuaranteedAllowances = {
  matcher: /location allowance amount/i,
  value: 10000,
};

export const travelGuaranteedAllowances = {
  matcher: /travel \/ car allowance amount/i,
  value: 10000,
};

export const shiftGuaranteedAllowances = {
  matcher: /shift allowance amount/i,
  value: 10000,
};

export const otherGuaranteedAllowances = {
  matcher: /other allowance amount/i,
  value: 10000,
};
