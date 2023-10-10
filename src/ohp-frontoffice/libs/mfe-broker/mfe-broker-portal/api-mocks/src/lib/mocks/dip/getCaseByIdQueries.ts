import {
  CaseDataResponse,
  DipSummaryResponse,
  FMASummaryResponse,
  IllustrationSummaryResponse,
  CaseStage,
  CaseStatusEnum,
  DraftStage,
  DraftStatus,
  LoanStage,
  LoanStatus,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const getCaseById: CaseDataResponse = {
  assigneeFullName: 'Victor Cuevas',
  createdByFullName: 'Victor Cuevas',
  dossierNumber: null,
  totalLoanAmount: 80000.0,
  amount: 0.0,
  assigneeId: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  caseId: 'APR00000001',
  casePurposeType: 'PURCHASE',
  contactsInformation: [
    {
      contactInformationId: 1,
      contactType: 'FIRST_TIME_BUYER',
      firstName: 'Test',
      familyName: 'McTesterson',
      dateOfBirth: '1994-03-01T00:00:00+00:00',
      customData: [],
    },
  ],
  created: '2022-08-17T14:54:19.9463636+00:00',
  createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  customData: [
    {
      key: 'PropertyPurpose',
      value: 'OWNER_OCCUPATION',
    },
    {
      key: 'AgreeToDocumentsAndTAndC',
      value: 'True',
    },
    {
      key: 'ConfirmApplicantsPermission',
      value: 'True',
    },
    {
      key: 'ConfirmStatements',
      value: 'True',
    },
    {
      key: 'ApplicantConsentToUseData',
      value: 'True',
    },
    {
      key: 'TotalLoanAmount',
      value: '80000',
    },
  ],
  modified: '2022-08-17T14:54:19.9463636+00:00',
  modifiedBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
  ownerId: 'MockFirm',
  stage: 'DIP',
  status: 'Active',
  statusHistory: [
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'Illustration',
      status: 'Active',
      statusDate: '2022-08-17T14:54:31.6152713+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'Draft',
      status: 'Active',
      statusDate: '2022-08-17T14:54:30.7671841+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'New',
      status: 'Active',
      statusDate: '2022-08-17T14:54:19.9463636+00:00',
    },
    {
      createdBy: 'ed81ebf9-23e6-4ead-8381-5e6a5c36ed14',
      stage: 'DIP',
      status: 'Active',
      statusDate: '2022-08-17T14:56:11.3625491+00:00',
    },
  ],
  versionNumber: 6,
};

export const illustrationSummary: IllustrationSummaryResponse = {
  applicationDraftId: 1,
  illustrationSummaries: [
    {
      loanId: 1,
      stage: 'ILLUSTRATION',
      status: 'COMPLETED',
      totalLoanAmount: 80000.0,
      purchasePrice: 100000.0,
      date: '2022-08-17T14:54:31.1831993',
      loanParts: [
        {
          loanAmount: 80000.0,
          productCode: 'FIXED75LTV12YEARS',
          productName: 'April Mortgages Standard',
          term: '180',
          type: 'ANNUITY',
        },
      ],
    },
  ],
};

export const fmaSummary: FMASummaryResponse = {};

export const dipSummary: DipSummaryResponse = {
  applicants: [
    {
      employmentStatus: null,
      netMonthlyIncome: null,
      applicantId: 1,
      fullName: 'Test McTesterson',
    },
  ],
  expirationDateTime: '2022-09-16T14:56:11.3625491',
  loan: {
    loanId: 1,
    loanPartSummary: [
      {
        loanAmount: 80000.0,
        productCode: 'FIXED75LTV12YEARS',
        productName: 'April Mortgages Standard',
        term: '180',
        type: 'ANNUITY',
      },
    ],
    rejectionReasons: [],
    stage: 'DIP',
    status: 'IN_PROGRESS',
  },
  stage: 'DIP',
  status: 'IN_PROGRESS',
  applicationDraftId: 1,
  versionNumber: 0,
};

interface CaseOptions {
  caseStages: CaseStage;
  caseStatus: CaseStatusEnum;
}

const caseDefaultOptions: CaseOptions = {
  caseStages: CaseStage.Dip,
  caseStatus: CaseStatusEnum.Active,
};

export const createCaseResponse = (options?: Partial<CaseOptions>) => {
  const opts = Object.assign({}, caseDefaultOptions, options);

  return {
    ...getCaseById,
    stage: opts.caseStages,
    status: opts.caseStatus,
  };
};

interface dipSummaryOptions {
  draftStage: DraftStage;
  draftStatus: DraftStatus;
  loanStage: LoanStage;
  loanStatus: LoanStatus;
}

const createDipSummaryDefaultOptions: dipSummaryOptions = {
  draftStage: DraftStage.Dip,
  draftStatus: DraftStatus.InProgress,
  loanStage: LoanStage.Dip,
  loanStatus: LoanStatus.InProgress,
};

export const createDipSummaryResponse = (options?: Partial<dipSummaryOptions>) => {
  const opts = Object.assign({}, createDipSummaryDefaultOptions, options);

  return {
    ...dipSummary,
    loan: {
      ...dipSummary.loan,
      stage: opts.loanStage,
      status: opts.loanStatus,
    },
    stage: opts.draftStage,
    status: opts.draftStatus,
  };
};
