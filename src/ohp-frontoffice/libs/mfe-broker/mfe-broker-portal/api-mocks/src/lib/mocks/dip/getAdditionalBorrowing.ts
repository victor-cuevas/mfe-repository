import { AdditionalBorrowingRequest, AdditionalBorrowingResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { loanAmount } from '../../constants';

export const additionalBorrowing: AdditionalBorrowingResponse = {
  additionalBorrowingAmountRequired: null,
  additionalBorrowingReasons: [
    {
      reason: null,
      amount: null,
    },
  ],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const putAdditionalBorrowing: AdditionalBorrowingRequest = {
  additionalBorrowingReasons: [
    {
      reason: 'HOME_IMPROVEMENTS',
      amount: loanAmount,
    },
  ],
  versionNumber: 0,
};
