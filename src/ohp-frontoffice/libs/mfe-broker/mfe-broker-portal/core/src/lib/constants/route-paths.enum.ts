export enum RoutePaths {
  CREATE_CASE = 'new',
  CASE = '/broker/case', //TODO: remove because endpoint is ID
  CREATE_CASE_INITIAL_STEP = 'initial-step',
  CREATE_CASE_ADD_APPLICANT = 'add-applicant',
  CREATE_CASE_REVIEW = 'review',
  LIST_PRODUCTS = 'products',
  CREATE_ILLUSTRATION = 'illustration',
  CREATE_ILLUSTRATION_LOAN_DETAILS = 'loan-details',
  CREATE_ILLUSTRATION_PRODUCT_SELECTION = 'product-selection',
  CREATE_ILLUSTRATION_ADVICE_FEES = 'advice-and-fees',
  CREATE_ILLUSTRATION_CONFIRM = 'confirm',
  CREATE_DIP_PROPERTY_AND_LOAN = 'property-and-loan',
  CREATE_DIP_ADDITIONAL_BORROWING = 'additional-borrowing',
  CREATE_DIP_ADVICE_FEES = 'advice-and-fees',
  CREATE_DIP_EXISTING_MORTGAGES = 'existing-mortgages',
  CREATE_DIP_PRODUCT_SELECTION = 'product-selection',
  CREATE_DIP_DEPOSIT_DETAILS = 'deposit-details',
  CREATE_DIP_SECURITY_PROPERTY = 'security-property',
  CREATE_DIP_PERSONAL_DETAILS = 'personal-details',
  CREATE_DIP_ADDRESS_HISTORY = 'address-history',
  CREATE_DIP_FINANCIAL_COMMITMENTS = 'financial-commitments',
  CREATE_DIP_HOUSEHOLD_EXPENDITURE = 'household-expenditure',
  CREATE_DIP_CURRENT_INCOME = 'current-income',
  CREATE_DIP_RETIREMENT_INCOME = 'retirement-income',
  CREATE_DIP_CREDIT_HISTORY = 'credit-history',
  CREATE_DIP_REPAYMENT_STRATEGY = 'repayment-strategy',
  CREATE_DIP_PREVIOUS_EMPLOYMENT = 'previous-employment',
  CREATE_DIP_FUTURE_CHANGES = 'future-changes',
  CREATE_DIP_BUY_TO_LET_PROPERTY_DETAILS = 'buy-let-property',
  CREATE_DIP_BUY_TO_LET_PORTFOLIO = 'buy-let-portfolio',
  CREATE_DIP_BUY_TO_LET_SPV = 'buy-let-spv',
  CREATE_DIP = 'dip',
  CONFIRM_DIP = 'submit',
  CREATE_FMA = 'fma',
  CREATE_FMA_CONTACT_DETAILS = 'contact-details',
  CREATE_FMA_CURRENT_INCOME = 'current-income',
  CREATE_FMA_RETIREMENT_INCOME = 'retirement-income',
  CREATE_FMA_SECURITY_PROPERTY = 'security-property',
  CREATE_FMA_PRODUCT_SELECTION = 'product-selection',
  CREATE_FMA_ADVICE_FEES = 'advice-and-fees',
  CREATE_FMA_AFFORDABILITY_CHECK = 'affordability-check',
  CREATE_FMA_SOLICITOR_DETAILS = 'solicitor-details',
  CREATE_FMA_VALUATION_DETAILS = 'valuation-details',
  CREATE_FMA_BANK_ACCOUNT = 'bank-account',
  CREATE_FMA_LENDER_POLICY_CHECK = 'lender-policy-check',
  CREATE_FMA_UPLOAD_STIPULATIONS = 'upload-stipulations',
  CREATE_FMA_FEE_PAYMENT = 'fee-payment',
  CREATE_FMA_CONFIRM_FMA = 'confirm-fma',
  HOME = '/',
  COMPLETE_REGISTRATION = 'broker/complete-registration',
  NOT_FOUND = 'broker/not-found',
}
