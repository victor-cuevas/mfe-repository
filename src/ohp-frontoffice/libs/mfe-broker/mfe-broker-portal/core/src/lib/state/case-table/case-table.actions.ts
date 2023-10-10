import { createAction, props } from '@ngrx/store';
import { CaseTableObject } from './case-table-object';

export const initCaseTableState = createAction('[Case table] Init Case Table');

export const loadCaseTableSuccess = createAction('[Case table] Load Case table data Success', props<{ entity: CaseTableObject }>());

export const loadCaseTableFailure = createAction('[Case table] Load case table data Failure', props<{ error: any }>());
