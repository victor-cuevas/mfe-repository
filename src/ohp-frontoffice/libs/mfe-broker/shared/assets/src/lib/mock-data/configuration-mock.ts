export const CONFIGURATION_MOCK = {
  LOAN_AMOUNT: {
    MIN: { PURCHASE: 50_000, REMORTGAGE: 50_000 },
    MAX: { PURCHASE: 1_000_000, REMORTGAGE: 1_000_000 },
  },
  MIN_PURCHASE_PRICE: 75_000,
  MAX_PURCHASE_PRICE: 2_000_000,
  LTV: { MIN: 0, MAX: 95 },
  AGE: {
    MAX: { RETIREMENT: 75 },
    COLLECT_CHILDREN_AGE: false,
    END_OF_TERM_AGE: 80,
  },
  CASE_DURATION_ASSUMED: 120, // Days
  CASE_DURATION_EXTENSION: 60, // Days
  APPEAL_THRESHOLD: { DEFAULT: 1.3, MIN: 1, MAX: '?' },
  REQUEST_ENDING_DATE: false,
  CONDITIONS: {
    PURCHASE: {
      CAPITAL_BASED_BORROWING: 'Applicant(s) do not have any CCJ’s or defaults in the last 24 months (unsecured) or 36 months (secured)',
      NO_DEBT_CONSOLIDATION: 'Applicant(s) do not have any missed payments in the last 12 months (unsecured) or 36 months (secured)',
      NO_DEFAULT: 'The borrowing will be on a capital and interest basis',
      NO_MISSED_PAYMENTS: 'The borrowing will not be for debt consolidation',
      PURCHASE: 'Above conditions apply to purchase cases',
    },
    REMORTGAGE: {
      CAPITAL_BASED_BORROWING: 'Applicant(s) do not have any CCJ’s or defaults in the last 24 months (unsecured) or 36 months (secured)',
      NO_DEBT_CONSOLIDATION: 'Applicant(s) do not have any missed payments in the last 12 months (unsecured) or 36 months (secured)',
      NO_DEFAULT: 'The borrowing will be on a capital and interest basis',
      NO_MISSED_PAYMENTS: 'The borrowing will not be for debt consolidation',
      REMORTGAGE: 'Above conditions apply to remortgage cases',
    },
    DATA_CONSENT: 'All applicants consent to use of data',
    TERMS_AND_CONDITIONS: 'I confirm that I have read the documents and agree to T&C',
    STATEMENTS_CONFIRMATION: 'I confirm that the above statements apply',
    PERMISSIONS_CONFIRMATION: "I confirm that I have the applicant's permission",
  },
  MIN_YEARS_UNTIL_RETIREMENT: 10,
  MAX_RETIREMENT_AGE: 70,
  HAS_AUTO_LOGOUT: true,
  TIME_AUTO_LOGOUT: 900000,
  TERMS_CONDITIONS_URL: 'https://www.project.com',
  USE_DATA_DOC_URL: 'https://www.project.com',
  PROBATION_PERIOD: 12, // months
  PARAMS: {
    clientDisplayName: 'April Mortgages',
  },
  APPS: {
    appshell: {
      home: { meta: { title: '{{ clientDisplayName }}' } },
    },
    broker: {
      home: {
        meta: {
          prefix: '{{ clientDisplayName }}',
          title: 'Broker Portal',
          description: 'Portal to manage and key cases for a specific firm.',
        },
      },
      completeregistration: { meta: { prefix: 'Broker portal', title: 'Complete registration' } },
      notfound: { meta: { prefix: 'Broker portal', title: 'Not found' } },
      firmidCases: { meta: { prefix: 'Broker portal', title: 'Case management' } },
      firmidCasesNew: { meta: { prefix: 'Broker portal', title: 'New case' } },
      firmidCasesNewInitialstep: { meta: { prefix: 'Broker portal', title: 'New case - Initial step' } },
      firmidCasesNewAddapplicant: { meta: { prefix: 'Broker portal', title: 'New case - Add applicant' } },
      firmidCasesNewReview: { meta: { prefix: 'Broker portal', title: 'New case - Review' } },
      firmidCasesCaseid: { meta: { prefix: '<caseId>', title: 'Case summary' } },
      firmidCasesCaseidDip: { meta: { prefix: '<caseId>', title: 'DIP' } },
      firmidCasesCaseidDipPropertyandloan: { meta: { prefix: '<caseId>', title: 'DIP - Property and Loans' } },
      firmidCasesCaseidDipSecurityproperty: { meta: { prefix: '<caseId>', title: 'DIP - Security property' } },
      firmidCasesCaseidDipExistingmortgages: { meta: { prefix: '<caseId>', title: 'DIP - Existing mortgages' } },
      firmidCasesCaseidDipAdditionalborrowing: { meta: { prefix: '<caseId>', title: 'DIP - Additional borrowing' } },
      firmidCasesCaseidDipDepositdetails: { meta: { prefix: '<caseId>', title: 'DIP - Deposit details' } },
      firmidCasesCaseidDipAdviceandfees: { meta: { prefix: '<caseId>', title: 'DIP - Advice and fees' } },
      firmidCasesCaseidDipProductselection: { meta: { prefix: '<caseId>', title: 'DIP - Product selection' } },
      firmidCasesCaseidDipPersonaldetails: { meta: { prefix: '<caseId>', title: 'DIP - Personal details' } },
      firmidCasesCaseidDipAddresshistory: { meta: { prefix: '<caseId>', title: 'DIP - Address history' } },
      firmidCasesCaseidDipRepaymentstrategy: { meta: { prefix: '<caseId>', title: 'DIP - Repayment strategy' } },
      firmidCasesCaseidDipFinancialcommitments: { meta: { prefix: '<caseId>', title: 'DIP - Financial commitments' } },
      firmidCasesCaseidDipHouseholdexpenditure: { meta: { prefix: '<caseId>', title: 'DIP - Household expenditure' } },
      firmidCasesCaseidDipCurrentincome: { meta: { prefix: '<caseId>', title: 'DIP - Current income' } },
      firmidCasesCaseidDipPreviousemployment: { meta: { prefix: '<caseId>', title: 'DIP - Previous employment' } },
      firmidCasesCaseidDipFuturechanges: { meta: { prefix: '<caseId>', title: 'DIP - Future changes' } },
      firmidCasesCaseidDipRetirementincome: { meta: { prefix: '<caseId>', title: 'DIP - Retirement income' } },
      firmidCasesCaseidDipCredithistory: { meta: { prefix: '<caseId>', title: 'DIP - Credit history' } },
      firmidCasesCaseidDipsubmit: { meta: { prefix: '<caseId>', title: 'DIP - Submit' } },
      firmidCasesCaseidDipDipdocument: { meta: { prefix: '<caseId>', title: 'DIP - Document' } },
      firmidCasesCaseidDipBuyletproperty: { meta: { prefix: '<caseId>', title: 'DIP - Buy to let property' } },
      firmidCasesCaseidDipBuyletportfolio: { meta: { prefix: '<caseId>', title: 'DIP - Buy to let portfolio' } },
      firmidCasesCaseidDipBuyletspv: { meta: { prefix: '<caseId>', title: 'DIP - Buy to let spv' } },
      firmidCasesCaseidIllustrationApplicationdraftidloanloanidLoandetails: {
        meta: { prefix: '<caseId>', title: 'Illustration - Loan details' },
      },
      firmidCasesCaseidIllustrationApplicationdraftidloanloanidProductselection: {
        meta: { prefix: '<caseId>', title: 'Illustration - Product selection' },
      },
      firmidCasesCaseidIllustrationApplicationdraftidloanloanidAdviceandfees: {
        meta: { prefix: '<caseId>', title: 'Illustration - Advice and fees' },
      },
      firmidCasesCaseidIllustrationApplicationdraftidloanloanidConfirm: { meta: { prefix: '<caseId>', title: 'Illustration - Confirm' } },
      firmidCasesCaseidFmaContactdetails: { meta: { prefix: '<caseId>', title: 'FMA - Contact details' } },
      firmidCasesCaseidFmaCurrentincome: { meta: { prefix: '<caseId>', title: 'FMA - Current income' } },
      firmidCasesCaseidFmaRetirementincome: { meta: { prefix: '<caseId>', title: 'FMA - Retirement income' } },
      firmidCasesCaseidFmaSecurityproperty: { meta: { prefix: '<caseId>', title: 'FMA - Security property' } },
      firmidCasesCaseidFmaProductselection: { meta: { prefix: '<caseId>', title: 'FMA - Product selection' } },
      firmidCasesCaseidFmaAdvicefees: { meta: { prefix: '<caseId>', title: 'FMA - Advice and fees' } },
      firmidCasesCaseidFmaAffordabilitycheck: { meta: { prefix: '<caseId>', title: 'FMA - Affordability check' } },
      firmidCasesCaseidFmaSolicitordetails: { meta: { prefix: '<caseId>', title: 'FMA - Solicitor details' } },
      firmidCasesCaseidFmaValuationdetails: { meta: { prefix: '<caseId>', title: 'FMA - Valuation details' } },
      firmidCasesCaseidFmaBankaccount: { meta: { prefix: '<caseId>', title: 'FMA - Bank account' } },
      firmidCasesCaseidFmaLenderpolicycheck: { meta: { prefix: '<caseId>', title: 'FMA - Lender policy check' } },
      firmidCasesCaseidFmaUploadstipulations: { meta: { prefix: '<caseId>', title: 'FMA - Upload stipulations' } },
      firmidCasesCaseidFmaFeepayment: { meta: { prefix: '<caseId>', title: 'FMA - Fee payment' } },
      firmidCasesCaseidFmaConfirmfma: { meta: { prefix: '<caseId>', title: 'FMA - Confirm' } },
      firmidProducts: { meta: { prefix: 'Broker portal', title: 'Products' } },
      firmidProfile: { meta: { prefix: 'Broker portal', title: 'Profile' } },
      firmidProfileEdit: { meta: { prefix: 'Broker portal', title: 'Profile - Edit' } },
      firmidProfileAccount: { meta: { prefix: 'Broker portal', title: 'Profile - Account' } },
      firmidProfileAssistants: { meta: { prefix: 'Broker portal', title: 'Profile - Assistants' } },
      firmidProfileLinkedadvisors: { meta: { prefix: 'Broker portal', title: 'Profile - Linked advisors' } },
      firmidProfileTradingaddresses: { meta: { prefix: 'Broker portal', title: 'Profile - Trading addresses' } },
    },
    panel: {
      home: {
        meta: {
          prefix: '{{ clientDisplayName }}',
          title: 'Broker Panel',
          description: 'Portal to manage firms and users of the Broker Portal.',
        },
      },
      notfound: { meta: { prefix: 'Broker panel', title: 'Not found' } },
      dashboard: { meta: { prefix: 'Broker panel', title: 'Dashboard' } },
      firms: { meta: { prefix: 'Broker panel', title: 'Firms' } },
      firmsNew: { meta: { prefix: 'Firms', title: 'New' } },
      firmsId: { meta: { prefix: 'Firms', title: '<id>' } },
      firmsIdDetails: { meta: { prefix: 'Firm <id>', title: 'Details' } },
      firmsIdUsersNew: { meta: { prefix: 'Firm <id>', title: 'New user' } },
      firmsIdUsersUserid: { meta: { title: 'User' } },
      firmsIdUsersUseridEdit: { meta: { prefix: 'User', title: 'Edit' } },
      firmsIdUsersUseridAccount: { meta: { prefix: 'User', title: 'Account' } },
      firmsIdUsersUseridAssistants: { meta: { prefix: 'User', title: 'Assistants' } },
      firmsIdUsersUseridLinkedadvisors: { meta: { prefix: 'User', title: 'Linked advisors' } },
      firmsIdUsersUseridTradingaddresses: { meta: { prefix: 'User', title: 'Trading addresses' } },
      submissionroutes: { meta: { prefix: 'Broker panel', title: 'Submission routes' } },
      submissionroutesNew: { meta: { prefix: 'Submission routes', title: 'New' } },
      submissionroutesId: { meta: { prefix: 'Submission route', title: 'Update' } },
      configuration: { prefix: 'Broker panel', meta: { title: 'Configuration' } },
      configurationProcurationfee: { meta: { prefix: 'Configuration', title: 'Procuration fee' } },
      configurationProcurationfeeNewlending: { meta: { prefix: 'Configuration', title: 'Procuration fee - New lending' } },
      configurationProcurationfeeRemortgage: { meta: { prefix: 'Configuration', title: 'Procuration fee - Remortgage' } },
      configurationGlobalsettings: { meta: { prefix: 'Configuration', title: 'Global settings' } },
      profile: { meta: { prefix: 'Broker panel', title: 'Profile' } },
      profileEdit: { meta: { prefix: 'Profile', title: 'Edit' } },
      profileAccount: { meta: { prefix: 'Profile', title: 'Account' } },
      profileAssistants: { meta: { prefix: 'Profile', title: 'Assistants' } },
      profileLinkedadvisors: { meta: { prefix: 'Profile', title: 'Linked advisors' } },
      profileTradingaddresses: { meta: { prefix: 'Profile', title: 'Trading addresses' } },
      lender: { meta: { prefix: 'Broker panel', title: 'Lender' } },
      lenderLenderdetails: { meta: { prefix: 'Lender', title: 'Lender details' } },
      lenderBranches: { meta: { prefix: 'Lender', title: 'Branches' } },
      lenderLenderusers: { meta: { prefix: 'Lender', title: 'Lender users' } },
      lenderLenderusersNew: { meta: { prefix: 'Lender users', title: 'New' } },
      lenderLenderusersId: { meta: { title: 'Lender user' } },
      lenderLenderusersIdEdit: { meta: { prefix: 'Lender user', title: 'Edit' } },
      lenderLenderusersIdAccount: { meta: { prefix: 'Lender user', title: 'Account' } },
    },
  },
};
