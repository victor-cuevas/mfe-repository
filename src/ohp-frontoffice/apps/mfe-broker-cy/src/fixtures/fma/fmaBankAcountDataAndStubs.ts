//Stubs
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { createBankAccountDetails, createBankValidation } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

export const bankAccountStub: (
  sortCode: string,
  accountNumber: string,
  isValid: boolean,
  responseType: 'Error' | 'Warning' | 'Information',
) => IStub[] = (sortCode, accountNumber, isValid, responseType) => {
  return [
    {
      method: 'GET',
      endpoint: '/bankaccountdetails$',
      alias: 'getBankAccountDetails',
      stub: createBankAccountDetails(sortCode, accountNumber),
    },
    {
      method: 'GET',
      endpoint: '/validatebankaccount',
      alias: 'validateBankAccount',
      stub: createBankValidation(isValid, responseType),
    },
  ];
};
