import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as CaseTableActions from './case-table.actions';
import { CaseTableObject } from './case-table-object';

export const CASE_TABLE_FEATURE_KEY = 'caseTable';

export interface CaseTableState extends EntityState<CaseTableObject> {
  entity?: CaseTableObject;
  loaded: boolean;
  error: string | null;
}

export const caseTableAdapter: EntityAdapter<CaseTableObject> = createEntityAdapter<CaseTableObject>();

export const caseTableInitialState: CaseTableState = caseTableAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  caseTableInitialState,
  on(CaseTableActions.initCaseTableState, state => ({ ...state, loaded: false, error: null })),
  on(CaseTableActions.loadCaseTableSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(CaseTableActions.loadCaseTableFailure, (state, { error }) => ({ ...state, error })),
);

export function caseTableReducer(state: CaseTableState | undefined, action: Action) {
  return reducer(state, action);
}
