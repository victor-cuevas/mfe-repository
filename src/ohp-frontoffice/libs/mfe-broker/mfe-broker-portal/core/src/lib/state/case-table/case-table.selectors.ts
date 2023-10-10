import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CASE_TABLE_FEATURE_KEY, CaseTableState } from './case-table.reducer';

export const getCaseTableState = createFeatureSelector<CaseTableState>(CASE_TABLE_FEATURE_KEY);

export const getCaseTableError = createSelector(getCaseTableState, (state: CaseTableState) => state.error);

export const getCaseTable = createSelector(getCaseTableState, (state: CaseTableState) => state.entity);
