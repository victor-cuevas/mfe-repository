import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EXISTING_MORTGAGES_FEATURE_KEY, ExistingMortgagesState } from './existing-mortgages.reducer';

export const getExistingMortgagesState = createFeatureSelector<ExistingMortgagesState>(EXISTING_MORTGAGES_FEATURE_KEY);

export const getExistingMortgagesError = createSelector(getExistingMortgagesState, (state: ExistingMortgagesState) => state.error);

export const getExistingMortgages = createSelector(getExistingMortgagesState, (state: ExistingMortgagesState) => state.entity);
