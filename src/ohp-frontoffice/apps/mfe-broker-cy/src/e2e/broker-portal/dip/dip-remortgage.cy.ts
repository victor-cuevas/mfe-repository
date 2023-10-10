import {
  decimal,
  getFirmResponse,
  getRemortgageCaseById,
  loanAmount,
  remortgageDipSummary,
  validCredentials,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  additionalBorrowingStub,
  caseSummaryStubs,
  existingMortgageStubs,
  globalRemortgageDipStubs,
  propertyAndLoanDetailsStubs,
  securityPropertyStubs,
  submitAdditionalBorrowing,
  submitExistingMortgages,
  submitPropertyAndLoanStubs,
  submitSecurityPropertyStubs,
} from '../../../fixtures/dip/dipRemorgageStubs';
import {
  additionalBorrowing,
  existingMortgages,
  existingMortgagesAmountToBeRepaidEqualTotalLoanAmount,
  existingMortgagesDepositDetail,
  propertyAndLoanDetails,
  securityProperty,
  spAddress,
} from '../../../fixtures/dip/dipRemortageHappyPathData';

describe('DIP remortgages happy path - until deposit details screen', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(caseSummaryStubs);
  });

  it('should create DIP for remortgages case following the happy path  ', function () {
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getRemortgageCaseById.caseId}`, caseSummaryStubs);
    cy.stubRequests(globalRemortgageDipStubs);
    cy.stubRequests(propertyAndLoanDetailsStubs);

    cy.findAllByRole('row', {
      name: new RegExp((remortgageDipSummary.applicants && remortgageDipSummary.applicants[0].fullName) ?? '', 'i'),
    });

    // Click on "Resume DIP"
    cy.findByRole('button', { name: /resume dip/i }).click();

    // Property and Loan details
    cy.lg('Property and Loan Details');
    cy.url().should('contain', '/dip/property-and-loan');
    cy.findByRole('heading', { name: /property and loan/i });

    cy.fillForm(propertyAndLoanDetails);

    cy.stubRequests([...submitPropertyAndLoanStubs, ...securityPropertyStubs]);
    cy.wait('@putPropertyAndLoanDetails');
    cy.findByText(new RegExp(decimal.toFixed(1)));
    cy.isStepComplete('property and loan details');
    cy.goToNextStep();

    //Security Property
    cy.lg('Security Property');
    cy.wait('@getSecurityProperty');
    cy.url().should('contain', '/dip/security-property');
    cy.findAllByRole('heading', { name: /security property/i });

    //Fill the address
    cy.useInput(spAddress);
    cy.wait('@postAddressSearch');
    cy.findAllByRole('option', { name: spAddress.value }).click();
    cy.fillForm(securityProperty);

    cy.stubRequests([...submitSecurityPropertyStubs, ...existingMortgageStubs]);
    cy.isStepComplete('security property');
    cy.goToNextStep();

    //Existing mortgages
    cy.lg('existing mortgages');
    cy.wait('@getExistingMortgages');
    cy.url().should('contain', '/dip/existing-mortgages');
    cy.findByRole('heading', { name: /existing mortgages/i });

    cy.fillForm(existingMortgages);

    cy.stubRequests([...submitExistingMortgages, ...additionalBorrowingStub]);
    cy.isStepComplete('existing mortgages');
    cy.goToNextStep();

    //Additional borrowing
    cy.lg('additional borrowing');
    cy.wait('@getAdditionalBorrowing');
    cy.url().should('contain', 'dip/additional-borrowing');
    cy.findByRole('heading', { name: /additional borrowing/i });

    cy.findAllByText(/to be satisfied/i)
      .last()
      .parent()
      .should('have.class', 'warning-text')
      .and('contain.text', `£${loanAmount.toLocaleString()}`);

    cy.fillForm(additionalBorrowing);

    cy.stubRequests([...submitAdditionalBorrowing]);
    cy.isStepComplete('additional borrowing');
  });
});

describe('DIP remortgages show - hide deposit and additional borrowing screen', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([...existingMortgageStubs, ...caseSummaryStubs, ...propertyAndLoanDetailsStubs]);
  });

  it('Should show deposit details screen', () => {
    cy.visitAndWaitRequests(
      `/broker/${getFirmResponse.firmId}/cases/${getRemortgageCaseById.caseId}/dip/existing-mortgages`,
      existingMortgageStubs,
    );

    //Existing mortgages
    cy.lg('existing mortgages');
    cy.wait('@getExistingMortgages');
    cy.url().should('contain', '/dip/existing-mortgages');
    cy.findByRole('heading', { name: /existing mortgages/i });

    cy.fillForm(existingMortgagesDepositDetail);

    cy.findByText(/additional borrowing/i).should('not.exist');
    cy.findByText(/deposit/i);
  });

  it('Should hide deposit details and additional borrowing screen when total loan amount is equal to amount to be repaid', () => {
    cy.visitAndWaitRequests(
      `/broker/${getFirmResponse.firmId}/cases/${getRemortgageCaseById.caseId}/dip/existing-mortgages`,
      existingMortgageStubs,
    );

    //Existing mortgages
    cy.lg('existing mortgages');
    cy.wait('@getExistingMortgages');
    cy.url().should('contain', '/dip/existing-mortgages');
    cy.findByRole('heading', { name: /existing mortgages/i });

    cy.fillForm(existingMortgagesAmountToBeRepaidEqualTotalLoanAmount);

    cy.findByText(/additional borrowing/i).should('not.exist');
    cy.findByText(/deposit/i).should('not.exist');
  });
});
