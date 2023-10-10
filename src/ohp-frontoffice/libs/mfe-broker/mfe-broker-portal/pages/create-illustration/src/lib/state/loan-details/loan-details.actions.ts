import { createAction, props } from '@ngrx/store';
import { LoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const initLoanDetails = createAction('[Illustration Journey] Loan Details Init');

export const loadLoanDetailsSuccess = createAction(
  '[Illustration Journey] Load Loan Details data Success',
  props<{ entity: LoanDetailsResponse }>(),
);

export const loadLoanDetailsFailure = createAction('[Illustration Journey] Load Loan Details  data Failure', props<{ error: any }>());
