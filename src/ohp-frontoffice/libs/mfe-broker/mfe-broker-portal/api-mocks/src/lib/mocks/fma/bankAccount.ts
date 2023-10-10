import { BankAccountDetailsResponse, ValidateBankAccountResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { applicant1, applicationDraft, versionNumber } from '../../constants';

export const getFmaBankAccountDetails: BankAccountDetailsResponse = {
  accountNumber: null,
  applicants: [{ isOwner: null, applicantId: applicant1.applicantId, fullName: applicant1.fullName }],
  applicationDraftId: applicationDraft.id,
  bankName: null,
  branchAddress: null,
  preferredDayOfTheMonthForDirectDebits: null,
  sortCode: null,
  versionNumber,
};

export const createBankAccountDetails = (sortCode?: string, accountNumber?: string): BankAccountDetailsResponse => {
  return {
    accountNumber: accountNumber ?? null,
    applicants: [{ isOwner: true, applicantId: applicant1.applicantId, fullName: applicant1.fullName }],
    applicationDraftId: applicationDraft.id,
    bankName: null,
    branchAddress: null,
    preferredDayOfTheMonthForDirectDebits: 23,
    sortCode: sortCode ?? null,
    versionNumber,
  };
};

export const createBankValidation = (isValid: boolean, responseType: 'Error' | 'Warning' | 'Information'): ValidateBankAccountResponse => {
  return {
    isValid,
    responses: [
      {
        responseType: responseType,
        responseMessage: 'Mocked service',
      },
    ],
  };
};

export const getFmaValidateBankAccount: ValidateBankAccountResponse = {
  isValid: true,
  responses: [
    {
      responseType: 'Information',
      responseMessage: 'Mocked service',
    },
  ],
};
