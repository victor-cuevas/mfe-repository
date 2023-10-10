import { getFirmResponse, panelCredentials, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseListStubs } from '../../../fixtures/cases/newCase/newCaseStubs';
import { throwExceptionStub } from '../../../fixtures/errors/errorsStubs';
import { panelTranslations, portalTranslations } from '@close-front-office/mfe-broker/shared-assets';
import { TestCallback } from 'mocha';
import { createGlobalStubs } from '../../../fixtures/global/globalStubs';

describe('Error handling', () => {
  describe('Broker Portal', () => {
    beforeEach(() => {
      cy.login(validCredentials);
    });

    const testCb = (status: number, errorCode: string) => {
      const errorMessage =
        (portalTranslations.general.errors[errorCode as unknown as keyof typeof portalTranslations.general.errors] as string) ??
        (portalTranslations.general.errors[status as unknown as keyof typeof portalTranslations.general.errors] as string) ??
        (portalTranslations.general.errors[`default${status}` as unknown as keyof typeof portalTranslations.general.errors] as string);

      cy.stubRequests([...caseListStubs, throwExceptionStub(status, errorCode)]);
      cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases`, caseListStubs);
      cy.findByPlaceholderText(/Insert the error code/i).type(errorCode);
      cy.findByRole('button', { name: /throw error/i }).click();
      cy.wait('@throwException');
      cy.findByText(errorMessage);
    };

    const cases = [
      [500, '999001'],
      [400, '001002'],
      [403, '999002'],
      [404, '999003002002'],
      [400, '003005'],
      [409, '003004'],
    ];

    it.each(cases)('Should show an error on the screen when receiving a %0 from the BFF', testCb as TestCallback<unknown>);
  });

  describe('Broker Panel', () => {
    beforeEach(() => {
      cy.login(panelCredentials);
      cy.stubRequests(createGlobalStubs(panelCredentials.getMe));
      cy.visit('/panel');
    });

    const testCb = (status: number, errorCode: string) => {
      const errorMessage =
        (panelTranslations.general.errors[errorCode as unknown as keyof typeof panelTranslations.general.errors] as string) ??
        (panelTranslations.general.errors[status as unknown as keyof typeof panelTranslations.general.errors] as string) ??
        (panelTranslations.general.errors[`default${status}` as unknown as keyof typeof panelTranslations.general.errors] as string);

      cy.stubRequests([throwExceptionStub(status, errorCode)]);
      cy.findByPlaceholderText(/Insert the error code/i).type(errorCode);
      cy.findByRole('button', { name: /throw error/i }).click();
      cy.wait('@throwException');
      cy.findByText(errorMessage);
    };

    const cases = [
      [500, '001001'],
      [400, '003003'],
      [403, '999003'],
      [404, '999003002002'],
      [400, '001002'],
      [409, '003004'],
    ];

    it.each(cases)('Should show an error on the screen when receiving a %0 from the BFF', testCb as TestCallback<unknown>);
  });
});
