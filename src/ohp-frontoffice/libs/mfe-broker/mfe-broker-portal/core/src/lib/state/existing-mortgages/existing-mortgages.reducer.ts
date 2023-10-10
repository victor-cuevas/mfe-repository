import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as AdditionalBorrowingActions from './existing-mortgages.actions';
import { ExistingMortgageResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const EXISTING_MORTGAGES_FEATURE_KEY = 'existingMortgages';

export interface ExistingMortgagesState extends EntityState<ExistingMortgageResponse> {
  entity?: ExistingMortgageResponse;
  loaded: boolean;
  error: string | null;
}

export const existingMortgagesAdapter: EntityAdapter<ExistingMortgageResponse> = createEntityAdapter<ExistingMortgageResponse>();

export const existingMortgagesInitialState: ExistingMortgagesState = existingMortgagesAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  existingMortgagesInitialState,
  on(AdditionalBorrowingActions.initExistingMortgages, state => ({ ...state, loaded: false, error: null })),
  on(AdditionalBorrowingActions.loadExistingMortgagesSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(AdditionalBorrowingActions.loadExistingMortgagesFailure, (state, { error }) => ({ ...state, error })),
);

export function existingMortgagesReducer(state: ExistingMortgagesState | undefined, action: Action) {
  return reducer(state, action);
}
