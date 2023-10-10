import { getFirmResponse, panelCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { createGlobalStubs } from '../../../fixtures/global/globalStubs';
import {
  addressesStubs,
  getIntermediaryByAdvisorUniqueId204Stub,
  getIntermediaryByAdvisorUniqueIdStub,
  newIntermediary,
  newIntermediaryStub,
} from '../../../fixtures/firms/intermediary/addIntermediaryStubsAndData';

describe('Add Intermediary', () => {
  beforeEach(() => {
    cy.login(panelCredentials);
    cy.stubRequests([...createGlobalStubs(panelCredentials.getMe), ...addressesStubs]);
    cy.visitAndWaitRequests(`/panel/firms/${getFirmResponse.firmId}/users/new`, addressesStubs);
    cy.findByRole('tab', { name: /personal details/i }).click();
    cy.findByRole('tab', { name: /contact/i }).click();
    cy.findByRole('tab', { name: /trading address information/i }).click();
  });

  it('should create a new intermediary', () => {
    cy.findByLabelText(/date of birth/i).type('01/01/1990');
    // No all the fields were entered correctly
    cy.findByRole('button', { name: /invite/i }).click();
    cy.findByText(/Please fill in all required fields/i);

    //All the fields were entered correctly
    cy.fillForm(newIntermediary);
    cy.stubRequests(newIntermediaryStub);
    cy.findByRole('button', { name: /invite/i }).click();
    cy.wait('@postNewIntermediary');
    cy.findByText(/Intermediary created successfully/i);
  });

  it('should use the populate data button to fill the data of an advisor', () => {
    cy.useRadio({ matcher: /user's role/i, value: 'Advisor and Supervisor' });
    cy.useInput({ matcher: /advisor unique ID/i, value: '1234' });
    // STATUS 200
    cy.stubRequests(getIntermediaryByAdvisorUniqueIdStub);
    cy.findByRole('button', { name: /populate data/i }).click();
    cy.wait('@getIntermediaryByAdvisorUniqueId');
    cy.findByLabelText(/first name/i)
      .should('be.disabled')
      .should('contain.value', 'Test');
    cy.findByLabelText(/surname/i)
      .should('be.disabled')
      .should('contain.value', 'Advisor');
    // STATUS 204
    cy.stubRequests(getIntermediaryByAdvisorUniqueId204Stub);
    cy.findByRole('button', { name: /populate data/i }).click();
    cy.wait('@getIntermediaryByAdvisorUniqueId204');
    cy.findByText(/the introduced unique advisor ID does not exist. please, provide a valid one./i);
  });
});
