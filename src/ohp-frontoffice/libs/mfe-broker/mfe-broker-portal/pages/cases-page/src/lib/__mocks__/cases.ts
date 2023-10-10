import { CaseResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const mockCases: CaseResponse[] = [
  {
    assigneeId: '12345',
    amount: 0,
    caseId: 'APR09956997',
    casePurposeType: 'Purchase',
    created: '2021-11-03T15:26:34.3245968+00:00',
    createdBy: '12345',
    customData: [
      {
        key: 'PropertyPurpose',
        value: 'Owner Occupation',
      },
      {
        key: 'ConfirmStatements',
        value: '',
      },
      {
        key: 'AgreeToDocumentsAndTAndC',
        value: 'True',
      },
      {
        key: 'ApplicantConsentToUseData',
        value: '',
      },
      {
        key: 'ConfirmApplicantsPermission',
        value: 'False',
      },
    ],
    modified: '2021-11-03T15:26:34.3245968+00:00',
    modifiedBy: '12345',
    ownerId: '12345',
    statusHistory: [
      {
        status: 'Active',
        statusDate: '2021-11-03T15:26:34.3245968+00:00',
        createdBy: '12345',
        stage: 'DIP',
      },
    ],
    contactsInformation: [
      {
        contactInformationId: 1,
        contactType: 'First time buyer',
        firstName: 'Dirk',
        familyName: 'van der Broek',
        dateOfBirth: '2001-11-03T00:00:00+00:00',
        customData: [
          {
            key: 'MortgageAccountNumber',
            value: '',
          },
        ],
      },
    ],
  },
];
