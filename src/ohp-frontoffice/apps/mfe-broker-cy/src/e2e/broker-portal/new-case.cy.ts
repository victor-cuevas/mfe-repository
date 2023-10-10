import { validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { postNewCaseResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseListStubs, newCaseStubs } from '../../fixtures/cases/newCase/newCaseStubs';
import { newCaseData } from '../../fixtures/cases/newCase/newCaseData';

describe('New Case', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(caseListStubs);
    cy.visitAndWaitRequests('/', caseListStubs);
  });

  it('should be able to create a new case', () => {
    const { casePurposeType, applicant, applicantType } = newCaseData;
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
    cy.useInput(applicant.name);
    cy.useInput(applicant.surname);
    cy.useInput(applicant.dateOfBirth);

    // navigate next
    cy.findByRole('link', { name: /review/i }).click();

    // review selected data
    cy.findByText(newCaseData.owner);
    cy.findByText(casePurposeType.value);
    cy.findByText(applicantType.value);
    cy.findByText(`${applicant.name.value} ${applicant.surname.value}`);

    // submit the new application
    cy.stubRequests(newCaseStubs);

    cy.findByRole('link', { name: /submit/i }).click();

    newCaseStubs.forEach(stub => {
      const alias = `@${stub.alias}`;
      cy.wait(alias);
    });

    cy.url().should('contain', postNewCaseResponse.caseId);
  });
});
