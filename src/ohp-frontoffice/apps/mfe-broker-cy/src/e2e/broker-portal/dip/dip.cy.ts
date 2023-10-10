import { CaseStatusEnum, DraftStage, LoanStatus } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  case1,
  decimal,
  dipSummary,
  firm1,
  getCaseById,
  getFirmResponse,
  psProductSelection,
  validCredentials,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  addressHistoryStubs,
  adviceAndFeesFailCheckStubs,
  adviceAndFeesStubs,
  caseSummaryStubs,
  confirmDipStubs,
  currentIncomeStubs,
  depositDetailsStubs,
  dipProgressStubs,
  financialCommitmentsStubs,
  futureChangesStubs,
  getReadOnlyStubs,
  globalDipStubs,
  householdExpendituresStubs,
  personalDetailsStubs,
  productsAvailabilityFailCheck,
  productSelectionStubs,
  propertyAndLoanDetailsStubs,
  securityPropertyStubs,
  stageStatusCombinations,
  submitAdviceAndFeesStubs,
  submitDepositDetailsStub,
  submitPropertyAndLoanStubs,
  submitSecurityPropertyStubs,
} from '../../../fixtures/dip/dipStubs';
import {
  addressHistory,
  adviceAndFees,
  ahAddressAutocomplete,
  ahAddressTypeUK,
  confirmDip,
  currentIncome,
  depositDetails,
  financialCommitments,
  futureChanges,
  householdExpenditure,
  personalDetails,
  propertyAndLoanDetails,
  securityProperty,
  spAddress,
} from '../../../fixtures/dip/dipHappyPathData';
import { IStub } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { TestCallback } from 'mocha';

describe('DIP happy path', () => {
  const productSelectionCode = psProductSelection.loanParts ? psProductSelection.loanParts[0].product?.code ?? '' : '';

  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(caseSummaryStubs);
  });

  it('should create a DIP following the happy path', () => {
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}`, caseSummaryStubs);
    cy.stubRequests(globalDipStubs);
    cy.stubRequests(propertyAndLoanDetailsStubs);

    cy.findByRole('row', { name: new RegExp((dipSummary.applicants && dipSummary.applicants[0].fullName) ?? '', 'i') });

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

    // Security Property
    cy.lg('Security Property');
    cy.wait('@getSecurityProperty');
    cy.url().should('contain', '/dip/security-property');
    cy.findByRole('heading', { name: /security property/i });

    cy.useInput(spAddress);
    cy.wait('@postAddressSearch');
    cy.findByRole('option', { name: spAddress.value }).click();
    cy.fillForm(securityProperty);

    cy.stubRequests([...submitSecurityPropertyStubs, ...depositDetailsStubs]);
    cy.isStepComplete('security property');
    cy.goToNextStep();

    // Desposit details
    cy.lg('Deposit Details');
    cy.wait('@getDepositDetails');
    cy.url().should('contain', '/dip/deposit-details');
    cy.findByRole('heading', { name: /deposit details/i });

    cy.findAllByText(/to be satisfied/i)
      .last()
      .parent()
      .should('have.class', 'warning-text')
      .and('contain.text', '£20,000');

    cy.fillForm(depositDetails);

    cy.findAllByText(/to be satisfied/i)
      .last()
      .parent()
      .should('have.class', 'success-text')
      .and('contain.text', '£0');

    cy.stubRequests([...submitDepositDetailsStub, ...productSelectionStubs]);
    cy.isStepComplete('deposit');
    cy.goToNextStep();

    // Product selection
    cy.lg('Product Selection');
    cy.wait('@getProductSelection');
    cy.url().should('contain', '/dip/product-selection');
    cy.findByRole('heading', { name: /product selection/i });

    cy.findByText(new RegExp(productSelectionCode));

    cy.stubRequests(adviceAndFeesStubs);
    cy.isStepComplete('product selection');
    cy.goToNextStep();

    // Advice and Fees
    cy.lg('Advice and Fees');
    cy.wait('@getAdviceAndFees');
    cy.url().should('contain', '/dip/advice-and-fees');
    cy.findByRole('heading', { name: /advice and fees/i });

    cy.fillForm(adviceAndFees);

    cy.stubRequests([...submitAdviceAndFeesStubs, ...personalDetailsStubs]);
    cy.wait('@getProgress');
    cy.wait('@putDipDetails');
    cy.isStepComplete('advice and fees');

    cy.goToNextStep();

    // Personal Details
    cy.lg('Personal Details');
    cy.wait('@getPersonalDetails');
    cy.url().should('contain', '/dip/personal-details');
    cy.findByRole('heading', { name: /personal details/i });

    cy.fillForm(personalDetails);

    cy.stubRequests(addressHistoryStubs);
    cy.isStepComplete('personal details');
    cy.goToNextStep();

    // Address history
    cy.lg('Address History');
    cy.wait('@getAddressHistory');
    cy.url().should('contain', '/dip/address-history');
    cy.findByRole('heading', { name: /address history/i });

    cy.useDropdown(ahAddressTypeUK);
    cy.useInput(ahAddressAutocomplete);
    cy.wait('@postAddressSearch');
    cy.findByRole('option', { name: ahAddressAutocomplete.value }).click();
    cy.fillForm(addressHistory);

    cy.stubRequests(financialCommitmentsStubs);
    cy.isStepComplete('address history');
    cy.goToNextStep();

    // Financial Commitments
    cy.lg('Financial Commitments');
    cy.wait('@getFinancialCommitments');
    cy.url().should('contain', '/dip/financial-commitments');
    cy.findByRole('heading', { name: /financial commitments/i });

    cy.useRadio(financialCommitments);

    cy.stubRequests(householdExpendituresStubs);
    cy.isStepComplete('financial commitments');
    cy.goToNextStep();

    // Household Expenditure
    cy.lg('Household Expenditure');
    cy.wait('@getHouseholdExpenditure');
    cy.url().should('contain', '/dip/household-expenditure');
    cy.findByRole('heading', { name: /household expenditure/i });

    cy.fillForm(householdExpenditure);

    cy.stubRequests(currentIncomeStubs);
    cy.isStepComplete('household expenditure');
    cy.goToNextStep();

    // Current Income
    cy.lg('Current Income');
    cy.wait('@getHouseholdExpenditure');
    cy.wait('@getCurrentIncome');
    cy.url().should('contain', '/dip/current-income');
    cy.findByRole('heading', { name: /current income/i });

    cy.fillForm(currentIncome);

    cy.stubRequests(futureChangesStubs);
    cy.isStepComplete('current income');
    cy.goToNextStep();

    // Future changes
    cy.lg('Future changes');
    cy.wait('@getFutureChanges');
    cy.url().should('contain', '/dip/future-changes');
    cy.findByRole('heading', { name: /future changes/i });

    cy.useRadio(futureChanges);

    cy.stubRequests(confirmDipStubs);
    cy.isStepComplete('future changes');
    cy.goToNextStep();

    // Confirm DIP
    cy.lg('Confirm DIP');
    cy.wait('@getAffordability');
    cy.url().should('contain', '/dip/submit');
    cy.findByRole('heading', { name: /decision in principle - consent/i });

    cy.fillForm(confirmDip);

    cy.findByRole('button', { name: /submit/i }).click();

    cy.wait('@getDipSummary');
    cy.url().should('contain', `/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}`);
  });
});

describe('DIP progress checks', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests(caseSummaryStubs);
  });

  it('Should mark the previously stored progress as complete', () => {
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}`, caseSummaryStubs);
    cy.stubRequests(dipProgressStubs);

    cy.findByRole('row', { name: new RegExp((dipSummary.applicants && dipSummary.applicants[0].fullName) ?? '', 'i') });

    // Click on "Resume DIP"
    cy.findByRole('button', { name: /resume dip/i }).click();

    // Property and Loan details
    cy.lg('Property and Loan Details');
    cy.url().should('contain', '/dip/property-and-loan');
    cy.findByRole('heading', { name: /property and loan/i });

    cy.isStepComplete('property and loan details');
    cy.isStepComplete('security property');
    cy.isStepComplete('deposit');
    cy.isStepComplete('product selection');
    cy.isStepComplete('advice and fees');
    cy.isStepComplete('personal details');
    cy.isStepComplete('address history');
    cy.isStepComplete('financial commitments');
    cy.isStepComplete('household expenditure');
    cy.isStepComplete('current income');
    cy.isStepComplete('future changes');
  });

  it('should uncheck "Product selection" if the product availability check fails in "Advice and Fees"', () => {
    cy.stubRequests(adviceAndFeesFailCheckStubs);
    cy.visit(`/broker/${firm1.id}/cases/${case1.id}/dip/advice-and-fees`);
    cy.wait('@getAdviceAndFees');
    cy.wait('@getProgress');

    cy.isStepComplete('product selection');

    cy.stubRequests(productsAvailabilityFailCheck);
    cy.fillForm(adviceAndFees);

    cy.isStepComplete('advice and fees');

    cy.wait('@putAdviceAndFees', {
      timeout: 15000,
    });
    cy.wait('@getProductsAvailability', {
      timeout: 15000,
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.isStepComplete('product selection', { expectedCheck: false });
  });
});

describe('DIP read-only', () => {
  beforeEach(() => {
    cy.login(validCredentials);
  });

  const testCb = (id: number, readOnly: boolean, draftStage: DraftStage, caseStatus: CaseStatusEnum, loanStatus: LoanStatus): void => {
    const stubs: IStub[] = getReadOnlyStubs(caseStatus, draftStage, loanStatus);

    cy.stubRequests(stubs);
    cy.visitAndWaitRequests(`/broker/${firm1.id}/cases/${case1.id}/dip/property-and-loan`, stubs);
    if (readOnly) {
      cy.get('#palPropertyLocation').parent().get('p-dropdown').children().should('have.class', 'p-disabled');
    } else {
      cy.get('#palPropertyLocation').parent().get('p-dropdown').children().should('not.have.class', 'p-disabled');
    }
  };

  it.each(stageStatusCombinations)('Combination %0 should be in read-only: %1', testCb as TestCallback<unknown>);
});
