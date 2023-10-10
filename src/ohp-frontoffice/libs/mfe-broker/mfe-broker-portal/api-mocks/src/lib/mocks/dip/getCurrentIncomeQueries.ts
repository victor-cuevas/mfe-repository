import { CurrentIncomeRequest, CurrentIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const ciCurrentIncome: CurrentIncomeResponse = {
  applicantIncomes: [
    {
      applicantInfo: { applicantId: 1, firstName: 'Test', familyName: 'McTesterson', familyNamePrefix: '' },
      incomeDetails: [],
      otherIncomes: [],
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const putCurrentIncome: CurrentIncomeRequest = {
  applicantIncomes: [
    {
      applicantId: 1,
      incomeDetails: [
        {
          allowances: {
            Location: { amount: null, frequency: null },
            OtherGuaranteed: { amount: null, frequency: null },
            Shift: { amount: null, frequency: null },
            TravelOrCar: { amount: null, frequency: null },
          },
          basicSalary: 2000,
          canIncomeBeVerified: true,
          contractEndDate: null,
          contractStartDate: '2009-12-31T23:00:00.000Z',
          contractTerm: null,
          contractType: 'INDEFINITELY',
          currentEmploymentStatus: 'EMPLOYED',
          dailyRate: null,
          daysPerWeek: null,
          employer: { name: 'fake company' },
          guaranteedIncome: {
            Overtime: { amount: null, frequency: null },
            Bonus: { amount: null, frequency: null },
            Commission: { amount: null, frequency: null },
          },
          hourlyRate: null,
          hoursPerWeek: null,
          isIncomeRecurrentSalaryOrDailyRate: 'SALARY',
          jobTitle: 'fake job title',
          last3MonthsIncome: null,
          last6MonthsIncome: null,
          last12MonthsIncome: null,
          nonGuaranteedIncome: {
            Overtime: { amount: null, frequency: null },
            Bonus: { amount: null, frequency: null },
            Commission: { amount: null, frequency: null },
          },
          salaryFrequency: 'MONTH',
        },
      ],
      otherIncomes: [],
    },
  ],
  versionNumber: 0,
};
