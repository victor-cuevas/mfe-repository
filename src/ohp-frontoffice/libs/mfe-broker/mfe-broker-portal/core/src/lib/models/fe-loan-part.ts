import { LoanPart } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeLoanPart extends LoanPart {
  feMortgageTerm?: {
    years?: number | null;
    months?: number | null;
  };
}
