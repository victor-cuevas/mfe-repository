import { createAction, props } from '@ngrx/store';

export const init = createAction('[PanelUser Page] Init');

export const loadPanelUserSuccess = createAction('[PanelUser/API] Load PanelUser Success', props<{ entity: any }>());

export const loadPanelUserFailure = createAction('[PanelUser/API] Load PanelUser Failure', props<{ error: any }>());
