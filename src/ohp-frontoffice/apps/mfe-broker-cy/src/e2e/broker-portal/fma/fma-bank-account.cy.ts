import { getCaseById, getFirmResponse, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseSummaryStubs, contactDetailsStubs, globalFmaStubs } from '../../../fixtures/fma/fmaHappyPathStubs';
import { personalDetailsStubs } from '../../../fixtures/dip/dipStubs';
import { bankAccountStub } from '../../../fixtures/fma/fmaBankAcountDataAndStubs';
import TestCallback = Mocha.TestCallback;

describe('FMA Bank account validation', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([...globalFmaStubs, ...caseSummaryStubs, ...contactDetailsStubs, ...personalDetailsStubs]);
  });

  const testCb = (
    sortCode: string,
    accountNumber: string,
    isValid: boolean,
    responseType: 'Error' | 'Warning' | 'Information',
    messageToDisplay: string,
  ) => {
    cy.stubRequests(bankAccountStub(sortCode, accountNumber, isValid, responseType));
    cy.visitAndWaitRequests(
      `/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/fma/bank-account`,
      bankAccountStub(sortCode, accountNumber, isValid, responseType),
    );
    cy.url().should('contain', '/fma/bank-account');
    cy.findByRole('heading', { name: /bank account/i });
    cy.findByRole('button', { name: /validate account/i }).click();
    cy.wait('@validateBankAccount');
    cy.findByRole('heading', { name: messageToDisplay });
  };

  const bankAccountValidationCases = [
    ['123456', '12345678', true, 'Information', /accepted/i],
    ['770116', '38404384', true, 'Warning', /warning/i],
    ['123458', '12345678', false, 'Error', /not valid/i],
  ];

  it.each(bankAccountValidationCases)(
    'Should show %4 when the sort code is %0 and the account number is %1',
    testCb as TestCallback<unknown>,
  );
});
