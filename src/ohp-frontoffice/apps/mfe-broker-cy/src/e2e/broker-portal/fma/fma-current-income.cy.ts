import { getCaseById, getFirmResponse, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import { caseSummaryStubs, contactDetailsStubs, globalFmaStubs } from '../../../fixtures/fma/fmaHappyPathStubs';
import { personalDetailsStubs } from '../../../fixtures/dip/dipStubs';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import {
  AreYouContractorConsultantProfessionalProvidingServiceYes,
  ciAddressAutocomplete,
  ciAddressSearchComponentStubs,
  ciAddressType,
  contractTypeTemporary,
  contractTypeZeroHoursContract,
  cuAddressTypeUk,
  currentIncomeDirectorGreaterThan25,
  currentIncomeDirectorLessThan25,
  currentIncomeEmployed,
  currentIncomeFma,
  currentIncomeSelfEmployedPartnership,
  currentIncomeSelfEmployedSoleTrader,
  currentIncomeStubEmpty,
  currentIncomeStubs,
  employmentStatusDirectorGreaterThan25,
  employmentStatusDirectorLessThan25,
  employmentStatusEmployed,
  employmentStatusSelfEmployedPartnership,
  employmentStatusSelfEmployedSoleTrader,
  haveThereBeenGapsBetweenContractInLast12MonthsYes,
  isThereProbationPeriodYes,
} from '../../../fixtures/fma/fmaCurrentIncomeDataAndStubs';
import { FormData } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { TestCallback } from 'mocha';

const calculateProbationPeriod = (months: number): string => {
  const probationPeriod = CONFIGURATION_MOCK.PROBATION_PERIOD;
  const today = new Date();
  today.setMonth(today.getMonth() - (probationPeriod + months));
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today
    .getFullYear()
    .toString()}`;
  return formattedDate;
};

describe('FMA Current Income screen', () => {
  beforeEach(() => {
    cy.login(validCredentials);
    cy.stubRequests([
      ...globalFmaStubs,
      ...caseSummaryStubs,
      ...contactDetailsStubs,
      ...personalDetailsStubs,
      ...currentIncomeStubEmpty,
      ...ciAddressSearchComponentStubs,
    ]);

    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/fma/current-income`, currentIncomeStubEmpty);
  });

  it('should current income screen be marked as completed if all required fields are correctly entered', () => {
    cy.fillForm(currentIncomeFma);
    cy.useDropdown(ciAddressType);
    cy.useInput(ciAddressAutocomplete);
    cy.wait('@postAddressSearch');
    cy.findByRole('option', { name: ciAddressAutocomplete.value }).click();
    cy.isStepComplete('current income');
  });

  it('should show the question "is there a probationary period" when the employment status is employed, the contract type is permanent and the contract start date is less then the probation period otherwise this field show not show', () => {
    cy.useDropdown(employmentStatusEmployed);
    cy.useDateInput({ matcher: /contract start date/i, value: calculateProbationPeriod(-1) });
    cy.useDropdown({
      matcher: /contract type/i,
      value: 'Permanent',
    });
    cy.findByText(/Is there a probationary period/i);

    cy.useDropdown(employmentStatusEmployed);
    cy.useDateInput({ matcher: /contract start date/i, value: calculateProbationPeriod(+1) });
    cy.useDropdown({
      matcher: /contract type/i,
      value: 'Permanent',
    });
    cy.findByText(/Is there a probationary period/i).should('not.exist');
  });

  it('should display the correct fields depending on the employment status', () => {
    //Employment status = EMPLOYED
    cy.useDropdown(employmentStatusEmployed);
    cy.findByLabelText(/nature of the business/i);
    cy.findByText(/address type/i);
    cy.useDropdown(cuAddressTypeUk);
    cy.findByLabelText(/address \*/i);
    cy.useDateInput({ matcher: /contract start date/i, value: calculateProbationPeriod(-1) });
    cy.useDropdown({
      matcher: /contract type/i,
      value: 'Permanent',
    });
    cy.findByLabelText(/Is there a probationary period/i);
    cy.useRadio(isThereProbationPeriodYes);
    cy.findByLabelText(/Is the position permanent at the end of the probationary period/i);

    cy.useDropdown(contractTypeTemporary);
    cy.findByLabelText(/is the contract likely to be renewed/i);
    cy.findByLabelText(/have there been gaps between contracts in last 12 months/i);
    cy.useRadio(haveThereBeenGapsBetweenContractInLast12MonthsYes);
    cy.findByLabelText(/Reason for gaps between contracts/);

    cy.useDropdown(contractTypeZeroHoursContract);
    cy.findByLabelText(/is the contract likely to be renewed/i).should('not.exist');
    cy.findByLabelText(/have there been gaps between contracts in last 12 months/i).should('not.exist');

    //Employment status = SELF EMPLOYED PARTNERSHIP
    cy.useDropdown(employmentStatusSelfEmployedPartnership);
    cy.findByText(/address type/i).should('not.exist');
    cy.findByLabelText(/nature of the business/i);
    cy.findByLabelText(/share of business owned/i);
    cy.findByLabelText(/date business started/i);
    cy.findByLabelText(/accountant\/auditor company name/i);
    cy.findByLabelText(/accountant\/auditor address/i);
    cy.findByLabelText(/accountant\/auditor Tel No/i);
    cy.findByLabelText(/accountant\/auditor last name of individual acting/i);
    cy.findByLabelText(/accountant\/auditor email of individual acting/i);
    cy.findByLabelText(/accountant\/auditor qualification/i);

    //Employment status = SELF EMPLOYED SOLE TRADER
    cy.useDropdown(employmentStatusSelfEmployedSoleTrader);
    cy.findByLabelText(/nature of the business/i);
    cy.findByLabelText(/share of business owned/i).should('not.exist');
    cy.findByLabelText(/date business started/i);
    cy.findByLabelText(/accountant\/auditor company name/i);
    cy.findByLabelText(/accountant\/auditor address/i);
    cy.findByLabelText(/accountant\/auditor Tel No/i);
    cy.findByLabelText(/accountant\/auditor last name of individual acting/i);
    cy.findByLabelText(/accountant\/auditor email of individual acting/i);
    cy.findByLabelText(/accountant\/auditor qualification/i);

    //Employment status = DIRECTOR >= 25%
    cy.useDropdown(employmentStatusDirectorGreaterThan25);
    cy.findByLabelText(/nature of the business/i);
    cy.findByLabelText(/share of business owned/i);
    cy.findByLabelText(/date business started/i);
    cy.findByLabelText(/Are you a contractor \/ consultant \/ professional providing services to a client/i);
    cy.useRadio(AreYouContractorConsultantProfessionalProvidingServiceYes);
    cy.findByLabelText(/Contracting period in total (.*)/i);
    cy.findByLabelText(/is the contract likely to be renewed/i);
    cy.findByLabelText(/company number/i);
    cy.findByLabelText(/accountant\/auditor company name/i);
    cy.findByLabelText(/accountant\/auditor address/i);
    cy.findByLabelText(/accountant\/auditor Tel No/i);
    cy.findByLabelText(/accountant\/auditor last name of individual acting/i);
    cy.findByLabelText(/accountant\/auditor email of individual acting/i);
    cy.findByLabelText(/accountant\/auditor qualification/i);

    //Employment status = DIRECTOR < 25%
    cy.useDropdown(employmentStatusDirectorLessThan25);
    cy.findByLabelText(/nature of the business/i);
    cy.findByLabelText(/share of business owned/i);
    cy.findByLabelText(/date business started/i);
    cy.findByLabelText(/Contracting period in total (.*)/i).should('not.exist');
    cy.findByLabelText(/is the contract likely to be renewed/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor company name/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor address/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor Tel No/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor last name of individual acting/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor email of individual acting/i).should('not.exist');
    cy.findByLabelText(/accountant\/auditor qualification/i).should('not.exist');
  });

  const testCb = (
    employmentStatus: string,
    dataPerEmploymentStatus: FormData[],
    hasCurrentYear1YearAgo2YearsAgoBox: boolean,
    hasDividends: boolean,
  ) => {
    cy.stubRequests(currentIncomeStubs);
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/fma/current-income`, currentIncomeStubs);

    cy.fillForm(dataPerEmploymentStatus);

    if (hasCurrentYear1YearAgo2YearsAgoBox) {
      const blocks = [/current year/i, /1 year ago/i, /2 years ago/i];

      blocks.forEach(block => {
        cy.findByLabelText(block)
          .findByLabelText(/(annual salary|annual drawings)/gi)
          .type('1');
        if (hasDividends) {
          cy.findByLabelText(block)
            .findByLabelText(/dividends/i)
            .type('1');
        }
        cy.findByLabelText(block)
          .findByLabelText(/net profit/i)
          .type('1');
        cy.findByLabelText(block)
          .findByLabelText(/gross profit/i)
          .type('1');
      });
    }

    cy.isStepComplete('current income');
  };

  const cases = [
    ['Employed', currentIncomeEmployed, false, false],
    ['Self Employed - Partnership', currentIncomeSelfEmployedPartnership, true, false],
    ['Self Employed - Sole trader', currentIncomeSelfEmployedSoleTrader, true, false],
    ['Director >= 25% or with dividends', currentIncomeDirectorGreaterThan25, true, true],
    ['Director < 25% with no dividends', currentIncomeDirectorLessThan25, false, false],
  ];

  it.each(cases)(
    'Should current income screen be marked as complete when all there required fields are filled correctly when the employment status is %0',
    testCb as TestCallback<unknown>,
  );
});
