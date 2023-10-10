import { getCaseById, getFirmResponse, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  addressHistoryGetStubs,
  addressHistoryGetStubsTwoApplicants,
  addressHistoryPutStubTwoApplicants,
  addressSearchComponentStubs,
  addressSearchDifferentAddressComponentStubs,
  adviceAndFeesStubs,
  caseSummaryStubs,
  currentIncomeStubs,
  depositDetailsStubs,
  personalDetailsStubs,
  productSelectionStubs,
  propertyAndLoanDetailsStubs,
  securityPropertyStubs,
} from '../../../fixtures/dip/dipStubs';
import {
  ahAddressAutocomplete,
  ahAddressAutocompleteDifferentAddress,
  ahAddressTypeBFPO,
  ahAddressTypeOverseas,
  ahAddressTypeUK,
} from '../../../fixtures/dip/dipHappyPathData';
import {
  caseSummaryStubs as caseSummaryRemortgageStub,
  copyAddressFromSecurityProperty,
  existingMortgageStubs,
} from '../../../fixtures/dip/dipRemorgageStubs';

describe('DIP address search component', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([
      ...caseSummaryStubs,
      ...propertyAndLoanDetailsStubs,
      ...securityPropertyStubs,
      ...depositDetailsStubs,
      ...productSelectionStubs,
      ...adviceAndFeesStubs,
      ...personalDetailsStubs,
      ...currentIncomeStubs,
      ...existingMortgageStubs,
      ...addressHistoryGetStubs,
      ...addressSearchComponentStubs,
    ]);
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/dip/address-history`, addressHistoryGetStubs);
    cy.log('address-history');
    cy.url().should('contain', '/dip/address-history');
    cy.findByRole('heading', { name: /address history/i });
  });

  it('should show autosuggest and enter address manually button if the addressType is UK', () => {
    cy.useDropdown(ahAddressTypeUK);

    cy.findAllByPlaceholderText(/search address/i).should('have.length', 2);
    cy.findByRole('button', { name: /enter address manually/i });
  });

  it('should show enter address manual mode when clicking the enter address manually and show the button enter address with autosuggest', () => {
    cy.useDropdown(ahAddressTypeUK);

    cy.findByRole('button', { name: /enter address manually/i }).click();
    cy.findByPlaceholderText(/search address/i).should('not.exist');
    cy.findByRole('button', { name: /enter address manually/i }).should('not.exist');

    cy.findByText(/address 1/i).should('contain.text', '*');
    cy.findByText(/postcode/i);
    cy.findByText(/country/i);
    cy.findByText(/Enter address with autocomplete/i);
  });

  it('should show enter address manual mode when address type is Overseas', () => {
    //Address history
    cy.useDropdown(ahAddressTypeOverseas);

    cy.findByText(/address 1/i).should('contain.text', '*');
    cy.findByText(/postcode/i);
    cy.findByText(/^country/i).should('contain.text', '*');
    cy.findByText(/Enter address with autocomplete/i).should('not.exist');
    cy.findByText(/Enter address manually/i).should('not.exist');
  });

  it('should show enter address manual mode when address type is BFPO with different label', () => {
    //Address history
    cy.useDropdown(ahAddressTypeBFPO);

    cy.findByText(/service number/i).should('contain.text', '*');
    cy.findByText(/BFPO no\/Postcode/i);
    cy.findByText(/Unit\/regiment/i).should('contain.text', '*');
    cy.findByText(/Enter address with autocomplete/i).should('not.exist');
    cy.findByText(/Enter address manually/i).should('not.exist');
  });

  it('should show data for two applicants with different address setting address type to UK', () => {
    cy.stubRequests(addressHistoryGetStubsTwoApplicants);
    cy.visitAndWaitRequests(
      `/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/dip/address-history`,
      addressHistoryGetStubsTwoApplicants,
    );
    cy.findAllByLabelText(ahAddressTypeUK.matcher).first().click();
    cy.findByRole('option', { name: 'UK' }).click();
    cy.useInput(ahAddressAutocomplete);
    cy.wait('@postAddressSearch');
    cy.findByRole('option', { name: ahAddressAutocomplete.value }).click();
    cy.findByRole('tab', { name: /Testtwo/i }).click();
    cy.findAllByLabelText(ahAddressTypeUK.matcher).last().click();
    cy.findByRole('option', { name: 'UK' }).click();
    cy.findAllByLabelText(/address/i)
      .last()
      .type('Museum and art gallery, Bristol, SW1A 1AA');
    cy.stubRequests(addressSearchDifferentAddressComponentStubs);
    cy.wait('@postAddressSearchDifferentAddress');
    cy.findByRole('option', { name: ahAddressAutocompleteDifferentAddress.value }).click();
    cy.stubRequests(addressHistoryPutStubTwoApplicants);
  });

  it('Should copy the address from the security property address when the case is remortgage', () => {
    cy.stubRequests(caseSummaryRemortgageStub);
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/dip/address-history`, addressHistoryGetStubs);
    cy.stubRequests(copyAddressFromSecurityProperty);
    cy.findByRole('button', { name: /residential address same as security address/i }).click();

    cy.wait('@getSecurityPropertyCopy');
    cy.wait('@putAddressHistoryCopy');
    cy.wait('@getAddressHistoryCopy');
  });
});
