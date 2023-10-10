import { CaseDataResponse, DepositDetailsRequest, DepositDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const depositDetails: DepositDetailsResponse = {
  totalLoanAmount: 80000.0,
  purchaseAmount: 100000.0,
  deposits: [],
  applicationDraftId: 1,
  versionNumber: 0,
};

export const caseById: CaseDataResponse = {
  assigneeFullName: 'Victor Cuevas',
  createdByFullName: 'Victor Cuevas',
  dossierNumber: null,
  totalLoanAmount: 80000.0,
  amount: 0.0,
  assigneeId: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  caseId: 'APR34045906',
  casePurposeType: 'PURCHASE',
  contactsInformation: [
    {
      contactInformationId: 1,
      contactType: 'FIRST_TIME_BUYER',
      firstName: 'Test',
      familyName: 'McTesterson',
      dateOfBirth: '1990-08-02T00:00:00+00:00',
      customData: [],
    },
  ],
  created: '2022-08-18T11:02:50.3460071+00:00',
  createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  customData: [
    { key: 'PropertyPurpose', value: 'OWNER_OCCUPATION' },
    { key: 'AgreeToDocumentsAndTAndC', value: 'True' },
    { key: 'ConfirmApplicantsPermission', value: 'True' },
    { key: 'ConfirmStatements', value: 'True' },
    { key: 'ApplicantConsentToUseData', value: 'True' },
    { key: 'TotalLoanAmount', value: '80000.0' },
  ],
  modified: '2022-08-18T11:02:50.3460071+00:00',
  modifiedBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  ownerId: 'MockFirm',
  stage: 'DIP',
  status: 'Active',
  statusHistory: [
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'Illustration',
      status: 'Active',
      statusDate: '2022-08-18T11:02:57.9345022+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'Draft',
      status: 'Active',
      statusDate: '2022-08-18T11:02:57.2059229+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'New',
      status: 'Active',
      statusDate: '2022-08-18T11:02:50.3460071+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'DIP',
      status: 'Active',
      statusDate: '2022-08-18T11:06:24.9901073+00:00',
    },
  ],
  versionNumber: 0,
};

export const submitDepositPayload: DepositDetailsRequest = {
  deposits: [{ depositSourceType: 'SAVINGS', depositAmount: 20000 }],
  versionNumber: 0,
};

export const submitDepositResponse: DepositDetailsResponse = {
  totalLoanAmount: 80000.0,
  purchaseAmount: 100000.0,
  deposits: [{ depositAmount: 20000.0, depositSourceType: 'SAVINGS' }],
  applicationDraftId: 1,
  versionNumber: 0,
};
