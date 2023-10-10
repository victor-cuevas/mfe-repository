import { FutureChangesInIncomeRequest, FutureChangesInIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const futureChanges: FutureChangesInIncomeResponse = {
  applicantFutureChangesInIncome: [
    {
      applicantInfo: { applicantId: 1, firstName: 'Test', familyName: 'McTesterson', familyNamePrefix: '' },
      hasFutureChangesIncome: null,
      futureChangesInIncome: [],
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const putFutureChanges: FutureChangesInIncomeRequest = {
  applicantFutureChangesInIncome: [{ applicantId: 1, futureChangesInIncome: [], hasFutureChangesIncome: false }],
  versionNumber: 0,
};
