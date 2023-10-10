import { extractAliases } from './helpers';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

Cypress.Commands.add('lg', msg => {
  cy.log(msg);
  cy.task('log', msg);
});

Cypress.Commands.add('login', ({ email, password, getMe }) => {
  const stubs: IStub[] = [
    {
      method: 'GET',
      endpoint: '/cases$',
      alias: 'getCases',
      stub: [],
    },
    { method: 'GET', endpoint: '/me$', alias: 'getMe', stub: getMe },
  ];

  cy.session([email, password], () => {
    cy.visit('/');
    cy.get('form')
      .findByPlaceholderText(/username/i)
      .type(email);
    cy.get('form')
      .findByPlaceholderText(/password/i)
      .type(password);

    cy.stubRequests(stubs);

    cy.get('form').submit();
    cy.wait('@getMe');
    if (getMe.userType === 'Intermediary') {
      cy.wait('@getCases');
    }
  });
});

Cypress.Commands.add('stubRequests', stubs => {
  const baseURL = '^http(?!.*(localhost)).*';
  stubs.forEach(({ method, endpoint, alias, stub, options }) => {
    cy.intercept(method, new RegExp(baseURL + endpoint), req => {
      if (options?.expectedReqPayload) {
        expect(req.body).to.deep.equal(options.expectedReqPayload);
      }
      if (stub) {
        req.reply({
          statusCode: options?.statusCode ?? 200,
          body: stub,
        });
      } else req.continue();
    }).as(alias);
  });
});

Cypress.Commands.add('visitAndWaitRequests', (url, aliasesOrStubs) => {
  let aliases: string[];

  const isStringArray = (val: string[] | IStub[]): val is string[] => {
    return val?.length !== 0 && typeof val[0] === 'string';
  };

  if (isStringArray(aliasesOrStubs)) {
    aliases = aliasesOrStubs;
  } else {
    aliases = extractAliases(aliasesOrStubs);
  }

  cy.visit(url);
  aliases.forEach(alias => {
    cy.wait(alias);
  });
});

Cypress.Commands.add('useInput', ({ matcher, value }) => {
  cy.findByLabelText(matcher).type(value.toString());
});

Cypress.Commands.add('useDropdown', ({ matcher, value }) => {
  cy.findByLabelText(matcher).click();
  cy.findByRole('option', { name: value }).click();
});

Cypress.Commands.add('useRadio', ({ matcher, value }) => {
  cy.findByLabelText(matcher).findByText(value).click();
});

Cypress.Commands.add('useDateInput', ({ matcher, value }) => {
  cy.findByLabelText(matcher)
    .findByRole('textbox')
    .type(value.toString() + '{esc}');
});

Cypress.Commands.add('useCheckbox', ({ matcher }) => {
  cy.findByText(matcher).click({ timeout: 10000 });
});

Cypress.Commands.add('fillForm', formData => {
  formData.forEach(({ type, details }) => {
    switch (type) {
      case 'INPUT':
        cy.useInput(details);
        break;
      case 'DROPDOWN':
        cy.useDropdown(details);
        break;
      case 'RADIO':
        cy.useRadio(details);
        break;
      case 'DATE':
        cy.useDateInput(details);
        break;
      case 'CHECKBOX':
        cy.useCheckbox(details);
        break;
      default:
        break;
    }
  });
});

Cypress.Commands.add('isStepComplete', (step: string, options?: { expectedCheck?: boolean }): void => {
  const opts = Object.assign({}, { expectedCheck: true }, options);
  const { expectedCheck } = opts;

  // allow extra time to load the UI element. Otherwise, the test fails often because it hasn't updated yet.
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);

  cy.findByRole('tab', { name: new RegExp(step, 'i') })
    .children()
    .first()
    .children()
    .first()
    .then($el => {
      const win = $el[0].ownerDocument.defaultView;
      const before = win?.getComputedStyle($el[0], 'before');
      const stepMark = before?.getPropertyValue('content');

      if (expectedCheck) {
        expect(stepMark, `Expected "${step}" step to be marked as "complete"`).not.to.eq('none');
      } else {
        expect(stepMark, `Expected "${step}" step to be marked as "incomplete"`).to.eq('none');
      }
    });
});

Cypress.Commands.add('goToNextStep', (): void => {
  cy.findByRole('button', { name: /next/i }).click();
});
