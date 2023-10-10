import { LoanDetailsResponse, PropertyAndLoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeLoanInformation extends PropertyAndLoanDetailsResponse, LoanDetailsResponse {}
