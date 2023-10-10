import getCodetablesByNames from '../codetables/getCodeTables.json';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { getFirmResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

export const createGlobalStubs = (getMe: unknown): IStub[] => [
  // stub ALL external calls
  { method: 'GET', endpoint: '', alias: 'globalGet', stub: {} },
  { method: 'POST', endpoint: '', alias: 'globalPost', stub: {} },
  { method: 'PUT', endpoint: '', alias: 'globalPut', stub: {} },
  { method: 'DELETE', endpoint: '', alias: 'globalDelete', stub: {} },

  // Allow Cognito connections for authentication
  { method: 'POST', endpoint: 'cognito.*', alias: 'cognito' },

  // Stub codetables
  { method: 'POST', endpoint: '/codetablesbynames$', alias: 'getCodetables', stub: getCodetablesByNames },

  // Stub identity calls: user information and Firm information
  { method: 'GET', endpoint: '/me$', alias: 'getMe', stub: getMe },
  { method: 'GET', endpoint: '/Firm(s?)/.*', alias: 'getFirm', stub: getFirmResponse },
];

export const botStubs: IStub[] = [
  { method: 'DELETE', endpoint: '', alias: 'globalDelete', stub: {} },

  // Allow Cognito connections for authentication
  { method: 'POST', endpoint: 'cognito.*', alias: 'cognito' },

  // Stub codetables
  { method: 'POST', endpoint: '/codetablesbynames$', alias: 'getCodetables', stub: getCodetablesByNames },

  // Stub identity calls: user information and Firm information
  { method: 'GET', endpoint: '/me$', alias: 'getMe' },
];
