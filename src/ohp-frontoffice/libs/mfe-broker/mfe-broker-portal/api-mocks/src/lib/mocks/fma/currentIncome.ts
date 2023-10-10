import { CurrentIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicant1, applicationDraft, versionNumber } from '../../constants';

type CreateCurrentIncomeOpts = {
  fullDetails: boolean;
};
const defaultOptions: CreateCurrentIncomeOpts = {
  fullDetails: false,
};
export const createCurrentIncome: (options?: Partial<CreateCurrentIncomeOpts>) => CurrentIncomeResponse = options => {
  const opts = Object.assign({}, defaultOptions, options ?? {});
  return {
    applicantIncomes: [
      {
        applicantInfo: {
          applicantId: applicant1.applicantId,
          firstName: applicant1.firstName,
          familyName: applicant1.familyName,
          familyNamePrefix: applicant1.familyNamePrefix,
        },
        incomeDetails: opts.fullDetails
          ? [
              {
                accountant: null,
                allowances: {
                  Shift: {
                    amount: null,
                    frequency: null,
                  },
                  TravelOrCar: {
                    amount: null,
                    frequency: null,
                  },
                  OtherGuaranteed: {
                    amount: null,
                    frequency: null,
                  },
                  Location: {
                    amount: null,
                    frequency: null,
                  },
                },
                basicSalary: 150000.0,
                businessStartDate: null,
                canIncomeBeVerified: true,
                company: null,
                contact: null,
                contractEndDate: null,
                contractingTotalInMonths: null,
                contractStartDate: '2002-10-17T00:00:00+00:00',
                contractTerm: null,
                contractType: 'INDEFINITELY',
                currencyCode: 'GBP',
                currentEmploymentStatus: 'EMPLOYED',
                dailyRate: null,
                daysPerWeek: null,
                employer: {
                  address: {
                    addressType: 'UK',
                    addressLine1: 'Buckingham Palace',
                    city: 'London',
                    country: 'UK',
                    zipCode: 'SW1A 1AA',
                  },
                  email: null,
                  name: 'project',
                  telephone: null,
                },
                financialIncomes: [],
                guaranteedIncome: {
                  Commission: {
                    amount: null,
                    frequency: null,
                  },
                  Bonus: {
                    amount: null,
                    frequency: null,
                  },
                  Overtime: {
                    amount: null,
                    frequency: null,
                  },
                },
                hasGapsBetweenContractsInLast12Months: null,
                hourlyRate: null,
                hoursPerWeek: null,
                incomeDetailId: 1,
                isApplicantProfessionalProvidingServices: null,
                isContractLikelyToBeRenewed: null,
                isIncomeRecurrentSalaryOrDailyRate: 'SALARY',
                isInProbatoryPeriod: null,
                isPermanentAtEndOfProbatoryPeriod: null,
                jobTitle: 'developer',
                last12MonthsIncome: null,
                last3MonthsIncome: null,
                last6MonthsIncome: null,
                natureOfTheBusiness: null,
                netMonthlyIncome: null,
                nonGuaranteedIncome: {
                  Commission: {
                    amount: null,
                    frequency: null,
                  },
                  Bonus: {
                    amount: null,
                    frequency: null,
                  },
                  Overtime: {
                    amount: null,
                    frequency: null,
                  },
                },
                partnershipType: null,
                probatoryPeriod: null,
                probatoryPeriodEndDate: null,
                reasonForGapsBetweenContracts: null,
                salaryFrequency: 'YEAR',
                shareOfBusinessOwned: null,
                temporaryContractType: null,
              },
            ]
          : [],
        otherIncomes: [],
      },
    ],
    applicationDraftId: applicationDraft.id,
    versionNumber,
  };
};
