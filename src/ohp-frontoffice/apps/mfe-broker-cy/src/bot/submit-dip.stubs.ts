import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

export const submitDipStubs: IStub[] = [
  { method: 'POST', endpoint: '**/cases', alias: 'postCase' },
  { method: 'GET', endpoint: '**/cases/**', alias: 'getCase' },
  { method: 'POST', endpoint: '**/dip', alias: 'createDip' },
  { method: 'PUT', endpoint: '**/progress', alias: 'putProgress' },
  { method: 'GET', endpoint: '**/progress', alias: 'getProgress' },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails' },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome' },
  {
    method: 'GET',
    endpoint: `**/productselection/**`,
    alias: 'getProductSelection',
  },
  {
    method: 'PUT',
    endpoint: `**/productselection/**`,
    alias: 'putProductSelection',
  },
  { method: 'GET', endpoint: '/existingmortgage', alias: 'getExistingMortgage' },
  { method: 'GET', endpoint: '/applicants/personaldetails$', alias: 'getPersonalDetails' },
  { method: 'GET', endpoint: '/applicants/currentincome$', alias: 'getCurrentIncome' },
  {
    method: 'GET',
    endpoint: `**/propertyandloandetails/**`,
    alias: 'getPropertyAndLoanDetails',
  },
  {
    method: 'PUT',
    endpoint: `**/propertyandloandetails/**`,
    alias: 'putPropertyAndLoanDetails',
  },
  { method: 'GET', endpoint: '**/securityproperty', alias: 'getSecurityProperty' },
  {
    method: 'PUT',
    endpoint: `**/securityproperty`,
    alias: 'putSecurityProperty',
  },
  {
    method: 'POST',
    endpoint: '**/Address/search',
    alias: 'postAddressSearch',
  },
  {
    method: 'POST',
    endpoint: '**/Address/register',
    alias: 'postAddressRegister',
  },
  {
    method: 'GET',
    endpoint: `**/depositdetails/**`,
    alias: 'getDepositDetails',
  },
  {
    method: 'PUT',
    endpoint: `**/depositdetails`,
    alias: 'putDepositDetails',
  },
  {
    method: 'GET',
    endpoint: `**/productselection/**`,
    alias: 'getProductSelection',
  },
  { method: 'GET', endpoint: '**/product?**', alias: 'getProducts' },
  { method: 'GET', endpoint: `**/Firm/**/associations`, alias: 'getFirmAssociations' },
  {
    method: 'GET',
    endpoint: `**/adviceandfees/**`,
    alias: 'getAdviceAndFees',
  },
  {
    method: 'PUT',
    endpoint: `**/adviceandfees/**`,
    alias: 'putAdviceAndFees',
  },
  { method: 'GET', endpoint: '**/applicants/personaldetails', alias: 'getPersonalDetails' },
  {
    method: 'PUT',
    endpoint: '**/applicants/personaldetails',
    alias: 'putPersonalDetails',
  },
  { method: 'GET', endpoint: '**/applicants/addresshistoryitems', alias: 'getAddressHistory' },
  {
    method: 'PUT',
    endpoint: '**/applicants/addresshistoryitems',
    alias: 'putAddressHistory',
  },
  {
    method: 'GET',
    endpoint: '**/applicants/financialcommitments',
    alias: 'getFinancialCommitments',
  },
  {
    method: 'GET',
    endpoint: '**/existingmortgage',
    alias: 'getExistingMortgage',
  },
  {
    method: 'PUT',
    endpoint: '**/applicants/financialcommitments',
    alias: 'putFinancialCommitments',
  },
  { method: 'GET', endpoint: '**/expendituredetails', alias: 'getHouseholdExpenditure' },
  {
    method: 'PUT',
    endpoint: '**/expendituredetails',
    alias: 'putHouseholdExpenditure',
  },
  { method: 'GET', endpoint: '**/applicants/currentincome', alias: 'getCurrentIncome' },
  {
    method: 'PUT',
    endpoint: '**/applicants/currentincome',
    alias: 'putCurrentIncome',
  },
  { method: 'GET', endpoint: '**/applicants/futurechangesinincome', alias: 'getFutureChanges' },
  {
    method: 'PUT',
    endpoint: '**/applicants/futurechangesinincome',
    alias: 'putFutureChanges',
  },

  { method: 'GET', endpoint: '**/Calculation/affordability?*', alias: 'getAffordability' },
  { method: 'PUT', endpoint: `**/submit/**`, alias: 'putSubmitDip' },
  { method: 'GET', endpoint: '/dipsummary$', alias: 'getDipSummary' },
  { method: 'GET', endpoint: '/fmasummary$', alias: 'getDipSummary' },
  { method: 'GET', endpoint: '/stipulations$', alias: 'getDipSummary' },
];
