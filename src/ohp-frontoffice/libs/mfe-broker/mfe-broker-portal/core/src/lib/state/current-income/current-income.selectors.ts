import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CURRENT_INCOME_FEATURE_KEY, CurrentIncomeState } from './current-income.reducer';

export const getCurrentIncomeState = createFeatureSelector<CurrentIncomeState>(CURRENT_INCOME_FEATURE_KEY);

export const getCurrentIncomeError = createSelector(getCurrentIncomeState, (state: CurrentIncomeState) => state.error);

export const getCurrentIncome = createSelector(getCurrentIncomeState, (state: CurrentIncomeState) => state.entity);
