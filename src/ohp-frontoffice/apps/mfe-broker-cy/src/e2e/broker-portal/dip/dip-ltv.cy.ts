import { case1, firm1, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  dipLtvCalculationInitialStubs,
  getProductsRequest,
  invalidProducts,
  validProducts,
  productSelectionInvalidLtv,
} from '../../../fixtures/dip/dipLtvCalculationStubs';

const selectPaymentMethod = (value: RegExp) => {
  cy.findAllByLabelText(/payment method/i)
    .last()
    .click();
  cy.findByRole('option', { name: value }).click();
};

describe('DIP - LTV calculation', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([...dipLtvCalculationInitialStubs, ...validProducts]);
  });

  it('should check the current progress correctly depending on the LTV value', () => {
    // Create a situation where the LTV reaches the limit with loanAmount / purchasePrice
    // Navigate to the advice and fees page
    cy.lg('starting test');
    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}/dip/advice-and-fees`, dipLtvCalculationInitialStubs);
    cy.findByRole('heading', { name: /advice and fees/i });
    // Pay the product fees with Credit Card
    cy.lg('advice and fees select payment method');
    selectPaymentMethod(/credit/i);

    // The page becomes complete and Product selection is also complete
    cy.lg('product selection step complete?');
    cy.isStepComplete('product selection');
    cy.lg('advice and fees step complete?');
    cy.isStepComplete('advice and fees');

    // LTV goes over the limit
    cy.stubRequests(invalidProducts);
    // Select to add the fee to the loan
    cy.lg('advice and fees select payment method - add to loan');
    selectPaymentMethod(/add to loan/i);
    cy.goToNextStep();
    cy.wait('@getProductsAvailabiliy');
    cy.wait('@getPersonalDetails');

    cy.url().should('contain', 'personal-details');
    cy.findByRole('heading', { name: /personal details/i });
    // The Product selection call comes back invalid and both screens should be marked as incomplete
    cy.url().should('include', 'personal-details');
    cy.findByRole('heading', { name: /personal details/i });
    cy.isStepComplete('product selection', { expectedCheck: false });
    cy.isStepComplete('advice and fees', { expectedCheck: false });

    cy.findByText(/advice and fees/i).click();
    cy.wait('@getAdviceAndFees');

    // Change the fee back to credit card
    cy.lg('stub valid products');
    cy.stubRequests(validProducts);
    cy.lg('advice and fees select payment method - credit - second time');
    selectPaymentMethod(/credit/i);
    cy.goToNextStep();
    cy.wait('@getProductsAvailabiliy');
    cy.wait('@getPersonalDetails');

    // Both screens should be marked as complete again
    cy.lg('product selection step complete? second time');
    cy.isStepComplete('product selection');
    cy.lg('advice and fees complete? second time');
    cy.isStepComplete('advice and fees');

    cy.findByText(/advice and fees/i).click();
    cy.wait('@getAdviceAndFees');
    // Select add to loan again

    cy.stubRequests([...invalidProducts, ...productSelectionInvalidLtv]);
    selectPaymentMethod(/add to loan/i);
    cy.findByRole('link', { name: /previous/i }).click();
    // Products with a low LTV should be marked as invalid
    cy.findByRole('heading', { name: /product no longer valid/i });

    // LTV used to request products should be the new one
    cy.stubRequests(getProductsRequest);
    cy.findByText(/change product/i).click();
    cy.wait('@getProductSelection').wait('@getProduct').its('request.url').should('include', 'ltv=80');
    cy.findByRole('button', { name: /cancel/i }).click();

    cy.findByRole('dialog').should('not.exist');
    // LTV must be displayed on screen
    cy.findAllByText(/80%/i);
  });
});
