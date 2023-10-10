import { getCaseById, getFirmResponse, validCredentials } from '@close-front-office/mfe-broker/mfe-broker-portal/api-mocks';
import {
  adviceAndFeesStubs,
  caseSummaryStubs,
  depositDetailsStubs,
  personalDetailsStubs,
  productSelectionStubs,
  propertyAndLoanDetailsStubs,
  securityPropertyStubs,
} from '../../../fixtures/dip/dipStubs';
import { existingMortgageStubs } from '../../../fixtures/dip/dipRemorgageStubs';
import {
  basicSalary,
  canTheIncomeBeVerifiedYes,
  contractStartDateLessThanOneYear,
  contractTypePermanent,
  contractTypeTemporary,
  contractTypeZeroHoursContract,
  currentIncomeStubs,
  employmentStatusEmployed,
  employmentStatusHomeMaker,
  employmentStatusNotEmployed,
  employmentStatusSelfDirectorGreater25,
  employmentStatusSelfDirectorLess25,
  employmentStatusSelfEmployedPartnership,
  employmentStatusSelfEmployedSoleTrader,
  employmentStatusSelfRetired,
  employmentStatusStudent,
  incomeDescribedAsDailyRate,
  incomeDescribedAsSalary,
  jobTitle,
  locationGuaranteedAllowances,
  otherGuaranteedAllowances,
  shiftGuaranteedAllowances,
  travelGuaranteedAllowances,
} from '../../../fixtures/dip/dipCurrentIncomStubsAndData';

describe('DIP current income', () => {
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
    ]);
    cy.visitAndWaitRequests(`/broker/${getFirmResponse.firmId}/cases/${getCaseById.caseId}/dip/current-income`, currentIncomeStubs);
  });

  it('should show all correct field depending on the different selected options', () => {
    //Employment status = HOME MAKER
    cy.useDropdown(employmentStatusHomeMaker);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i).should('not.exist');
    cy.findByLabelText(/job title/i).should('not.exist');
    cy.findByLabelText(/company name/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i).should('not.exist');
    cy.findByLabelText(/partnership type/i).should('not.exist');

    //Employment status = STUDENT
    cy.useDropdown(employmentStatusStudent);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i).should('not.exist');
    cy.findByLabelText(/job title/i).should('not.exist');
    cy.findByLabelText(/company name/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i).should('not.exist');
    cy.findByLabelText(/partnership type/i).should('not.exist');

    //Employment status = NOT EMPLOYED
    cy.useDropdown(employmentStatusNotEmployed);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i).should('not.exist');
    cy.findByLabelText(/job title/i).should('not.exist');
    cy.findByLabelText(/company name/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i).should('not.exist');
    cy.findByLabelText(/partnership type/i).should('not.exist');

    //Employment status = RETIRED
    cy.useDropdown(employmentStatusSelfRetired);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i).should('not.exist');
    cy.findByLabelText(/job title/i).should('not.exist');
    cy.findByLabelText(/company name/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i).should('not.exist');
    cy.findByLabelText(/partnership type/i).should('not.exist');

    // Employment status = EMPLOYED
    cy.useDropdown(employmentStatusEmployed);
    cy.findByLabelText(/contract type/i);
    cy.findByLabelText(/contract start date/i);
    cy.findByLabelText(/job title/i);
    cy.findByLabelText(/company name/i);
    cy.findByLabelText(/can the income be verified/i);
    cy.findByLabelText(/partnership type/i).should('not.exist');

    //Contract type = PERMANENT
    cy.useDropdown(contractTypePermanent);
    cy.useDateInput(contractStartDateLessThanOneYear);
    cy.findByLabelText(/contract start date/i)
      .get('.pi-info-circle')
      .invoke('show')
      .click();
    cy.findByText(/April Mortgages (.*) considered/i);
    cy.findByLabelText(/contract end date/i).should('not.exist');
    cy.findByLabelText(/hourly rate/i).should('not.exist');
    cy.findByLabelText(/hours per week/i).should('not.exist');
    cy.findByLabelText(/last 3 months income/i).should('not.exist');
    cy.findByLabelText(/last 6 months income/i).should('not.exist');
    cy.findByLabelText(/last 12 months income/i).should('not.exist');

    //Contract type = TEMPORARY
    cy.useDropdown(contractTypeTemporary);
    cy.findByLabelText(/contract end date/i);
    cy.findByLabelText(/hourly rate/i).should('not.exist');
    cy.findByLabelText(/hours per week/i).should('not.exist');
    cy.findByLabelText(/last 3 months income/i).should('not.exist');
    cy.findByLabelText(/last 6 months income/i).should('not.exist');
    cy.findByLabelText(/last 12 months income/i).should('not.exist');

    //Can the income be verified = YES should show a tooltip
    cy.useRadio(canTheIncomeBeVerifiedYes);
    cy.findByLabelText(/can the income be verified/i)
      .get('.pi-info-circle')
      .invoke('show')
      .click();
    cy.findByText(/A document will need to be uploaded to verify income/i);

    //INCOME DETAILS PART
    cy.findByLabelText(/is the income described as salary or daily rate/i);
    cy.useDropdown(incomeDescribedAsSalary);
    cy.findByLabelText(/basic salary/i);

    //BASIC SALARY
    cy.useInput(basicSalary);
    cy.findByLabelText(/frequency/i);

    //DAILY RATE
    cy.useDropdown(incomeDescribedAsDailyRate);
    cy.useInput(jobTitle);
    cy.findAllByLabelText(/daily rate/i)
      .last()
      .type('500');
    cy.findByLabelText(/days per week/i);

    //Contract type = ZERO HOURS CONTRACT
    cy.useDropdown(contractTypeZeroHoursContract);
    cy.findByLabelText(/contract end date/i).should('not.exist');
    cy.findByLabelText(/hourly rate/i);
    cy.findByLabelText(/hours per week/i);
    cy.findByLabelText(/last 3 months income/i);
    cy.findByLabelText(/last 6 months income/i);
    cy.findByLabelText(/last 12 months income/i);

    //GUARANTEED INCOME
    cy.findAllByLabelText(/overtime amount/i)
      .first()
      .type('500');
    cy.findByLabelText(/overtime frequency/i);
    cy.findAllByLabelText(/bonus amount/i)
      .first()
      .type('500');
    cy.findByLabelText(/bonus frequency/i);
    cy.findAllByLabelText(/commission amount/i)
      .first()
      .type('500');
    cy.findByLabelText(/commission frequency/i);

    //NON guaranteed INCOME
    cy.findAllByLabelText(/overtime amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/overtime frequency/i).last();
    cy.findAllByLabelText(/bonus amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/bonus frequency/i).last();
    cy.findAllByLabelText(/commission amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/commission frequency/i).last();

    //GUARANTEED INCOME
    cy.findAllByLabelText(/location allowance amount/i).useInput(locationGuaranteedAllowances);
    cy.findByLabelText(/location allowance frequency/i);
    cy.findAllByLabelText(/location allowance amount/i).useInput(travelGuaranteedAllowances);
    cy.findByLabelText(/travel \/ car allowance frequency/i);
    cy.findAllByLabelText(/shift allowance amount/i).useInput(shiftGuaranteedAllowances);
    cy.findByLabelText(/shift allowance frequency/i);
    cy.findAllByLabelText(/other allowance amount/i).useInput(otherGuaranteedAllowances);
    cy.findByLabelText(/other allowance frequency/i);

    //Employment status = SELF EMPLOYED PARTNERSHIP
    cy.useDropdown(employmentStatusSelfEmployedPartnership);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i);
    cy.findByLabelText(/job title/i);
    cy.findByLabelText(/business name/i);
    cy.findByLabelText(/partnership type/i);
    cy.findByLabelText(/can the income be verified/i);
    cy.findAllByLabelText(/annual drawing/i).should('have.length', 3);
    cy.findAllByLabelText(/net profit/i).should('have.length', 3);
    cy.findAllByLabelText(/gross profit/i).should('have.length', 3);

    //Employment status = SELF EMPLOYED SOLE TRADER
    cy.useDropdown(employmentStatusSelfEmployedSoleTrader);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i);
    cy.findByLabelText(/job title/i);
    cy.findByLabelText(/business name/i);
    cy.findByLabelText(/partnership type/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i);
    cy.findAllByLabelText(/annual salary/i).should('have.length', 3);
    cy.findAllByLabelText(/net profit/i).should('have.length', 3);
    cy.findAllByLabelText(/gross profit/i).should('have.length', 3);

    //Employed status = DIRECTOR > 25
    cy.useDropdown(employmentStatusSelfDirectorGreater25);
    cy.findByLabelText(/contract type/i).should('not.exist');
    cy.findByLabelText(/contract start date/i);
    cy.findByLabelText(/job title/i);
    cy.findByLabelText(/company name/i);
    cy.findByLabelText(/partnership type/i).should('not.exist');
    cy.findByLabelText(/company type/i);
    cy.findByLabelText(/can the income be verified/i);
    cy.findAllByLabelText(/annual drawing/i).should('have.length', 3);
    cy.findAllByLabelText(/dividends/i).should('have.length', 3);
    cy.findAllByLabelText(/net profit/i).should('have.length', 3);
    cy.findAllByLabelText(/gross profit/i).should('have.length', 3);

    //Employment status = DIRECTOR < 25
    cy.useDropdown(employmentStatusSelfDirectorLess25);
    cy.findByLabelText(/contract type/i);
    cy.findByLabelText(/contract start date/i);
    cy.findByLabelText(/job title/i);
    cy.findByLabelText(/company name/i);
    cy.findByLabelText(/partnership type/i).should('not.exist');
    cy.findByLabelText(/company type/i).should('not.exist');
    cy.findByLabelText(/can the income be verified/i);

    //INCOME DETAILS PART
    cy.findByLabelText(/is the income described as salary or daily rate/i);
    cy.useDropdown(incomeDescribedAsSalary);
    cy.findByLabelText(/basic salary/i);

    //Contract type = ZERO HOURS CONTRACT
    cy.useDropdown(contractTypeZeroHoursContract);
    cy.findByLabelText(/contract end date/i).should('not.exist');
    cy.findByLabelText(/hourly rate/i).should('not.exist');
    cy.findByLabelText(/hours per week/i).should('not.exist');
    cy.findByLabelText(/last 3 months income/i).should('not.exist');
    cy.findByLabelText(/last 6 months income/i).should('not.exist');
    cy.findByLabelText(/last 12 months income/i).should('not.exist');

    //GUARANTEED INCOME
    cy.findAllByLabelText(/overtime amount/i)
      .first()
      .type('500');
    cy.findAllByLabelText(/overtime frequency/i).first();
    cy.findAllByLabelText(/bonus amount/i)
      .first()
      .type('500');
    cy.findAllByLabelText(/bonus frequency/i).first();
    cy.findAllByLabelText(/commission amount/i)
      .first()
      .type('500');
    cy.findAllByLabelText(/commission frequency/i).first();

    //NON guaranteed INCOME
    cy.findAllByLabelText(/overtime amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/overtime frequency/i).last();
    cy.findAllByLabelText(/bonus amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/bonus frequency/i).last();
    cy.findAllByLabelText(/commission amount/i)
      .last()
      .type('500');
    cy.findAllByLabelText(/commission frequency/i).last();

    //GUARANTEED INCOME
    cy.findAllByLabelText(/location allowance amount/i).useInput(locationGuaranteedAllowances);
    cy.findByLabelText(/location allowance frequency/i);
    cy.findAllByLabelText(/location allowance amount/i).useInput(travelGuaranteedAllowances);
    cy.findByLabelText(/travel \/ car allowance frequency/i);
    cy.findAllByLabelText(/shift allowance amount/i).useInput(shiftGuaranteedAllowances);
    cy.findByLabelText(/shift allowance frequency/i);
    cy.findAllByLabelText(/other allowance amount/i).useInput(otherGuaranteedAllowances);
    cy.findByLabelText(/other allowance frequency/i);
  });
});
