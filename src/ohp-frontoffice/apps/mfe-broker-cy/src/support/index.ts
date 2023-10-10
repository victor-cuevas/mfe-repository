import '@testing-library/cypress/add-commands';
import 'cypress-each';

import './commands';
import { createGlobalStubs } from '../fixtures/global/globalStubs';
import { validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';

Cypress.on('uncaught:exception', err => !err.message.includes('import.meta'));

beforeEach(() => {
  cy.stubRequests(createGlobalStubs(validCredentials.getMe));
});
