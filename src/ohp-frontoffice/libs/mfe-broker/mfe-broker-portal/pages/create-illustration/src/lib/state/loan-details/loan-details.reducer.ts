import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as LoanDetailsActions from './loan-details.actions';
import { LoanDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const LOAN_DETAILS_FEATURE_KEY = 'illustrationPropertyLoan';

export interface LoanDetailsState extends EntityState<LoanDetailsResponse> {
  entity?: LoanDetailsResponse;
  loaded: boolean;
  error: string | null;
}

export const loanDetailsAdapter: EntityAdapter<LoanDetailsResponse> = createEntityAdapter<LoanDetailsResponse>();

export const initialLoanDetailsState: LoanDetailsState = loanDetailsAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  initialLoanDetailsState,
  on(LoanDetailsActions.initLoanDetails, state => ({ ...state, loaded: false, error: null })),
  on(LoanDetailsActions.loadLoanDetailsSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(LoanDetailsActions.loadLoanDetailsFailure, (state, { error }) => ({ ...state, error })),
);

export function loanDetailsReducer(state: LoanDetailsState | undefined, action: Action) {
  return reducer(state, action);
}
