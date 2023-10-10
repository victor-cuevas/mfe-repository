import '@testing-library/cypress/add-commands';

import './commands';
import { botStubs } from '../fixtures/global/globalStubs';

Cypress.on('uncaught:exception', err => !err.message.includes('import.meta'));

beforeEach(() => {
  cy.stubRequests(botStubs);
});
