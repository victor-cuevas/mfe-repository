import { case1, firm1, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  bankAccount,
  contactDetails,
  lendingPolicyCheck,
  securityProperty,
  valuationDetails,
} from '../../../fixtures/fma/fmaHappyPathData';
import {
  adviceAndFeesStubs,
  affordabilityCheckStubs,
  bankAccountStubs,
  caseSummaryStubs,
  contactDetailsStubs,
  currentIncomeStubs,
  globalFmaStubs,
  lendingPolicyCheckStubs,
  productSelectionStubs,
  securityPropertyStubs,
  solicitorDetailsStubs,
  uploadDocumentsStub,
  valuationDetailsStubs,
} from '../../../fixtures/fma/fmaHappyPathStubs';

describe('FMA Happy Path journey', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(globalFmaStubs);
  });

  it('should be able to navigate the full FMA journey following a happy path', () => {
    cy.stubRequests(caseSummaryStubs);
    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}`, []);

    cy.stubRequests(contactDetailsStubs);

    // Click on "Resume FMA"
    cy.findByRole('button', { name: /resume fma/i }).click();

    // Contact Details
    cy.lg('Contact Details');
    cy.url().should('contain', '/fma/contact-details');
    cy.findByRole('heading', { name: /contact details/i });

    cy.fillForm(contactDetails);

    cy.isStepComplete('contact details');
    cy.stubRequests(currentIncomeStubs);
    cy.goToNextStep();

    // Current Income
    cy.lg('Current Income');
    cy.wait('@getCurrentIncome');
    cy.wait('@getProgress');
    cy.wait('@getContactDetails');

    cy.url().should('contain', '/fma/current-income');
    cy.findByRole('heading', { name: /current income/i });

    cy.isStepComplete('current income');
    cy.stubRequests(securityPropertyStubs);
    cy.goToNextStep();

    // Security Property
    cy.lg('Security Property');
    cy.wait('@getSecurityProperty');
    cy.url().should('contain', '/fma/security-property');
    cy.findByRole('heading', { name: /security property/i });

    cy.fillForm(securityProperty);
    cy.isStepComplete('security property');

    cy.stubRequests(productSelectionStubs);
    cy.goToNextStep();

    // Product Selection
    cy.lg('Product Selection');
    cy.wait('@getProductSelection');
    cy.wait('@getAssociations');
    cy.wait('@getPaymentTerms');
    cy.url().should('contain', '/fma/product-selection');
    cy.findByRole('heading', { name: /product selection/i });

    cy.isStepComplete('product selection');
    cy.stubRequests(adviceAndFeesStubs);
    cy.goToNextStep();

    // Advice and Fees
    cy.lg('Advice and Fees');
    cy.url().should('contain', '/fma/advice-and-fees');
    cy.findByRole('heading', { name: /advice and fees/i });

    cy.isStepComplete('advice and fees');
    cy.stubRequests(affordabilityCheckStubs);
    cy.goToNextStep();

    // Affordability check
    cy.lg('Affordability check');
    cy.url().should('contain', '/fma/affordability-check');
    cy.findByRole('heading', { name: /affordability check/i });

    cy.findByRole('heading', { name: /affordable/i });

    cy.stubRequests(solicitorDetailsStubs);
    cy.isStepComplete('affordability check');
    cy.goToNextStep();

    // Solicitor details
    cy.lg('Solicitor details');
    cy.url().should('contain', '/fma/solicitor-details');
    cy.findByRole('heading', { name: /solicitor details/i });
    cy.wait('@getSolicitorDetails');

    cy.useInput({ matcher: /town/i, value: 'a' });

    cy.findByRole('button', { name: /find conveyancer/i }).click();
    cy.wait('@getSearchSolicitor');

    cy.findByRole('dialog').findAllByRole('radio').first().click({ force: true });
    cy.findByRole('button', { name: /confirm/i }).click();

    cy.useRadio({ matcher: /appoint .* solicitor/i, value: /no/i });
    cy.isStepComplete('solicitor details');
    cy.stubRequests(valuationDetailsStubs);
    cy.goToNextStep();

    // Valuation details
    cy.lg('Valuation details');
    cy.wait('@getValuationDetails');
    cy.wait('@getContactDetails');
    cy.findByRole('heading', { name: /Valuation details/i });
    cy.url().should('contain', '/fma/valuation-details');

    cy.fillForm(valuationDetails);

    cy.isStepComplete('valuation details');
    cy.stubRequests(bankAccountStubs);
    cy.goToNextStep();

    // Bank account
    cy.lg('Bank account');
    cy.wait('@getBankAccountDetails');
    cy.url().should('contain', '/fma/bank-account');
    cy.findByRole('heading', { name: /Bank account/i });

    cy.fillForm(bankAccount);
    cy.findByRole('button', { name: /validate account/i }).click();
    cy.wait('@getValidateBankAccount');

    cy.findByRole('heading', { name: /accepted/i });
    cy.isStepComplete('bank account');

    cy.stubRequests(lendingPolicyCheckStubs);
    cy.goToNextStep();

    // Lending Policy Check
    cy.lg('Lending Policy Check');
    cy.wait('@getLendingPolicyCheck');
    cy.wait('@getFmaSummary');
    cy.wait('@getDocuments');
    cy.url().should('contain', '/fma/lender-policy-check');
    cy.findByRole('heading', { name: /Declaration and pre-assessment/i });

    cy.wait('@getFmaSummary');
    cy.findByRole('heading', { name: /referred/i });
    cy.wait('@getDocuments');

    cy.findByText(/April Mortgages/i, {
      timeout: 10_000,
    });
    cy.fillForm(lendingPolicyCheck);

    cy.isStepComplete('lending policy check');
    cy.stubRequests(uploadDocumentsStub);
    cy.goToNextStep();

    // Upload documents
    cy.lg('Upload documents');
    cy.wait('@getStipulations');
    cy.findByRole('heading', { name: /upload documents/i });
    cy.url().should('contain', '/fma/upload-stipulations');

    // TODO: Fee payment

    // TODO: Confirm fma
  });
});
