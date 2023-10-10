export enum RoutePaths {
  LIST_SUBMISSION_ROUTES = '/panel/submission-routes',
  CREATE_SUBMISSION_ROUTE = '/panel/submission-routes/new',
  EDIT_SUBMISSION_ROUTE = '/panel/submission-routes/:id',
  LIST_FIRMS = '/panel/firms',
  LIST_INTERMEDIARIES = '/panel/firms/:id',
  CREATE_INTERMEDIARY = '/panel/firms/:id/users/new',
  FIRM_DETAILS = '/panel/firms/:id/details',
  CREATE_FIRM = '/panel/firms/new',
  DASHBOARD_ROUTE = '/panel/dashboard',
  CONFIGURATION_ROUTE = '/panel/configuration',
  LENDER_ROUTE = '/panel/lender',
  CREATE_LENDER_USER = '/panel/lender/lender-users/new',
  EDIT_PROFILE_LENDER_USER = '/panel/lender/lender-users/:id',
  CONFIGURATION_PROCURATION_FEE_NEWLENDING_ROUTE = '/panel/configuration/procuration-fee/newlending',
  CONFIGURATION_PROCURATION_FEE_REMORTGAGE_ROUTE = '/panel/configuration/procuration-fee/remortgage',
  CONFIGURATION_GLOBAL_SETTINGS_ROUTE = '/panel/configuration/global-settings',
  CASES_BY_FIRM = '/portal/cases/firm',
  HOME = '/',
  EDIT_PROFILE = '/panel/firms/:id/users/:userId',
  EDIT_LENDER_USER = '/panel/lender/lender-users/:userId',
  PROFILE_PROFILE = './edit',
  PROFILE_ACCOUNT = './account',
  PROFILE_ASSISTANTS = './assistants',
  PROFILE_LINKED_ADVISORS = './linked-advisors',
  PROFILE_TRADING_ADDRESS = './trading-addresses',
  LENDER_DETAILS = './lender-details',
  LENDER_BRANCHES = './branches',
  LENDER_USERS = './lender-users',
  COMPLETE_REGISTRATION = 'broker/complete-registration',
}
