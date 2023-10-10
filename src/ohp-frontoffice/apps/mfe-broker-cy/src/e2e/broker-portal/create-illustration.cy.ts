import {
  applicationDraft,
  case1,
  firm1,
  getIllustrationLoanDetails,
  getIllustrationProductSelection,
  loan1,
  validCredentials,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseListStubs, createIllustrationStubs } from '../../fixtures/illustration/new/newIllustrationStubs';
import { newIllustration } from '../../fixtures/illustration/new/newIllustrationData';
import { LoanDetailsResponse, ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

describe('create illustration', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(caseListStubs);
    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, caseListStubs);
  });

  it('should be able to create a new illustration', () => {
    cy.stubRequests(createIllustrationStubs);

    cy.findByRole('button', { name: /create illustration/i }).click();
    cy.url().should('contain', `/illustration/${applicationDraft.id}/loan/${loan1.id}`);

    // fill in loan details page
    cy.useInput(newIllustration.loanDetails.purchasePrice);
    cy.useDropdown(newIllustration.loanDetails.propertyLocation);
    cy.useInput(newIllustration.loanDetails.totalLoanAmount);

    // clone responses and stub future requests
    const updatedLoanDetails = Object.assign<Record<string, never>, LoanDetailsResponse>({}, getIllustrationLoanDetails);
    const updatedProductSelection = Object.assign<Record<string, never>, ProductSelectionResponse>({}, getIllustrationProductSelection);

    updatedLoanDetails.purchasePrice = newIllustration.loanDetails.purchasePrice.value;
    updatedLoanDetails.propertyLocationRegion = newIllustration.loanDetails.propertyLocation.value;
    updatedLoanDetails.totalLoanAmount = newIllustration.loanDetails.totalLoanAmount.value;
    updatedProductSelection.purchaseAmount = newIllustration.loanDetails.purchasePrice.value;
    updatedProductSelection.loanAmount = newIllustration.loanDetails.totalLoanAmount.value;

    cy.stubRequests([
      {
        method: 'PUT',
        endpoint: `/loandetails/${loan1.id}`,
        alias: 'putLoanDetails',
        stub: updatedLoanDetails,
      },
      {
        method: 'GET',
        endpoint: `/loandetails/${loan1.id}`,
        alias: 'getLoanDetails',
        stub: updatedLoanDetails,
      },
      {
        method: 'GET',
        endpoint: `/productselection/${loan1.id}`,
        alias: 'getProductSelection',
        stub: updatedProductSelection,
      },
    ]);

    // navigate to Product Selection
    cy.findByRole('button', { name: /next/i }).click();

    // Select product
    cy.wait('@getProductSelection');
    cy.wait('@getProgress');
    cy.wait('@getProductsAvailability');
    cy.useInput(newIllustration.productSelection.termOfMortgage);
    cy.findByText(/select product/i).click();
    cy.findAllByRole('radio').then(products => {
      products[0].click();
    });
    cy.findByRole('button', { name: /confirm/i }).click();

    // Navigate to Advice and Fees
    cy.findByRole('button', { name: /next/i }).click();

    // Fill Advice and Fees
    cy.useInput(newIllustration.adviceAndFees.feeAmount);
    cy.useDropdown(newIllustration.adviceAndFees.whenPayable);
    cy.useInput(newIllustration.adviceAndFees.payableTo);

    // Navigate to Confirm
    cy.findByRole('button', { name: /next/i }).click();

    // Confirm Submission
    cy.findByRole('button', { name: /confirm/i }).click();
    cy.findByRole('dialog')
      .findByRole('button', { name: /confirm/i })
      .click();

    cy.url().should('contain', `/broker/${firm1.id}/cases/${case1.id}`);
  });

  it('should navigate properly navigate to broker panel with unsaved changes in product selection', () => {
    cy.stubRequests(createIllustrationStubs);

    cy.findByRole('button', { name: /create illustration/i }).click();
    cy.url().should('contain', `/illustration/${applicationDraft.id}/loan/${loan1.id}`);

    // fill in loan details page
    cy.useInput(newIllustration.loanDetails.purchasePrice);
    cy.useDropdown(newIllustration.loanDetails.propertyLocation);
    cy.useInput(newIllustration.loanDetails.totalLoanAmount);

    // clone responses and stub future requests
    const updatedLoanDetails = Object.assign<Record<string, never>, LoanDetailsResponse>({}, getIllustrationLoanDetails);
    const updatedProductSelection = Object.assign<Record<string, never>, ProductSelectionResponse>({}, getIllustrationProductSelection);

    updatedLoanDetails.purchasePrice = newIllustration.loanDetails.purchasePrice.value;
    updatedLoanDetails.propertyLocationRegion = newIllustration.loanDetails.propertyLocation.value;
    updatedLoanDetails.totalLoanAmount = newIllustration.loanDetails.totalLoanAmount.value;
    updatedProductSelection.purchaseAmount = newIllustration.loanDetails.purchasePrice.value;
    updatedProductSelection.loanAmount = newIllustration.loanDetails.totalLoanAmount.value;

    cy.stubRequests([
      {
        method: 'PUT',
        endpoint: `/loandetails/${loan1.id}`,
        alias: 'putLoanDetails',
        stub: updatedLoanDetails,
      },
      {
        method: 'GET',
        endpoint: `/loandetails/${loan1.id}`,
        alias: 'getLoanDetails',
        stub: updatedLoanDetails,
      },
      {
        method: 'GET',
        endpoint: `/productselection/${loan1.id}`,
        alias: 'getProductSelection',
        stub: updatedProductSelection,
      },
    ]);

    // navigate to Product Selection
    cy.findByRole('button', { name: /next/i }).click();

    // Select product
    cy.useInput(newIllustration.productSelection.termOfMortgage);
    cy.findByText(/select product/i).click();
    cy.findAllByRole('radio').then(products => {
      products[0].click();
    });
    cy.findByRole('button', { name: /confirm/i }).click();

    cy.get('.toggle-box-modules > div').click();
    cy.findByRole('link', { name: /broker panel/i });
  });
});
