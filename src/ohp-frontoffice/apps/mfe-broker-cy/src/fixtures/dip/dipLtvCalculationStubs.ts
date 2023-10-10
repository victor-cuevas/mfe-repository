import {
  case1,
  createDipSummary,
  createGetCaseByIdResponse,
  createProductsAvailabilityResponse,
  dipLtvAdviceAndFees,
  createProductSelectionResponse,
  loan1,
  markDipProgressSteps,
  palCurrentIncome,
  palExistingMortgage,
  palPersonalDetails,
  palPropertyAndLoanDetails,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const validProducts: IStub[] = [
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailabiliy',
    stub: createProductsAvailabilityResponse('success', { ltvValue: 74.9 }),
  },
];

export const invalidProducts: IStub[] = [
  {
    method: 'GET',
    endpoint: '/loan-products-availability',
    alias: 'getProductsAvailabiliy',
    stub: createProductsAvailabilityResponse('failure', { ltvValue: 80.0 }),
  },
];

export const productSelectionValidLtv: IStub[] = [
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}$`,
    alias: 'getProductSelection',
    stub: createProductSelectionResponse({ ltv: 74.9 }),
  },
];

export const productSelectionInvalidLtv: IStub[] = [
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}$`,
    alias: 'getProductSelection',
    stub: createProductSelectionResponse({ ltv: 80.0 }),
  },
];

export const dipLtvCalculationInitialStubs: IStub[] = [
  {
    method: 'GET',
    endpoint: `/productselection/${loan1.id}$`,
    alias: 'getProductSelection',
    stub: createProductSelectionResponse(),
  },
  { method: 'GET', endpoint: `/cases/${case1.id}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('DIP') },
  {
    method: 'GET',
    endpoint: `/propertyandloandetails/${loan1.id}`,
    alias: 'getPropertyAndLoanDetails',
    stub: palPropertyAndLoanDetails,
  },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary', stub: createDipSummary() },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails', stub: palPersonalDetails },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome', stub: palCurrentIncome },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage', stub: palExistingMortgage },
  {
    method: 'GET',
    endpoint: '/progress$',
    alias: 'getProgress',
    stub: markDipProgressSteps(['propertyAndLoan', 'depositDetails', 'productSelection']),
  },
  {
    method: 'GET',
    endpoint: `/adviceandfees/${loan1.id}`,
    alias: 'getAdviceAndFees',
    stub: dipLtvAdviceAndFees,
  },
];

export const getProductsRequest: IStub[] = [
  {
    method: 'GET',
    endpoint: '/product',
    alias: 'getProduct',
    stub: {},
  },
];
