import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as PropertyLoansActions from './property-loan.actions';
import { FeLoanInformation } from '../../models/fe-loan-information';

export const PROPERTY_AND_LOANS_FEATURE_KEY = 'propertyLoan';

export interface PropertyAndLoansState extends EntityState<FeLoanInformation> {
  entity?: FeLoanInformation;
  loaded: boolean;
  error: string | null;
}

export const propertyAndLoansAdapter: EntityAdapter<FeLoanInformation> = createEntityAdapter<FeLoanInformation>();

export const propertyAndLoanInitialState: PropertyAndLoansState = propertyAndLoansAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  propertyAndLoanInitialState,
  on(PropertyLoansActions.propertyLoanInit, state => ({ ...state, loaded: false, error: null })),
  on(PropertyLoansActions.loadPropertyLoanSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(PropertyLoansActions.loadPropertyLoanFailure, (state, { error }) => ({ ...state, error })),
);

export function propertyLoanReducer(state: PropertyAndLoansState | undefined, action: Action) {
  return reducer(state, action);
}
