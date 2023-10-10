import { validCredentials, firm1, case1 } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { SubmissionRoute } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { getProductSelectionStubs, errorCombinations } from '../../../fixtures/dip/product-selection/networksClubsStubs';
import { TestCallback } from 'mocha';

describe('DIP product selection Networks & Clubs errors', () => {
  beforeEach(() => {
    cy.login(validCredentials);
  });

  const testCb = (
    error: string,
    id: string,
    network: string | null,
    mortgageClub: string | null,
    useMortgageClub: boolean | null,
    networkOptions: SubmissionRoute[],
    clubsOptions: SubmissionRoute[],
    daOptions: SubmissionRoute[],
  ): void => {
    const stubs: IStub[] = getProductSelectionStubs(network, mortgageClub, useMortgageClub, networkOptions, clubsOptions, daOptions);
    cy.stubRequests(stubs);
    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}/dip/product-selection`, stubs);
    cy.findByText(new RegExp(error));
  };

  it.each(errorCombinations)('Combination %1 should show error message: %0', testCb as TestCallback<unknown>);
});
