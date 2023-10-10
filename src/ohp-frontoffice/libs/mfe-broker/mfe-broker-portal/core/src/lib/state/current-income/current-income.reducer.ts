import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as CurrentIncomeActions from './current-income.actions';
import { CurrentIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const CURRENT_INCOME_FEATURE_KEY = 'currentIncome';

export interface CurrentIncomeState extends EntityState<CurrentIncomeResponse> {
  entity?: CurrentIncomeResponse;
  loaded: boolean;
  error: string | null;
}

export const currentIncomeAdapter: EntityAdapter<CurrentIncomeResponse> = createEntityAdapter<CurrentIncomeResponse>();

export const currentIncomeInitialState: CurrentIncomeState = currentIncomeAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  currentIncomeInitialState,
  on(CurrentIncomeActions.initCurrentIncome, state => ({ ...state, loaded: false, error: null })),
  on(CurrentIncomeActions.loadCurrentIncomeSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(CurrentIncomeActions.loadCurrentIncomeFailure, (state, { error }) => ({ ...state, error })),
);

export function currentIncomeReducer(state: CurrentIncomeState | undefined, action: Action) {
  return reducer(state, action);
}
