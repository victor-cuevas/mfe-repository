import {
  getIllustrationAdviceAndFees,
  getIllustrationCalculationPayments,
  createGetCaseByIdResponse,
  case1,
  getFirmAssociations,
  getIllustrationLoanDetails,
  getIllustrationProductSelection,
  postIllustrationCreate,
  products,
  getIllustrationProductsAvailability,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const caseListStubs: IStub[] = [
  { method: 'GET', endpoint: `/cases/${case1.id}`, alias: 'getCaseById', stub: createGetCaseByIdResponse('New') },
];

export const createIllustrationStubs: IStub[] = [
  { method: 'PUT', endpoint: '/progress$', alias: 'putProgress', stub: {} },
  { method: 'GET', endpoint: '/progress$', alias: 'getProgress', stub: {} },
  { method: 'POST', endpoint: '/Illustration$', alias: 'postNewIllustration', stub: postIllustrationCreate },
  {
    method: 'GET',
    endpoint: `/productselection/${postIllustrationCreate.loanId}`,
    alias: 'getProductSelection',
    stub: getIllustrationProductSelection,
  },
  {
    method: 'GET',
    endpoint: `/loandetails/${postIllustrationCreate.loanId}`,
    alias: 'getLoanDetails',
    stub: getIllustrationLoanDetails,
  },
  {
    method: 'PUT',
    endpoint: `/loandetails/${postIllustrationCreate.loanId}`,
    alias: 'putLoadDetails',
    stub: getIllustrationLoanDetails,
  },
  { method: 'GET', endpoint: '/associations', alias: 'getFirmAssociations', stub: getFirmAssociations },
  { method: 'GET', endpoint: '/product', alias: 'getProductList', stub: products },
  { method: 'GET', endpoint: `/Calculation/paymentterms*`, alias: 'getPaymentTerms', stub: getIllustrationCalculationPayments },
  { method: 'GET', endpoint: `/loan-products-availability`, alias: 'getProductsAvailability', stub: getIllustrationProductsAvailability },
  {
    method: 'PUT',
    endpoint: `/productselection/${postIllustrationCreate.loanId}`,
    alias: 'getProductSelection',
    stub: {},
  },
  {
    method: 'GET',
    endpoint: `/adviceandfees/${postIllustrationCreate.loanId}`,
    alias: 'getLoanDetails',
    stub: getIllustrationAdviceAndFees,
  },
  { method: 'PUT', endpoint: '/adviceandfees*', alias: 'putAdviceAndFees', stub: {} },
  { method: 'PUT', endpoint: '/submit*', alias: 'putSubmitIllustration', stub: {} },
];
