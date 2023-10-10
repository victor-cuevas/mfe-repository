import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LOAN_DETAILS_FEATURE_KEY, LoanDetailsState } from './loan-details.reducer';

export const getLoanDetailsState = createFeatureSelector<LoanDetailsState>(LOAN_DETAILS_FEATURE_KEY);

export const getLoanDetailsLoaded = createSelector(getLoanDetailsState, (state: LoanDetailsState) => state.loaded);

export const getLoanDetailsError = createSelector(getLoanDetailsState, (state: LoanDetailsState) => state.error);

export const getLoanDetails = createSelector(getLoanDetailsState, (state: LoanDetailsState) => state.entity);
