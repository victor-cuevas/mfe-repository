import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROPERTY_AND_LOANS_FEATURE_KEY, PropertyAndLoansState } from './property-loan.reducer';

export const getPropertyLoanState = createFeatureSelector<PropertyAndLoansState>(PROPERTY_AND_LOANS_FEATURE_KEY);

export const getPropertyLoanError = createSelector(getPropertyLoanState, (state: PropertyAndLoansState) => state.error);

export const getPropertyLoan = createSelector(getPropertyLoanState, (state: PropertyAndLoansState) => state.entity);

export const getLoanAmount = createSelector(getPropertyLoan, entity => entity?.loanAmount);

export const getPurchasePrice = createSelector(getPropertyLoan, entity => entity?.purchasePrice);
