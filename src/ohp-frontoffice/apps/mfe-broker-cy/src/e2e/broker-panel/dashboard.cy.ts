import { panelCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { createGlobalStubs } from '../../fixtures/global/globalStubs';

describe('Dashboard', () => {
  beforeEach(() => {
    cy.login(panelCredentials);
    cy.stubRequests(createGlobalStubs(panelCredentials.getMe));
    cy.visit('/panel');
    cy.url().should('include', 'panel');
  });

  it('should navigate to the linked pages', () => {
    cy.findByRole('link', { name: /firms/i });
    cy.findByRole('link', { name: /submission routes/i });
    cy.findByRole('link', { name: /configuration/i });
    cy.findByRole('link', { name: /lender/i });
  });
});
