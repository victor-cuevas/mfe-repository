import { validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseListStubs } from '../fixtures/cases/newCase/newCaseStubs';
import { newCaseData } from '../fixtures/cases/newCase/newCaseData';
import {
  submitAddressHistory,
  submitAdviceAndFees,
  submitAhAddress,
  submitAhAddressType,
  submitConfirmDip,
  submitCurrentIncome,
  submitDepositDetails,
  submitFinancialCommitments,
  submitFutureChanges,
  submitHouseholdExpenditure,
  submitPersonalDetails,
  submitProductSelection,
  submitPropertyAndLoanDetails,
  submitSecurityProperty,
  submitSpAddress,
} from '../fixtures/dip/submitDip';
import { faker } from '@faker-js/faker';
import { submitDipStubs } from './submit-dip.stubs';

const { email, password, username } = validCredentials;

const goToNext = () => {
  cy.findByRole('button', { name: /next/i }).click();
};

const awaitStep = (stepName: string) => {
  const stepNameToUpper = stepName.slice(0, 1).toUpperCase() + stepName.slice(1, stepName.length);

  cy.wait(`@put${stepNameToUpper}`);
  cy.wait(`@get${stepNameToUpper}`);
  cy.wait('@getProgress');
  cy.wait('@putProgress');
};

describe('DIPPY INITIALIZED🤖', () => {
  beforeEach(() => {
    Cypress.env();
    cy.login({ email: Cypress.env('EMAIL') ?? email, password, username });
    cy.stubRequests(caseListStubs);
    cy.visitAndWaitRequests('/', caseListStubs);

    cy.wait('@getCodetables');
    cy.wait('@getMe');

    submitDipStubs.forEach(stub => {
      cy.intercept(stub.method, stub.endpoint).as(stub.alias);
    });
  });
  const { casePurposeType, applicantType } = newCaseData;

  Cypress._.times(Cypress.env('CASES') ?? 1, () => {
    it('should create a completed DIP', () => {
      cy.lg('Creating new case');
      cy.findByRole('link', { name: /new case/i }).click();

      // Select Application Type
      cy.useDropdown(casePurposeType);

      // Check T&C
      newCaseData.tac.forEach(check => {
        cy.findByText(check).click();
      });

      // navigate next
      cy.findByRole('link', { name: /next/i }).click();

      // Select Applicant Type
      cy.useDropdown(applicantType);

      // fill in applicant details
      cy.useInput({
        matcher: /first name/i,
        value: faker.name.firstName().replace(/[^a-zA-Z]/g, ''),
      });
      cy.useInput({
        matcher: /surname/i,
        value: faker.name.lastName().replace(/[^a-zA-Z]/g, ''),
      });
      cy.useInput({
        matcher: /date of birth/i,
        value: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }).toLocaleDateString('es'),
      });

      // navigate next
      cy.findByRole('link', { name: /review/i }).click();
      cy.findByRole('link', { name: /submit/i }).click();
      cy.wait('@postCase');
      cy.wait('@getCase');
      cy.findByRole('button', { name: /create dip/i }).click();
      cy.wait('@createDip');
      cy.wait('@getPropertyAndLoanDetails');
      cy.wait('@getProductSelection');
      cy.wait('@getCurrentIncome');
      cy.wait('@getExistingMortgage');
      cy.lg('Creating DIP');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.lg('Filling in property and loan details');
      cy.wait('@getPropertyAndLoanDetails');
      cy.fillForm(submitPropertyAndLoanDetails);
      goToNext();
      awaitStep('propertyAndLoanDetails');
      cy.lg('Filling in security property');
      cy.wait('@getSecurityProperty');
      cy.useInput(submitSpAddress);
      cy.wait('@postAddressSearch');
      cy.findByRole('option', { name: submitSpAddress.value }).click();
      cy.wait('@postAddressRegister');

      cy.fillForm(submitSecurityProperty);
      goToNext();
      awaitStep('securityProperty');
      cy.lg('Filling in deposit details');
      cy.wait('@getDepositDetails');
      cy.fillForm(submitDepositDetails);
      goToNext();
      awaitStep('depositDetails');
      cy.lg('Selecting products');
      cy.wait('@getProductSelection');
      cy.wait('@getFirmAssociations');
      cy.fillForm(submitProductSelection);
      cy.findByRole('heading', { name: /product selection/i }).click();
      // TODO: uncomment for product selection
      cy.findByRole('button', { name: /select product/i }).click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait('@getProducts');
      cy.get('div.p-radiobutton-box').first().click();
      cy.findByRole('button', { name: /confirm/i }).click();
      goToNext();
      awaitStep('productSelection');
      cy.lg('Paying the advisors');
      cy.wait('@getAdviceAndFees');
      cy.fillForm(submitAdviceAndFees);
      goToNext();
      awaitStep('adviceAndFees');
      cy.lg('Selling personal data');
      cy.wait('@getPersonalDetails');
      cy.fillForm(submitPersonalDetails);
      goToNext();
      awaitStep('personalDetails');
      cy.lg('Filling in address history');
      cy.wait('@getAddressHistory');
      cy.useDropdown(submitAhAddressType);
      cy.useInput(submitAhAddress);
      cy.findByRole('option', { name: submitAhAddress.value }).click();
      cy.fillForm(submitAddressHistory);
      goToNext();
      awaitStep('addressHistory');
      cy.lg("Promising I don't have a credit card");
      cy.wait('@getFinancialCommitments');
      cy.useRadio(submitFinancialCommitments);
      goToNext();
      awaitStep('financialCommitments');
      cy.lg('Filling in household expenditure');
      cy.wait('@getHouseholdExpenditure');
      cy.wait('@getSecurityProperty');
      cy.fillForm(submitHouseholdExpenditure);
      goToNext();
      awaitStep('householdExpenditure');
      cy.lg('Sharing salary details');
      cy.wait('@getCurrentIncome');
      cy.fillForm(submitCurrentIncome);
      goToNext();
      awaitStep('currentIncome');
      cy.lg('Predicting future changes');
      cy.wait('@getFutureChanges');
      cy.useRadio(submitFutureChanges);
      goToNext();
      awaitStep('futureChanges');
      cy.wait('@getAffordability');
      cy.lg('Getting a coffee');
      cy.fillForm(submitConfirmDip);
      cy.findByRole('button', { name: /submit/i }).click();
      cy.lg('Done!');
      cy.wait('@putSubmitDip');
    });
  });
});
