import { invalidCredentials, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { logoutStubs } from '../../fixtures/login/loginStubs';

describe('login - logout', () => {
  it('should fail to login with invalid credentials', () => {
    cy.visit('/');

    // Fill in Credentials
    cy.get('form')
      .findByPlaceholderText(/username/i)
      .type(invalidCredentials.email);
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .type(invalidCredentials.password);

    cy.get('form').submit();

    // Expect login error
    cy.findByRole('alert')
      .contains(/incorrect username or password/i)
      .should('exist');
  });

  it('should be able to login to the application', () => {
    cy.login(validCredentials);

    cy.visit('/');
    cy.wait('@getMe');
    cy.findByText(new RegExp(validCredentials.username)).should('exist');
  });

  it('should not display the password field', () => {
    cy.visit('/');
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .type(validCredentials.password);

    // Password content is hidden
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .should('have.attr', 'type', 'password');

    // Password content is shown
    cy.findByLabelText('Show password').click();
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .should('have.attr', 'type', 'text');

    // Password content is hidden again
    cy.findByLabelText('Show password').click();
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .should('have.attr', 'type', 'password');
  });

  it('should offer a password recovery option', () => {
    cy.visit('/');
    cy.findByText(/forgot your password/i).click();
    cy.findByRole('heading', { name: /reset your password/i }).should('exist');
  });

  it('an authenticated user should be able to logout', () => {
    cy.stubRequests(logoutStubs);

    cy.login(validCredentials);
    cy.visit('/');

    cy.findByText(new RegExp(validCredentials.username)).click();
    cy.findByText(/log out/i).click();

    // User has been redirected to the Login page
    cy.findByText(/sign in/i);
  });
});
