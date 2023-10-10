import { createAction, props } from '@ngrx/store';
import { FeLoanInformation } from '../../models/fe-loan-information';

export const propertyLoanInit = createAction('[Property and Loan Data] Init');

export const loadPropertyLoanSuccess = createAction(
  '[DIP Journey] Load Property and Loan data Success',
  props<{ entity: FeLoanInformation }>(),
);

export const loadPropertyLoanFailure = createAction('[DIP Journey] Load Property and Loan data Failure', props<{ error: any }>());
